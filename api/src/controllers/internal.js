import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { broadcast } from '../ws/index.js';

export const tunnelConnected = async (req, res) => {
  try {
    const internalSecret = req.headers['x-internal-secret'];

    if (internalSecret !== process.env.INTERNAL_SECRET) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { token, subdomain } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }
    
    if (token.length < 64) {
      return res.status(400).json({
        message: `Invalid token please visit ${process.env.FRONTEND_URL} to get one`
      });
    }

    const [user] = await db.select().from(users).where(eq(users.token, token)).limit(1);

    if (!user) {
      return res.status(404).json({
        message: `Not registered. Visit ${process.env.FRONTEND_URL}/register`
      });
    }

    // unverified users
    if (!user.isVerified) {
      return res.status(402).json({
        message: `You have not verified your email. Please check your email for verification link or visit ${process.env.FRONTEND_URL} for more info.`
      });
    }
    
    /*
    if (!user.isPremium && subdomain) {
      return res.status(403).json({
        message: `Subdomain reservation is a premium feature. Visit ${process.env.FRONTEND_URL}/upgrade or connect without --subdomain flag.`
      });
    }
  

    // premium gets their saved subdomain, free gets random
    
    // free subdomains for now 
    
    const domain = (user.isPremium && user.subdomain) ? user.subdomain : uniqueNamesGenerator({ dictionaries: [adjectives, animals], separator: '-', length: 2 
      });
      
      */
    const domain = subdomain ? subdomain :  uniqueNamesGenerator({
      dictionaries: [adjectives, animals], separator: '-',
      length: 2
    });
      
    // live dashboard update
    broadcast({
      event: 'tunnel:connected',
      subdomain: domain,
      email: user.email,
      isPremium: user.isPremium
    });

    return res.status(200).json({
      subdomain: domain,
      email: user.email,
      isPremium: user.isPremium
    });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Unexpected error' });
  }
};

export const tunnelDisconnected = async (req, res) => {
  try {
    const internalSecret = req.headers['x-internal-secret'];

    if (internalSecret !== process.env.INTERNAL_SECRET) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { subdomain } = req.body;

    if (!subdomain) {
      return res.status(400).json({ message: 'Subdomain is required' });
    }
    
    // live dashboard update
    broadcast({
      event: 'tunnel:disconnected',
      subdomain: subdomain
    });

    return res.status(200).json({ message: 'Tunnel disconnected' });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Unexpected error' });
  }
};