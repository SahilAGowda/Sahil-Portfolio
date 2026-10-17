import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// After a redeploy an old tab can ask for a file that no longer exists. Reload once to pick up the new build;
// the guard stops a loop when the cause is a lost connection.
window.addEventListener("vite:preloadError", (event) => {
  event.preventDefault();
  try {
    const last = Number(sessionStorage.getItem("preload-reload") ?? 0);
    if (Date.now() - last < 10_000) return;
    sessionStorage.setItem("preload-reload", String(Date.now()));
  } catch {
    return;
  }
  window.location.reload();
});

createRoot(document.getElementById("root")!).render(<App />);
