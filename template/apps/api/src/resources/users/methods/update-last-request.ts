import { usersService } from '@/db';

export default function updateLastRequest(_id: string) {
  return usersService.atomic.updateOne(
    { _id },
    {
      $set: {
        lastRequest: new Date(),
      },
    },
  );
}
