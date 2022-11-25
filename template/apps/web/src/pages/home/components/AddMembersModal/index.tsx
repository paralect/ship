import { useState, useCallback, memo, FC } from 'react';
import { Button, Modal, Text } from '@mantine/core';

import { AddMembersForm } from 'components';

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
        <AddMembersForm
          onClose={handleToggleModal}
          description={(
            <>
              You may add one or multiple emails,
              {' '}
              <br />
              please make sure to separate multiple emails by space.
            </>
          )}
        />
      </Modal>
    </>
  );
};

export default memo(AddMembersModal);
