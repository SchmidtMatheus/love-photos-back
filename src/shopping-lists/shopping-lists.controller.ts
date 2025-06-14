import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request } from '@nestjs/common';
import { ShoppingListsService } from './shopping-lists.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('shopping-lists')
@UseGuards(JwtAuthGuard)
export class ShoppingListsController {
  constructor(private readonly shoppingListsService: ShoppingListsService) {}

  @Post()
  create(@Request() req, @Body() createShoppingListDto: { name: string; items: { name: string; quantity: string; checked: boolean }[] }) {
    return this.shoppingListsService.create(req.user.sub, createShoppingListDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.shoppingListsService.findAll(req.user.sub);
  }

  @Put(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateShoppingListDto: { items: { name: string; quantity: string; checked: boolean }[] }
  ) {
    return this.shoppingListsService.update(req.user.sub, id, updateShoppingListDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.shoppingListsService.remove(req.user.sub, id);
  }
} 