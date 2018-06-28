import React from 'react';
import { Button } from 'antd';
import { Link } from 'dva/router';
import Result from '../../components/Result';
import styles from './RegisterResult.less';

const title = <div className={styles.title}>密码重置成功</div>;

const actions = (
  <div className={styles.actions}>
    <Link to="/"><Button size="large" type="primary">进入首页</Button></Link>
  </div>
);

export default () => (
  <Result
    className={styles.registerResult}
    type="success"
    title={title}
    description="您已成功重置密码，点击进入首页登录系统。"
    actions={actions}
    style={{ marginTop: 56 }}
  />
);
