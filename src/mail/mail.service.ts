        import { Injectable } from '@nestjs/common';
        import { MailerService } from '@nestjs-modules/mailer';

        @Injectable()
        export class MailService {

            constructor(private readonly mailerService: MailerService) {}

            async sendMail(emailData: any): Promise<void>{
            
                try {
                await this.mailerService.sendMail({
                    to: emailData.to,
                    subject: emailData.subject,
                    template: __dirname + '/templates/email',
                    context: emailData,
                });
        
                } catch (error) {
                console.error('Error sending email:', error);
                throw new Error('Failed to send email');
                }
            }

        // async sendForgotPasswordEmail(email: string, token: string): Promise<void> {
        //     const resetLink = `https://example.com/reset-password?token=${token}`;
        
        //     await this.mailerService.sendMail({
        //       to: email,
        //       subject: 'Reset Password',
        //       text: `Click the following link to reset your password: ${resetLink}`,
        //     });
        //   }
        
    }
