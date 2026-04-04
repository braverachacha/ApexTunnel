import { eq } from 'drizzle-orm';
import crypto from 'crypto';

import { db } from '../db/index.js';
import { users } from '../db/schema.js';


// User data
export const userControler = async (req, res) =>{
  
  try {
    
    const user = req.user;
    
    const [ fullUser ] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    
    const details = {
      email: fullUser.email,
      joined_at: fullUser.createdAt,
      verified: fullUser.isVerified,
      token: fullUser.token
    };
    
    return res.status(200).json({
      message: 'Welcome to ApexTunnel user dashboard',
      userInfo: details
    });
    
  } catch (err) {
    console.error('Error:', err);
    
    return res.status(500).json({
      message: 'Unexpected error occured'
    });
  }
  
};

// Token regenerate

export const regenerateToken = async (req, res) =>{
  
  try {
    const user = req.user.id;
    
    // new token
    const newToken = crypto.randomBytes(32).toString('hex');
    
    // update token
    await db.update(users).set({
      token: newToken
    }).where(eq(users.id, user));
    
    // success
    res.status(201).json({
      message: 'Token regenerated successfully.',
      token: newToken
    });
    
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({
      message: 'Unexpected error eccured. Please try again later.'
    });
  }
  
};