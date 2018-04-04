import React from 'react';
import PropTypes from 'prop-types';
// import './Input.less';

if (process.env.BUILD_TARGET !== 'server') {
  require('./Input.less');
}

export class Input extends React.Component {

  static propTypes = {
    placeholder: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    defaultValue: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func,
    onPressEnter: PropTypes.func,
  };

  render () {
    const { placeholder, disabled, onChange, type } = this.props;

    return (
      <input 
        className="spark-input"
        placeholder={placeholder} 
        disabled={disabled} 
        onChange={onChange} 
        type={type}
      />
    );
  }
}
