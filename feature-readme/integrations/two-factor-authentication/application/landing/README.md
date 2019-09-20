# [2fa] Landing site installation steps:

## 1. Install necessary packages: 

```shell

npm i @material-ui/core

```

## 2. Add modal form that will be shown in case two factor authentication is enabled:

```javascript
/* src/client/components/two-fa-modal/index.js */

import TwoFaModal from './index.jsx';

export default TwoFaModal;

```

```jsx
/* src/client/components/two-fa-modal/index.jsx */

import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import Form from '~/components/form';
import Input from '~/components/input';
import Button from '~/components/button';
import Error from '~/components/error';
import { setFormValue } from '~/helpers';
import { states } from '~/constants';

import styles from './styles.pcss';

class TwoFaModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      twoFaCode: '',
      isLoading: false,
      error: null,
    };

    this.setTwoFaCode = setFormValue('twoFaCode').bind(this);
  }

  submitCode = async (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });

    const { twoFaCode } = this.state;
    const { onSubmit } = this.props;

    try {
      await onSubmit(twoFaCode);
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { isShown, onClose } = this.props;
    const { twoFaCode, error, isLoading } = this.state;

    return (
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={styles.modal}
        open={isShown}
        onClose={onClose}
        closeAfterTransition
        disableBackdropClick
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isShown}>
          <div className={styles.content}>
            <h2>Two factor authentication</h2>

            <Form onSubmit={this.submitCode}>
              <Error error={error} />
              <Input
                key="email"
                value={twoFaCode}
                onChange={this.setTwoFaCode}
                required
                placeholder="Please, enter two factor authentication code"
                type="text"
              />

              <div className={styles.submit}>
                <Button
                  className={styles.signin}
                  type="submit"
                  primary
                  isLoading={isLoading}
                  state={states.blue}
                >
                  Let me in
                </Button>
              </div>
            </Form>
          </div>
        </Fade>
      </Modal>
    );
  }
}

TwoFaModal.propTypes = {
  isShown: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func,
};

TwoFaModal.defaultProps = {
  onClose: () => {},
};

export default TwoFaModal

```

```css
/* src/client/components/two-fa-modal/styles.pcss */

.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.55);
}

.content {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 0 2px rgba(94,96,186,.35);
  padding: 20px;
}

```

## 3. Attach two factor authentication modal to the signin page:

```jsx
/* src/client/pages/signin/signin.jsx */
...

import TwoFaModal from '~/components/two-fa-modal';

...

export default class Signin extends PureComponent {
  constructor(props) {

    ...

    this.state = {
      ...

      isTwoFaEnabled: false,
    };
  }

  ...

  submitTwoFa = async (twoFaCode) => {
    const { password, email } = this.state;
    const response = await signin({
      email,
      password,
      twoFaCode,
    });

    window.location.href = `${webUrl}?token=${response.token}`;
  }
  
  async submitSignin(event) {
    event.preventDefault();

    try {
      const { email, password } = this.state;

      this.setState({ isLoading: true });

      const response = await signin({
        email,
        password,
      });

      if (response.shouldCompleteTwoFa) {
        this.setState({ isTwoFaEnabled: true });
      } else {
        window.location.href = `${webUrl}?token=${response.token}`;
      }

    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  onModalClose = () => {
    this.setState({ isTwoFaEnabled: false });
  }

  ...

  render() {
    const {
      ...
      isTwoFaEnabled,
    } = this.state;

    ...

    return (
      <Layout state={states.blue}>
        
        ...

        { isTwoFaEnabled && (
          <TwoFaModal
            onClose={this.onModalClose}
            onSubmit={this.submitTwoFa}
            isShown={isTwoFaEnabled}
          />
        )}
      
      ...

      </Layout>
    );
  }
}

```