/**
 * ==========================================================================
 * DEVELOPER PORTFOLIO - JAVASCRIPT LOGIC
 * Author: Mohamed ELsayed Hemdan
 * Role: Software QA & Automation Engineer | Cybersecurity Perspective
 * ==========================================================================
 */

/**
 * ==========================================================================
 * SITE CONFIG - EDIT THIS ONLY
 * Leave a link empty ('') and its button stays hidden, so there are never
 * broken or fake links on the live site.
 * ==========================================================================
 */
const SITE_CONFIG = {
  email: 'mohamedhemdan864@gmail.com',
  // Optional: paste a Formspree / Web3Forms endpoint to send messages straight
  // to your inbox. If empty, the form opens the visitor's email app instead.
  formEndpoint: '',
  links: {
    github:   '',   // e.g. 'https://github.com/yourusername'
    linkedin: '',   // e.g. 'https://www.linkedin.com/in/yourname'
    youtube:  '',
    facebook: '',
    project1: '',   // repo link for project 1
    project2: '',   // documentation link for project 2
    project3: ''    // repo link for project 3
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // 0. Apply configured links (empty ones stay hidden)
  document.querySelectorAll('[data-link]').forEach(a => {
    const url = SITE_CONFIG.links[a.dataset.link];
    if (url) { a.href = url; a.hidden = false; }
  });
  const socialRow = document.querySelector('.social-buttons-row');
  if (socialRow && !socialRow.querySelector('a:not([hidden])')) {
    const sec = socialRow.closest('.social-links-section');
    if (sec) sec.hidden = true;
  }

  // --------------------------------------------------------------------------
  // 1. Theme Management (Dark Mode Default + LocalStorage)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;

  // Retrieve saved preference or default to 'dark'
  let savedTheme = 'dark';
  try { savedTheme = localStorage.getItem('theme') || 'dark'; } catch (e) {}
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      try { localStorage.setItem('theme', newTheme); } catch (e) {}
    });
  }

  function applyTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      themeToggleBtn.title = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;
    }
  }

  // --------------------------------------------------------------------------
  // 2. Mobile Menu Toggle
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu upon clicking any nav link
    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          mobileToggle.classList.remove('active');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        navLinks.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. Navbar Scroll Elevation
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const handleScrollElevation = () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScrollElevation, { passive: true });
  handleScrollElevation();

  // --------------------------------------------------------------------------
  // 4. Scroll-based Fade In Animations (IntersectionObserver)
  // --------------------------------------------------------------------------
  const fadeSections = document.querySelectorAll('.fade-in-section');

  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeSections.forEach(section => {
      fadeObserver.observe(section);
    });
  } else {
    // Fallback for older browsers
    fadeSections.forEach(section => section.classList.add('is-visible'));
  }

  // --------------------------------------------------------------------------
  // 5. Active Navigation Link Highlighting on Scroll
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  const highlightActiveNav = () => {
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinkItems.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightActiveNav, { passive: true });
  highlightActiveNav();

  // --------------------------------------------------------------------------
  // 6. Contact Form Handling (Validation & Client-side Feedback)
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  let feedbackTimer;
  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('senderName');
      const emailInput = document.getElementById('senderEmail');
      const subjectInput = document.getElementById('senderSubject');
      const messageInput = document.getElementById('senderMessage');
      const submitBtn = contactForm.querySelector('.form-submit-btn');

      // Basic input validations
      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      // Email regex validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message) {
        showFeedback('Please fill out all required fields.', 'error');
        return;
      }

      if (!emailPattern.test(email)) {
        showFeedback('Please enter a valid email address.', 'error');
        return;
      }

      const finish = (ok, msg) => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        showFeedback(msg, ok ? 'success' : 'error');
        if (ok) contactForm.reset();
        clearTimeout(feedbackTimer);
        feedbackTimer = setTimeout(() => {
          formFeedback.style.display = 'none';
          formFeedback.className = 'form-feedback-msg';
        }, 7000);
      };

      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg style="width:18px;height:18px;animation:spin 1s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-dasharray="31.4" stroke-dashoffset="10"/>
        </svg> Sending...
      `;

      if (SITE_CONFIG.formEndpoint) {
        fetch(SITE_CONFIG.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ name, email, subject: subject || 'Portfolio message', message })
        })
          .then(r => finish(r.ok, r.ok
            ? 'Thank you! Your message was sent. I will get back to you shortly.'
            : 'Sorry, the message could not be sent. Please email me directly.'))
          .catch(() => finish(false, 'Network error. Please email me directly.'));
      } else {
        const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
        const mailto = `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent(subject || 'Portfolio message')}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
        setTimeout(() => finish(true, 'Your email app should open with the message ready. If it did not, email me at ' + SITE_CONFIG.email), 600);
      }
    });

    function showFeedback(text, type) {
      formFeedback.textContent = text;
      formFeedback.className = `form-feedback-msg ${type}`;
      formFeedback.style.display = 'flex';
    }
  }

  // --------------------------------------------------------------------------
  // 7. Back-to-Top Button
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 8. Footer Year Update
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});
