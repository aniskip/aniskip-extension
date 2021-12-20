import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { App } from './App';
import { configuredStore } from './data';
import 'tailwindcss/tailwind.css';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={configuredStore}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('aniskip-root')
);
