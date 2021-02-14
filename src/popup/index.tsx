import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const root = document.getElementById('opening-skipper-root');

if (root) {
  root.attachShadow({ mode: 'open' });

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    root.shadowRoot
  );
}
