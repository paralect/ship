// @flow

import React from 'react';
import type { Node } from 'react';
import { connect } from 'react-redux';

import _pick from 'lodash/pick';
import _omit from 'lodash/omit';

import type { StateType } from 'resources/types';
import type { ErrorDataType } from 'helpers/api/api.types';

import Input from 'components/common/input';
import Button, { colors as buttonColors } from 'components/common/button';
import Form, { Row, Column } from 'components/common/form';

import * as fromUser from 'resources/user/user.selectors';
import {
  updateUser,
  fetchUser,
  validateUserField,
  validateUser,
} from 'resources/user/user.actions';
import type { StateType as UserStateType, ValidationErrorsType } from 'resources/user/user.types';
import type { ValidationResultErrorsType } from 'helpers/validation/types';
import { addErrorMessage, addSuccessMessage } from 'resources/toast/toast.actions';

import styles from './profile.styles.pcss';

type PropsType = {
  updateUser: (id: string, data: UserStateType) => ValidationResultErrorsType,
  fetchUser: (id: string) => void,
  user: UserStateType, // eslint-disable-line
  addErrorMessage: (title: string, text?: string, isHTML?: boolean) => void,
  addSuccessMessage: (title: string, text?: string, isHTML?: boolean) => void,
};

type ProfileStateType = {
  firstName: string,
  lastName: string,
  email: string,
  errors: ValidationErrorsType,
};

type UserFieldType = 'firstName' | 'lastName' | 'email';

type ConnectedStateType = {
  user: UserStateType,
};

type ChangeFnType = (value: string) => void;
type VoidFnType = () => void;
type AsyncFnType = () => Promise<*>;

class Profile extends React.Component<PropsType, ProfileStateType> {
  static getDerivedStateFromProps(props: PropsType, state: ProfileStateType): ?ProfileStateType {
    const { user } = props;
    if (
      user.firstName !== state.firstName ||
      user.lastName !== state.lastName ||
      user.email !== state.email
    ) {
      return {
        ..._pick(user, ['firstName', 'lastName', 'email']),
        errors: {},
      };
    }

    return null;
  }

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

  async componentDidMount(): Promise<*> {
    try {
      await this.props.fetchUser('current');
    } catch (error) {
      const { errors }: ErrorDataType = error.data;
      this.props.addErrorMessage(
        'Unable to receive user info:',
        errors._global ? errors._global.join(', ') : '',
      );
    }
  }

  onFieldChange = (field: string): ChangeFnType => (value: string) => {
    this.setState({ [field]: value });
  };

  updateUserAsync: AsyncFnType;

  showErrors(errors: ValidationErrorsType) {
    this.setState({ errors });

    this.props.addErrorMessage(
      'Unable to save user info:',
      errors._global ? errors._global.join(', ') : '',
    );
  }

  async updateUser(): Promise<*> {
    const result: ValidationResultErrorsType = validateUser(this.state);

    if (!result.isValid) {
      this.showErrors(result.errors);
      return;
    }

    try {
      await this.props.updateUser('current', _omit(this.state, 'errors'));
      this.props.addSuccessMessage('User info updated!');
    } catch (error) {
      this.showErrors(error.data.errors);
    }
  }

  validateField = (field: UserFieldType): VoidFnType => () => {
    const result = validateUserField(_omit(this.state, 'errors'), field);
    this.setState({ errors: result.errors });
  };

  error(field: UserFieldType): Array<string> {
    return this.state.errors[field] || [];
  }

  render(): Node {
    return (
      <div>
        <h1>Profile</h1>

        <Form>
          <Row>
            <Column>
              <span>First name</span>
              <Input
                errors={this.error('firstName')}
                value={this.state.firstName}
                onChange={this.onFieldChange('firstName')}
                onBlur={this.validateField('firstName')}
              />
            </Column>

            <Column>
              <span>Last name</span>
              <Input
                errors={this.error('lastName')}
                value={this.state.lastName}
                onChange={this.onFieldChange('lastName')}
                onBlur={this.validateField('lastName')}
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <span>Email</span>
              <Input
                errors={this.error('email')}
                value={this.state.email}
                onChange={this.onFieldChange('email')}
                onBlur={this.validateField('email')}
              />
            </Column>

            <Column />
          </Row>
          <Row>
            <Column>
              <Button className={styles.button} tabIndex={-1} color={buttonColors.red}>
                Cancel
              </Button>

              <Button
                className={styles.button}
                onClick={this.updateUserAsync}
                tabIndex={0}
                color={buttonColors.green}
              >
                Save
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
    updateUser,
    fetchUser,
    addErrorMessage,
    addSuccessMessage,
  },
)(Profile);
