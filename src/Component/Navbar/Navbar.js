import React from 'react';
import { Nav } from '../../SparkComponent';
import { LRDialog } from '../Dialog';
// import './Navbar.less';
import { connect } from 'react-redux';
import { actions } from '../../redux/saga';

if (process.env.BUILD_TARGET !== 'server') {
  require('./Navbar.less');
}

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
    lrVisible: true,
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
    console.log('login dialog');
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

  handleGoToHome = () => {
    const { history } = this.props;
    history.push('/');
  }

  render () {
    const { lrVisible, activeTabKey } = this.state;
    const { login, regist, isLogin, isLoading, isFetching } = this.props;
    return (
      <div>
        <Nav>
          <Nav.title>
            <span onClick={this.handleGoToHome}>Sparker文档</span>
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
          visible={!(isFetching || isLogin) && lrVisible} 
          onCancel={this.closeLRDialog} 
          login={login}
          regist={regist}
          isLoading={isLoading}
        />
      </div>
    );
  }
}
