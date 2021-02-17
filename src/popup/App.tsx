import React, { useEffect, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import Dropdown from '../components/Dropdown';

const App: React.FC = () => {
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    (async () => {
      const { userId: id } = await browser.storage.sync.get(['userId']);
      setUserId(id);
    })();
  }, []);

  return (
    <div className="w-96 h-96">
      The user id is: {userId}
      <Dropdown
        value="op"
        onChange={() => {}}
        options={[
          { value: 'op', label: 'Opening' },
          { value: 'ed', label: 'Ending' },
        ]}
      />
    </div>
  );
};

export default App;
