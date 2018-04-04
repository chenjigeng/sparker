import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, Button, message, Tabs } from '../../../SparkComponent';
// import './LRDialog.less';
import { LoginContent } from './LoginContent';
import { RegistContent } from './RegistContent';

if (process.env.BUILD_TARGET !== 'server') {
  require('./LRDialog.less');
}

export class LRDialog extends React.Component {

  state = {
    loginUsername: '',
    loginPassword: '',
    registUsername: '',
    registPassword: '',
    confirmRegistPassword: '',
  };

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    regist: PropTypes.func.isRequired,
    activeTabKey: PropTypes.any.isRequired,
    changeActiveTabkey: PropTypes.func.isRequired,
  };

  handleLoginOrRegist = () => {
    const { loginUsername, loginPassword, registPassword, registUsername, confirmRegistPassword } = this.state;
    const { activeTabKey } = this.props;
    if (activeTabKey === 'login') {
      this.props.login(loginUsername, loginPassword);
    } else {
      if (registPassword !== confirmRegistPassword) {
        message.error('两次填写的密码不一致');
        return;
      }
      this.props.regist(registUsername, registPassword);
    }
  }

  handleCheckoutRegist = (e) => {
    e.preventDefault();
    this.props.changeActiveTabkey('regist');
  }

  handleCheckoutActiveTabType = (type) => {
    this.props.changeActiveTabkey(type);
  }

  handleFormDataChange = (key, value) => {
    this.setState({
      [key]: value,
    });
  }

  render () {
    const { visible, onCancel, activeTabKey } = this.props;
    const text = activeTabKey === 'login' ? '登录' : '注册';
    return (
      <Dialog
        className="login-dialog"
        visible={visible}
        title="Sparker文档"
        onCancel={onCancel}
        >
          <Dialog.Body>
            <Tabs 
              activeKey={activeTabKey}
              onChange={this.handleCheckoutActiveTabType}
            >
              <Tabs.TabPane tab="登录" key="login">
                <LoginContent
                  handleCheckoutRegist={this.handleCheckoutRegist}
                  handleFormDataChange={this.handleFormDataChange}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="注册" key="regist">
                <RegistContent
                  handleCheckoutRegist={this.handleCheckoutRegist}
                  handleFormDataChange={this.handleFormDataChange}
                />
              </Tabs.TabPane>              
            </Tabs>
          </Dialog.Body>
          <Dialog.Footer>
            <Button type="primary" onClick={this.handleLoginOrRegist}>{text}</Button>
          </Dialog.Footer>
        </Dialog>
    );
  }
  
}


