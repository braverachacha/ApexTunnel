import { VERSION } from './config/config.js';

/*
   VERSION TAGS
*/
const versionElements = document.querySelectorAll('.js-version');

if (versionElements.length > 0) {
  versionElements.forEach(tag => {
    tag.textContent = VERSION;
  });
}

/*
   THEME TOGGLE
*/
const themeToggle = document.getElementById('themeToggle');
const moonIcon = themeToggle?.querySelector('.fa-moon');
const sunIcon = themeToggle?.querySelector('.fa-sun');

const savedTheme = localStorage.getItem('theme');

function setTheme(theme) {

  document.body.classList.remove('dark-theme', 'light-theme');

  document.body.classList.add(`${theme}-theme`);

  localStorage.setItem('theme', theme);

  if (moonIcon && sunIcon) {

    if (theme === 'dark') {
      moonIcon.style.display = 'none';
      sunIcon.style.display = 'inline-block';
    } else {
      moonIcon.style.display = 'inline-block';
      sunIcon.style.display = 'none';
    }

  }

}

if (savedTheme === 'dark') {
  setTheme('dark');
} else if (savedTheme === 'light') {
  setTheme('light');
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  setTheme('dark');
}

if (themeToggle) {

  themeToggle.addEventListener('click', () => {

    if (document.body.classList.contains('dark-theme')) {
      setTheme('light');
    } else {
      setTheme('dark');
    }

  });

}

/*
   SCROLL REVEAL
*/
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

if (revealElements.length > 0) {

  window.addEventListener('scroll', checkReveal);
  window.addEventListener('load', checkReveal);

}

/*
   TERMINAL ANIMATION
*/
const terminalBody = document.getElementById('terminalBody');

if (terminalBody && terminalBody.closest('.hero')) {

  const originalContent = terminalBody.innerHTML;

  terminalBody.innerHTML = `
    <div>
      <span class="t-muted">$</span>
      <span class="t-cyan">./apex.sh</span>
      --port 8000 --subdomain test
    </div>

    <div>&nbsp;</div>

    <div>
      <span class="cursor"></span>
    </div>
  `;

  setTimeout(() => {
    terminalBody.innerHTML = originalContent;
  }, 2000);

}

/*
   MOBILE MENU
*/
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {

  mobileMenuBtn.addEventListener('click', () => {

    mobileMenu.classList.toggle('active');

    const icon = mobileMenuBtn.querySelector('i');

    if (!icon) return;

    if (mobileMenu.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }

  });

  mobileMenu.querySelectorAll('a').forEach(link => {

    link.addEventListener('click', () => {

      mobileMenu.classList.remove('active');

      const icon = mobileMenuBtn.querySelector('i');

      if (!icon) return;

      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');

    });

  });

}

/*
   SMOOTH SCROLL
*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {

  anchor.addEventListener('click', function (e) {

    const href = this.getAttribute('href');

    if (!href || href === '#') return;

    const target = document.querySelector(href);

    if (target) {

      e.preventDefault();

      target.scrollIntoView({
        behavior: 'smooth'
      });

    }

  });

});

/*
   AUTH TABS
*/
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authTabs = document.querySelectorAll('.auth-tabs .tab');

function switchAuthTab(tabName) {

  authTabs.forEach(tab => {

    if (tab.getAttribute('data-tab') === tabName) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }

  });

  if (!loginForm || !registerForm) return;

  if (tabName === 'login') {

    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');

  } else {

    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');

  }

}

if (authTabs.length > 0) {

  authTabs.forEach(tab => {

    tab.addEventListener('click', () => {

      const tabName = tab.getAttribute('data-tab');

      if (tabName) {
        switchAuthTab(tabName);
      }

    });

  });

}

/*
   DASHBOARD SIDEBAR
*/
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const dashboardSections = document.querySelectorAll('.dashboard-section');

function switchDashboardSection(sectionId) {

  sidebarLinks.forEach(link => {

    if (link.getAttribute('data-section') === sectionId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }

  });

  dashboardSections.forEach(section => {

    if (section.id === `${sectionId}-section`) {
      section.classList.add('active');
    } else {
      section.classList.remove('active');
    }

  });

}

if (sidebarLinks.length > 0 && dashboardSections.length > 0) {

  sidebarLinks.forEach(link => {

    link.addEventListener('click', e => {

      e.preventDefault();

      const sectionId = link.getAttribute('data-section');

      if (sectionId) {
        switchDashboardSection(sectionId);
      }

    });

  });

}

/*
   PASSWORD VISIBILITY
*/
const toggleButtons = document.querySelectorAll('.toggle-pw');

toggleButtons.forEach(btn => {

  btn.addEventListener('click', () => {

    const targetId = btn.getAttribute('data-target');

    if (!targetId) return;

    const targetInput = document.getElementById(targetId);

    if (!targetInput) return;

    const icon = btn.querySelector('i');

    const isPassword =
      targetInput.getAttribute('type') === 'password';

    targetInput.setAttribute(
      'type',
      isPassword ? 'text' : 'password'
    );

    if (icon) {

      icon.classList.toggle('fa-eye');
      icon.classList.toggle('fa-eye-slash');

    }

  });

});

/*
   PASSWORD STRENGTH
*/
const regPassword = document.getElementById('reg-password');
const pwStrengthDiv = document.getElementById('pw-strength');
const strengthLabel = document.getElementById('strength-label');
const strengthBar = document.getElementById('strength-bar');

const strengthLevels = {

  weak: {
    width: '33%',
    color: 'var(--danger)'
  },

  medium: {
    width: '66%',
    color: 'oklch(0.75 0.18 85)'
  },

  strong: {
    width: '100%',
    color: 'var(--success)'
  }

};

function checkPasswordStrength(password) {

  let strength = 0;

  if (password.length >= 8) strength++;

  if (
    password.match(/[a-z]/) &&
    password.match(/[A-Z]/)
  ) {
    strength++;
  }

  if (password.match(/[0-9]/)) {
    strength++;
  }

  if (password.match(/[^a-zA-Z0-9]/)) {
    strength++;
  }

  if (password.length === 0) {

    return {
      level: null,
      text: ''
    };

  }

  if (strength <= 1) {

    return {
      level: 'weak',
      text: 'Weak'
    };

  }

  if (strength === 2) {

    return {
      level: 'medium',
      text: 'Medium'
    };

  }

  return {
    level: 'strong',
    text: 'Strong'
  };

}

if (regPassword && pwStrengthDiv) {

  regPassword.addEventListener('input', () => {

    const result =
      checkPasswordStrength(regPassword.value);

    if (!result.level) {

      pwStrengthDiv.classList.add('hidden');

      return;

    }

    pwStrengthDiv.classList.remove('hidden');

    if (strengthBar) {

      strengthBar.style.setProperty(
        '--width',
        strengthLevels[result.level].width
      );

      strengthBar.style.setProperty(
        '--color',
        strengthLevels[result.level].color
      );

    }

    if (strengthLabel) {

      strengthLabel.textContent = result.text;

      strengthLabel.style.color =
        strengthLevels[result.level].color;

    }

  });

}

/*
   404 STARFIELD
*/
const starsContainer = document.querySelector('.stars');

if (starsContainer) {

  const starCount = 120;

  for (let i = 0; i < starCount; i++) {

    const star = document.createElement('div');

    star.className = 'star';

    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';

    star.style.setProperty(
      '--duration',
      (Math.random() * 3 + 1.5) + 's'
    );

    star.style.setProperty(
      '--opacity',
      (Math.random() * 0.7 + 0.3).toFixed(2)
    );

    star.style.setProperty(
      '--delay',
      (Math.random() * 4).toFixed(2) + 's'
    );

    starsContainer.appendChild(star);

  }

  function createShootingStar() {

    const shootingStar =
      document.createElement('div');

    shootingStar.className = 'shooting-star';

    shootingStar.style.top =
      Math.random() * 40 + '%';

    shootingStar.style.left =
      Math.random() * 30 + '%';

    starsContainer.appendChild(shootingStar);

    setTimeout(() => {
      shootingStar.remove();
    }, 4000);

  }

  setInterval(createShootingStar, 5000);

  setTimeout(createShootingStar, 2000);

}

/*
   ASTRONAUT PARALLAX
*/
const astronaut = document.querySelector('.astronaut');

if (astronaut) {

  document.addEventListener('mousemove', e => {

    const x =
      (e.clientX / window.innerWidth - 0.5) * 15;

    const y =
      (e.clientY / window.innerHeight - 0.5) * 15;

    astronaut.style.transform =
      `translate(${x}px, ${y}px)`;

  });

}
