import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: true,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: this.configService.get('SMTP_FROM'),
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  // Template para lembrete
  async sendReminderEmail(to: string, reminderTitle: string, reminderDate: Date) {
    const subject = `Lembrete: ${reminderTitle}`;
    const html = `
      <h1>Lembrete</h1>
      <p>Você tem um lembrete para: <strong>${reminderTitle}</strong></p>
      <p>Data: ${reminderDate.toLocaleDateString()}</p>
    `;
    await this.sendEmail(to, subject, html);
  }

  // Template para data especial
  async sendImportantDateEmail(to: string, dateTitle: string, date: Date) {
    const subject = `Data Especial: ${dateTitle}`;
    const html = `
      <h1>Data Especial</h1>
      <p>Você tem uma data especial: <strong>${dateTitle}</strong></p>
      <p>Data: ${date.toLocaleDateString()}</p>
    `;
    await this.sendEmail(to, subject, html);
  }

  // Template para lista de compras
  async sendShoppingListEmail(to: string, listName: string, items: { name: string; quantity: string }[]) {
    const subject = `Lista de Compras: ${listName}`;
    const itemsList = items.map(item => `<li>${item.name} (${item.quantity})</li>`).join('');
    const html = `
      <h1>Lista de Compras</h1>
      <p>Lista: <strong>${listName}</strong></p>
      <ul>
        ${itemsList}
      </ul>
    `;
    await this.sendEmail(to, subject, html);
  }

  // Template para notificação de data importante próxima
  async sendUpcomingDateNotification(to: string, dateTitle: string, date: Date, daysUntil: number) {
    const subject = 'Data Especial se Aproximando';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="font-size: 48px; color: #ec4899;">❤️</span>
          <h1 style="color: #ec4899; margin: 10px 0;">Data Especial</h1>
        </div>
        <div style="background-color: #fdf2f8; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ec4899;">
          <h2 style="color: #be185d; margin-top: 0; font-size: 24px;">${dateTitle}</h2>
          <div style="margin: 15px 0; padding: 15px; background-color: #fff; border-radius: 6px;">
            <p style="color: #4b5563; margin: 10px 0; font-size: 16px;">
              <strong style="color: #be185d;">📅 Data:</strong><br>
              ${date.toLocaleDateString('pt-BR')}
            </p>
            <p style="color: #4b5563; margin: 10px 0; font-size: 16px;">
              <strong style="color: #be185d;">⏳ Faltam:</strong><br>
              ${daysUntil} dias
            </p>
          </div>
        </div>
        <div style="text-align: center; color: #6b7280; font-size: 14px; padding: 15px; background-color: #f9fafb; border-radius: 6px;">
          <p style="margin: 5px 0;">Este é um lembrete automático do Love Photos.</p>
          <p style="margin: 5px 0;">Acesse o aplicativo para mais detalhes e preparar algo especial!</p>
        </div>
      </div>
    `;

    await this.sendEmail(to, subject, html);
  }

  // Template para notificação de novo lembrete criado
  async sendNewReminderNotification(to: string, reminderTitle: string, reminderDate: Date, createdBy: string) {
    const subject = `Novo Lembrete Criado: ${reminderTitle}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f3f4f6; border-radius: 8px;">
        <h1 style="color: #db2777; margin-bottom: 20px;">Novo Lembrete Criado!</h1>
        <p style="font-size: 16px; color: #4b5563; margin-bottom: 15px;">
          ${createdBy} criou um novo lembrete para vocês:
        </p>
        <div style="background-color: #fdf2f8; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <h2 style="color: #be185d; margin: 0 0 10px 0;">${reminderTitle}</h2>
          <p style="margin: 0; color: #4b5563;">
            <strong>Data:</strong> ${reminderDate.toLocaleDateString()}
          </p>
        </div>
        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
          Acesse o aplicativo para ver mais detalhes e gerenciar seus lembretes.
        </p>
      </div>
    `;
    await this.sendEmail(to, subject, html);
  }

  async sendReminderNotification(to: string, reminderTitle: string, reminderDate: Date, createdBy: string) {
    const subject = 'Novo Lembrete Criado';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="font-size: 48px; color: #ec4899;">🔔</span>
          <h1 style="color: #ec4899; margin: 10px 0;">Novo Lembrete</h1>
        </div>
        <div style="background-color: #fdf2f8; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ec4899;">
          <h2 style="color: #be185d; margin-top: 0; font-size: 24px;">${reminderTitle}</h2>
          <div style="margin: 15px 0; padding: 15px; background-color: #fff; border-radius: 6px;">
            <p style="color: #4b5563; margin: 10px 0; font-size: 16px;">
              <strong style="color: #be185d;">📅 Data:</strong><br>
              ${reminderDate.toLocaleDateString('pt-BR')}
            </p>
            <p style="color: #4b5563; margin: 10px 0; font-size: 16px;">
              <strong style="color: #be185d;">👤 Criado por:</strong><br>
              ${createdBy}
            </p>
          </div>
        </div>
        <div style="text-align: center; color: #6b7280; font-size: 14px; padding: 15px; background-color: #f9fafb; border-radius: 6px;">
          <p style="margin: 5px 0;">Este é um lembrete automático do Love Photos.</p>
          <p style="margin: 5px 0;">Acesse o aplicativo para mais detalhes e gerenciar seus lembretes.</p>
        </div>
      </div>
    `;

    await this.sendEmail(to, subject, html);
  }
} 