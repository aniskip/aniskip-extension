import React from 'react';
import { SkipType } from '../api/skip_time_types';

export interface SkipTimeButtonProps {
  skipType: SkipType;
  variant?: string;
  hidden?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
