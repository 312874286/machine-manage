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
  Badge,
  Spin,
  Radio,
} from 'antd';
import StandardTable from '../../components/StandardTable/index';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ActivitySetting.less';
import LogModal from '../../components/LogModal/index';
import moment from "moment/moment";

// const status = ['全部','未开始', '进行中', '已结束'];
const ActivityStatus = [{ id: 0, name: '全部' }, { id: 1, name: '未开始' }, { id: 2, name: '进行中' }, { id: 3, name: '已结束' }, { id: 4, name: '未排期' }];

// const statusMap = [100100, 100200, 100300];
// const prizeTypeStatus = ['商品', '优惠券', '商品+优惠券'];

const statusMap = ['processing', 'default', 'success', 'error'];
const status = {'100100': '商品', '100200': '优惠券','100300': '商品+优惠券'};

const FormItem = Form.Item;
const { TextArea } = Input
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;

const CreateForm = Form.create()(
  (props) => {
    const { modalVisible, form, handleAdd, handleModalVisible, editModalConfirmLoading, modalType, merchantLists, shopsLists, onSelect } = props;
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
        title={modalType === 'edit' ? '编辑活动' : (modalType === 'add' ? '新建活动' : '查看活动')}
        visible={modalVisible}
        onOk={handleAdd}
        onCancel={() => handleModalVisible()}
        confirmLoading={editModalConfirmLoading}
      >
        <Form onSubmit={this.handleSearch}>
          <FormItem {...formItemLayout} label="是否是默认活动">
            {getFieldDecorator('isDefault', {
              initialValue: '0',
            })(
              <RadioGroup disabled>
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="活动名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, whitespace: true, message: '请输入活动名称' }],
            })(<Input placeholder="请输入活动名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="选择商户">
            {getFieldDecorator('sellerId', {
              rules: [{ required: true, message: '请选择商户' }],
            })((modalType === 'edit') ? (
              <Select placeholder="请选择" disabled>
                {merchantLists.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>{item.merchantName}</Option>
                  );
                })}
              </Select>
              ) : (
                <Select placeholder="请选择" onSelect={onSelect}>
                {merchantLists.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>{item.merchantName}</Option>
                  );
                })}
                </Select>
            ))}
          </FormItem>
          <FormItem {...formItemLayout} label="选择店铺">
            {getFieldDecorator('shopId', {
              rules: [{ required: true, message: '请选择店铺' }],
            })((modalType === 'edit') ? (
                <Select placeholder="请选择" disabled>
                  {shopsLists.map((item) => {
                    return (
                      <Option value={item.id} key={item.id}>{item.shopName}</Option>
                    );
                  })}
                </Select>
              ) : (
              <Select placeholder="请选择">
                {shopsLists.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>{item.shopName}</Option>
                  );
                })}
              </Select>
              )
              )}
          </FormItem>
          {/*<FormItem {...formItemLayout} label="选择时间">*/}
            {/*{getFieldDecorator('rangeTime', {*/}
              {/*rules: [{ type: 'array', required: true, message: '请选择时间' }],*/}
            {/*})(*/}
              {/*<RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />*/}
            {/*)}*/}
          {/*</FormItem>*/}
          <FormItem {...formItemLayout} label="备注描述">
            {getFieldDecorator('remark')(<TextArea placeholder="请输入备注描述" autosize={{ minRows: 2, maxRows: 6 }} />)}
          </FormItem>
        </Form>
      </Modal>
    );
});
const WatchForm = Form.create()(
  (props) => {
    const { watchModalVisible, modalData, handleWatchModalVisible } = props;
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
        title="查看活动"
        visible={watchModalVisible}
        onCancel={() => handleWatchModalVisible()}
        footer={null}
      >
        <Form onSubmit={this.handleSearch}>
          <FormItem {...formItemLayout} label="活动名称">
            <span>{modalData.name}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="选择商户">
            <span>{modalData.merchantName}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="选择店铺">
            <span>{modalData.shopName}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="备注描述">
            <span>{modalData.remark}</span>
          </FormItem>
        </Form>
      </Modal>
    );
  });
const SetDefaultForm = Form.create()(
  (props) => {
    const { editActivitymodalVisible,
      form, editActivityHandleAddClick,
      editActivityHandleModalVisibleClick,
      editActivityEditModalConfirmLoading,
      onSelect, data, value, handleChange,
      onPopupScroll, onSearch, fetching } = props;
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
        title="设置默认活动"
        visible={editActivitymodalVisible}
        onOk={editActivityHandleAddClick}
        onCancel={() => editActivityHandleModalVisibleClick()}
        confirmLoading={editActivityEditModalConfirmLoading}
      >
        <Form onSubmit={this.handleSearch}>
          <FormItem {...formItemLayout} label="活动名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入活动名称' }],
            })(<Input placeholder="请输入活动名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="选择游戏">
            {getFieldDecorator('gameId', {
              rules: [{ required: true, message: '请选择游戏' }],
            })(
              <Select
                // mode="multiple"
                // labelInValue
                showSearch={true}
                placeholder="请输入游戏名称进行选择"
                notFoundContent={fetching ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={onSearch}
                onChange={handleChange}
                onPopupScroll={onPopupScroll}
                onSelect={onSelect}
                style={{ width: '100%' }}
                allowClear={true}
              >{data.map(d => <Option key={d.key} value={d.value} data-id={d.id}>{d.text}</Option>)}
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  });
@connect(({ common, loading, activitySetting, log }) => ({
  common,
  activitySetting,
  loading: loading.models.activitySetting,
  log,
}))
@Form.create()
export default class activitySettingList extends PureComponent {
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
    modalType: 'add',
    merchantLists: [],
    shopsLists: [],
    watchModalVisible: false,

    data: [],
    dataId: '',
    value: '',
    editActivitymodalVisible: false,
    editActivityEditModalConfirmLoading: false,
    pointPageNo: 1,
    fetching: false,
  };
  componentDidMount() {
    this.getLists();
  }
  // 获取列表
  getLists = () => {
    this.props.dispatch({
      type: 'activitySetting/getActivitySettingList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          keyword: this.state.keyword,
          code: this.state.code,
        },
      },
    });
    this.props.dispatch({
      type: 'activitySetting/getMerchantsList',
      payload: {
        restParams: {},
      },
    }).then((res) => {
      this.setState({
        merchantLists: res,
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
      pageNo: 1,
      keyword: '',
      code: '',
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
  // onSelect
  onSelect = (value, option) => {
    // console.log('value', value, option)
    // shopsLists
    this.props.dispatch({
      type: 'activitySetting/getShopsList',
      payload: {
        restParams: {
          sellerId: value,
        },
      },
    }).then((res) => {
      this.setState({
        shopsLists: res,
      });
    });
  }
  // 搜索
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        pageNo: 1,
        keyword: fieldsValue.keyword ? fieldsValue.keyword : '',
        code: fieldsValue.status ? fieldsValue.status : '',
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
      modalType: 'add',
    });
    this.setModalData();
  };
  handleWatchModalVisible = (flag) => {
    this.setState({
      watchModalVisible: !!flag,
      modalData: {},
    });
  }
  // 删除modal 删除事件
  handleDelClick = (item) => {
    this.setState({
      editModalConfirmLoading: true,
    });
    if (item) {
      const params = { id: item.id };
      this.props.dispatch({
        type: 'activitySetting/delActivitySetting',
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
      watchModalVisible: false,
      modalData: item,
      modalType: 'edit',
    });
    this.props.dispatch({
      type: 'activitySetting/getActivitySettingDetail',
      payload: {
        restParams: {
          id: item.id,
        },
      },
    }).then((res) => {
      this.setModalData(res);
    });
  }
  // handleWatchClick
  handleWatchClick = (item) => {
    this.setState({
      modalVisible: false,
      watchModalVisible: true,
      modalType: 'watch',
    });
    this.props.dispatch({
      type: 'activitySetting/getActivitySettingDetail',
      payload: {
        restParams: {
          id: item.id,
        },
      },
    }).then((res) => {
      this.setState({
        modalData: res,
      });
    });
  }
  // 设置modal 数据
  setModalData = (data) => {
    if (data) {
      this.props.dispatch({
        type: 'activitySetting/getShopsList',
        payload: {
          restParams: {
            sellerId: data.sellerId,
          },
        },
      }).then((res) => {
        this.setState({
          shopsLists: res,
        }, () => {
          this.form.setFieldsValue({
            name: data.name || '',
            sellerId: data.sellerId || undefined,
            shopId: data.shopId || undefined,
            remark: data.remark || undefined,
          });
        });
      });
    } else {
      this.form.setFieldsValue({
        name: undefined,
        sellerId: undefined,
        shopId: undefined,
        remark: undefined,
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
      // const rangeTimeValue = fieldsValue.rangeTime
      let params = {
        ...fieldsValue,
        // rangeTime: undefined,
        // createTime: rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
        // endTime: rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
      };
      this.setState({
        editModalConfirmLoading: true,
        modalData: {},
      });
      let url = 'activitySetting/saveActivitySetting';
      if (this.state.modalData.id) {
        url = 'activitySetting/editActivitySetting';
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
  // 设置默认活动开始
  saveActivityFormRef = (form) => {
    this.pointForm = form;
  }
  handleEditActivityClick = () => {
    this.setState({
      modalVisible: false,
      editActivitymodalVisible: true,
      data: [],
    });
    this.pointForm.setFieldsValue({
      name: undefined,
      gameId: undefined,
    });
  }
  getActivitySettingList = (value) => {
    if (value) {
      if (value !== this.state.value) {
        this.setState({
          value,
          pointPageNo: 1,
          data: [],
        });
      }
      this.props.dispatch({
        type: 'activitySetting/gameList',
        payload: {
          params: {
            pageNo: this.state.pointPageNo ? this.state.pointPageNo : 1,
            keyword: value ? value : this.state.value,
          },
        },
      }).then((result) => {
        const list = [];
        console.log('list', result)
        result.forEach((r) => {
          list.push({
            key: r.id,
            value: r.name,
            text: r.name,
            id: r.id,
          });
        });
        let data = list
        if (this.state.pointPageNo !== 1) {
          data = [...list, ...this.state.data];
        }
        this.setState({ data, fetching: false });
        if (result.length < 20) {
          this.setState({
            fetching: true,
          });
          // return;
        }
      });
    }
  }
  handleChange = (value) => {
    this.setState({
      pointPageNo: 1,
      data: [],
      fetching: false,
      value: '',
    });
  }
  editActivityHandleAddClick = () => {
    // 确认修改点位
    // console.log(this.state.dataId)
    this.pointForm.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        editActivityEditModalConfirmLoading: true,
      });
      console.log('values', values)
      const url = 'activitySetting/saveActivitySetting';
      const params = { ...values, isDefault: 1, gameId: this.state.dataId  };
      this.props.dispatch({
        type: url,
        payload: {
          params,
        },
      }).then(() => {
        this.getLists();
        this.setState({
          editActivityEditModalConfirmLoading: false,
          modalVisible: false,
          modalData: {},
          data: [],
          editActivitymodalVisible: false,
        });
      });
    });
  }
  onSetDefaultSelect = (value, option) => {
    // let v = '';
    // if (value.length > 1) {
    //   v = value[1]['key']
    // } else {
    //   v = value[0]['key']
    // }
    // this.pointForm.setFieldsValue({
    //   keyword2: v,
    // });
    this.setState({ data: [], dataId: option.props['data-id'], value: '', });
    // console.log('onselect', value, option.props['data-id'], this.state.value);
  }
  editActivityHandleModalVisibleClick = (flag) => {
    this.setState({
      editActivitymodalVisible: !!flag,
    });
  };
  onPopupScroll = () => {
    // console.log('滚动加载')
    if (!this.state.fetching) {
      this.setState({
        pointPageNo: this.state.pointPageNo + 1,
      }, () => {
        this.getActivitySettingList(this.state.value);
      });
    }
  }
  // 设置默认活动结束
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
    const { merchantLists, shopsLists } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="选择活动状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择活动状态">
                  {ActivityStatus.map((item) => {
                    return (
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={9} sm={24}>
            <FormItem>
              {getFieldDecorator('keyword')(<Input placeholder="请输入活动名称、所属商户、所属店铺" />)}
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
    const { activitySetting: { list, page }, loading, log: { logList, logPage }, } = this.props;
    const { selectedRows, modalVisible, editModalConfirmLoading, modalType, merchantLists, shopsLists, watchModalVisible, modalData } = this.state;
    const columns = [
      {
        title: '活动名称',
        dataIndex: 'name',
      },
      {
        title: '所属商户',
        dataIndex: 'merchantName',
      },
      {
        title: '所属店铺',
        dataIndex: 'shopName',
      },
      {
        title: '商品/优惠券',
        dataIndex: 'prizeType',
        render(val) {
          return <span>{status[val]}</span>;
        },
      },
      {
        title: '活动状态',
        dataIndex: 'state',
      },
      {
        title: '负责人',
        dataIndex: 'managerId',
      },
      {
        fixed: 'right',
        width: 150,
        title: '操作',
        render: (text, item) => (
          <Fragment>
            <a onClick={() => this.handleWatchClick(item)}>查看</a>
            <Divider type="vertical" />
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
              <Button icon="plus" type="primary" onClick={() => this.handleEditActivityClick(true)}>
                设置默认活动
              </Button>
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
          merchantLists={merchantLists}
          shopsLists={shopsLists}
          onSelect={this.onSelect}
        />
        <WatchForm
          modalData={modalData}
          watchModalVisible={watchModalVisible}
          handleWatchModalVisible={this.handleWatchModalVisible}
        />
        <SetDefaultForm
          ref={this.saveActivityFormRef}
          editActivitymodalVisible={this.state.editActivitymodalVisible}
          editActivityHandleAddClick={this.editActivityHandleAddClick}
          editActivityHandleModalVisibleClick={this.editActivityHandleModalVisibleClick}
          editActivityEditModalConfirmLoading={this.state.editActivityEditModalConfirmLoading}
          data={this.state.data}
          // modalData={this.state.modalData}
          handleChange={this.handleChange}
          onPopupScroll={this.onPopupScroll}
          onSelect={this.onSetDefaultSelect}
          onSearch={this.getActivitySettingList}
          fetching={this.state.fetching}
          // value={this.state.value}
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
