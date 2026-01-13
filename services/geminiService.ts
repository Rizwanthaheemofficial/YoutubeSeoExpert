
import { GoogleGenAI, Type } from "@google/genai";
import { SEOInput, SEOPackage } from "../types";

export const generateSEOPackage = async (input: SEOInput): Promise<SEOPackage> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  const prompt = `
    Act as the World's most elite YouTube Algorithm Strategist and Multilingual Copywriter.
    CURRENT DATE: ${today}
    
    MISSION: Generate a professional dual-language SEO package (English & Roman Sindhi).
    
    TARGET CONTEXT:
    - Channel Name: ${input.channelName}
    - Territory: ${input.targetCountry}
    - Niche: ${input.videoType}
    - Primary Topic: ${input.userContent}
    - Format: ${input.isShortsMode ? 'YouTube Shorts (9:16)' : 'Long-form (16:9)'}

    METADATA PROTOCOL:
    1. TITLES: 1 English Title (High CTR) and 1 Roman Sindhi Title.
    2. DESCRIPTION: Detailed English summary (500+ words) and a concise Roman Sindhi summary.
    3. KEYWORDS: High-volume English and local Roman Sindhi tags.
    4. VIRAL HACK: One specific algorithm tip for 2025.
    
    OUTPUT FORMAT: JSON ONLY.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          titleEnglish: { type: Type.STRING },
          titleRoman: { type: Type.STRING },
          descriptionEnglish: { type: Type.STRING },
          descriptionRoman: { type: Type.STRING },
          tagsEnglish: { type: Type.ARRAY, items: { type: Type.STRING } },
          tagsRoman: { type: Type.ARRAY, items: { type: Type.STRING } },
          hashtagsEnglish: { type: Type.ARRAY, items: { type: Type.STRING } },
          hashtagsRoman: { type: Type.ARRAY, items: { type: Type.STRING } },
          thumbnailTextEnglish: { type: Type.ARRAY, items: { type: Type.STRING } },
          thumbnailTextRoman: { type: Type.ARRAY, items: { type: Type.STRING } },
          thumbnailAIPrompt: { type: Type.STRING },
          algorithmBoostStrategy: {
            type: Type.OBJECT,
            properties: {
              viralHack110: { type: Type.STRING }
            }
          }
        },
        required: [
          "titleEnglish", "titleRoman", "descriptionEnglish", "descriptionRoman",
          "tagsEnglish", "tagsRoman", "hashtagsEnglish", "hashtagsRoman", "thumbnailAIPrompt"
        ]
      }
    }
  });

  try {
    return JSON.parse(response.text) as SEOPackage;
  } catch (error) {
    console.error("SEO Extraction Failed:", error);
    throw new Error("Neural Hack Failed. Response corrupted.");
  }
};

export const generateThumbnailImage = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: `CINEMATIC HIGH-CONTRAST YOUTUBE THUMBNAIL. ${prompt}. Professional graphics, hyper-realistic.` }] },
    config: { imageConfig: { aspectRatio: "16:9" } },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Visual projection failed.");
};
