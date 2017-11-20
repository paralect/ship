import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Input from 'components/common/input';
import Button, { colors as buttonColors } from 'components/common/button';
import Form, { Row, Column } from 'components/common/form';

import * as fromUser from 'resources/user/user.selectors';
import {
  updateUser,
  validateUserField,
  validateUser,
} from 'resources/user/user.actions';
import {
  addErrorMessage,
  addSuccessMessage,
} from 'components/common/toast/toast.actions';

import styles from './profile.styles';

class Profile extends React.Component {
  static propTypes = {
    updateUser: PropTypes.func.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string,
      info: PropTypes.string,
      errors: PropTypes.object,
    }).isRequired,
    addErrorMessage: PropTypes.func.isRequired,
    addSuccessMessage: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    const { user = {} } = props;
    this.state = {
      username: user.username || '',
      info: user.info || '',
      errors: {},
    };
  }

  componentWillReceiveProps(props) {
    const { user } = props;
    if (user.username !== this.state.username || user.info !== this.state.info) {
      this.setState({
        username: user.username,
        info: user.info,
      });
    }
  }

  onInfoChange = (info) => {
    this.setState({ info });
  };

  onUsernameChange = (username) => {
    this.setState({ username });
  };

  showErrors(errors) {
    this.setState({ errors });

    this.props.addErrorMessage(
      'Unable to save user info:',
      errors.global,
    );
  }

  updateUser = async () => {
    const result = validateUser(this.state);

    if (!result.isValid) {
      this.showErrors(result.errors);
    }

    try {
      await this.props.updateUser(this.state);
      this.props.addSuccessMessage('User info updated!');
    } catch (error) {
      this.showErrors(error.response.data);
    }
  }

  validateField = field => () => {
    const result = validateUserField(this.state, field);
    this.setState({ errors: result.errors });
  }

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
              <Input
                errors={this.error('username')}
                value={this.state.username}
                onChange={this.onUsernameChange}
                onBlur={this.validateField('username')}
              />
            </Column>

            <Column>
              <Input
                errors={this.error('info')}
                value={this.state.info}
                onChange={this.onInfoChange}
                onBlur={this.validateField('info')}
              />
            </Column>
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
    validateField: validateUserField,
    addErrorMessage,
    addSuccessMessage,
  },
)(Profile);
