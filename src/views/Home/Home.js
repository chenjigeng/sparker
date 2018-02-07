import React from 'react';
import { Navbar } from '../../Component';
import { connect } from 'react-redux';

@connect(
  (state) => { console.log(state); return state; },
  (dispatch) => { 
    return {
      onIncrementAsync: () => dispatch({ type: 'INCREMENT_ASYNC' })
    };
  }
)
export class Home extends React.Component {
  render () {
    return (
      <div>
        <Navbar />
      </div>
    );
  }
}
