import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, Upload, Modal, message, Spin, Row, Col
} from 'antd';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading }) => ({
  // submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
export default class MerchantsManageForms extends PureComponent {
  state = {
    logoPreviewVisible: false,
    logoPreviewImage: '',
    organLogoImg: [{
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }],
    previewVisible: false,
    previewImage: '',
    fileList: [{
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }],
  }

  // logo上传
  logoHandleCancel = () => this.setState({ logoPreviewVisible: false })
  logoHandlePreview = (file) => {
    this.setState({
      logoPreviewImage: file.url || file.thumbUrl,
      logoPreviewVisible: true,
    });
  }
  logoHandleChange = ({ fileList }) => this.setState({ organLogoImg: fileList })

  // 机构证照上传
  handleCancel = () => this.setState({ previewVisible: false })
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  handleChange = ({ fileList }) => this.setState({ fileList })

  // 检查logo是否上传
  checkLogo = (rule, value, callback) => {
    if(this.state.organLogoImg.length == 0){
      callback('请上传机构logo');
    }else {
      callback();
    }
  }


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let organCertificates = this.state.fileList.map( (item) => {
            return item.url
        })

        const data = {
          merchantName: values.merchantName || '',
          merchantPhone: values.merchantPhone || '',
          merchantStatus: values.merchantStatus || '',
          merchantVersion: values.merchantVersion || '',
          organName: values.organName || '',
          simpleName: values.simpleName || '',
          organLogo: this.state.organLogoImg[0].url,
          organType: values.organType || '',
          organLevel: values.organLevel || '',
          organAddress: values.organAddress || '',
          organSize: values.organSize || '',
          organOwnerName: values.organOwnerName || '',
          organOwnerPhone: values.organOwnerPhone || '',
          organOwnerPapers: values.organOwnerPapers || '',
          expireTime: values.expireTime.format('YYYY-MM-DD') || '',
          remark: values.remark || '',
          organCertificates,
          adminVO: {
            userName: values.userName || '',
            userMoblie: values.userMoblie || '',
            userEmail: values.userEmail || '',
            password: values.password || '',
          }
        }

        this.props.submitForms(data);

        // this.props.dispatch({
        //     type: 'merchants/create',
        //     payload: {
        //       json: JSON.stringify(obj)
        //     },
        //   }
        // ).then((data) => {
        // })
      }
    });
  }

  componentWillReceiveProps = (nextProps) => {
    const {
      merchantName,
      merchantPhone,
      merchantStatus,
      merchantVersion,
      organName,
      simpleName,
      organLogoImg,
      organType,
      organLevel,
      organAddress,
      organSize,
      organOwnerName,
      organOwnerPhone,
      organOwnerPapers,
      expireTime,
      remark,
      fileList,
      userName,
      userMoblie,
      userEmail,
      test
    } = nextProps;

    if(merchantName == '' || merchantName == undefined){
      return;
    }

      this.setState({
        merchantName: merchantName,
        merchantPhone: merchantPhone,
        merchantStatus: merchantStatus,
        merchantVersion: merchantVersion,
        organName: organName,
        simpleName: simpleName,
        organLogoImg: organLogoImg,
        organType: organType,
        organLevel: organLevel,
        organAddress: organAddress,
        organSize: organSize,
        organOwnerName: organOwnerName,
        organOwnerPhone: organOwnerPhone,
        organOwnerPapers: organOwnerPapers,
        expireTime: expireTime,
        remark: remark,
        fileList: fileList,
        userName: userName,
        userMoblie: userMoblie,
        userEmail: userEmail,
        password: '',
      })
  }


  render() {
    const { submitting } = this.props;

    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { logoPreviewVisible, logoPreviewImage, organLogoImg } = this.state;
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

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
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <h3>商户基本信息</h3>
            <FormItem {...formItemLayout} label="商户名称">
              {getFieldDecorator('merchantName', {
                initialValue: this.state.merchantName,
                rules: [{required: true, message: '请输入商户名称',}],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="商户电话">
              {getFieldDecorator('merchantPhone', {
                initialValue: this.state.merchantPhone,
                rules: [{required: true, message: '请输入商户电话'}],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="机构名称">
              {getFieldDecorator('organName', {
                initialValue: this.state.organName,
                rules: [{required: true, message: '请输入机构名称',}],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="机构简称">
              {getFieldDecorator('simpleName', {
                initialValue: this.state.simpleName,
                rules: [{required: true, message: '请输入机构简称',}],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="机构logo">
              {getFieldDecorator('organLogoImg', {
                rules: [{required: true, message: '请上传机构logo', validator: this.checkLogo}],
              })(
                <div>
                  <Upload
                    action="//jsonplaceholder.typicode.com/posts/"
                    listType="picture-card"
                    fileList={organLogoImg}
                    onPreview={this.logoHandlePreview}
                    onChange={this.logoHandleChange}
                  >
                    {organLogoImg.length >= 1 ? null : uploadButton}
                  </Upload>
                  <Modal visible={logoPreviewVisible} footer={null} onCancel={this.logoHandleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={logoPreviewImage} />
                  </Modal>
                </div>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="机构类型">
              {getFieldDecorator('organType',{
                initialValue: this.state.organType,
              })(
                <Select style={{ width: 240 }} placeholder="请选择">
                  <Option value="公立医院">公立医院</Option>
                  <Option value="私立医院">私立医院</Option>
                  <Option value="其他">其他</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="机构（医院）级别">
              {getFieldDecorator('organLevel',{
                initialValue: this.state.organLevel,
              })(
                <Select style={{ width: 240 }} placeholder="请选择">
                  <Option value="一甲">一甲</Option>
                  <Option value="二甲">二甲</Option>
                  <Option value="三甲">三甲</Option>
                  <Option value="一乙">一乙</Option>
                  <Option value="二乙">二乙</Option>
                  <Option value="三乙">三乙</Option>
                  <Option value="一丙">一丙</Option>
                  <Option value="二丙">二丙</Option>
                  <Option value="三丙">三丙</Option>
                  <Option value="其他">其他</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="机构地址">
              {getFieldDecorator('organAddress', {
                initialValue: this.state.organAddress,
                rules: [{required: true, message: '请输入机构地址',}],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="机构规模（人数）">
              {getFieldDecorator('organSize', {
                initialValue: this.state.organSize,
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="机构证照">
              {getFieldDecorator('fileList')(
                <div>
                  <Upload
                    action="//jsonplaceholder.typicode.com/posts/"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                  >
                    {fileList.length >= 5 ? null : uploadButton}
                  </Upload>
                  <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </div>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="机构负责人">
              {getFieldDecorator('organOwnerName', {
                initialValue: this.state.organOwnerName,
                rules: [{required: true, message: '请输入机构负责人',}],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="负责人证件号">
              {getFieldDecorator('organOwnerPapers',{
                initialValue: this.state.organOwnerPapers,
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="负责人手机/电话">
              {getFieldDecorator('organOwnerPhone', {
                initialValue: this.state.organOwnerPhone,
                rules: [{required: true, message: '请输入负责人手机/电话'}],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="商户版本">
              {getFieldDecorator('merchantVersion', {
                initialValue: this.state.merchantVersion,
                rules: [{required: true, message: '请输入商户版本'}],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="有效期">
              {getFieldDecorator('expireTime', {
                initialValue: moment(this.state.expireTime, 'YYYY-MM-DD'),
                rules: [{required: true, message: '请选择有效期'}],
              })(
                <DatePicker />
              )}
            </FormItem>

            <h3>商户管理员信息</h3>
            <FormItem {...formItemLayout} label="管理员姓名">
              {getFieldDecorator('userName', {
                initialValue: this.state.userName,
                rules: [{required: true, message: '请输入管理员姓名'}],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="管理员联系电话">
              {getFieldDecorator('userMoblie', {
                initialValue: this.state.userMoblie,
                rules: [{required: true, message: '请输入管理员联系电话'}],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="管理员邮箱">
              {getFieldDecorator('userEmail', {
                initialValue: this.state.userEmail,
                rules: [{required: true, message: '请输入管理员邮箱', type: 'email'}],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="初始密码">
              {getFieldDecorator('password', {
                rules: [{required: true, message: '请输入初始密码'}],
              })(
                <Input placeholder="请输入" type="password" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator('remark',{
                initialValue: this.state.remark,
              })(
                <TextArea style={{ minHeight: 32 }} placeholder="请输入" rows={4} />
              )}
            </FormItem>

            <FormItem className={styles.btnCenter}  {...submitFormLayout} style={{ marginTop: 32 }} wrapperCol={{ span: 12, offset: 6 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
