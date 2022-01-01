import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: 'exchange_rates',
      protoPath: join(__dirname, 'exchange-rates/exchange-rates.proto'),
      url: configService.get<string>('GRPC_CONNECTION_URL'),
    },
  });

  await app.startAllMicroservices();
  await app.listen(configService.get<number>('PORT') || 3000);
}
bootstrap();
