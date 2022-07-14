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
      } relative inline-flex h-6 w-10 flex-shrink-0 items-center rounded-full transition-colors ${className}`}
      checked={checked}
      onChange={onChange}
    >
      {children}
      <span
        aria-hidden="true"
        className={`${
          checked ? 'translate-x-[1.125rem]' : 'translate-x-1'
        } absolute flex h-[1.125rem] w-[1.125rem] transform items-center justify-center rounded-full bg-white transition`}
      >
        {checked ? (
          <FaCheck className="h-3 w-3 text-green-600" />
        ) : (
          <FaTimes className="w-4- h-4 text-gray-500" />
        )}
      </span>
    </Switch>
  );
}
