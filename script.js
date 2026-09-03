document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================
  // DATOS DE LA INVITACIÓN  — editá solo esto
  // ==========================================================
  const eventData = {
    date: new Date('2026-09-15T17:00:00'),
    time: '17 a 20 hs'
  };

  const RSVP_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdZtbfCnXRAVl5SjGp1CMkx5POYvTuu88JDr8kwDl5Y1GuKSw/viewform?usp=publish-editor';
  const MAP_URL  = 'https://maps.app.goo.gl/cZNeZmgbdPV4LDpB6?g_st=aw';

  const $  = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  $('#info-time').textContent = eventData.time;
  $('#rsvp-btn').href = RSVP_URL;
  $('#info-location-btn').href = MAP_URL;

  // El día de la semana se DERIVA de la fecha: si cambiás eventData, esto acompaña.
  $('#info-day').textContent = eventData.date.toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long'
  });

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  // ==========================================================
  // IMÁGENES QUE NO CARGAN → se esconden solas
  // ==========================================================
  $$('img').forEach((img) => {
    img.addEventListener('error', () => { img.style.display = 'none'; });
  });

  // ==========================================================
  // CUENTA REGRESIVA — con animación solo cuando el dígito cambia
  // ==========================================================
  const units = {
    dias:     $('#dias'),
    horas:    $('#horas'),
    minutos:  $('#minutos'),
    segundos: $('#segundos')
  };

  function pintar(el, valor) {
    const texto = String(valor).padStart(2, '0');
    if (el.textContent === texto) return;
    el.textContent = texto;

    if (reduced) return;
    el.animate(
      [
        { transform: 'translateY(-90%)', opacity: 0 },
        { transform: 'translateY(0)',    opacity: 1 }
      ],
      { duration: 380, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    );
  }

  let tick = null;

  function actualizarContador() {
    const diferencia = eventData.date - new Date();

    if (diferencia <= 0) {
      $('#countdown').innerHTML = '<p class="info__hoy">¡Es hoy!</p>';
      clearInterval(tick);
      lanzarConfeti(60);
      return;
    }

    pintar(units.dias,     Math.floor(diferencia / 86400000));
    pintar(units.horas,    Math.floor(diferencia / 3600000) % 24);
    pintar(units.minutos,  Math.floor(diferencia / 60000) % 60);
    pintar(units.segundos, Math.floor(diferencia / 1000) % 60);
  }

  actualizarContador();
  tick = setInterval(actualizarContador, 1000);

  // ==========================================================
  // REVEAL ON SCROLL
  // ==========================================================
  const revealEls = $$('.reveal');
  const closingName = $('#closing-name');

  // Índice para el reveal letra por letra de "BENJA"
  $$('#closing-name span').forEach((s, n) => s.style.setProperty('--n', n));

  if (reduced) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    closingName.classList.add('is-visible');
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el) => observer.observe(el));
    observer.observe(closingName);
  }

  // ==========================================================
  // PARALLAX DEL HERO + BARRA DE PROGRESO
  // ==========================================================
  const heroBg    = $('#hero-bg');
  const heroTitle = $('.hero__title');
  const progress  = $('#progress i');
  const hero      = $('#hero');

  let ticking = false;

  function onScroll() {
    const y = window.scrollY;

    // Progreso total del documento
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${Math.min(100, (y / Math.max(total, 1)) * 100)}%`;

    // Red de seguridad: el rootMargin negativo del observer puede dejar
    // elementos del ÚLTIMO bloque sin revelar nunca, porque ya no queda scroll
    // para empujarlos dentro de la zona de detección. Si tocamos fondo,
    // revelamos lo que haya quedado colgado.
    if (total - y < 4) {
      revealEls.forEach((el) => el.classList.add('is-visible'));
      closingName.classList.add('is-visible');
    }

    // Parallax: solo mientras el hero está en pantalla.
    // OJO: usamos la propiedad `translate`, NO `transform`. Las animaciones CSS
    // (kenBurns, numIn) ganan sobre cualquier transform inline — con `transform`
    // este parallax no hacía absolutamente nada.
    if (!reduced && y < hero.offsetHeight) {
      const h = hero.offsetHeight;
      heroBg.style.translate = `0 ${y * 0.32}px`;
      heroTitle.style.translate = `0 ${y * -0.14}px`;
      heroTitle.style.opacity = String(Math.max(0, 1 - y / (h * 0.75)));
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onScroll);
  }, { passive: true });

  onScroll();

  // ==========================================================
  // TILT 3D EN LAS CARDS DE JUGADORES
  // ==========================================================
  if (finePointer && !reduced) {
    $$('[data-tilt]').forEach((card) => {
      let raf = null;

      card.addEventListener('pointermove', (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width  - 0.5;
          const py = (e.clientY - r.top)  / r.height - 0.5;

          card.style.transform =
            `rotateY(${px * 16}deg) rotateX(${-py * 16}deg) translateZ(14px)`;

          const aura = card.querySelector('.card__aura');
          if (aura) aura.style.transform = `translate(${px * -22}px, ${py * -22}px) scale(1.12)`;

          raf = null;
        });
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
        const aura = card.querySelector('.card__aura');
        if (aura) aura.style.transform = '';
      });
    });
  }

  // ==========================================================
  // CONFETI EN EL CIERRE
  // ==========================================================
  const confetiBox = $('#confetti');
  const colores = ['#E30613', '#FF2233', '#F2EFE9', '#FFFFFF', '#8E0410'];
  let confetiLanzado = false;

  function lanzarConfeti(cantidad = 40) {
    if (reduced || !confetiBox) return;

    for (let i = 0; i < cantidad; i++) {
      const p = document.createElement('i');
      p.style.left            = `${Math.random() * 100}%`;
      p.style.background      = colores[Math.floor(Math.random() * colores.length)];
      p.style.animationDuration = `${3 + Math.random() * 2.8}s`;
      p.style.animationDelay    = `${Math.random() * 2.2}s`;
      p.style.setProperty('--drift', `${(Math.random() - 0.5) * 220}px`);
      if (Math.random() > 0.6) p.style.borderRadius = '50%';
      confetiBox.appendChild(p);
    }
  }

  if (!reduced) {
    const closingObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !confetiLanzado) {
          confetiLanzado = true;
          lanzarConfeti(45);
          closingObserver.disconnect();
        }
      });
    }, { threshold: 0.25 });

    closingObserver.observe($('#closing'));
  }

});
