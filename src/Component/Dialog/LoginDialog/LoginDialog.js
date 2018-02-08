import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, Input, Button, message, Tabs } from '../../../SparkComponent';
import './LoginDialog.less';
import { myFetch } from '../../../utils';

export class LoginDialog extends React.Component {

  state = {
    username: '',
    password: '',
  };

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
  };

  handleLogin = () => {
    const { username, password } = this.state;
    this.props.login(username, password);    
  }

  render () {
    const { visible, onCancel } = this.props;

    return (
      <Dialog
        className="login-dialog"
        visible={visible}
        title="Sparker文档"
        onCancel={onCancel}
        >
          <Dialog.Body>
            <Tabs defaultActiveKey="122">
              <Tabs.TabPane tab="asd" key="12">asdasd</Tabs.TabPane>
              <Tabs.TabPane tab="asd" key="122">asdasd</Tabs.TabPane>              
            </Tabs>
            <div className="login-dialog-body">
              <Input 
                placeholder='账号' 
                onChange={(e) => this.setState({ username: e.target.value })
              }/>
              <Input 
                placeholder="密码" 
                type="password"
                onChange={(e) => this.setState({ password: e.target.value })}
              />
            </div>
          </Dialog.Body>
          <Dialog.Footer>
            <Button type="primary" onClick={this.handleLogin}>登录</Button>
          </Dialog.Footer>
        </Dialog>
    );
  }
  
}


