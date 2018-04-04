import React from 'react';
import PropTypes from 'prop-types';
// import './checkBox.less';
if (process.env.BUILD_TARGET !== 'server') {
  require('./checkBox.less');
}

export class CheckBox extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    attributes: PropTypes.any,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
  };

  render () {
    const { className, attributes, checked, onChange, children } = this.props;

    return (
      <div 
        className={`spark-checkbox-wrapper ${className ? className : ''} ${checked ? 'checked': ''}`}
        {...attributes}
      >
        <span className="spark-checkbox">
          <input
            className="checkbox"
            type="checkbox"
            checked={checked}
            onChange={onChange}
          />
          <span className="spark-checkbox-inner">
            { checked && <i className="fa fa-check" aria-hidden="true" /> }
          </span>
        </span>
        <span>
          { children }
        </span>
      </div>
    );
  }

}
