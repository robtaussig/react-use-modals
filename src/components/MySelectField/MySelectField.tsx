import classNames from 'classnames';

import { useFormContext } from 'react-hook-form';
import React from 'react';

import styles from './MySelectField.module.scss';

type MySelectFieldProps = {
  className?: string;
  name: string;
  label?: string;
  children: React.ReactNode;
} & React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>;

export const MySelectField = ({
  className,
  name,
  label,
  children,
  ...inputProps
}: MySelectFieldProps) => {
  const { register } = useFormContext();
  return (
    <label className={classNames(styles.container, className)} htmlFor={name}>
      {label && <span className={styles.label}>{label}</span>}
      <select {...register(name)} {...inputProps}>
        {children}
      </select>
    </label>
  );
};

export default MySelectField;
