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
