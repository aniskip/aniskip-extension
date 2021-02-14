export interface SubmitButtonProps {
  handleClick: (
    event:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.KeyboardEvent<HTMLDivElement>
  ) => void;
  variant: string;
}

export interface SubmitButtonContainerProps {
  variant: string;
}

export interface SubmitMenuProps {
  variant: string;
  hidden: boolean;
  onSubmit: CallableFunction;
  onClose: CallableFunction;
}

export interface InputProps {
  className?: string;
  value: string;
  id: string;
  pattern: string;
  title?: string;
  placeholder?: string;
  required?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}
