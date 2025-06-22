import { Injectable, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
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
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async create(createReminderDto: CreateReminderDto, userId: string): Promise<Reminder> {
    const couple = await this.couplesService.findByUserId(userId);
    if (!couple) {
      throw new UnauthorizedException('User does not belong to a couple');
    }

    const createdReminder = new this.reminderModel({
      ...createReminderDto,
      createdBy: new Types.ObjectId(userId),
      destination: new Types.ObjectId(createReminderDto.destination),
      datetime: new Date(createReminderDto.date),
      coupleId: couple._id,
    });
    const savedReminder = await createdReminder.save();

    // Envia e-mail para o destinatário
    try {
      const creator = await this.usersService.findOne(userId);
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
    const couple = await this.couplesService.findByUserId(userId);
    if (!couple) {
      return { sent: [], received: [] };
    }

    const reminders = await this.reminderModel
      .find({ coupleId: couple._id })
      .populate('createdBy', 'name')
      .populate('destination', 'name')
      .sort({ datetime: -1 })
      .exec();
      
    const sent = reminders.filter(r => r.createdBy._id.toString() === userId);
    const received = reminders.filter(r => r.destination._id.toString() === userId);

    return { sent, received };
  }

  async markAsRead(id: string, userId: string): Promise<Reminder | null> {
    const couple = await this.couplesService.findByUserId(userId);
    if (!couple) {
      throw new UnauthorizedException('User does not belong to a couple');
    }
    const reminder = await this.reminderModel
      .findOneAndUpdate(
        { _id: id, destination: new Types.ObjectId(userId), coupleId: couple._id },
        { isRead: true },
        { new: true },
      )
      .exec();
    return reminder;
  }

  async delete(id: string, userId: string): Promise<void> {
    const couple = await this.couplesService.findByUserId(userId);
    if (!couple) {
      throw new UnauthorizedException('User does not belong to a couple');
    }
    await this.reminderModel
      .findOneAndDelete({ _id: id, createdBy: new Types.ObjectId(userId), coupleId: couple._id })
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
