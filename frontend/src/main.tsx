import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

window.addEventListener("error", (event) => {
  console.error("Global startup error caught:", event.error || event.message);
  const root = document.getElementById("root");
  if (root && root.children.length === 0) {
    root.innerHTML = `
      <div style="font-family:system-ui,-apple-system,sans-serif;padding:32px;max-width:550px;margin:60px auto;background:#fff1f0;border:1px solid #ffa39e;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
        <h2 style="color:#cf1322;margin:0 0 12px 0;font-size:20px;">⚠️ Unable to load application</h2>
        <p style="color:#434343;font-size:14px;line-height:1.5;">${event.message || 'An unexpected error occurred while initializing the page.'}</p>
        <pre style="background:#fff;padding:12px;border-radius:6px;overflow:auto;font-size:12px;border:1px solid #ffd8d6;color:#595959;">${event.error?.stack || event.filename + ':' + event.lineno}</pre>
        <button onclick="window.location.reload()" style="background:#ff6b35;color:white;border:none;padding:10px 18px;border-radius:6px;cursor:pointer;font-weight:600;margin-top:12px;">Reload Page</button>
      </div>
    `;
  }
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find root element");
}

createRoot(rootElement).render(<App />);
