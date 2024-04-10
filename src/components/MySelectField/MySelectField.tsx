import { Select, SelectProps } from '@mantine/core';
import classNames from 'classnames';

import { Controller, useFormContext } from '@redwoodjs/forms';

import styles from './MySelectField.module.scss';

export interface MySelectFieldProps extends SelectProps {
  className?: string;
  name: string;
  value?: string;
  options: { value: string; label: string }[];
  onChange?: (value: string) => void;
  label?: string;
}

export const MySelectField = ({
  className,
  name,
  label,
  value,
  options,
  onChange,
  ...inputProps
}: MySelectFieldProps) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={value}
      render={({ field: { value, onChange: formOnChange } }) => (
        <Select
          className={classNames(styles.container, className)}
          name={name}
          label={label}
          size={'xs'}
          {...inputProps}
          value={value}
          comboboxProps={{ zIndex: 99999999 }}
          data={options}
          onChange={(value) => {
            onChange?.(value);
            formOnChange(value);
          }}
        />
      )}
    />
  );
};

export default MySelectField;
