import { useState, useCallback, memo } from 'react';

import {
  Button,
  Modal,
} from '@mantine/core';

import AddMembersModalForm from './form';

const AddMembersModal = () => {
  const [isOpened, setIsOpened] = useState(false);

  const handleToggleModal = useCallback(
    () => setIsOpened(!isOpened),
    [isOpened]
  );

  return (
    <>
      <Button
        sx={{
          marginLeft: 'auto',
          marginRight: '32px',
        }}
        onClick={handleToggleModal}
      >
        + Add team members
      </Button>
      <Modal
        withCloseButton={false}
        closeOnClickOutside={false}
        opened={isOpened}
        title="Invite your team"
        onClose={handleToggleModal}
      >
        <AddMembersModalForm onClose={handleToggleModal} />
      </Modal>
    </>
  );
};

export default memo(AddMembersModal);
