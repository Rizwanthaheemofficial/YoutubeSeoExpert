
import { GoogleGenAI, Type } from "@google/genai";
import { SEOInput, SEOPackage } from "../types";

export const generateSEOPackage = async (input: SEOInput): Promise<SEOPackage> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  const prompt = `
    Act as the world's most elite YouTube Algorithm Growth Hacker and Viral Strategist.
    TODAY'S DATE: ${today}
    
    TARGET CONTEXT:
    - Channel: ${input.channelName}
    - Topic: ${input.userContent}
    - Mode: ${input.isShortsMode ? 'YouTube Shorts (Vertical)' : 'Long-form Video (16:9)'}
    
    DUAL-LANGUAGE SEO PROTOCOL:
    The user requires the SEO metadata in exactly TWO languages:
    1. ENGLISH (Primary professional output - Description must be extremely detailed in English)
    2. ROMAN SINDHI (Sindhi written in Latin/English characters)

    FULL 360-DEGREE SEO PACKAGE REQUIREMENTS:
    1. REAL-TIME GROUNDING: Use GOOGLE SEARCH to find the latest high-traffic search queries and news related to "${input.userContent}" for today.
    2. TITLES: Provide 1 catchy English title and 1 high-CTR Roman Sindhi title.
    3. DESCRIPTION: Provide a 500+ word, keyword-rich English description. Also provide a shorter Roman Sindhi summary.
    4. TAGS & HASHTAGS: Separate lists for English and Roman Sindhi. Focus on today's viral trends.
    5. RETENTION HOOKS: Script hooks for the first 30 seconds to maximize audience retention.
    6. VIDEO CHAPTERS: Strategic timestamps for the video length.
    7. DAILY ALGO HACKS: Current logic for the December 2025 algorithm update.
    8. THUMBNAIL VISUALS: Dual-language overlay text and an AI image prompt.
    
    OUTPUT JSON FORMAT ONLY. Ensure English descriptions are world-class and Roman Sindhi is natural and easy to read.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
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
    return JSON.parse(response.text) as SEOPackage;
  } catch (error) {
    console.error("SEO Extraction Failed:", error);
    throw new Error("Neural Hack Failed. The SEO package structure was corrupted during transmission.");
  }
};

export const generateThumbnailImage = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: `CINEMATIC HIGH-CTR YOUTUBE THUMBNAIL. ${prompt}. High contrast, professional news style.` }] },
    config: { imageConfig: { aspectRatio: "16:9" } },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Visual projection failed.");
};
