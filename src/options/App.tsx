import React from 'react';
import Navbar from './components/Navbar';
import SettingsPage from './SettingsPage';

const App: React.FC = () => (
  <div className="min-w-[400px] min-h-[450px]">
    <Navbar />
    <div className="font-sans mx-auto max-w-screen-md sm:px-4 py-10">
      <SettingsPage />
    </div>
  </div>
);

export default App;
