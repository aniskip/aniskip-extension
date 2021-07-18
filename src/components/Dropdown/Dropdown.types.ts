export interface Option {
  value: string;
  label: string;
}

export interface DropdownProps {
  className?: string;
  value: string;
  onChange: CallableFunction;
  options: Option[];
}
