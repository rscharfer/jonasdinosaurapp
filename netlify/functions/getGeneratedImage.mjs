import { GoogleGenAI, Modality } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async (req, context) => {

    
    const { prompt, model = 'gemini-2.0-flash-preview-image-generation' } = req.body; // Get the prompt from the request body
    
    if (!prompt) {
        return Response.json({error: 'Prompt is required'}, {status: 400})
    }

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
    });

    const result = {};

    for (const part of response.candidates[0].content.parts) {
        if (part.text) {
            if (result.text) {
                throw Error('there are multiple *text* parts in response - each subsequent one overwrites the previous')
            }
            result.text = part.text;
        } else if (part.inlineData) {
            // inlineData.data is base64-encoded string of bytes
            if (result.imageBytes) {
                throw Error('there are multiple *image* parts in response - each subsequent one overwrites the previous')
            }
            result.imageBytes = part.inlineData.data
        }
    }
    return Response.json(result)
};