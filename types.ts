
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
  brandName: string;
  sensitivity: number;
  scrollDepth: number;
  startOffset: number; 
  endOffset: number;
  layoutMode: 'section' | 'background';
  // Positioning Authority properties
  viewportAnchor: number; // 0 = Top of screen, 0.5 = Center, 1 = Bottom
  widthMode: 'full' | 'boxed';
  maxWidth: string; // e.g. "1200px" or "90%"
  topSpacer: number; // For previewing context
  bottomSpacer: number; // For previewing context
}