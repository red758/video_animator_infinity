 # Aeon Infinity Engine

The **Aeon Infinity Engine** is a high-performance, cinematic scroll-synchronized storytelling engine built with React, TypeScript, and Tailwind CSS. It empowers creators to orchestrate high-fidelity typographic overlays, interactive button components, and responsive text nodes directly synchronized with a background video’s timeline.

Through its interactive **Architect Mode**, users can edit, design, and position narrative elements in real time with an experience reminiscent of Canva, then export the completed web experience as production-ready, standalone code.

## Core Features

*   **High-Fidelity Video Scroll-Sync**: Liquid smooth frame-by-frame scrubbing mapped to the browser scroll progress. Custom spring-physics algorithms provide elastic responsive motion for overlay typography and user-interface elements.
*   **Canva-Style In-Context Editor (Architect Mode)**:
    *   **Interactive Handles**: Direct viewport dragging to reposition any element with infinite flexibility.
    *   **Advanced Control Nodes**: Sliders for Scale, Letter Spacing, Rotation, Corner Radius, Opacity, and Page Width constraints.
    *   **Dynamic Styling**: Real-time color palette picking and multiple curated typography styles (Sans, Serif, Mono, Display).
    *   **Button Customization**: Support for responsive shape alterations, rounded corners, custom actions, and redirection anchors.
*   **Adaptive Layout Modes**:
    *   *In-Page Sticky Sections*: Integrates seamlessly as part of an existing scrollable article.
    *   *Global Backdrop*: Fixes the video canvas as a full-page cinematic background while web content effortlessly glides over.
*   **Professional Cinema Overlays & Blends**: Custom top/bottom mask blending sliders, film grain overlays, and radial vignette effects to achieve high-contrast premium aesthetics under any video backdrop.
*   **Clean Embed Export**: Instantly compiles your designed layout, styles, and animation loops into a single self-contained interactive web component suitable for integration into Webflow, Framer, or static sites.

## High-Performance Architecture

To achieve an optimal editing experience, the Aeon Infinity Engine separates UI presentation from underlying model updates. This prevents standard React rendering bottleneck issues:

1.  **Zero-Latency Dragging**: Repositioning nodes directly modifies the wrapper's `style.left` and `style.top` in the DOM, keeping the interactive drag responsive at 60+ FPS.
2.  **Decoupled Style Adjustments**: Slider inputs update lightweight local React states and target DOM properties instantly. Full model synchronization to the parent component is deferred until the user releases the slider handle (`onMouseUp`/`onTouchEnd`) or blurs the color dialog. This eliminates recursive React state re-render lags.
3.  **Pre-Filtered Video Decoding**: Integrates modern high-tension seek throttling and canvas redraw fallbacks to handle varied video encoding profiles safely.

How It Works & How to Use

1.  **Drop Your Media**: Drag and drop a cinematic MP4 file, paste a public URL, or load the pre-configured *subconscious.mp4* sample file.
2.  **Enter Architect Mode**: Toggle **Edit Mode** from the bottom toolbar.
    *   Hover over any element to show the drag handle.
    *   Click the **Gear Icon (Settings)** on the control node to slide open the detail editor.
    *   Drag, style, rotate, and color to perfection.
3.  **Refine Blending**: Use the navigation toolbar to modify masking gradients, toggle extra scrolling smooth filters, or add new interactive segments.
4.  **Export Code**: Click **Export Snippet** to view and copy the fully styled code.

## Technical Implementation Details

*   **Framework**: React 18, TypeScript, Vite
*   **Styling**: Tailwind CSS
*   **Animations**: Motion
*   **Smooth Scroll**: Lenis Scroll Engine (custom elastic-damped wheel interpolation)
*   **Icons**: Lucide React
