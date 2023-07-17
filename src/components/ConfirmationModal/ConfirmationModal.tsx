import cn from 'classnames';
import React from 'react';
import Modal from '~/components/Modal';
import PrimaryButton from '~/components/PrimaryButton/PrimaryButton';
import SecondaryButton from '~/components/SecondaryButton/SecondaryButton';

import styles from './ConfirmationModal.module.scss';

type ConfirmationModalProps = {
  className?: string;
  confirmText?: string;
  onReject: () => void;
  onConfirm: () => void;
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  className,
  confirmText,
  onReject,
  onConfirm,
}) => {
  const handleClose = (isSuccess?: boolean) => {
    if (isSuccess) {
      onConfirm();
    } else {
      onReject();
    }
  };

  return (
    Boolean(confirmText) && (
      <Modal
        className={cn(styles.container, className)}
        header={'Confirmation Required'}
        onRequestClose={handleClose}
      >
        {(close) => (
          <div className={styles.body}>
            <span className={styles.confirmText}>{confirmText}</span>
            <div className={styles.buttons}>
              <SecondaryButton onClick={() => close(false)} variant={'ghost'}>
                Cancel
              </SecondaryButton>
              <PrimaryButton onClick={() => close(true)}>Confirm</PrimaryButton>
            </div>
          </div>
        )}
      </Modal>
    )
  );
};

export default React.memo(ConfirmationModal);
