import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button, Modal, message, Spin } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './WechatRelation.less';
const FormItem = Form.Item;
const { Option } = Select;

@connect(({ wechatRelation, loading }) => ({
  wechatRelation,
  loading: loading.models.wechatRelation,
  submitting: loading.effects['wechatRelation/put'],
}))
@Form.create()
export default class WechatRelation extends PureComponent {
  state = {
    data: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'wechatRelation/fetch',
      payload: {
        restParams: {
          merchantId: JSON.parse(sessionStorage.getItem('userInfo')).merchantId,
        },
      },
    }).then((data) => {
      this.setState({
        data: data.data,
      });
    });
  }


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'wechatRelation/put',
          payload: {
            params: {
              data: values,
            },
            restParams: {
              merchantId: JSON.parse(sessionStorage.getItem('userInfo')).merchantId,
              wechatId: this.state.data.id,
            },
          },
        }).then(() => {
          message.success('保存成功');
        });
      }
    });
  };


  render() {
    const { loading, submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { data } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderLayout >
        <Card bordered={false}>
          <Spin spinning={loading}>
            <Form onSubmit={this.handleSubmit} className={styles.wechatRelation}>
              <FormItem {...formItemLayout} label="机构名称">
                <p className="p">{data.merchantName}</p>
              </FormItem>
              <FormItem {...formItemLayout} label="开发者ID(AppID)">
                {getFieldDecorator('appId', {
                  initialValue: data.appId,
                  rules: [{ required: true, message: '请输入开发者ID(AppID)' }],
                })(
                  <Input placeholder="请输入" />
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="商户Id">
                {getFieldDecorator('mchId', {
                  initialValue: data.mchId,
                  rules: [{ required: true, message: '请输入商户Id' }],
                })(
                  <Input placeholder="请输入" />
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="商户私钥(secret)">
                {getFieldDecorator('secret', {
                  initialValue: data.secret,
                  rules: [{ required: true, message: '商户私钥(secret)' }],
                })(
                  <Input placeholder="请输入" />
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="certKey">
                {getFieldDecorator('certKey', {
                  initialValue: data.certKey,
                  rules: [{ required: true, message: '请输入certKey' }],
                })(
                  <Input placeholder="请输入" />
                  )}
              </FormItem>
              <FormItem className={styles.btnCenter} {...submitFormLayout} style={{ marginTop: 32 }} wrapperCol={{ span: 12, offset: 6 }}>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  保存
                </Button>
              </FormItem>
            </Form>
          </Spin>
        </Card>
      </PageHeaderLayout>
    );
  }
}
