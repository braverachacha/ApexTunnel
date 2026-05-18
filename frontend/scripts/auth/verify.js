import { API_URL } from '../config/config.js';
import { sendData } from '../utils/sendData.js';
import { showAlert } from '../utils/alert.js';

const steps = document.querySelectorAll('.step');

const resendBtn = document.querySelector('#resend-btn');
const resendAlert = document.querySelector('#resend-alert');
const resendAlertMsg = document.querySelector('#resend-alert-msg');
const alertElement = document.querySelector('#alert-msg');

let userEmail = '';

/*
━━━━━━━━━━━━━━━━━━━━━━
STEP UI
━━━━━━━━━━━━━━━━━━━━━━
*/
function setStep(index) {
  steps.forEach((step, i) => {
    step.classList.remove('active', 'done');

    if (i < index) step.classList.add('done');
    if (i === index) step.classList.add('active');
  });
}

/*
━━━━━━━━━━━━━━━━━━━━━━
STATE SWITCH
━━━━━━━━━━━━━━━━━━━━━━
*/
function showState(id) {
  document.querySelectorAll('.verify-card')
    .forEach(card => card.classList.add('hidden'));

  const target = document.querySelector(`#${id}`);
  if (target) target.classList.remove('hidden');
}

/*
━━━━━━━━━━━━━━━━━━━━━━
INIT EMAIL + OTP FROM URL
━━━━━━━━━━━━━━━━━━━━━━
*/
function getParams() {
  const params = new URLSearchParams(window.location.search);

  return {
    email: params.get('email'),
    otp: params.get('otp') || params.get('token')
  };
}

/*
━━━━━━━━━━━━━━━━━━━━━━
VERIFY OTP (BACKEND MATCHED)
━━━━━━━━━━━━━━━━━━━━━━
*/
async function verifyToken() {
  const { email, otp } = getParams();

  userEmail = email;

  if (!email || !otp) {
    showState('state-invalid');
    showAlert(alertElement, 'Invalid verification link', true);
    return;
  }

  try {
    setStep(0);
    await sleep(300);

    setStep(1);
    await sleep(300);

    setStep(2);

    // ✅ MATCHES YOUR BACKEND EXACTLY
    await sendData(
      {
        email,
        otp
      },
      `${API_URL}/auth/verify`
    );

    showState('state-success');

  } catch (err) {
    const msg = err.message?.toLowerCase() || '';

    if (msg.includes('expired')) {
      showState('state-expired');
    } else {
      showState('state-invalid');
    }

    showAlert(
      alertElement,
      err.message || 'Verification failed',
      true
    );
  }
}

/*
━━━━━━━━━━━━━━━━━━━━━━
RESEND OTP
━━━━━━━━━━━━━━━━━━━━━━
*/
if (resendBtn) {
  resendBtn.addEventListener('click', async () => {

    const email =
      userEmail ||
      prompt('Enter your email address:');

    if (!email) return;

    const original = resendBtn.innerHTML;

    try {
      resendBtn.disabled = true;
      resendBtn.innerHTML =
        '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';

      // IMPORTANT: your backend sends OTP via register endpoint
      await sendData(
        { email },
        `${API_URL}/auth/register`
      );

      if (resendAlert && resendAlertMsg) {
        resendAlert.classList.remove('hidden', 'error');
        resendAlert.classList.add('info');
        resendAlertMsg.textContent =
          'OTP sent successfully. Check your email.';
      }

    } catch (err) {

      if (resendAlert && resendAlertMsg) {
        resendAlert.classList.remove('hidden', 'info');
        resendAlert.classList.add('error');
        resendAlertMsg.textContent =
          err.message || 'Failed to resend OTP.';
      }

    } finally {
      resendBtn.innerHTML = original;
      resendBtn.disabled = false;
    }
  });
}

/*
━━━━━━━━━━━━━━━━━━━━━━
HELPER
━━━━━━━━━━━━━━━━━━━━━━
*/
function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

/*
━━━━━━━━━━━━━━━━━━━━━━
INIT
━━━━━━━━━━━━━━━━━━━━━━
*/
verifyToken();
