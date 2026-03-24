import userService from 'resources/users/user.service';

export default function updateLastRequest(_id: string) {
  return userService.atomic.updateOne(
    { _id },
    {
      $set: {
        lastRequest: new Date(),
      },
    },
  );
}
