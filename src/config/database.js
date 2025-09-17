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
  console.log("Connecting to database...");
  if (isConnected) {
    console.log('📊 Already connected to MongoDB');
    return;
  }

  try {
    // Set Mongoose global configuration for development
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('bufferCommands', false);
    }

    // MongoDB driver connection options optimized for deployment
    const connectionOptions = {
      maxPoolSize: process.env.NODE_ENV === 'production' ? 5 : 10,
      serverSelectionTimeoutMS: 60000, // Increased for deployment
      socketTimeoutMS: 75000, // Increased for deployment  
      connectTimeoutMS: 60000, // Increased for deployment
      retryWrites: true,
      w: 'majority',
      maxIdleTimeMS: 60000,
      heartbeatFrequencyMS: 30000, // Increased for deployment
      // Add deployment-specific options
      appName: 'astro-backend',
      compressors: 'zlib',
      zlibCompressionLevel: 6,
    };

    // Get MongoDB URI and ensure it has a database name
    let mongoURI = config.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MongoDB connection string not found in environment variables');
    }
    
    // Ensure database name is included for Atlas connections
    if (mongoURI.includes('mongodb+srv://') && !mongoURI.includes('?')) {
      mongoURI += '/astro-backend?retryWrites=true&w=majority';
    } else if (mongoURI.includes('mongodb+srv://') && !mongoURI.includes('/astro-backend')) {
      mongoURI = mongoURI.replace('/?', '/astro-backend?');
    }
    
    console.log('🔄 Connecting to MongoDB...');
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Connection type: ${mongoURI.includes('mongodb+srv://') ? 'Atlas Cloud' : 'Local/Self-hosted'}`);
    
    const conn = await mongoose.connect(mongoURI, connectionOptions);
    
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
    console.error('🔍 Connection Details:');
    console.error(`   - Environment: ${process.env.NODE_ENV || 'development'}`);
    console.error(`   - URI Type: ${config.MONGODB_URI?.includes('mongodb+srv://') ? 'Atlas Cloud' : 'Local/Self-hosted'}`);
    console.error(`   - URI Format: ${config.MONGODB_URI ? 'Present' : 'Missing'}`);
    
    // Log specific error types for debugging deployment issues
    if (error.name === 'MongoServerSelectionError') {
      console.error('🌐 Server Selection Error - This often indicates:');
      console.error('   - Network connectivity issues');
      console.error('   - Incorrect connection string');
      console.error('   - IP not whitelisted in MongoDB Atlas');
      console.error('   - Cluster paused or deleted');
    } else if (error.name === 'MongoParseError') {
      console.error('🔧 Connection String Parse Error - Check:');
      console.error('   - Connection string format');
      console.error('   - Username/password encoding');
      console.error('   - Database name inclusion');
    } else if (error.name === 'MongoNetworkTimeoutError') {
      console.error('⏱️  Network Timeout Error - This indicates:');
      console.error('   - Slow network connection');
      console.error('   - Firewall blocking connection');
      console.error('   - MongoDB cluster overloaded');
    }
    
    isConnected = false;
    
    // Don't retry if it's a configuration error
    if (error.message.includes('not found in environment') || 
        error.message.includes('Invalid connection string') ||
        error.name === 'MongoParseError') {
      throw error;
    }
    
    // Only retry in development, not in production deployment
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔄 Will retry MongoDB connection in 5 seconds...');
      setTimeout(() => {
        connectDB().catch(err => {
          console.error('❌ Retry failed:', err.message);
        });
      }, 5000);
    }
    
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

// Ensure connection is active before performing operations
const ensureConnection = async () => {
  if (!isConnected || mongoose.connection.readyState !== 1) {
    console.log('🔄 Reconnecting to MongoDB...');
    await connectDB();
  }
  return true;
};

// Middleware to check database connection
const dbHealthMiddleware = async (req, res, next) => {
  try {
    await ensureConnection();
    next();
  } catch (error) {
    console.error('❌ Database connection check failed:', error.message);
    return res.status(503).json({
      success: false,
      error: 'Database connection unavailable',
      message: 'Please try again in a moment'
    });
  }
};

// Get connection status
const getConnectionStatus = () => {
  return {
    isConnected,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    name: mongoose.connection.name,
    states: {
      0: 'disconnected',
      1: 'connected', 
      2: 'connecting',
      3: 'disconnecting'
    }[mongoose.connection.readyState]
  };
};

export {
  connectDB,
  checkDBHealth,
  getDBStats,
  closeDB,
  isConnected,
  ensureConnection,
  dbHealthMiddleware,
  getConnectionStatus
};

export default connectDB;
