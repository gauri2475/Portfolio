/* ==========================================================================
   Gauri Malik Portfolio - Main Application Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCanvasParticles();
  initAutoTyping();
  initNavigation();
  initProjectFilters();
  initSkillBars();
  initModals();
  initContactForm();
});

/* 1. Permanent Dark Theme Initialization */
function initTheme() {
  document.documentElement.setAttribute('data-theme', 'dark');
}

/* 2. Interactive Background Canvas Particle Effect */
function initCanvasParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.floor(width / 35);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const particleColor = isLight ? '79, 70, 229' : '6, 182, 212';

    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${particleColor}, ${p.alpha})`;
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${particleColor}, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* 3. Hero Subtitle Auto-Typing Effect */
function initAutoTyping() {
  const typingEl = document.getElementById('typing-headline');
  if (!typingEl) return;

  const roles = [
    "Frontend Developer",
    "B.Tech Computer Science Student"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
      typingEl.innerText = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingEl.innerText = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentRole.length) {
      typeSpeed = 2000; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* 4. Navbar Scrolling & Active Links */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinksContainer = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  if (mobileMenuBtn && navLinksContainer) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinksContainer.classList.toggle('active');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        icon.className = navLinksContainer.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });
  }
}

/* 5. Project Filtering */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* 6. Skill Bars Animation on Scroll */
function initSkillBars() {
  const skillSection = document.getElementById('skills');
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  if (!skillSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillBars.forEach(bar => {
          const width = bar.getAttribute('data-width');
          bar.style.width = width;
        });
      }
    });
  }, { threshold: 0.2 });

  observer.observe(skillSection);
}

/* 7. Modal Dialog Management & Mini-Widget Launchers */
function initModals() {
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  const closeBtns = document.querySelectorAll('.modal-close-btn');

  // Trigger buttons
  const launchTypingBtn = document.getElementById('launch-typing-btn');
  const launchWeatherBtn = document.getElementById('launch-weather-btn');
  const openResumeBtn = document.getElementById('open-resume-btn');
  const heroResumeBtn = document.getElementById('hero-resume-btn');

  let typingGameInstance = null;
  let weatherWidgetInstance = null;

  if (launchTypingBtn) {
    launchTypingBtn.addEventListener('click', () => {
      openModal('typing-modal');
      if (!typingGameInstance && window.TypingGame) {
        typingGameInstance = new window.TypingGame();
      }
      if (typingGameInstance) typingGameInstance.resetGame();
    });
  }

  if (launchWeatherBtn) {
    launchWeatherBtn.addEventListener('click', () => {
      openModal('weather-modal');
      if (!weatherWidgetInstance && window.WeatherWidget) {
        weatherWidgetInstance = new window.WeatherWidget();
      }
    });
  }

  if (openResumeBtn) {
    openResumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('resume-modal');
    });
  }

  if (heroResumeBtn) {
    heroResumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('resume-modal');
    });
  }

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modalOverlays.forEach(overlay => overlay.classList.remove('active'));
    });
  });

  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });
}

function openModal(modalId) {
  const targetModal = document.getElementById(modalId);
  if (targetModal) {
    targetModal.classList.add('active');
  }
}

/* 8. Contact Form & Clipboard Helper */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyPhoneBtn = document.getElementById('copy-phone-btn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Send Message';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending Message...`;
      }

      const formData = new FormData(form);

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          showToast("Message delivered successfully! Gauri will get back to you shortly.", "success");
          form.reset();
        } else {
          // If access key is pending or invalid, fallback gracefully to direct mailto client
          const name = formData.get('name') || '';
          const email = formData.get('email') || '';
          const msg = formData.get('message') || '';
          window.location.href = `mailto:gaurimalik24@gmail.com?subject=Portfolio%20Contact%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(msg + '\n\nSender Email: ' + email)}`;
          showToast("Opening email app to send message to gaurimalik24@gmail.com!");
        }
      } catch (err) {
        const name = formData.get('name') || '';
        const email = formData.get('email') || '';
        const msg = formData.get('message') || '';
        window.location.href = `mailto:gaurimalik24@gmail.com?subject=Portfolio%20Contact%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(msg + '\n\nSender Email: ' + email)}`;
        showToast("Opening email app to send message to gaurimalik24@gmail.com!");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('gaurimalik24@gmail.com');
      showToast("Email copied to clipboard!");
    });
  }

  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('+91 8595069717');
      showToast("Phone number copied to clipboard!");
    });
  }
}

/* 9. Global Toast Notification Utility */
function showToast(message, type = 'info') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas fa-check-circle" style="color: var(--accent-cyan)"></i> <span>${message}</span>`;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
