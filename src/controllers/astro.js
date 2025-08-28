// ../src/controllers/astro.js

import fs from "fs";
import path from "path";
import { createAstrologyPrompt } from "../services/astrologyPrompt.js";
import { astrologyPersona } from "../services/astrologyPersonas.js";
import { config } from "../config/environment.js";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const chatSamplesPath = path.join(__dirname, "../data/astrologyChatSample.json");
const chatSamples = JSON.parse(fs.readFileSync(chatSamplesPath, "utf-8"));

const selectedPersona = astrologyPersona;

// IMPORTANT: This now starts empty for each new session.
// In a real production app, you'd manage this per-user (e.g., using a session ID).
let conversation = []; 
let userName = null;

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

// --- NEW FUNCTION TO START THE CHAT ---
export const startConversation = (req, res) => {
  // Reset state for a new conversation
  conversation = [];
  userName = null;
  // Send the initial greeting from the persona file
  res.status(200).json({ message: astrologyPersona.initialGreeting });
};


// --- UPDATED CHAT FUNCTION ---
export const connectDeepSeek = async (req, res) => {
  if (!req.body || !req.body.message) {
    return res.status(400).json({ message: "Payload is required" });
  }

  const { message } = req.body;

  // If this is the first message (the user's name)
  if (!userName) {
    userName = message;
    conversation.push({ role: "user", content: message });
    const welcomeMessage = `A pleasure to meet you, ${userName}. ✨ The cosmos is ready when you are. To truly understand your path, I'll need your birth date, time, and location. Feel free to share when you're ready.`;
    conversation.push({ role: "assistant", content: welcomeMessage });
    return res.status(200).json({ message: welcomeMessage });
  }

  // Add the user's new message to the history
  conversation.push({ role: "user", content: message });

  const emotionKeywords = {
    happy: "😊 The stars shine brighter when you're happy!",
    sad: "😔 It's okay, even the moon has its phases. I'm here to listen.",
    angry: "😡 I sense a fiery Mars energy. Let's channel it constructively.",
    excited: "🤩 What a wonderful alignment of energy!",
    confused: "🤔 The universe can be puzzling. Let's seek clarity together.",
  };

  let detectedEmotion = "";
  for (const [emotion, response] of Object.entries(emotionKeywords)) {
    if (message?.toLowerCase().includes(emotion)) {
      detectedEmotion = response;
      break;
    }
  }

  const systemPrompt = createAstrologyPrompt(selectedPersona);

  try {
    const geminiHistory = conversation.slice(-100).map(turn => ({
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

    // We send only the last message, as the history is already in the chat session
    const result = await chat.sendMessage(message);
    const response = result.response;
    let aiResponse = response.text();

    if (detectedEmotion) {
      aiResponse = `${detectedEmotion} ${aiResponse}`;
    }

    conversation.push({ role: "assistant", content: aiResponse });
    console.log(conversation);

    res.status(200).json({ message: aiResponse });
  } catch (err) {
    console.error("Error calling Gemini API:", err);
    
    // Better error handling for different types of errors
    if (err.status === 400 && err.errorDetails?.some(detail => detail.reason === 'API_KEY_INVALID')) {
      res.status(500).json({ 
        message: "Configuration Error: Invalid API key. Please check your Gemini API key in the .env file." 
      });
    } else if (err.status === 500) {
      res.status(500).json({ 
        message: "Google AI service is temporarily unavailable. Please try again in a moment." 
      });
    } else if (err.message?.includes('model')) {
      res.status(500).json({ 
        message: "Model configuration error. Please check the model name." 
      });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};