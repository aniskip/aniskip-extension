import React from 'react';
import classnames from 'classnames';
import SettingsPage from './SettingsPage';

const App: React.FC = () => (
  <div className={classnames('font-sans', 'max-w-xl', 'mx-auto', 'px-4')}>
    <SettingsPage />
  </div>
);

export default App;
