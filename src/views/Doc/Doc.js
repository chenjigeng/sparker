import React from 'react';
import { connect } from 'react-redux';
import { SparkerEditor } from '../../Component/SparkerEditor';
import { Navbar } from '../../Component/Navbar';

@connect(
  (state) => state,
  (dispatch) => { 
    return {
      onIncrementAsync: () => dispatch({ type: 'INCREMENT_ASYNC' })
    };
  }
)
export class Doc extends React.Component {
  render () {
    console.log('docs');
    console.log(this.props);
    return (
      <div className="App">
        <Navbar />
        <SparkerEditor {...this.props}/>
      </div>
    );
  }
}
