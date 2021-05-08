import React from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { SubmitMenuButtonProps } from '../../types/components/submit_types';

const Button = ({ variant, active, handleClick }: SubmitMenuButtonProps) => (
  <div
    className={`font-sans w-8 h-8 cursor-pointer select-none outline-none text-white flex items-center justify-center border-white border-b-2 border-opacity-0 ${
      active && 'border-opacity-100'
    } submit-menu-button--${variant}`}
    role="button"
    tabIndex={0}
    onClick={handleClick}
    onKeyDown={handleClick}
  >
    <FaCloudUploadAlt className="w-1/2 h-1/2" />
  </div>
);
export default Button;
