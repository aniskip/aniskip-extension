import React from 'react';
import classnames from 'classnames';
import { InputProps } from '../types/components/submit_types';

const Input: React.FC<InputProps> = ({
  className,
  value,
  id,
  pattern,
  title,
  placeholder,
  required,
  onChange,
  onFocus,
  onBlur,
}: InputProps) => (
  <input
    className={classnames(
      'rounded',
      'px-2',
      'py-1',
      'block',
      'min-w-0',
      'focus:outline-none',
      className
    )}
    type="text"
    id={id}
    autoComplete="off"
    value={value}
    pattern={pattern}
    title={title}
    placeholder={placeholder}
    required={required}
    onChange={onChange}
    onFocus={onFocus}
    onBlur={onBlur}
  />
);

export default Input;
