import React, { useRef, useEffect, useState } from 'react';
import { ScrollSection } from '../types';
import InfinityLogo from './Logo';

interface VideoScrollerProps {
  videoUrl: string;
  sections: ScrollSection[];
}

const VideoScroller: React.FC<VideoScrollerProps> = ({ videoUrl, sections }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoLayerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const hudSyncRef = useRef<HTMLSpanElement>(null);

  const [hasError, setHasError] = useState(false);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const lastSeekTime = useRef(0);

  useEffect(() => {
    const animate = (time: number) => {
      // Adjusted LERP for better responsiveness vs smoothness balance
      const lerp = 0.075;
      currentProgress.current += (targetProgress.current - currentProgress.current) * lerp;
      
      const progress = currentProgress.current;
      const video = videoRef.current;

      // 1. Optimized Scrubbing Engine
      if (video && video.duration && !isNaN(video.duration)) {
        const targetTime = video.duration * progress;
        const diff = Math.abs(video.currentTime - targetTime);
        const timeSinceLastSeek = time - lastSeekTime.current;

        // Increase threshold slightly to avoid jitter (0.05s)
        // Only seek if significantly different or if some time has passed to let the decoder breathe
        if (!video.seeking && video.readyState >= 2 && (diff > 0.05 || timeSinceLastSeek > 33)) {
          video.currentTime = targetTime;
          lastSeekTime.current = time;
        }

        if (videoLayerRef.current) {
          // Subtle zoom out effect for depth
          const zoom = 1.05 - (progress * 0.05);
          videoLayerRef.current.style.transform = `scale3d(${zoom}, ${zoom}, 1)`;
        }
      }

      // 2. Telemetry & Progress
      if (progressBarRef.current) progressBarRef.current.style.width = `${progress * 100}%`;
      if (hudSyncRef.current) hudSyncRef.current.textContent = `${(progress * 100).toFixed(1)}%`;

      // 3. Section Transitions
      sections.forEach((section, idx) => {
        const el = sectionRefs.current[idx];
        if (!el) return;

        const distance = Math.abs(progress - section.triggerTime);
        const windowSize = 0.09; // Slightly wider window for smoother fades
        const opacity = Math.max(0, 1 - (distance / windowSize));
        const isActive = distance < windowSize;

        el.style.opacity = opacity.toString();
        el.style.visibility = opacity > 0.01 ? 'visible' : 'hidden';
        
        // Parallel motion for content
        const yOffset = (progress - section.triggerTime) * 120;
        el.style.transform = `translate3d(0, ${yOffset}px, 0)`;

        const title = el.querySelector('h2');
        const body = el.querySelector('.text-wrapper');
        if (title && body) {
          if (isActive) {
            (title as HTMLElement).style.transform = 'translate3d(0, 0, 0)';
            (body as HTMLElement).style.opacity = '1';
          } else {
            (title as HTMLElement).style.transform = 'translate3d(0, 110%, 0)';
            (body as HTMLElement).style.opacity = '0';
          }
        }
      });

      requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollable = containerRef.current.offsetHeight - window.innerHeight;
      // Clamp progress
      const prog = Math.max(0, Math.min(1, -rect.top / scrollable));
      targetProgress.current = prog;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    const rafid = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafid);
    };
  }, [sections]);

  return (
    <div ref={containerRef} className="relative w-full h-[1400vh] bg-[#020202]">
      <div className="sticky top-0 left-0 w-full h-screen h-[100dvh] overflow-hidden bg-black">
        
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-black to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.8)_160%)]" />
        </div>

        {/* Video Core */}
        <div 
          ref={videoLayerRef}
          className="absolute inset-0 z-0 bg-[#050505] opacity-65 transition-opacity duration-1000"
        >
          {!hasError ? (
            <video
              ref={videoRef}
              src={videoUrl}
              playsInline
              muted
              preload="auto"
              onError={() => setHasError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
               <span className="text-[10px] font-black text-white/10 uppercase tracking-[1em]">Asset Load Error</span>
            </div>
          )}
        </div>

        {/* Narrative Layers */}
        <div className="absolute inset-0 z-20 flex pointer-events-none">
          {sections.map((section, idx) => (
            <div
              key={idx}
              ref={(el) => { sectionRefs.current[idx] = el; }}
              className={`absolute inset-0 flex px-8 md:px-24 py-16 ${
                section.alignment === 'left' ? 'justify-start items-center text-left' : 
                section.alignment === 'right' ? 'justify-end items-center text-right' : 
                'justify-center items-center text-center'
              }`}
              style={{ opacity: 0, visibility: 'hidden' }}
            >
              <div className="max-w-4xl w-full">
                <div className="overflow-hidden mb-8">
                   <h2 className="text-[clamp(2.5rem,8vw,5.5rem)] font-black uppercase italic tracking-[-0.06em] leading-[0.9] pb-2 transition-transform duration-1000 cubic-bezier(0.16, 1, 0.3, 1) text-white">
                     {section.title}
                   </h2>
                </div>
                <div className={`text-wrapper transition-all duration-1000 delay-300 border-indigo-600/40 ${section.alignment === 'right' ? 'border-r-2 pr-10 ml-auto' : section.alignment === 'center' ? 'px-10 mx-auto' : 'border-l-2 pl-10'}`}>
                  <p className="text-lg md:text-2xl text-white/40 font-light leading-relaxed italic tracking-[0.04em] uppercase max-w-lg">
                    {section.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* HUD Data */}
        <div className="absolute bottom-16 left-12 z-40 flex items-end gap-12 pointer-events-none opacity-40">
           <div className="flex flex-col gap-3">
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.4em] italic">INFINITY_SYNC_ENGINE</span>
              <div className="flex items-center gap-6">
                 <InfinityLogo size={28} className="text-white/20" />
                 <div className="flex flex-col gap-1 font-mono text-[8px] text-white/30 uppercase tracking-[0.2em]">
                    <span ref={hudSyncRef} className="tabular-nums text-indigo-400 font-bold">0.0%</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Progress System */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5 z-50 overflow-hidden">
           <div 
             ref={progressBarRef}
             className="h-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]" 
             style={{ width: '0%' }}
           />
        </div>
      </div>
    </div>
  );
};

export default VideoScroller;