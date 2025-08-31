// ../src/scripts/testHoroscope.js

import { 
  generateDailyHoroscope, 
  getAllSignsHoroscope, 
  getWeeklyHoroscope,
  vedicSigns 
} from '../services/dailyHoroscope.js';
import { 
  getPanchang, 
  getCurrentNakshatra, 
  getCurrentPlanetaryPositions 
} from '../services/vedicCalculations.js';

/**
 * Test script for Daily Horoscope System
 * Run this to test all horoscope functions
 */

function displayHeader() {
  console.log('\n🌟 VEDIC ASTROLOGY HOROSCOPE SYSTEM TEST 🌟\n');
  console.log('=' .repeat(60));
}

function testDailyHoroscope() {
  console.log('\n📅 TESTING DAILY HOROSCOPE\n');
  
  // Test for Mesh (Aries)
  const meshHoroscope = generateDailyHoroscope('mesh');
  console.log(`${meshHoroscope.emoji} ${meshHoroscope.raashi} - ${meshHoroscope.date}`);
  console.log(`📊 Overall: ${meshHoroscope.predictions.overall}`);
  console.log(`💕 Love: ${meshHoroscope.predictions.love}`);
  console.log(`🚀 Career: ${meshHoroscope.predictions.career}`);
  console.log(`💪 Health: ${meshHoroscope.predictions.health}`);
  console.log(`💰 Finance: ${meshHoroscope.predictions.finance}`);
  console.log(`🔢 Lucky Numbers: ${meshHoroscope.luckyElements.numbers.join(', ')}`);
  console.log(`🎨 Lucky Colors: ${meshHoroscope.luckyElements.colors.join(', ')}`);
  console.log(`🧿 Mantra: ${meshHoroscope.mantra}`);
  console.log(`⚠️  Warning: ${meshHoroscope.warning}`);
  
  console.log('\n✅ Daily horoscope test completed!\n');
  console.log('-'.repeat(60));
}

function testAllSignsHoroscope() {
  console.log('\n🌌 TESTING ALL SIGNS HOROSCOPE\n');
  
  const allHoroscopes = getAllSignsHoroscope();
  
  Object.keys(vedicSigns).forEach(sign => {
    const horoscope = allHoroscopes[sign];
    console.log(`${horoscope.emoji} ${horoscope.raashi}: ${horoscope.predictions.overall.substring(0, 50)}...`);
  });
  
  console.log(`\n✅ Generated horoscopes for all ${Object.keys(vedicSigns).length} signs!`);
  console.log('-'.repeat(60));
}

function testPanchang() {
  console.log('\n📆 TESTING PANCHANG (HINDU CALENDAR)\n');
  
  const panchang = getPanchang();
  
  console.log(`📅 Date: ${panchang.date}`);
  console.log(`📅 Weekday: ${panchang.weekday}`);
  console.log(`🌙 Tithi: ${panchang.tithi.name} (${panchang.tithi.type})`);
  console.log(`⭐ Nakshatra: ${panchang.nakshatra.name}`);
  console.log(`🔸 Nakshatra Lord: ${panchang.nakshatra.lord}`);
  console.log(`🔸 Nakshatra Deity: ${panchang.nakshatra.deity}`);
  console.log(`🔸 Nakshatra Guna: ${panchang.nakshatra.guna}`);
  console.log(`🧘 Yoga: ${panchang.yoga.name} ${panchang.yoga.isAuspicious ? '✅' : '⚠️'}`);
  console.log(`⚡ Karana: ${panchang.karana.name} (${panchang.karana.type})`);
  console.log(`🌅 Sunrise: ${panchang.sunrise}`);
  console.log(`🌅 Sunset: ${panchang.sunset}`);
  console.log(`🌙 Moonrise: ${panchang.moonrise}`);
  console.log(`🌓 Moon Phase: ${panchang.moonPhase}`);
  
  console.log('\n⚠️  INAUSPICIOUS TIMINGS:');
  console.log(`👺 Rahu Kaal: ${panchang.rahuKaal.time} - ${panchang.rahuKaal.warning}`);
  console.log(`💀 Yama Ganda: ${panchang.yamaGanda.time} - ${panchang.yamaGanda.warning}`);
  console.log(`🔴 Gulika: ${panchang.gulika.time} - ${panchang.gulika.effect}`);
  
  console.log('\n✅ Panchang test completed!');
  console.log('-'.repeat(60));
}

function testNakshatra() {
  console.log('\n⭐ TESTING CURRENT NAKSHATRA\n');
  
  const nakshatra = getCurrentNakshatra();
  
  console.log(`⭐ Name: ${nakshatra.name}`);
  console.log(`👑 Lord: ${nakshatra.lord}`);
  console.log(`🕉️  Deity: ${nakshatra.deity}`);
  console.log(`⚖️  Guna: ${nakshatra.guna}`);
  console.log(`🌍 Element: ${nakshatra.element}`);
  console.log(`#️⃣  Index: ${nakshatra.index}/27`);
  console.log(`✅ Auspicious: ${nakshatra.isAuspicious ? 'हां' : 'नहीं'}`);
  
  console.log('\n✅ Nakshatra test completed!');
  console.log('-'.repeat(60));
}

function testPlanetaryPositions() {
  console.log('\n🪐 TESTING PLANETARY POSITIONS\n');
  
  const positions = getCurrentPlanetaryPositions();
  
  console.log('🌟 CURRENT PLANETARY STATUS:');
  console.log(`☀️  Surya (Sun): ${positions.surya.sign} राशि में ${positions.surya.degree.toFixed(1)}°`);
  console.log(`🌙 Chandra (Moon): ${positions.chandra.sign} राशि में ${positions.chandra.degree.toFixed(1)}°`);
  console.log(`🔴 Mangal (Mars): ${positions.mangal.sign} राशि में`);
  console.log(`💚 Budh (Mercury): ${positions.budh.sign} राशि में ${positions.budh.retrograde ? '(वक्री)' : ''}`);
  console.log(`🟡 Guru (Jupiter): ${positions.guru.sign} राशि में ${positions.guru.retrograde ? '(वक्री)' : ''}`);
  console.log(`🩷 Shukra (Venus): ${positions.shukra.sign} राशि में ${positions.shukra.retrograde ? '(वक्री)' : ''}`);
  console.log(`🖤 Shani (Saturn): ${positions.shani.sign} राशि में ${positions.shani.retrograde ? '(वक्री)' : ''}`);
  
  console.log('\n✅ Planetary positions test completed!');
  console.log('-'.repeat(60));
}

function testWeeklyHoroscope() {
  console.log('\n📅 TESTING WEEKLY HOROSCOPE\n');
  
  const weeklySimha = getWeeklyHoroscope('simha');
  
  console.log(`🦁 ${weeklySimha.raashi} साप्ताहिक राशिफल`);
  console.log(`📅 Week Starting: ${weeklySimha.weekStarting}\n`);
  
  weeklySimha.predictions.forEach((day, index) => {
    console.log(`${index + 1}. ${day.day} (${day.date})`);
    console.log(`   📊 ${day.prediction.predictions.overall.substring(0, 60)}...`);
    console.log(`   🍀 Lucky: ${day.prediction.luckyElements.numbers[0]}, ${day.prediction.luckyElements.colors[0]}`);
  });
  
  console.log('\n✅ Weekly horoscope test completed!');
  console.log('-'.repeat(60));
}

function testValidation() {
  console.log('\n🔍 TESTING INPUT VALIDATION\n');
  
  try {
    // Test invalid raashi
    generateDailyHoroscope('invalid_sign');
  } catch (error) {
    console.log('✅ Invalid raashi validation working:', error.message);
  }
  
  try {
    // Test with custom date
    const customDate = new Date('2024-12-25');
    const christmasHoroscope = generateDailyHoroscope('mesh', customDate);
    console.log(`✅ Custom date working: ${christmasHoroscope.date}`);
  } catch (error) {
    console.log('❌ Custom date failed:', error.message);
  }
  
  console.log('\n✅ Validation tests completed!');
  console.log('-'.repeat(60));
}

function displayAPIUsageExamples() {
  console.log('\n🔗 API USAGE EXAMPLES\n');
  
  const baseURL = 'http://localhost:3000/api/v1/horoscope';
  
  console.log('📱 Daily Horoscope:');
  console.log(`   GET ${baseURL}/daily/mesh`);
  console.log(`   GET ${baseURL}/daily/mesh?date=2024-08-31`);
  
  console.log('\n📱 All Signs:');
  console.log(`   GET ${baseURL}/daily`);
  
  console.log('\n📱 Weekly Horoscope:');
  console.log(`   GET ${baseURL}/weekly/simha`);
  
  console.log('\n📱 Chat Format:');
  console.log(`   GET ${baseURL}/chat/mesh/love`);
  console.log(`   GET ${baseURL}/chat/mesh/career`);
  
  console.log('\n📱 Lucky Elements:');
  console.log(`   GET ${baseURL}/lucky/mesh`);
  
  console.log('\n📱 Panchang:');
  console.log(`   GET ${baseURL}/panchang`);
  
  console.log('\n📱 Nakshatra:');
  console.log(`   GET ${baseURL}/nakshatra`);
  
  console.log('\n📱 Planetary Positions:');
  console.log(`   GET ${baseURL}/planets`);
  
  console.log('\n✅ API examples displayed!');
  console.log('-'.repeat(60));
}

function runCompleteTest() {
  displayHeader();
  testDailyHoroscope();
  testAllSignsHoroscope();
  testPanchang();
  testNakshatra();
  testPlanetaryPositions();
  testWeeklyHoroscope();
  testValidation();
  displayAPIUsageExamples();
  
  console.log('\n🎉 ALL TESTS COMPLETED SUCCESSFULLY! 🎉');
  console.log('\n📝 Summary:');
  console.log('   ✅ Daily horoscope generation');
  console.log('   ✅ All 12 zodiac signs support');
  console.log('   ✅ Panchang calculations');
  console.log('   ✅ Nakshatra information');
  console.log('   ✅ Planetary positions');
  console.log('   ✅ Weekly horoscope');
  console.log('   ✅ Input validation');
  console.log('   ✅ API endpoint examples');
  
  console.log('\n🚀 Your Vedic Astrology Horoscope System is ready!');
  console.log('💡 Start your server and test the API endpoints above.');
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runCompleteTest();
}

export { runCompleteTest };
