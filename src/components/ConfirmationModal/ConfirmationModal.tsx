import cn from 'classnames';
import React from 'react';
import Modal from '~/components/Modal';
import PrimaryButton from '~/components/PrimaryButton/PrimaryButton';
import SecondaryButton from '~/components/SecondaryButton/SecondaryButton';

import styles from './ConfirmationModal.module.scss';

type ConfirmationModalProps = {
  className?: string;
  inputClassNames?: {
    modalContainer?: string;
    primaryButton?: string;
    secondaryButton?: string;
    text?: string;
    textarea?: string;
    select?: string;
    checkbox?: string;
    radio?: string;
    label?: string;
  };
  confirmText?: string;
  onReject: () => void;
  onConfirm: () => void;
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  className,
  inputClassNames,
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
        className={cn(
          styles.container,
          inputClassNames.modalContainer,
          className
        )}
        header={'Confirmation Required'}
        onRequestClose={handleClose}
      >
        {(close) => (
          <div className={styles.body}>
            <span className={styles.confirmText}>{confirmText}</span>
            <div className={styles.buttons}>
              <SecondaryButton
                className={inputClassNames.secondaryButton}
                onClick={() => close(false)}
                variant={'ghost'}
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton
                className={inputClassNames.primaryButton}
                onClick={() => close(true)}
              >
                Confirm
              </PrimaryButton>
            </div>
          </div>
        )}
      </Modal>
    )
  );
};

export default React.memo(ConfirmationModal);
