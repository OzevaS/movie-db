import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './components/logic/app';

import './index.css';

const divRoot = document.getElementById('root') as HTMLElement;

const root = ReactDOM.createRoot(divRoot);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
