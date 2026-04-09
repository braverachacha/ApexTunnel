import { API_URL } from '../config/config.js';
import { sendData } from '../utils/sendData.js';
import { showAlert } from '../utils/alert.js';

const steps = document.querySelectorAll('.step');

function setStep(index) {
  steps.forEach((step, i) => {
    step.classList.remove('active', 'done');
    if (i < index) step.classList.add('done');
    if (i === index) step.classList.add('active');
  });
}

function showState(id) {
  document.querySelectorAll('.verify-card').forEach(card => card.classList.add('hidden'));
  document.querySelector(`#${id}`).classList.remove('hidden');
}

async function verifyToken() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  if (!token) {
    showState('state-invalid');
    return;
  }

  try {
    // step 1 — checking token
    setStep(0);
    await sleep(600);

    // step 2 — validating request
    setStep(1);
    await sleep(500);

    // step 3 — completing verification
    setStep(2);

    await sendData({ token }, `${API_URL}/auth/verify`);

    showState('state-success');

  } catch (err) {
    const msg = err.message?.toLowerCase() || '';

    if (msg.includes('expired')) {
      showState('state-expired');
    } else {
      showState('state-invalid');
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Resend

const resendBtn = document.querySelector('#resend-btn');
const resendAlert = document.querySelector('#resend-alert');
const resendAlertMsg = document.querySelector('#resend-alert-msg');

resendBtn.addEventListener('click', async () => {
  const email = prompt('Enter your email address to resend the verification link:');
  if (!email) return;

  const originalContent = resendBtn.innerHTML;

  try {
    resendBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
    resendBtn.disabled = true;

    await sendData({ email }, `${API_URL}/auth/resend-verification`);

    resendAlert.classList.remove('hidden', 'error');
    resendAlert.classList.add('info');
    resendAlertMsg.textContent = 'Verification email sent. Check your inbox.';

  } catch (err) {
    resendAlert.classList.remove('hidden', 'info');
    resendAlert.classList.add('error');
    resendAlertMsg.textContent = err.message || 'Failed to resend. Please try again.';
  } finally {
    resendBtn.innerHTML = originalContent;
    resendBtn.disabled = false;
  }
});

verifyToken();