import React from 'react';
import PropTypes from 'prop-types';
import './Button.less';

export class Button extends React.Component {

  static propTypes = {
    type: PropTypes.string,
    onClick: PropTypes.func,
  };

  render () {

    const { children, type, onClick } = this.props;

    return (
      <button className="spark-button" type={type} onClick={onClick}>
        { children }
      </button>
    );
  }
}
