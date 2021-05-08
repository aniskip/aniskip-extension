import React from 'react';
import { SkipType } from '../api/skip_time_types';

export type SkipButtonClickHandler = (
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>
) => void;

export interface SkipButtonProps {
  skipType: SkipType;
  variant: string;
  hidden?: boolean;
  onClick?: SkipButtonClickHandler;
}
