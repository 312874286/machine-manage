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
  Popconfirm
} from 'antd';
import StandardTable from '../../components/StandardTable/index';
import styles from './PunchingRecord.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import LogModal from '../../components/LogModal/index';


const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['processing', 'default', 'success', 'error'];
const status = ['运行中', '关闭', '已上线', '异常'];

const CreateForm = Form.create()(
  (props) => {
    const { modalVisible, form, handleAdd, handleModalVisible, editModalConfirmLoading, modalType, channelLists } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <Modal
        title={!modalType ? '编辑商户' : '新建商户'}
        visible={modalVisible}
        onOk={handleAdd}
        onCancel={() => handleModalVisible()}
        confirmLoading={editModalConfirmLoading}
      >
        <Form onSubmit={this.handleSearch}>
          <FormItem {...formItemLayout} label="商户编码">
            {getFieldDecorator('merchantCode', {
              rules: [{ required: true, whitespace: true, message: '请输入商户编码' }],
            })(<Input placeholder="请输入商户编码" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="商户名称">
            {getFieldDecorator('merchantName', {
              rules: [{ required: true, whitespace: true, message: '请输入商户名称' }],
            })(<Input placeholder="请输入商户名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="品牌名称">
            {getFieldDecorator('originFlag', {
              rules: [{ required: true, whitespace: true, message: '请输入品牌名称' }],
            })(<Input placeholder="请输入品牌名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="原始标示">
            {getFieldDecorator('brandName', {
              rules: [{ required: true, whitespace: true, message: '请输入原始标示' }],
            })(<Input placeholder="请输入原始标示" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="选择渠道">
            {getFieldDecorator('channelId', {
              rules: [{ required: true, whitespace: true, message: '请选择渠道' }],
            })(
              <Select placeholder="请选择">
                {channelLists.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>{item.channelName}</Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  });
@connect(({ common, loading, punchingRecord, log }) => ({
  common,
  punchingRecord,
  loading: loading.models.rule,
  log,
}))
@Form.create()
export default class punchingRecord extends PureComponent {
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
  };
  componentDidMount() {
    // this.getLists();
  }
  // 获取列表
  getLists = () => {
    this.props.dispatch({
      type: 'punchingRecord/getMerchantSettingList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          keyword: this.state.keyword,
          code: this.state.channelId,
        },
      },
    });
    this.props.dispatch({
      type: 'punchingRecord/getChannelsList',
      payload: {
        restParams: {},
      },
    }).then((res) => {
      // const arr = { id: -1, channelName: '请选择' }
      // res.unshift(arr)
      this.setState({
        channelLists: res,
      });
    });
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
  // 批量
  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: '',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
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
      const params = { id: item.id };
      this.props.dispatch({
        type: 'punchingRecord/delMerchantSetting',
        payload: {
          params,
        },
      }).then(() => {
        // message.success('Click on Yes');
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
      type: 'punchingRecord/getMerchantSettingDetail',
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
        merchantCode: data.merchantCode || undefined,
        merchantName: data.merchantName || undefined,
        brandName: data.brandName || undefined,
        originFlag: data.originFlag || undefined,
        channelId: data.channelId || undefined,
      });
    } else {
      this.form.setFieldsValue({
        merchantCode: undefined,
        merchantName: undefined,
        brandName: undefined,
        originFlag: undefined,
        channelId: undefined,
      });
    }
  }
  // 新增modal确认事件 开始
  saveFormRef = (form) => {
    this.form = form;
  }
  // 编辑modal 确认事件
  handleAdd = () => {
    this.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        editModalConfirmLoading: true,
        modalData: {},
      });
      let url = 'punchingRecord/saveMerchantSetting';
      let params = { ...values };
      if (this.state.modalData.id) {
        url = 'punchingRecord/editMerchantSetting';
        params = { ...values, id: this.state.modalData.id };
      }
      this.props.dispatch({
        type: url,
        payload: {
          params,
        },
      }).then(() => {
        this.getLists();
        this.setState({
          editModalConfirmLoading: false,
          modalVisible: false,
        });
      });
    });
  }
  // 新增modal确认事件 结束
  // 日志相关
  getLogList = () => {
    this.props.dispatch({
      type: 'log/getLogList',
      payload: {
        restParams: {
          code: this.state.logId,
          pageNo: this.state.logModalPageNo,
          type: 1020403,
        },
      },
    }).then(() => {
      this.setState({
        logModalLoading: false,
      });
    });
  }

  handleLogClick = (data) => {
    this.setState({
      logModalVisible: !!data,
      logModalLoading: true,
      logId: data.id,
    }, () => {
      this.getLogList();
    });
  }

  logModalHandleCancel = () => {
    this.setState({
      logModalVisible: false,
    });
  }

  logModalhandleTableChange = (pagination) => {
    const { current } = pagination;
    this.setState({
      logModalPageNo: current,
    }, () => {
      this.getLogList();
    });
  }
  renderAdvancedForm() {
    const { form } = this.props;
    const { channelLists } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={9} sm={24}>
            <FormItem label="选择渠道">
              {getFieldDecorator('channelId')(
                <Select placeholder="请选择">
                  {channelLists.map((item) => {
                    return (
                      <Option value={item.id} key={item.id}>{item.channelName}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={9} sm={24}>
            <FormItem label="关键字">
              {getFieldDecorator('keyword')(<Input placeholder="请输入商户编码、商户名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span style={{ float: 'right' }}>
               <FormItem>
                  <Button onClick={this.handleFormReset}>
                    重置
                  </Button>
                  <Button className={styles.serach} style={{ marginLeft: 8, background: 'rgba(245, 75, 48, 1)' }} type="primary" htmlType="submit">
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
      punchingRecord: { list, page },
      loading,
      log: { logList, logPage },
    } = this.props;
    const { selectedRows, modalVisible, editModalConfirmLoading, modalType, channelLists } = this.state;
    const columns = [
      // {
      //   title: '商户ID',
      //   width: 200,
      //   dataIndex: 'id',
      //   fixed: 'left',
      // },
      {
        title: '商户编码',
        // width: 150,
        dataIndex: 'merchantCode',
      },
      {
        title: '商户名称',
        // width: 150,
        dataIndex: 'merchantName',
      },
      {
        title: '所属渠道',
        // width: 150,
        dataIndex: 'channelId',
      },
      {
        title: '原始标示',
        // width: 150,
        dataIndex: 'brandName',
      },
      {
        title: '品牌名称',
        dataIndex: 'originFlag',
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
            <Popconfirm title="确定要删除吗" onConfirm={() => this.handleDelClick(item)} okText="Yes" cancelText="No">
              <a className={styles.delete}>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
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
              {/*{selectedRows.length > 0 && (*/}
              {/*<span>*/}
              {/*<Button>批量操作</Button>*/}
              {/*<Dropdown overlay={menu}>*/}
              {/*<Button>*/}
              {/*更多操作 <Icon type="down" />*/}
              {/*</Button>*/}
              {/*</Dropdown>*/}
              {/*</span>*/}
              {/*)}*/}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={list}
              page={page}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              scrollX={700}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          ref={this.saveFormRef}
          modalVisible={modalVisible}
          editModalConfirmLoading={editModalConfirmLoading}
          modalType={modalType}
          channelLists={channelLists}
        />
        <LogModal
          data={logList}
          page={logPage}
          loding={this.state.logModalLoading}
          logVisible={this.state.logModalVisible}
          logHandleCancel={this.logModalHandleCancel}
          logModalhandleTableChange={this.logModalhandleTableChange}
        />
      </PageHeaderLayout>
    );
  }
}
