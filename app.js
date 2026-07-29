(() => {
  'use strict';

  const PHONE = '50254111470';
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  const toast = document.querySelector('.toast');

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2400);
  };

  // Menú móvil
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menuButton.setAttribute('aria-label', open ? 'Abrir menú' : 'Cerrar menú');
    nav?.classList.toggle('open', !open);
    document.body.classList.toggle('menu-open', !open);
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      menuButton?.setAttribute('aria-expanded', 'false');
      menuButton?.setAttribute('aria-label', 'Abrir menú');
      nav?.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  });

  // Resalta la sección visible
  const sections = [...document.querySelectorAll('main section[id]')];
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-40% 0px -52% 0px', threshold: 0 });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Animaciones suaves al entrar en pantalla
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }

  // Formulario que prepara el mensaje en WhatsApp
  const quoteForm = document.getElementById('quote-form');
  quoteForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!quoteForm.reportValidity()) return;

    const data = new FormData(quoteForm);
    const nombre = String(data.get('nombre') || '').trim();
    const telefono = String(data.get('telefono') || '').trim();
    const fecha = String(data.get('fecha') || '').trim();
    const servicio = String(data.get('servicio') || '').trim();
    const lugar = String(data.get('lugar') || '').trim();
    const detalles = String(data.get('detalles') || '').trim();

    const fechaLegible = fecha
      ? new Intl.DateTimeFormat('es-GT', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${fecha}T12:00:00Z`))
      : 'Por confirmar';

    const message = [
      'Hola Party Center, deseo solicitar una cotización.',
      '',
      `Nombre: ${nombre}`,
      `Teléfono: ${telefono || 'No indicado'}`,
      `Fecha del evento: ${fechaLegible}`,
      `Servicio: ${servicio}`,
      `Lugar del evento: ${lugar || 'Por confirmar'}`,
      `Detalles: ${detalles || 'Sin detalles adicionales'}`
    ].join('\n');

    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });

  // Copiar dirección
  document.querySelector('[data-copy-address]')?.addEventListener('click', async () => {
    const address = document.getElementById('party-address')?.textContent?.trim();
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      showToast('Dirección copiada');
    } catch {
      const area = document.createElement('textarea');
      area.value = address;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
      showToast('Dirección copiada');
    }
  });

  // Galería con visor
  const galleryButtons = [...document.querySelectorAll('[data-gallery] .gallery-item')];
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  const lightboxCaption = lightbox?.querySelector('figcaption');
  let currentImageIndex = 0;

  const showGalleryImage = (index) => {
    if (!galleryButtons.length || !lightboxImage || !lightboxCaption) return;
    currentImageIndex = (index + galleryButtons.length) % galleryButtons.length;
    const item = galleryButtons[currentImageIndex];
    lightboxImage.src = item.dataset.full || '';
    lightboxImage.alt = item.dataset.alt || '';
    lightboxCaption.textContent = item.dataset.alt || '';
  };

  galleryButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      showGalleryImage(index);
      if (typeof lightbox?.showModal === 'function') lightbox.showModal();
    });
  });

  lightbox?.querySelector('.lightbox-close')?.addEventListener('click', () => lightbox.close());
  lightbox?.querySelector('.lightbox-prev')?.addEventListener('click', () => showGalleryImage(currentImageIndex - 1));
  lightbox?.querySelector('.lightbox-next')?.addEventListener('click', () => showGalleryImage(currentImageIndex + 1));
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox?.open) return;
    if (event.key === 'ArrowLeft') showGalleryImage(currentImageIndex - 1);
    if (event.key === 'ArrowRight') showGalleryImage(currentImageIndex + 1);
  });

  // Año automático
  const year = document.getElementById('current-year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
