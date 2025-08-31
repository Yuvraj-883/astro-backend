#!/usr/bin/env node

/**
 * MongoDB Connection Health Check Script
 * Diagnoses MongoDB connection issues and provides troubleshooting info
 */

import mongoose from 'mongoose';
import { config } from '../src/config/environment.js';

/**
 * Test MongoDB connection with detailed diagnostics
 */
async function testMongoDBConnection() {
  console.log('🔍 MONGODB CONNECTION HEALTH CHECK\n');
  
  // Check environment variables
  console.log('📋 Environment Configuration:');
  console.log(`   MONGODB_URI: ${config.MONGODB_URI ? 'Set' : 'Not Set'}`);
  if (config.MONGODB_URI) {
    // Mask password in URI for security
    const maskedUri = config.MONGODB_URI.replace(/:([^:@]*?)@/, ':****@');
    console.log(`   URI (masked): ${maskedUri}`);
  }
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}\n`);
  
  if (!config.MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment variables');
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check your .env file');
    console.log('   2. Ensure MONGODB_URI is properly set');
    console.log('   3. Verify the connection string format');
    return;
  }
  
  // Test connection with detailed options
  const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    family: 4,
    retryWrites: true,
    w: 'majority',
    maxIdleTimeMS: 30000,
    bufferCommands: false,
    heartbeatFrequencyMS: 10000,
  };
  
  console.log('🔄 Testing MongoDB connection...\n');
  
  try {
    // Attempt connection
    const startTime = Date.now();
    await mongoose.connect(config.MONGODB_URI, connectionOptions);
    const connectionTime = Date.now() - startTime;
    
    console.log('✅ MongoDB Connection Successful!');
    console.log(`   Connection time: ${connectionTime}ms`);
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Ready State: ${mongoose.connection.readyState} (1 = connected)\n`);
    
    // Test basic operations
    console.log('🧪 Testing basic database operations...\n');
    
    // Test ping
    console.log('📡 Testing ping...');
    const pingStart = Date.now();
    await mongoose.connection.db.admin().ping();
    const pingTime = Date.now() - pingStart;
    console.log(`   ✅ Ping successful (${pingTime}ms)\n`);
    
    // Test database stats
    console.log('📊 Getting database stats...');
    try {
      const stats = await mongoose.connection.db.stats();
      console.log(`   ✅ Database stats retrieved`);
      console.log(`   Collections: ${stats.collections}`);
      console.log(`   Objects: ${stats.objects}`);
      console.log(`   Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB\n`);
    } catch (statsError) {
      console.log(`   ⚠️  Could not get database stats: ${statsError.message}\n`);
    }
    
    // Test collection access
    console.log('📁 Testing collection access...');
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log(`   ✅ Found ${collections.length} collections:`);
      collections.forEach(col => {
        console.log(`     - ${col.name}`);
      });
      console.log('');
    } catch (colError) {
      console.log(`   ⚠️  Could not list collections: ${colError.message}\n`);
    }
    
    // Test personas collection specifically
    console.log('👥 Testing personas collection...');
    try {
      const personasCollection = mongoose.connection.db.collection('personas');
      const count = await personasCollection.countDocuments();
      console.log(`   ✅ Personas collection accessible`);
      console.log(`   Document count: ${count}\n`);
    } catch (personasError) {
      console.log(`   ❌ Personas collection error: ${personasError.message}\n`);
    }
    
    console.log('🎉 All connection tests passed!\n');
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed!');
    console.error(`   Error: ${error.message}\n`);
    
    // Provide specific troubleshooting based on error type
    console.log('💡 Troubleshooting Guide:\n');
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.log('🌐 DNS/Network Issue:');
      console.log('   - Check your internet connection');
      console.log('   - Verify the MongoDB server hostname');
      console.log('   - Try using an IP address instead of hostname');
      console.log('   - Check if you\'re behind a firewall or proxy\n');
      
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('🚫 Connection Refused:');
      console.log('   - MongoDB server is not running');
      console.log('   - Check if MongoDB is started on the target host');
      console.log('   - Verify the port number (default: 27017)');
      console.log('   - Check firewall settings\n');
      
    } else if (error.message.includes('Authentication failed')) {
      console.log('🔐 Authentication Issue:');
      console.log('   - Check username and password');
      console.log('   - Verify database user permissions');
      console.log('   - Ensure the user exists in the correct database');
      console.log('   - Check if authentication database is specified\n');
      
    } else if (error.message.includes('timeout')) {
      console.log('⏱️  Timeout Issue:');
      console.log('   - MongoDB server is slow to respond');
      console.log('   - Network latency is high');
      console.log('   - Server might be overloaded');
      console.log('   - Try increasing timeout values\n');
      
    } else if (error.message.includes('SSL') || error.message.includes('TLS')) {
      console.log('🔒 SSL/TLS Issue:');
      console.log('   - Check SSL certificate configuration');
      console.log('   - Verify TLS version compatibility');
      console.log('   - Try connecting without SSL for testing');
      console.log('   - Check if SSL is required by the server\n');
      
    } else {
      console.log('🔧 General Troubleshooting:');
      console.log('   - Check MongoDB server logs');
      console.log('   - Verify connection string format');
      console.log('   - Test with MongoDB Compass or mongo shell');
      console.log('   - Check MongoDB server status');
      console.log('   - Verify network connectivity\n');
    }
    
    console.log('📞 For MongoDB Atlas users:');
    console.log('   - Check IP whitelist settings');
    console.log('   - Verify cluster is not paused');
    console.log('   - Check connection limits');
    console.log('   - Review MongoDB Atlas status page\n');
    
  } finally {
    // Clean up connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('📝 Connection closed');
    }
  }
}

// Handle script execution
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🔍 MongoDB Connection Health Check

This script tests your MongoDB connection and provides detailed diagnostics.

Usage:
  node scripts/testConnection.js     # Run connection test
  node scripts/testConnection.js --help     # Show this help

The script will:
1. Check environment configuration
2. Test MongoDB connection
3. Perform basic database operations
4. Provide troubleshooting guidance if connection fails
  `);
} else {
  testMongoDBConnection().catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}
