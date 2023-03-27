import { useState, useCallback, memo, FC } from 'react';
import { Button, Modal, Text } from '@mantine/core';

import { AddMembersForm } from 'components';
import { analyticsService } from 'services';

const AddMembersModal: FC = () => {
  const [isOpened, setIsOpened] = useState(false);

  const handleToggleModal = useCallback(
    () => {
      analyticsService.track('Button "Add team members" clicked');
      setIsOpened(!isOpened);
    },
    [isOpened],
  );

  return (
    <>
      <Button
        size="md"
        sx={{
          marginLeft: 'auto',
        }}
        onClick={handleToggleModal}
      >
        + Add team members
      </Button>

      <Modal
        size={600}
        opened={isOpened}
        title={<Text size={24} weight={600}>Invite your team</Text>}
        onClose={handleToggleModal}
        closeOnClickOutside={false}
        centered
      >
        <AddMembersForm
          onClose={handleToggleModal}
          description={(
            <Text size={16}>
              You may add one or multiple emails,
              {' '}
              <br />
              please make sure to separate multiple emails by space.
            </Text>
          )}
          isModal
        />
      </Modal>
    </>
  );
};

export default memo(AddMembersModal);
