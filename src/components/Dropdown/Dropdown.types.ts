export type Option = {
  value: string;
  label: string;
};

export type DropdownProps = {
  className?: string;
  value: string;
  onChange: CallableFunction;
  options: Option[];
};
