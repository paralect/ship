import React from 'react';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';

import * as userSelectors from 'resources/user/user.selectors';
import { userActions } from 'resources/user/user.slice';
import { toastActions } from 'resources/toast/toast.slice';

import Input from 'components/input';
import Button from 'components/button';
import Form from 'components/form';

import styles from './profile.styles.pcss';

const schema = yup.object({
  firstName: yup.string()
    .trim()
    .required('First name is required'),
  lastName: yup.string()
    .trim()
    .required('Last name is required'),
  email: yup.string()
    .trim()
    .lowercase()
    .required('Email is required')
    .email('Please enter a valid email address'),
});

const CancelButton = () => {
  const { reset } = useFormContext();
  const user = useSelector(userSelectors.selectUser);

  const handleClick = () => reset(user);

  return (
    <Button
      className={styles.button}
      tabIndex={-1}
      type="secondary"
      onClick={handleClick}
    >
      Cancel
    </Button>
  );
};

const Profile = () => {
  const dispatch = useDispatch();

  const user = useSelector(userSelectors.selectUser);

  const handleSubmit = React.useCallback(async (submitValues) => {
    await dispatch(userActions.updateCurrentUser(submitValues));
    dispatch(toastActions.success('User info updated!'));
  }, [dispatch]);

  return (
    <>
      <h1>Profile</h1>
      <Form
        defaultValues={user}
        onSubmit={handleSubmit}
        validationSchema={schema}
      >
        <div className={styles.row}>
          <Input
            name="firstName"
            placeholder="First Name"
            label="First Name"
          />
        </div>

        <div className={styles.row}>
          <Input
            name="lastName"
            placeholder="Last Name"
            label="Last Name"
          />
        </div>

        <div className={styles.row}>
          <Input
            name="email"
            placeholder="Email"
            label="Email"
          />
        </div>

        <div className={styles.buttons}>
          <CancelButton />
          <Button
            className={styles.button}
            tabIndex={0}
            htmlType="submit"
          >
            Save
          </Button>
        </div>
      </Form>
    </>
  );
};

export default React.memo(Profile);
