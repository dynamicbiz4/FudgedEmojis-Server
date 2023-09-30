import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Request, RequestSchema } from 'src/schema/requests.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Request.name, schema: RequestSchema }]),
    CloudinaryModule,
    MailModule,
  ],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
