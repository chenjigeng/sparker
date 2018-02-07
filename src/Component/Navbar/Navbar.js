import React from 'react';
import { Nav } from '../../SparkComponent';
import { LoginDialog } from '../Dialog';
import './Navbar.less';
import { connect } from 'react-redux';
import { actions } from '../../redux/saga';

@connect(
  (state) => {
    console.log(state);
    return state.commonInfo;
  },
  (dispatch) => {
    return {
      login: (username, password) => dispatch(actions.requestLogin(username, password)),
      regist: (username, password) => dispatch(actions.requestRegist(username, password)),
    };
  }
)
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
    console.log(this.props);
    const { loginVisible, registVisible } = this.state;
    const { login, isLogin, isLoading, userInfo } = this.props;

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
        <LoginDialog 
          visible={loginVisible} 
          onCancel={this.toggleLoginDialog} 
          login={login}
          isLoading={isLoading}
        />
      </div>
    );
  }
}
