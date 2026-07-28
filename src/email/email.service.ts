import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EmailTemplateEntity } from "src/entities/email_template.entity";
import { SettingsEntity } from "src/entities/settings.entity";
import { createTransporter } from "src/helpers/transporter.helper";
import { Repository } from "typeorm";

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailTemplateEntity)
    private readonly templateRepo: Repository<EmailTemplateEntity>,

    @InjectRepository(SettingsEntity)
    private readonly settingsRepo: Repository<SettingsEntity>,
  ) {}

  async send(
    templateKey: string,
    to: string,
    data: Record<string, any>,
  ) {
    const template = await this.templateRepo.findOne({
      where: {
        template_key: templateKey,
        status: true,
      },
    });

    if (!template) {
      throw new Error(`Email template '${templateKey}' not found or disabled.`);
    }

    const settings = await this.settingsRepo.findOne({
      where: { status: true },
    });

    const variables = {
      ...settings,
      ...data,
      year: new Date().getFullYear(),
    };

    let subject = template.subject;
    let html = template.html;

    Object.keys(variables).forEach((key) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');

      subject = subject.replace(regex, variables[key] ?? '');
      html = html.replace(regex, variables[key] ?? '');
    });

    const transporter = createTransporter(settings);

    await transporter.sendMail({
      from: `"${settings.smtp_from_name}" <${settings.smtp_from_email}>`,
      to,
      subject,
      html,
    });
  }
}
