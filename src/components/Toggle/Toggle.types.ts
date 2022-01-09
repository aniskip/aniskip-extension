export type ToggleProps = {
  className?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  children?: React.ReactNode;
};
