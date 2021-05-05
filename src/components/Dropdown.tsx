import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FaChevronDown } from 'react-icons/fa';
import { DropdownProps } from '../types/components/dropdown_types';

const Dropdown: React.FC<DropdownProps> = ({
  className,
  value,
  onChange,
  options,
}: DropdownProps) => {
  const [hidden, setHidden] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClick = (valueId: string) => () => {
    setHidden(true);
    onChange(valueId);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const dropdownClicked = !!dropdownRef.current?.contains(target);
    if (!dropdownClicked) {
      setHidden(true);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);

    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`text-black relative inline-block ${className}`}
    >
      <button
        className={`bg-white rounded flex justify-between items-center w-full h-full space-x-2 text-center border ${
          hidden
            ? 'border-gray-300'
            : 'ring-1 ring-yellow-600 border-yellow-600'
        } focus:outline-none`}
        type="button"
        onClick={() => setHidden((current) => !current)}
      >
        <span className="invisible pointer-events-none px-3 py-2">
          {
            options.reduce((max, current) =>
              current.label.length > max.label.length ? current : max
            ).label
          }
        </span>
        <span className="font-semibold px-3 py-2 absolute left-0">
          {options.find((element) => element.value === value)?.label}
        </span>
        <div className="pl-3 pr-4 py-3">
          <div
            className={`transition-transform duration-300 transform ${
              !hidden && 'rotate-180'
            } flex-none flex justify-center items-center w-4 h-4`}
          >
            <FaChevronDown />
          </div>
        </div>
      </button>
      <div
        className={`transition transform origin-top ${
          hidden && 'opacity-0 pointer-events-none scale-y-90'
        } bg-white rounded mt-2 absolute w-full shadow-lg z-10 border overflow-hidden border-gray-200 py-1`}
      >
        {options.map(({ value: valueId, label }) => (
          <button
            className="w-full px-4 py-2 text-left focus:outline-none hover:bg-yellow-600 hover:border-yellow-600 hover:text-white"
            type="button"
            key={uuidv4()}
            onClick={handleClick(valueId)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};
export default Dropdown;
