import React from 'react';
import { FaPlay } from 'react-icons/fa';

export const Navbar = (): JSX.Element => (
  <div className="w-full border-b border-gray-300 h-16 bg-white">
    <div className="flex items-center mx-auto max-w-screen-lg px-4 h-full">
      <a className="flex items-center space-x-1 outline-none" href="#top">
        <FaPlay className="text-primary" size={30} />
        <span className="text-2xl font-semibold">
          Ani<span className="text-primary">skip</span>
        </span>
      </a>
    </div>
  </div>
);
