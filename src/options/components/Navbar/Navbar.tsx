import React from 'react';
import { FaPlay } from 'react-icons/fa';

export function Navbar(): JSX.Element {
  return (
    <div className="h-16 w-full border-b border-gray-300 bg-white">
      <div className="mx-auto flex h-full max-w-screen-md items-center px-4">
        <a className="flex items-center space-x-1 outline-none" href="#top">
          <FaPlay className="text-primary" size={30} />
          <span className="text-2xl font-semibold">
            Ani<span className="text-primary">skip</span>
          </span>
        </a>
      </div>
    </div>
  );
}
