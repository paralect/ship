import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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
import { addErrorMessage, addSuccessMessage } from 'components/common/toast/toast.actions';

import styles from './profile.styles';

class Profile extends React.Component {
  static propTypes = {
    updateUser: PropTypes.func.isRequired,
    fetchUser: PropTypes.func.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string,
      info: PropTypes.string,
      errors: PropTypes.object,
    }).isRequired,
    addErrorMessage: PropTypes.func.isRequired,
    addSuccessMessage: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      errors: {},
    };

    this.updateUser = this.updateUser.bind(this);
  }

  async componentDidMount() {
    try {
      await this.props.fetchUser('current');
    } catch (error) {
      this.props.addErrorMessage('Unable to receive user info:', error.global);
    }
  }

  componentWillReceiveProps(props) {
    const { user } = props;
    if (
      user.firstName !== this.state.firstName ||
      user.lastName !== this.state.lastName ||
      user.email !== this.state.email
    ) {
      this.setState(user);
    }
  }

  onFieldChange = field => (value) => {
    this.setState({ [field]: value });
  };

  showErrors(errors) {
    this.setState({ errors });

    this.props.addErrorMessage('Unable to save user info:', errors.global);
  }

  async updateUser(e) {
    const result = validateUser(this.state);

    if (!result.isValid) {
      this.showErrors(result.errors);
      return;
    }

    try {
      await this.props.updateUser('current', this.state);
      this.props.addSuccessMessage('User info updated!');
    } catch (error) {
      this.showErrors(error.response.data);
    }
  }

  validateField = field => () => {
    const result = validateUserField(this.state, field);
    this.setState({ errors: result.errors });
  };

  error(field) {
    return this.state.errors[field];
  }

  render() {
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
                onClick={this.updateUser}
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
  state => ({
    user: fromUser.getUser(state),
  }),
  {
    updateUser,
    fetchUser,
    validateField: validateUserField,
    addErrorMessage,
    addSuccessMessage,
  },
)(Profile);
