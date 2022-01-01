import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReactionsService } from '../../domain/services';
import { reactionsProvider } from '../providers/reactions.provider';

@Module({
  imports: [ConfigModule],
  providers: [...reactionsProvider, ReactionsService],
  exports: [...reactionsProvider, ReactionsService],
})
export class ReactionsModule {}
