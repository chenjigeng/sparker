import React from 'react';
import {
  BrowserRouter,
  Route,
  Link
} from 'react-router-dom';
import { Doc } from '../views/Doc';
import { Home } from '../views/Home';

const Router = () => (
  <BrowserRouter>
    <div>
      <Route exact path='/' component={Home} />
      <Route path='/doc/:docId' component={Doc} />
    </div>
  </BrowserRouter>
);

export {
  Router
};
