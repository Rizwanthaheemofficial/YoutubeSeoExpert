
import { GoogleGenAI, Type } from "@google/genai";
import { SEOInput, SEOPackage } from "../types";

export const generateSEOPackage = async (input: SEOInput): Promise<SEOPackage> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Act as a world-class YouTube Viral Growth Hacker and Algorithm Analyst.
    Your mission is to HACK the YouTube Algorithm (December 2025 update) for 110% reach and instant recommendations.
    
    INPUT PARAMETERS:
    - Topic: ${input.userContent}
    - Language: ${input.userLanguage}
    - Channel: ${input.channelName}
    - Target: ${input.targetCountry}
    - Video Type: ${input.videoType}
    - Preferred Upload Time: ${input.preferredUploadTime}

    STRICT OUTPUT REQUIREMENTS:
    1. DESCRIPTION LENGTH: The generated descriptions (English, Native, and Roman) must each be a full, detailed, and SEO-optimized text of approximately 500 words. It should include timestamps, keyword-rich summaries, social links placeholders, and a "bridge" to keep users on the platform.
    2. HASHTAG COUNT: Provide EXACTLY 10-15 high-velocity hashtags. Do not provide fewer than 10.
    3. TAGS: Provide tags as a list of 20+ high-relevance comma-separable keywords (comma separated in the UI).
    4. SCRIPT: If language is Sindhi, use PURE ARABIC-SINDHI script. NO Thai, NO Urdu mix.
    5. HASHTAG SCORING: For each main hashtag, assign a "Relevance Score" (0-100) and an "Impact Analysis" based on Dec 2025 trends.

    ALGORITHM EXPLOIT STRATEGY (DEC 2025):
    - VELOCITY SPIKE: Metadata must trigger massive CTR in the first 5 minutes.
    - SESSION START METRIC: Optimize for "Session Time" which YouTube prioritizes in late 2025.

    THUMBNAIL PROMPT SPECIFICATION:
    - Quality: 8K, HDR, Professional Ray-tracing, Vivid colors, 16:9.

    110% REACH HACK:
    Provide a "viralHack110" strategy that explains exactly how to bypass the initial 24-hour review filter.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          titleRoman: { type: Type.STRING },
          descriptionEnglish: { type: Type.STRING, description: "A 500-word SEO optimized description in English" },
          descriptionNative: { type: Type.STRING, description: "A 500-word SEO optimized description in the native language" },
          descriptionRoman: { type: Type.STRING, description: "A 500-word romanized description" },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, minItems: 10 },
          hashtagScores: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                tag: { type: Type.STRING },
                score: { type: Type.NUMBER },
                impact: { type: Type.STRING }
              },
              required: ["tag", "score", "impact"]
            },
            minItems: 10
          },
          tagsEnglish: { type: Type.ARRAY, items: { type: Type.STRING } },
          tagsRoman: { type: Type.ARRAY, items: { type: Type.STRING } },
          thumbnailTextNative: { type: Type.ARRAY, items: { type: Type.STRING } },
          thumbnailTextRoman: { type: Type.ARRAY, items: { type: Type.STRING } },
          thumbnailAIPrompt: { type: Type.STRING },
          hashtagOptimization: {
            type: Type.OBJECT,
            properties: {
              longTailHashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
              nicheHashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
              redundancyReport: { type: Type.STRING },
              suggestedReplacements: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["longTailHashtags", "nicheHashtags", "redundancyReport", "suggestedReplacements"]
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
            },
            required: ["bestUploadTime", "abTesting", "pinnedComment", "keywordStrategy", "engagementBait", "viralHack110"]
          }
        },
        required: [
          "title", "titleRoman", "descriptionEnglish", "descriptionNative", "descriptionRoman", 
          "hashtags", "hashtagScores", "tagsEnglish", "tagsRoman", "thumbnailTextNative", "thumbnailTextRoman", 
          "thumbnailAIPrompt", "hashtagOptimization", "algorithmBoostStrategy"
        ]
      }
    }
  });

  try {
    return JSON.parse(response.text) as SEOPackage;
  } catch (error) {
    console.error("JSON Error:", error);
    throw new Error("Viral Hack Failed. Retrying logic...");
  }
};

export const generateThumbnailImage = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `8K HDR YOUTUBE THUMBNAIL. ${prompt}. Aspect Ratio 16:9. Vivid professional lighting.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Thumbnail generation failed.");
};
