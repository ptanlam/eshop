import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  SequelizeHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private _health: HealthCheckService,
    private _db: SequelizeHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    // TODO: check grpc health
    return this._health.check([async () => this._db.pingCheck('sequelize')]);
  }
}
