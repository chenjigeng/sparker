import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { SparkerEditor } from './Component/SparkerEditor';
import { Router } from './router';
import store from './redux';

console.log(store.getState());

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    );
  }
}

export default App;
