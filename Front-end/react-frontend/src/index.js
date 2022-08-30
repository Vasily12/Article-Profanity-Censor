import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import storage from './storage';
import App from './App';
import "./index.css";
import * as serviceWorker from "./serviceWorker";


ReactDOM.render(
  <Provider store={storage}>
    <App />
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
