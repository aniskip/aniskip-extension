export interface SkipTimeButtonProps {
  variant: string;
  label: string;
  hidden?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
