
import React, { useRef, useEffect, useState } from 'react';
import { ScrollSection } from '../types';
import { RefreshCw } from 'lucide-react';

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
  const [isLoaded, setIsLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const isSeeking = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setHasError(false);
    setIsLoaded(false);

    // If already primed by browser cache
    if (video.readyState >= 2) {
      setIsLoaded(true);
    }
    
    const handleCanPlay = () => {
      setIsLoaded(true);
      video.pause();
      video.currentTime = 0;
    };

    video.addEventListener('canplay', handleCanPlay, { once: true });
    video.load();
    
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [videoUrl, retryCount]);

  useEffect(() => {
    const animate = () => {
      const lerp = 0.1; 
      currentProgress.current += (targetProgress.current - currentProgress.current) * lerp;
      
      const progress = currentProgress.current;
      const video = videoRef.current;

      if (video && video.readyState >= 2 && video.duration && !isNaN(video.duration) && !isSeeking.current) {
        const safeDuration = video.duration - 0.1;
        const targetTime = safeDuration * progress;
        
        if (Math.abs(video.currentTime - targetTime) > 0.02) {
          isSeeking.current = true;
          video.currentTime = targetTime;
        }
      }

      sections.forEach((section, idx) => {
        const el = sectionRefs.current[idx];
        if (!el) return;

        const distance = Math.abs(progress - section.triggerTime);
        const windowSize = 0.12; 
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

  const handleError = () => {
    console.warn("AEON Engine // Media load failed for source:", videoUrl);
    setHasError(true);
  };

  const handleManualRetry = () => {
    setHasError(false);
    setIsLoaded(false);
    setRetryCount(prev => prev + 1);
  };

  return (
    <div ref={containerRef} className="relative w-full h-[800vh] bg-black">
      
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden z-0 pointer-events-none">
        
        <div className="absolute inset-0 z-0 bg-black">
          {!hasError ? (
            <video
              key={`${videoUrl}-${retryCount}`} 
              ref={videoRef}
              src={videoUrl}
              onSeeked={handleSeeked}
              playsInline
              muted
              preload="auto"
              onError={handleError}
              className={`w-full h-full object-cover transition-opacity duration-1000 brightness-90 contrast-110 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 p-10">
              <div className="text-white/10 font-black tracking-widest text-4xl mb-8 uppercase text-center max-w-2xl">MEDIA_LOAD_TERMINATED</div>
              <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-10 text-center">The browser could not load this asset. This is often due to strict network settings or an unsupported codec.</p>
              <button 
                onClick={handleManualRetry}
                className="pointer-events-auto flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all"
              >
                <RefreshCw size={18} className="text-indigo-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">Retry System Load</span>
              </button>
            </div>
          )}
          
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
               <div className="flex flex-col items-center gap-6">
                 <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                 <span className="text-[10px] font-black text-white/40 tracking-[0.5em] uppercase">Priming Assets</span>
               </div>
            </div>
          )}
        </div>

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

      <div className="relative z-20">
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-4xl bg-black/60 p-12 rounded-[3rem] border border-white/10 backdrop-blur-xl">
            <h1 className="text-6xl md:text-[10rem] font-black tracking-tighter text-white mb-6 leading-none">
              AEON<br/>SCROLL
            </h1>
            <p className="text-indigo-400 text-[11px] font-black tracking-[0.8em] uppercase">
              Begin Scrolling to Explore
            </p>
          </div>
        </section>

        <section className="min-h-screen flex items-center justify-center p-10">
          <div className="bg-zinc-900/90 backdrop-blur-3xl border border-white/20 p-16 rounded-[4rem] max-w-3xl pointer-events-auto text-center shadow-[0_0_80px_rgba(0,0,0,0.5)]">
             <h3 className="text-5xl font-black text-white mb-6 uppercase tracking-tight">PRECISION SYNC.</h3>
             <p className="text-white/60 text-base leading-relaxed font-medium">
               The engine maps every scroll unit to a specific video frame. 
               The video in the background responds directly to your scrolling speed.
             </p>
          </div>
        </section>

        <div className="h-[400vh]" />
      </div>

    </div>
  );
};

export default VideoScroller;
