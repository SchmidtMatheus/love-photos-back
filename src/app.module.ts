import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CouplesModule } from './couples/couples.module';
import { RemindersModule } from './reminders/reminders.module';
import { ImportantDatesModule } from './important-dates/important-dates.module';
import { ShoppingListsModule } from './shopping-lists/shopping-lists.module';
import { CronModule } from './cron/cron.module';
import { EmailModule } from './email/email.module';
import { ImageUploaderModule } from './image-uploader/image-uploader.module';
import { CollectionsModule } from './collections/collections.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/love-photos',
    ),
    AuthModule,
    UsersModule,
    CouplesModule,
    RemindersModule,
    ImportantDatesModule,
    ShoppingListsModule,
    EmailModule,
    CronModule,
    ImageUploaderModule,
    CollectionsModule,
    HealthModule,
  ],
})
export class AppModule {}
