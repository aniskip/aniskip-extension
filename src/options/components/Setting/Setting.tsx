import React from 'react';
import { SettingProps } from './Setting.types';

export function Setting({
  name,
  description,
  className = '',
  children,
}: SettingProps): JSX.Element {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center space-x-3 w-full focus:outline-none">
        <span className="text-gray-700 font-semibold text-left">{name}</span>
        {children}
      </div>
      {description && (
        <span className="text-sm text-gray-500 block">{description}</span>
      )}
    </div>
  );
}
