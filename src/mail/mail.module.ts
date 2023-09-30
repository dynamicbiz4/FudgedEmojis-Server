import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';


@Module({
  imports: [ MailerModule.forRootAsync({
    useFactory: () => ({
      transport: {
        host: 'smtp.gmail.com',
        port: 587, 
        secure: false, 
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: process.env.DEFAULT,
      },
      
      template: {
        dir: join(__dirname, './templates/email.hbs'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: false,
        },
      },
    }),

  }),],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
    