import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Table,
  Button,
  Tabs,
  message,
  Row,
  Col,
  Card,
  Input,
  Modal,
  InputNumber
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './VersionSetting.less'
import {getAccountMenus} from "../../utils/authority";
import {InnoMsg, RegexTool} from "../../utils/utils"
import {Tab} from "../../components/Login";

const FormItem = Form.Item;
const { TextArea } = Input
const TabPane = Tabs.TabPane;
const tabNameLists = [
  {key: 1, name: '72App'},
  {key: 2, name: '72数据中心'},
  {key: 3, name: '72监控App'},
  {key: 4, name: '72安装器'},
  {key: 5, name: '管理App'},
  {key: 6, name: '蓝牙接收器'},
  {key: 7, name: '72上传'},
  {key: 8, name: '72守护'},
  {key: 9, name: '壶中界'},
  {key: 10, name:'新版壶中界'}
  ]
// const tabNames = [ '72App', '72数据中心', '72监控App', '72安装器', '管理App', '蓝牙接收器', '72上传', '72守护', '壶中界', '新版壶中界']
const testX = /^\d+\.\d+\.\d+$/
// const testX = /(\d+\.){2}\d+/
const CreateForm = Form.create()(
  (props) => {
    const {
      modalVisible, form, handleAdd, handleModalVisible,
      editModalConfirmLoading, TabPaneKey, modalData, next, addOrConfirm
    } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    return (
      <Modal
        title={
          <div class="modalBox">
            <span class="leftSpan"></span>
            <span class="modalTitle">新建版本</span>
          </div>
        }
        visible={modalVisible}
        // onOk={handleAdd}
        onCancel={() => handleModalVisible(false)}
        // confirmLoading={editModalConfirmLoading}
        width={800}
        footer={[
          <Button
            key="cancel"
            onClick={() => handleModalVisible(false)}
            style={{ margin: "0 10 0 0", }}
          >
            取消
          </Button>,
          <Button
            key="prevent"
            onClick={() => next(true)}
            style={{ margin: "0 10 0 0", display: addOrConfirm ? 'none' : '' }}
          >
            上一步
          </Button>,
          <Button
            key="next"
            type="primary"
            loading={editModalConfirmLoading}
            onClick={() => next(false)}
            style={{ margin: "0 10 0 0", display: addOrConfirm ? '' : 'none' }}
          >
            下一步
          </Button>,
          <Button
            key="ok"
            type="primary"
            loading={editModalConfirmLoading}
            onClick={() => handleAdd()}
            style={{ margin: "0 10 0 0", display: addOrConfirm ? 'none' : '' }}
          >
            确定
          </Button>
        ]}
      >
        <div className="manageAppBox">
          <Form>
            <div style={{ display: addOrConfirm ? '' : 'none'}}>
              <FormItem {...formItemLayout} label="App名称">
                <span>{TabPaneKey.appName}</span>
              </FormItem>
              <FormItem {...formItemLayout} label="版本">
                {getFieldDecorator('appVersion', {
                  rules: [{ required: true, whitespace: true, message: '请填写版本' },
                    {
                      validator(rule, value, callback) {
                        if (value) {
                          if (!testX.test(value)) {
                            callback('请填写正确的版本');
                          }
                        }
                        callback();
                      },
                    }],
                })(<Input placeholder="请填写版本，格式为x.x.x，例如1.0.0" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="版本号">
                {getFieldDecorator('appVersionCode', {
                  rules: [{ required: true, message: '请填写版本号' },],
                })(<InputNumber placeholder="请填写版本号" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="升级路径">
                {getFieldDecorator('downloadUrl', {
                  rules: [{ required: true, whitespace: true, message: '请填写升级路径' }],
                })(<Input placeholder="请填写升级路径" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="更新内容">
                {getFieldDecorator('updateInfo', {
                  rules: [{ required: true, whitespace: true, message: '请填写更新内容' }],
                })(<TextArea placeholder="请输入更新内容描述" autosize={{ minRows: 2, maxRows: 6 }} />)}
              </FormItem>
            </div>
            <div style={{ display: addOrConfirm ? 'none' : ''}}>
              <FormItem {...formItemLayout} label="App名称">
                <span>{TabPaneKey.appName}</span>
              </FormItem>
              <FormItem {...formItemLayout} label="版本">
                {modalData.appVersion}
              </FormItem>
              <FormItem {...formItemLayout} label="版本号">
                {modalData.appVersionCode}
              </FormItem>
              <FormItem {...formItemLayout} label="升级路径">
                {modalData.downloadUrl}
              </FormItem>
              <FormItem {...formItemLayout} label="更新内容">
                {modalData.updateInfo}
              </FormItem>
            </div>
          </Form>
        </div>
      </Modal>
    );
  });
@connect(({ common, loading, versionSetting }) => ({
  common,
  versionSetting,
  loading: loading.models.versionSetting,
}))
@Form.create()
export default class versionSetting extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    pageNo: 1,
    keyword: '',
    account: {},
    TabPaneKey: {},
    modalVisible: false,
    editModalConfirmLoading: false,
    modalType: {},
    modalData: {},
    addOrConfirm: true,
    tabNames: []
  };
  componentDidMount() {
    // this.getAccountMenus(getAccountMenus())
    this.getAppList()
  }
  getAccountMenus = (setAccountMenusList) => {
    let account = setAccountMenusList.filter((item) => item.path === 'check')
    var obj = {}
    if (account[0]) {
      account = account[0].children.filter((item) => item.path === 'fault')
      if (account[0].children) {
        account[0].children.forEach((item, e) => {
          obj[item.path] = true;
        })
        this.setState({
          account: obj
        })
      }
    }
  }
  getAppList = () => {
    this.props.dispatch({
      type: 'versionSetting/appList',
      payload: {
        restParams: {
        },
      },
    }).then((res) => {
      if (res && res.code === 0) {
        this.setState({
          tabNames: res.data,
          TabPaneKey: res.data[0]
        }, () => {
          this.getLists()
        })
      }
    });
  }
  // 获取列表
  getLists = () => {
    this.props.dispatch({
      type: 'versionSetting/getAppVersionList',
      payload: {
        restParams: {
          appPackageName: this.state.TabPaneKey.appPackageName,
          keyword: this.state.keyword
        },
      },
    });
  }
  // 重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      pageNo: 1,
      keyword: '',
    });
  };

  callback = (key) => {
    const { tabNames } = this.state
    this.setState({
      TabPaneKey: tabNames.filter(i => i.appPackageName === key)[0]
    }, () => {
      this.getLists()
    })
  }
  saveFormRef = (form) => {
    this.form = form;
  }
  // 添加modal 添加事件
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
      modalData: {},
      modalType: true,
      addOrConfirm: true
    }, () => {
      this.setModalData();
    });
  };
  // 设置modal 数据
  setModalData = (data) => {
    if (data) {
      this.form.setFieldsValue({
        appVersion: data.appVersion,
        appVersionCode: data.appVersionCode,
        downloadUrl: data.downloadUrl,
        updateInfo: data.updateInfo,
      });
    } else {
      // this.goodsHandleAdd()
      this.form.setFieldsValue({
        appVersion: undefined,
        appVersionCode: undefined,
        downloadUrl: undefined,
        updateInfo: undefined,
      });
    }
  }
  handleAdd = (flag, flag2) => {
    const { TabPaneKey } = this.state
    this.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      this.setState({
        addOrConfirm: flag2
      })
      let params = {
        ...fieldsValue,
        appPackageName: TabPaneKey.appPackageName,
        appName: TabPaneKey.appName
      };
      console.log('fieldsValue', fieldsValue)
      if (parseInt(flag) === 1) {
        this.setState({
          modalData: {
            appVersion: fieldsValue.appVersion,
            appVersionCode: fieldsValue.appVersionCode,
            downloadUrl: fieldsValue.downloadUrl,
            updateInfo: fieldsValue.updateInfo,
          }
        })
      } else {
        this.setState({
          editModalConfirmLoading: true,
        });
        let url = 'versionSetting/saveVersion';
        this.props.dispatch({
          type: url,
          payload: {
            params,
          },
        }).then((resp) => {
          if (resp && resp.code === 0) {
            this.getLists();
          } else {
            this.setState({
              editModalConfirmLoading: false,
            });
            return;
          }
          this.setState({
            editModalConfirmLoading: false,
            modalVisible: false,
          });
        });
      }
    })
  }
  next = (flag) => {
    if (!flag) {
      this.handleAdd(1, flag)
    } else {
      this.setState({
        addOrConfirm: flag
      })
    }
  }
  // 搜索
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        keyword: fieldsValue.keyword ? fieldsValue.keyword : '',
      }, () => {
        this.getLists();
      });
    });
  };
  // 新增modal确认事件 结束
  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={9} sm={24}>
            <FormItem>
              {getFieldDecorator('keyword')(<Input placeholder="请输入版本号、版本、更新内容搜索" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <span>
               <FormItem>
                  <Button onClick={this.handleFormReset}>
                    重置
                  </Button>
                  <Button className={styles.serach} style={{ marginLeft: 8 }} type="primary" htmlType="submit">
                    查询
                  </Button>
               </FormItem>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  render() {
    const {
      versionSetting: { list },
      loading,
    } = this.props;
    const { account, TabPaneKey, tabNames } = this.state
    const columns = [
      {
        title: 'App名称',
        dataIndex: 'appName',
        width: '10%',
      },
      {
        title: '版本',
        width: '10%',
        dataIndex: 'appVersion',
      },
      {
        title: '版本号',
        dataIndex: 'appVersionCode',
        width: '10%',
      },
      {
        title: '升级路径',
        dataIndex: 'downloadUrl',
        width: '30%',
      },
      {
        title: '更新内容',
        width: '20%',
        dataIndex: 'updateInfo',
      },
      {
        title: '创建人',
        dataIndex: 'createUser',
        width: '10%',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: '10%',
      },
    ];
    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
          <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
        </Card>
        <Card bordered={false}>
          <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)} style={{ 'marginBottom': '10px' }}>
            新增
          </Button>
          <Tabs onChange={this.callback} type="card" defaultActiveKey={TabPaneKey.appPackageName}>
            {tabNames.map((item) => {
              return (
                <TabPane key={item.appPackageName} tab={item.appName}></TabPane>
              );
            })}
          </Tabs>
          <div className={styles.tableList}>
            <Table
              loading={loading}
              rowKey={record => record.id}
              dataSource={list}
              columns={columns}
              pagination={false}
              onChange={this.handleTableChange}
              scroll={{ x: scrollX ? scrollX : 1050, y: scrollY ? scrollY : (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 34)}}
            />
          </div>
        </Card>
        <CreateForm
          ref={this.saveFormRef}
          modalVisible={this.state.modalVisible}
          handleAdd={this.handleAdd}
          handleModalVisible={this.handleModalVisible}
          editModalConfirmLoading={this.state.editModalConfirmLoading}
          modalType={this.state.modalType}
          TabPaneKey={this.state.TabPaneKey}
          modalData={this.state.modalData}
          next={this.next}
          addOrConfirm={this.state.addOrConfirm}
        />
      </PageHeaderLayout>
    );
  }
}
