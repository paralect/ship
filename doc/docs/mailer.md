---
sidebar_position: 6
---

# Mailer

### Overview

The **Mailer** package is a utility designed to facilitate the process of generating email templates.
This package provides a way to style, template, and generate HTML for sending emails using the [`React Email`](https://react.email/) library

### Template System

The template system is key to the functionality of the **Mailer** package.
Each template corresponds to a different type of email that can be sent.
The specific variables available for substitution in a template depend on the template itself.

The Template type should be used to reference the available templates. 
For example, to reference to verify email template, you would use `Template.VERIFY_EMAIL`.

## Adding new Template
All development takes place in the package turborepo `packages/mailer`.
The preview of emails is launched automatically
when you launch the application using turborepo or Docker,
the application will be available on port 3003.

1. Create a new template in the `emails` folder.
2. Export your component and props interface from the file.
```typescript jsx title=my-app/packages/mailer/emails/verify-email.tsx
import React, { FC } from 'react';
import { Text } from '@react-email/components';

import Layout from './_layout';
import Button from './components/button';

export interface VerifyEmailProps {
  firstName: string;
  href: string;
}

export const VerifyEmail:FC<VerifyEmailProps> = ({
  firstName = 'John',
  href = 'https://ship.paralect.com',
}) => (
  <Layout previewText="Welcome on board the Ship!">
    <Text>
      Dear
      {' '}
      {firstName}
      ,
    </Text>

    <Text>
      Welcome to Ship! We are excited to have you on board.
    </Text>

    <Text>
      Before we get started, we just need to verify your email address.
      This is to ensure that you have access to all our features and so we can send you important account notifications.
    </Text>

    <Text>
      Please verify your account by clicking the button below:
    </Text>

    <Button href={href}>
      Verify email
    </Button>
  </Layout>
);

export default VerifyEmail;
```

3. Navigate to `src/template.ts` file, import your component and props interface.
4. Add your template to the `Template` enum, `EmailComponent` object and `TemplateProps` type.

```typescript jsx title=my-app/packages/mailer/src/template.ts
import { ResetPassword, ResetPasswordProps } from 'emails/reset-password';
import { SignUpWelcome, SignUpWelcomeProps } from 'emails/sign-up-welcome';
// highlight-start
import { VerifyEmail, VerifyEmailProps } from 'emails/verify-email';
// highlight-end

export enum Template {
  RESET_PASSWORD,
  SIGN_UP_WELCOME,
  // highlight-start
  VERIFY_EMAIL,
  // highlight-end
}

export const EmailComponent = {
  [Template.RESET_PASSWORD]: ResetPassword,
  [Template.SIGN_UP_WELCOME]: SignUpWelcome, 
  // highlight-start
  [Template.VERIFY_EMAIL]: VerifyEmail,
  // highlight-end
};

export type TemplateProps = {
  [Template.RESET_PASSWORD]: ResetPasswordProps;
  [Template.SIGN_UP_WELCOME]: SignUpWelcomeProps;
  // highlight-start
  [Template.VERIFY_EMAIL]: VerifyEmailProps;
  // highlight-end
};

```

:::tip
When you change the email template, you need to rebuild the API to see the changes when sending emails.
:::

## Usage in API

### Importing

To use the **Mailer** package within the API, the necessary services and types need to be imported:

```typescript 
import { Template } from 'types';
import { emailService } from 'services';
```

### Sending an Email

To send an email, the `sendTemplate` function from the `emailService` is used. 
This function accepts an object with properties specifying the recipient, subject line, template to be used, 
and an object with parameters to be filled into the template:

```typescript
await emailService.sendTemplate<Template.VERIFY_EMAIL>({
    to: user.email,
    subject: 'Please Confirm Your Email Address for Ship',
    template: Template.VERIFY_EMAIL,
    params: {
      firstName: user.firstName,
      href: `${config.API_URL}/account/verify-email?token=${signupToken}`,
    },
});
```

In this example, a password reset email is dispatched.
The `VERIFY_EMAIL` template is used, and the user's first name and 
the reset password URL are passed as parameters to be substituted into the template.
