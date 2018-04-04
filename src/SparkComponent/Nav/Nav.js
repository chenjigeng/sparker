import React from 'react';
// import './Nav.less';
if (process.env.BUILD_TARGET !== 'server') {
  require('./Nav.less');
}

export class Nav extends React.Component {

  render () {
    return (
      <div className='spark-nav'>
        { this.props.children }
      </div>
    );
  }
}

Nav.title = (props) => (
  <div className="spark-nav__title">
    { props.children }
  </div>
);

Nav.content = (props) => (
  <div className={`spark-nav__content ${props.className}`}>
    { props.children }
  </div>
);
