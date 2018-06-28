import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Card, message, Spin, Upload, Modal } from 'antd';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './MerchantsBasic.less';
import { getUser } from '../../utils/authority';

import { organLevel, organType } from '../../common/config/doctor';

const FormItem = Form.Item;

@connect(({ loading, merchantsBasic }) => ({
  merchantsBasic,
  loading: loading.models.merchantsBasic,
  submitting: loading.effects['merchantsBasic/setMerchantsBasic'],
}))
@Form.create()
export default class MerchantsBasic extends PureComponent {
  state = {
    detail: {},
    currentUser: getUser(),
    organLogoImg: [],
    fileList: [],
    previewImage: '',
    previewVisible: false,
    admin: {},
    pageStatus: 'detail',
  }

  componentDidMount = () => {
    this.props.dispatch({
      type: 'merchantsBasic/getDetail',
      payload: {
        restParams: {
          merchantId: this.state.currentUser.merchantId,
        },
      },
    }).then((response) => {
      const { code, data } = response;
      if (code !== 0) {
        return;
      }
      const fileList = data.organCertificates
        && data.organCertificates.length > 0
        && data.organCertificates.map((item, index) => {
          return {
            uid: -index,
            name: item,
            status: 'done',
            url: `http://static.pinwheelmedical.com/${item}`,
          };
        });
      this.setState({
        detail: data,
        organLogoImg: [{
          uid: -1,
          name: data.organLogo,
          status: 'done',
          url: `http://static.pinwheelmedical.com/${data.organLogo}`,
        }],
        fileList,
        admin: data.admin,
      });
    });
  }


  getOrgan = (id) => {
    if (!id) return '';
    const organItem = organType.find(item => item.id === id);
    if (!organItem) return '';
    return organItem.name;
  }

  getOrganLevel = (id) => {
    if (!id) return '';
    const organItem = organLevel.find(item => item.id === id);
    if (!organItem) return '';
    return organItem.name;
  }


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.state.pageStatus === 'detail') {
          this.setState({
            pageStatus: 'edit',
          });
          return;
        }
        this.props.dispatch({
          type: 'merchantsBasic/setMerchantsBasic',
          payload: {
            params: {
              data: {
                merchantPhone: values.merchantPhone,
                admin: {
                  userEmail: values.userEmail,
                  userMoblie: values.userMoblie,
                  userName: values.userName,
                },
              },
            },
            restParams: {
              merchantId: this.state.currentUser.merchantId,
            },
          },
        }).then((resp) => {
          if (resp.code !== 0) {
            message.error(resp.msg);
            return;
          }
          this.setState({
            pageStatus: 'detail',
          });
          message.success('保存成功');
        });
      }
    });
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleCancel = () => this.setState({ previewVisible: false })


  render() {
    const { submitting, loading } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { organLogoImg, fileList, previewVisible, previewImage } = this.state;
    const { detail, admin } = this.state;

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
      <PageHeaderLayout>
        <Card bordered={false}>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
          <Spin spinning={loading}>
            <Form
              onSubmit={this.handleSubmit}
              hideRequiredMark
              style={{ marginTop: 8 }}
              className={styles.formBox}
            >
              <h3>商户基本信息</h3>
              <FormItem {...formItemLayout} label="商户名称">
                <p>{detail.merchantName}</p>
              </FormItem>
              <FormItem {...formItemLayout} label="商户电话">
                {getFieldDecorator('merchantPhone', {
                  initialValue: detail.merchantPhone,
                  rules: [{ required: true, message: '请输入商户电话' }],
                })(
                  <Input disabled={this.state.pageStatus === 'detail'} placeholder="请输入" />
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="机构名称">
                <p>{detail.organName}</p>
              </FormItem>
              <FormItem {...formItemLayout} label="机构简称">
                <p>{detail.simpleName}</p>
              </FormItem>
              <FormItem {...formItemLayout} label="机构logo">
                <Upload
                  action="//jsonplaceholder.typicode.com/posts/"
                  listType="picture-card"
                  fileList={organLogoImg}
                  onPreview={this.handlePreview}
                />
              </FormItem>
              <FormItem {...formItemLayout} label="机构类型">
                <p>{this.getOrgan(detail.organType)}</p>
              </FormItem>
              <FormItem {...formItemLayout} label="机构（医院）级别">
                <p>{this.getOrganLevel(detail.organLevel)}</p>
              </FormItem>
              <FormItem {...formItemLayout} label="机构地址">
                <p>{detail.organAddress}</p>
              </FormItem>
              <FormItem {...formItemLayout} label="机构规模（人数）">
                <p>{detail.organSize}</p>
              </FormItem>
              <FormItem {...formItemLayout} label="机构证照">
                <Upload
                  action="//jsonplaceholder.typicode.com/posts/"
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={this.handlePreview}
                />
              </FormItem>
              <FormItem {...formItemLayout} label="机构负责人">
                <p>{detail.organOwnerName}</p>
              </FormItem>
              <FormItem {...formItemLayout} label="负责人证件号">
                <p>{detail.organOwnerPapers}</p>
              </FormItem>
              <FormItem {...formItemLayout} label="负责人手机/电话">
                <p>{detail.organOwnerPhone}</p>
              </FormItem>
              <FormItem {...formItemLayout} label="商户版本">
                <p>{detail.merchantVersion}</p>
              </FormItem>
              <FormItem {...formItemLayout} label="有效期">
                <p>{detail.expireTimePattern}</p>
              </FormItem>

              <h3>商户管理员信息</h3>
              <FormItem {...formItemLayout} label="管理员姓名">
                {getFieldDecorator('userName', {
                  initialValue: admin.userName,
                  rules: [{ required: true, message: '请输入管理员姓名' }],
                })(
                  <Input disabled={this.state.pageStatus === 'detail'} placeholder="请输入" />
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="管理员联系电话">
                {getFieldDecorator('userMoblie', {
                  initialValue: admin.userMoblie,
                  rules: [{ required: true, message: '请输入管理员联系电话' }],
                })(
                  <Input disabled={this.state.pageStatus === 'detail'} placeholder="请输入" />
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="管理员邮箱">
                {getFieldDecorator('userEmail', {
                  initialValue: admin.userEmail,
                  rules: [{ required: true, message: '请输入管理员邮箱', type: 'email' }],
                })(
                  <Input disabled={this.state.pageStatus === 'detail'} placeholder="请输入" />
                  )}
              </FormItem>

              <FormItem className={styles.btnCenter} {...submitFormLayout} style={{ marginTop: 32 }} wrapperCol={{ span: 12, offset: 6 }}>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  {this.state.pageStatus === 'detail' ? '编辑' : '保存'}
                </Button>
              </FormItem>
            </Form>
          </Spin>
        </Card>
      </PageHeaderLayout>
    );
  }
}
