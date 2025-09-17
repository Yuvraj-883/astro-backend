// ../src/config/database.js

import mongoose from 'mongoose';
import { config } from './environment.js';

/**
 * MongoDB Database Configuration
 * Handles connection to MongoDB with proper error handling and retry logic
 */

let isConnected = false;

const connectDB = async () => {
  // Prevent multiple connections
  console.log('connecting to database...');
  if (isConnected) {
    console.log('📊 Already connected to MongoDB');
    return;
  }

  try {
    // MongoDB connection options for production-ready setup
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maximum number of connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      retryWrites: true,
      w: 'majority'
    };

    // Use DATABASE_URL from environment or fallback to MONGODB_URI or default to local MongoDB
    const mongoURI = config.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MongoDB connection string not found in environment variables');
    }
    
    console.log('🔄 Connecting to MongoDB...');
    const conn = await mongoose.connect(mongoURI, options);
    
    isConnected = true;
    console.log(`📊 MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database Name: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      isConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('📊 MongoDB disconnected');
      isConnected = false;
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('📊 MongoDB reconnected');
      isConnected = true;
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('📊 MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('❌ Error during MongoDB disconnection:', err);
        process.exit(1);
      }
    });
    
    return conn;
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    isConnected = false;
    
    // Retry connection after 5 seconds
    setTimeout(() => {
      console.log('🔄 Retrying MongoDB connection...');
      connectDB();
    }, 5000);
    
    throw error;
  }
};

// Health check for database connection
const checkDBHealth = async () => {
  try {
    if (!isConnected) {
      throw new Error('Database not connected');
    }
    
    // Simple ping to check if database is responsive
    await mongoose.connection.db.admin().ping();
    return {
      status: 'healthy',
      connected: isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      connected: false,
      error: error.message
    };
  }
};

// Get database connection stats
const getDBStats = async () => {
  try {
    if (!isConnected) {
      throw new Error('Database not connected');
    }
    
    const stats = await mongoose.connection.db.stats();
    return {
      collections: stats.collections,
      dataSize: stats.dataSize,
      indexSize: stats.indexSize,
      storageSize: stats.storageSize,
      documents: stats.objects
    };
  } catch (error) {
    throw new Error(`Failed to get database stats: ${error.message}`);
  }
};

// Close database connection
const closeDB = async () => {
  try {
    if (isConnected) {
      await mongoose.connection.close();
      isConnected = false;
      console.log('📊 MongoDB connection closed');
    }
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
    throw error;
  }
};

export {
  connectDB,
  checkDBHealth,
  getDBStats,
  closeDB,
  isConnected
};

export default connectDB;
