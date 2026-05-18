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
  document
    .querySelectorAll('.verify-card')
    .forEach(card => card.classList.add('hidden'));

  const target = document.querySelector(`#${id}`);
  if (target) target.classList.remove('hidden');
}

/*
━━━━━━━━━━━━━━━━━━━━━━
VERIFY EMAIL + OTP FLOW
━━━━━━━━━━━━━━━━━━━━━━
*/
async function verifyToken() {
  const params = new URLSearchParams(window.location.search);

  const email = params.get('email');
  const otp = params.get('otp') || params.get('token');

  userEmail = email;

  if (!email || !otp) {
    showState('state-invalid');
    return;
  }

  try {
    setStep(0);
    await sleep(400);

    setStep(1);
    await sleep(400);

    setStep(2);

    // ✅ FIX: backend expects email + otp
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
SLEEP HELPER
━━━━━━━━━━━━━━━━━━━━━━
*/
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/*
━━━━━━━━━━━━━━━━━━━━━━
RESEND CODE
━━━━━━━━━━━━━━━━━━━━━━
*/
if (resendBtn) {
  resendBtn.addEventListener('click', async () => {

    const email =
      userEmail ||
      prompt('Enter your email address to resend the verification code:');

    if (!email) return;

    const originalContent = resendBtn.innerHTML;

    try {
      resendBtn.innerHTML =
        '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';

      resendBtn.disabled = true;

      await sendData(
        { email },
        `${API_URL}/auth/resend-verification`
      );

      if (resendAlert && resendAlertMsg) {
        resendAlert.classList.remove('hidden', 'error');
        resendAlert.classList.add('info');
        resendAlertMsg.textContent =
          'Verification email sent. Check your inbox.';
      }

    } catch (err) {

      if (resendAlert && resendAlertMsg) {
        resendAlert.classList.remove('hidden', 'info');
        resendAlert.classList.add('error');
        resendAlertMsg.textContent =
          err.message || 'Failed to resend. Please try again.';
      }

    } finally {

      resendBtn.innerHTML = originalContent;
      resendBtn.disabled = false;

    }
  });
}

/*
━━━━━━━━━━━━━━━━━━━━━━
INIT
━━━━━━━━━━━━━━━━━━━━━━
*/
verifyToken();
