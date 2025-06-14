import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { DateNotificationsService } from './date-notifications.service';
import { ImportantDate, ImportantDateSchema } from '../important-dates/schemas/important-date.schema';
import { EmailModule } from '../email/email.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{ name: ImportantDate.name, schema: ImportantDateSchema }]),
    EmailModule,
    UsersModule,
  ],
  providers: [DateNotificationsService],
})
export class CronModule {} 