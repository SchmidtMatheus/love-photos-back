import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CouplesService } from './couples.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('couples')
@UseGuards(JwtAuthGuard)
export class CouplesController {
  constructor(private readonly couplesService: CouplesService) {}

  @Post()
  async create(@Body() createCoupleDto: { user1: string; user2: string }) {
    return this.couplesService.create(createCoupleDto.user1, createCoupleDto.user2);
  }

  @Get('find')
  findCouple(@Request() req) {
    const userId = req.user.sub;
    return this.couplesService.findByUserId(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.couplesService.findOne(id);
  }
} 