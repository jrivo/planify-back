import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { APP_URL } from 'src/const';

@Injectable()
export class MailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendVerificationEmail(to: string, token: string) {
    const msg = {
      to,
      from: 'planify.esgi.app@gmail.com',
      subject: 'Verify your email',
      text: `To verify your email, visit this URL: ${APP_URL}/verify-email?token=${token}`,
      html: `<p>To verify your email, click <a href="${APP_URL}/verify-email?token=${token}">this link</a></p>`,
    };
    await sgMail.send(msg);
    }
}