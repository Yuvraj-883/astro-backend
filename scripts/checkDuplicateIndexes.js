#!/usr/bin/env node

/**
 * Script to check and remove duplicate indexes from MongoDB collections
 */

import mongoose from 'mongoose';
import { config } from '../src/config/environment.js';

// Collection names and their expected indexes
const COLLECTIONS_TO_CHECK = [
  'personas',
  'persona_reviews', 
  'birth_charts'
];

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
 * Get all indexes for a collection
 */
async function getCollectionIndexes(db, collectionName) {
  try {
    const collection = db.collection(collectionName);
    const indexes = await collection.indexes();
    return indexes;
  } catch (error) {
    console.error(`❌ Error getting indexes for ${collectionName}:`, error.message);
    return [];
  }
}

/**
 * Check for duplicate indexes based on key patterns
 */
function findDuplicateIndexes(indexes) {
  const duplicates = [];
  const keyPatterns = new Map();

  indexes.forEach((index, i) => {
    const keyStr = JSON.stringify(index.key);
    
    if (keyPatterns.has(keyStr)) {
      duplicates.push({
        duplicate: index,
        original: keyPatterns.get(keyStr),
        pattern: keyStr
      });
    } else {
      keyPatterns.set(keyStr, index);
    }
  });

  return duplicates;
}

/**
 * Remove duplicate index
 */
async function removeDuplicateIndex(db, collectionName, indexName) {
  try {
    const collection = db.collection(collectionName);
    await collection.dropIndex(indexName);
    console.log(`✅ Removed duplicate index: ${indexName} from ${collectionName}`);
    return true;
  } catch (error) {
    console.error(`❌ Error removing index ${indexName} from ${collectionName}:`, error.message);
    return false;
  }
}

/**
 * Main function to check and remove duplicates
 */
async function checkAndRemoveDuplicateIndexes() {
  let db;
  
  try {
    db = await connectToDatabase();
    
    console.log('\n🔍 CHECKING FOR DUPLICATE INDEXES...\n');
    
    let totalDuplicatesFound = 0;
    let totalDuplicatesRemoved = 0;

    for (const collectionName of COLLECTIONS_TO_CHECK) {
      console.log(`📊 Checking collection: ${collectionName}`);
      
      const indexes = await getCollectionIndexes(db, collectionName);
      
      if (indexes.length === 0) {
        console.log(`  ⚠️  Collection ${collectionName} not found or has no indexes`);
        continue;
      }
      
      console.log(`  📈 Found ${indexes.length} indexes:`);
      indexes.forEach(index => {
        console.log(`    - ${index.name}: ${JSON.stringify(index.key)}`);
      });
      
      const duplicates = findDuplicateIndexes(indexes);
      
      if (duplicates.length === 0) {
        console.log(`  ✅ No duplicate indexes found in ${collectionName}\n`);
        continue;
      }
      
      console.log(`  ⚠️  Found ${duplicates.length} duplicate indexes:`);
      totalDuplicatesFound += duplicates.length;
      
      for (const dup of duplicates) {
        console.log(`    🔄 DUPLICATE: ${dup.duplicate.name} (pattern: ${dup.pattern})`);
        console.log(`    📍 ORIGINAL: ${dup.original.name}`);
        
        // Don't remove the default _id index
        if (dup.duplicate.name === '_id_') {
          console.log(`    ⚠️  Skipping _id index (system index)`);
          continue;
        }
        
        // Ask for confirmation before removing
        console.log(`    🗑️  Removing duplicate index: ${dup.duplicate.name}`);
        const removed = await removeDuplicateIndex(db, collectionName, dup.duplicate.name);
        if (removed) {
          totalDuplicatesRemoved++;
        }
      }
      
      console.log('');
    }
    
    console.log('\n📊 SUMMARY:');
    console.log(`🔍 Total duplicate indexes found: ${totalDuplicatesFound}`);
    console.log(`🗑️  Total duplicate indexes removed: ${totalDuplicatesRemoved}`);
    
    if (totalDuplicatesFound === 0) {
      console.log('✅ No duplicate indexes found in any collection!');
    } else if (totalDuplicatesRemoved === totalDuplicatesFound) {
      console.log('✅ All duplicate indexes successfully removed!');
    } else {
      console.log('⚠️  Some duplicate indexes could not be removed.');
    }
    
  } catch (error) {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  } finally {
    if (db) {
      await mongoose.connection.close();
      console.log('\n📝 Database connection closed');
    }
  }
}

/**
 * Show current indexes for all collections
 */
async function showCurrentIndexes() {
  let db;
  
  try {
    db = await connectToDatabase();
    
    console.log('\n📋 CURRENT DATABASE INDEXES:\n');
    
    for (const collectionName of COLLECTIONS_TO_CHECK) {
      console.log(`📊 Collection: ${collectionName}`);
      
      const indexes = await getCollectionIndexes(db, collectionName);
      
      if (indexes.length === 0) {
        console.log(`  ⚠️  Collection not found or has no indexes\n`);
        continue;
      }
      
      indexes.forEach(index => {
        const keyStr = JSON.stringify(index.key);
        const unique = index.unique ? ' (UNIQUE)' : '';
        const sparse = index.sparse ? ' (SPARSE)' : '';
        console.log(`  📈 ${index.name}: ${keyStr}${unique}${sparse}`);
      });
      
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Failed to show indexes:', error.message);
  } finally {
    if (db) {
      await mongoose.connection.close();
    }
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--show') || args.includes('-s')) {
  showCurrentIndexes();
} else if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🔍 MongoDB Duplicate Index Checker

Usage:
  node scripts/checkDuplicateIndexes.js           # Check and remove duplicates
  node scripts/checkDuplicateIndexes.js --show    # Show current indexes
  node scripts/checkDuplicateIndexes.js --help    # Show this help

Options:
  --show, -s    Show current indexes without removing duplicates
  --help, -h    Show this help message
  `);
} else {
  checkAndRemoveDuplicateIndexes();
}
