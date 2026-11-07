// Mostra o preloader ao ativar um link com data-preloader e só então navega.
const preloader = document.getElementById('preloader');
const TEMPO_SIMULADO = 1800; // duração da "autenticação", em ms

if (preloader) {
  const texto = preloader.querySelector('.preloader__texto');

  const mostrar = (mensagem) => {
    preloader.classList.add('visivel');
    // o texto entra depois de visível, para o leitor de tela anunciar
    requestAnimationFrame(() => { texto.textContent = mensagem; });
  };
  const esconder = () => {
    preloader.classList.remove('visivel');
    texto.textContent = '';
  };

  document.querySelectorAll('a[data-preloader]').forEach((link) => {
    link.addEventListener('click', (evento) => {
      // Ctrl/Cmd/Shift/Alt + clique: deixa o navegador abrir em outra aba
      if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
      evento.preventDefault();
      if (preloader.classList.contains('visivel')) return; // ignora clique repetido
      mostrar(link.dataset.preloader || 'Carregando…');
      setTimeout(() => { window.location.href = link.href; }, TEMPO_SIMULADO);
    });
  });

  // Ao voltar pelo navegador, a página pode vir do cache com o preloader aberto
  window.addEventListener('pageshow', (evento) => { if (evento.persisted) esconder(); });
}