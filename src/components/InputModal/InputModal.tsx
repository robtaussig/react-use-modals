import cn from 'classnames';
import React from 'react';
import Modal from '../Modal';
import styles from './InputModal.module.scss';
import { Form, FormItem } from '../Form';

export type InputModalProps<T = any> = {
  className?: string;
  inputClassNames?: {
    formContainer?: string;
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
  header?: string;
  subHeader?: string;
  formItems: FormItem<T>[];
  initialValues?: T;
  submitButtonText?: string;
  onSubmit?: (input: T) => Promise<{ errors?: unknown }>;
  onCancel?: () => void;
  footer?: string;
  open: boolean;
  closeButton?: boolean;
  setOpen: (open: boolean) => void;
};

export function InputModal<T>({
  className,
  inputClassNames,
  header,
  subHeader,
  formItems,
  onSubmit,
  onCancel,
  submitButtonText = 'Submit',
  footer,
  open,
  setOpen,
  initialValues,
  closeButton,
}: InputModalProps<T>) {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (
    input: T,
    onSuccess: (isSuccess: boolean) => void
  ) => {
    try {
      setLoading(true);
      const res = await onSubmit?.({
        ...input,
      });

      if (res && 'errors' in res) {
        console.error(res.errors);
      } else {
        onSuccess(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (isSuccess?: boolean) => {
    if (!isSuccess) {
      onCancel?.();
    }
    setOpen(false);
  };

  return (
    open && (
      <Modal
        className={cn(
          styles.newContainer,
          inputClassNames.modalContainer,
          className
        )}
        header={header}
        closeButton={closeButton}
        footer={footer}
        onRequestClose={handleClose}
      >
        {(close) => (
          <>
            {subHeader && <p className={styles.subHeader}>{subHeader}</p>}
            <Form
              inputClassNames={inputClassNames}
              formItems={formItems}
              submitButtonText={submitButtonText}
              initialValues={initialValues}
              onSubmit={(input) => handleSubmit(input, close)}
              loading={loading}
            />
          </>
        )}
      </Modal>
    )
  );
}

export default React.memo(InputModal);
