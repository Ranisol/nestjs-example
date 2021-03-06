import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
const cookieSession = require('cookie-session')


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // cookie session
  app.use(cookieSession({
    keys: ['ssd']
  }))

  // validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  )

  // swagger
  const config = new DocumentBuilder()
    .setTitle('example')
    .setDescription('example API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
