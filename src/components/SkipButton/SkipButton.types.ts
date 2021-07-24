import React from 'react';
import { SkipType } from '../../api';

export type SkipButtonOnClickHandler = (
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>
) => void;

export interface SkipButtonProps {
  skipType: SkipType;
  variant: string;
  hidden?: boolean;
  onClick?: SkipButtonOnClickHandler;
}
