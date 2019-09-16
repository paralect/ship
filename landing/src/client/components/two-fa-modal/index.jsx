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


export default TwoFaModal;