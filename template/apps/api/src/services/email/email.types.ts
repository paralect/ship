import { Template, TemplateProps } from 'mailer';

export type From = { email: string; name: string };

export interface EmailServiceConstructorProps {
  apiKey: string | undefined;
  from: From;
}

interface Attachment {
  content: string;
  filename: string;
}

export interface SendTemplateParams<T extends Template> {
  to: string;
  subject: string;
  template: T;
  params: TemplateProps[T];
  attachments?: Attachment[];
}
