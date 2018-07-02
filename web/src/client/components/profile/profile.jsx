// @flow

import React from 'react';
import type { Node } from 'react';
import { connect } from 'react-redux';

import _omit from 'lodash/omit';
import _pick from 'lodash/pick';

import type { StateType } from 'resources/types';
import type { ErrorDataType } from 'helpers/api/api.types';

import Input from 'components/common/input';
import Button, { colors as buttonColors } from 'components/common/button';
import Form, { Row, Column } from 'components/common/form';

import * as fromUser from 'resources/user/user.selectors';
import {
  updateUser as updateUserAction,
  fetchUser as fetchUserAction,
  validateUserField,
  validateUser,
} from 'resources/user/user.actions';
import type {
  StateType as UserStateType,
  ValidationErrorsType,
} from 'resources/user/user.types';
import type { ValidationResultErrorsType } from 'helpers/validation/types';
import {
  addErrorMessage as addErrorMessageAction,
  addSuccessMessage as addSuccessMessageAction,
} from 'resources/toast/toast.actions';

import styles from './profile.styles.pcss';

type PropsType = {
  updateUser: (id: string, data: UserStateType) => ValidationResultErrorsType,
  fetchUser: (id: string) => Promise<UserStateType>,
  user: UserStateType, // eslint-disable-line
  addErrorMessage: (title: string, text?: string, isHTML?: boolean) => void,
  addSuccessMessage: (title: string, text?: string, isHTML?: boolean) => void,
};

type ProfileStateType = {
  firstName: string,
  lastName: string,
  email: string,
  errors: ValidationErrorsType,
  prevProps?: PropsType,
};

type UserFieldType = 'firstName' | 'lastName' | 'email';

type ConnectedStateType = {
  user: UserStateType,
};

type ChangeFnType = (value: string) => void;
type AsyncFnType = () => Promise<*>;

class Profile extends React.Component<PropsType, ProfileStateType> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      errors: {},
    };

    this.updateUserAsync = this.updateUser.bind(this);
  }

  componentDidMount() {
    this.feathUserData();
  }

  onFieldChange = (field: string): ChangeFnType => (value: string) => {
    this.setState({ [field]: value });
  };

  validateField = (field: UserFieldType): AsyncFnType => async (): Promise<*> => {
    const userData = _omit(this.state, ['errors', 'prevProps']);
    const result = await validateUserField(userData, field);

    this.setState({ errors: result.errors });
  };

  showErrors(errors: ValidationErrorsType) {
    this.setState({ errors });

    const { addErrorMessage } = this.props;
    addErrorMessage(
      'Unable to save user info:',
      errors._global ? errors._global.join(', ') : '',
    );
  }

  async feathUserData(): Promise<*> {
    const {
      fetchUser,
      addErrorMessage,
    } = this.props;

    try {
      const response: UserStateType = await fetchUser('current');
      this.setState(_pick(response, ['firstName', 'lastName', 'email']));
    } catch (error) {
      const { errors }: ErrorDataType = error.data;
      addErrorMessage(
        'Unable to receive user info:',
        errors._global ? errors._global.join(', ') : '',
      );
    }
  }

  async updateUser(): Promise<*> {
    const result: ValidationResultErrorsType = await validateUser(_omit(
      this.state,
      ['errors', 'prevProps'],
    ));

    if (!result.isValid) {
      this.showErrors(result.errors);
      return;
    }

    const {
      updateUser,
      addSuccessMessage,
    } = this.props;

    try {
      await updateUser('current', _omit(this.state, 'errors'));
      addSuccessMessage('User info updated!');
    } catch (error) {
      this.showErrors(error.data.errors);
    }
  }

  error(field: UserFieldType): Array<string> {
    const { errors } = this.state;
    return errors[field] || [];
  }

  updateUserAsync: AsyncFnType;

  render(): Node {
    const {
      firstName,
      lastName,
      email,
    } = this.state;

    return (
      <div>
        <h1>
          {'Profile'}
        </h1>

        <Form>
          <Row>
            <Column>
              <span>
                {'First name'}
              </span>

              <Input
                errors={this.error('firstName')}
                value={firstName}
                onChange={this.onFieldChange('firstName')}
                onBlur={this.validateField('firstName')}
              />
            </Column>

            <Column>
              <span>
                {'Last name'}
              </span>

              <Input
                errors={this.error('lastName')}
                value={lastName}
                onChange={this.onFieldChange('lastName')}
                onBlur={this.validateField('lastName')}
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <span>
                {'Email'}
              </span>

              <Input
                errors={this.error('email')}
                value={email}
                onChange={this.onFieldChange('email')}
                onBlur={this.validateField('email')}
              />
            </Column>

            <Column />
          </Row>
          <Row>
            <Column>
              <Button className={styles.button} tabIndex={-1} color={buttonColors.red}>
                {'Cancel'}
              </Button>

              <Button
                className={styles.button}
                onClick={this.updateUserAsync}
                tabIndex={0}
                color={buttonColors.green}
              >
                {'Save'}
              </Button>
            </Column>
          </Row>
        </Form>
      </div>
    );
  }
}

export default connect(
  (state: StateType): ConnectedStateType => ({
    user: fromUser.getUser(state),
  }),
  {
    updateUser: updateUserAction,
    fetchUser: fetchUserAction,
    addErrorMessage: addErrorMessageAction,
    addSuccessMessage: addSuccessMessageAction,
  },
)(Profile);
