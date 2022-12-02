import { useState, memo, useCallback, FC, KeyboardEvent, ChangeEvent, ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import {
  Badge,
  Button, Group, Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons';

import { inviteApi } from 'resources/invite';

import { handleError } from 'utils';

import { useStyles } from './styles';

enum KeyCodes {
  BACKSPACE = 'Backspace',
  ENTER = 'Enter',
  SPACE = 'Space',
}

const DEFAULT_ERROR_MESSAGE = 'Invalid or duplicated emails, please check again';

type InviteMembersParams = { emails: string[] };

interface AddMembersFormProps {
  onClose?: () => void;
  onSubmit?: () => void;
  isModal?: boolean;
  placeholder?: string;
  buttonFullWidth?: boolean;
  description?: string | ReactNode | null;
  buttonTitle?: string;
}

const AddMembersForm: FC<AddMembersFormProps> = ({
  onClose,
  onSubmit,
  placeholder,
  description = null,
  isModal = false,
  buttonFullWidth = false,
  buttonTitle = 'Submit',
}) => {
  const { primaryColor } = useMantineTheme();

  const { mutate: inviteMembers, isLoading } = inviteApi.useInviteMembers();
  const { classes, cx } = useStyles();

  const [emails, setEmails] = useState<string[]>([]);
  const [email, setEmail] = useState('');

  const {
    register,
    handleSubmit: submit,
    formState: { errors },
    setError,
    setFocus,
  } = useForm<InviteMembersParams>();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if ([KeyCodes.ENTER, KeyCodes.SPACE].includes(e.code as KeyCodes) && !!email) {
        e.preventDefault();

        setEmail('');

        if (!emails.includes(email)) {
          setEmails(emails.concat(email));
        }

        return;
      }

      if (e.code === KeyCodes.BACKSPACE && !email) {
        e.preventDefault();
        setEmails(emails.slice(0, emails.length - 1));
      }
    },
    [emails, email],
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.value.includes(' ')) {
        const words = e.target.value.split(' ');
        const newEmails = new Set(emails.concat(words));

        setEmails(Array.from(newEmails));
        setEmail('');

        return;
      }

      setEmail(e.target.value);
    },
    [emails],
  );

  const handleRemoveEmail = useCallback(
    (index: number) => setEmails(emails.slice(0, index).concat(emails.slice(index + 1))),
    [emails],
  );

  const handleSubmit = useCallback(() => {
    inviteMembers({ emails }, {
      onSuccess: () => {
        showNotification({
          title: 'Success',
          color: 'green',
          message: 'Your invitations have been successfully sent.',
        });

        if (onClose) {
          onClose();
        }

        if (onSubmit) {
          onSubmit();
        }
      },
      onError: (e: any) => handleError(e, setError),
    });
  }, [emails, inviteMembers, onClose, onSubmit, setError]);

  const renderEmailList = () => (
    <Group spacing={4} p={8} align="flex-start">
      {emails.map((item, index) => (
        <Badge
          key={item}
          size="lg"
          className={cx({ [classes.error]: !!errors.emails?.[index] })}
          sx={{ fontWeight: 600 }}
          rightSection={<IconX className={classes.icon} size={16} role="presentation" onClick={() => handleRemoveEmail(index)} color={primaryColor} />}
        >
          {item}
        </Badge>
      ))}
    </Group>
  );

  const renderTextarea = () => (
    <>
      <div
        className={cx(classes.textareaWrapper, { [classes.error]: !!errors.emails })}
        role="presentation"
        onClick={() => setFocus('emails')}
      >
        {!!emails.length && renderEmailList()}
        <TextInput
          {...register('emails')}
          value={email}
          classNames={{ input: classes.textarea }}
          placeholder={!emails.length ? placeholder : ''}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
        />
      </div>
      {errors.emails && (
        <Text className={classes.errorMessage}>
          {errors.emails.message || DEFAULT_ERROR_MESSAGE}
        </Text>
      )}
    </>
  );

  return (
    <Stack>
      {description && (
        <Text className={classes.helpText}>
          {description}
        </Text>
      )}
      <form className={classes.form} onSubmit={submit(handleSubmit)}>
        {renderTextarea()}
        <div className={classes.actions}>
          {isModal && (
            <Button size="md" variant="subtle" disabled={isLoading} onClick={onClose}>Cancel</Button>
          )}
          <Button
            fullWidth={buttonFullWidth}
            disabled={isLoading}
            type="submit"
            {...(isModal && { size: 'md' })}
          >
            {buttonTitle}
          </Button>
        </div>
      </form>
    </Stack>
  );
};

export default memo(AddMembersForm);
