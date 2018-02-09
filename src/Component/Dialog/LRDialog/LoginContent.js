import React from 'react';
import PropTypes from 'prop-types';
import { Input } from '../../../SparkComponent/';

export class LoginContent extends React.Component {

  static propTypes = {
    handleCheckoutRegist: PropTypes.func.isRequired,
    handleFormDataChange: PropTypes.func.isRequired,
  };

  render () {

    const { handleCheckoutRegist, handleFormDataChange } = this.props;
    
    return (
      <div className="login-dialog-body">
        <Input 
          placeholder='账号' 
          onChange={(e) => handleFormDataChange('loginUsername', e.target.value)}
        />
        <Input 
          placeholder="密码" 
          type="password"
          onChange={(e) => handleFormDataChange('loginPassword', e.target.value)}
        />
        <div className="friendly-tips">
          没有账号? 
          <a href="#" onClick={handleCheckoutRegist}>注册</a>
        </div>
      </div>
    );
  }
}