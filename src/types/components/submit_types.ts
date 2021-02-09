export interface SubmitButtonProps {
  handleClick: (
    event:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.KeyboardEvent<HTMLDivElement>
  ) => void;
  style: string;
}

export interface SubmitButtonContainerProps {
  variant: string;
}

export interface SubmitMenuProps {
  variant: string;
}
