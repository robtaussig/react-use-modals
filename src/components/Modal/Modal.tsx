import cn from 'classnames';
import ReactDOM from 'react-dom';
import React from 'react';
import useBlockBodyScroll from '~/hooks/useBlockBodyScroll';
import useCloseOnOutsideClick from '~/hooks/useCloseOnOutsideClick';
import { FaTimes } from 'react-icons/fa';
import styles from './Modal.module.scss';

type ModalProps<T = any> = {
  className?: string;
  header?: string | React.ReactNode;
  footer?: string | React.ReactNode;
  closeButton?: boolean;
  onRequestClose?: (customData?: T) => void;
  children: (requestClose: (customData?: T) => void) => React.ReactNode;
  block?: 'start' | 'middle' | 'end';
};

export function Modal<T>({
  className,
  onRequestClose,
  children,
  header,
  footer,
  closeButton = true,
  block = 'middle',
}: ModalProps<T>) {
  useBlockBodyScroll(true);
  const elRef = React.useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleClose = (customData?: T) => {
    if (onRequestClose) {
      setIsClosing(true);
      elRef.current.classList.add(styles.closing);
      setTimeout(() => {
        onRequestClose(customData);
      }, 250);
    }
  };

  useCloseOnOutsideClick(elRef, handleClose);

  if (!elRef.current) {
    elRef.current = document.createElement('div');
    elRef.current.classList.add(styles.container);
    elRef.current.style.justifyContent =
      block === 'start'
        ? 'flex-start'
        : block === 'middle'
        ? 'center'
        : 'flex-end';
  }

  React.useEffect(() => {
    const menuRoot = document.getElementById('full-screen-menu-root');

    menuRoot.appendChild(elRef.current);

    return () => {
      menuRoot.removeChild(elRef.current);
    };
  }, []);

  return ReactDOM.createPortal(
    <div
      className={cn(
        styles.content,
        {
          [styles.closing]: isClosing,
        },
        className
      )}
    >
      {closeButton && (
        <button className={styles.newCloseButton} onClick={() => handleClose()}>
          <FaTimes />
        </button>
      )}
      {header ? typeof header === 'string' ? <h2>{header}</h2> : header : null}
      {children(handleClose)}
      {footer ? (
        typeof footer === 'string' ? (
          <footer>{footer}</footer>
        ) : (
          footer
        )
      ) : null}
    </div>,
    elRef.current
  );
}

export default Modal;
