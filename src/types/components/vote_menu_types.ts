export interface VoteMenuProps {
  variant: string;
  hidden: boolean;
  onClose: CallableFunction;
}

export type VoteMenuButtonOnClickHandler = (
  event:
    | React.MouseEvent<HTMLDivElement, MouseEvent>
    | React.KeyboardEvent<HTMLDivElement>
) => void;

export interface VoteMenuButtonProps {
  active?: boolean;
  variant: string;
  onClick: VoteMenuButtonOnClickHandler;
}
