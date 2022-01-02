export type Option = {
  id: string;
  label: string;
};

export type DropdownOptionsProps = {
  className?: string;
};

export type DropdownProps = {
  className?: string;
  value: string;
  onChange: (value: any) => void;
  options: Option[];
  dropdownOptionsProps?: DropdownOptionsProps;
};
