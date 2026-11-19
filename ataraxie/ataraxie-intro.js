
(function () {
  var BASE = (document.currentScript && document.currentScript.src || '').replace(/[^\/]*$/, '');
  var racine = document.querySelector('[data-intro]'); if (!racine) return;
  var q = function (s) { return racine.matches(s) ? racine : racine.querySelector(s); };
  var intro = q('[data-intro]'), cadre = q('[data-cadre]');
  var papillon = q('[data-papillon]'), lueur = q('[data-lueur]'), reflet = q('[data-reflet]');
  var titre = q('[data-titre]'), accroche = q('[data-accroche]'), fin = q('[data-fin]');
  var reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var clamp = function (x) { return Math.max(0, Math.min(1, x)); };
  var plage = function (p, a, b) { var t = clamp((p - a) / (b - a)); return t * t * (3 - 2 * t); };

  // Point d'ancrage du gros plan : le rebord, là où le papillon se pose (en fraction de la pochette).
  var AX = .493, AY = .805;
  var c = 0, z0 = 5, tx0 = 0, ty0 = 0;
  function mesurer() {
    c = cadre.offsetWidth;
    var vw = innerWidth, vh = innerHeight;
    var cibleY = vh * .7;                       // où se trouve le rebord à l'écran au départ
    var reposY = vh * .47 + (AY - .5) * c;      // où il se trouve quand la pochette est entière
    tx0 = 0; ty0 = cibleY - reposY;
    // Zoom de départ : gros plan, et assez grand pour que la pochette couvre tout l'écran.
    z0 = Math.max(4.6, 1.04 * Math.max(vw / 2 / (Math.min(AX, 1 - AX) * c), cibleY / (AY * c), (vh - cibleY) / ((1 - AY) * c)));
    lire(); p = -1;
  }

  var logo = q('[data-logo]'), logoK = 0;
  var cible = 0, p = -1;
  function lire() {
    var r = intro.getBoundingClientRect(), course = r.height - innerHeight;
    // L'animation occupe les 77 % du parcours ; le reste est un temps d'arrêt sur la pochette entière.
    cible = course > 0 ? clamp(-r.top / course / .77) : 0;
  }
  function dessiner(v) {
    // 1. Dézoom : du rebord jusqu'à la pochette entière.
    var e = plage(v, .5, .9);
    var z = Math.exp((1 - e) * Math.log(z0));
    cadre.style.transform = 'translate(' + (tx0 * (1 - e)).toFixed(2) + 'px,' + (ty0 * (1 - e)).toFixed(2) + 'px) scale(' + z.toFixed(4) + ')';
    cadre.style.boxShadow = e > .6 ? '' : 'none';

    // 2. Vol du papillon : il arrive du haut à droite, en zigzag, et se pose.
    var t = plage(v, .05, .46), u = 1 - t;
    var x = .34 * Math.pow(u, 1.3) + Math.sin(t * Math.PI * 3.2) * .035 * u;
    var y = -.3 * u * u + Math.sin(t * Math.PI * 4.4 + 1) * .028 * u;
    var rot = -28 * u + Math.sin(t * Math.PI * 5) * 12 * u;
    papillon.style.transform = 'translate(' + (x * c).toFixed(2) + 'px,' + (y * c).toFixed(2) + 'px) rotate(' + rot.toFixed(2) + 'deg) scale(' + (1 + u * 1.3).toFixed(3) + ')';
    papillon.style.opacity = plage(v, .04, .1).toFixed(3);
    papillon.classList.toggle('pose', t >= .999);
    var pose = plage(v, .4, .5);
    lueur.style.opacity = (pose * .9).toFixed(3);
    reflet.style.opacity = pose.toFixed(3);
    // Le logo D.T.F du sol n'apparaît que lorsque la pochette est entière
    logoK = plage(v, .86, .95);
    logo.style.opacity = logoK.toFixed(3);

    // 3. Textes
    var s = plage(v, .36, .5);
    titre.style.opacity = (1 - s).toFixed(3);
    // Le titre grossit pendant le scroll (sans jamais dépasser la largeur de l'écran)
    var gros = Math.min(1.75, .92 * innerWidth / (titre.offsetWidth || 1));
    titre.style.transform = 'translate(-50%,-50%) scale(' + (1 + plage(v, 0, .46) * (gros - 1)).toFixed(4) + ')';
    accroche.style.opacity = (1 - plage(v, 0, .06)).toFixed(3);
    fin.style.opacity = plage(v, .88, .96).toFixed(3);

  }
  function boucle() {
    lire();  // relu à chaque image : fonctionne quel que soit l'élément qui défile (fenêtre ou conteneur du thème)
    var suivante = p < 0 ? cible : p + (cible - p) * .085;
    if (Math.abs(suivante - cible) < .0003) suivante = cible;
    if (suivante !== p) { p = suivante; dessiner(p); }
    requestAnimationFrame(boucle);
  }
  if (reduit) {
    logo.style.opacity = 1;
    papillon.style.opacity = 1; papillon.classList.add('pose'); reflet.style.opacity = 1; lueur.style.opacity = .9;
    titre.style.display = 'none';
  } else {
    addEventListener('scroll', lire, { passive: true });
    addEventListener('resize', mesurer);
    mesurer();
    boucle();
  }

  // ---- Eau et nuages animés : l'image est redessinée par un petit shader, guidé par un masque
  // (rouge = eau, vert = nuages). Les personnages ne sont pas touchés.
  (function () {
    var toile = q('[data-toile]');
    var gl = !reduit && toile.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) { toile.remove(); return; }
    var cote = Math.min(2000, gl.getParameter(gl.MAX_TEXTURE_SIZE), innerWidth < 800 ? 1400 : 2000);
    toile.width = toile.height = cote;
    gl.viewport(0, 0, cote, cote);
    var VS = 'attribute vec2 a; varying vec2 v; void main(){ v = a * .5 + .5; gl_Position = vec4(a, 0., 1.); }';
    var FS = [
      'precision highp float;',
      'uniform sampler2D uImg, uMasque; uniform float uT; varying vec2 v;',
      'float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
      'float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);',
      '  return mix(mix(h(i), h(i + vec2(1., 0.)), f.x), mix(h(i + vec2(0., 1.)), h(i + vec2(1., 1.)), f.x), f.y); }',
      'void main(){',
      '  vec4 m = texture2D(uMasque, v);',
      // Eau : une houle calme en perspective. Les vagues naissent à l'horizon (fines, lentes)
      // et avancent vers le rebord en s'élargissant ; l'image est décalée verticalement, comme un vrai reflet.
      '  float y = 1. - v.y;',
      '  float yh = max(y - .628, .004);',
      '  float z = .06 / yh;',
      '  vec2 P = vec2(v.x * 2.2, z * 15.);',  // vagues droites, parallèles à l'horizon (pas d'éventail)
      '  float h1 = n(vec2(P.x + uT * .04, P.y + uT * .30));',
      '  float h2 = n(vec2(P.x * 2.3 - uT * .03, P.y * 2.4 + uT * .50) + 5.);',
      '  float houle = h1 * .65 + h2 * .35 - .5;',
      '  vec2 uv = v + vec2(houle * .25, -houle) * (.0012 + yh * .04) * smoothstep(.0, .03, yh) * m.r;',
      // Nuages : dérive continue (deux passes décalées et fondues) + léger remous
      '  vec2 qn = v * vec2(5., 9.);',
      '  vec2 dn = vec2(n(qn + uT * .05), n(qn + 3. - uT * .04)) - .5;',
      '  uv += dn * .006 * m.g;',
      '  float p1 = fract(uT / 22.), p2 = fract(uT / 22. + .5);',
      '  vec2 sens = vec2(.03, 0.) * m.g;',
      '  vec3 a = texture2D(uImg, uv - sens * (p1 - .5)).rgb;',
      '  vec3 b = texture2D(uImg, uv - sens * (p2 - .5)).rgb;',
      '  vec3 c = mix(a, b, abs(p1 * 2. - 1.));',
      // La pente des vagues accroche un peu la lumière
      '  c *= 1. + houle * .22 * m.r;',
      '  gl_FragColor = vec4(c, 1.);',
      '}'].join('\n');
    function shader(type, src) { var sh = gl.createShader(type); gl.shaderSource(sh, src); gl.compileShader(sh); return sh; }
    var prog = gl.createProgram();
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { toile.remove(); return; }
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    function texture(unite, src, format) {
      return new Promise(function (ok, ko) {
        var im = new Image();
        im.onload = function () {
          gl.activeTexture(gl.TEXTURE0 + unite); gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
          gl.texImage2D(gl.TEXTURE_2D, 0, format || gl.RGB, format || gl.RGB, gl.UNSIGNED_BYTE, im);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          ok();
        };
        im.onerror = ko; im.src = src;
      });
    }
    toile.style.opacity = 0;
    Promise.all([texture(0, BASE + 'assets/scene.jpg?v=3'), texture(1, BASE + 'assets/masque_v1.png')]).then(function () {
      gl.uniform1i(gl.getUniformLocation(prog, 'uImg'), 0); gl.uniform1i(gl.getUniformLocation(prog, 'uMasque'), 1);
      var uT = gl.getUniformLocation(prog, 'uT'), visible = true;
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(intro);
      toile.style.opacity = 1;
      (function image(t) {
        if (visible) { gl.uniform1f(uT, t / 1000); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); }
        requestAnimationFrame(image);
      })(0);
    }).catch(function () { toile.remove(); });
  })();

})();
