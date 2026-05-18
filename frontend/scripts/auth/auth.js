import { API_URL, setCookie } from '../config/config.js';
import { showAlert } from '../utils/alert.js';
import { sendData } from '../utils/sendData.js';

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ELEMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

const alertElement =
  document.querySelector('#alert-msg');

const alertBox =
  document.querySelector('#alert');

const loginForm =
  document.querySelector('#login-form');

const registerForm =
  document.querySelector('#register-form');

const verifyForm =
  document.querySelector('#verify-form');

const authTabs =
  document.querySelector('#auth-tabs');

const registerButton =
  document.querySelector('#reg-btn');

const loginButton =
  document.querySelector('#login-btn');

const verifyButton =
  document.querySelector('#verify-btn');

const resendCodeBtn =
  document.querySelector('#resend-code-btn');

const changeEmailBtn =
  document.querySelector('#change-email-btn');

const verifyEmailText =
  document.querySelector('#verify-email-text');

const otpInputs =
  document.querySelectorAll('.otp-input');

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

let pendingEmail = '';

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SHOW ALERT HELPER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

function showMessage(message, error = false) {

  if (alertBox) {
    alertBox.classList.remove('hidden');
  }

  showAlert(
    alertElement,
    message,
    error
  );

}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VIEW SWITCHING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

function switchView(view) {

  loginForm?.classList.add('hidden');

  registerForm?.classList.add('hidden');

  verifyForm?.classList.add('hidden');

  if (view === 'login') {

    loginForm?.classList.remove('hidden');

    authTabs?.classList.remove('hidden');

  }

  if (view === 'register') {

    registerForm?.classList.remove('hidden');

    authTabs?.classList.remove('hidden');

  }

  if (view === 'verify') {

    verifyForm?.classList.remove('hidden');

    authTabs?.classList.add('hidden');

  }

}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TAB SWITCHING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

document
  .querySelectorAll('.tab')
  .forEach(tab => {

    tab.addEventListener('click', () => {

      document
        .querySelectorAll('.tab')
        .forEach(btn =>
          btn.classList.remove('active')
        );

      tab.classList.add('active');

      const tabName =
        tab.dataset.tab;

      switchView(tabName);

    });

  });

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGISTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

async function registerFunc() {

  const email =
    document.querySelector('#reg-email').value.trim();

  const password =
    document.querySelector('#reg-password').value;

  const originalContent =
    registerButton.innerHTML;

  try {

    if (!email || !password) {

      showMessage(
        'All fields are required',
        true
      );

      return;

    }

    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*[\d!@#$%^&*])(?=.{8,})/;

    if (!passwordRegex.test(password)) {

      showMessage(
        'Password must be at least 8 characters and include at least one letter and one number or special character.',
        true
      );

      return;

    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.toLowerCase())) {

      showMessage(
        'Enter a valid email format',
        true
      );

      return;

    }

    registerButton.innerHTML =
      '<i class="fa-solid fa-circle-notch fa-spin"></i> Please wait...';

    registerButton.disabled = true;

    showMessage(
      'Creating your account...',
      false
    );

    await sendData(
      {
        email,
        password
      },
      `${API_URL}/auth/register`
    );

    pendingEmail = email;

    if (verifyEmailText) {

      verifyEmailText.innerHTML = `
        Enter the 6-digit code sent to
        <strong>${email}</strong>
      `;

    }

    switchView('verify');

    showMessage(
      'Verification code sent to your email.',
      false
    );

    // focus first otp

    if (otpInputs[0]) {
      otpInputs[0].focus();
    }

  } catch (err) {

    console.error(err);

    showMessage(
      err.message ||
      'An error occurred while processing your request',
      true
    );

  } finally {

    registerButton.innerHTML =
      originalContent;

    registerButton.disabled = false;

  }

}

registerButton?.addEventListener(
  'click',
  registerFunc
);

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LOGIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

async function loginFunc() {

  const email =
    document.querySelector('#login-email').value.trim();

  const password =
    document.querySelector('#login-password').value;

  const originalContent =
    loginButton.innerHTML;

  try {

    if (!email || !password) {

      showMessage(
        'All fields are required',
        true
      );

      return;

    }

    loginButton.innerHTML =
      '<i class="fa-solid fa-circle-notch fa-spin"></i> Please wait...';

    loginButton.disabled = true;

    showMessage(
      'Signing you in...',
      false
    );

    const data =
      await sendData(
        {
          email,
          password
        },
        `${API_URL}/auth/login`
      );

    setCookie(
      'accessToken',
      data.accessToken,
      7
    );

    setCookie(
      'apexToken',
      data.apexToken,
      7
    );

    showMessage(
      'Logged in successfully!',
      false
    );

    setTimeout(() => {

      window.location.href =
        '/dashboard.html';

    }, 800);

  } catch (err) {

    console.error(err);

    showMessage(
      err.message ||
      'Login failed',
      true
    );

  } finally {

    loginButton.innerHTML =
      originalContent;

    loginButton.disabled = false;

  }

}

loginButton?.addEventListener(
  'click',
  loginFunc
);

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OTP INPUT FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

otpInputs.forEach((input, index) => {

  input.addEventListener(
    'input',
    e => {

      e.target.value =
        e.target.value.replace(/\D/g, '');

      if (
        e.target.value &&
        otpInputs[index + 1]
      ) {

        otpInputs[index + 1].focus();

      }

    }
  );

  input.addEventListener(
    'keydown',
    e => {

      if (
        e.key === 'Backspace' &&
        !input.value &&
        otpInputs[index - 1]
      ) {

        otpInputs[index - 1].focus();

      }

    }
  );

});

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERIFY ACCOUNT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

async function verifyFunc() {

  const originalContent =
    verifyButton.innerHTML;

  try {

    const code =
      [...otpInputs]
        .map(input => input.value)
        .join('');

    if (code.length !== 6) {

      showMessage(
        'Enter the full 6-digit code',
        true
      );

      return;

    }

    verifyButton.innerHTML =
      '<i class="fa-solid fa-circle-notch fa-spin"></i> Verifying...';

    verifyButton.disabled = true;

    const data =
      await sendData(
        {
          email: pendingEmail,
          code
        },
        `${API_URL}/auth/verify`
      );

    setCookie(
      'accessToken',
      data.accessToken,
      7
    );

    setCookie(
      'apexToken',
      data.apexToken,
      7
    );

    showMessage(
      'Account verified successfully!',
      false
    );

    setTimeout(() => {

      window.location.href =
        '/dashboard.html';

    }, 1000);

  } catch (err) {

    console.error(err);

    showMessage(
      err.message ||
      'Invalid verification code',
      true
    );

  } finally {

    verifyButton.innerHTML =
      originalContent;

    verifyButton.disabled = false;

  }

}

verifyButton?.addEventListener(
  'click',
  verifyFunc
);

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESEND CODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

async function resendCodeFunc() {

  const originalContent =
    resendCodeBtn.innerHTML;

  try {

    resendCodeBtn.disabled = true;

    resendCodeBtn.innerHTML =
      'Sending...';

    await sendData(
      {
        email: pendingEmail
      },
      `${API_URL}/auth/resend-code`
    );

    showMessage(
      'Verification code resent.',
      false
    );

  } catch (err) {

    console.error(err);

    showMessage(
      err.message ||
      'Failed to resend code',
      true
    );

  } finally {

    resendCodeBtn.disabled = false;

    resendCodeBtn.innerHTML =
      originalContent;

  }

}

resendCodeBtn?.addEventListener(
  'click',
  resendCodeFunc
);

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHANGE EMAIL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

changeEmailBtn?.addEventListener(
  'click',
  () => {

    document
      .querySelectorAll('.tab')
      .forEach(tab => {

        tab.classList.remove('active');

        if (
          tab.dataset.tab === 'register'
        ) {
          tab.classList.add('active');
        }

      });

    switchView('register');

  }
);

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ENTER KEY SUPPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

document.addEventListener(
  'keydown',
  e => {

    if (e.key !== 'Enter') return;

    if (
      !loginForm.classList.contains('hidden')
    ) {

      loginFunc();

    }

    else if (
      !registerForm.classList.contains('hidden')
    ) {

      registerFunc();

    }

    else if (
      !verifyForm.classList.contains('hidden')
    ) {

      verifyFunc();

    }

  }
);
