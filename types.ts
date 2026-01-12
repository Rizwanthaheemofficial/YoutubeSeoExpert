
export interface SEOInput {
  userContent: string;
  userLanguage: string;
  channelName: string;
  targetCountry: string;
  videoType: string;
  preferredUploadTime: string;
  isShortsMode: boolean;
}

export interface VideoChapter {
  timestamp: string;
  title: string;
}

export interface AlgorithmInsight {
  trend: string;
  impact: 'High' | 'Critical';
  hack: string;
}

export interface LaunchStep {
  timeframe: string;
  action: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface SEOPackage {
  // Dual Language Strategy: English & Roman Sindhi
  titleEnglish: string;
  titleRoman: string;
  
  descriptionEnglish: string;
  descriptionRoman: string;
  
  tagsEnglish: string[];
  tagsRoman: string[];
  
  hashtagsEnglish: string[];
  hashtagsRoman: string[];

  videoChapters: VideoChapter[];
  lsiKeywords: string[];
  
  // High-Retention Hooks
  retentionHooksEnglish: string[];
  retentionHooksRoman: string[];
  
  metadataRecommendations: {
    category: string;
    location: string;
    recordingDate: string;
    license: string;
  };
  
  thumbnailTextEnglish: string[];
  thumbnailTextRoman: string[];
  thumbnailAIPrompt: string;
  
  communityPostEnglish: string;
  communityPostRoman: string;
  
  dailyAlgoInsights: AlgorithmInsight[];
  launchRoadmap: LaunchStep[];
  
  outroStrategy: {
    endScreen: string;
    cards: string;
  };
  
  algorithmBoostStrategy: {
    bestUploadTime: string;
    abTesting: string;
    pinnedComment: string;
    keywordStrategy: string;
    engagementBait: string;
    viralHack110: string;
  };

  // Grounding metadata for deployment transparency
  groundingSources?: GroundingSource[];
}
