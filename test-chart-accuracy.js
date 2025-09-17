// Test script to verify chart accuracy
import vedicAstrology from 'vedic-astrology';

// Test with a known birth data to verify accuracy
// Example: Someone born on August 15, 1990, 2:30 PM in New Delhi
const testBirthData = {
  date: '1990-08-15',
  time: '14:30:00',
  latitude: 28.6139,
  longitude: 77.2090,
  timezone: 5.5
};

console.log('Testing vedic-astrology package with known data:');
console.log('Birth Data:', testBirthData);

try {
  // Test different ways to call the package
  console.log('\n=== METHOD 1: Using string date ===');
  const chart1 = vedicAstrology.positioner.getBirthChart(
    testBirthData.date,
    testBirthData.time,
    testBirthData.latitude,
    testBirthData.longitude,
    testBirthData.timezone
  );
  console.log('Chart1 keys:', Object.keys(chart1));
  if (chart1.meta) {
    console.log('Sun:', chart1.meta.Su);
    console.log('Moon:', chart1.meta.Mo);
    console.log('Ascendant:', chart1.meta.La);
  }

  console.log('\n=== METHOD 2: Using Date object ===');
  const dateObj = new Date(`${testBirthData.date}T${testBirthData.time}`);
  const chart2 = vedicAstrology.positioner.getBirthChart(
    dateObj,
    testBirthData.time,
    testBirthData.latitude,
    testBirthData.longitude,
    testBirthData.timezone
  );
  console.log('Chart2 keys:', Object.keys(chart2));
  if (chart2.meta) {
    console.log('Sun:', chart2.meta.Su);
    console.log('Moon:', chart2.meta.Mo);
    console.log('Ascendant:', chart2.meta.La);
  }

  console.log('\n=== METHOD 3: Different parameter order ===');
  const chart3 = vedicAstrology.positioner.getBirthChart(
    dateObj,
    testBirthData.time,
    [testBirthData.latitude, testBirthData.longitude]
  );
  console.log('Chart3 keys:', Object.keys(chart3));
  if (chart3.meta) {
    console.log('Sun:', chart3.meta.Su);
    console.log('Moon:', chart3.meta.Mo);
    console.log('Ascendant:', chart3.meta.La);
  }

} catch (error) {
  console.error('Error testing vedic-astrology package:', error);
}

// Expected results for Aug 15, 1990, 2:30 PM, New Delhi:
// Sun should be in Leo (around 28-29 degrees)
// Moon position varies but should be calculable
// Ascendant depends on exact time and location

console.log('\n=== EXPECTED vs ACTUAL COMPARISON ===');
console.log('For Aug 15, 1990, 2:30 PM in New Delhi:');
console.log('Expected Sun: Leo (around 28-29 degrees)');
console.log('Expected Moon: Check against reliable source');
console.log('Expected Ascendant: Check against reliable source');