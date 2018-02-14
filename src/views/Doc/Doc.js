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
    const { history } = this.props;
    return (
      <div className="App">
        <Navbar history={history}/>
        <SparkerEditor {...this.props}/>
      </div>
    );
  }
}
