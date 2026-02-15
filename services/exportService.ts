
import { ScrollSection } from "../types";

/**
 * AEON EXPORT ENGINE v7.0 - HIGH-FIDELITY BUILD
 * - Restored full brightness and color.
 * - Fixed "Paused/Jumping" scrub bug.
 * - Precision scroll-to-frame mapping.
 */
export function generateSnippetCode(sections: ScrollSection[], videoUrl: string, sensitivity: number = 0.15): string {
  const isBlob = videoUrl.startsWith('blob:');
  const displayUrl = isBlob ? 'PASTE_YOUR_VIDEO_URL_HERE.mp4' : videoUrl;
  const sectionsJSON = JSON.stringify(sections, null, 2);

  return `<!-- 
     AEON BACKGROUND ENGINE (PRO BUILD)
     Instructions: Paste this block at the VERY BOTTOM of your <body> tag.
-->
<div id="aeon-bg-system">
    <style>
        #aeon-bg-system {
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            z-index: -1; /* Pushes to background */
            overflow: hidden;
            background: #000;
            pointer-events: none;
            margin: 0; padding: 0;
        }

        #aeon-video-element {
            width: 100%; height: 100%;
            object-fit: cover;
            /* Full brightness restored. Slight contrast boost for cinematic feel. */
            opacity: 1;
            filter: contrast(1.05) brightness(0.95);
            display: block;
            will-change: contents;
        }

        .aeon-ghost-overlay {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
        }

        .aeon-ghost-text {
            position: absolute;
            width: 100%;
            padding: 0 10%;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.5s ease, transform 0.8s cubic-bezier(0.1, 1, 0.3, 1);
            pointer-events: none;
        }

        .aeon-ghost-h2 {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            font-size: clamp(3rem, 20vw, 15rem);
            font-weight: 900;
            text-transform: uppercase;
            line-height: 0.8;
            letter-spacing: -0.05em;
            margin: 0;
            color: rgba(255, 255, 255, 0.12); /* Subtle ghost text */
            text-shadow: 0 10px 50px rgba(0,0,0,0.2);
        }

        #aeon-loader-ui {
            position: fixed; inset: 0; z-index: 99999;
            background: #000; display: flex; align-items: center; justify-content: center;
            color: #fff; font-size: 10px; font-weight: 900; letter-spacing: 0.8em;
            transition: opacity 1s ease;
        }
    </style>

    <div id="aeon-loader-ui">AEON_SYSTEM_INIT</div>
    <video id="aeon-video-element" playsinline muted preload="auto" x5-playsinline="true" webkit-playsinline="true"></video>
    <div id="aeon-ghost-stage" class="aeon-ghost-overlay"></div>

    <script>
        (function() {
            const SRC = "${displayUrl}";
            const DATA = ${sectionsJSON};
            const LERP_FACTOR = ${sensitivity};

            const video = document.getElementById('aeon-video-element');
            const stage = document.getElementById('aeon-ghost-stage');
            const loader = document.getElementById('aeon-loader-ui');

            video.src = SRC;
            video.pause();

            // Build narrative segments
            DATA.forEach((s, i) => {
                const div = document.createElement('div');
                div.className = 'aeon-ghost-text';
                div.id = 'aeon-ghost-' + i;
                div.style.textAlign = s.alignment;
                div.innerHTML = \`<h2 class="aeon-ghost-h2">\${s.title}</h2>\`;
                stage.appendChild(div);
            });

            let targetProgress = 0;
            let currentProgress = 0;
            let isSeeking = false;

            function sync() {
                // Apply LERP for buttery smooth motion
                currentProgress += (targetProgress - currentProgress) * LERP_FACTOR;
                
                if (video.duration && !isSeeking) {
                    const safeDur = video.duration - 0.1;
                    const seekTime = safeDur * currentProgress;
                    
                    // Only update if difference is noticeable (> 1/60th of a sec)
                    if (Math.abs(video.currentTime - seekTime) > 0.01) {
                        isSeeking = true;
                        video.currentTime = seekTime;
                    }
                }

                // Update Narrative Opacity
                DATA.forEach((s, i) => {
                    const el = document.getElementById('aeon-ghost-' + i);
                    if (!el) return;
                    const distance = Math.abs(currentProgress - s.triggerTime);
                    const opacity = Math.max(0, 1 - (distance / 0.1)); 
                    
                    el.style.opacity = opacity;
                    el.style.visibility = opacity > 0.01 ? 'visible' : 'hidden';
                    el.style.transform = \`translate3d(0, \${(currentProgress - s.triggerTime) * 150}px, 0)\`;
                });

                requestAnimationFrame(sync);
            }

            // High-precision scroll mapping
            const updateScroll = () => {
                const scrollable = document.documentElement.scrollHeight - window.innerHeight;
                targetProgress = scrollable > 0 ? window.scrollY / scrollable : 0;
            };

            // Prevent video seek-locking (the "pausing" bug)
            video.addEventListener('seeked', () => { isSeeking = false; });

            window.addEventListener('scroll', updateScroll, { passive: true });
            window.addEventListener('resize', updateScroll);

            video.onloadedmetadata = () => {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 1000);
                updateScroll();
                sync();
            };
            
            // Fallback for cached videos
            if (video.readyState >= 2) video.onloadedmetadata();
        })();
    </script>
</div>`;
}
