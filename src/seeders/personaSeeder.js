// ../src/seeders/personaSeeder.js

import mongoose from 'mongoose';
import Persona from '../models/Persona.js';
import { allPersonas } from '../services/astrologyPersonas.js';
import { connectDB } from '../config/database.js';

/**
 * Seed script to populate MongoDB with astrology personas
 * This script will insert all personas from astrologyPersonas.js into the database
 */

const seedPersonas = async () => {
  try {
    console.log('🌱 Starting persona seeding...');
    
    // Clear existing personas (optional - comment out if you want to keep existing data)
    await Persona.deleteMany({});
    console.log('🗑️  Cleared existing personas');
    
    // Prepare persona data for database insertion
    const personasToSeed = [
      {
        ...allPersonas.traditional,
        slug: 'sanatan-vision',
        category: 'traditional',
        personality: {
          tone: 'authoritative',
          formality: 'formal',
          emotionalLevel: 'medium'
        },
        specializations: {
          vedicAstrology: true,
          numerology: true,
          vastu: false,
          gemstones: true,
          tantrik: false
        },
        responseConfig: {
          maxWordCount: 120,
          useEmojis: false,
          includeHindiTerms: true,
          formalityLevel: 4
        },
        isDefault: true, // Make this the default persona
        tags: ['traditional', 'vedic', 'guru', 'spiritual', 'hindi']
      },
      
      {
        ...allPersonas.modern,
        slug: 'cosmic-didi',
        category: 'modern',
        personality: {
          tone: 'friendly',
          formality: 'casual',
          emotionalLevel: 'high'
        },
        specializations: {
          vedicAstrology: true,
          westernAstrology: true,
          numerology: false,
          vastu: true,
          gemstones: true,
          tantrik: false
        },
        responseConfig: {
          maxWordCount: 100,
          useEmojis: true,
          includeHindiTerms: true,
          formalityLevel: 2
        },
        tags: ['modern', 'casual', 'trendy', 'career', 'lifestyle']
      },
      
      {
        ...allPersonas.tantric,
        slug: 'tantrik-master',
        category: 'tantric',
        personality: {
          tone: 'mysterious',
          formality: 'formal',
          emotionalLevel: 'low'
        },
        specializations: {
          vedicAstrology: true,
          tantrik: true,
          gemstones: true,
          numerology: true,
          vastu: true,
          westernAstrology: false
        },
        responseConfig: {
          maxWordCount: 150,
          useEmojis: true,
          includeHindiTerms: true,
          formalityLevel: 5
        },
        tags: ['tantric', 'dark', 'powerful', 'remedies', 'protection']
      },
      
      {
        ...allPersonas.romantic,
        slug: 'love-guru-priya',
        category: 'romantic',
        personality: {
          tone: 'caring',
          formality: 'semi-formal',
          emotionalLevel: 'high'
        },
        specializations: {
          vedicAstrology: true,
          westernAstrology: false,
          numerology: true,
          gemstones: true,
          vastu: false,
          tantrik: false
        },
        responseConfig: {
          maxWordCount: 110,
          useEmojis: true,
          includeHindiTerms: true,
          formalityLevel: 3
        },
        tags: ['love', 'romance', 'relationships', 'marriage', 'compatibility']
      }
    ];
    
    // Insert personas into database
    const createdPersonas = await Persona.insertMany(personasToSeed);
    
    console.log(`✅ Successfully seeded ${createdPersonas.length} personas:`);
    createdPersonas.forEach(persona => {
      console.log(`   - ${persona.name} (${persona.slug})`);
    });
    
    // Show default persona
    const defaultPersona = await Persona.getDefault();
    console.log(`🎯 Default persona: ${defaultPersona.name}`);
    
    return createdPersonas;
    
  } catch (error) {
    console.error('❌ Error seeding personas:', error);
    throw error;
  }
};

// Run seeder if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  // Connect to MongoDB using same config as main app
  connectDB()
    .then(() => {
      return seedPersonas();
    })
    .then(() => {
      console.log('🎉 Persona seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export default seedPersonas;
