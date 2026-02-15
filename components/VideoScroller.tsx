
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
      
      {/* 1. BACKGROUND ENGINE LAYER (RE-SYNCHRONIZED) */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden z-0 pointer-events-none">
        
        {/* VIDEO SCRUBBER - HIGH FIDELITY */}
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
              className="w-full h-full object-cover filter contrast-[1.05] brightness-90"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/5 font-black uppercase tracking-[1em]">IO_STREAM_FAULT</div>
          )}
        </div>

        {/* GHOST TEXT LAYER */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          {sections.map((section, idx) => (
            <div
              key={idx}
              ref={(el) => { sectionRefs.current[idx] = el; }}
              className="absolute w-full px-20"
              style={{ opacity: 0, visibility: 'hidden', textAlign: section.alignment as any }}
            >
              {isEditMode ? (
                <div className="pointer-events-auto max-w-4xl mx-auto">
                  <input 
                    className="bg-black/40 border border-white/10 px-6 py-4 rounded-xl outline-none text-4xl md:text-8xl font-black tracking-tighter text-white w-full focus:border-indigo-500 transition-all text-center backdrop-blur-xl shadow-2xl"
                    value={section.title}
                    onChange={(e) => onUpdateSection?.(idx, { ...section, title: e.target.value })}
                  />
                </div>
              ) : (
                <h2 className="text-7xl md:text-[18rem] font-black tracking-tighter text-white/[0.1] leading-none select-none uppercase drop-shadow-2xl">
                  {section.title}
                </h2>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. FOREGROUND LAYER (PREVIEW) */}
      <div className="relative z-20">
        <section className="min-h-screen flex items-center justify-center px-10">
          <div className="text-center max-w-6xl">
            <h1 className="text-8xl md:text-[14rem] font-black tracking-tighter text-white mb-8 drop-shadow-2xl leading-[0.75]">
              VIVID<br/>
              REALITY
            </h1>
            <p className="text-white/60 text-[10px] md:text-xs font-black tracking-[1em] uppercase max-w-2xl mx-auto leading-loose bg-black/40 p-5 rounded-full backdrop-blur-3xl border border-white/5">
              Engine Version 7.0 Active
            </p>
          </div>
        </section>

        <section className="min-h-screen flex items-center justify-center p-20">
          <div className="bg-black/60 backdrop-blur-3xl border border-white/10 p-20 rounded-[5rem] max-w-3xl pointer-events-auto text-center shadow-2xl">
             <h3 className="text-6xl font-black text-white mb-10 tracking-tighter uppercase leading-none">NO MORE<br/>PAUSING.</h3>
             <p className="text-white/40 text-sm leading-relaxed font-bold tracking-[0.2em] uppercase">
               The seek logic is now throttled and optimized for browser playback buffers. 
               The video follows your scroll with zero stutter.
             </p>
          </div>
        </section>

        <div className="h-[400vh]" />
      </div>

    </div>
  );
};

export default VideoScroller;
