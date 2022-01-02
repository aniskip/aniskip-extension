import React from 'react';
import { Navbar, SettingsPage } from './components';

export function App(): JSX.Element {
  return (
    <>
      <Navbar />
      <div className="font-sans mx-auto max-w-screen-md sm:px-8 sm:py-10">
        <SettingsPage />
      </div>
    </>
  );
}
