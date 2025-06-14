import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImportantDate } from '../important-dates/schemas/important-date.schema';
import { EmailService } from '../email/email.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class DateNotificationsService {
  constructor(
    @InjectModel(ImportantDate.name) private importantDateModel: Model<ImportantDate>,
    private emailService: EmailService,
    private usersService: UsersService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkUpcomingDates() {
    const today = new Date();
    const dates = await this.importantDateModel.find().populate<{ destination: User[] }>('destination');

    for (const date of dates) {
      const eventDate = new Date(date.date);
      const daysUntil = this.calculateDaysUntil(today, eventDate);

      // Verifica se a data está nos próximos 10, 20 ou 30 dias
      if ([10, 20, 30].includes(daysUntil)) {
        // Envia e-mail para todos os destinatários
        for (const user of date.destination) {
          try {
            await this.emailService.sendUpcomingDateNotification(
              user.email,
              date.description,
              eventDate,
              daysUntil
            );
          } catch (error) {
            console.error(`Error sending email to ${user.email}:`, error);
          }
        }
      }
    }
  }

  private calculateDaysUntil(today: Date, eventDate: Date): number {
    const diffTime = eventDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
} 