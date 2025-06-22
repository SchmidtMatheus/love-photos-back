import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHealth() {
    return this.healthService.checkHealth();
  }

  @Get('detailed')
  getDetailedHealth() {
    return this.healthService.checkDetailedHealth();
  }

  @Get('ping')
  ping() {
    return { 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      message: 'pong'
    };
  }
}
