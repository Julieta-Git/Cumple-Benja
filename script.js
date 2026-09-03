document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // DATOS DE LA INVITACIÓN
  // ==========================================
  const eventData = {
    date: new Date('2026-09-15T17:00:00'),
    time: "17 a 20 hs"
  };

  const RSVP_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdZtbfCnXRAVl5SjGp1CMkx5POYvTuu88JDr8kwDl5Y1GuKSw/viewform?usp=publish-editor";
  const MAP_URL = "https://maps.app.goo.gl/cZNeZmgbdPV4LDpB6?g_st=aw";

  document.getElementById('info-time').textContent = eventData.time;
  document.getElementById('rsvp-btn').href = RSVP_URL;
  document.getElementById('info-location-btn').href = MAP_URL;

  // ==========================================
  // IMÁGENES OPCIONALES
  // ==========================================
  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', () => { img.style.display = 'none'; });
  });

  // ==========================================
  // SCROLL SUAVE
  // ==========================================
  document.getElementById('scroll-cue').addEventListener('click', () => {
    document.getElementById('info').scrollIntoView({ behavior: 'smooth' });
  });

  // ==========================================
  // CUENTA REGRESIVA
  // ==========================================
  function actualizarContador() {
    const diferencia = eventData.date - new Date();

    if (diferencia <= 0) {
      document.getElementById('countdown').innerHTML = '<p style="font-family: var(--font-display); font-size: 1.5rem;">¡Es hoy!</p>';
      return;
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
    const segundos = Math.floor((diferencia / 1000) % 60);

    document.getElementById('dias').textContent = String(dias).padStart(2, '0');
    document.getElementById('horas').textContent = String(horas).padStart(2, '0');
    document.getElementById('minutos').textContent = String(minutos).padStart(2, '0');
    document.getElementById('segundos').textContent = String(segundos).padStart(2, '0');
  }

  actualizarContador();
  setInterval(actualizarContador, 1000);

  // ==========================================
  // REVEAL ON SCROLL
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

});