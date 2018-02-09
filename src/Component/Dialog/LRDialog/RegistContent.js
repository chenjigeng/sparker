import React from 'react';
import PropTypes from 'prop-types';
import { Input } from '../../../SparkComponent/';

export class RegistContent extends React.Component {

  static propTypes = {
    handleCheckoutRegist: PropTypes.func.isRequired,
    handleFormDataChange: PropTypes.func.isRequired,
  };

  render () {

    const { handleCheckoutRegist, handleFormDataChange } = this.props;
    
    return (
      <div className="regist-dialog-body">
        <Input 
          placeholder='账号' 
          onChange={(e) => handleFormDataChange('registUsername', e.target.value)}
        />
        <Input 
          placeholder="密码" 
          type="password"
          onChange={(e) => handleFormDataChange('registPassword', e.target.value)}
        />
      </div>
    );
  }
}