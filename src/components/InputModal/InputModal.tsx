import cn from 'classnames';
import React from 'react';

import MyCheckbox from '../MyCheckbox/MyCheckbox';
import Modal from '../Modal';
import MyRadioGroup from '../MyRadioGroup';
import MySelectField from '../MySelectField';
import MyTextField from '../MyTextField';

import styles from './InputModal.module.scss';
import { useForm, FormProvider } from 'react-hook-form';
import PrimaryButton from '../PrimaryButton/PrimaryButton';

type FormItem<T> = {
  name?: keyof T;
  label?: string;
  options?: string[];
  initialValue?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  content?: React.ReactNode;
} & (
  | {
      name?: keyof T;
      type: 'text' | 'number' | 'password';
      placeholder?: string;
      options?: never;
      required?: boolean;
    }
  | {
      name?: never;
      type: 'radio' | 'checkbox';
      placeholder?: never;
      options: (keyof T)[];
      required?: never;
    }
  | {
      name?: keyof T;
      type: 'select';
      placeholder?: string;
      options: string[];
      required?: boolean;
    }
  | {
      name?: never;
      type: 'custom';
      content: (close: () => void) => React.ReactNode;
    }
);

export type InputModalProps<T = any> = {
  className?: string;
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
  lightMode?: boolean;
};

export function InputModal<T>({
  className,
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
  lightMode,
  closeButton,
}: InputModalProps<T>) {
  const formMethods = useForm<T>();
  const [loading, setLoading] = React.useState(false);
  const [customInput, setCustomInput] = React.useState<Partial<T>>({});

  const handleSubmit = async (
    input: T,
    onSuccess: (isSuccess: boolean) => void
  ) => {
    try {
      setLoading(true);
      const res = await onSubmit?.({
        ...input,
        ...customInput,
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

  const reset = formMethods.reset;

  React.useEffect(() => {
    if (open) {
      return () => {
        reset();
        setCustomInput({});
      };
    }
  }, [open, reset]);

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
          {
            [styles.newLightMode]: lightMode,
          },
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
            <FormProvider {...formMethods}>
              <form
                className={styles.form}
                onSubmit={formMethods.handleSubmit((input) => {
                  handleSubmit(input, close);
                })}
              >
                {formItems.map(
                  (
                    {
                      type,
                      name,
                      label,
                      placeholder,
                      required,
                      disabled,
                      options,
                      content,
                    },
                    idx
                  ) =>
                    ['text', 'password'].includes(type) ? (
                      <MyTextField
                        key={idx}
                        className={styles.inputRoot}
                        type={type === 'password' ? type : 'text'}
                        required={required}
                        disabled={disabled}
                        label={label}
                        defaultValue={initialValues?.[String(name)]}
                        placeholder={placeholder}
                        name={String(name)}
                      />
                    ) : type === 'checkbox' ? (
                      <fieldset key={idx}>
                        {label && <span>{label}</span>}
                        {options.map((option, idx) => (
                          <MyCheckbox
                            key={`${label}-${option}-${idx}`}
                            name={option}
                            label={option}
                            defaultChecked={initialValues?.[option]}
                            disabled={disabled}
                          />
                        ))}
                      </fieldset>
                    ) : type === 'select' ? (
                      <MySelectField
                        key={idx}
                        className={styles.inputRoot}
                        required={required}
                        disabled={disabled}
                        defaultValue={
                          placeholder ? '' : initialValues?.[String(name)]
                        }
                        label={label}
                        name={String(name)}
                      >
                        {placeholder && (
                          <option hidden disabled value={''}>
                            {placeholder}
                          </option>
                        )}
                        {options.map((option) => (
                          <option key={option} value={option} label={option}>
                            {option}
                          </option>
                        ))}
                      </MySelectField>
                    ) : type === 'number' ? (
                      <MyTextField
                        key={idx}
                        className={styles.inputRoot}
                        required={required}
                        defaultValue={initialValues?.[String(name)]}
                        disabled={disabled}
                        type={'number'}
                        label={label}
                        placeholder={placeholder}
                        name={String(name)}
                      />
                    ) : type === 'radio' ? (
                      <MyRadioGroup
                        key={idx}
                        className={styles.inputRoot}
                        groupLabel={label}
                        name={String(name)}
                        options={options.map((option) => ({
                          label: option,
                          initialSelect: initialValues?.[option],
                          disabled,
                          value: option,
                        }))}
                      />
                    ) : type === 'custom' ? (
                      <div key={idx} className={styles.inputRoot}>
                        {content(close)}
                      </div>
                    ) : null
                )}
                {onSubmit && (
                  <PrimaryButton
                    className={styles.submitButton}
                    loading={loading}
                  >
                    {submitButtonText}
                  </PrimaryButton>
                )}
              </form>
            </FormProvider>
          </>
        )}
      </Modal>
    )
  );
}

export default React.memo(InputModal);
