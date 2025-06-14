import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/schemas/user.schema';
import { CouplesService } from '../couples/couples.service';
import { Document } from 'mongoose';

interface UserDocument extends User, Document {
  _id: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly couplesService: CouplesService,
  ) {}

  @Post('register')
  async register(@Body() body: { users: CreateUserDto[] }) {
    if (!body.users || body.users.length !== 2) {
      throw new UnauthorizedException('É necessário cadastrar dois usuários');
    }

    const results: Omit<UserDocument, 'password'>[] = [];
    for (const userData of body.users) {
      const result = await this.authService.register(userData);
      results.push(result as Omit<UserDocument, 'password'>);
    }

    // Criar o casal após registrar os dois usuários
    if (results.length === 2) {
      const neneco = results.find(user => user.role === 'NENECO');
      const neneca = results.find(user => user.role === 'NENECA');
      
      if (neneco && neneca) {
        await this.couplesService.create(neneco._id, neneca._id);
      }
    }

    return results;
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    if (!body.email || !body.password) {
      throw new UnauthorizedException('Email e senha são obrigatórios');
    }

    try {
      const user = await this.authService.validateUser(body.email, body.password);
      
      if (!user) {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      return this.authService.login(user);
    } catch (error) {
      throw error;
    }
  }
} 