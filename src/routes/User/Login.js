import React, { Component } from 'react';
// import DDLogin from 'DDLogin';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert } from 'antd';
import Login from '../../components/Login';
import environment from '../../environments/environment';
import styles from './Login.less';
import { getUrlParams } from '../../utils/location';

const { appId, frontHost } = environment;

const { Tab, UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    loginType: 9,
    autoLogin: true,
  }

  componentDidMount = () => {
    this.ddLogin();

    const urlParams = getUrlParams();
    if (urlParams.code) {
      this.loginHandle(urlParams.code);
    }
  }

  onTabChange = (type) => {
    this.setState({ type });
  }

  ddLogin = () => {
    const gotoUrl = encodeURIComponent(`https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${appId}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${frontHost}`);
    DDLogin({
      id: 'login_container',
      goto: gotoUrl,
      style: '',
      href: '',
      width: '300px',
      height: '300px',
    });

    const hanndleMessage = (event) => {
      const loginTmpCode = event.data; // 拿到loginTmpCode后就可以在这里构造跳转链接进行跳转了
      // const origin = event.origin;
      const redirectUri = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${appId}&response_type=code&scope=snsapi_login&state=ERP_QR_LOGIN&redirect_uri=${frontHost}&loginTmpCode=${loginTmpCode}`;
      window.location.href = redirectUri;
    };

    if (typeof window.addEventListener !== 'undefined') {
      window.addEventListener('message', hanndleMessage, false);
    } else if (typeof window.attachEvent !== 'undefined') {
      window.attachEvent('onmessage', hanndleMessage);
    }
  }

  loginHandle = (code) => {
    this.props.dispatch({
      type: 'login/ddlogin',
      payload: {
        code,
        loginType: this.state.loginType,
        type: this.state.type,
        state: 'ERP_QR_LOGIN',
      },
    });
  }

  handleSubmit = (err, values) => {
    const { type, loginType } = this.state;
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          loginType,
          type,
          ...values,
        },
      });
    }
  }

  changeAutoLogin = (e) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  }

  renderMessage = (content) => {
    return (
      <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
    );
  }

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        {/* <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
        >
          <Tab key="account" tab="用户名登录">
            {
              login.status !== 0 &&
              login.type === 'account' &&
              !login.submitting &&
              this.renderMessage(login.message || '用户名或密码错误')
            }
            <UserName name="name" placeholder="请输入用户名admin" />
            <Password name="password" placeholder="请输入密码admin" />
          </Tab>
          <Tab key="mobile" tab="手机号登录">
            {
              login.status === 'error' &&
              login.type === 'mobile' &&
              !login.submitting &&
              this.renderMessage('验证码错误')
            }
          </Tab>
          <div>
            <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>自动登录</Checkbox>
            <Link className={styles.register} to="/user/reset-password" style={{ float: 'right' }}>忘记密码</Link>
          </div>
          <Submit loading={submitting}>登录</Submit>
        </Login> */}

        <div id="login_container" />
      </div>
    );
  }
}
