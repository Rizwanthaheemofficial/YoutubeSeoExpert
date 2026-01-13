
export interface SEOInput {
  userContent: string;
  userLanguage: string;
  channelName: string;
  targetCountry: string;
  videoType: string;
  preferredUploadTime: string;
  isShortsMode: boolean;
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

  thumbnailTextEnglish: string[];
  thumbnailTextRoman: string[];
  thumbnailAIPrompt: string;
  
  algorithmBoostStrategy: {
    viralHack110: string;
  };
}
