// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const moonIcon = themeToggle?.querySelector('.fa-moon');
const sunIcon = themeToggle?.querySelector('.fa-sun');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark-theme');
  if (moonIcon && sunIcon) {
    moonIcon.style.display = 'none';
    sunIcon.style.display = 'inline-block';
  }
} else if (savedTheme === 'light') {
  document.body.classList.add('light-theme');
  if (moonIcon && sunIcon) {
    moonIcon.style.display = 'none';
    sunIcon.style.display = 'inline-block';
  }
} else {
  // Default to system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-theme');
    if (moonIcon && sunIcon) {
      moonIcon.style.display = 'none';
      sunIcon.style.display = 'inline-block';
    }
  }
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('dark-theme')) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
      if (moonIcon && sunIcon) {
        moonIcon.style.display = 'inline-block';
        sunIcon.style.display = 'none';
      }
    } else if (document.body.classList.contains('light-theme')) {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
      if (moonIcon && sunIcon) {
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'inline-block';
      }
    } else {
      // If no theme class, default to dark
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
      if (moonIcon && sunIcon) {
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'inline-block';
      }
    }
  });
}

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');

function checkReveal() {
  const windowHeight = window.innerHeight;
  const revealThreshold = 150;

  revealElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    if (elementTop < windowHeight - revealThreshold) {
      element.classList.add('active');
    }
  });
}

window.addEventListener('scroll', checkReveal);
window.addEventListener('load', checkReveal);

// Terminal Animation (typed effect - pure visual, no logic)
const terminalBody = document.getElementById('terminalBody');
if (terminalBody) {
  const originalContent = terminalBody.innerHTML;
  
  // Reset terminal initially
  terminalBody.innerHTML = '<div><span class="t-muted">$</span> <span class="t-cyan">APEX_CLIENT_TOKEN</span>=<span class="t-white">your_token</span> node client.js --port 8000</div><div>&nbsp;</div><div><span class="cursor"></span></div>';
  
  // Animate after 2 seconds
  setTimeout(() => {
    terminalBody.innerHTML = originalContent;
  }, 2000);
}

// Mobile Menu Toggle (pure UI animation)
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    if (mobileMenu.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });
  
  // Close mobile menu when clicking a link
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      const icon = mobileMenuBtn.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    });
  });
}

// Smooth scroll for anchor links (pure navigation animation)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});