import { Module } from '@nestjs/common';
import { TargetsService } from '../../domain/services';
import { targetsProvider } from '../providers';

@Module({
  providers: [TargetsService, ...targetsProvider],
  exports: [TargetsService, ...targetsProvider],
})
export class TargetsModule {}
