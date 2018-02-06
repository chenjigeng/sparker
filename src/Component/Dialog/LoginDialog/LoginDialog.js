import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, Input, Button } from '../../../SparkComponent';
import './LoginDialog.less';

export class LoginDialog extends React.Component {

  state = {
    username: '',
    password: '',
  };

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  handleLogin = () => {
    console.log('login');
    const { username, password } = this.state;
    const data = new FormData();
    data.append('username', username);
    data.append('password', password);
    fetch('/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    }).then(res => res.json())
      .then(res => {
        if (res.code === 200) {
          //登录成功
        }
        console.log(res);
      });
      // .then((res) => {
      //   console.log(res);
      // });
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


