import React from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { SubmitMenuButtonProps } from '../types/components/submit_types';

const SubmitMenuButton: React.FC<SubmitMenuButtonProps> = ({
  handleClick,
}: SubmitMenuButtonProps) => (
  <div
    className="cursor-pointer select-none outline-none flex justify-center items-center w-1/2 h-1/2"
    role="button"
    tabIndex={0}
    onClick={handleClick}
    onKeyDown={handleClick}
  >
    <FaCloudUploadAlt />
  </div>
);
export default SubmitMenuButton;
