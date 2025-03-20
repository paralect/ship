import { Template, TemplateProps } from 'mailer';

export type From = {
  email: string;
  name: string;
};

export interface EmailServiceConstructorProps {
  apiKey: string | undefined;
  from: From;
}

interface Attachment {
  /** Content of an attached file. */
  content?: string | Buffer;
  /** Name of attached file. */
  filename?: string | false | undefined;
  /** Path where the attachment file is hosted */
  path?: string;
}

export interface SendTemplateParams<T extends Template> {
  to: string | string[];
  subject: string;
  template: T;
  params: TemplateProps[T];
  attachments?: Attachment[];
}
