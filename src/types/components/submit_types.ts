export type SubmitMenuButtonOnClickHandler = (
  event:
    | React.MouseEvent<HTMLDivElement, MouseEvent>
    | React.KeyboardEvent<HTMLDivElement>
) => void;

export interface SubmitMenuButtonProps {
  active?: boolean;
  variant: string;
  onClick: SubmitMenuButtonOnClickHandler;
}

export interface SubmitMenuContainerProps {
  variant: string;
}

export interface SubmitMenuProps {
  variant: string;
  hidden?: boolean;
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
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}
