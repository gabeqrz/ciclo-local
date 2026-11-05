/* Preloader do CicloLocal: tela de carregamento com a marca girando.
   Uso: Preloader.mostrar() / Preloader.esconder() / Preloader.ir('pagina.html')
   Em HTML: <a href="pagina.html" data-carregar>  ou  <button data-carregar="pagina.html"> */
const Preloader = {
  el: null,
  criar() {
    if (this.el) return;
    const marca = '<svg class="preloader__marca" viewBox="0 0 64 64" aria-hidden="true" focusable="false">' +
      '<path d="M10 32A22 22 0 0 1 46.1 15.2" fill="none" stroke="#1D3557" stroke-width="6" stroke-linecap="round"/>' +
      '<polygon fill="#1D3557" points="42.2,19.8 49.9,10.6 52.2,20.3"/>' +
      '<g transform="rotate(180 32 32)"><path d="M10 32A22 22 0 0 1 46.1 15.2" fill="none" stroke="#B5502B" stroke-width="6" stroke-linecap="round"/>' +
      '<polygon fill="#B5502B" points="42.2,19.8 49.9,10.6 52.2,20.3"/></g><circle cx="32" cy="32" r="5.5" fill="#B5502B"/></svg>';
    const d = document.createElement('div');
    d.className = 'preloader';
    d.setAttribute('role', 'status');
    d.setAttribute('aria-live', 'polite');
    d.innerHTML = marca + '<p class="preloader__texto"></p>';
    document.body.appendChild(d);
    this.el = d;
  },
  mostrar(texto = 'Carregando…') {
    this.criar();
    this.el.querySelector('.preloader__texto').textContent = texto;
    this.el.classList.add('visivel');
    document.body.setAttribute('aria-busy', 'true');
  },
  esconder() {
    if (!this.el) return;
    this.el.classList.remove('visivel');
    document.body.removeAttribute('aria-busy');
  },
  ir(url, { texto, ms = 800 } = {}) {
    this.mostrar(texto);
    setTimeout(() => { location.href = url; }, ms);
  },
  iniciar() {
    this.criar();
    document.addEventListener('click', e => {
      const alvo = e.target.closest('[data-carregar]');
      if (!alvo || e.ctrlKey || e.metaKey || e.shiftKey) return;
      e.preventDefault();
      this.ir(alvo.dataset.carregar || alvo.getAttribute('href'), { texto: alvo.dataset.texto });
    });
    window.addEventListener('pageshow', () => this.esconder()); // botão "voltar" do navegador
  }
};
