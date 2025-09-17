// ../src/controllers/astro.js

import { createAstrologyPrompt } from "../services/astrologyPrompt.js";
import { astrologyPersona } from "../services/astrologyPersonas.js";
import { config } from "../config/environment.js";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import vedicAstrology from 'vedic-astrology';
import axios from 'axios';

// Set the selected persona
const selectedPersona = astrologyPersona;
// --- INITIALIZATION & VALIDATION ---

// Check for essential API keys at startup. The app will crash if they are missing.
if (!config.GEMINI_API_KEY) {
  throw new Error("FATAL ERROR: GEMINI_API_KEY is not defined in environment variables.");
}
if (!config.OPENWEATHER_API_KEY) {
  throw new Error("FATAL ERROR: OPENWEATHER_API_KEY is not defined in environment variables.");
}

// In-memory session storage.
// NOTE: For a production application that needs to scale or persist data
// across server restarts, this should be replaced with a database like Redis or a persistent DB.
let sessions = {};

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// --- HELPER FUNCTIONS ---

// Simple zodiac sign calculation
const getZodiacSign = (month, day) => {
  const signs = [
    { name: "Capricorn", start: [12, 22], end: [1, 19] },
    { name: "Aquarius", start: [1, 20], end: [2, 18] },
    { name: "Pisces", start: [2, 19], end: [3, 20] },
    { name: "Aries", start: [3, 21], end: [4, 19] },
    { name: "Taurus", start: [4, 20], end: [5, 20] },
    { name: "Gemini", start: [5, 21], end: [6, 20] },
    { name: "Cancer", start: [6, 21], end: [7, 22] },
    { name: "Leo", start: [7, 23], end: [8, 22] },
    { name: "Virgo", start: [8, 23], end: [9, 22] },
    { name: "Libra", start: [9, 23], end: [10, 22] },
    { name: "Scorpio", start: [10, 23], end: [11, 21] },
    { name: "Sagittarius", start: [11, 22], end: [12, 21] }
  ];
  
  for (const sign of signs) {
    if (
      (month === sign.start[0] && day >= sign.start[1]) ||
      (month === sign.end[0] && day <= sign.end[1])
    ) {
      return sign.name;
    }
  }
  return "Capricorn"; // fallback
};

// Convert vedic astrology abbreviations to full sign names
const convertVedicSignToFullName = (abbreviation) => {
  const vedicToFull = {
    'Ar': 'Aries',
    'Ta': 'Taurus', 
    'Ge': 'Gemini',
    'Cn': 'Cancer',
    'Le': 'Leo',
    'Vi': 'Virgo',
    'Li': 'Libra',
    'Sc': 'Scorpio',
    'Sg': 'Sagittarius',
    'Cp': 'Capricorn',
    'Aq': 'Aquarius',
    'Pi': 'Pisces'
  };
  return vedicToFull[abbreviation] || abbreviation;
};

// Get expected sun sign based on birth month (for sanity checking)
const getSunSignFromMonth = (month) => {
  const monthToSign = {
    1: 'Cp', // January - Capricorn
    2: 'Aq', // February - Aquarius  
    3: 'Pi', // March - Pisces
    4: 'Ar', // April - Aries
    5: 'Ta', // May - Taurus
    6: 'Ge', // June - Gemini
    7: 'Cn', // July - Cancer
    8: 'Le', // August - Leo
    9: 'Vi', // September - Virgo
    10: 'Li', // October - Libra
    11: 'Sc', // November - Scorpio
    12: 'Sg'  // December - Sagittarius
  };
  return monthToSign[month] || 'Unknown';
};

// Generate detailed birth chart summary for AI agent
const generateChartSummary = (completeChart) => {
  if (!completeChart) return "Birth chart data not available.";
  
  let summary = "FORMATTED BIRTH CHART ANALYSIS:\n\n";
  
  // Basic Signs
  summary += `🌟 BASIC SIGNS:\n`;
  summary += `• Sun Sign (Surya Rashi): ${completeChart.basicSigns.sunSign}\n`;
  summary += `• Moon Sign (Chandra Rashi): ${completeChart.basicSigns.moonSign}\n`;
  summary += `• Ascendant (Lagna): ${completeChart.basicSigns.ascendantSign}\n\n`;
  
  // All Planetary Positions with detailed info
  summary += `🪐 DETAILED PLANETARY POSITIONS:\n`;
  Object.entries(completeChart.planets).forEach(([code, planet]) => {
    const retrograde = planet.isRetrograde ? " (Retrograde)" : "";
    summary += `• ${planet.name}: ${planet.sign}${retrograde}\n`;
    summary += `  - Longitude: ${planet.longitude}°\n`;
    summary += `  - Nakshatra: ${planet.nakshatra} (Pada ${planet.nakshatraPada})\n`;
  });
  
  // House-wise Distribution (sorted by house number)
  summary += `\n🏠 HOUSE-WISE PLANETARY DISTRIBUTION:\n`;
  
  // Sort houses by house number for proper display
  const sortedHouses = Object.entries(completeChart.houses)
    .sort(([,a], [,b]) => a.houseNumber - b.houseNumber)
    .filter(([, houseData]) => houseData.planets.length > 0);
    
  sortedHouses.forEach(([houseKey, houseData]) => {
    const planetList = houseData.planets.map(p => 
      `${p.name}${p.isRetrograde ? '(R)' : ''}`).join(', ');
    summary += `• House ${houseData.houseNumber} (${houseData.sign}): ${planetList}\n`;
  });
  
  return summary;
};

const getCoordinates = async (locationString) => {
  try {
    const encodedLocation = encodeURIComponent(locationString);
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodedLocation}&limit=1&appid=${config.OPENWEATHER_API_KEY}`;
    const response = await axios.get(url);
    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { latitude: lat, longitude: lon };
    } else {
      throw new Error("Location not found.");
    }
  } catch (error) {
    console.error("Geocoding API Error:", error.message);
    throw new Error("Could not find coordinates for the specified location.");
  }
};

const handleBirthDetailsSubmission = async (userSession, birthDetails) => {
  // 1. Robust Input Validation
  const { name, date, time, location } = birthDetails;
  if (!name || !date || !time || !location) {
    throw new Error("Incomplete birth details. All fields are required.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Invalid date format. Please use YYYY-MM-DD.");
  }
  if (!/^\d{2}:\d{2}$/.test(time)) {
    throw new Error("Invalid time format. Please use HH:mm.");
  }

  console.log("Received birth details:", birthDetails);
  const { latitude, longitude } = await getCoordinates(location);

  const birthDate = new Date(`${date}T${time}:00`);
  const birthTime = `${time}:00`;
  const birthLocation = [latitude, longitude];

  const chart = vedicAstrology.positioner.getBirthChart(birthDate, birthTime, birthLocation);
  console.log("Calculated chart",chart)
  const sunSign = chart.getSunSign();
  const moonSign = chart.getMoonSign();
  const ascendantSign = chart.getAscendant();

  userSession.userDetails = {
    name,
    birthDetails,
    signs: { sun: sunSign, moon: moonSign, ascendant: ascendantSign },
  };

  const analysisMessage = `Bahut badhiya, ${name}! Maine aapke cosmic details calculate kar liye hain. Vedic astrology ke hisaab se, aapki Surya Raashi (Sun Sign) ${sunSign} hai, Chandra Raashi (Moon Sign) ${moonSign}, aur aapka Lagna (Ascendant) ${ascendantSign} hai. Ab aapki kundli taiyaar hai. Aap kya jaanna chahenge?`;

  userSession.conversation.push({ role: "assistant", content: analysisMessage });
  return analysisMessage;
};

const handleGeneralChat = async (userSession, message) => {
    const systemPrompt = createAstrologyPrompt(astrologyPersona, userSession.userDetails);

    const geminiHistory = userSession.conversation.slice(-50).map(turn => ({
      role: turn.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: turn.content }],
    }));

    const chat = model.startChat({
      history: geminiHistory,
      systemInstruction: { role: "system", parts: [{ text: systemPrompt }] },
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
    });

    const result = await chat.sendMessage(message);
    const aiResponse = result.response.text();
    
    userSession.conversation.push({ role: "assistant", content: aiResponse });
    console.log(`[${userSession.sessionId}] Conversation length:`, userSession.conversation.length);

    return aiResponse;
};

// --- CONTROLLER EXPORTS ---

export const startConversation = (req, res) => {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  sessions[sessionId] = {
    sessionId,
    conversation: [],
    userDetails: { name: null, birthDetails: null, signs: null },
  };
  console.log(`New session created: ${sessionId}`);
  res.status(200).json({ sessionId, message: astrologyPersona.initialGreeting });
};


export const connectDeepSeek = async (req, res) => {
  const { sessionId, message, birthDetails } = req.body;

  if (!sessionId || !sessions[sessionId]) {
    return res.status(400).json({ message: "Invalid or missing session ID. Please start a new conversation." });
  }

  const userSession = sessions[sessionId];
  userSession.conversation.push({ role: "user", content: message });
  
  // 1. PRIORITIZE birthDetails submission
  if (birthDetails && !userSession.userDetails.signs) {
    try {
      // THE FIX: Set the name on the session object FIRST
      userSession.userDetails.name = birthDetails.name; 

      console.log("Received birth details:", birthDetails);
      const { latitude, longitude } = await getCoordinates(birthDetails.location);

      // Format data correctly for vedic-astrology package
      const birthDate = birthDetails.date; // Keep as string "1990-08-15"
      const birthTime = `${birthDetails.time}:00`; // "14:30:00"
      
      // Calculate timezone offset based on longitude (rough approximation)
      // More accurate would be to use a timezone API, but this is a start
      const timezoneOffset = Math.round(longitude / 15); // Basic timezone calculation
      const timezone = timezoneOffset; // Use calculated timezone instead of hardcoded IST
      
      console.log('Birth parameters for vedic astrology:');
      console.log('- Date (string):', birthDate);
      console.log('- Time (string):', birthTime);
      console.log('- Latitude (number):', latitude);
      console.log('- Longitude (number):', longitude);
      console.log('- Calculated timezone:', timezone);
      
      // Try to use vedic astrology package correctly
      let sunSign, moonSign, ascendantSign;
      try {
        let chart;
        try {
          // Use the package with correct parameters (only string date, not Date object)
          chart = vedicAstrology.positioner.getBirthChart(
            birthDate,    // String date: "1990-08-15"
            birthTime,    // String time: "14:30:00"
            latitude,     // Number latitude
            longitude,    // Number longitude
            timezone      // Calculated timezone
          );
          console.log('\n=== RAW VEDIC ASTROLOGY DATA ===');
          console.log('Birth Parameters Used:');
          console.log('- Date:', birthDate);
          console.log('- Time:', birthTime);
          console.log('- Latitude:', birthLocation[0]);
          console.log('- Longitude:', birthLocation[1]);
          console.log('- Timezone:', timezone);
          console.log('\nFull Chart Object:');
          console.log(JSON.stringify(chart, null, 2));
          console.log('=== END RAW DATA ===\n');
          
          // Let's also check what the package thinks the basic signs are
          if (chart.meta) {
            console.log('\n=== PLANETARY POSITIONS FROM PACKAGE ===');
            Object.keys(chart.meta).forEach(planetCode => {
              const planet = chart.meta[planetCode];
              if (planet) {
                console.log(`${planetCode}: Sign=${planet.rashi}, Longitude=${planet.longitude}°, Retrograde=${planet.isRetrograde}`);
                if (planet.nakshatra) {
                  console.log(`  Nakshatra: ${planet.nakshatra.name} (Pada ${planet.nakshatra.pada})`);
                }
              }
            });
            
            // Vedic vs Western astrology clarification
            if (chart.meta.Su) {
              const sunLongitude = chart.meta.Su.longitude;
              const expectedMonth = new Date(birthDate).getMonth() + 1;
              console.log(`\nℹ️  ASTROLOGY SYSTEM INFO:`);
              console.log(`Sun longitude: ${sunLongitude}°`);
              console.log(`Birth month: ${expectedMonth}`);
              console.log(`Vedic (Sidereal) Sun sign: ${chart.meta.Su.rashi}`);
              
              // Show both Vedic and Western for comparison
              const westernSunSign = getSunSignFromMonth(expectedMonth);
              console.log(`Western (Tropical) Sun sign would be: ${westernSunSign}`);
              
              if (chart.meta.Su.rashi !== westernSunSign) {
                console.log(`✓ This is normal - Vedic astrology uses sidereal zodiac (star-based)`);
                console.log(`  Western astrology uses tropical zodiac (season-based)`);
                console.log(`  The ~24° difference is called Ayanamsa`);
              } else {
                console.log(`✓ Vedic and Western signs match for this birth date`);
              }
            }
            
            console.log('=== END PLANETARY POSITIONS ===\n');
          }
        } catch (vedicError) {
          console.log('Vedic astrology still failed:', vedicError.message);
          throw vedicError;
        }
        
        // Extract complete birth chart details
        if (chart && typeof chart === 'object') {
          
          // Extract basic signs with detailed logging
          console.log('\n=== EXTRACTING BASIC SIGNS ===');
          if (chart.meta && chart.meta.Su && chart.meta.Su.rashi) {
            sunSign = convertVedicSignToFullName(chart.meta.Su.rashi);
            console.log(`Sun: ${chart.meta.Su.rashi} -> ${sunSign} (Longitude: ${chart.meta.Su.longitude}°)`);
          } else {
            console.log('⚠️  Sun data not found in chart.meta.Su');
          }
          
          if (chart.meta && chart.meta.Mo && chart.meta.Mo.rashi) {
            moonSign = convertVedicSignToFullName(chart.meta.Mo.rashi);
            console.log(`Moon: ${chart.meta.Mo.rashi} -> ${moonSign} (Longitude: ${chart.meta.Mo.longitude}°)`);
          } else {
            console.log('⚠️  Moon data not found in chart.meta.Mo');
          }
          
          if (chart.meta && chart.meta.La && chart.meta.La.rashi) {
            ascendantSign = convertVedicSignToFullName(chart.meta.La.rashi);
            console.log(`Ascendant: ${chart.meta.La.rashi} -> ${ascendantSign} (Longitude: ${chart.meta.La.longitude}°)`);
          } else {
            console.log('⚠️  Ascendant data not found in chart.meta.La');
          }
          console.log('=== END BASIC SIGNS EXTRACTION ===\n');
          
          // COMPLETE PLANETARY DETAILS FOR AI AGENT
          const planetNames = {
            'Su': 'Sun (Surya)',
            'Mo': 'Moon (Chandra)', 
            'Me': 'Mercury (Budh)',
            'Ve': 'Venus (Shukra)',
            'Ma': 'Mars (Mangal)',
            'Ju': 'Jupiter (Guru)',
            'Sa': 'Saturn (Shani)',
            'Ra': 'Rahu (North Node)',
            'Ke': 'Ketu (South Node)',
            'La': 'Lagna (Ascendant)'
          };
          
          const completeChartData = {
            basicSigns: { sunSign, moonSign, ascendantSign },
            planets: {},
            houses: {},
            nakshatras: {},
            planetaryAspects: []
          };
          
          // Extract all planetary positions with full details
          if (chart.meta) {
            Object.keys(chart.meta).forEach(planetCode => {
              const planet = chart.meta[planetCode];
              if (planet && planet.rashi) {
                completeChartData.planets[planetCode] = {
                  name: planetNames[planetCode] || planetCode,
                  sign: convertVedicSignToFullName(planet.rashi),
                  signAbbr: planet.rashi,
                  longitude: planet.longitude,
                  isRetrograde: planet.isRetrograde,
                  nakshatra: planet.nakshatra?.name || 'Unknown',
                  nakshatraPada: planet.nakshatra?.pada || 0,
                  house: null // Will be calculated from sign positions
                };
              }
            });
          }
          
          // CORRECT: Calculate houses based on Ascendant position
          const signOrder = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 
                           'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
          
          // Find ascendant sign to determine house system
          let ascendantSignIndex = 0;
          if (chart.meta.La && chart.meta.La.rashi) {
            const ascendantSignName = chart.meta.La.rashi.toLowerCase() === 'ar' ? 'aries' :
                                    chart.meta.La.rashi.toLowerCase() === 'ta' ? 'taurus' :
                                    chart.meta.La.rashi.toLowerCase() === 'ge' ? 'gemini' :
                                    chart.meta.La.rashi.toLowerCase() === 'cn' ? 'cancer' :
                                    chart.meta.La.rashi.toLowerCase() === 'le' ? 'leo' :
                                    chart.meta.La.rashi.toLowerCase() === 'vi' ? 'virgo' :
                                    chart.meta.La.rashi.toLowerCase() === 'li' ? 'libra' :
                                    chart.meta.La.rashi.toLowerCase() === 'sc' ? 'scorpio' :
                                    chart.meta.La.rashi.toLowerCase() === 'sg' ? 'sagittarius' :
                                    chart.meta.La.rashi.toLowerCase() === 'cp' ? 'capricorn' :
                                    chart.meta.La.rashi.toLowerCase() === 'aq' ? 'aquarius' : 'pisces';
            ascendantSignIndex = signOrder.indexOf(ascendantSignName);
          }
          
          console.log(`\n=== HOUSE CALCULATION ===`);
          console.log(`Ascendant in: ${chart.meta.La?.rashi} (index: ${ascendantSignIndex})`);
          
          // Calculate houses: 1st house = Ascendant sign, 2nd house = next sign, etc.
          signOrder.forEach((signName, signIndex) => {
            if (chart[signName] && chart[signName].signs) {
              // Calculate which house this sign represents
              let houseNumber = ((signIndex - ascendantSignIndex + 12) % 12) + 1;
              
              completeChartData.houses[`house${houseNumber}`] = {
                houseNumber: houseNumber,
                sign: signName.charAt(0).toUpperCase() + signName.slice(1),
                signAbbr: chart[signName].rashi || signName.substring(0, 2),
                planets: chart[signName].signs.map(planet => ({
                  code: planet.graha,
                  name: planetNames[planet.graha] || planet.graha,
                  isRetrograde: planet.isRetrograde,
                  longitude: planet.longitude
                }))
              };
              
              console.log(`${signName} = House ${houseNumber} with ${chart[signName].signs.length} planets`);
            }
          });
          
          console.log('=== END HOUSE CALCULATION ===\n');
          
          // Store both processed and raw chart data for AI agent access
          userSession.userDetails.completeChart = completeChartData;
          userSession.userDetails.rawVedicChart = chart; // Store complete raw data
          
          console.log('✓ Complete chart data stored for AI analysis');
          
          console.log('Extracted signs from vedic chart:', { sunSign, moonSign, ascendantSign });
        }
        
        // If we still don't have all signs, use fallback calculation
        if (!sunSign || !moonSign || !ascendantSign) {
          console.log('Some signs missing, using fallback calculation');
          const dateObj = new Date(`${birthDetails.date}T${birthDetails.time}:00`);
          const month = dateObj.getMonth() + 1;
          const day = dateObj.getDate();
          
          if (!sunSign) sunSign = getZodiacSign(month, day);
          if (!moonSign) moonSign = getZodiacSign((month + 1) % 12 || 12, day);
          if (!ascendantSign) ascendantSign = getZodiacSign((month + 2) % 12 || 12, day);
        }
        
        console.log('Final calculated signs:', { sunSign, moonSign, ascendantSign });
      } catch (error) {
        console.error('Error with vedic astrology calculation:', error);
        // Fallback to simple calculation
        const dateObj = new Date(`${birthDetails.date}T${birthDetails.time}:00`);
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        sunSign = getZodiacSign(month, day);
        moonSign = getZodiacSign((month + 1) % 12 || 12, day);
        ascendantSign = getZodiacSign((month + 2) % 12 || 12, day);
        console.log('Fallback calculated signs:', { sunSign, moonSign, ascendantSign });
      }

      userSession.userDetails.signs = { sun: sunSign, moon: moonSign, ascendant: ascendantSign };

      // THE FIX: Use the name from the session object, not the old variable
      const analysisMessage = `Bahut badhiya, ${userSession.userDetails.name}! Maine aapke cosmic details calculate kar liye hain. Vedic astrology ke hisaab se, aapki Surya Raashi (Sun Sign) ${sunSign} hai, Chandra Raashi (Moon Sign) ${moonSign}, aur aapka Lagna (Ascendant) ${ascendantSign} hai. Ab aapki kundli taiyaar hai. Aap kya jaanna chahenge?`;

      userSession.conversation.push({ role: "assistant", content: analysisMessage });
      return res.status(200).json({ message: analysisMessage });

    } catch (error) {
      console.error("Astrology/Geocoding error:", error.message);
      const errorMessage = error.message.includes("Location not found")
        ? `Maaf kijiye, mujhe "${birthDetails.location}" naam ki jagah nahi mil rahi. Kya aap spelling check kar sakte hain?`
        : "Details calculate karte waqt kuch error aa gaya. Please check the format.";
      return res.status(500).json({ message: errorMessage });
    }
  }

  // 2. Fallback to name capture if no details are sent AND the name isn't set yet.
  if (!userSession.userDetails.name) {
    // THE FIX: Set the name on the session object
    userSession.userDetails.name = message;
    const welcomeMessage = `A pleasure to meet you, ${message}. ✨ The cosmos is ready when you are. To truly understand your path, I'll need your birth date, time, and location. Feel free to share when you're ready.`;
    userSession.conversation.push({ role: "assistant", content: welcomeMessage });
    return res.status(200).json({ message: welcomeMessage });
  }

  // 3. Handle general chat
  try {
    const systemPrompt = createAstrologyPrompt(selectedPersona, userSession.userDetails);
    
    // Add complete birth chart data to conversation context if available
    let enhancedSystemPrompt = systemPrompt;
    if (userSession.userDetails.completeChart && userSession.userDetails.rawVedicChart) {
      const chartSummary = generateChartSummary(userSession.userDetails.completeChart);
      const rawChartData = JSON.stringify(userSession.userDetails.rawVedicChart, null, 2);
      
      enhancedSystemPrompt += `

COMPLETE BIRTH CHART DATA FOR MAXIMUM ACCURACY:

${chartSummary}

RAW VEDIC ASTROLOGY DATA (Use this for precise calculations):
${rawChartData}

IMPORTANT: Use both the formatted summary above AND the raw data for the most accurate astrological analysis. The raw data contains exact planetary longitudes, nakshatras, and house positions for precise predictions.`;
      
      console.log('✓ Enhanced system prompt with complete chart data (', chartSummary.length + rawChartData.length, 'characters)');
      
      // Verify chart data completeness
      console.log('\n=== CHART DATA VERIFICATION ===');
      console.log('Basic signs available:', !!userSession.userDetails.completeChart.basicSigns);
      console.log('Planets count:', Object.keys(userSession.userDetails.completeChart.planets || {}).length);
      console.log('Houses with planets:', Object.keys(userSession.userDetails.completeChart.houses || {}).length);
      console.log('Raw chart keys:', Object.keys(userSession.userDetails.rawVedicChart || {}).length);
      
      // Sample of what AI will see
      console.log('\nSample chart data AI will receive:');
      console.log('- Sun:', userSession.userDetails.completeChart.planets?.Su);
      console.log('- Moon:', userSession.userDetails.completeChart.planets?.Mo);
      console.log('- First house with planets:', Object.entries(userSession.userDetails.completeChart.houses || {})
        .find(([_, house]) => house.planets.length > 0));
      console.log('=== END VERIFICATION ===\n');
    } else if (userSession.userDetails.completeChart) {
      const chartSummary = generateChartSummary(userSession.userDetails.completeChart);
      enhancedSystemPrompt += `\n\nDETAILED BIRTH CHART DATA FOR ANALYSIS:\n${chartSummary}\n\nUse this complete planetary information for accurate astrological guidance.`;
    }
    
    const geminiHistory = userSession.conversation.slice(-50).map(turn => ({
      role: turn.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: turn.content }],
    }));

    const chat = model.startChat({
      history: geminiHistory,
      systemInstruction: { role: "system", parts: [{ text: enhancedSystemPrompt }] },
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
    });

    const result = await chat.sendMessage(message);
    const aiResponse = result.response.text();
    
    userSession.conversation.push({ role: "assistant", content: aiResponse });
    console.log(`[${sessionId}] Conversation length:`, userSession.conversation.length);
    
    res.status(200).json({ message: aiResponse });

  } catch (err) {
    console.error(`[${sessionId}] Error calling Gemini API:`, err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};