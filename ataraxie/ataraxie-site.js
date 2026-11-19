// Page d'accueil ATARAXIE : apparition des blocs et des cartes produits au défilement.
(function () {
  var cibles = [].slice.call(document.querySelectorAll('.atx-bloc .atx-anim, body#index .elementor-products .js-product-miniature-wrapper'));
  if (!cibles.length || !('IntersectionObserver' in window)) return;
  cibles.forEach(function (el, i) {
    el.classList.add('atx-reveal');
    // Petit décalage en cascade sur les cartes d'une même rangée
    if (el.classList.contains('js-product-miniature-wrapper')) el.style.setProperty('--d', (i % 4) * .07 + 's');
  });
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('atx-in'); io.unobserve(e.target); } });
  }, { threshold: .12 });
  cibles.forEach(function (el) { io.observe(el); });
  // Sécurité : si rien ne s'est déclenché, tout afficher
  setTimeout(function () { if (!document.querySelector('.atx-in')) cibles.forEach(function (el) { el.classList.add('atx-in'); }); }, 4000);
})();

// Mini panier : s'ouvre en glissant depuis la droite au clic sur « Panier » dans le menu.
(function () {
  var racine = document.documentElement, mini = document.querySelector('.atx-mini');
  if (!mini) return;
  function ouvrir(e) { if (e) e.preventDefault(); racine.classList.add('atx-panier-ouvert'); mini.setAttribute('aria-hidden', 'false'); }
  function fermer() { racine.classList.remove('atx-panier-ouvert'); mini.setAttribute('aria-hidden', 'true'); }
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-atx-panier]')) ouvrir(e);
    else if (e.target.closest('[data-atx-fermer], .atx-voile')) fermer();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fermer(); });
})();
