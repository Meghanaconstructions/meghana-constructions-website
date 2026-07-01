document.addEventListener('DOMContentLoaded', () => {
      const header = document.querySelector('.site-header');
      const mobileToggle = document.querySelector('.mobile-toggle');
      const navLinks = document.querySelector('.nav-links');

      if (header) {
        const syncHeader = () => {
          header.classList.toggle('is-scrolled', window.scrollY > 12);
        };

        syncHeader();
        window.addEventListener('scroll', syncHeader, { passive: true });
      }

      if (mobileToggle && header) {
        mobileToggle.addEventListener('click', () => {
          header.classList.toggle('nav-open');
          mobileToggle.setAttribute('aria-expanded', header.classList.contains('nav-open') ? 'true' : 'false');
        });
      }

      if (header && navLinks) {
        navLinks.querySelectorAll('a').forEach((link) => {
          link.addEventListener('click', () => {
            header.classList.remove('nav-open');
            if (mobileToggle) {
              mobileToggle.setAttribute('aria-expanded', 'false');
            }
          });
        });
      }

      const revealItems = document.querySelectorAll('.reveal');
      if (revealItems.length) {
        const revealObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              revealObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12 });

        revealItems.forEach((item) => revealObserver.observe(item));
      }

      const statItems = document.querySelectorAll('.stat-number[data-target]');
      if (statItems.length) {
        const runCounter = (element) => {
          const target = Number(element.dataset.target || '0');
          const suffix = element.dataset.suffix || '';
          const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1600;

          if (!duration) {
            element.textContent = `${target}${suffix}`;
            return;
          }

          const start = performance.now();
          const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(target * eased);
            element.textContent = `${value}${suffix}`;
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        };

        const statsObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              runCounter(entry.target);
              statsObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.45 });

        statItems.forEach((item) => statsObserver.observe(item));
      }

  const sections = document.querySelectorAll('section[id]');
  const sectionLinks = document.querySelectorAll('.nav-links a[href^="#"]');

      if (sections.length && sectionLinks.length) {
        const updateActiveSection = () => {
          let currentId = '';
          sections.forEach((section) => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
              currentId = section.id;
            }
          });

          sectionLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
          });
        };

        updateActiveSection();
        window.addEventListener('scroll', updateActiveSection, { passive: true });
      }

      const contactForm = document.getElementById('contact-form');
      const successMessage = document.getElementById('success-message');
  if (contactForm && successMessage) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);

    try {
      const response = await fetch(contactForm.action, {
        method: contactForm.method,
        body: formData
      });

      if (response.ok) {
        contactForm.reset();
        successMessage.style.display = 'block';
      } else {
        alert('Something went wrong. Please try again or contact us on WhatsApp.');
      }
    } catch (error) {
      alert('Something went wrong. Please try again or contact us on WhatsApp.');
    }
  });
}

  const testimonialTrack = document.querySelector('.testimonials-track');
  if (testimonialTrack && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const originals = Array.from(testimonialTrack.children);
    originals.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      testimonialTrack.appendChild(clone);
    });
  }
});
