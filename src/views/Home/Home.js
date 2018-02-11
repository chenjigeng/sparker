import React from 'react';
import { connect } from 'react-redux';
import { Navbar } from '../../Component';
import './Home.less';
import { DocList } from './DocList';

@connect(
  (state) => state,
  (dispatch) => { 
    return {
      onIncrementAsync: () => dispatch({ type: 'INCREMENT_ASYNC' })
    };
  }
)
export class Home extends React.Component {

  render () {
    console.log(this.props);
    const { homeInfo: { docs }, commonInfo } = this.props;
    return (
      <div className="home-body">
        <Navbar />
        <DocList docs={docs} commonInfo={commonInfo}/>
      </div>
    );
  }
}
