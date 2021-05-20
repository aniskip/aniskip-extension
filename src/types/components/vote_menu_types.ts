import { SkipTimeType } from '../api/aniskip_types';

export interface VoteMenuProps {
  variant: string;
  hidden?: boolean;
  skipTimes: SkipTimeType[];
  onClose: CallableFunction;
  submitMenuOpen: CallableFunction;
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
