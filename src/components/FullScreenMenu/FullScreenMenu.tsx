import React from 'react';

import cn from 'classnames';

import { ContextMenuItem } from 'src/use-react-modals/src/components/ContextMenu/ContextMenu.types';
import Modal from 'src/use-react-modals/src/components/Modal';
import { useModals } from 'src/use-react-modals/src/Modals.context';

import Spinner from '../Spinner';

import styles from './FullScreenMenu.module.scss';

type FullScreenMenuProps = {
  className?: string;
  title?: string;
  block?: 'start' | 'middle' | 'end';
  onRequestClose: () => void;
  items: ContextMenuItem[];
};

export const FullScreenMenu: React.FC<FullScreenMenuProps> = ({
  className,
  onRequestClose,
  title,
  items,
  block = 'end',
}) => {
  return (
    <Modal
      className={className}
      header={title}
      onRequestClose={onRequestClose}
      block={block}
    >
      {(closeModal) => (
        <ul className={styles.menu}>
          {items.map(({ icon: Icon, label, onClick, ...rest }, idx) =>
            onClick ? (
              <AsyncItem
                key={`fullscreen-item-${idx}`}
                icon={Icon}
                label={label}
                onClick={onClick}
                onRequestClose={closeModal}
                {...rest}
              />
            ) : (
              <div key={`fullscreen-item-${idx}`} className={styles.item}>
                {typeof Icon === 'function' ? <Icon /> : Icon}
                <span>{label}</span>
              </div>
            )
          )}
        </ul>
      )}
    </Modal>
  );
};

const AsyncItem = ({
  label,
  isAsync,
  icon: Icon,
  className,
  disabled,
  confirm,
  onClick,
  onRequestClose,
}: ContextMenuItem & { onRequestClose: () => void }) => {
  const { confirm: appConfirm } = useModals();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = async () => {
    if (confirm) {
      onRequestClose();
      const confirmed = await appConfirm(confirm);
      if (confirmed) {
        onClick();
      }
    } else if (isAsync) {
      setIsLoading(true);
      await onClick();
      setIsLoading(false);
      onRequestClose();
    } else if (onClick) {
      onRequestClose();
      onClick();
    }
  };

  return (
    <button
      className={cn(styles.item, className)}
      disabled={disabled}
      onClick={handleClick}
    >
      {isLoading ? <Spinner /> : typeof Icon === 'function' ? <Icon /> : Icon}
      <span>{label}</span>
    </button>
  );
};

export default React.memo(FullScreenMenu);
