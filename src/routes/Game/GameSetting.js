import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Menu,
  DatePicker,
  Modal,
  Divider,
  Popconfirm,
  InputNumber,
} from 'antd';
import StandardTable from '../../components/StandardTable/index';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './GameSetting.less';
import LogModal from '../../components/LogModal/index';
import moment from "moment/moment";


const FormItem = Form.Item;
const { TextArea } = Input
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const RangePicker = DatePicker.RangePicker;

const CreateForm = Form.create()(
  (props) => {
    const { modalVisible, form, handleAdd, handleModalVisible, editModalConfirmLoading, modalType, merchantLists, shopsLists, activityLists } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <Modal
        title={modalType ? '编辑游戏' : '新建游戏'}
        visible={modalVisible}
        onOk={handleAdd}
        onCancel={() => handleModalVisible()}
        confirmLoading={editModalConfirmLoading}
      >
        <Form onSubmit={this.handleSearch}>
          <FormItem {...formItemLayout} label="游戏名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入游戏名称' }],
            })(<Input placeholder="请输入游戏名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="选择商户">
            {getFieldDecorator('sellerId', {
              rules: [{ required: true, message: '请选择商户' }],
            })(
              <Select placeholder="请选择">
                {merchantLists.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>{item.merchantName}</Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="选择店铺">
            {getFieldDecorator('shopId', {
              rules: [{ required: true, message: '请选择店铺' }],
            })(
              <Select placeholder="请选择">
                {shopsLists.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>{item.shopName}</Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="选择活动">
            {getFieldDecorator('activityId', {
              rules: [{ required: true, message: '请选择活动' }],
            })(
              <Select placeholder="请选择">
                {activityLists.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>{item.name}</Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="游戏版本">
            {getFieldDecorator('version', {
              rules: [{ required: true, message: '请输入游戏版本' }],
            })(<Input placeholder="请输入游戏版本" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="点72版本">
            {getFieldDecorator('versionInno72', {
              rules: [{ required: true, message: '请输入点72版本' }],
            })(<Input placeholder="请输入点72版本" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="奖池所对应的ID">
            {getFieldDecorator('interactId', {
              rules: [{ required: true, message: '请输入商家设定的奖池所对应的ID' }],
            })(<Input placeholder="请输入商家设定的奖池所对应的ID" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="每天最大参与次数">
            {getFieldDecorator('maxParticipancePerDay', {
              rules: [{ required: true, message: '请输入每天最大参与次数(-1表示不限制数量)' }],
            })(<InputNumber placeholder="请输入每天最大参与次数(-1表示不限制数量)" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="最大参与次数">
            {getFieldDecorator('maxParticipanceTotal', {
              rules: [{ required: true, message: '请输入最大参与次数(-1表示不限制数量)' }],
            })(<InputNumber placeholder="请输入最大参与次数(-1表示不限制数量)" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="每天最大奖品数量">
            {getFieldDecorator('maxPrizePerDay', {
              rules: [{ required: true, message: '请输入每天最大奖品数量(-1表示不限制数量)' }],
            })(<InputNumber placeholder="请输入每天最大奖品数量(-1表示不限制数量)" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="最大奖品数量">
            {getFieldDecorator('maxPrizeTotal', {
              rules: [{ required: true, message: '请输入最大奖品数量(-1表示不限制数量)' }],
            })(<InputNumber placeholder="请输入最大奖品数量(-1表示不限制数量)" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="备注描述">
            {getFieldDecorator('remark', {
              rules: [{ required: true, message: '请输入备注描述' }],
            })(<TextArea placeholder="请输入备注描述" autosize={{ minRows: 2, maxRows: 6 }} />)}
          </FormItem>
        </Form>
      </Modal>
    );
});
@connect(({ common, loading, gameSetting, log }) => ({
  common,
  gameSetting,
  loading: loading.models.rule,
  log,
}))
@Form.create()
export default class gameSettingList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    editModalConfirmLoading: false,
    pageNo: 1,
    keyword: '',
    code: '',
    modalData: {},
    logModalVisible: false,
    logModalLoading: false,
    logId: '',
    logModalPageNo: 1,
    modalType: true,
    merchantLists: [],
    shopsLists: [],
    activityLists: [],
  };
  componentDidMount() {
    this.getLists();
  }
  // 获取列表
  getLists = () => {
    this.props.dispatch({
      type: 'gameSetting/getGameSettingList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          keyword: this.state.keyword,
          code: this.state.code,
        },
      },
    });
    this.props.dispatch({
      type: 'gameSetting/getMerchantsList',
      payload: {
        restParams: {},
      },
    }).then((res) => {
      this.setState({
        merchantLists: res,
      });
    });
    // shopsLists
    this.props.dispatch({
      type: 'gameSetting/getShopsList',
      payload: {
        restParams: {},
      },
    }).then((res) => {
      this.setState({
        shopsLists: res,
      });
    });
    // activityLists
    this.props.dispatch({
      type: 'gameSetting/getActivityList',
      payload: {
        restParams: {},
      },
    }).then((res) => {
      this.setState({
        activityLists: res,
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
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: '',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
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
        keyword: fieldsValue.keyword,
        code: fieldsValue.code ? fieldsValue.code : '',
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
      modalType: false,
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
        type: 'gameSetting/delGameSetting',
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
      modalType: true,
    });
    this.props.dispatch({
      type: 'gameSetting/getGameSettingDetail',
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
        ...data,
      });
    } else {
      this.form.setFieldsValue({
        name: undefined,
        sellerId: undefined,
        shopId: undefined,
        version: undefined,
        versionInno72: undefined,
        remark: undefined,
        interactId: undefined,
        maxParticipancePerDay: undefined,
        maxParticipanceTotal: undefined,
        maxPrizePerDay: undefined,
        maxPrizeTotal: undefined,
        activityId: undefined,
      });
    }
  }
  // 新增modal确认事件 开始
  saveFormRef = (form) => {
    this.form = form;
  }
  // 编辑modal 确认事件
  handleAdd = () => {
    this.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      let params = {
        ...fieldsValue,
      };
      this.setState({
        editModalConfirmLoading: true,
        modalData: {},
      });
      let url = 'gameSetting/saveGameSetting';
      if (this.state.modalData.id) {
        url = 'gameSetting/editGameSetting';
        params = { ...params, id: this.state.modalData.id };
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
    const { getFieldDecorator } = form;
    const { merchantLists } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          {/*<Col md={9} sm={24}>*/}
            {/*<FormItem label="选择商户">*/}
              {/*{getFieldDecorator('code')(*/}
                {/*<Select placeholder="请选择">*/}
                  {/*{merchantLists.map((item) => {*/}
                    {/*return (*/}
                      {/*<Option value={item.id} key={item.id}>{item.merchantName}</Option>*/}
                    {/*);*/}
                  {/*})}*/}
                {/*</Select>*/}
              {/*)}*/}
            {/*</FormItem>*/}
          {/*</Col>*/}
          <Col md={9} sm={24}>
            <FormItem label="关键字">
              {getFieldDecorator('keyword')(<Input placeholder="请输入游戏名称" />)}
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
    const { gameSetting: { list, page }, loading, log: { logList, logPage }, } = this.props;
    const { selectedRows, modalVisible, editModalConfirmLoading, modalType, merchantLists, shopsLists, activityLists } = this.state;
    const columns = [
      {
        title: '游戏名称',
        width: 150,
        dataIndex: 'name',
      },
      {
        title: '所属商户',
        width: 100,
        dataIndex: 'sellerId',
      },
      {
        title: '所属店铺',
        width: 100,
        dataIndex: 'shopId',
      },
      {
        title: '所属活动',
        width: 100,
        dataIndex: 'activityId',
      },
      {
        title: '版本',
        width: 100,
        dataIndex: 'version',
      },
      {
        title: '点72版本',
        width: 100,
        dataIndex: 'versionInno72',
      },
      {
        title: '奖池所对应的ID',
        width: 150,
        dataIndex: 'interactId',
      },
      {
        title: '每天最大参与次数',
        width: 150,
        dataIndex: 'maxParticipancePerDay',
      },
      {
        title: '最大参与次数',
        width: 150,
        dataIndex: 'maxParticipanceTotal',
      },
      {
        title: '每天最大奖品数量',
        width: 150,
        dataIndex: 'maxPrizePerDay',
      },
      {
        title: '最大奖品数量',
        width: 150,
        dataIndex: 'maxPrizeTotal',
      },
      {
        title: '备注描述',
        dataIndex: 'remark',
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
              scrollX={1700}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          ref={this.saveFormRef}
          modalVisible={modalVisible}
          editModalConfirmLoading={editModalConfirmLoading}
          modalType={modalType}
          merchantLists={merchantLists}
          shopsLists={shopsLists}
          activityLists={activityLists}
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
