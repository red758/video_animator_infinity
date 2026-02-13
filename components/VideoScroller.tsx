
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

  const [isReady, setIsReady] = useState(false);
  
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const lastTime = useRef(0);
  const lastSeekTime = useRef(0);

  useEffect(() => {
    // Initial setup
    if (videoRef.current) {
      videoRef.current.load();
    }

    const animate = (time: number) => {
      // Smoother interpolation logic
      const deltaTime = time - lastTime.current;
      lastTime.current = time;

      // Adjust LERP based on frame time for consistency
      const lerpFactor = 0.085;
      currentProgress.current += (targetProgress.current - currentProgress.current) * lerpFactor;

      const video = videoRef.current;
      const progress = currentProgress.current;

      // 1. Optimized Video Scrubbing
      if (video && video.duration && !isNaN(video.duration)) {
        const targetTime = video.duration * progress;
        const timeSinceLastSeek = time - lastSeekTime.current;
        const diff = Math.abs(video.currentTime - targetTime);

        // STRATEGY: Don't overwhelm the decoder. 
        // Only seek if we have a meaningful difference AND we aren't spamming.
        if (!video.seeking && (diff > 0.033 || timeSinceLastSeek > 40)) {
          video.currentTime = targetTime;
          lastSeekTime.current = time;
        }

        // Apply hardware accelerated transforms to the video container
        if (videoLayerRef.current) {
          const zoom = 1 + progress * 0.045;
          const brightness = 0.45 + (1 - progress) * 0.2;
          videoLayerRef.current.style.transform = `scale3d(${zoom}, ${zoom}, 1)`;
          videoLayerRef.current.style.opacity = brightness.toString();
        }
      }

      // 2. Direct DOM UI Updates (Bypassing React for high-frequency elements)
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${progress * 100}%`;
      }
      if (hudSyncRef.current) {
        hudSyncRef.current.textContent = `${(progress * 100).toFixed(1)}%`;
      }

      // 3. Narrative Section Transitions
      sections.forEach((section, idx) => {
        const el = sectionRefs.current[idx];
        if (!el) return;

        const distance = Math.abs(progress - section.triggerTime);
        const visibilityWindow = 0.07;
        const isActive = distance < visibilityWindow;
        
        // Advanced opacity curve for smooth fade
        const opacity = Math.max(0, 1 - (distance / visibilityWindow));
        const yOffset = (progress - section.triggerTime) * 140;

        el.style.opacity = opacity.toString();
        el.style.visibility = opacity > 0.01 ? 'visible' : 'hidden';
        el.style.transform = `translate3d(0, ${yOffset}px, 0)`;

        // Handle internal text animations
        const title = el.querySelector('h2');
        const body = el.querySelector('.text-wrapper');
        if (title && body) {
          if (isActive) {
            (title as HTMLElement).style.transform = 'translate3d(0, 0, 0)';
            (body as HTMLElement).style.opacity = '1';
            (body as HTMLElement).style.transform = 'translate3d(0, 0, 0)';
          } else {
            (title as HTMLElement).style.transform = 'translate3d(0, 110%, 0)';
            (body as HTMLElement).style.opacity = '0';
            (body as HTMLElement).style.transform = 'translate3d(0, 20px, 0)';
          }
        }
      });

      requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalHeight = containerRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollable = totalHeight - viewportHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
      targetProgress.current = progress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    const rafid = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafid);
    };
  }, [sections]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[1200vh] bg-black"
      id="aeon-engine"
    >
      <div className="sticky top-0 left-0 w-full h-[100vh] h-[100dvh] overflow-hidden bg-black">
        
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-black via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.95)_180%)]" />
        </div>

        {/* Video Engine - Highly Optimized Container */}
        <div 
          ref={videoLayerRef}
          className="absolute inset-0 z-0 will-change-transform will-change-opacity transition-opacity duration-1000"
          style={{ opacity: isReady ? 0.6 : 0 }}
        >
          <video
            ref={videoRef}
            src={videoUrl}
            playsInline
            muted
            preload="auto"
            onLoadedData={() => setIsReady(true)}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Narrative Engine Content */}
        <div className="absolute inset-0 z-20 flex pointer-events-none">
          {sections.map((section, idx) => (
            <div
              key={idx}
              ref={(el) => (sectionRefs.current[idx] = el)}
              className={`absolute inset-0 flex px-8 md:px-24 py-16 ${
                section.alignment === 'left' ? 'justify-start items-center text-left' : 
                section.alignment === 'right' ? 'justify-end items-center text-right' : 
                'justify-center items-center text-center'
              }`}
              style={{ opacity: 0, visibility: 'hidden', willChange: 'transform, opacity' }}
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

        {/* HUD Telemetry */}
        <div className="absolute bottom-16 left-12 z-40 flex items-end gap-12 pointer-events-none opacity-40">
           <div className="flex flex-col gap-3">
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.4em] italic">Engine_Live_v4</span>
              <div className="flex items-center gap-6">
                 <InfinityLogo size={28} className="text-white/20" />
                 <div className="h-8 w-[1px] bg-white/10" />
                 <div className="flex flex-col gap-1 font-mono text-[8px] text-white/30 uppercase tracking-[0.2em]">
                    <span className="tabular-nums">FPS: 60.00</span>
                    <span ref={hudSyncRef} className="tabular-nums text-indigo-400">0.0%</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Progress System */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5 z-50 overflow-hidden">
           <div 
             ref={progressBarRef}
             className="h-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.8)]" 
             style={{ width: '0%' }}
           />
        </div>
      </div>
    </div>
  );
};

export default VideoScroller;
