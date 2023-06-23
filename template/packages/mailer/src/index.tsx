import React from 'react';
import { Options, renderAsync } from '@react-email/render';

import { EmailComponent, Template, TemplateProps } from './template';

export * from './template';

export interface RenderEmailHtmlProps<T extends Template> {
  template: T
  params: TemplateProps[T]
  options?: Options
}

export const renderEmailHtml = async <T extends Template>({
  template,
  params,
  options,
}: RenderEmailHtmlProps<T>) => {
  const Component: React.FC<TemplateProps[T]> = EmailComponent[template];

  return renderAsync(<Component {...params} />, options);
};
