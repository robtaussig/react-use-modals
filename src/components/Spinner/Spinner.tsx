import classNames from 'classnames';
import { ImSpinner10 } from 'react-icons/im';

import styles from './Spinner.module.scss';

interface SpinnerProps {
  className?: string;
  size?: string;
}

export const Spinner = ({ className, size = '24px' }: SpinnerProps) => {
  return (
    <ImSpinner10
      className={classNames(styles.container, className)}
      size={size}
    />
  );
};

export default Spinner;
