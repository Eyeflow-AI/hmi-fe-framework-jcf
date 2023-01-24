import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import StoreWrapper from './store/Wrapper';
import reportWebVitals from './reportWebVitals';
import metadata from './metadata.json';

import {prepare as prepareLocale} from './locale';
import './reset.css';

console.log("App metadatada", metadata);
prepareLocale(metadata.locale);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <StoreWrapper>
    <App />
  </StoreWrapper>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
