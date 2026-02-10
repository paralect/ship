import { accountApi } from 'resources/account';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MenuToggleProps {
  onClick?: () => void;
}

const MenuToggle = ({
  ref,
  onClick,
  ...props
}: MenuToggleProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
  const { data: account } = accountApi.useGet();

  if (!account) return null;

  return (
    <button ref={ref} type="button" aria-label="Menu Toggle" onClick={onClick} className="cursor-pointer" {...props}>
      <Avatar>
        <AvatarImage src={account.avatarUrl ?? undefined} alt="Avatar" />
        <AvatarFallback>
          {account.firstName.charAt(0)}
          {account.lastName.charAt(0)}
        </AvatarFallback>
      </Avatar>
    </button>
  );
};

MenuToggle.displayName = 'MenuToggle';

export default MenuToggle;
