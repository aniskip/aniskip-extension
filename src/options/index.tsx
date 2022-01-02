import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { App } from './App';
import { configureStore } from '../data';
import 'tailwindcss/tailwind.css';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={configureStore('aniskip-settings')}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('aniskip-root')
);
