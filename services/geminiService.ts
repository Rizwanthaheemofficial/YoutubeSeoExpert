
import { GoogleGenAI, Type } from "@google/genai";
import { SEOInput, SEOPackage, GroundingSource } from "../types";

export const generateSEOPackage = async (input: SEOInput): Promise<SEOPackage> => {
  // Always use the most up-to-date API key from the environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  const prompt = `
    Act as the World's most elite YouTube Algorithm Strategist and Multilingual Copywriter for high-authority News Channels.
    CURRENT DATE: ${today}
    
    MISSION: Generate a professional dual-language SEO package (English & Roman Sindhi).
    
    TARGET CONTEXT:
    - Channel Name: ${input.channelName}
    - Territory: ${input.targetCountry}
    - Niche: ${input.videoType}
    - Primary Topic: ${input.userContent}
    - Format: ${input.isShortsMode ? 'YouTube Shorts (9:16)' : 'Long-form (16:9)'}

    METADATA PROTOCOL:
    1. REAL-TIME GROUNDING: Use Google Search to find current trending search terms, news updates, and viewer sentiment for "${input.userContent}" specifically in Pakistan and globally.
    2. TITLES: 
       - 1 English Title (High CTR, curiosity-driven, news-style).
       - 1 Roman Sindhi Title (Traditional yet clickable, reflecting local linguistic nuances).
    3. DESCRIPTION: 
       - English: Must be a detailed, multi-paragraph 500+ word professional news summary. Include relevant keywords naturally.
       - Roman Sindhi: A 100-word concise and punchy summary for mobile users.
    4. KEYWORDS/TAGS: 
       - English: High-volume professional search terms.
       - Roman Sindhi: Local phonetic search terms used by Sindhi audiences.
    5. STRATEGY: Provide the "Viral Hack 110" specifically for the December 2025 algorithm update.
    
    OUTPUT FORMAT: JSON ONLY. Use the provided schema.
  `;

  // Switching to gemini-3-flash-preview for much higher RPM (Rate Per Minute) 
  // than Pro, which helps avoid 429 errors on the free tier.
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
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
          videoChapters: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                timestamp: { type: Type.STRING },
                title: { type: Type.STRING }
              }
            }
          },
          lsiKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          retentionHooksEnglish: { type: Type.ARRAY, items: { type: Type.STRING } },
          retentionHooksRoman: { type: Type.ARRAY, items: { type: Type.STRING } },
          metadataRecommendations: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              location: { type: Type.STRING },
              recordingDate: { type: Type.STRING },
              license: { type: Type.STRING }
            }
          },
          thumbnailTextEnglish: { type: Type.ARRAY, items: { type: Type.STRING } },
          thumbnailTextRoman: { type: Type.ARRAY, items: { type: Type.STRING } },
          thumbnailAIPrompt: { type: Type.STRING },
          communityPostEnglish: { type: Type.STRING },
          communityPostRoman: { type: Type.STRING },
          dailyAlgoInsights: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                trend: { type: Type.STRING },
                impact: { type: Type.STRING },
                hack: { type: Type.STRING }
              }
            }
          },
          launchRoadmap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                timeframe: { type: Type.STRING },
                action: { type: Type.STRING },
                priority: { type: Type.STRING }
              }
            }
          },
          outroStrategy: {
            type: Type.OBJECT,
            properties: {
              endScreen: { type: Type.STRING },
              cards: { type: Type.STRING }
            }
          },
          algorithmBoostStrategy: {
            type: Type.OBJECT,
            properties: {
              bestUploadTime: { type: Type.STRING },
              abTesting: { type: Type.STRING },
              pinnedComment: { type: Type.STRING },
              keywordStrategy: { type: Type.STRING },
              engagementBait: { type: Type.STRING },
              viralHack110: { type: Type.STRING }
            }
          }
        },
        required: [
          "titleEnglish", "titleRoman", "descriptionEnglish", "descriptionRoman",
          "tagsEnglish", "tagsRoman", "hashtagsEnglish", "hashtagsRoman",
          "videoChapters", "retentionHooksEnglish", "dailyAlgoInsights", "thumbnailAIPrompt"
        ]
      }
    }
  });

  try {
    const result = JSON.parse(response.text) as SEOPackage;
    
    // Extract grounding sources
    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || 'Viral Insight Source',
            uri: chunk.web.uri
          });
        }
      });
    }
    result.groundingSources = sources;

    return result;
  } catch (error) {
    console.error("SEO Extraction Failed:", error);
    throw new Error("Neural Hack Failed. High-authority response was corrupted.");
  }
};

export const generateThumbnailImage = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: `CINEMATIC HIGH-CONTRAST YOUTUBE THUMBNAIL. ${prompt}. Professional news graphics, clean fonts, hyper-realistic, 4k.` }] },
    config: { imageConfig: { aspectRatio: "16:9" } },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Visual projection failed.");
};
