import { IconType } from 'react-icons';

export type ContextMenuItem = {
  id?: number | string;
  label?: string;
  icon: IconType | React.ReactNode;
  className?: string;
  disabled?: boolean;
  isAsync?: boolean;
  confirm?: string;
  onClick: () => void;
};
