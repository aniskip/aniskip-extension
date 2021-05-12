import React from 'react';
import { SkipTimeType, SkipType } from '../api/aniskip_types';

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
  skipTimes: SkipTimeType[];
  currentTime: number;
  videoDuration: number;
  variant: string;
  onClickHandlers: SkipButtonOnClickHandler[];
}
