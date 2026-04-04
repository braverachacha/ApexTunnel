import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { sendVerificationEmail } from '../utils/mailer.js';

import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

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
      verificationToken: verificationToken
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