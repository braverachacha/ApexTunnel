import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { sendOTPEmail } from '../utils/mailer.js';

/**
 * Generate a 6-digit OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Hash OTP for secure storage
 */
function hashOTP(otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

/**
 * STEP 1: Register with email and send OTP
 * POST /auth/register
 * Body: { email }
 */
export const registerUser = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        message: 'Email is required.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.toLowerCase())) {
      return res.status(400).json({
        message: 'Invalid email format.',
      });
    }

    // Check if email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      // Email exists, send OTP for login verification
      const otp = generateOTP();
      const otpHash = hashOTP(otp);
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await db
        .update(users)
        .set({
          otpHash: otpHash,
          otpExpiry: otpExpiry,
        })
        .where(eq(users.email, email.toLowerCase()));

      // Send OTP email
      await sendOTPEmail(email, otp);

      return res.status(200).json({
        message: 'OTP sent to your email. It expires in 10 minutes.',
        isExistingUser: true,
      });
    }

    // New user: generate OTP and temporary account
    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const apexToken = crypto.randomBytes(32).toString('hex');

    // Create user account
    await db.insert(users).values({
      email: email.toLowerCase(),
      password: null,
      isVerified: false,
      token: apexToken,
      otpHash: otpHash,
      otpExpiry: otpExpiry,
    });

    // Send OTP email
    await sendOTPEmail(email, otp);

    return res.status(201).json({
      message: 'Account created sucessfully. OTP sent to your email. It expires in 10 minutes.',
      isExistingUser: false,
    });
  } catch (err) {
    console.error('Error during registration:', err);
    return res.status(500).json({
      message: 'Internal error during registration.',
    });
  }
};

/**
 * STEP 2: Verify OTP and complete authentication
 * POST /auth/verify
 * Body: { email, otp }
 */
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: 'Email and OTP are required.',
      });
    }

    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or OTP.',
      });
    }

    // Check OTP expiry
    if (!user.otpExpiry || new Date() > new Date(user.otpExpiry)) {
      return res.status(400).json({
        message: 'OTP has expired. Request a new one.',
      });
    }

    // Verify OTP
    const otpHash = hashOTP(otp);
    if (otpHash !== user.otpHash) {
      return res.status(401).json({
        message: 'Invalid email or OTP.',
      });
    }

    // Mark account as verified and clear OTP
    await db
      .update(users)
      .set({
        isVerified: true,
        otpHash: null,
        otpExpiry: null,
      })
      .where(eq(users.id, user.id));

    // Generate JWT access token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'OTP verified successfully.',
      accessToken: accessToken,
      apexToken: user.token,
    });
  } catch (err) {
    console.error('Error during OTP verification:', err);
    return res.status(500).json({
      message: 'Internal error during verification.',
    });
  }
};
