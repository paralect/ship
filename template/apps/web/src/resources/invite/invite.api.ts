import { useMutation } from 'react-query';

import { apiService } from 'services';

export function useInviteMembers<T>() {
  const inviteMembers = (data: T) => apiService.post('/invites', data);

  return useMutation<{}, unknown, T>(inviteMembers);
}
