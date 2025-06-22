import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CouplesController } from './couples.controller';
import { CouplesService } from './couples.service';
import { Couple, CoupleSchema } from './schemas/couple.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Couple.name, schema: CoupleSchema }]),
    forwardRef(() => UsersModule),
  ],
  controllers: [CouplesController],
  providers: [CouplesService],
  exports: [CouplesService],
})
export class CouplesModule {} 