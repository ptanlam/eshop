import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from '../../apis/controllers';

@Module({
  imports: [TerminusModule, ConfigModule, HttpModule],
  controllers: [HealthController],
})
export class HealthModule {}
