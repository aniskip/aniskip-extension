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
          'px-2',
          'py-1',
          'flex',
          'justify-between',
          'items-center',
          'w-full',
          'h-full',
          'space-x-2',
          'focus:outline-none',
          'focus:ring-2',
          'focus:ring-yellow-500'
        )}
        type="button"
        onClick={() => setHidden((previous) => !previous)}
      >
        <span
          className={classnames(
            'flex-1',
            'font-semibold',
            'border-r-2',
            'border-gray-200'
          )}
        >
          {options.find((element) => element.value === value)?.label}
        </span>
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
      </button>
      <div
        className={classnames(
          { hidden },
          'bg-white',
          'rounded',
          'mt-2',
          'absolute',
          'w-full'
        )}
      >
        {options.map(({ value: valueId, label }) => (
          <button
            className={classnames(
              'w-full',
              'px-2',
              'py-1',
              'rounded',
              'focus:outline-none',
              'hover:bg-yellow-500',
              'hover:text-white'
            )}
            type="button"
            key={uuidv4()}
            onClick={handleClick(valueId)}
          >
            <span className={classnames()}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
export default Dropdown;
