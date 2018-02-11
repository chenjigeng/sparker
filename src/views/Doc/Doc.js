import React from 'react';
import { SparkerEditor } from '../../Component/SparkerEditor';

export class Doc extends React.Component {
  render () {
    console.log('docs');
    return (
      <div className="App">
        <SparkerEditor />
      </div>
    );
  }
}
