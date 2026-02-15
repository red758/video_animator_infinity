
import React, { useRef, useEffect, useState } from 'react';
import { ScrollSection } from '../types';

interface VideoScrollerProps {
  videoUrl: string;
  sections: ScrollSection[];
  onUpdateSection?: (index: number, section: ScrollSection) => void;
  isEditMode?: boolean;
}

const VideoScroller: React.FC<VideoScrollerProps> = ({ videoUrl, sections, onUpdateSection, isEditMode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const [hasError, setHasError] = useState(false);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const isSeeking = useRef(false);

  useEffect(() => {
    const animate = () => {
      const lerp = 0.1; 
      currentProgress.current += (targetProgress.current - currentProgress.current) * lerp;
      
      const progress = currentProgress.current;
      const video = videoRef.current;

      if (video && video.duration && !isNaN(video.duration) && !isSeeking.current) {
        const safeDuration = video.duration - 0.1;
        const targetTime = safeDuration * progress;
        
        if (Math.abs(video.currentTime - targetTime) > 0.01) {
          isSeeking.current = true;
          video.currentTime = targetTime;
        }
      }

      sections.forEach((section, idx) => {
        const el = sectionRefs.current[idx];
        if (!el) return;

        const distance = Math.abs(progress - section.triggerTime);
        const windowSize = 0.1; 
        const opacity = Math.max(0, 1 - (distance / windowSize));
        
        el.style.opacity = opacity.toString();
        el.style.visibility = opacity > 0.01 ? 'visible' : 'hidden';
        
        const yOffset = (progress - section.triggerTime) * 150;
        el.style.transform = `translate3d(0, ${yOffset}px, 0)`;
      });

      requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScrollable > 0) {
        targetProgress.current = Math.max(0, Math.min(1, -rect.top / totalScrollable));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    const rafid = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafid);
    };
  }, [sections]);

  const handleSeeked = () => {
    isSeeking.current = false;
  };

  return (
    <div ref={containerRef} className="relative w-full h-[800vh] bg-black">
      
      {/* 1. BACKGROUND ENGINE LAYER */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden z-0 pointer-events-none">
        
        <div className="absolute inset-0 z-0">
          {!hasError ? (
            <video
              ref={videoRef}
              src={videoUrl}
              onSeeked={handleSeeked}
              playsInline
              muted
              preload="auto"
              onError={() => setHasError(true)}
              className="w-full h-full object-cover brightness-75 contrast-125"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/10 font-black tracking-widest">VIDEO_STREAM_ERROR</div>
          )}
        </div>

        {/* GHOST TEXT LAYER - NOW MORE VISIBLE */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          {sections.map((section, idx) => (
            <div
              key={idx}
              ref={(el) => { sectionRefs.current[idx] = el; }}
              className="absolute w-full px-10 md:px-20"
              style={{ opacity: 0, visibility: 'hidden', textAlign: section.alignment as any }}
            >
              {isEditMode ? (
                <div className="pointer-events-auto max-w-4xl mx-auto">
                  <input 
                    className="bg-zinc-900/90 border-2 border-indigo-500/50 p-6 rounded-2xl outline-none text-3xl md:text-7xl font-black tracking-tighter text-white w-full text-center shadow-2xl"
                    value={section.title}
                    onChange={(e) => onUpdateSection?.(idx, { ...section, title: e.target.value })}
                  />
                  <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.5em] mt-4">Narrative Block {idx + 1}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <h2 className="text-6xl md:text-[14rem] font-black tracking-tighter text-white/20 leading-none select-none uppercase drop-shadow-2xl">
                    {section.title}
                  </h2>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. FOREGROUND CONTENT LAYER */}
      <div className="relative z-20">
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-4xl bg-black/40 p-12 rounded-[3rem] border border-white/10 backdrop-blur-xl">
            <h1 className="text-6xl md:text-[10rem] font-black tracking-tighter text-white mb-6 leading-none">
              LIVE<br/>PREVIEW
            </h1>
            <p className="text-indigo-400 text-[11px] font-black tracking-[0.8em] uppercase">
              Begin Scrolling to Play
            </p>
          </div>
        </section>

        <section className="min-h-screen flex items-center justify-center p-10">
          <div className="bg-zinc-900/90 backdrop-blur-3xl border border-white/20 p-16 rounded-[4rem] max-w-3xl pointer-events-auto text-center shadow-[0_0_80px_rgba(0,0,0,0.5)]">
             <h3 className="text-5xl font-black text-white mb-6 uppercase tracking-tight">PRECISION SYNC.</h3>
             <p className="text-white/60 text-base leading-relaxed font-medium">
               The engine maps every scroll unit to a specific video frame. 
               This section is fully opaque to ensure your content is the main focus 
               while the cinematic background creates the atmosphere.
             </p>
          </div>
        </section>

        <div className="h-[400vh]" />
      </div>

    </div>
  );
};

export default VideoScroller;
