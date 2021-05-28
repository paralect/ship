import React, { memo, useCallback } from 'react';

import bytesToSize from 'helpers/file-upload/bytes-to-size';

import { CloseIcon, DocumentEmptyIcon } from 'public/icons';

import { confirm } from 'components/Confirmation';
import IconButton from 'components/IconButton';

import PropTypes from 'prop-types';
import styles from './FileUpload.module.css';

const Preview = ({ meta, fileWithMeta }) => {
  const {
    name, percent, status, size,
  } = meta;

  const onCloseClick = useCallback(async () => {
    const isConfirmed = await confirm({
      heading: 'Delete document',
      submitButtonText: 'Delete',
      body: () => (
        <>
          Are you sure you want to delete
          {' '}
          <span className={styles.boldText}>{name}</span>
          ?
        </>
      ),
    });

    if (isConfirmed) {
      fileWithMeta.remove();
    }
  }, [fileWithMeta, name]);

  return (
    <li className={styles.file}>
      <div className={styles.documentIconWrapper}>
        <DocumentEmptyIcon />
      </div>
      { status === 'done'
        ? (
          <div className={styles.fileInfo_size}>
            <div className={styles.fileInfo}>
              <div className={styles.fileName}>
                {name}
              </div>
              <div className={styles.fileSize}>
                {bytesToSize(size)}
              </div>
            </div>
            <IconButton Icon={CloseIcon} onClick={onCloseClick} className={styles.closeIcon} />
          </div>
        ) : (
          <div className={styles.fileInfo}>
            <div className={styles.fileName}>{name}</div>
            <div className={styles.fileProgressBarContainer}>
              <div className={styles.progressBar}>
                <div className={styles.filler} style={{ width: `${percent}%` }} />
              </div>
              <div className={styles.filePercent}>
                {Math.round(percent)}
                %
              </div>
            </div>
          </div>
        )}
    </li>
  );
};

Preview.propTypes = {
  meta: PropTypes.shape({
    name: PropTypes.string,
    percent: PropTypes.number,
    status: PropTypes.string,
    size: PropTypes.number,
  }).isRequired,
  fileWithMeta: PropTypes.shape({
    remove: PropTypes.func,
  }).isRequired,
};

export default memo(Preview);
