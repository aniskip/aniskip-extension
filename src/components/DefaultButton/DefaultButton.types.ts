export type DefaultButtonProps = {
  className?: string;
  title?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  submit?: boolean;
  disabled?: boolean;
};
