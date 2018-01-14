import React, { Component } from 'react';
// import './App.css';
import Markdown from './Markdown';


// const sparkSocket = io('localho?st:3001/hi');

class App extends Component {
  render() {
    return (
      <div className="App">
        <Markdown />
      </div>
    );
  }
}

export default App;
