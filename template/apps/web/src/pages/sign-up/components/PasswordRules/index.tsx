import { FC, ReactNode, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { PASSWORD_RULES } from 'shared';

import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface PasswordRulesRenderProps {
  onFocus: () => void;
  onBlur: () => void;
}

interface PasswordRulesProps {
  render: (props: PasswordRulesRenderProps) => ReactNode;
}

const PasswordRules: FC<PasswordRulesProps> = ({ render }) => {
  const [visible, setVisible] = useState(false);

  const { watch } = useFormContext();

  const password = watch('password', '').trim();

  const rules = [
    {
      title: `Have at least ${PASSWORD_RULES.MIN_LENGTH} characters`,
      done: password.length >= PASSWORD_RULES.MIN_LENGTH && password.length <= PASSWORD_RULES.MAX_LENGTH,
    },
    {
      title: 'Have at least one letter',
      done: /[a-z]/i.test(password),
    },
    {
      title: 'Have at least one number',
      done: /\d/.test(password),
    },
  ];

  return (
    <Tooltip open={visible}>
      <TooltipTrigger asChild>
        {render({ onFocus: () => setVisible(true), onBlur: () => setVisible(false) })}
      </TooltipTrigger>

      <TooltipContent side="right" className="p-4">
        <div className="space-y-3">
          <p className="text-sm font-semibold">Password must:</p>
          <div className="space-y-2">
            {rules.map((rule) => (
              <div key={rule.title} className="flex items-center gap-2">
                <Checkbox checked={rule.done} disabled className="pointer-events-none" />
                <span className="text-sm">{rule.title}</span>
              </div>
            ))}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default PasswordRules;
