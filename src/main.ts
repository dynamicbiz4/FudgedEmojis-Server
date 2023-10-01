import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://main--ornate-sprite-6016b0.netlify.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false, 
  });
  await app.listen(process.env.PORT || 3000);

}
bootstrap();
