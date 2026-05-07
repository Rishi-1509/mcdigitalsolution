// =============================================
//  MC Digital Solutions — Main JS
// =============================================

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ---- Mobile nav toggle ----
function toggleNav() {
  const navLinks = document.getElementById('navLinks');
  const toggle = document.getElementById('navToggle') || document.querySelector('.nav-toggle');
  navLinks.classList.toggle('open');
  // Animate hamburger to X
  const spans = toggle ? toggle.querySelectorAll('span') : [];
  if (navLinks.classList.contains('open')) {
    if (spans[0]) spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    if (spans[1]) spans[1].style.opacity = '0';
    if (spans[2]) spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    if (spans[0]) spans[0].style.transform = '';
    if (spans[1]) spans[1].style.opacity = '';
    if (spans[2]) spans[2].style.transform = '';
  }
}

// Close nav when clicking outside
document.addEventListener('click', (e) => {
  const navLinks = document.getElementById('navLinks');
  const toggle = document.querySelector('.nav-toggle');
  if (navLinks && navLinks.classList.contains('open')) {
    if (!navLinks.contains(e.target) && !toggle.contains(e.target)) {
      navLinks.classList.remove('open');
      const spans = toggle.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  }
});

// ---- Scroll-triggered animations ----
const animatables = document.querySelectorAll('.animate');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

animatables.forEach(el => observer.observe(el));

// ---- Contact form submission ----
async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById('submitBtn');
  const success = document.getElementById('formSuccess');
  const action = form.getAttribute('action');

  if (!action || action.includes('your_form_id_here')) {
    alert('Please configure your Formspree ID in the HTML action attribute.');
    return;
  }

  // Show loading
  if (btn) {
    btn.textContent = 'Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';
  }

  try {
    const response = await fetch(action, {
      method: 'POST',
      body: new FormData(form),
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      if (btn) {
        btn.textContent = 'Message Sent ✅';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      }
      if (success) {
        success.style.display = 'block';
      }
      form.reset();
      
      // Reset button after delay
      setTimeout(() => {
        if (btn) {
          btn.textContent = 'Send Message 🚀';
          btn.disabled = false;
          btn.style.opacity = '';
          btn.style.background = '';
        }
        if (success) success.style.display = 'none';
      }, 5000);
    } else {
      const data = await response.json();
      if (Object.hasOwn(data, 'errors')) {
        alert(data["errors"].map(error => error["message"]).join(", "));
      } else {
        alert("Oops! There was a problem submitting your form");
      }
      if (btn) {
        btn.textContent = 'Send Message 🚀';
        btn.disabled = false;
        btn.style.opacity = '';
      }
    }
  } catch (error) {
    alert("Oops! There was a problem submitting your form");
    if (btn) {
      btn.textContent = 'Send Message 🚀';
      btn.disabled = false;
      btn.style.opacity = '';
    }
  }
}

// ---- FAQ accordion ----
function toggleFaq(element) {
  const answer = element.nextElementSibling;
  const arrow = element.querySelector('.faq-arrow');
  const isOpen = answer.classList.contains('open');

  // Close all open FAQs
  document.querySelectorAll('.faq-a.open').forEach(el => {
    el.classList.remove('open');
  });
  document.querySelectorAll('.faq-arrow.rotated').forEach(el => {
    el.classList.remove('rotated');
  });

  // Open clicked (if it was closed)
  if (!isOpen) {
    answer.classList.add('open');
    if (arrow) arrow.classList.add('rotated');
  }
}

// ---- Smooth active nav highlighting ----
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});

// ---- Counter animation for stats ----
function animateCounter(el, target, duration = 1500) {
  const start = 0;
  const step = (timestamp) => {
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.floor(eased * target);
    el.textContent = current + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  };
  let startTime;
  requestAnimationFrame((ts) => { startTime = ts; step(ts); });
}

// Observe stat numbers
const statNumbers = document.querySelectorAll('.stat-box .num, .hero-stat .number');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const text = el.textContent;
      const num = parseInt(text.replace(/\D/g, ''));
      const suffix = text.replace(/[0-9]/g, '');
      if (num && !el.dataset.animated) {
        el.dataset.animated = 'true';
        el.dataset.suffix = suffix;
        animateCounter(el, num);
      }
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));
