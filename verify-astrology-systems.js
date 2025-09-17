// Verify if this is Vedic vs Western astrology difference
import vedicAstrology from 'vedic-astrology';

console.log('=== VEDIC vs WESTERN ASTROLOGY COMPARISON ===');
console.log('Testing multiple dates to understand the pattern...\n');

const testDates = [
  { date: '1990-01-15', expectedWestern: 'Cp', month: 'January' },
  { date: '1990-02-15', expectedWestern: 'Aq', month: 'February' },
  { date: '1990-03-15', expectedWestern: 'Pi', month: 'March' },
  { date: '1990-04-15', expectedWestern: 'Ar', month: 'April' },
  { date: '1990-05-15', expectedWestern: 'Ta', month: 'May' },
  { date: '1990-06-15', expectedWestern: 'Ge', month: 'June' },
  { date: '1990-07-15', expectedWestern: 'Cn', month: 'July' },
  { date: '1990-08-15', expectedWestern: 'Le', month: 'August' },
  { date: '1990-09-15', expectedWestern: 'Vi', month: 'September' },
  { date: '1990-10-15', expectedWestern: 'Li', month: 'October' },
  { date: '1990-11-15', expectedWestern: 'Sc', month: 'November' },
  { date: '1990-12-15', expectedWestern: 'Sg', month: 'December' }
];

const signNames = {
  'Ar': 'Aries', 'Ta': 'Taurus', 'Ge': 'Gemini', 'Cn': 'Cancer',
  'Le': 'Leo', 'Vi': 'Virgo', 'Li': 'Libra', 'Sc': 'Scorpio',
  'Sg': 'Sagittarius', 'Cp': 'Capricorn', 'Aq': 'Aquarius', 'Pi': 'Pisces'
};

testDates.forEach(testData => {
  try {
    const chart = vedicAstrology.positioner.getBirthChart(
      testData.date,
      '12:00:00',
      28.6139, // New Delhi
      77.2090,
      5.5
    );
    
    const vedicSun = chart.meta.Su.rashi;
    const match = vedicSun === testData.expectedWestern ? '✅' : '❌';
    const offset = vedicSun !== testData.expectedWestern ? 
      `(Vedic: ${signNames[vedicSun]})` : '';
    
    console.log(`${testData.month}: Expected ${signNames[testData.expectedWestern]}, Got ${signNames[vedicSun]} ${match} ${offset}`);
    
  } catch (error) {
    console.log(`${testData.month}: Error - ${error.message}`);
  }
});

console.log('\n=== ANALYSIS ===');
console.log('If there\'s a consistent offset, it might be:');
console.log('1. Ayanamsa difference (Vedic uses sidereal, Western uses tropical)');
console.log('2. Package bug or different calculation method');
console.log('3. Timezone/date handling issue');

// Test with a different approach - check if we can get tropical positions
console.log('\n=== CHECKING PACKAGE METHODS ===');
console.log('Available methods:', Object.getOwnPropertyNames(vedicAstrology.positioner));

// Test if there are any configuration options
try {
  const chart = vedicAstrology.positioner.getBirthChart('1990-08-15', '12:00:00', 28.6139, 77.2090, 5.5);
  console.log('\nChart structure:', Object.keys(chart));
  console.log('Meta structure:', Object.keys(chart.meta));
  
  // Check if there are any settings or configurations we can access
  if (chart.settings) {
    console.log('Chart settings:', chart.settings);
  }
  if (chart.ayanamsa) {
    console.log('Ayanamsa used:', chart.ayanamsa);
  }
} catch (error) {
  console.log('Error checking chart structure:', error.message);
}