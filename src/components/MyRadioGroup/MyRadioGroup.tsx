import cn from 'classnames';
import React from 'react';
import styles from './MyRadioGroup.module.scss';

type MyRadioGroupProps = {
  className?: string;
  groupLabel?: string;
  name: string;
  options: {
    label: string;
    initialSelect?: boolean;
    disabled?: boolean;
    value: string;
  }[];
  onChange?: (value: string) => void;
};

export const MyRadioGroup: React.FC<MyRadioGroupProps> = ({
  className,
  name,
  groupLabel,
  options,
  onChange,
}) => {
  return (
    <>
      {groupLabel && <span>{groupLabel}</span>}
      <fieldset className={cn(styles.container, className)}>
        {options.map(({ label, initialSelect, disabled, value }) => (
          <div key={value} className={styles.radio}>
            <input
              type={'radio'}
              name={name}
              disabled={disabled}
              id={value}
              value={value}
              defaultChecked={initialSelect}
              onChange={() => onChange(value)}
            />
            <label htmlFor={value}>
              <span>{label}</span>
            </label>
          </div>
        ))}
      </fieldset>
    </>
  );
};

export default React.memo(MyRadioGroup);
