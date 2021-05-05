import React from 'react';

export interface SkipTimeButtonProps {
  variant?: string;
  children?: React.ReactNode;
  hidden?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
