import React from 'react';
import { Nav } from '../../SparkComponent';
import { LRDialog } from '../Dialog';
import './Navbar.less';
import { connect } from 'react-redux';
import { actions } from '../../redux/saga';

@connect(
  (state) => {
    return state.commonInfo;
  },
  (dispatch) => {
    return {
      login: (username, password) => dispatch(actions.requestLogin(username, password)),
      logout: () => dispatch(actions.requestLogout()),
      regist: (username, password) => dispatch(actions.requestRegist(username, password)),
      checkLogin: () => dispatch(actions.requestCheckLogin()),
    };
  }
)
export class Navbar extends React.Component {

  state = {
    lrVisible: false,
    registVisible: false,
    activeTabKey: 'login',
  };

  componentDidMount() {
    this.props.checkLogin();
  }

  closeLRDialog = () => {
    this.setState({
      lrVisible: !this.state.lrVisible,
    });
  }

  toggleLoginDialog = () => {
    this.setState({
      lrVisible: !this.state.lrVisible,
      activeTabKey: 'login',
    });
  }

  toggleRegistDialog = () => {
    this.setState({
      lrVisible: !this.state.lrVisible,
      activeTabKey: 'regist',
    });
  }

  changeActiveTabkey = (activeTabKey) => {
    this.setState({
      activeTabKey,
    });
  }

  renderUnloginedNavbar = () => {
    return (
      <React.Fragment>
        <a href='#' onClick={this.toggleLoginDialog}>登录</a>
        <a href='#' onClick={this.toggleRegistDialog}>注册</a>
      </React.Fragment>
    );
  }

  renderLoginedNavbar = () => {
    const { userInfo } = this.props;

    return (
      <React.Fragment>
        <a href="#" onClick={this.props.logout}>登出</a>
        <a href="#">{userInfo.username}</a>
      </React.Fragment>
    );
  }

  render () {
    const { lrVisible, registVisible, activeTabKey } = this.state;
    const { login, regist, isLogin, isLoading, userInfo } = this.props;
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
        <LRDialog 
          changeActiveTabkey={this.changeActiveTabkey}
          activeTabKey={activeTabKey}
          visible={lrVisible && !isLogin} 
          onCancel={this.closeLRDialog} 
          login={login}
          regist={regist}
          isLoading={isLoading}
        />
      </div>
    );
  }
}
