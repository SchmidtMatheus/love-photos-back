import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reminder } from './schemas/reminder.schema';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { CouplesService } from '../couples/couples.service';
import { EmailService } from '../email/email.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class RemindersService {
  constructor(
    @InjectModel(Reminder.name) private reminderModel: Model<Reminder>,
    private couplesService: CouplesService,
    private emailService: EmailService,
    private usersService: UsersService,
  ) {}

  async create(createReminderDto: CreateReminderDto, userId: string): Promise<Reminder> {
    const createdReminder = new this.reminderModel({
      ...createReminderDto,
      createdBy: new Types.ObjectId(userId),
      destination: new Types.ObjectId(createReminderDto.destination),
      datetime: new Date(createReminderDto.date)
    });
    const savedReminder = await createdReminder.save();

    // Envia e-mail para o destinatário
    try {
      const creator = await this.usersService.findOne(createReminderDto.createdBy);
      const recipient = await this.usersService.findOne(createReminderDto.destination);
      
      if (recipient && creator) {
        await this.emailService.sendReminderNotification(
          recipient.email,
          createReminderDto.title,
          new Date(createReminderDto.date),
          creator.name
        );
      }
    } catch (error) {
      console.error('Error sending reminder notification:', error);
    }

    return savedReminder;
  }

  async findAll(userId: string): Promise<{ sent: Reminder[]; received: Reminder[] }> {
    const sent = await this.reminderModel
      .find({ createdBy: new Types.ObjectId(userId) })
      .populate('destination', 'name')
      .sort({ datetime: -1 })
      .exec();

    const received = await this.reminderModel
      .find({ destination: new Types.ObjectId(userId) })
      .populate('createdBy', 'name')
      .sort({ datetime: -1 })
      .exec();

    return { sent, received };
  }

  async markAsRead(id: string, userId: string): Promise<Reminder | null> {
    const reminder = await this.reminderModel
      .findOneAndUpdate(
        { _id: id, destination: new Types.ObjectId(userId) },
        { isRead: true },
        { new: true },
      )
      .exec();
    return reminder;
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.reminderModel
      .findOneAndDelete({ _id: id, createdBy: new Types.ObjectId(userId) })
      .exec();
  }

  findOne(id: string) {
    return this.reminderModel.findById(id).exec();
  }

  update(id: string, updateReminderDto: UpdateReminderDto) {
    return this.reminderModel.findByIdAndUpdate(id, updateReminderDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.reminderModel.findByIdAndDelete(id).exec();
  }
}
