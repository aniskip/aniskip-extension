import { SkipTime } from '../../api';

export interface VoteMenuProps {
  variant: string;
  hidden?: boolean;
  skipTimes: SkipTime[];
  onClose: CallableFunction;
  submitMenuOpen: CallableFunction;
}

export type VoteMenuButtonOnClickHandler = (
  event:
    | React.MouseEvent<HTMLDivElement, MouseEvent>
    | React.KeyboardEvent<HTMLDivElement>
) => void;
