import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import registerServiceWorker from './registerServiceWorker';
require('dotenv').config();
ReactDOM.render(
    <App />
    ,document.getElementById('root')
  );
registerServiceWorker();
