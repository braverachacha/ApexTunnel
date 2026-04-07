/*
   THEME TOGGLE
 */
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

/* 
   SCROLL REVEAL ANIMATION (Landing Page)
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
   TERMINAL ANIMATION (Landing Page)
*/
const terminalBody = document.getElementById('terminalBody');
if (terminalBody && terminalBody.closest('.hero')) {
  const originalContent = terminalBody.innerHTML;
  
  // Reset terminal initially
  terminalBody.innerHTML = '<div><span class="t-muted">$</span> <span class="t-cyan">APEX_CLIENT_TOKEN</span>=<span class="t-white">your_token</span> node client.js --port 8000</div><div>&nbsp;</div><div><span class="cursor"></span></div>';
  
  // Animate after 2 seconds
  setTimeout(() => {
    terminalBody.innerHTML = originalContent;
  }, 2000);
}

/*
   MOBILE MENU TOGGLE (Landing Page)
*/
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

/*
   SMOOTH SCROLL (Landing Page)
*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/*
   AUTH PAGE TAB SWITCHING (Login/Register)
*/
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authTabs = document.querySelectorAll('.auth-tabs .tab');

function switchAuthTab(tabName) {
  // Update tab buttons
  authTabs.forEach(tab => {
    if (tab.getAttribute('data-tab') === tabName) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  
  // Show/hide forms
  if (loginForm && registerForm) {
    if (tabName === 'login') {
      loginForm.classList.remove('hidden');
      registerForm.classList.add('hidden');
    } else {
      loginForm.classList.add('hidden');
      registerForm.classList.remove('hidden');
    }
  }
}

// Add click handlers to auth tabs
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
   DASHBOARD SIDEBAR TAB SWITCHING
*/
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const dashboardSections = document.querySelectorAll('.dashboard-section');

function switchDashboardSection(sectionId) {
  // Update sidebar links
  sidebarLinks.forEach(link => {
    if (link.getAttribute('data-section') === sectionId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  // Show/hide sections
  dashboardSections.forEach(section => {
    if (section.id === `${sectionId}-section`) {
      section.classList.add('active');
    } else {
      section.classList.remove('active');
    }
  });
}

// Add click handlers to dashboard sidebar links
if (sidebarLinks.length > 0 && dashboardSections.length > 0) {
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = link.getAttribute('data-section');
      if (sectionId) {
        switchDashboardSection(sectionId);
      }
    });
  });
}

/*
   PASSWORD VISIBILITY TOGGLE
*/
const toggleButtons = document.querySelectorAll('.toggle-pw');

toggleButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const targetInput = document.getElementById(targetId);
    
    if (targetInput) {
      const type = targetInput.getAttribute('type');
      const icon = btn.querySelector('i');
      
      if (type === 'password') {
        targetInput.setAttribute('type', 'text');
        if (icon) {
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        }
      } else {
        targetInput.setAttribute('type', 'password');
        if (icon) {
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      }
    }
  });
});

/*
   PASSWORD STRENGTH METER (Visual only, no submission)
*/
const regPassword = document.getElementById('reg-password');
const pwStrengthDiv = document.getElementById('pw-strength');
const strengthLabel = document.getElementById('strength-label');

function checkPasswordStrength(password) {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
  if (password.match(/[0-9]/)) strength++;
  if (password.match(/[^a-zA-Z0-9]/)) strength++;

  if (password.length === 0) {
    return { level: null, text: '' };
  } else if (strength <= 1) {
    return { level: 'weak', text: 'Weak' };
  } else if (strength === 2) {
    return { level: 'medium', text: 'Medium' };
  } else {
    return { level: 'strong', text: 'Strong' };
  }
}

const strengthBar = document.getElementById('strength-bar');

const strengthLevels = {
  weak:   { width: '33%',  color: 'var(--danger)' },
  medium: { width: '66%',  color: 'oklch(0.75 0.18 85)' },
  strong: { width: '100%', color: 'var(--success)' }
};

if (regPassword && pwStrengthDiv) {
  regPassword.addEventListener('input', () => {
    const password = regPassword.value;
    const result = checkPasswordStrength(password);

    if (result.level === null) {
      pwStrengthDiv.classList.add('hidden');
    } else {
      pwStrengthDiv.classList.remove('hidden');

      if (strengthBar) {
        strengthBar.style.setProperty('--width', strengthLevels[result.level].width);
        strengthBar.style.setProperty('--color', strengthLevels[result.level].color);
      }

      if (strengthLabel) {
        strengthLabel.textContent = result.text;
        strengthLabel.style.color = strengthLevels[result.level].color;
      }
    }
  });
}