import React from 'react';

import Form, { Row, Column } from './index';
import Input from '../input';
import Button from '../button';

export default {
  title: 'Components/Form',
  component: Form,
};

export const Template = () => (
  <Form>
    <Row>
      <Column>
        <span>First name</span>
        <Input value="firstName" />
      </Column>

      <Column>
        <span>Last name</span>
        <Input value="lastName" />
      </Column>
    </Row>

    <Row>
      <Column>
        <span>Email</span>
        <Input value="example@gmail.com" />
      </Column>

      <Column />
    </Row>
    <Row>
      <Column>
        <Button
          tabIndex={-1}
          color="danger"
        >
          Cancel
        </Button>

        <Button
          style={{ marginLeft: '20px' }}
          tabIndex={0}
          color="success"
        >
          Save
        </Button>
      </Column>
    </Row>
  </Form>
);
