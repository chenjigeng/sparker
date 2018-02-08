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

  renderUnloginedNavbar = () => {
    return (
      <React.Fragment>
        <a href='#' onClick={this.toggleLoginDialog}>登录</a>
        <a href='#'>注册</a>
      </React.Fragment>
    );
  }

  renderLoginedNavbar = () => {
    const { userInfo } = this.props;

    return (
      <React.Fragment>
        <a href="#">登出</a>
        <a href="#">{userInfo.username}</a>
      </React.Fragment>
    );
  }

  render () {
    const { loginVisible, registVisible } = this.state;
    const { login, isLogin, isLoading, userInfo } = this.props;
    console.log('login', isLogin);
    return (
      <div>
        <Nav>
          <Nav.title>
            Sparker文档
          </Nav.title>
          <Nav.content className="spark-content">
            {
              isLogin === true ? this.renderLoginedNavbar() : this.renderUnloginedNavbar()
            }
          </Nav.content>
        </Nav>
        <LoginDialog 
          visible={loginVisible && !isLogin} 
          onCancel={this.toggleLoginDialog} 
          login={login}
          isLoading={isLoading}
        />
      </div>
    );
  }
}
