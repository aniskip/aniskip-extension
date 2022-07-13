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
      <div className="flex w-full items-center justify-between space-x-3 focus:outline-none">
        <span className="text-left font-semibold text-gray-700">{name}</span>
        {children}
      </div>
      {description && (
        <span className="block text-sm text-gray-500">{description}</span>
      )}
    </div>
  );
}
