import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ImportantDatesService } from './important-dates.service';
import { CreateImportantDateDto } from './dto/create-important-date.dto';
import { UpdateImportantDateDto } from './dto/update-important-date.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('important-dates')
@UseGuards(JwtAuthGuard)
export class ImportantDatesController {
  constructor(private readonly importantDatesService: ImportantDatesService) {}

  @Post()
  create(@Body() createImportantDateDto: CreateImportantDateDto) {
    return this.importantDatesService.create(createImportantDateDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.importantDatesService.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.importantDatesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImportantDateDto: UpdateImportantDateDto) {
    return this.importantDatesService.update(+id, updateImportantDateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.importantDatesService.remove(id, req.user.sub);
  }
}
