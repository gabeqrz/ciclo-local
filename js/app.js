// app.js: carregado em todas as páginas
import { reiniciar } from './storage.js';

const USAR_PWA = false; // ligar quando existirem sw.js e o manifest

// Para recomeçar a demonstração, digite reiniciarDemo() no Console do navegador
window.reiniciarDemo = () => {
  reiniciar();
  window.location.reload();
};

if (USAR_PWA && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => { /* sem service worker: o site segue funcionando */ });
}