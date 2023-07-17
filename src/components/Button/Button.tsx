import React, { forwardRef } from 'react';

import cn from 'classnames';

import styles from './Button.module.scss';

export type ButtonProps = {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: 'solid' | 'outlined' | 'ghost' | 'native';
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      disabled,
      onClick,
      variant = 'native',
      icon,
      iconRight,
      ...buttonProps
    },
    forwardedRef
  ) => {
    return (
      <button
        ref={forwardedRef}
        className={cn(
          styles.container,
          {
            [styles.solid]: variant === 'solid',
            [styles.outlined]: variant === 'outlined',
            [styles.ghost]: variant === 'ghost',
            [styles.native]: variant === 'native',
          },
          className
        )}
        disabled={disabled}
        onClick={onClick}
        {...buttonProps}
      >
        {icon}
        {children && (icon || iconRight) ? (
          <span className={styles.centeringSpan}>{children}</span>
        ) : (
          children
        )}
        {iconRight}
      </button>
    );
  }
);

export default React.memo(Button);
