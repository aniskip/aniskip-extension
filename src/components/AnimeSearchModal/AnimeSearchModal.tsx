import React from 'react';
import { BiSearch } from 'react-icons/bi';

export function AnimeSearchModal(): JSX.Element {
  return (
    <div className="bg-neutral-50 rounded-md font-sans shadow-md max-w-2xl md:mx-auto">
      <div className="flex items-center px-4">
        <BiSearch className="w-5 h-5" />
        <div className="px-4 flex-auto">
          <input
            className="h-14 focus:outline-none"
            placeholder="Search anime"
          />
        </div>
        <button
          className="font-semibold uppercase text-[0.625em] border border-gray-200 p-2 rounded-md hover:shadow-md hover:border-gray-300"
          type="button"
        >
          Esc
        </button>
      </div>
    </div>
  );
}
