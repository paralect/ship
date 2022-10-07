import { useState, memo, useCallback, FC, KeyboardEvent, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import {
  Badge,
  Button,
  Text,
  TextInput,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons';

import { handleError } from 'utils';
import { inviteApi } from 'resources/invite';

import { useStyles } from './styles';

enum KeyCodes {
  BACKSPACE = 'Backspace',
  ENTER = 'Enter',
  SPACE = 'Space',
}

const DEFAULT_ERROR_MESSAGE = 'Invalid or duplicated emails, please check again';

type InviteMembersParams = { emails: string[] };

interface AddMembersModalFormProps {
  onClose: () => void;
}

const AddMembersModalForm: FC<AddMembersModalFormProps> = ({ onClose }) => {
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
        onClose();
      },
      onError: (e: any) => handleError(e, setError),
    });
  }, [emails, inviteMembers, onClose, setError]);

  const renderEmailList = () => (
    <div className={classes.emails}>
      {emails.map((item, index) => (
        <Badge
          key={item}
          size="lg"
          className={cx({ [classes.error]: !!errors.emails?.[index] })}
          rightSection={<IconX className={classes.icon} role="presentation" onClick={() => handleRemoveEmail(index)} color="gray" />}
        >
          {item}
        </Badge>
      ))}
    </div>
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
    <>
      <Text className={classes.helpText}>
        You may add one or multiple emails, please make sure to separate multiple emails by space.
      </Text>
      <form className={classes.form} onSubmit={submit(handleSubmit)}>
        {renderTextarea()}
        <div className={classes.actions}>
          <Button variant="subtle" disabled={isLoading} onClick={onClose}>Cancel</Button>
          <Button disabled={isLoading} type="submit">Submit</Button>
        </div>
      </form>
    </>
  );
};

export default memo(AddMembersModalForm);
