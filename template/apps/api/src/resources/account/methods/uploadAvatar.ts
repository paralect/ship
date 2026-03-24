import type { User } from 'resources/users/user.schema';

import { cloudStorageService } from 'services';

import { BackendFile } from 'types';

import removeAvatar from 'resources/account/methods/removeAvatar';

export default async function uploadAvatar(user: User, file: BackendFile, customFileName?: string): Promise<string> {
  await removeAvatar(user);

  const fileName = customFileName || `${user._id}-${Date.now()}-${file.originalFilename}`;

  const { location: avatarUrl } = await cloudStorageService.uploadPublic(`avatars/${fileName}`, file);

  if (!avatarUrl) {
    throw new Error("An error occurred while uploading the user's avatar");
  }

  return avatarUrl;
}
