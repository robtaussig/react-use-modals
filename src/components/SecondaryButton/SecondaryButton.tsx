import React, { useEffect } from 'react';

import classNames from 'classnames';

import { useModals } from '~/Modals.context';
import { useThrottledValue } from '~/hooks/useThrottledValue';
import { withVibrate } from '~/components/Button/Button.util';

import { Button, ButtonProps } from '../Button/Button';
import Spinner from '../Spinner';

import styles from './SecondaryButton.module.scss';

export type SecondaryButtonProps = {
  loading?: boolean;
  loadingThrottle?: number;
  danger?: boolean | string;
  async?: boolean;
  children?: React.ReactNode;
} & ButtonProps;

export const SecondaryButton = ({
  children,
  className,
  loading,
  loadingThrottle,
  danger,
  async,
  ...buttonProps
}: SecondaryButtonProps) => {
  const [selfLoading, setSelfLoading] = React.useState(false);
  const throttledLoading = useThrottledValue(
    loading || selfLoading,
    loadingThrottle
  );
  const isUnmountedRef = React.useRef(false);
  const { confirm } = useModals();
  const handleClick = async (e) => {
    const handler = async () => {
      if (async) {
        setSelfLoading(true);
        await buttonProps?.onClick(e);
        if (!isUnmountedRef.current) {
          setSelfLoading(false);
        }
      } else {
        buttonProps?.onClick(e);
      }
    };

    if (typeof danger === 'string') {
      const confirmed = await confirm(danger);
      if (confirmed) {
        return handler();
      }
    } else {
      return handler();
    }
  };

  useEffect(() => {
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);

  return (
    <Button
      className={classNames(styles.container, className, {
        [styles.loading]: throttledLoading,
        [styles.danger]: danger,
      })}
      variant={'outlined'}
      {...buttonProps}
      onClick={withVibrate((e) => {
        if (!throttledLoading) {
          handleClick?.(e);
        }
      })}
      disabled={buttonProps.disabled}
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

export default React.memo(SecondaryButton);
