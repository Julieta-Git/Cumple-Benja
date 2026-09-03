document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // DATOS DE LA INVITACIÓN
  // ==========================================
  const eventData = {
    name: "Benja",
    age: 10,
    date: "Martes 15 de Septiembre",
    time: "17 a 20 hs",
    location: "NEXXUS"
  };

  const RSVP_URL = "PEGAR_AQUI_EL_LINK";
  const MAP_URL = "https://maps.app.goo.gl/cZNeZmgbdPV4LDpB6?g_st=aw";

  // ==========================================
  // VOLCAR DATOS EN EL DOM
  // ==========================================
  document.getElementById('info-age').textContent = eventData.age;
  document.getElementById('info-date').textContent = eventData.date;
  document.getElementById('info-time').textContent = eventData.time;
  document.getElementById('info-location').textContent = eventData.location;
  document.getElementById('location-name').textContent = eventData.location;

  document.getElementById('rsvp-btn').href = RSVP_URL;
  document.getElementById('info-location-btn').href = MAP_URL;
  document.getElementById('map-btn').href = MAP_URL;

  // ==========================================
  // IMÁGENES OPCIONALES: si falta un asset, ocultarlo sin romper el layout
  // ==========================================
  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
    });
  });

  // ==========================================
  // SCROLL SUAVE AL TOCAR EL INDICADOR DEL HERO
  // ==========================================
  const scrollCue = document.getElementById('scroll-cue');
  scrollCue.addEventListener('click', () => {
    document.getElementById('info').scrollIntoView({ behavior: 'smooth' });
  });

  // ==========================================
  // REVEAL ON SCROLL — IntersectionObserver
  // ==========================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach((el) => observer.observe(el));
  }

  // ==========================================
  // PARALLAX SUTIL — jugadores, número y escudo, con requestAnimationFrame
  // ==========================================
  if (!prefersReducedMotion) {
    const heroPlayer = document.getElementById('hero-player');
    const heroNumber = document.getElementById('hero-number');
    const matchPlayer2 = document.getElementById('match-player-2');
    const matchPlayer3 = document.getElementById('match-player-3');

    let ticking = false;

    function updateParallax() {
      const y = window.scrollY;

      if (heroPlayer) heroPlayer.style.transform = `translateY(${y * 0.08}px)`;
      if (heroNumber) heroNumber.style.transform = `translate(-50%, calc(-50% + ${y * 0.04}px))`;

      const matchSection = document.getElementById('match');
      if (matchSection) {
        const rect = matchSection.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (inView) {
          const progress = (window.innerHeight - rect.top) * 0.02;
          if (matchPlayer2) matchPlayer2.style.transform = `translateY(${-progress}px)`;
          if (matchPlayer3) matchPlayer3.style.transform = `translateY(${progress}px)`;
        }
      }

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

});