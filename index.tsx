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
      <div style="padding: 40px; color: #6366f1; text-align: center; font-family: sans-serif; background: #000; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <h1 style="color: #6366f1; font-weight: 900; letter-spacing: -2px; font-size: 48px;">SYSTEM_CRASH</h1>
        <p style="opacity: 0.5; font-size: 12px; letter-spacing: 4px; text-transform: uppercase;">Initialization interrupted by a fatal error.</p>
        <pre style="background: rgba(255,0,0,0.05); padding: 20px; border: 1px solid rgba(255,0,0,0.1); border-radius: 20px; color: #ff4444; font-size: 11px; margin-top: 32px; overflow-x: auto; max-width: 600px; font-family: monospace;">${error instanceof Error ? error.message : String(error)}</pre>
        <button onclick="window.location.reload()" style="margin-top: 32px; background: #6366f1; color: white; border: none; padding: 14px 40px; border-radius: 12px; cursor: pointer; font-weight: 900; font-size: 10px; letter-spacing: 2px; text-transform: uppercase;">REBOOT SYSTEM</button>
      </div>
    `;
  }
}

// Catch unhandled module errors
window.addEventListener('error', (event) => {
  console.error("Global Error Captured:", event.error);
});