
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Critical Failure: Root element not found.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("AEON Narrative Engine // Successfully Mounted");
  } catch (error) {
    console.error("Mounting Error:", error);
    rootElement.innerHTML = `
      <div style="padding: 40px; color: white; text-align: center; font-family: sans-serif;">
        <h1 style="color: #4f46e5;">SYSTEM_CRASH</h1>
        <p style="opacity: 0.5; font-size: 14px; letter-spacing: 2px;">Initialization interrupted by a fatal error.</p>
        <pre style="background: #111; padding: 20px; border-radius: 10px; color: #ff4444; font-size: 12px; margin-top: 20px; overflow-x: auto;">${error instanceof Error ? error.message : String(error)}</pre>
        <button onclick="window.location.reload()" style="margin-top: 20px; background: white; color: black; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">REBOOT SYSTEM</button>
      </div>
    `;
  }
}

// Catch unhandled module errors
window.addEventListener('error', (event) => {
  console.error("Global Error Captured:", event.error);
});
