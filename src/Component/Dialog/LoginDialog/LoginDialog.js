import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, Input } from '../../../SparkComponent';
import './LoginDialog.less';

export class LoginDialog extends React.Component {

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  render () {
    const { visible, onCancel } = this.props;

    return (
      <Dialog
        className="login-dialog"
        visible={visible}
        title="登录"
        onCancel={onCancel}
        >
          <Dialog.Body>
            <div className="login-dialog-body">
              <Input placeholder='账号' />
              <Input placeholder="密码" type="password"/>
            </div>
          </Dialog.Body>
          <Dialog.Footer>
            <div>测试Footer</div>
          </Dialog.Footer>
        </Dialog>
    );
  }
  
}


