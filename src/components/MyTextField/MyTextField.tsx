import classNames from 'classnames';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import styles from './MyTextField.module.scss';

export type MyTextFieldProps = {
  label?: string;
  className?: string;
  name: string;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const MyTextField = React.forwardRef<HTMLInputElement, MyTextFieldProps>(
  ({ className, name, label, ...inputProps }, forwardedRef) => {
    const { register } = useFormContext();
    const { ref, ...registered } = register(name);
    return (
      <label htmlFor={name} className={classNames(styles.container, className)}>
        {label && <span>{label}</span>}
        <input
          type={'text'}
          id={name}
          ref={(node) => {
            if (typeof forwardedRef === 'function') {
              forwardedRef(node);
            } else if (forwardedRef?.current) {
              forwardedRef.current = node;
            }

            if (typeof ref === 'function') ref(node);
          }}
          {...registered}
          {...inputProps}
          inputMode={inputProps.type === 'number' ? 'numeric' : 'text'}
        />
      </label>
    );
  }
);

export type MyTextAreaProps = {
  label?: string;
  className?: string;
  name: string;
} & React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

export const MyTextArea = ({
  className,
  name,
  label,
  ...inputProps
}: MyTextAreaProps) => {
  const { register } = useFormContext();
  const registered = register(name);
  return (
    <label htmlFor={name} className={classNames(styles.container, className)}>
      {label && <span className={styles.label}>{label}</span>}
      <textarea id={name} {...registered} {...inputProps} />
    </label>
  );
};
