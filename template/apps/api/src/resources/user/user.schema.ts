import { z } from 'zod';

import subscriptionSchema from 'resources/subscription/subscription.schema';

const schema = z.object({
  _id: z.string(),
  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
  deletedOn: z.date().optional().nullable(),
  firstName: z.string(),
  lastName: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  stripeId: z.string().optional().nullable(),
  passwordHash: z.string().nullable().optional(),
  signupToken: z.string().nullable().optional(),
  resetPasswordToken: z.string().nullable().optional(),
  isEmailVerified: z.boolean().default(false),
  avatarUrl: z.string().nullable().optional(),
  lastRequest: z.date().optional(),
  oauth: z.object({
    google: z.boolean().default(false),
  }).optional(),
  subscription: subscriptionSchema.optional().nullable(),
}).strict();

export default schema;
