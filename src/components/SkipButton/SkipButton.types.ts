import React from 'react';
import { SkipType } from '../../api';

export type SkipButtonProps = {
  skipType: SkipType;
  variant: string;
  hidden?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};
