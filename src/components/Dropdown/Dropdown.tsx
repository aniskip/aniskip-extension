import React from 'react';
import { Listbox } from '@headlessui/react';
import { FaCheck, FaChevronDown } from 'react-icons/fa';
import { DropdownProps } from './Dropdown.types';

export function Dropdown({
  className,
  value,
  onChange,
  options,
  dropdownOptionsProps,
}: DropdownProps): JSX.Element {
  return (
    <Listbox
      as="div"
      className={`relative ${className}`}
      value={value}
      onChange={onChange}
    >
      {({ open }): JSX.Element => (
        <>
          <Listbox.Button
            className={`bg-white rounded flex justify-between items-center w-full h-full text-center border ${
              !open ? 'border-gray-300' : 'ring-1 ring-primary border-primary'
            } focus:outline-none`}
            type="button"
          >
            <span className="invisible pointer-events-none px-3 py-2">
              {
                options.reduce((max, current) =>
                  current.label.length > max.label.length ? current : max
                ).label
              }
            </span>
            <span className="text-black font-normal px-3 py-2 absolute left-0">
              {options.find((element) => element.id === value)?.label}
            </span>
            <div className="pl-3 pr-4 py-3">
              <div
                className={`transition-transform duration-300 transform ${
                  open && '-rotate-180'
                } flex-none flex justify-center items-center w-4 h-4`}
              >
                <FaChevronDown className="text-black" />
              </div>
            </div>
          </Listbox.Button>
          <Listbox.Options
            className={`transition transform origin-top bg-white rounded mt-2 absolute w-full shadow-lg z-10 border overflow-y-auto border-gray-200 py-1 focus:outline-none ${
              open
                ? 'opacity-100 scale-y-100'
                : 'opacity-0 scale-y-95 pointer-events-none'
            }
            ${dropdownOptionsProps?.className ?? ''}`}
            static
          >
            {options.map(({ label, id }) => (
              <Listbox.Option
                className={({ active }): string =>
                  `relative text-black w-full py-2 text-left focus:outline-none ${
                    active ? 'bg-amber-100 border-amber-100 text-amber-900' : ''
                  }`
                }
                key={id}
                value={id}
              >
                {({ selected }): JSX.Element => (
                  <>
                    {selected ? (
                      <span className="flex items-center absolute inset-y-0 pl-3">
                        <FaCheck className="text-primary border-primary" />
                      </span>
                    ) : null}
                    <span className="pl-10">{label}</span>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </>
      )}
    </Listbox>
  );
}
