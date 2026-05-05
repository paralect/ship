import { cloudStorageService } from '@ship/cloud-storage';
import { Buffer } from 'node:buffer';
import { z } from 'zod';

import type { User } from '@/db';
import db from '@/db';
import { isAuthorized } from '@/procedures';
import usersSchema, { publicSchema } from '@/resources/users/users.schema';

async function uploadAvatar(user: User, file: File): Promise<string> {
  if (user.avatarUrl) {
    await cloudStorageService.deleteObject(cloudStorageService.getFileKey(user.avatarUrl));
  }

  const key = `avatars/${user.id}-${Date.now()}-${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await cloudStorageService.uploadBuffer(key, buffer, file.type);

  const url = await cloudStorageService.getSignedDownloadUrl(key);

  return url;
}

export default isAuthorized
  .input(
    usersSchema
      .pick({ fullName: true })
      .extend({
        avatar: z.instanceof(File).optional(),
      })
      .partial(),
  )
  .output(publicSchema)
  .handler(async ({ input, context }) => {
    const { user } = context;
    const { fullName, avatar } = input;

    const dataToUpdate: Record<string, unknown> = {};

    if (fullName) {
      dataToUpdate.fullName = fullName;
    }

    if (avatar) {
      dataToUpdate.avatarUrl = await uploadAvatar(user, avatar);
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return user;
    }

    const updatedUser = await db.users.updateOne({ id: user.id }, dataToUpdate);

    return updatedUser!;
  });
