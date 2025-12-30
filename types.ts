
export interface SEOInput {
  userContent: string;
  userLanguage: string;
  channelName: string;
  targetCountry: string;
  videoType: string;
  preferredUploadTime: string;
}

export interface HashtagScore {
  tag: string;
  score: number; // 0-100
  impact: string; // e.g., "High Viral Potential", "Steady Growth", "Niche Authority"
}

export interface SEOPackage {
  title: string;
  titleRoman: string;
  descriptionEnglish: string;
  descriptionNative: string;
  descriptionRoman: string;
  hashtags: string[];
  hashtagScores: HashtagScore[];
  tagsEnglish: string[];
  tagsRoman: string[];
  thumbnailTextNative: string[];
  thumbnailTextRoman: string[];
  thumbnailAIPrompt: string;
  hashtagOptimization: {
    longTailHashtags: string[];
    nicheHashtags: string[];
    redundancyReport: string;
    suggestedReplacements: string[];
  };
  algorithmBoostStrategy: {
    bestUploadTime: string;
    abTesting: string;
    pinnedComment: string;
    keywordStrategy: string;
    engagementBait: string;
    viralHack110: string;
  };
}
