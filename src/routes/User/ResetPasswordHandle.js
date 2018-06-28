import { Component } from 'react';
import { connect } from 'dva';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import { getQueryDatas } from '../../utils/location';
import { setSessionData } from '../../utils/utils';

@connect(({ login }) => ({
  login,
}))
export default class ResetPassword extends Component {
  componentDidMount() {
    const { dispatch, location: { search } } = this.props;
    const { key, token } = getQueryDatas(search);
    if (key && token) {
      setSessionData('RESETUSER', { key, token });
      dispatch(routerRedux.push('/user/do-reset-password'));
    } else {
      notification.error({
        message: '该链接已失效',
        description: '重置密码链接已失效，请重试或联系管理员',
      });
      dispatch(routerRedux.push('/user/login'));
    }
  }
  render() {
    return null;
  }
}
