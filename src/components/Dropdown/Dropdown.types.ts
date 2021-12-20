export type Option = {
  id: string;
  label: string;
};

export type DropdownProps = {
  className?: string;
  value: string;
  onChange: (value: any) => void;
  options: Option[];
};
