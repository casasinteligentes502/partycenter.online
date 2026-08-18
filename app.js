(() => {
  'use strict';

  const PHONE = '50254111470';
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];

  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    nav?.classList.toggle('open', !open);
  });

  navLinks.forEach((a) => a.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('open');
  }));

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    reveals.forEach((item) => observer.observe(item));
  } else {
    reveals.forEach((item) => item.classList.add('visible'));
  }

  const sections = [...document.querySelectorAll('main section[id]')];
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((a) => {
            a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
          });
        }
      });
    }, { rootMargin: '-40% 0 -50% 0' });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  const form = document.getElementById('quote-form');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const message = [
      'Hola Party Center, deseo solicitar una cotización.',
      '',
      `Nombre: ${data.get('nombre') || ''}`,
      `Teléfono: ${data.get('telefono') || 'No indicado'}`,
      `Fecha: ${data.get('fecha') || 'Por confirmar'}`,
      `Servicio: ${data.get('servicio') || ''}`,
      `Lugar: ${data.get('lugar') || 'Por confirmar'}`,
      `Detalles: ${data.get('detalles') || 'Sin detalles adicionales'}`
    ].join('\n');

    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });

  const galleryItems = [...document.querySelectorAll('[data-gallery] .gallery-item')];
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  const lightboxCaption = lightbox?.querySelector('figcaption');
  let galleryIndex = 0;

  const showGalleryImage = (index) => {
    if (!galleryItems.length || !lightboxImage || !lightboxCaption) return;
    galleryIndex = (index + galleryItems.length) % galleryItems.length;
    lightboxImage.src = galleryItems[galleryIndex].dataset.full || '';
    lightboxImage.alt = galleryItems[galleryIndex].dataset.alt || '';
    lightboxCaption.textContent = galleryItems[galleryIndex].dataset.alt || '';
  };

  galleryItems.forEach((button, index) => button.addEventListener('click', () => {
    showGalleryImage(index);
    lightbox?.showModal?.();
  }));

  lightbox?.querySelector('.lightbox-close')?.addEventListener('click', () => lightbox.close());
  lightbox?.querySelector('.lightbox-prev')?.addEventListener('click', () => showGalleryImage(galleryIndex - 1));
  lightbox?.querySelector('.lightbox-next')?.addEventListener('click', () => showGalleryImage(galleryIndex + 1));
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox?.open) return;
    if (event.key === 'ArrowLeft') showGalleryImage(galleryIndex - 1);
    if (event.key === 'ArrowRight') showGalleryImage(galleryIndex + 1);
  });

  const year = document.getElementById('current-year');
  if (year) year.textContent = new Date().getFullYear();
})();
