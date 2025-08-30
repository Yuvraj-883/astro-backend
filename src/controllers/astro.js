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

// Generate detailed birth chart summary for AI agent
const generateChartSummary = (completeChart) => {
  if (!completeChart) return "Birth chart data not available.";
  
  let summary = "COMPLETE BIRTH CHART ANALYSIS:\n\n";
  
  // Basic Signs
  summary += `🌟 BASIC SIGNS:\n`;
  summary += `• Sun Sign (Surya Rashi): ${completeChart.basicSigns.sunSign}\n`;
  summary += `• Moon Sign (Chandra Rashi): ${completeChart.basicSigns.moonSign}\n`;
  summary += `• Ascendant (Lagna): ${completeChart.basicSigns.ascendantSign}\n\n`;
  
  // All Planetary Positions
  summary += `🪐 PLANETARY POSITIONS:\n`;
  Object.entries(completeChart.planets).forEach(([code, planet]) => {
    const retrograde = planet.isRetrograde ? " (R)" : "";
    summary += `• ${planet.name}: ${planet.sign}${retrograde} - ${planet.nakshatra} nakshatra\n`;
  });
  
  // House-wise Distribution
  summary += `\n🏠 HOUSE-WISE PLANETARY DISTRIBUTION:\n`;
  Object.entries(completeChart.houses).forEach(([house, houseData]) => {
    if (houseData.planets.length > 0) {
      const planetList = houseData.planets.map(p => 
        `${p.name}${p.isRetrograde ? '(R)' : ''}`).join(', ');
      summary += `• ${houseData.sign} (House ${houseData.houseNumber}): ${planetList}\n`;
    }
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

      // Keep the original date string format for vedic astrology
      const birthDate = birthDetails.date; // Keep as string like "1990-08-15"
      const birthTime = `${birthDetails.time}:00`; // Convert "14:30" to "14:30:00" 
      
      // Debug the coordinate types and values
      console.log('Raw coordinates:', { latitude, longitude });
      console.log('Coordinate types:', { latType: typeof latitude, lonType: typeof longitude });
      
      // Try different coordinate formats that vedic astrology might expect
      const birthLocation = [Number(latitude), Number(longitude)];
      console.log('Birth parameters:', { birthDate, birthTime, birthLocation });
      console.log('Final coordinate types:', { 
        latType: typeof birthLocation[0], 
        lonType: typeof birthLocation[1],
        isLatNumber: !isNaN(birthLocation[0]),
        isLonNumber: !isNaN(birthLocation[1])
      });
      
      // Try to use vedic astrology package correctly
      let sunSign, moonSign, ascendantSign;
      try {
        console.log('Vedic astrology object:', vedicAstrology);
        
        // Use the proper vedic astrology API with timezone
        // According to docs: getBirthChart(dateString, timeString, lat, lng, timezone)
        const timezone = 5.5; // IST (Indian Standard Time) - we can make this dynamic later
        
        let chart;
        try {
          chart = vedicAstrology.positioner.getBirthChart(
            birthDate, 
            birthTime, 
            birthLocation[0], // latitude
            birthLocation[1], // longitude  
            timezone
          );
          console.log('Vedic astrology succeeded with timezone!');
          console.log('Vedic astrology chart:', chart);
        } catch (vedicError) {
          console.log('Vedic astrology still failed:', vedicError.message);
          throw vedicError;
        }
        
        // Extract complete birth chart details
        if (chart && typeof chart === 'object') {
          console.log('Chart structure:', Object.keys(chart));
          if (chart.meta) {
            console.log('Chart meta:', Object.keys(chart.meta));
          }
          
          // Extract basic signs
          if (chart.meta && chart.meta.Su && chart.meta.Su.rashi) {
            sunSign = convertVedicSignToFullName(chart.meta.Su.rashi);
            console.log('Sun sign from vedic chart:', sunSign);
          }
          
          if (chart.meta && chart.meta.Mo && chart.meta.Mo.rashi) {
            moonSign = convertVedicSignToFullName(chart.meta.Mo.rashi);
            console.log('Moon sign from vedic chart:', moonSign);
          }
          
          if (chart.meta && chart.meta.La && chart.meta.La.rashi) {
            ascendantSign = convertVedicSignToFullName(chart.meta.La.rashi);
            console.log('Ascendant from vedic chart:', ascendantSign);
          }
          
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
          
          // Extract house-wise planetary distribution
          const houses = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 
                         'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
          
          houses.forEach((house, index) => {
            if (chart[house] && chart[house].signs) {
              completeChartData.houses[house] = {
                houseNumber: index + 1,
                sign: house.charAt(0).toUpperCase() + house.slice(1),
                planets: chart[house].signs.map(planet => ({
                  code: planet.graha,
                  name: planetNames[planet.graha] || planet.graha,
                  isRetrograde: planet.isRetrograde
                }))
              };
            }
          });
          
          // Store complete chart data in session for AI agent access
          userSession.userDetails.completeChart = completeChartData;
          
          console.log('Complete chart data stored for AI agent:', {
            planetsCount: Object.keys(completeChartData.planets).length,
            housesWithPlanets: Object.keys(completeChartData.houses).filter(h => 
              completeChartData.houses[h].planets.length > 0).length
          });
          
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
    if (userSession.userDetails.completeChart) {
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