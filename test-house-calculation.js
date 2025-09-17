// Test house calculation accuracy
import vedicAstrology from 'vedic-astrology';

const testData = {
  date: '1990-08-15',
  time: '14:30:00',
  latitude: 28.6139,
  longitude: 77.2090,
  timezone: 5.5
};

console.log('=== TESTING HOUSE CALCULATION ===');
console.log('Birth Data:', testData);

try {
  const chart = vedicAstrology.positioner.getBirthChart(
    testData.date,
    testData.time,
    testData.latitude,
    testData.longitude,
    testData.timezone
  );

  console.log('\n=== RAW CHART STRUCTURE ===');
  console.log('Ascendant (La):', chart.meta.La);
  
  const signOrder = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 
                     'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  
  // Find ascendant sign index
  let ascendantSignIndex = 0;
  if (chart.meta.La && chart.meta.La.rashi) {
    const ascendantSignName = chart.meta.La.rashi.toLowerCase() === 'sc' ? 'scorpio' : 'unknown';
    ascendantSignIndex = signOrder.indexOf(ascendantSignName);
    console.log(`Ascendant in: ${chart.meta.La.rashi} = ${ascendantSignName} (index: ${ascendantSignIndex})`);
  }
  
  console.log('\n=== HOUSE MAPPING ===');
  signOrder.forEach((signName, signIndex) => {
    if (chart[signName] && chart[signName].signs && chart[signName].signs.length > 0) {
      const houseNumber = ((signIndex - ascendantSignIndex + 12) % 12) + 1;
      const planets = chart[signName].signs.map(p => p.graha).join(', ');
      console.log(`House ${houseNumber}: ${signName.toUpperCase()} - Planets: ${planets}`);
    }
  });
  
  console.log('\n=== EXPECTED HOUSE MEANINGS ===');
  console.log('House 1 (Ascendant): Self, personality, physical body');
  console.log('House 2: Wealth, family, speech');
  console.log('House 3: Siblings, courage, communication');
  console.log('House 4: Mother, home, happiness');
  console.log('House 5: Children, creativity, intelligence');
  console.log('House 6: Enemies, diseases, service');
  console.log('House 7: Marriage, partnerships');
  console.log('House 8: Longevity, transformation, occult');
  console.log('House 9: Father, dharma, fortune');
  console.log('House 10: Career, reputation, status');
  console.log('House 11: Gains, friends, desires');
  console.log('House 12: Losses, spirituality, foreign lands');
  
} catch (error) {
  console.error('Error:', error.message);
}