import React, { useState } from 'react';
import classnames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import { FaCaretDown } from 'react-icons/fa';
import { DropdownProps } from '../types/components/dropdown_types';

const Dropdown: React.FC<DropdownProps> = ({
  className,
  value,
  onChange,
  options,
}: DropdownProps) => {
  const [hidden, setHidden] = useState(true);

  const handleClick = (valueId: string) => (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setHidden(true);
    onChange(valueId);
  };

  return (
    <div className={classnames('text-black', 'relative', className)}>
      <button
        className={classnames(
          'bg-white',
          'rounded',
          'flex',
          'justify-between',
          'items-center',
          'w-full',
          'h-full',
          'space-x-2',
          'text-center',
          'border-2',
          'border-gray-400',
          {
            'border-yellow-500': !hidden,
          },
          'focus:outline-none'
        )}
        type="button"
        onClick={() => setHidden((current) => !current)}
      >
        <span className={classnames('font-semibold', 'px-3', 'py-2')}>
          {options.find((element) => element.value === value)?.label}
        </span>
        <div
          className={classnames(
            'border-l-2',
            'border-gray-200',
            'pl-3',
            'pr-2',
            'py-2'
          )}
        >
          <div
            className={classnames(
              'flex-none',
              'flex',
              'justify-center',
              'items-center',
              'w-3',
              'h-3',
              'text-gray-500'
            )}
          >
            <FaCaretDown />
          </div>
        </div>
      </button>
      <div
        className={classnames(
          { hidden },
          'bg-white',
          'rounded',
          'mt-2',
          'absolute',
          'w-full',
          'shadow-lg',
          'overflow-hidden'
        )}
      >
        {options.map(({ value: valueId, label }) => (
          <button
            className={classnames(
              'w-full',
              'px-3',
              'py-2',
              'text-left',
              'border-b',
              'focus:outline-none',
              'hover:bg-yellow-500',
              'hover:border-yellow-500',
              'hover:text-white'
            )}
            type="button"
            key={uuidv4()}
            onClick={handleClick(valueId)}
          >
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
export default Dropdown;
