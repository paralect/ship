import removeAvatar from './remove-avatar';
import type { User } from '@/resources/users/users.schema';
import { cloudStorageService, type BackendFile } from '@ship/cloud-storage';

export default async function uploadAvatar({
  user,
  file,
  customFileName,
}: {
  user: User;
  file: BackendFile;
  customFileName?: string;
}): Promise<string> {
  await removeAvatar({ user });

  const fileName = customFileName || `${user._id}-${Date.now()}-${file.originalFilename}`;

  const { location: avatarUrl } = await cloudStorageService.uploadPublic(`avatars/${fileName}`, file);

  if (!avatarUrl) {
    throw new Error("An error occurred while uploading the user's avatar");
  }

  return avatarUrl;
}
