#!/usr/bin/env node

/**
 * MongoDB Connection Test Script for Deployment Debugging
 * Use this to test connection issues on different environments
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const testConnection = async () => {
  console.log('🧪 MongoDB Connection Test Starting...');
  console.log('=' .repeat(50));
  
  // Environment info
  console.log('📊 Environment Information:');
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Platform: ${process.platform}`);
  console.log(`   Node Version: ${process.version}`);
  console.log('');
  
  // Connection string analysis
  const mongoURI = process.env.DATABASE_URL || process.env.MONGODB_URI;
  console.log('🔗 Connection Analysis:');
  console.log(`   URI Present: ${mongoURI ? '✅ Yes' : '❌ No'}`);
  
  if (mongoURI) {
    console.log(`   URI Type: ${mongoURI.includes('mongodb+srv://') ? '☁️  Atlas Cloud' : '🏠 Local/Self-hosted'}`);
    console.log(`   Has Database Name: ${mongoURI.includes('/astro-backend') ? '✅ Yes' : '❌ No'}`);
    console.log(`   Has Options: ${mongoURI.includes('?') ? '✅ Yes' : '❌ No'}`);
    
    // Mask credentials for logging
    const maskedURI = mongoURI.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@');
    console.log(`   Masked URI: ${maskedURI}`);
  }
  console.log('');
  
  if (!mongoURI) {
    console.error('❌ No MongoDB URI found in environment variables');
    console.error('💡 Please set DATABASE_URL or MONGODB_URI');
    process.exit(1);
  }
  
  try {
    console.log('🔄 Testing Connection...');
    
    // Connection options for testing
    const options = {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10000, // 10 seconds for quick test
      socketTimeoutMS: 15000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      w: 'majority',
      appName: 'connection-test',
    };
    
    const conn = await mongoose.connect(mongoURI, options);
    
    console.log('✅ Connection Successful!');
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Ready State: ${conn.connection.readyState}`);
    console.log('');
    
    // Test database operations
    console.log('🧪 Testing Database Operations...');
    
    // Ping test
    await conn.connection.db.admin().ping();
    console.log('✅ Database Ping: Success');
    
    // List collections test
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`✅ Collections Found: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('   Collections:', collections.map(c => c.name).join(', '));
    }
    
    // Close connection
    await mongoose.connection.close();
    console.log('✅ Connection Closed Successfully');
    
    console.log('');
    console.log('🎉 All Tests Passed! MongoDB is working correctly.');
    
  } catch (error) {
    console.error('❌ Connection Test Failed:', error.message);
    console.error('');
    console.error('🔍 Error Details:');
    console.error(`   Error Type: ${error.name}`);
    console.error(`   Error Code: ${error.code || 'N/A'}`);
    
    // Specific error guidance
    if (error.name === 'MongoServerSelectionError') {
      console.error('');
      console.error('💡 Server Selection Error Solutions:');
      console.error('   1. Check IP whitelist in MongoDB Atlas');
      console.error('   2. Verify cluster is running and not paused');
      console.error('   3. Check network connectivity');
      console.error('   4. Verify connection string format');
    } else if (error.name === 'MongoParseError') {
      console.error('');
      console.error('💡 Connection String Parse Error Solutions:');
      console.error('   1. Check username/password encoding');
      console.error('   2. Verify database name in URI');
      console.error('   3. Check special characters in credentials');
    } else if (error.name === 'MongoNetworkTimeoutError') {
      console.error('');
      console.error('💡 Network Timeout Error Solutions:');
      console.error('   1. Check firewall settings');
      console.error('   2. Verify internet connectivity');
      console.error('   3. Try increasing timeout values');
    }
    
    process.exit(1);
  }
};

// Run the test
testConnection();
