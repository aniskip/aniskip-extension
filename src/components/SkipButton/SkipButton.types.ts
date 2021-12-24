import { SkipType } from '../../api';

export type SkipButtonProps = {
  skipType: SkipType;
  variant: string;
  hidden?: boolean;
} & React.HTMLAttributes<HTMLButtonElement>;
