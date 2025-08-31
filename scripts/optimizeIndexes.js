#!/usr/bin/env node

/**
 * Script to clean up database indexes and apply optimized index schema
 */

import mongoose from 'mongoose';
import { config } from '../src/config/environment.js';

// Import models to ensure schemas are loaded
import '../src/models/Persona.js';
import '../src/models/PersonaReview.js';
import BirthChart from '../src/models/BirthChart.js';

/**
 * Connect to MongoDB
 */
async function connectToDatabase() {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    return mongoose.connection.db;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
}

/**
 * Drop all indexes except _id for a collection
 */
async function dropNonIdIndexes(db, collectionName) {
  try {
    const collection = db.collection(collectionName);
    
    // Get all indexes
    const indexes = await collection.indexes();
    console.log(`📊 ${collectionName} current indexes: ${indexes.length}`);
    
    // Drop all indexes except _id
    for (const index of indexes) {
      if (index.name !== '_id_') {
        try {
          await collection.dropIndex(index.name);
          console.log(`  🗑️  Dropped: ${index.name}`);
        } catch (error) {
          console.log(`  ⚠️  Could not drop ${index.name}: ${error.message}`);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error dropping indexes for ${collectionName}:`, error.message);
    return false;
  }
}

/**
 * Recreate optimized indexes
 */
async function recreateOptimizedIndexes() {
  try {
    console.log('\n🔄 Recreating optimized indexes...\n');
    
    // Get the models
    const Persona = mongoose.model('Persona');
    const PersonaReview = mongoose.model('PersonaReview');
    
    // Ensure indexes are created for all models
    console.log('📈 Creating Persona indexes...');
    await Persona.createIndexes();
    
    console.log('📈 Creating PersonaReview indexes...');
    await PersonaReview.createIndexes();
    
    console.log('📈 Creating BirthChart indexes...');
    await BirthChart.createIndexes();
    
    console.log('✅ All optimized indexes created successfully');
    
  } catch (error) {
    console.error('❌ Error creating indexes:', error.message);
    throw error;
  }
}

/**
 * List all indexes after optimization
 */
async function listOptimizedIndexes(db) {
  const collections = ['personas', 'persona_reviews', 'birth_charts'];
  
  console.log('\n📋 OPTIMIZED DATABASE INDEXES:\n');
  
  for (const collectionName of collections) {
    try {
      const collection = db.collection(collectionName);
      const indexes = await collection.indexes();
      
      console.log(`📊 ${collectionName} (${indexes.length} indexes):`);
      indexes.forEach(index => {
        const keyStr = JSON.stringify(index.key);
        const unique = index.unique ? ' (UNIQUE)' : '';
        const sparse = index.sparse ? ' (SPARSE)' : '';
        console.log(`  📈 ${index.name}: ${keyStr}${unique}${sparse}`);
      });
      console.log('');
      
    } catch (error) {
      console.log(`  ⚠️  Collection ${collectionName} not found\n`);
    }
  }
}

/**
 * Main function
 */
async function optimizeDatabaseIndexes() {
  let db;
  
  try {
    db = await connectToDatabase();
    
    console.log('\n🧹 CLEANING UP DATABASE INDEXES...\n');
    
    const collections = ['personas', 'persona_reviews', 'birth_charts'];
    
    // Drop existing indexes (except _id)
    for (const collectionName of collections) {
      console.log(`🗑️  Cleaning ${collectionName}...`);
      await dropNonIdIndexes(db, collectionName);
    }
    
    // Recreate optimized indexes
    await recreateOptimizedIndexes();
    
    // List final indexes
    await listOptimizedIndexes(db);
    
    console.log('🎉 Database index optimization completed successfully!');
    
  } catch (error) {
    console.error('❌ Optimization failed:', error.message);
    process.exit(1);
  } finally {
    if (db) {
      await mongoose.connection.close();
      console.log('\n📝 Database connection closed');
    }
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🔧 MongoDB Index Optimizer

This script will:
1. Drop all existing indexes (except _id)
2. Recreate optimized indexes based on current schema
3. Remove redundant and duplicate indexes

Usage:
  node scripts/optimizeIndexes.js    # Run optimization
  node scripts/optimizeIndexes.js --help    # Show this help

⚠️  WARNING: This will drop and recreate indexes, which may impact performance temporarily.
`);
} else {
  console.log('🚀 Starting database index optimization...');
  optimizeDatabaseIndexes();
}
