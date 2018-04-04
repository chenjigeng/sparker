import React from 'react';
import { Router } from './router';
import './App.css';
import './Common/fontawesome.css';
import 'whatwg-fetch';

if (process.env.BUILD_TARGET !== 'server') {
  require('./index.less');
  require('./Common/common.less');
  require('./prism.less');
}


const App = () => (
    <Router />
);

export default App;
