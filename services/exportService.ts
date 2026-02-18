import { ScrollSection } from "../types";

/**
 * AEON UNIVERSAL NARRATIVE EXPORT v26.0
 * Generates high-performance, self-contained interactive components.
 */
export function generateSnippetCode(
  sections: ScrollSection[], 
  videoUrl: string, 
  sensitivity: number = 0.08, 
  scrollDepth: number = 6,
  startOffset: number = 0.05,
  endOffset: number = 0.05,
  viewportAnchor: number = 0.1,
  widthMode: 'full' | 'boxed' = 'full',
  maxWidth: string = '1200px',
  layoutMode: 'section' | 'background' = 'section'
): string {
  const isBlob = videoUrl.startsWith('blob:');
  const displayUrl = isBlob ? 'https://YOUR_DOMAIN.com/path/to/video.mp4' : videoUrl;
  const sectionsJSON = JSON.stringify(sections, null, 2);
  const instanceId = 'aeon-' + Math.random().toString(36).substr(2, 9);

  const containerStyles = widthMode === 'boxed' 
    ? `max-width: ${maxWidth}; margin: 0 auto; border-radius: 40px; overflow: hidden;` 
    : `width: 100%; margin: 0;`;

  if (layoutMode === 'background') {
    return `
<!-- 
  =============================================================================
  AEON // [MODE: GLOBAL WEBSITE BACKGROUND] // IMPLEMENTATION GUIDE
  =============================================================================
  
  HOW TO INSTALL THIS COMPONENT:
  
  1. PLACEMENT:
     Paste this entire block of code into your HTML file IMMEDIATELY after 
     your opening <body> tag.
     
  2. LAYERING LOGIC:
     This component creates a fixed layer with z-index: -1. 
     This means it will stay pinned to the background while all your 
     existing text, navigation bars, and buttons will scroll OVER IT.
     
  3. VIDEO SOURCE:
     Look for the "CONFIG" object inside the <script> tag at the bottom.
     Current URL: "${displayUrl}"
     REPLACE THIS with your final hosted .mp4 video link to make it work
     on your live website.
     
  4. SCROLL SYNC:
     The narrative text nodes will automatically fade in/out based on the 
     percentage of the total page scroll.
  =============================================================================
-->
<div id="${instanceId}-global-bg" style="position: fixed; inset: 0; width: 100%; height: 100%; z-index: -1; background: #000; overflow: hidden; pointer-events: none;">
    <style>
        #${instanceId}-global-bg .aeon-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 2s ease; }
        #${instanceId}-global-bg .aeon-overlay { position: absolute; inset: 0; z-index: 2; background: radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%); }
        #${instanceId}-global-bg .aeon-node { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0; visibility: hidden; padding: 40px; box-sizing: border-box; }
        #${instanceId}-global-bg .aeon-title { color: white; font-family: sans-serif; font-weight: 900; font-size: clamp(2.5rem, 10vw, 12rem); text-transform: uppercase; margin: 0; text-align: center; line-height: 0.8; letter-spacing: -0.05em; }
        #${instanceId}-global-bg .aeon-desc { color: rgba(255,255,255,0.4); font-family: sans-serif; font-weight: 700; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5em; margin-top: 30px; text-align: center; max-width: 800px; }
    </style>
    <video id="${instanceId}-v" class="aeon-video" playsinline muted preload="auto"></video>
    <div class="aeon-overlay" id="${instanceId}-stage"></div>
    <script>
        (function() {
            /* --- NARRATIVE CONFIGURATION --- */
            const CONFIG = { 
                src: "${displayUrl}", // <-- UPDATE THIS URL FOR PRODUCTION
                data: ${sectionsJSON}, 
                lerp: ${sensitivity} 
            };
            
            const video = document.getElementById('${instanceId}-v');
            const stage = document.getElementById('${instanceId}-stage');
            video.src = CONFIG.src;

            // Dynamically generate narrative overlays
            CONFIG.data.forEach((s, i) => {
                const node = document.createElement('div');
                node.className = 'aeon-node'; node.id = '${instanceId}-n-' + i;
                node.innerHTML = \`<h2 class="aeon-title">\${s.title}</h2><p class="aeon-desc">\${s.description}</p>\`;
                stage.appendChild(node);
            });

            let targetProgress = 0, currentProgress = 0, isSeeking = false;

            function loop() {
                // Smooth Smoothing Interpolation (LERP)
                currentProgress += (targetProgress - currentProgress) * CONFIG.lerp;
                
                // Sync Video Playback Position
                if (video.duration && !isSeeking) {
                    const targetTime = (video.duration - 0.05) * currentProgress;
                    if (Math.abs(video.currentTime - targetTime) > 0.03) { 
                        isSeeking = true; 
                        video.currentTime = targetTime; 
                    }
                }
                
                // Animate Text Sections based on scroll distance
                CONFIG.data.forEach((s, i) => {
                    const el = document.getElementById('${instanceId}-n-' + i);
                    const dist = Math.abs(currentProgress - s.triggerTime);
                    const opacity = Math.max(0, 1 - (dist / 0.12));
                    el.style.opacity = opacity; 
                    el.style.visibility = opacity > 0.01 ? 'visible' : 'hidden';
                    el.style.transform = \`translate3d(0, \${(currentProgress - s.triggerTime) * 150}px, 0)\`;
                });
                requestAnimationFrame(loop);
            }

            // Sync with Body Scroll
            window.addEventListener('scroll', () => {
                const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
                targetProgress = window.scrollY / (totalHeight || 1);
            }, { passive: true });

            video.onseeked = () => isSeeking = false;
            video.onloadedmetadata = () => { video.style.opacity = '1'; loop(); };
            if (video.readyState >= 2) video.onloadedmetadata();
        })();
    </script>
</div>
    `;
  }

  // DEFAULT SECTION TRACK EXPORT
  return `
<!-- 
  =============================================================================
  AEON // [MODE: STANDALONE PAGE SECTION] // IMPLEMENTATION GUIDE
  =============================================================================
  
  HOW TO INSTALL THIS COMPONENT:
  
  1. PLACEMENT:
     Paste this code anywhere in your HTML <body> where you want a 
     sticky video narrative section to appear.
     
  2. BEHAVIOR:
     This logic creates a "Scroll Track" that is ${scrollDepth} times your 
     screen height. As the user enters this zone, the video becomes 
     "Sticky" and syncs with the user's scroll.
     
  3. VIDEO SOURCE:
     Look for the "CONFIG" object inside the <script> tag at the bottom.
     Current URL: "${displayUrl}"
     REPLACE THIS with your final hosted .mp4 video link for production.
  =============================================================================
-->
<div id="${instanceId}-track" style="height: ${scrollDepth * 100}vh; position: relative; background: #000; overflow: visible; ${containerStyles}">
    <style>
        #${instanceId}-track { font-family: sans-serif; background: #000; box-sizing: border-box; }
        #${instanceId}-track .aeon-stage { position: sticky; top: 0; left: 0; width: 100%; height: 100vh; overflow: hidden; }
        #${instanceId}-track .aeon-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; opacity: 0; transition: opacity 1.5s ease; }
        #${instanceId}-track .aeon-overlay { position: absolute; inset: 0; z-index: 2; display: flex; align-items: center; justify-content: center; pointer-events: none; background: linear-gradient(to bottom, #000 0%, transparent 20%, transparent 80%, #000 100%); }
        #${instanceId}-track .aeon-node { position: absolute; width: 100%; padding: 0 10%; box-sizing: border-box; opacity: 0; visibility: hidden; }
        #${instanceId}-track .aeon-title { font-size: clamp(2.5rem, 9vw, 11rem); font-weight: 900; text-transform: uppercase; line-height: 0.85; color: white; margin: 0; letter-spacing: -0.05em; }
        #${instanceId}-track .aeon-desc { font-size: 16px; font-weight: 700; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-top: 2rem; letter-spacing: 0.5em; }
    </style>
    <div class="aeon-stage">
        <video id="${instanceId}-v" class="aeon-video" playsinline muted preload="auto"></video>
        <div id="${instanceId}-g" class="aeon-overlay"></div>
    </div>
    <script>
        (function() {
            /* --- NARRATIVE CONFIGURATION --- */
            const CONFIG = { 
                src: "${displayUrl}", // <-- UPDATE THIS URL FOR PRODUCTION
                data: ${sectionsJSON}, 
                lerp: ${sensitivity}, 
                id: "${instanceId}",
                anchor: ${viewportAnchor} 
            };
            
            const track = document.getElementById(CONFIG.id + '-track');
            const video = document.getElementById(CONFIG.id + '-v');
            const stage = document.getElementById(CONFIG.id + '-g');
            video.src = CONFIG.src;

            // Generate Overlay Elements
            CONFIG.data.forEach((s, i) => {
                const node = document.createElement('div');
                node.className = 'aeon-node'; node.id = CONFIG.id + '-n-' + i;
                node.style.textAlign = s.alignment;
                node.innerHTML = \`<h2 class="aeon-title">\${s.title}</h2><p class="aeon-desc">\${s.description}</p>\`;
                stage.appendChild(node);
            });

            let targetProgress = 0, currentProgress = 0, isSeeking = false;

            function loop() {
                // Smooth Scroll Interpolation
                currentProgress += (targetProgress - currentProgress) * CONFIG.lerp;
                
                // Sync Video Playback
                if (video.duration && !isSeeking) {
                    const targetTime = (video.duration - 0.05) * currentProgress;
                    if (Math.abs(video.currentTime - targetTime) > 0.03) { 
                        isSeeking = true; 
                        video.currentTime = targetTime; 
                    }
                }
                
                // Animate Text Nodes
                CONFIG.data.forEach((s, i) => {
                    const el = document.getElementById(CONFIG.id + '-n-' + i);
                    const dist = Math.abs(currentProgress - s.triggerTime);
                    const opacity = Math.max(0, 1 - (dist / 0.12));
                    el.style.opacity = opacity; 
                    el.style.visibility = opacity > 0.01 ? 'visible' : 'hidden';
                    el.style.transform = \`translate3d(0, \${(currentProgress - s.triggerTime) * 150}px, 0)\`;
                });
                requestAnimationFrame(loop);
            }

            // Sync local track scroll progress
            window.addEventListener('scroll', () => {
                const rect = track.getBoundingClientRect();
                const total = track.offsetHeight - window.innerHeight;
                if (total > 0) {
                    // Progress based on viewport entrance
                    targetProgress = Math.max(0, Math.min(1, ((window.innerHeight * CONFIG.anchor) - rect.top) / total));
                }
            }, { passive: true });

            video.onseeked = () => isSeeking = false;
            video.onloadedmetadata = () => { video.style.opacity = '1'; loop(); };
            if (video.readyState >= 2) video.onloadedmetadata();
        })();
    </script>
</div>
`;
}