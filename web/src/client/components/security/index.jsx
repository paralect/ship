import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import Input from 'components/common/input';
import Button, { colors as buttonColors } from 'components/common/button';
import Form, { Row, Column } from 'components/common/form';

import {
  getTwoFaStatus,
  initializeTwoFaSetup,
  verifyTwoFaSetup,
  disableTwoFa,
} from 'resources/user/user.api';

import {
  addErrorMessage as addErrorMessageAction,
  addSuccessMessage as addSuccessMessageAction,
} from 'resources/toast/toast.actions';

import styles from './styles.pcss';

const initialState = {
  isTwoFaEnabled: false,
  isVerificationStep: false,
  qrCode: '',
  verificationCode: '',
  key: '',
  account: '',
  errors: {},
};

// TODO: use errors from fields
const parseTwoFaErrorText = errors => errors[0].verificationCode || errors[0].twoFa || '';

class Security extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...initialState,
    };
  }

  componentDidMount() {
    this.getTwoFaStatus();
  }

  onFieldChange = field => (value) => {
    this.setState({ [field]: value });
  };

  getTwoFaStatus = async () => {
    const { addErrorMessage } = this.props;

    try {
      const { data: { isTwoFaEnabled } } = await getTwoFaStatus();
      this.setState({ isTwoFaEnabled });
    } catch (error) {
      const { errors } = error.data;
      this.setState({ errors });

      addErrorMessage(
        'Unable to receive two factor authentication info:',
        errors._global ? errors._global.join(', ') : '',
      );
    }
  }

  runVerificationStep = async () => {
    const { addErrorMessage } = this.props;
    this.setState({ isVerificationStep: true });

    try {
      const { data: { qrCode, account, key } } = await initializeTwoFaSetup();
      this.setState({ qrCode, account, key });
    } catch (error) {
      const { errors } = error.data;
      this.setState({ errors });

      addErrorMessage(
        'Unable to initialize two factor authentication setup:',
        errors._global ? errors._global.join(', ') : parseTwoFaErrorText(errors),
      );

      this.setState({ isVerificationStep: false });
    }
  }

  verifyTwoFaSetup = async () => {
    const { addErrorMessage, addSuccessMessage } = this.props;
    const { verificationCode } = this.state;

    try {
      await verifyTwoFaSetup({ verificationCode });
      addSuccessMessage('Two factor authentication is enabled');
      this.setState({ isTwoFaEnabled: true });
      this.cleanupVerification();
    } catch (error) {
      const { errors } = error.data;
      this.setState({ errors });

      addErrorMessage(
        'Unable to verify 2fa:',
        errors._global ? errors._global.join(', ') : parseTwoFaErrorText(errors),
      );
    }
  }

  disableTwoFa = async () => {
    const { addErrorMessage } = this.props;

    try {
      await disableTwoFa();
      this.setState({ isTwoFaEnabled: false });
      this.cleanupVerification();
    } catch (error) {
      const { errors } = error.data;
      this.setState({ errors });

      addErrorMessage(
        'Unable to disable two factor authentication:',
        errors._global ? errors._global.join(', ') : '',
      );
    }
  }

  cancelVerification = async () => {
    this.cleanupVerification();

    await this.getTwoFaStatus();
  }

  cleanupVerification = () => {
    this.setState(_.omit(initialState, 'isTwoFaEnabled'));
  }

  error(field) {
    const { errors } = this.state;
    return errors[field] || [];
  }

  renderVerificationStep = () => {
    const {
      verificationCode,
      qrCode,
      account,
      key,
    } = this.state;

    return (
      <div>
        <h1>
          {'Verify Two Factor Authentication'}
        </h1>

        <Form className={styles.form}>
          <Row>
            <Column>
              <p>
                {'Install a soft token authenticator like FreeOTP or Google Authenticator from your application repository and scan this QR code.'}
              </p>

              <img src={qrCode} alt="QR code" />

              <p>
                Can't scan the code?
                <br />
                To add the entry manually, provide the following details to the application on your phone.
                <br />
                <i>
                  {`Account: ${account}`}
                </i>
                <br />
                <i>
                  {`Key: ${key}`}
                </i>
                <br />
                <i>Time based: Yes</i>
              </p>
            </Column>
          </Row>
          <Row>
            <Column>
              <span>
                {'Verification Code:'}
              </span>

              <Input
                value={verificationCode}
                onChange={this.onFieldChange('verificationCode')}
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <Button
                className={styles.button}
                tabIndex={-1}
                color={buttonColors.red}
                onClick={this.cancelVerification}
              >
                {'Cancel'}
              </Button>

              <Button
                className={styles.button}
                onClick={this.verifyTwoFaSetup}
                tabIndex={0}
                color={buttonColors.green}
              >
                {'Verify'}
              </Button>
            </Column>
          </Row>
        </Form>
      </div>
    );
  }

  renderTwoFaStatus = () => {
    const { isTwoFaEnabled } = this.state;

    return (
      <div>
        <h1>
          {'Two Factor Authentication'}
        </h1>

        <h2>
          {`Status:${isTwoFaEnabled ? 'Enabled' : 'Disabled'}`}
        </h2>

        { !isTwoFaEnabled && (
          <Button
            className={styles.button}
            onClick={this.runVerificationStep}
            tabIndex={0}
            color={buttonColors.green}
          >
            {'Enable'}
          </Button>
        )}
        { isTwoFaEnabled && (
          <Button
            className={styles.button}
            onClick={this.disableTwoFa}
            tabIndex={0}
            color={buttonColors.red}
          >
            {'Disable'}
          </Button>
        )}
      </div>
    );
  }

  render() {
    const { isVerificationStep } = this.state;

    return (
      <div className={styles.content}>
        { !isVerificationStep && this.renderTwoFaStatus() }
        { isVerificationStep && this.renderVerificationStep() }
      </div>
    );
  }
}

Security.propTypes = {
  addErrorMessage: PropTypes.func.isRequired,
  addSuccessMessage: PropTypes.func.isRequired,
};

export default connect(
  () => ({}),
  {
    addErrorMessage: addErrorMessageAction,
    addSuccessMessage: addSuccessMessageAction,
  },
)(Security);
