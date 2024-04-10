import cn from 'classnames';
import { HiDotsVertical } from 'react-icons/hi';
import React from 'react';
import { ContextMenuItem } from './ContextMenu.types';

import styles from './ContextMenu.module.scss';
import FullScreenMenu from '../../components/FullScreenMenu';

export type ContextMenuProps = {
  className?: string;
  menuClassName?: string;
  isShowingNavItems: boolean;
  disabled?: boolean;
  onShowNavItems: () => void;
  onRequestCloseNavItems: () => void;
  items: ContextMenuItem[];
  title?: string;
};

const getBlock = (container: HTMLDivElement): 'start' | 'middle' | 'end' => {
  const pos = container?.getBoundingClientRect()?.top;
  const third = window.innerHeight / 3;

  if (pos > third * 2) return 'end';
  if (pos < third) return 'start';
  return 'middle';
};

export const ContextMenu = ({
  className,
  menuClassName,
  isShowingNavItems,
  disabled,
  onRequestCloseNavItems,
  items,
  onShowNavItems,
  title,
}: ContextMenuProps) => {
  const rootRef = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={rootRef} className={cn(styles.container, className)}>
      <button
        className={cn(styles.showNavItemsButton, {
          [styles.showNavItems]: isShowingNavItems,
        })}
        onClick={onShowNavItems}
        disabled={disabled}
      >
        <HiDotsVertical size={'24px'} />
      </button>
      {isShowingNavItems && (
        <FullScreenMenu
          className={menuClassName}
          title={title}
          items={items}
          block={getBlock(rootRef.current)}
          onRequestClose={onRequestCloseNavItems}
        />
      )}
    </div>
  );
};

export default React.memo(ContextMenu);
