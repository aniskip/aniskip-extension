import React, { useEffect, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';

const App: React.FC = () => {
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    (async () => {
      const { userId: id } = await browser.storage.sync.get(['userId']);
      setUserId(id);
    })();
  }, []);

  return <div>The user id is: {userId}</div>;
};

export default App;
