import React, { useRef, useEffect, useState } from 'react';
import { ScrollSection } from '../types';

interface VideoScrollerProps {
  videoUrl: string;
  sections: ScrollSection[];
  onUpdateSection?: (index: number, section: ScrollSection) => void;
  isEditMode?: boolean;
  layoutMode?: 'section' | 'background';
  scrollDepth: number;
  sensitivity: number;
}

const VideoScroller: React.FC<VideoScrollerProps> = ({ 
  videoUrl, 
  sections, 
  onUpdateSection, 
  isEditMode,
  layoutMode = 'section',
  scrollDepth,
  sensitivity
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const lastTimeRef = useRef(-1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    setIsLoaded(false);
    video.src = videoUrl;
    video.load();

    const handleLoaded = () => {
      setIsLoaded(true);
      video.currentTime = 0.01; 
    };

    video.addEventListener('loadedmetadata', handleLoaded);
    return () => video.removeEventListener('loadedmetadata', handleLoaded);
  }, [videoUrl]);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollableHeight = containerRef.current.offsetHeight - window.innerHeight;
      
      if (totalScrollableHeight > 0) {
        // Calculate progress based on relative position to viewport
        const rawProgress = -rect.top / totalScrollableHeight;
        targetProgress.current = Math.max(0, Math.min(1, rawProgress));
      }
    };

    const animate = () => {
      // Smooth LERP movement
      currentProgress.current += (targetProgress.current - currentProgress.current) * sensitivity;
      const progress = currentProgress.current;

      const video = videoRef.current;
      // LAG-FREE SCRUBBING: Check video state before requesting new frame
      if (video && isLoaded && video.duration > 0 && !video.seeking) {
        const targetTime = (video.duration - 0.1) * progress;
        // Only seek if change is significant enough to prevent microscopic micro-lag
        if (Math.abs(video.currentTime - targetTime) > 0.04) {
          video.currentTime = targetTime;
        }
      }

      // Animate the Text Overlays
      sections.forEach((section, idx) => {
        const el = sectionRefs.current[idx];
        if (!el) return;
        
        const distance = Math.abs(progress - section.triggerTime);
        const opacity = Math.max(0, 1 - (distance / 0.15));
        
        el.style.opacity = opacity.toString();
        el.style.visibility = opacity > 0.01 ? 'visible' : 'hidden';
        const yOffset = (progress - section.triggerTime) * -120;
        el.style.transform = `translate3d(0, ${yOffset}px, 0)`;
      });

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    rafId = requestAnimationFrame(animate);
    handleScroll();

    return () => { 
      window.removeEventListener('scroll', handleScroll); 
      cancelAnimationFrame(rafId); 
    };
  }, [sections, isLoaded, layoutMode, scrollDepth, sensitivity]);

  // Height defines the scrolling distance
  const containerStyles = { height: `${scrollDepth * 100}vh` };

  // Fixed for background, Sticky for section
  // Added dvh (dynamic viewport height) support for mobile stability to keep stage pinned
  const stageClass = layoutMode === 'background' 
    ? "fixed inset-0 w-full h-full h-[100dvh] z-0"
    : "sticky top-0 left-0 w-full h-screen h-[100dvh] z-0";

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full block ${layoutMode === 'section' ? 'my-0' : ''}`} 
      style={containerStyles}
    >
      <div className={`${stageClass} overflow-hidden bg-black`}>
        <video 
          ref={videoRef} 
          playsInline 
          muted 
          preload="auto" 
          className={`w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
        />
        <div className="absolute inset-0 bg-black/40 pointer-events-none z-[5]" />
        
        {/* Narrative Nodes Overlay */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none px-6">
          {sections.map((section, idx) => (
            <div 
              key={idx} 
              ref={(el) => { sectionRefs.current[idx] = el; }} 
              className="absolute w-full max-w-7xl mx-auto" 
              style={{ opacity: 0, visibility: 'hidden', textAlign: section.alignment as any }}
            >
              <div className={`${isEditMode ? 'pointer-events-auto' : ''}`}>
                <h2 className="text-5xl md:text-[9vw] font-black text-white leading-[0.8] uppercase tracking-tighter drop-shadow-2xl">
                  {isEditMode ? (
                    <input 
                      className="bg-black/40 border-b-2 border-indigo-500 outline-none w-full text-center px-4 py-2 rounded-t-xl"
                      value={section.title}
                      onChange={(e) => onUpdateSection?.(idx, { ...section, title: e.target.value })}
                    />
                  ) : section.title}
                </h2>
                <p className="mt-8 text-white/50 text-xs md:text-2xl font-black tracking-[0.4em] uppercase max-w-5xl mx-auto leading-relaxed drop-shadow-xl">
                  {section.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Background Mode Content Simulation */}
      {layoutMode === 'background' && !isEditMode && (
        <div className="relative z-20 pointer-events-none pt-[120vh]">
          <div className="max-w-4xl mx-auto px-10 space-y-[100vh] pb-[100vh]">
            <div className="space-y-6 opacity-30 text-white">
               <div className="h-1 w-20 bg-indigo-500"></div>
               <h3 className="text-5xl font-black uppercase tracking-tighter">Your Dynamic Content</h3>
               <p className="text-xl font-medium leading-relaxed">In "Global Mode", the video remains fixed as the site backdrop. Your existing sections, text, and imagery glide over it with professional depth.</p>
            </div>
            <div className="space-y-6 opacity-30 text-right text-white">
               <h3 className="text-5xl font-black uppercase tracking-tighter">Parallax Subconscious</h3>
               <p className="text-xl font-medium leading-relaxed">The Aeon engine manages the sync state while your brand story unfolds at the center of the user's attention.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoScroller;