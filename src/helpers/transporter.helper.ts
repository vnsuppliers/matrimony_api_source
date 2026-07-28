import * as nodemailer from 'nodemailer';
import { SettingsEntity } from '../entities/settings.entity';

export const createTransporter = (settings: SettingsEntity) => {
  return nodemailer.createTransport({
    host: settings.smtp_host,
    port: Number(settings.smtp_port),
    secure: settings.smtp_encryption === 'ssl',
    auth: {
      user: settings.smtp_username,
      pass: settings.smtp_password,
    },
  });
};
