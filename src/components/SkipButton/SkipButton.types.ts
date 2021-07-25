import React from 'react';
import { SkipType } from '../../api';

export type SkipButtonOnClickHandler = (
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>
) => void;

export type SkipButtonProps = {
  skipType: SkipType;
  variant: string;
  hidden?: boolean;
  onClick?: SkipButtonOnClickHandler;
};
