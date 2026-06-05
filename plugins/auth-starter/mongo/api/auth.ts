import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import config from '@/config';
import { generateId, getMongoDb } from '@ship/db';
import { emailService } from '@ship/emails';

function createAuth() {
  return betterAuth({
    secret: config.BETTER_AUTH_SECRET,
    baseURL: config.API_URL,
    basePath: '/api/auth',
    trustedOrigins: [config.WEB_URL],

    database: mongodbAdapter(getMongoDb(), { usePlural: true }),

    user: {
      fields: {
        name: 'fullName',
        image: 'avatarUrl',
        emailVerified: 'isEmailVerified',
      },
    },

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url }) => {
        await emailService.sendTemplate({
          to: user.email,
          subject: 'Password Reset Request for Ship',
          template: 'reset-password',
          params: {
            name: user.name,
            href: url,
          },
        });
      },
    },

    emailVerification: {
      sendOnSignUp: true,
      sendVerificationEmail: async ({ user, url }) => {
        await emailService.sendTemplate({
          to: user.email,
          subject: 'Please Confirm Your Email Address for Ship',
          template: 'verify-email',
          params: {
            name: user.name,
            href: url,
          },
        });
      },
    },

    socialProviders: {
      google: {
        clientId: config.GOOGLE_CLIENT_ID!,
        clientSecret: config.GOOGLE_CLIENT_SECRET!,
      },
    },

    session: {
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5,
      },
    },

    advanced: {
      database: {
        generateId,
      },
    },
  });
}

let _auth: ReturnType<typeof createAuth>;

export function getAuth() {
  if (!_auth) {
    _auth = createAuth();
  }
  return _auth;
}
