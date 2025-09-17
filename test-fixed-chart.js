// Test the fixed chart calculation
import vedicAstrology from 'vedic-astrology';

// Test with known birth data
const testData = {
  date: '1990-08-15',
  time: '14:30:00',
  latitude: 28.6139,
  longitude: 77.2090
};

// Calculate timezone from longitude
const timezoneOffset = Math.round(testData.longitude / 15);

console.log('Testing fixed vedic-astrology usage:');
console.log('Birth Data:', testData);
console.log('Calculated timezone:', timezoneOffset);

try {
  const chart = vedicAstrology.positioner.getBirthChart(
    testData.date,
    testData.time,
    testData.latitude,
    testData.longitude,
    timezoneOffset
  );

  console.log('\n=== RESULTS ===');
  if (chart.meta) {
    console.log('Sun:', chart.meta.Su);
    console.log('Moon:', chart.meta.Mo);
    console.log('Ascendant:', chart.meta.La);
    
    // Check if Sun is in Leo for August 15
    const expectedSunSign = 'Le'; // Leo for August
    const actualSunSign = chart.meta.Su.rashi;
    
    console.log('\n=== VERIFICATION ===');
    console.log(`Expected Sun sign for August: ${expectedSunSign} (Leo)`);
    console.log(`Actual Sun sign from package: ${actualSunSign}`);
    console.log(`Match: ${expectedSunSign === actualSunSign ? '✅' : '❌'}`);
  }
} catch (error) {
  console.error('Error:', error.message);
}

// Also test with IST timezone (5.5)
console.log('\n=== TESTING WITH IST (5.5) ===');
try {
  const chartIST = vedicAstrology.positioner.getBirthChart(
    testData.date,
    testData.time,
    testData.latitude,
    testData.longitude,
    5.5
  );

  if (chartIST.meta) {
    console.log('Sun with IST:', chartIST.meta.Su);
    console.log('Expected: Leo (Le), Got:', chartIST.meta.Su.rashi);
  }
} catch (error) {
  console.error('Error with IST:', error.message);
}