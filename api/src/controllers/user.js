import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

import { db } from '../db/index.js';

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