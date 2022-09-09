import { useMutation } from 'react-query';

import { apiService } from 'services';

export const useInviteMembers = () => {
  const inviteMembers = (data) => apiService.post('/invites', data);

  return useMutation(inviteMembers);
};