import React, { useEffect, useState } from 'react';

const App: React.FC = () => {
  const [userId, setUserId] = useState('');

  useEffect(() => {
    chrome.storage.sync.get(['userId'], (result) => setUserId(result.userId));
  }, []);

  return <div>The user id is: {userId}</div>;
};

export default App;
