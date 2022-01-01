import React from 'react';
import { ChangelogNotification, Navbar, SettingsPage } from './components';

export function App(): JSX.Element {
  return (
    <div className="font-sans">
      <Navbar />
      <div className="mx-auto max-w-screen-md sm:px-8 sm:py-10">
        <SettingsPage />
      </div>
      <ChangelogNotification />
    </div>
  );
}
