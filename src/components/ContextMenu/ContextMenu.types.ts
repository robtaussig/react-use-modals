export type ContextMenuItem = {
  id?: number | string;
  label?: string;
  icon: any;
  className?: string;
  disabled?: boolean;
  isAsync?: boolean;
  confirm?: string;
  onClick: () => void;
};
