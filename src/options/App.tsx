import React from 'react';
import classnames from 'classnames';
import SettingsPage from './SettingsPage';

const App: React.FC = () => (
  <div
    className={classnames(
      'font-sans',
      'mx-auto',
      'max-w-screen-lg',
      'px-4',
      'py-10'
    )}
  >
    <SettingsPage />
  </div>
);

export default App;
