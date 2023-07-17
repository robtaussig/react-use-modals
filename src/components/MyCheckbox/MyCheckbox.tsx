import cn from 'classnames';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import styles from './MyCheckbox.module.scss';

type MyCheckboxProps = {
  label?: string;
  className?: string;
  name: string;
  lightMode?: boolean;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const MyCheckbox = React.forwardRef<HTMLInputElement, MyCheckboxProps>(
  ({ className, name, label, lightMode, ...inputProps }, forwardedRef) => {
    const { register } = useFormContext();
    const { ref, ...registered } = register(name);

    return (
      <label
        htmlFor={name}
        className={cn(
          styles.container,
          { [styles.hasLabel]: Boolean(label) },
          { [styles.lightMode]: Boolean(lightMode) },
          { [styles.disabled]: Boolean(inputProps.disabled) },
          className
        )}
      >
        <input
          type={'checkbox'}
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
        />
        {label && <span className={styles.label}>{label}</span>}
      </label>
    );
  }
);

export default React.memo(MyCheckbox);
