import React, { Component } from 'react';
import { Button } from 'antd';
import { Link } from 'dva/router';
import Result from '../../components/Result';
import styles from './RegisterResult.less';

export default class ResetPasswordResult extends Component {
  render() {
    const { match: { params: { account } } } = this.props;
    const title = (<div className={styles.title}>账号&nbsp;{account}&nbsp;密码重置成功</div>);
    const action = (
      <div className={styles.actions}>
        <Link to="/"><Button size="large" type="primary">进入首页</Button></Link>
      </div>
    );
    return (
      <Result
        className={styles.registerResult}
        type="success"
        title={title}
        description="重置密码链接已经发送至账号邮箱中，有效期24小时，请及时登录邮箱进行密码重置操作。"
        actions={action}
        style={{ marginTop: 56 }}
      />
    );
  }
}
