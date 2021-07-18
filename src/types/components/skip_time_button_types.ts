import React from 'react';
import { SkipTime, SkipType } from '../../api';

export type SkipButtonOnClickHandler = (
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>
) => void;

export interface SkipButtonProps {
  skipType: SkipType;
  variant: string;
  hidden?: boolean;
  onClick?: SkipButtonOnClickHandler;
}

export interface SkipButtonContainerProps {
  skipTimes: SkipTime[];
  currentTime: number;
  videoDuration: number;
  variant: string;
  onClickHandlers: SkipButtonOnClickHandler[];
}
