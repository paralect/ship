import React, { useState } from 'react';

import Button from 'components/button';
import Modal from './index';

export default {
  title: 'Components/Modal',
  component: Modal,
};

const LargeTextTemplate = ({ ...args }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleModalClose = () => setIsOpen(false);
  const handleModalOpen = () => setIsOpen(true);

  return (
    <>
      <Button onClick={handleModalOpen}>Open modal</Button>
      <Modal
        open={isOpen}
        onClose={handleModalClose}
        onCancel={handleModalClose}
        {...args}
      >
        <div>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry standard dummy text ever since the 1500s,
          when an unknown printer took a galley of type and scrambled
          it to make a type specimen book.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry standard dummy text ever since the 1500s,
          when an unknown printer took a galley of type and scrambled
          it to make a type specimen book.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry standard dummy text ever since the 1500s,
          when an unknown printer took a galley of type and scrambled
          it to make a type specimen book.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry standard dummy text ever since the 1500s,
          when an unknown printer took a galley of type and scrambled
          it to make a type specimen book.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry standard dummy text ever since the 1500s,
          when an unknown printer took a galley of type and scrambled
          it to make a type specimen book.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry standard dummy text ever since the 1500s,
          when an unknown printer took a galley of type and scrambled
          it to make a type specimen book.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry standard dummy text ever since the 1500s,
          when an unknown printer took a galley of type and scrambled
          it to make a type specimen book.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry standard dummy text ever since the 1500s,
          when an unknown printer took a galley of type and scrambled
          it to make a type specimen book.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry standard dummy text ever since the 1500s,
          when an unknown printer took a galley of type and scrambled
          it to make a type specimen book.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry standard dummy text ever since the 1500s,
          when an unknown printer took a galley of type and scrambled
          it to make a type specimen book.
        </div>
      </Modal>
    </>
  );
};

const Template = ({ ...args }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleModalClose = () => setIsOpen(false);
  const handleModalOpen = () => setIsOpen(true);

  return (
    <>
      <Button onClick={handleModalOpen}>Open modal</Button>
      <Modal open={isOpen} onClose={handleModalClose} {...args}>
        <div>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry standard dummy text ever since the 1500s,
          when an unknown printer took a galley of type and scrambled
          it to make a type specimen book.
        </div>
      </Modal>
    </>
  );
};

export const WithSubtitle = Template.bind({});
WithSubtitle.args = {
  title: 'WithSubtitle',
  subtitle: 'Subtitle',
};

export const WithoutSubtitle = Template.bind({});
WithoutSubtitle.args = {
  title: 'WithoutSubtitle',
};

export const WithoutCancel = Template.bind({});
WithoutCancel.args = {
  title: 'WithoutCancel',
  subtitle: 'Subtitle',
  noCancel: true,
};

export const WithoutSubmit = Template.bind({});
WithoutSubmit.args = {
  title: 'WithoutSubmit',
  subtitle: 'Subtitle',
  noSubmit: true,
};

export const WithLargeContent = LargeTextTemplate.bind({});
WithLargeContent.args = {
  title: 'WithLargeContent',
  subtitle: 'Subtitle',
};
