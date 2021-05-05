import React, { useEffect, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import Dropdown from '../components/Dropdown';
import SkipButton from '../components/SkipButton';

const App: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [value, setValue] = useState<string>('op');

  useEffect(() => {
    (async () => {
      const { userId: id } = await browser.storage.sync.get(['userId']);
      setUserId(id);
    })();
  }, []);

  return (
    <div className="w-96 h-96" style={{ fontSize: '16px' }}>
      The user id is: {userId}
      <Dropdown
        value={value}
        onChange={setValue}
        options={[
          { value: 'op', label: 'Opening' },
          { value: 'ed', label: 'Ending' },
          {
            value: 'asdf',
            label: 'this text is very long',
          },
        ]}
      />
      <SkipButton>Skip Opening</SkipButton>
    </div>
  );
};

export default App;
