import React from 'react';

export interface ButtonProps {
  className?: string;
  title?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  submit?: boolean;
  disabled?: boolean;
}

export interface LinkButtonProps {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}
