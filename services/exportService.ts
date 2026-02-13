
import { ScrollSection } from "../types";

export function generateStandaloneHTML(sections: ScrollSection[]): string {
  const sectionsJSON = JSON.stringify(sections, null, 2);

  return `<!DOCTYPE html>
<!-- 
  ========================================================================
  AEON // INFINITY - EXPORTED EXPERIENCE
  ========================================================================
  
  IMPLEMENTATION STEPS:
  1. ASSETS: Host your video file (.mp4) on your server or a CDN.
  2. CONFIG: Update 'videoURL' in the CONFIG object below.
  3. TEXT: To remove or change text, edit the 'sections' array in the script.
  4. HIDE TEXT: Set 'showNarrative: false' in CONFIG to hide all text overlays.
  ========================================================================
-->

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AEON CINEMATIC NARRATIVE</title>
    <style>
        :root {
            --brand-color: #4f46e5;
            --bg-color: #000;
            --text-primary: #fff;
            --text-secondary: rgba(255, 255, 255, 0.4);
        }

        body { 
            margin: 0; 
            background: var(--bg-color); 
            overflow-x: hidden; 
            color: var(--text-primary); 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
        }

        #aeon-root { 
            position: relative; 
            width: 100%; 
            height: 1000vh;
        }

        .cinema-viewport {
            position: sticky; 
            top: 0; 
            width: 100%; 
            height: 100vh; 
            height: 100dvh; 
            overflow: hidden;
            background: #000;
        }

        .video-container {
            position: absolute; 
            inset: 0; 
            z-index: 0; 
            will-change: transform, opacity; 
            pointer-events: none;
            opacity: 0.6;
        }

        #sm-video-element {
            width: 100%; 
            height: 100%; 
            object-fit: cover; 
            display: block;
        }

        .vignette {
            position: absolute; 
            inset: 0; 
            background: radial-gradient(circle, transparent 30%, rgba(0,0,0,0.95) 160%);
            z-index: 1;
        }

        .cinema-title { 
            font-weight: 900; 
            text-transform: uppercase; 
            font-style: italic; 
            color: var(--text-primary); 
            margin: 0; 
            line-height: 0.85; 
            letter-spacing: -0.06em; 
            font-size: clamp(3rem, 10vw, 7.5rem); 
        }

        .cinema-body { 
            font-weight: 300; 
            text-transform: uppercase; 
            font-style: italic; 
            letter-spacing: 0.05em; 
            color: var(--text-secondary); 
            font-size: clamp(1.1rem, 2vw, 2rem); 
            line-height: 1.5; 
            margin: 0;
        }

        .text-wrapper {
            border-left: 2px solid var(--brand-color);
            padding-left: 2rem;
            transition: all 1s 0.3s;
            opacity: 0;
            transform: translateY(20px);
        }

        #sm-progress-bar {
            position: absolute; 
            bottom: 0; 
            left: 0; 
            height: 3px; 
            background: var(--brand-color); 
            width: 0%; 
            z-index: 20;
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: var(--brand-color); border-radius: 10px; }
    </style>
</head>
<body>

<div id="aeon-root">
    <div class="cinema-viewport">
        <div class="video-container" id="sm-video-layer">
            <video id="sm-video-element" playsinline muted preload="auto"></video>
            <div class="vignette"></div>
        </div>
        <div id="sm-ui-layer" style="position: absolute; inset: 0; z-index: 10; pointer-events: none;"></div>
        <div id="sm-progress-bar"></div>
    </div>
</div>

<script>
(function() {
    const CONFIG = {
        // TODO: Update your video URL here
        videoURL: "REPLACE_WITH_YOUR_VIDEO_URL.mp4", 
        
        // Change to 'false' if you want to remove all text overlays entirely
        showNarrative: true,
        
        smoothness: 0.08,
        visibilityWindow: 0.07,
        maxZoom: 0.045
    };

    /**
     * NARRATIVE DATA
     * Edit or remove items below to customize the text sections.
     */
    const sections = ${sectionsJSON};
    
    const video = document.getElementById('sm-video-element');
    const videoLayer = document.getElementById('sm-video-layer');
    const uiLayer = document.getElementById('sm-ui-layer');
    const progressBar = document.getElementById('sm-progress-bar');
    const root = document.getElementById('aeon-root');

    video.src = CONFIG.videoURL;
    video.load();

    let targetScroll = 0;
    let currentScroll = 0;
    let lastSeekTime = 0;

    // Build sections only if showNarrative is enabled
    if (CONFIG.showNarrative) {
        sections.forEach((s, i) => {
            const wrap = document.createElement('div');
            wrap.id = 'section-' + i;
            wrap.style.cssText = 'position:absolute; inset:0; display:flex; padding:10%; opacity:0; visibility:hidden; transition:opacity 0.5s; will-change:transform, opacity;';
            
            const alignmentStyles = {
                left: 'justify-content:flex-start; align-items:center; text-align:left;',
                right: 'justify-content:flex-end; align-items:center; text-align:right;',
                center: 'justify-content:center; align-items:center; text-align:center;'
            };
            wrap.style.cssText += alignmentStyles[s.alignment] || alignmentStyles.center;

            wrap.innerHTML = \`
                <div style="max-width: 55rem; width: 100%;">
                    <div style="overflow:hidden; margin-bottom: 2.5rem;">
                      <h2 id="title-\${i}" class="cinema-title" style="transition: transform 1.2s cubic-bezier(.16,1,.3,1); transform: translate3d(0, 110%, 0);">\${s.title}</h2>
                    </div>
                    <div id="body-\${i}" class="text-wrapper" style="opacity: 0; transform: translate3d(0, 20px, 0);">
                      <p class="cinema-body">\${s.description}</p>
                    </div>
                </div>
            \`;
            uiLayer.appendChild(wrap);
        });
    }

    function render(time) {
        currentScroll += (targetScroll - currentScroll) * CONFIG.smoothness;

        if (video.duration) {
            const targetTime = video.duration * currentScroll;
            const timeSinceLastSeek = time - lastSeekTime;

            if (!video.seeking && (Math.abs(video.currentTime - targetTime) > 0.033 || timeSinceLastSeek > 40)) {
                video.currentTime = targetTime;
                lastSeekTime = time;
            }
            
            const zoom = 1 + (currentScroll * CONFIG.maxZoom);
            const opacity = 0.5 + (1 - currentScroll) * 0.2;
            videoLayer.style.transform = \`scale3d(\${zoom}, \${zoom}, 1)\`;
            videoLayer.style.opacity = opacity;
        }

        progressBar.style.width = (currentScroll * 100) + '%';

        if (CONFIG.showNarrative) {
            sections.forEach((section, i) => {
                const container = document.getElementById('section-' + i);
                const title = document.getElementById('title-' + i);
                const body = document.getElementById('body-' + i);
                if (!container || !title || !body) return;
                
                const distance = Math.abs(currentScroll - section.triggerTime);
                const isActive = distance < CONFIG.visibilityWindow;
                const opacity = Math.max(0, 1 - (distance / CONFIG.visibilityWindow));
                
                container.style.opacity = opacity;
                container.style.visibility = opacity > 0.01 ? 'visible' : 'hidden';
                
                const yShift = (currentScroll - section.triggerTime) * 150;
                container.style.transform = \`translate3d(0, \${yShift}px, 0)\`;
                
                if (isActive) {
                    title.style.transform = 'translate3d(0, 0, 0)';
                    body.style.opacity = '1';
                    body.style.transform = 'translate3d(0, 0, 0)';
                } else {
                    title.style.transform = 'translate3d(0, 110%, 0)';
                    body.style.opacity = '0';
                    body.style.transform = 'translate3d(0, 20px, 0)';
                }
            });
        }

        requestAnimationFrame(render);
    }

    window.addEventListener('scroll', () => {
        const rect = root.getBoundingClientRect();
        const scrollableHeight = root.offsetHeight - window.innerHeight;
        const progress = Math.max(0, Math.min(1, -rect.top / scrollableHeight));
        targetScroll = progress;
    }, { passive: true });

    render();
})();
</script>
</body>
</html>`;
}
