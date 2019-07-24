import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import _omit from 'lodash/omit';
import _pick from 'lodash/pick';

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

import {
  addErrorMessage as addErrorMessageAction,
  addSuccessMessage as addSuccessMessageAction,
} from 'resources/toast/toast.actions';

import styles from './profile.styles.pcss';


class Profile extends React.Component {
  constructor(props) {
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

  onFieldChange = field => (value) => {
    this.setState({ [field]: value });
  };

  validateField = field => async () => {
    const userData = _omit(this.state, ['errors', 'prevProps']);
    const result = await validateUserField(userData, field);

    this.setState({ errors: result.errors });
  };

  showErrors(errors) {
    this.setState({ errors });

    const { addErrorMessage } = this.props;
    addErrorMessage(
      'Unable to save user info:',
      errors._global ? errors._global.join(', ') : '',
    );
  }

  async feathUserData() {
    const {
      fetchUser,
      addErrorMessage,
    } = this.props;

    try {
      const response = await fetchUser('current');
      this.setState(_pick(response, ['firstName', 'lastName', 'email']));
    } catch (error) {
      const { errors } = error.data;
      addErrorMessage(
        'Unable to receive user info:',
        errors._global ? errors._global.join(', ') : '',
      );
    }
  }

  async updateUser() {
    const result = await validateUser(_omit(
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

  error(field) {
    const { errors } = this.state;
    return errors[field] || [];
  }

  render() {
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

Profile.propTypes = {
  updateUser: PropTypes.func.isRequired,
  fetchUser: PropTypes.func.isRequired,
  user: PropTypes.shape({
    _id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  addErrorMessage: PropTypes.func.isRequired,
  addSuccessMessage: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    user: fromUser.getUser(state),
  }),
  {
    updateUser: updateUserAction,
    fetchUser: fetchUserAction,
    addErrorMessage: addErrorMessageAction,
    addSuccessMessage: addSuccessMessageAction,
  },
)(Profile);
