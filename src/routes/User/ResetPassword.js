import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Button, message } from 'antd';
import styles from './Register.less';

const FormItem = Form.Item;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/resetPassword'],
}))
@Form.create()
export default class ResetPassword extends Component {
  state = {}

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'login/resetPassword',
          payload: {
            ...values,
          },
        }).then(((resp) => {
          if (resp.code === 0) {
            const { getFieldValue } = this.props.form;
            this.props.dispatch(routerRedux.push(`/user/reset-password-result/${getFieldValue('name')}`));
          } else {
            message.error(`重置失败：${resp.msg}`);
          }
        }));
      }
    });
  }

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.main}>
        <h3 className={styles.center}>申请重置密码</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '用户名不能为空！',
                },
              ],
            })(<Input size="large" placeholder="请输入用户名" />)}
          </FormItem>
          <FormItem className={styles.center}>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              确认重置
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
