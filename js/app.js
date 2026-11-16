// app.js: carregado em todas as páginas
import { reiniciar } from './storage.js';

const USAR_PWA = true; // ligar quando existirem sw.js e o manifest

// Para recomeçar a demonstração, digite reiniciarDemo() no Console do navegador
window.reiniciarDemo = () => {
  reiniciar();
  window.location.reload();
};

if (USAR_PWA && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => { /* sem service worker: o site segue funcionando */ });
}

let eventoInstalar = null;
const botaoInstalar = document.getElementById('botao-instalar');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  eventoInstalar = e;
  if (botaoInstalar) botaoInstalar.hidden = false;
});

botaoInstalar?.addEventListener('click', async () => {
  if (!eventoInstalar) return;
  eventoInstalar.prompt();
  await eventoInstalar.userChoice;
  eventoInstalar = null;
  botaoInstalar.hidden = true;
});

window.addEventListener('appinstalled', () => {
  if (botaoInstalar) botaoInstalar.hidden = true;
});