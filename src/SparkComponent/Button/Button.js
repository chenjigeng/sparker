import React from 'react';
import PropTypes from 'prop-types';
import './Button.less';

export class Button extends React.Component {

  static propTypes = {
    type: PropTypes.string,
  }

  render () {

    const { children, type } = this.props;

    return (
      <button className="spark-button" type={type}>
        { children }
      </button>
    );
  }
}
