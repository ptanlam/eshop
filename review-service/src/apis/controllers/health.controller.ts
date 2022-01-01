import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(private readonly _healthService: HealthCheckService) {}

  @Get()
  @HealthCheck()
  @ApiTags('Health')
  check() {
    return this._healthService.check([]);
  }
}
