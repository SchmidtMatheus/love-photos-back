// src/reminder/reminder.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { Reminder, ReminderSchema } from './schemas/reminder.schema';
import { UsersModule } from '../users/users.module';
import { EmailModule } from 'src/email/email.module';
import { CouplesModule } from 'src/couples/couples.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reminder.name, schema: ReminderSchema }]),
    CouplesModule,
    EmailModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [RemindersController],
  providers: [RemindersService],
})
export class RemindersModule {}
