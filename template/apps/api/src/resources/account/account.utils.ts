import { cloudStorageService } from 'services';

import { BackendFile, User } from 'types';

export const removeAvatar = async (user: User) => {
  if (user.avatarUrl) {
    const fileKey = cloudStorageService.getFileKey(user.avatarUrl);

    await cloudStorageService.deleteObject(fileKey);
  }
};

export const uploadAvatar = async (user: User, file: BackendFile, customFileName?: string): Promise<string> => {
  await removeAvatar(user);

  const fileName = customFileName || `${user._id}-${Date.now()}-${file.originalFilename}`;

  const { location: avatarUrl } = await cloudStorageService.uploadPublic(`avatars/${fileName}`, file);

  if (!avatarUrl) {
    throw new Error("An error occurred while uploading the user's avatar");
  }

  return avatarUrl;
};
