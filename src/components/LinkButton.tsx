import React from 'react';
import { LinkButtonProps } from '../types/components/button_types';

const LinkButton = ({ className, children, onClick }: LinkButtonProps) => (
  <button
    className={`hover:underline focus:outline-none font-semibold ${className}`}
    type="button"
    onClick={onClick}
  >
    {children}
  </button>
);

export default LinkButton;
