import { useApiQuery } from 'hooks';

import { apiClient } from 'services/api-client.service';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface MenuToggleProps {
  onClick?: () => void;
}

const MenuToggle = ({
  ref,
  onClick,
  ...props
}: MenuToggleProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
  const { data: account } = useApiQuery(apiClient.account.get);

  if (!account) return null;

  return (
    <Button ref={ref} variant="ghost" size="icon" aria-label="Menu Toggle" onClick={onClick} {...props}>
      <Avatar>
        <AvatarImage src={account.avatarUrl ?? undefined} alt="Avatar" />

        <AvatarFallback>
          {account.firstName.charAt(0)}
          {account.lastName.charAt(0)}
        </AvatarFallback>
      </Avatar>
    </Button>
  );
};

MenuToggle.displayName = 'MenuToggle';

export default MenuToggle;
