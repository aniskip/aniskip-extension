import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from './App';
import { configureStore } from '../data';
import 'tailwindcss/tailwind.css';

const container = document.getElementById('aniskip-root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Provider store={configureStore('aniskip-settings')}>
      <App />
    </Provider>
  </React.StrictMode>
);
