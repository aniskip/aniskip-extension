import React, { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { TwitterPicker } from 'react-color';
import {
  ColourPickerProps,
  DEFAULT_COLOUR_PICKER_COLOURS,
} from './ColourPicker.types';

export function ColourPicker({
  colour,
  colours,
  onChangeComplete,
}: ColourPickerProps): JSX.Element {
  const colourPickerColours = colours ?? [...DEFAULT_COLOUR_PICKER_COLOURS];

  return (
    <Popover className="relative">
      {({ open }): JSX.Element => (
        <>
          <div className="flex items-center">
            <div className="flex h-7 w-7 items-center rounded-full border border-gray-300">
              <Popover.Button
                style={{ backgroundColor: colour as string }}
                className="h-full w-full rounded-full border-2 border-white focus:outline-none"
              />
            </div>
          </div>
          <Transition
            as={Fragment}
            show={open}
            enter="transition duration-100 ease-out origin-top-right"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out origin-top-right"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Popover.Panel className="absolute -right-[8px] z-10 mt-2" static>
              {/* @ts-ignore: Outdated library types */}
              <TwitterPicker
                triangle="top-right"
                color={colour}
                colors={colourPickerColours}
                onChangeComplete={onChangeComplete}
              />
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
