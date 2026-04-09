import { API_URL, setCookie } from '../config/config.js';
import { showAlert } from '../utils/alert.js';
import { sendData } from '../utils/sendData.js';

const alertElement = document.querySelector('#alert-msg');

// ─── Register  

const registerButton = document.querySelector('#reg-btn');

async function registerFunc() {
  const email = document.querySelector('#reg-email').value;
  const password = document.querySelector('#reg-password').value;
  const originalContent = registerButton.innerHTML;

  try {
    if (!email || !password) {
      showAlert(alertElement, 'All fields are required', true);
      return;
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[\d!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
      showAlert(alertElement, 'Password must be at least 8 characters and include at least one letter and one number or special character.', true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.toLowerCase())) {
      showAlert(alertElement, 'Enter a valid email format', true);
      return;
    }

    registerButton.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Please wait...';
    registerButton.disabled = true;

    showAlert(alertElement, 'Please wait as we process your request', false);

    await sendData({ email, password }, `${API_URL}/auth/register`);

    showAlert(alertElement, 'Account created! Check your email for a verification link.', false);

  } catch (err) {
    console.error('Error:', err?.message || err);
    showAlert(alertElement, err.message || 'An error occurred while processing your request', true);
  } finally {
    registerButton.innerHTML = originalContent;
    registerButton.disabled = false;
  }
}

registerButton.addEventListener('click', registerFunc);

// ─── Login   

const loginButton = document.querySelector('#login-btn');

async function loginFunc() {
  const email = document.querySelector('#login-email').value;
  const password = document.querySelector('#login-password').value;
  const originalContent = loginButton.innerHTML;

  try {
    if (!email || !password) {
      showAlert(alertElement, 'All fields are required', true);
      return;
    }

    loginButton.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Please wait...';
    loginButton.disabled = true;

    showAlert(alertElement, 'Please wait as we process your request', false);

    const data = await sendData({ email, password }, `${API_URL}/auth/login`);

    setCookie('accessToken', data.accessToken, 7);
    setCookie('apexToken', data.apexToken, 7);

    showAlert(alertElement, 'Logged in successfully!', false);

    window.location.href = '/dashboard';

  } catch (err) {
    console.error('Error:', err?.message || err);
    showAlert(alertElement, err.message || 'An error occurred while processing your request', true);
  } finally {
    loginButton.innerHTML = originalContent;
    loginButton.disabled = false;
  }
}

loginButton.addEventListener('click', loginFunc);
