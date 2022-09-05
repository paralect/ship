import { useMutation } from 'react-query';

import { apiService } from 'services';
import { InviteMembersVariables } from './invite.types';

export const useInviteMembers = () => {
  const inviteMembers = (data: InviteMembersVariables) => apiService.post('/invites', data);

  return useMutation<{}, unknown, InviteMembersVariables>(inviteMembers);
};
