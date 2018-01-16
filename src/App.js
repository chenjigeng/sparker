import React, { Component } from 'react';
// import './App.css';
import SparkerEditor from './SparkerEditor';


// const sparkSocket = io('localho?st:3001/hi');

class App extends Component {
  render() {
    return (
      <div className="App">
        <SparkerEditor />
      </div>
    );
  }
}

export default App;
