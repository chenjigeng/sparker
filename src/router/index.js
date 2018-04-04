import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import { Doc } from '../views/Doc';
import { Home } from '../views/Home';

const Router = () => (
  <div className="spark-router">
  <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/doc/:docId' component={Doc} />
  </Switch>
  </div>
);

export {
  Router
};
