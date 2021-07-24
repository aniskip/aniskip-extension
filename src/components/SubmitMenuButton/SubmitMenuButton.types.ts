export type SubmitMenuButtonOnClickHandler = (
  event:
    | React.MouseEvent<HTMLDivElement, MouseEvent>
    | React.KeyboardEvent<HTMLDivElement>
) => void;

export type SubmitMenuButtonProps = {
  active?: boolean;
  variant: string;
  onClick: SubmitMenuButtonOnClickHandler;
};
