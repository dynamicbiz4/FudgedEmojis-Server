import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './controllers/auth/auth.module';
import { RequestModule } from './controllers/request/request.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import {v2 as cloudinary} from 'cloudinary';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';
          
@Module({
  imports: [
    AuthModule,
    RequestModule,
    CloudinaryModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MulterModule.register({}),
    CloudinaryModule,
    MailModule,
    
  ],
  controllers: [AppController],
  providers: [AppService,MailService],
})
export class AppModule {}
