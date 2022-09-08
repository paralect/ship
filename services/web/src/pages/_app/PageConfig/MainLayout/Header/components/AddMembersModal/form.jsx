import { useState, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

import {
  Badge,
  Button,
  Text,
  TextInput,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons';

import { handleError } from 'helpers';
import { inviteApi } from 'resources/invite';

import { useStyles } from './styles';

const KEY_CODES = {
  ENTER: 13,
  SPACE: 32,
};

const AddMembersModalForm = ({ onClose }) => {
  const { mutate: inviteMembers, isLoading } = inviteApi.useInviteMembers();
  const { classes, cx } = useStyles();

  const [emails, setEmails] = useState([]);
  const [email, setEmail] = useState('');

  const {
    register,
    handleSubmit: submit,
    formState: { errors },
    setError,
    setFocus,
  } = useForm({});

  const handleKeyDown = useCallback(
    (e) => {
      if (Object.values(KEY_CODES).includes(e.keyCode) && !!email) {
        e.preventDefault();

        setEmail('');
        !emails.includes(email) && setEmails(emails.concat(email));
      }
    },
    [emails, email]
  );

  const handleChange = useCallback(
    (e) => {
      if (e.target.value.includes(' ')) {
        const words = e.target.value.split(' ');
        const newEmails = new Set(emails.concat(words));

        setEmails(Array.from(newEmails));
        setEmail('');

        return;
      }

      setEmail(e.target.value)
    },
    [emails],
  );

  const handleRemoveEmail = useCallback(
    (index) => setEmails(emails.slice(0, index).concat(emails.slice(index + 1))),
    [emails]
  );

  const formatError = useCallback(
    (key, data) => {
      setError('emails', data);
    },
    [setError]
  );

  const handleSubmit = useCallback(
    () => {
      inviteMembers({ emails }, {
        onSuccess: () => {
          showNotification({
            title: 'Success',
            color: 'green',
          });
          onClose();
        },
        onError: (e) => handleError(e, formatError),
      })
    }
  );

  const renderEmailList = () => (
    <div className={classes.emails}>
      {emails.map((item, index) => (
        <Badge
          key={`item-${index}`}
          size="lg"
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
      <Text className={classes.errorMessage} sx={{ fontSize: '14px' }}>{errors.emails?.message}</Text>
    </>
  );

  return (
    <>
      <Text className={classes.helpText}>You may add one or multiple emails, please make sure to separate multiple emails by space.</Text>
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

AddMembersModalForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default memo(AddMembersModalForm);
