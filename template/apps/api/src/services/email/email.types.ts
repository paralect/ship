import { Template, TemplateProps } from 'mailer';

export type From = { email: string, name: string };

export interface EmailServiceConstructorProps {
  apiKey: string | undefined,
  from: From,
}

export interface SendTemplateParams<T extends Template> {
  to: string,
  subject: string,
  template: T,
  params: TemplateProps[T],
}

export interface SendSendgridTemplateParams {
  to: string,
  subject: string,
  templateId: string,
  dynamicTemplateData: { [key: string]: unknown },
}
