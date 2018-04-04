import App from './App';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import React from 'react';
import { hydrate } from 'react-dom';
import store from './redux';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';


hydrate(
  <BrowserRouter>  
    <Provider store={store}>
      <App />
   </Provider>
  </BrowserRouter>
  ,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}

registerServiceWorker();
