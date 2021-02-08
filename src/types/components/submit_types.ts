export interface SubmitButtonProps {
  handleClick: (
    event:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.KeyboardEvent<HTMLDivElement>
  ) => void;
  width: string;
  height: string;
  color: string;
}

export interface SubmitButtonContainerProps {
  width: string;
  height: string;
  iconWidth: string;
  iconHeight: string;
  iconColour: string;
}

export interface SubmitMenuProps {
  submitButtonHeight: string;
}
