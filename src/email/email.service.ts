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
    const subject = `Data Especial Próxima: ${dateTitle}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f3f4f6; border-radius: 8px;">
        <h1 style="color: #db2777; margin-bottom: 20px;">Data Especial Próxima!</h1>
        <p style="font-size: 16px; color: #4b5563; margin-bottom: 15px;">
          Olá! Temos uma data especial chegando:
        </p>
        <div style="background-color: #fdf2f8; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <h2 style="color: #be185d; margin: 0 0 10px 0;">${dateTitle}</h2>
          <p style="margin: 0; color: #4b5563;">
            <strong>Data:</strong> ${date.toLocaleDateString()}
          </p>
          <p style="margin: 10px 0 0 0; color: #4b5563;">
            <strong>Faltam ${daysUntil} dias!</strong>
          </p>
        </div>
        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
          Não se esqueça de preparar algo especial para celebrar este momento!
        </p>
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
} 