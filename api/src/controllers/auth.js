import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { sendVerificationEmail } from '../utils/mailer.js';

// Account registration
export const registerUser = async (req, res) =>{
  
  try {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.'
      });
    }
      
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[\d!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters and include at least one letter and one number or special character.'
      });
    }
      
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.toLowerCase())) {
      return res.status(400).json({
        message: 'Invalid email format.'
      });
    }
    
    const existingUser = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    
    if (existingUser.length > 0) {
      return res.status(409).json({
        message: 'Email already registered.'
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const token = crypto.randomBytes(32).toString('hex');
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Add new user to db 
    const [ newUser ] = await db.insert(users).values({
      email: email.toLowerCase(),
      password: hashedPassword,
      token: token,
      verificationToken: verificationToken,
      verificationTokenExpiry: new Date(Date.now() + 30 * 60 * 1000) // 30 min
    }).returning();
    
    // send verification email
    
    await sendVerificationEmail(email, verificationToken);
    
    res.json({
      message: 'Account created successfully. Check your email for account verification link.'
    });
    
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({
      message: 'Internal error.'
    });
  }
  
};

// Account verification

export const  verifyEmail= async (req, res)=>{
  
  try {
    
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        message: 'Missing verification token'
      });
    }
    
    const [ user ] = await db.select().from(users).where(eq(users.verificationToken, token)).limit(1);
    
    if (!user) {
      return res.status(401).json({
        message: 'Invalid verification link'
      });
    }
    
    // verification link expiry 
    if ( new Date() > new Date(user.verificationTokenExpiry) ) {
      return res.status(400).json({
        message: 'Verification link has expired. please request fro a new one'
      });
    }
     
    await db.update(users).set({
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
    }).where(eq(users.id, user.id));
  
    res.status(200).json({
      message: 'Account verified successfully'
    });
    
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({
      message: 'An error occured during account verification. Please try again later.'
    });
  }
};

// Account login

export const loginUser = async (req, res) => {
  
  try {
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.'
      });
    }
    
    // user lookup
    const [ user ] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }
    
    // account verification check
    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Your account have not been verified. Check your email inbox for verification link'
      });
    }
    
    // Password check
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(400).json({
        message: 'Invalid email or password'
      });
    }
    
    // accessToken & refreshToken creation
    
    const accessToken = jwt.sign(
      {  id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // success
    res.status(200).json({
      message: 'Logged in successfully',
      accessToken: accessToken,
      apexToken: user.token
    });
    
  } catch (err) {
    console.error('Error:', err);
    
    return res.status(500).json({
      message: 'An error occured. Please try again later.'
    });
  }
  
};
