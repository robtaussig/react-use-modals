import classNames from 'classnames';
import React from 'react';
import { useThrottledValue } from '~/hooks/useThrottledValue';
import { withVibrate } from '~/components/Button/Button.util';

import { Button, ButtonProps } from '../Button/Button';
import Spinner from '~/components/Spinner';

import styles from './PrimaryButton.module.scss';

export type PrimaryButtonProps = {
  loading?: boolean;
  loadingThrottle?: number;
  asNative?: boolean;
  scrollToOnMount?: boolean;
  autoLoad?: boolean;
} & ButtonProps;

const PrimaryButton = ({
  children,
  className,
  loading,
  loadingThrottle = 500,
  disabled,
  asNative,
  autoLoad,
  scrollToOnMount,
  variant = 'solid',
  ...buttonProps
}: PrimaryButtonProps) => {
  const [selfLoading, setSelfLoading] = React.useState(false);
  const throttledLoading = useThrottledValue(
    loading || selfLoading,
    loadingThrottle
  );
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (scrollToOnMount) {
      buttonRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [scrollToOnMount]);

  if (asNative) {
    return (
      <button
        ref={buttonRef}
        className={classNames(
          styles.container,
          className,
          {
            [styles.loading]: throttledLoading,
          },
          styles.asNative
        )}
        {...buttonProps}
        onClick={withVibrate(async (e) => {
          if (!throttledLoading) {
            if (autoLoad) setSelfLoading(true);
            await buttonProps?.onClick?.(e);
            setSelfLoading(false);
          }
        })}
        disabled={disabled}
      >
        {children}
        {throttledLoading && (
          <div className={styles.spinnerContainer}>
            <Spinner />
          </div>
        )}
      </button>
    );
  }

  return (
    <Button
      ref={buttonRef}
      className={classNames(styles.container, className, {
        [styles.loading]: throttledLoading,
      })}
      {...buttonProps}
      onClick={withVibrate(async (e) => {
        if (!throttledLoading) {
          if (autoLoad) setSelfLoading(true);
          await buttonProps?.onClick?.(e);
          setSelfLoading(false);
        }
      })}
      variant={variant}
      disabled={disabled}
    >
      {children}
      {throttledLoading && (
        <div className={styles.spinnerContainer}>
          <Spinner />
        </div>
      )}
    </Button>
  );
};

export default React.memo(PrimaryButton);
