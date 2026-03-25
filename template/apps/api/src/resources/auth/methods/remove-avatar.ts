import type { User } from '@/db';
import { cloudStorageService } from '@/services';

export default async function removeAvatar(user: User) {
  if (user.avatarUrl) {
    const fileKey = cloudStorageService.getFileKey(user.avatarUrl);

    await cloudStorageService.deleteObject(fileKey);
  }
}
