import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import * as fs from "node:fs";

import { GoogleGenAI, Modality } from "@google/genai";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; // Use port from .env or default to 3001

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// The Gemini API Key - store this in your .env file
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// API endpoint to generate the battle image
app.post('/api/generate-battle-image', async (req, res) => {
  const { prompt, model = 'gemini-2.0-flash-preview-image-generation' } = req.body; // Get the prompt from the request body

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const result = {
      text: [],
      image: [],
    };

    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        result.text.push(part.text)
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        result.image.push(imageData)
        
      }
  }
    
   res.json(result);

     
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);

});
