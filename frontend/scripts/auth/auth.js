import { API_URL, setCookie } from '../config/config.js';
import { showAlert } from '../utils/alert.js';
import { sendData } from '../utils/sendData.js';

/*
━━━━━━━━━━━━━━━━━━━━━━
ELEMENTS
━━━━━━━━━━━━━━━━━━━━━━
*/

const alertElement = document.querySelector('#alert-msg');
const alertBox = document.querySelector('#alert');

const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');
const verifyForm = document.querySelector('#verify-form');

const loginButton = document.querySelector('#login-btn');
const registerButton = document.querySelector('#reg-btn');
const verifyButton = document.querySelector('#verify-btn');

const resendCodeBtn = document.querySelector('#resend-code-btn');
const changeEmailBtn = document.querySelector('#change-email-btn');

const otpInputs = document.querySelectorAll('.otp-input');
const verifyEmailText = document.querySelector('#verify-email-text');

/*
━━━━━━━━━━━━━━━━━━━━━━
STATE
━━━━━━━━━━━━━━━━━━━━━━
*/

let pendingEmail = '';

/*
━━━━━━━━━━━━━━━━━━━━━━
ALERT
━━━━━━━━━━━━━━━━━━━━━━
*/

function showMessage(msg, isError = false) {
  alertBox?.classList.remove('hidden');
  showAlert(alertElement, msg, isError);
}

/*
━━━━━━━━━━━━━━━━━━━━━━
VIEW SWITCH
━━━━━━━━━━━━━━━━━━━━━━
*/

function switchView(view) {
  loginForm?.classList.add('hidden');
  registerForm?.classList.add('hidden');
  verifyForm?.classList.add('hidden');

  if (view === 'login') loginForm?.classList.remove('hidden');
  if (view === 'register') registerForm?.classList.remove('hidden');
  if (view === 'verify') verifyForm?.classList.remove('hidden');
}

/*
━━━━━━━━━━━━━━━━━━━━━━
REGISTER (SENDS OTP)
━━━━━━━━━━━━━━━━━━━━━━
*/

async function registerFunc() {
  const email = document.querySelector('#reg-email').value.trim();
  const password = document.querySelector('#reg-password').value;

  try {
    if (!email || !password) {
      return showMessage('All fields are required', true);
    }

    registerButton.disabled = true;

    showMessage('Sending verification code...', false);

    await sendData(
      { email, password },
      `${API_URL}/auth/register`
    );

    pendingEmail = email;

    verifyEmailText.innerHTML = `
      Enter the 6-digit code sent to <strong>${email}</strong>
    `;

    switchView('verify');

    otpInputs[0]?.focus();

  } catch (err) {
    showMessage(err.message || 'Registration failed', true);
  } finally {
    registerButton.disabled = false;
  }
}

registerButton?.addEventListener('click', registerFunc);

/*
━━━━━━━━━━━━━━━━━━━━━━
LOGIN
━━━━━━━━━━━━━━━━━━━━━━
*/

async function loginFunc() {
  const email = document.querySelector('#login-email').value.trim();
  const password = document.querySelector('#login-password').value;

  try {
    if (!email || !password) {
      return showMessage('All fields are required', true);
    }

    loginButton.disabled = true;

    const data = await sendData(
      { email, password },
      `${API_URL}/auth/login`
    );

    setCookie('accessToken', data.accessToken, 7);
    setCookie('apexToken', data.apexToken, 7);

    window.location.href = '/dashboard.html';

  } catch (err) {
    showMessage(err.message || 'Login failed', true);
  } finally {
    loginButton.disabled = false;
  }
}

loginButton?.addEventListener('click', loginFunc);

/*
━━━━━━━━━━━━━━━━━━━━━━
OTP INPUT FLOW
━━━━━━━━━━━━━━━━━━━━━━
*/

otpInputs.forEach((input, i) => {
  input.addEventListener('input', e => {
    e.target.value = e.target.value.replace(/\D/g, '');

    if (e.target.value && otpInputs[i + 1]) {
      otpInputs[i + 1].focus();
    }
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Backspace' && !input.value && otpInputs[i - 1]) {
      otpInputs[i - 1].focus();
    }
  });
});

/*
━━━━━━━━━━━━━━━━━━━━━━
VERIFY OTP (FIXED HERE 🔥)
━━━━━━━━━━━━━━━━━━━━━━
*/

async function verifyFunc() {
  const otp = [...otpInputs].map(i => i.value).join('');

  try {
    if (!pendingEmail) {
      return showMessage('Email missing, restart registration', true);
    }

    if (otp.length !== 6) {
      return showMessage('Enter full 6-digit code', true);
    }

    verifyButton.disabled = true;

    const data = await sendData(
      {
        email: pendingEmail,
        otp   // ✅ FIX: backend expects "otp", NOT "code"
      },
      `${API_URL}/auth/verify`
    );

    setCookie('accessToken', data.accessToken, 7);
    setCookie('apexToken', data.apexToken, 7);

    showMessage('Verified successfully!', false);

    setTimeout(() => {
      window.location.href = '/dashboard.html';
    }, 800);

  } catch (err) {
    showMessage(err.message || 'Invalid OTP', true);
  } finally {
    verifyButton.disabled = false;
  }
}

verifyButton?.addEventListener('click', verifyFunc);

/*
━━━━━━━━━━━━━━━━━━━━━━
RESEND OTP (FIXED ENDPOINT)
━━━━━━━━━━━━━━━━━━━━━━
*/

async function resendCodeFunc() {
  try {
    if (!pendingEmail) {
      return showMessage('No email found', true);
    }

    resendCodeBtn.disabled = true;

    await sendData(
      { email: pendingEmail },
      `${API_URL}/auth/resend-verification`
    );

    showMessage('OTP resent successfully', false);

  } catch (err) {
    showMessage(err.message || 'Failed to resend OTP', true);
  } finally {
    resendCodeBtn.disabled = false;
  }
}

resendCodeBtn?.addEventListener('click', resendCodeFunc);

/*
━━━━━━━━━━━━━━━━━━━━━━
CHANGE EMAIL
━━━━━━━━━━━━━━━━━━━━━━
*/

changeEmailBtn?.addEventListener('click', () => {
  pendingEmail = '';
  switchView('register');
});
