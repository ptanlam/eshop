import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ClientOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { discountsGrpcClientOptions } from './discounts/discounts-grpc-client.options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.connectMicroservice<ClientOptions>(discountsGrpcClientOptions);
  app.enableCors();
  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3020);
  console.log(await app.getUrl());
}
bootstrap();
