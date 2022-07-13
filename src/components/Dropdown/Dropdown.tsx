import React from 'react';
import { Listbox } from '@headlessui/react';
import { FaCheck, FaChevronDown } from 'react-icons/fa';
import { DropdownProps } from './Dropdown.types';

export function Dropdown({
  className = '',
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
            className={`flex h-full w-full items-center justify-between rounded border bg-white text-center ${
              !open ? 'border-gray-300' : 'border-primary ring-1 ring-primary'
            } focus:outline-none`}
            type="button"
          >
            <span className="pointer-events-none invisible px-3 py-2">
              {
                options.reduce((max, current) =>
                  current.label.length > max.label.length ? current : max
                ).label
              }
            </span>
            <span className="absolute left-0 px-3 py-2 font-normal text-black">
              {options.find((element) => element.id === value)?.label}
            </span>
            <div className="py-3 pl-3 pr-4">
              <div
                className={`transform transition-transform duration-300 ${
                  open && '-rotate-180'
                } flex h-4 w-4 flex-none items-center justify-center`}
              >
                <FaChevronDown className="text-black" />
              </div>
            </div>
          </Listbox.Button>
          <Listbox.Options
            className={`absolute z-10 mt-2 w-full origin-top transform overflow-y-auto rounded border border-gray-200 bg-white py-1 shadow-lg transition focus:outline-none ${
              open
                ? 'scale-y-100 opacity-100'
                : 'pointer-events-none scale-y-95 opacity-0'
            }
            ${dropdownOptionsProps?.className ?? ''}`}
            static
          >
            {options.map(({ label, id }) => (
              <Listbox.Option
                className={({ active }): string =>
                  `relative w-full py-2 text-left text-black focus:outline-none ${
                    active ? 'border-amber-100 bg-amber-100 text-amber-900' : ''
                  }`
                }
                key={id}
                value={id}
              >
                {({ selected }): JSX.Element => (
                  <>
                    {selected ? (
                      <span className="absolute inset-y-0 flex items-center pl-3">
                        <FaCheck className="border-primary text-primary" />
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
