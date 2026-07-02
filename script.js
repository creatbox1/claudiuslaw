'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initFAQ();
  initScrollToTop();
  initWhatsappVisibility();
  initSmoothScroll();
  initContactForm();
  initCareerModal();
  initParallaxDepth();
});

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    requestAnimationFrame(() => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  const closeBtn = document.getElementById('navMenuClose');
  if (!toggle || !menu) return;

  const hamburger = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  const closeIcon = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  function closeMenu() {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = hamburger;
    document.body.style.overflow = '';
  }

  function openMenu() {
    menu.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.innerHTML = closeIcon;
    document.body.style.overflow = 'hidden';
  }

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

function initScrollReveal() {
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    .forEach(el => {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          const delay = parseFloat(el.style.transitionDelay) || 0;
          el.style.transitionDelay = `${delay}s`;
          void el.offsetWidth;
          el.classList.add('revealed');
          observer.unobserve(el);
        }
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      observer.observe(el);
    });
}

function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const was = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('active');
        const otherAnswer = other.querySelector('.faq-a');
        if (otherAnswer) otherAnswer.style.maxHeight = '0px';
        other.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
      });

      if (!was) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        const inner = answer.querySelector('.faq-a-inner');
        if (inner) answer.style.maxHeight = inner.scrollHeight + 32 + 'px';
      }
    });
  });
}

function initScrollToTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
      btn.classList.toggle('visible', window.scrollY > 400);
    });
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
function initWhatsappVisibility() {
  const wa = document.querySelector('.whatsapp-float');
  if (!wa) return;
  const hero = document.querySelector('.hero') || document.querySelector('.about-hero');
  const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : window.innerHeight;
  window.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
      wa.classList.toggle('whatsapp-hidden', window.scrollY < heroBottom - 100);
    });
  }, { passive: true });
}
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      const navbar = document.getElementById('navbar');
      const offset = navbar ? navbar.offsetHeight : 0;

      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth',
      });
    });
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  const thankyouModal = document.getElementById('thankyouModal');
  const thankyouBtn = document.getElementById('thankyouBtn');
  const thankyouClose = document.getElementById('thankyouClose');
  if (!form) return;

  function openThankyou() {
    if (!thankyouModal) return;
    thankyouModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeThankyou() {
    if (!thankyouModal) return;
    thankyouModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (thankyouBtn) thankyouBtn.addEventListener('click', closeThankyou);
  if (thankyouClose) thankyouClose.addEventListener('click', closeThankyou);
  if (thankyouModal) {
    thankyouModal.addEventListener('click', (e) => {
      if (e.target === thankyouModal) closeThankyou();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && thankyouModal?.classList.contains('active')) closeThankyou();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const inputs = form.querySelectorAll('input, textarea, select');
    let valid = true;
    inputs.forEach(inp => {
      if (inp.hasAttribute('required') && !inp.value.trim()) {
        valid = false;
        inp.style.borderColor = '#ff0000';
      } else {
        inp.style.borderColor = '';
      }
    });

    if (!valid) return;

    const email = form.querySelector('input[type="email"]');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      email.style.borderColor = '#ff0000';
      return;
    }

    const btn = form.querySelector('.form-submit');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

    try {
      const fd = new FormData(form);

      const res = await fetch('https://formspree.io/f/xkolpwke', {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' }
      });

      if (!res.ok) throw new Error('Server error');

      form.reset();
      openThankyou();
    } catch {
      const msg = document.createElement('div');
      msg.style.cssText = 'padding:1rem;margin-top:1rem;font-size:0.875rem;text-align:center;background:rgba(255,0,0,0.08);border:1px solid rgba(255,0,0,0.2);color:#ff0000;';
      msg.textContent = 'Something went wrong. Please try again.';
      form.appendChild(msg);
      setTimeout(() => msg.remove(), 5000);
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Send Message'; }
    }
  });
}

function showMsg(form, text, ok) {
  const old = form.querySelector('.form-message');
  if (old) old.remove();

  const msg = document.createElement('div');
  msg.className = 'form-message';
  msg.style.cssText = `
    padding: 1rem 1.25rem;
    margin-top: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    text-align: center;
    ${ok ? 'background: rgba(196,0,0,0.08); border: 1px solid rgba(196,0,0,0.2); color: #c40000;' : 'background: rgba(255,0,0,0.08); border: 1px solid rgba(255,0,0,0.2); color: #ff0000;'}
  `;
  msg.textContent = text;
  form.appendChild(msg);

  setTimeout(() => {
    msg.style.opacity = '0';
    msg.style.transition = 'opacity 0.3s ease';
    setTimeout(() => msg.remove(), 300);
  }, 5000);
}

function initParallaxDepth() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        heroBg.style.transform = `translateY(${window.scrollY * 0.1}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

function initCareerModal() {
  const modal = document.getElementById('applyModal');
  const openBtn = document.getElementById('applyBtn');
  const closeBtn = document.getElementById('modalClose');
  const fileInput = document.getElementById('fileInput');
  const fileList = document.getElementById('fileList');
  const form = document.getElementById('applyForm');
  if (!modal || !openBtn) return;

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openModal);

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  if (fileInput && fileList) {
    fileInput.addEventListener('change', () => {
      const allowed = 5;
      if (fileInput.files.length > allowed) {
        alert(`You can only upload up to ${allowed} files.`);
        fileInput.value = '';
        renderFileList();
        return;
      }
      renderFileList();
    });
  }

  function renderFileList() {
    fileList.innerHTML = '';
    const files = fileInput.files;
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      const div = document.createElement('div');
      div.className = 'file-item';
      div.innerHTML = `<span>${files[i].name}</span><button class="file-remove" data-index="${i}" type="button">&times;</button>`;
      fileList.appendChild(div);
    }
    fileList.querySelectorAll('.file-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index);
        const dt = new DataTransfer();
        const filesArr = Array.from(fileInput.files);
        filesArr.splice(idx, 1);
        filesArr.forEach(f => dt.items.add(f));
        fileInput.files = dt.files;
        renderFileList();
      });
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const inputs = form.querySelectorAll('input[required]');
      let valid = true;
      inputs.forEach(inp => {
        if (!inp.value.trim()) {
          valid = false;
          inp.style.borderColor = '#ff0000';
        } else {
          inp.style.borderColor = '';
        }
      });

      if (!valid) return showMsg(form, 'Please fill in all required fields.', false);

      document.getElementById('skTimestamp').value = Date.now();

      const submitBtn = form.querySelector('.form-submit');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Submitting...'; }

      try {
        const fd = new FormData(form);

        const res = await fetch('https://submitkit.dev/api/f/cmqz4oydv000bsp2d4u4ffjw6', {
          method: 'POST',
          body: fd,
          headers: { 'Accept': 'application/json' }
        });

        if (!res.ok) throw new Error('Server error');

        showMsg(form, 'Application submitted successfully! We will contact you soon.', true);
        form.reset();
        renderFileList();
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Submit Application'; }
        setTimeout(() => closeModal(), 3000);
      } catch {
        showMsg(form, 'Something went wrong. Please try again.', false);
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Submit Application'; }
      }
    });
  }
}
