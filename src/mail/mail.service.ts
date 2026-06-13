import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  private readonly mailMock: boolean;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('SENDGRID_API_KEY', '');
    this.mailMock = this.config.get<boolean>('MAIL_MOCK', true);

    if (!this.mailMock && apiKey) {
      sgMail.setApiKey(apiKey);
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const appUrl = this.config.get<string>('APP_URL', 'http://localhost:5173');
    const verifyUrl = `${appUrl}/verify-email?token=${token}`;
    const from = this.config.get<string>(
      'SENDGRID_FROM_EMAIL',
      'noreply@crmforge.local',
    );

    const subject = 'CRMForge — подтверждение email';
    const text = `Перейдите по ссылке для подтверждения: ${verifyUrl}`;
    const html = `<p>Подтвердите email:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`;

    await this.send({ to: email, from, subject, text, html });
  }

  private async send(message: {
    to: string;
    from: string;
    subject: string;
    text: string;
    html: string;
  }): Promise<void> {
    if (this.mailMock) {
      console.log('[MAIL_MOCK]', message);
      return;
    }

    await sgMail.send(message);
  }
}
