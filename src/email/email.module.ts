import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from '../users/users.module';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    UsersModule,
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {} 