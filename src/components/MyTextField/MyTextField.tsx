import {
  TextInput,
  Textarea,
  TextInputProps,
  TextareaProps,
} from '@mantine/core';
import classNames from 'classnames';

import { useFormContext } from 'react-hook-form';

import styles from './MyTextField.module.scss';
import { forwardRef } from 'react';

export type MyTextFieldProps = {
  label?: string;
  className?: string;
  name: string;
  lightMode?: boolean;
} & TextInputProps;

export const MyTextField = forwardRef<HTMLInputElement, MyTextFieldProps>(
  ({ className, name, label, lightMode, ...inputProps }, forwardedRef) => {
    const { register } = useFormContext();
    const { ref, ...registered } = register(name);

    return (
      <TextInput
        className={classNames(
          styles.container,
          {
            [styles.lightMode]: lightMode,
          },
          className
        )}
        ref={(node) => {
          if (typeof forwardedRef === 'function') {
            forwardedRef(node);
          } else if (forwardedRef?.current) {
            forwardedRef.current = node;
          }

          if (typeof ref === 'function') ref(node);
        }}
        size="xs"
        label={label}
        {...registered}
        {...inputProps}
      />
    );
  }
);

export type MyTextAreaProps = {
  label?: string;
  className?: string;
  name: string;
  lightMode?: boolean;
} & TextareaProps;

export const MyTextArea = ({
  className,
  name,
  label,
  lightMode,
  ...inputProps
}: MyTextAreaProps) => {
  const { register } = useFormContext();
  const registered = register(name);

  return (
    <Textarea
      className={classNames(
        styles.container,
        {
          [styles.lightMode]: lightMode,
        },
        className
      )}
      label={label}
      {...registered}
      {...inputProps}
    />
  );
};

export default MyTextField;
