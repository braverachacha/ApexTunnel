import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  }
});

export const sendVerificationEmail = async (email, token)=>{
  
  try {
    
    const link = `${process.env.FRONTEND_URL}/verify.html?token=${token}`; // vite server
  
    await transporter.sendMail({
      from: `"ApexTunnel" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'ApexTunnel account verification',
      html: `
      
      <div style="font-family: sans-serif; max-width: 500px; margin: 20px auto; border: 1px solid #e1e1e1; border-radius: 8px; overflow: hidden; color: #333;">
    
      <div style="background-color: #1a1a1a; padding: 20px; text-align: center;">
        <h2 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">ApexTunnel</h2>
      </div>
    
      <div style="padding: 30px; text-align: center; line-height: 1.5;">
        <p style="font-size: 16px; margin-bottom: 20px;">Click the button below to verify your email address and get started:</p>
        
        <a href="${link}" style="display: inline-block; background-color: #0070f3; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: 500; font-size: 16px;">
          Verify Email
        </a>
        
        <p style="font-size: 13px; color: #666; margin-top: 25px;">
          Link expires in <strong>24 hours</strong>.
        </p>
        
        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; font-size: 11px; color: #999; word-break: break-all;">
          Trouble with the button? Copy this:<br>
          <a href="${link}" style="color: #0070f3;">${link}</a>
        </div>
        
      </div>
    
    </div>
  
      `
    });
    
  } catch (err) {
    console.error('Error:', err);
    throw new Error('Failed to send verification email.');
  }
  
};