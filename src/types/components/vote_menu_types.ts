export type VoteMenuButtonClickHandler = (
  event:
    | React.MouseEvent<HTMLDivElement, MouseEvent>
    | React.KeyboardEvent<HTMLDivElement>
) => void;

export interface VoteMenuButtonProps {
  active?: boolean;
  variant: string;
  handleClick: VoteMenuButtonClickHandler;
}
