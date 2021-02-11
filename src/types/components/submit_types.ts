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
