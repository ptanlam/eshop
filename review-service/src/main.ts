import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
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

  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: 'reviews',
      protoPath: join(__dirname, 'domain/protos/reviews.proto'),
      url: configService.get('GRPC_CONNECTION_URL'),
    },
  });

  const options = new DocumentBuilder()
    .setTitle('Reviews Service')
    .setDescription('A micro-service stores reviews in eShop application')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  await app.startAllMicroservices();
  await app.listen(configService.get<number>('PORT') || 3000);

  const logger = new Logger('Application');
  logger.log(`Review service is running on ${await app.getUrl()}`);
}
bootstrap();
