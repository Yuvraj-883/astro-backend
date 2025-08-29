// ../src/controllers/astro.js

import { createAstrologyPrompt } from "../services/astrologyPrompt.js";
import { astrologyPersona } from "../services/astrologyPersonas.js";
import { config } from "../config/environment.js";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import vedicAstrology from 'vedic-astrology'; // <--- CORRECT
const { VedicAstrology } = vedicAstrology;     // <--- CORRECTuser-selected library
import axios from 'axios';

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
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// --- HELPER FUNCTIONS ---

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

  const chart = new VedicAstrology(birthDate, birthTime, birthLocation);
  
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

// ../src/controllers/astro.js

// ... (all your imports and setup code at the top remain the same)
// ... (the startConversation function also remains the same)

// --- REWRITTEN CHAT FUNCTION WITH CORRECTED LOGIC FLOW ---
// ../src/controllers/astro.js

// --- UPDATED CHAT FUNCTION WITH 'userName' BUG FIXED ---
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

      const birthDate = new Date(`${birthDetails.date}T${birthDetails.time}:00`);
      const birthTime = `${birthDetails.time}:00`;
      const birthLocation = [latitude, longitude];

      const chart = new VedicAstrology(birthDate, birthTime, birthLocation);
      
      const sunSign = chart.getSunSign();
      const moonSign = chart.getMoonSign();
      const ascendantSign = chart.getAscendant();

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
    const geminiHistory = userSession.conversation.slice(-50).map(turn => ({
      role: turn.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: turn.content }],
    }));

    const chat = model.startChat({
      history: geminiHistory,
      systemInstruction: { role: "system", parts: [{ text: systemPrompt }] },
      safetySettings: [ /* Your safety settings here */ ],
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