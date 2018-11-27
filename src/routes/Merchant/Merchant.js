import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Cascader,
  Popconfirm,
  Radio,
} from 'antd';
import StandardTable from '../../components/StandardTable/index';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Merchant.less';
import {getAccountMenus} from "../../utils/authority";
import {RegexTool} from "../../utils/utils";

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['processing', 'default', 'success', 'error'];
const status = ['运行中', '关闭', '已上线', '异常'];
const merchantList = ['汽车行业', '快销品行业', '美妆行业', '母婴行业', '酒品行业']

const CreateForm = Form.create()(
  (props) => {
    const { modalVisible, form, handleAdd, handleModalVisible, editModalConfirmLoading, modalType, BaseDictLists } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
    };
    return (
      <Modal
        title={
          <div class="modalBox">
            <span class="leftSpan"></span>
            <span class="modalTitle">{!modalType ? '编辑商户' : '新建商户'}</span>
          </div>
        }
        visible={modalVisible}
        onOk={handleAdd}
        onCancel={() => handleModalVisible()}
        confirmLoading={editModalConfirmLoading}
      >
        <div className="manageAppBox">
          <Form onSubmit={this.handleSearch}>
            <FormItem {...formItemLayout} label="商户名称">
              {getFieldDecorator('merchantName', {
                rules: [{ required: true, whitespace: true, message: '请输入商户名称' }],
              })(<Input placeholder="请输入商户名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="商户行业">
              {getFieldDecorator('industryCode', {
                rules: [{ required: true, whitespace: true, message: '请选择商户行业' }],
              })(
                <Select placeholder="请选择">
                  {BaseDictLists.map((item) => {
                    return (
                      <Option value={item.code} key={item.code}>{item.name}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="允许登录商户平台">
              {getFieldDecorator('loginStatus', {
                rules: [{ required: true, message: '请选择允许登录商户平台' }],
                initialValue: '0',
              })(
                <RadioGroup>
                  <Radio value="0">不允许</Radio>
                  <Radio value="1">允许</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="商户账号">
              {getFieldDecorator('loginName', {
                rules: [{ required: true, whitespace: true, message: '请输入商户账号' }],
              })(<Input placeholder="请输入商户账号" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="手机号码">
              {getFieldDecorator('phone', {
                validateFirst: true,
                rules: [
                  { type: 'string', required: true, message: '请输入手机号' },
                  {
                    validator(rule, value, callback) {
                      if (!(RegexTool.mobile.test(value))) {
                        callback('请输入正确的手机号');
                      }
                      callback();
                    },
                  }],
              })(<Input placeholder="请输入手机号码" />)}
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  });
@connect(({ common, loading, merchant }) => ({
  common,
  merchant,
  loading: loading.models.merchant,
}))
@Form.create()
export default class merchant extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    editModalConfirmLoading: false,
    pageNo: 1,
    keyword: '',
    channelId: '',
    modalData: {},
    logModalVisible: false,
    logModalLoading: false,
    logId: '',
    logModalPageNo: 1,
    modalType: true,
    channelLists: [],

    account: {},
    BaseDictLists: [],
  };
  componentDidMount() {
    this.getLists();
    this.getBaseDictLists();
    // this.getAccountMenus(getAccountMenus())
  }
  getAccountMenus = (setAccountMenusList) => {
    if (setAccountMenusList) {
      const pointSettingMenu = setAccountMenusList.filter((item) => item.path === 'project')[0]
        .children.filter((item) => item.path === 'merchant')
      var obj = {}
      if (pointSettingMenu[0].children) {
        pointSettingMenu[0].children.forEach((item, e) => {
          obj[item.path] = true;
        })
        this.setState({
          account: obj
        })
      }
    }
  }
  // 获取列表
  getLists = () => {
    this.props.dispatch({
      type: 'merchant/getMerchantList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          keyword: this.state.keyword,
          code: this.state.channelId,
        },
      },
    });
  }
  getBaseDictLists = () => {
    this.props.dispatch({
      type: 'merchant/getBaseDict',
      payload: {
        params: {
          type: '001',
        },
      },
    }).then((res) => {
      if (res && res.code === 0) {
        this.setState({
          BaseDictLists: res.data.industry,
        });
      }
    });
  }
  resetPwd = (item) => {
    this.props.dispatch({
      type: 'merchant/resetPwd',
      payload: {
        params: {
          id: item.id,
        },
      },
    }).then((res) => {
      if (res && res.code === 0) {
        message.success('重置成功')
      }
    })
  }
  // 分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    const { current } = pagination;
    // console.log('params', params)
    this.setState({
      pageNo: current,
    }, () => {
      this.getLists();
    });
  };
  // 重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      pageNo: 1,
      keyword: '',
      channelId: '',
    });
  };


  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };
  // 搜索
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        pageNo: 1,
        keyword: fieldsValue.keyword ? fieldsValue.keyword : '',
        channelId: fieldsValue.channelId ? fieldsValue.channelId : '',
      }, () => {
        this.getLists();
      });
    });
  };
  // 添加modal 添加事件
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
      modalData: {},
      modalType: true,
    });
    this.setModalData();
  };
  // 删除modal 删除事件
  handleDelClick = (item) => {
    this.setState({
      editModalConfirmLoading: true,
    });
    if (item) {
      const params = { id: item.id, status: item.loginStatus === '1' ? 0 : 1 };
      this.props.dispatch({
        type: 'merchant/alterStatus',
        payload: {
          params,
        },
      }).then((res) => {
        // message.success('Click on Yes');
        if (res && res.code === 0) {
          message.success(`${item.loginStatus === '0' ? '启用' : '停用'}成功`)
        }
        this.getLists();
        this.setState({
          editModalConfirmLoading: false,
        });
      });
    } else return false;
  }
  // 编辑modal 编辑事件
  handleEditClick = (item) => {
    this.setState({
      modalVisible: true,
      modalData: item,
      modalType: false,
    });
    this.props.dispatch({
      type: 'merchant/getMerchantDetail',
      payload: {
        restParams: {
          id: item.id,
        },
      },
    }).then((res) => {
      this.setModalData(res);
    });
  }
  // 设置modal 数据
  setModalData = (data) => {
    if (data) {
      this.form.setFieldsValue({
        industryCode: data.industryCode || undefined,
        merchantName: data.merchantName || undefined,
        loginStatus: data.loginStatus || undefined,
        loginName: data.loginName || undefined,
        phone: data.phone || undefined,
      });
    } else {
      this.form.setFieldsValue({
        industryCode: undefined,
        merchantName: undefined,
        loginStatus: undefined,
        loginName: undefined,
        phone: undefined,
      });
    }
  }
  // 新增modal确认事件 开始
  saveFormRef = (form) => {
    this.form = form;
  }
  // 编辑modal 确认事件
  handleAdd = () => {
    const { BaseDictLists } = this.state
    this.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        editModalConfirmLoading: true,
      });
      let url = 'merchant/saveMerchant';
      let params = {
        ...values,
        industry: BaseDictLists.filter(i => i.code === values.industryCode)[0].name
      };
      if (this.state.modalData.id) {
        params = {
          ...params,
          id: this.state.modalData.id };
      }
      this.props.dispatch({
        type: url,
        payload: {
          params,
        },
      }).then((res) => {
        if (res && res.code === 0) {
          this.getLists();
          this.setState({
            modalData: {},
            modalVisible: false,
          });
        }
        this.setState({
          editModalConfirmLoading: false,
        });
      });
    });
  }
  // 新增modal确认事件 结束
  renderAdvancedForm() {
    const { form } = this.props;
    const { channelLists } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={9} sm={24}>
            <FormItem>
              {getFieldDecorator('keyword')(<Input placeholder="请输入商户ID、商户名称、商户账号、手机号码" />)}
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
      merchant: { list, page, unColumn },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, editModalConfirmLoading, modalType, channelLists, account } = this.state;
    let columns = [
      {
        title: '商户ID',
        width: '17%',
        dataIndex: 'merchantId',
        key: 'merchantId'
      },
      {
        title: '商户名称',
        width: '12%',
        dataIndex: 'merchantName',
        key: 'merchantName'
      },
      {
        title: '商户行业',
        width: '17%',
        dataIndex: 'industry',
        key: 'industry'
      },
      {
        title: '商户平台登录账号',
        width: '17%',
        dataIndex: 'loginName',
        key: 'loginName'
      },
      {
        title: '商户手机号码',
        dataIndex: 'phone',
        key: 'phone'
      },
      {
        fixed: 'right',
        width: 150,
        title: '操作',
        render: (text, item) => (
          <Fragment>
            <a onClick={() => this.handleEditClick(item)}>编辑</a>
            <Divider type="vertical" />
            {/*<a onClick={() => this.handleLogClick(item)}>日志</a>*/}
            {/*<Divider type="vertical" />*/}
            {/*<Popconfirm title="确定要停用吗" onConfirm={() => this.handleDelClick(item)} okText="Yes" cancelText="No">*/}
              <a className={styles.delete} onClick={() => this.handleDelClick(item)}>{parseInt(item.loginStatus) === 0 ? '启用账号' : '停用账号'}</a>
            {/*</Popconfirm>*/}
            <Divider type="vertical" />
            <a onClick={() => this.resetPwd(item)}>重置密码</a>
          </Fragment>
        ),
      },
    ];
    if (unColumn) {
      let leg = columns.length
      for (let i = leg - 1; i >= 0; i--) {
        for (let j = 0; j < unColumn.length; j++) {
          if (columns[i]) {
            if (columns[i].key === unColumn[j]) {
              columns.splice(i, 1)
              continue;
            }
          }
        }
      }
    }
    const width = 90/(columns.length - 1)
    for (let i = 0; i < columns.length; i++) {
      if (i < columns.length - 2) {
        columns[i].width = width + '%'
      }
      if (i === columns.length - 2) {
        columns[i].width = ''
      }
    }
    // this.state.options = this.props.common.list
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
          <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
            </div>
            <div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={list}
                page={page}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                scrollX={1000}
              />
            </div>
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          ref={this.saveFormRef}
          modalVisible={modalVisible}
          editModalConfirmLoading={editModalConfirmLoading}
          modalType={modalType}
          channelLists={channelLists}
          BaseDictLists={this.state.BaseDictLists}
        />
      </PageHeaderLayout>
    );
  }
}
