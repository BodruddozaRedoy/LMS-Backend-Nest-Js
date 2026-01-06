import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { authenticator } from 'otplib'; // OTP library

@Injectable()
export class OtpService {
  private transporter;

  constructor() {
    // Nodemailer transporter for development (using a fake Gmail account)
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your_fake_email@gmail.com', // Use your fake Gmail here
        pass: 'your_fake_email_password', // Use your fake email password here
      },
    });
  }

  // Generate OTP
  generateOtp() {
    const otp = authenticator.generate('secret'); // You can replace 'secret' with a user-specific secret
    return otp;
  }

  // Send OTP to user email
  async sendOtpToEmail(email: string, otp: string) {
    const mailOptions = {
      from: 'your_fake_email@gmail.com', // Use your fake email
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    };

    // Send OTP via email
    await this.transporter.sendMail(mailOptions);
  }

  // Verify OTP
  verifyOtp(otp: string, token: string): boolean {
    return authenticator.check(otp, token); // Check if OTP is valid
  }
}
