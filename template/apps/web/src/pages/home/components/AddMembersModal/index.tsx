import { useState, useCallback, memo, FC } from 'react';
import { Button, Modal, Text } from '@mantine/core';

import AddMembersModalForm from './form';

const AddMembersModal: FC = () => {
  const [isOpened, setIsOpened] = useState(false);

  const handleToggleModal = useCallback(
    () => setIsOpened(!isOpened),
    [isOpened],
  );

  return (
    <>
      <Button
        size="sm"
        sx={{
          marginLeft: 'auto',
        }}
        onClick={handleToggleModal}
      >
        + Add team members
      </Button>
      <Modal
        closeOnClickOutside={false}
        opened={isOpened}
        title={<Text weight={600}>Invite your team</Text>}
        onClose={handleToggleModal}
        centered
      >
        <AddMembersModalForm onClose={handleToggleModal} />
      </Modal>
    </>
  );
};

export default memo(AddMembersModal);
