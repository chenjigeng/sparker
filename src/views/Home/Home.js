import React from 'react';
import { connect } from 'react-redux';
import { Navbar } from '../../Component';
// import './Home.less';
import { DocList } from './DocList';
if (process.env.BUILD_TARGET !== 'server') {
  require('./Home.less');
}

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
    const { homeInfo: { docs }, commonInfo, history } = this.props;
    return (
      <div className="home-body">
        <Navbar history={history}/>
        <DocList docs={docs} commonInfo={commonInfo} history={history}/>
      </div>
    );
  }
}
