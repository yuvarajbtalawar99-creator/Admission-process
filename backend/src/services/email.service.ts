import nodemailer, { Transporter } from 'nodemailer';
import logger from '../utils/logger.util';
import { getRegistrationOtpEmailHtml } from '../templates/emails/registrationOtp';
import { getForgotPasswordOtpEmailHtml } from '../templates/emails/forgotPasswordOtp';

class EmailService {
  private transporter: Transporter | null = null;
  private initPromise: Promise<Transporter> | null = null;

  constructor() {
    this.initTransporter().catch((err) => {
      logger.error('Gmail SMTP Verification Error:', err);
    });
  }

  private async initTransporter(): Promise<Transporter> {
    if (this.transporter) {
      return this.transporter;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      const user = process.env.EMAIL_USER;
      const pass = process.env.EMAIL_PASS;

      if (!user || !pass) {
        logger.error('Nodemailer configuration error: EMAIL_USER or EMAIL_PASS environment variable is missing.');
      }

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user,
          pass,
        },
        connectionTimeout: 30000,
        greetingTimeout: 30000,
        socketTimeout: 30000,
        tls: {
          rejectUnauthorized: false,
        },
      });

      try {
        await transporter.verify();
        logger.info('✅ Gmail SMTP Connected');
      } catch (error) {
        logger.error('Gmail SMTP verification failed:', error);
      }

      this.transporter = transporter;
      return transporter;
    })();

    return this.initPromise;
  }

  private getFromAddress(): string {
    return process.env.EMAIL_FROM || process.env.EMAIL_USER || 'JCER Admissions <collegeadmission.erp@gmail.com>';
  }

  private async sendMailWithRetry(mailOptions: nodemailer.SendMailOptions): Promise<nodemailer.SentMessageInfo> {
    const transporter = await this.initTransporter();
    try {
      return await transporter.sendMail(mailOptions);
    } catch (error: any) {
      const isTimeout =
        error?.code === 'ETIMEOUT' ||
        (typeof error?.message === 'string' && error.message.includes('ETIMEOUT'));

      if (isTimeout) {
        logger.warn(`ETIMEOUT encountered while sending email to ${mailOptions.to}. Retrying sendMail one more time...`);
        return await transporter.sendMail(mailOptions);
      }
      throw error;
    }
  }

  /**
   * Send Registration OTP Email using Nodemailer Gmail SMTP
   */
  public async sendRegistrationOTP(email: string, name: string, otp: string): Promise<boolean> {
    try {
      const html = getRegistrationOtpEmailHtml({ name, otp });
      const from = this.getFromAddress();

      const mailOptions = {
        from,
        to: email,
        subject: 'Verify Your Email Address – JCER Admission Portal',
        html,
      };

      const info = await this.sendMailWithRetry(mailOptions);

      logger.info(`Registration OTP email successfully sent via Gmail SMTP to ${email} (Message ID: ${info.messageId})`);
      return true;
    } catch (error: any) {
      logger.error(`Failed to send Registration OTP email via Nodemailer to ${email}:`, error);
      return false;
    }
  }

  /**
   * Send Forgot Password OTP Email using Nodemailer Gmail SMTP
   */
  public async sendForgotPasswordOTP(email: string, name: string, otp: string): Promise<boolean> {
    try {
      const html = getForgotPasswordOtpEmailHtml({ name, otp });
      const from = this.getFromAddress();

      const mailOptions = {
        from,
        to: email,
        subject: 'Reset Your JCER Admission Portal Password',
        html,
      };

      const info = await this.sendMailWithRetry(mailOptions);

      logger.info(`Forgot Password OTP email successfully sent via Gmail SMTP to ${email} (Message ID: ${info.messageId})`);
      return true;
    } catch (error: any) {
      logger.error(`Failed to send Forgot Password OTP email via Nodemailer to ${email}:`, error);
      return false;
    }
  }
}

export const emailService = new EmailService();
export default emailService;
