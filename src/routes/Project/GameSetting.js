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
  Checkbox,
} from 'antd';
import StandardTable from '../../components/StandardTable/index';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './GameSetting.less';
import LogModal from '../../components/LogModal/index';
import moment from "moment/moment";


const FormItem = Form.Item;
const { TextArea } = Input
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const RangePicker = DatePicker.RangePicker;

const CreateForm = Form.create()(
  (props) => {
    const { modalVisible, form, handleAdd, handleModalVisible, editModalConfirmLoading, modalType } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    return (
      <Modal
        title={
          <div class="modalBox">
            <span class="leftSpan"></span>
            <span class="modalTitle">{modalType ? '编辑游戏' : '新建游戏'}</span>
          </div>
        }
        visible={modalVisible}
        onOk={handleAdd}
        onCancel={() => handleModalVisible()}
        confirmLoading={editModalConfirmLoading}
        width={800}
      >
        <div className="manageAppBox">
          <Form onSubmit={this.handleSearch}>
          <FormItem {...formItemLayout} label="游戏名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, whitespace: true, message: '请输入游戏名称' }],
            })(<Input placeholder="请输入游戏名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="游戏版本">
            {getFieldDecorator('version', {
              rules: [{ required: true, whitespace: true, message: '请输入游戏版本' }],
            })(<Input placeholder="请输入游戏版本" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="点72版本">
            {getFieldDecorator('versionInno72', {
              rules: [{ required: true, whitespace: true, message: '请输入点72版本' }],
            })(<Input placeholder="请输入点72版本" />)}
          </FormItem>
            <FormItem {...formItemLayout} label="商品数量">
              <Col span={11}>
                <FormItem label="最小数量">
                  {getFieldDecorator('minGoodsNum', {
                    rules: [{ required: true, message: '请输入最小数量' }],
                  })(<InputNumber min={1} placeholder="请输入最小数量" />)}
                </FormItem>
              </Col>
              <Col span={2}>
                <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                  -
                </span>
              </Col>
              <Col span={11}>
                <FormItem label="最大数量">
                  {getFieldDecorator('maxGoodsNum', {
                    rules: [{ required: true, message: '请输入最大数量' }],
                  })(<InputNumber min={1} placeholder="请输入最大数量" />)}
                </FormItem>
              </Col>
            </FormItem>
          <FormItem {...formItemLayout} label="备注描述">
            {getFieldDecorator('remark')(<TextArea placeholder="请输入备注描述" autosize={{ minRows: 2, maxRows: 6 }} />)}
          </FormItem>
        </Form>
        </div>
      </Modal>
    );
});
@connect(({ common, loading, gameSetting, log }) => ({
  common,
  gameSetting,
  loading: loading.models.gameSetting,
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
    // shopsLists
    // activityLists
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
  // 新增modal确认事件 开始
  saveFormRef = (form) => {
    this.form = form;
  }
  // 设置modal 数据
  setModalData = (data) => {
    if (data) {
      this.form.setFieldsValue({
        // ...data,
        name: data.name || undefined,
        version: data.version || undefined,
        versionInno72: data.versionInno72 || undefined,
        remark: data.remark || undefined,
        minGoodsNum: data.minGoodsNum,
        maxGoodsNum: data.maxGoodsNum
      });
    } else {
      this.form.setFieldsValue({
        name: undefined,
        version: undefined,
        versionInno72: undefined,
        remark: undefined,
        minGoodsNum: undefined,
        maxGoodsNum: undefined
      });
    }
  }

  // 编辑modal 确认事件
  MachineAdd = () => {
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
  // 设置机器开始
  // 设置机器结束
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
          <Col md={10} sm={24}>
            <FormItem>
              {getFieldDecorator('keyword')(<Input placeholder="请输入游戏名称、版本、点72版本" />)}
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
    const { gameSetting: { list, page }, loading, log: { logList, logPage }, } = this.props;
    const { selectedRows, modalVisible, editModalConfirmLoading, modalType, } = this.state;
    const columns = [
      {
        title: '游戏名称',
        dataIndex: 'name',
        width: '10%',
      },
      {
        title: '版本',
        dataIndex: 'version',
        width: '20%',
      },
      {
        title: '点72版本',
        dataIndex: 'versionInno72',
        width: '10%',
      },
      {
        title: '商品数量',
        width: '30%',
        render: (text, item) => (
          <Fragment>
            <div>最小数量：{item.minGoodsNum}</div>
            <div>最大数量：{item.maxGoodsNum}</div>
          </Fragment>
        )
      },
      {
        title: '备注描述',
        dataIndex: 'remark',
      },
      {
        fixed: 'right',
        width: 200,
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
            {/*<Divider type="vertical" />*/}
            {/*<a onClick={() => this.setMachineClick(item)}>设置机器</a>*/}
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
      handleAdd: this.MachineAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const gameSetMachineMethods = {
      MachineAdd: this.MachineAdd,
      MachineHandleModalVisible: this.MachineHandleModalVisible,
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
              scrollX={1000}
            />
          </div>
        </Card>
        <CreateForm
          ref={this.saveFormRef}
          {...parentMethods}
          modalVisible={modalVisible}
          editModalConfirmLoading={editModalConfirmLoading}
          modalType={modalType}
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
