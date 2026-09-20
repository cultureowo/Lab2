import './index.css';
import { renderApp } from './ui/render';

document.addEventListener('DOMContentLoaded', () => {
  const mountPoint = document.getElementById('app');
  if (!mountPoint) {
    console.error('Mount element #app not found in DOM');
    return;
  }

  renderApp(mountPoint);
});

// Fallback in case DOMContentLoaded has already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  const mountPoint = document.getElementById('app');
  if (mountPoint && mountPoint.childNodes.length === 0) {
    renderApp(mountPoint);
  }
}
