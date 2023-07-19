import styles from './Form.module.scss';
import React from 'react';

import MyCheckbox from '../MyCheckbox/MyCheckbox';
import MyRadioGroup from '../MyRadioGroup';
import MySelectField from '../MySelectField';
import { MyTextField } from '../MyTextField';

import { useForm, FormProvider } from 'react-hook-form';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import classNames from 'classnames';

export type FormItem<T> = {
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

export type FormProps<T = any> = {
  className?: string;
  inputClassNames?: {
    formContainer?: string;
    button?: string;
    primaryButton?: string;
    secondaryButton?: string;
    text?: string;
    textarea?: string;
    select?: string;
    checkbox?: string;
    radio?: string;
    label?: string;
  };
  formItems: FormItem<T>[];
  submitButtonText?: string;
  initialValues?: T;
  onSubmit: (input: T) => void;
  loading?: boolean;
  onRequestClose?: () => void;
};

export function Form<T>({
  className,
  inputClassNames = {},
  formItems,
  submitButtonText,
  initialValues,
  onSubmit,
  onRequestClose,
  loading,
}: FormProps<T>) {
  const formMethods = useForm<T>();

  return (
    <FormProvider {...formMethods}>
      <form
        className={classNames(
          styles.container,
          inputClassNames.formContainer,
          className
        )}
        onSubmit={formMethods.handleSubmit(onSubmit)}
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
                inputClassName={inputClassNames.text}
                labelClassName={inputClassNames.label}
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
                    inputClassName={inputClassNames.checkbox}
                    labelClassName={inputClassNames.label}
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
                inputClassName={inputClassNames.select}
                labelClassName={inputClassNames.label}
                required={required}
                disabled={disabled}
                defaultValue={placeholder ? '' : initialValues?.[String(name)]}
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
                inputClassName={inputClassNames.text}
                labelClassName={inputClassNames.label}
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
                inputClassName={inputClassNames.radio}
                labelClassName={inputClassNames.label}
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
                {content(onRequestClose)}
              </div>
            ) : null
        )}
        {onSubmit && (
          <PrimaryButton
            className={classNames(
              styles.submitButton,
              inputClassNames.button,
              inputClassNames.primaryButton
            )}
            loading={loading}
          >
            {submitButtonText}
          </PrimaryButton>
        )}
      </form>
    </FormProvider>
  );
}

export default React.memo(Form);
