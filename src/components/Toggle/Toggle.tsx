import { Switch } from '@headlessui/react';
import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { ToggleProps } from './Toggle.types';

export function Toggle({
  className = '',
  checked,
  onChange,
  children,
}: ToggleProps): JSX.Element {
  return (
    <Switch
      className={`${
        checked ? 'bg-green-600' : 'bg-gray-500'
      } transition-colors relative inline-flex flex-shrink-0 items-center h-6 rounded-full w-10 ${className}`}
      checked={checked}
      onChange={onChange}
    >
      {children}
      <span
        aria-hidden="true"
        className={`${
          checked ? 'translate-x-[1.125em]' : 'translate-x-1'
        } transition absolute flex items-center justify-center w-[1.125em] h-[1.125em] transform bg-white rounded-full`}
      >
        {checked ? (
          <FaCheck className="text-green-600 w-3 h-3" />
        ) : (
          <FaTimes className="text-gray-500 w-4- h-4" />
        )}
      </span>
    </Switch>
  );
}
