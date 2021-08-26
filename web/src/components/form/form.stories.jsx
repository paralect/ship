import React from 'react';
import * as yup from 'yup';

import Form from './index';
import Input from '../input';
import Button from '../button';
import CheckBox from '../checkbox';
import Datepicker from '../datepicker';
import MultiSelect from '../multi-select';
import RadioButton from '../radio-button';
import Select from '../select';
import Switch from '../switch';
import TextArea from '../textarea';

import styles from './storybook.form.styles.pcss';

const options = [
  {
    value: '1',
    label: 'One',
  },
  {
    value: '2',
    label: 'Two',
  },
  {
    value: '3',
    label: 'Three',
  },
  {
    value: '4',
    label: 'Four',
  },
  {
    value: '5',
    label: 'Five',
  },
];

export default {
  title: 'Components/Form',
  component: Form,
};

const defaultValues = {
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'bachrimchuk@gmail.com',
  datepicker: new Date(),
  textarea: 'text area text',
  multiSelect: [
    {
      value: '2',
      label: 'Two',
    },
    {
      value: '3',
      label: 'Three',
    },
  ],
  checkbox: true,
  radioButton: true,
  switch: true,
  select: {
    value: '2',
    label: 'Two',
  },
};

const schema = yup.object().shape({
  email: yup.string().email('Email format is incorrect.').required('Field is required.'),
  lastName: yup.string().required('Field is required.'),
  firstName: yup.string().required('Field is required.'),
  textarea: yup.string().required('Field is required.'),
});

export const Template = () => {
  const handleSubmit = (values) => {
    // eslint-disable-next-line no-console
    console.log(values);
  };

  return (
    <Form
      className={styles.form}
      validationSchema={schema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
    >
      <div className={styles.column}>
        <Input
          label="First Name"
          placeholder="First Name"
          name="firstName"
        />
        <Input
          label="Last Name"
          placeholder="Last Name"
          name="lastName"
        />
        <Input
          label="Email"
          placeholder="Email"
          name="email"
        />
        <Select
          options={options}
          label="Select"
          placeholder="Select"
          name="select"
        />
        <Datepicker
          label="Datepicker"
          placeholder="Datepicker"
          name="datepicker"
        />
        <MultiSelect
          label="MultiSelect"
          placeholder="MultiSelect"
          name="multiSelect"
          options={options}
        />
        <TextArea
          label="TextArea"
          placeholder="TextArea"
          name="textarea"
        />
        <div className={styles.row}>
          <RadioButton
            label="RadioButton"
            placeholder="RadioButton"
            name="radioButton"
          />
          <CheckBox
            label="Checkbox"
            placeholder="Checkbox"
            name="checkbox"
          />
          <Switch
            label="Switch"
            placeholder="Switch"
            name="switch"
          />
        </div>
      </div>
      <Button htmlType="submit"> Save </Button>

    </Form>
  );
};
