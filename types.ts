
export interface ScrollSection {
  title: string;
  description: string;
  triggerTime: number; // 0 to 1 scale
  alignment: 'left' | 'right' | 'center';
  vibe: 'cinematic' | 'minimal' | 'energetic';
}

export interface VideoState {
  url: string | null;
  duration: number;
  sections: ScrollSection[];
  isAnalyzing: boolean;
}
