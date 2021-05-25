import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as userValidators from 'resources/user/user.validators';
import * as userSelectors from 'resources/user/user.selectors';
import { userActions } from 'resources/user/user.slice';
import { toastActions } from 'resources/toast/toast.slice';

import Input from 'components/input';
import Button from 'components/button';
import Form, { Row, Column } from 'components/form';

import styles from './profile.styles.pcss';

function Profile() {
  const dispatch = useDispatch();

  const user = useSelector(userSelectors.selectUser);

  const [firstName, setFirstName] = React.useState(user.firstName);
  const [lastName, setLastName] = React.useState(user.lastName);
  const [email, setEmail] = React.useState(user.email);
  const [errors, setErrors] = React.useState({});

  const showErrors = React.useCallback((newErrors) => {
    setErrors(newErrors);
    if (newErrors._global) {
      dispatch(toastActions.error(newErrors._global.join('. ')));
    }
  }, [dispatch]);

  const updateUser = React.useCallback(async () => {
    const data = {
      firstName,
      lastName,
      email,
    };

    const result = await userValidators.validateUser(data);
    if (!result.isValid) {
      showErrors(result.errors);
      return;
    }

    try {
      await dispatch(userActions.updateCurrentUser(data));
      dispatch(toastActions.success('User info updated!'));
      setErrors({});
    } catch (error) {
      showErrors(error.data.errors);
    }
  }, [firstName, lastName, email, dispatch, showErrors]);

  const cancel = React.useCallback(() => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setErrors({});
  }, [user]);

  const getError = React.useCallback((field) => {
    return errors[field] || [];
  }, [errors]);

  return (
    <>
      <h1>Profile</h1>

      <Form>
        <Row>
          <Column>
            <span>First name</span>
            <Input
              value={firstName}
              onChange={setFirstName}
              errors={getError('firstName')}
            />
          </Column>

          <Column>
            <span>Last name</span>
            <Input
              value={lastName}
              onChange={setLastName}
              errors={getError('lastName')}
            />
          </Column>
        </Row>
        <Row>
          <Column>
            <span>Email</span>
            <Input
              value={email}
              onChange={setEmail}
              errors={getError('email')}
            />
          </Column>

          <Column />
        </Row>
        <Row>
          <Column>
            <Button
              className={styles.button}
              onClick={cancel}
              tabIndex={-1}
              color="danger"
            >
              Cancel
            </Button>

            <Button
              className={styles.button}
              onClick={updateUser}
              tabIndex={0}
              color="success"
            >
              Save
            </Button>
          </Column>
        </Row>
      </Form>
    </>
  );
}

export default React.memo(Profile);
