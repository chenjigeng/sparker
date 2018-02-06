import React from 'react';
import { Nav } from '../../SparkComponent';
import { LoginDialog } from '../Dialog';
import './Navbar.less';

export class Navbar extends React.Component {

  state = {
    loginVisible: false,
    registVisible: false,
  };

  toggleLoginDialog = () => {
    this.setState({
      loginVisible: !this.state.loginVisible
    });
  }

  render () {

    const { loginVisible, registVisible } = this.state;

    return (
      <div>
        <Nav>
          <Nav.title>
            Sparker文档
          </Nav.title>
          <Nav.content className="spark-content">
            <a href='#' onClick={this.toggleLoginDialog}>登录</a>
            <a href='#'>注册</a>
          </Nav.content>
        </Nav>
        <LoginDialog visible={loginVisible} onCancel={this.toggleLoginDialog} />
      </div>
    );
  }
}
