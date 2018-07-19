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
  Table,
} from 'antd';
import StandardTable from '../../components/StandardTable/index';
import styles from './PersonnelManagement.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';


const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

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
        title={!modalType ? '编辑人员信息' : '新建人员'}
        visible={modalVisible}
        onOk={handleAdd}
        onCancel={() => handleModalVisible()}
        confirmLoading={editModalConfirmLoading}
      >
        <Form onSubmit={this.handleSearch}>
          <FormItem {...formItemLayout} label="姓名">
            {getFieldDecorator('merchantCode', {
              rules: [{ required: true, whitespace: true, message: '请输入姓名' }],
            })(<Input placeholder="请输入姓名" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="手机号">
            {getFieldDecorator('merchantName', {
              rules: [{ required: true, whitespace: true, message: '请输入手机号' }],
            })(<Input placeholder="请输入手机号" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="身份证号">
            {getFieldDecorator('originFlag', {
              rules: [{ required: true, whitespace: true, message: '请输入身份证号' }],
            })(<Input placeholder="请输入身份证号" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="公司">
            {getFieldDecorator('brandName', {
              rules: [{ required: true, whitespace: true, message: '请输入公司' }],
            })(<Input placeholder="请输入公司" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  });
const WatchMachine = Form.create()(
  (props) => {
    const { WatchMachineModalVisible, WatchMachineHandleModalVisibleClick, machineList } = props;
    const machineColumns = [{
      title: '机器点位',
      dataIndex: 'machineLocale',
      align: 'center',
    }, {
      title: '机器编码',
      dataIndex: 'machineCode',
      align: 'center',
    }];
    return (
      <Modal
        title="查看机器"
        width={400}
        visible={WatchMachineModalVisible}
        onCancel={() => WatchMachineHandleModalVisibleClick()}
        footer={null}
      >
        <div style={{ background: '#ECECEC', padding: '30px' }}>
          <Table columns={machineColumns} dataSource={machineList} rowKey={record => record.machineCode} pagination={false} />
        </div>
      </Modal>
    );
  });
const SelectMachineForm = Form.create()(
  (props) => {
    const { editMachineModalVisible, form, onEditMachineHandleAddClick, onEditMachineHandleModalVisibleClick, editMachineEditModalConfirmLoading,
      renderTreeNodes, treeData, onLoadData, onExpand, expandedKeys, autoExpandParent, checkedKeys, selectedKeys, onCheck, onSelect, } = props;
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
        title="选择机器"
        visible={editMachineModalVisible}
        onOk={onEditMachineHandleAddClick}
        onCancel={() => onEditMachineHandleModalVisibleClick()}
        confirmLoading={editMachineEditModalConfirmLoading}
        width={800}
      >
        <Form onSubmit={this.handleSearch}>
          <FormItem {...formItemLayout} label="选择机器">
            {getFieldDecorator('machine', {
              rules: [{ type: 'array', required: true, message: '请选择机器' }],
            })(
              <Tree
                loadData={onLoadData}
                checkable
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onCheck={onCheck}
                checkedKeys={checkedKeys}
                onSelect={onSelect}
                selectedKeys={selectedKeys}
              >
                {renderTreeNodes(treeData)}
              </Tree>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  });
@connect(({ common, loading, personnelManagement }) => ({
  common,
  personnelManagement,
  loading: loading.models.personnelManagement,
}))
@Form.create()
export default class personnelManagement extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    editModalConfirmLoading: false,
    pageNo: 1,
    keyword: '',
    modalData: {},
    modalType: true,
    channelLists: [],

    WatchMachineModalVisible: false,
    machineList: [],
  };
  componentDidMount() {
    this.getLists();
  }
  // 获取列表
  getLists = () => {
    this.props.dispatch({
      type: 'personnelManagement/getUserList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          keyword: this.state.keyword,
        },
      },
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
  // 编辑modal 编辑事件
  handleEditClick = (item) => {
    this.setState({
      modalVisible: true,
      modalData: item,
      modalType: false,
    });
    this.props.dispatch({
      type: 'personnelManagement/getUserDetail',
      payload: {
        restParams: {
          id: item.id,
        },
      },
    }).then((res) => {
      console.log('res', res)
      this.setModalData(res);
    });
  }
  // 设置modal 数据
  setModalData = (data) => {
    if (data) {
      this.form.setFieldsValue({
        name: data.name || undefined,
        phone: data.phone || undefined,
        cardNo: data.cardNo || undefined,
        enterprise: data.enterprise || undefined,
      });
    } else {
      this.form.setFieldsValue({
        name: undefined,
        phone: undefined,
        cardNo: undefined,
        enterprise: undefined,
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
      let url = 'personnelManagement/saveUser';
      let params = { ...values };
      if (this.state.modalData.id) {
        url = 'personnelManagement/updateUser';
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
  // 查看
  getMachineStatus = (item) => {
    this.setState({
      modalData: item,
    }, () => {
      // 获取数据
      this.props.dispatch({
        type: 'personnelManagement/getUserMachineDetailList',
        payload: {
          restParams: {
            id: item.id,
          },
        },
      }).then((result) => {
        // console.log(result)
        this.setState({
          machineList: result,
        }, () => {
          this.setState({
            WatchMachineModalVisible: true,
          });
        });
      });
    })
  }
  WatchMachineHandleModalVisibleClick = () => {
    this.setState({
      WatchMachineModalVisible: false,
    });
  }
  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={9} sm={24}>
            <FormItem label="关键字">
              {getFieldDecorator('keyword')(<Input placeholder="请输入姓名、手机号、公司搜索" />)}
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
      personnelManagement: { list, page },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, editModalConfirmLoading, modalType, channelLists } = this.state;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
      },
      {
        title: '身份证号',
        dataIndex: 'cardNo',
      },
      {
        title: '公司',
        dataIndex: 'enterprise',
      },
      {
        title: '负责的机器',
        render: (text, item) => (
          <div style={{ color: '#174a79', border: 0, background: 'transparent' }} onClick={() => this.getMachineStatus(item)} >查看</div>
        ),
      },
      {
        fixed: 'right',
        width: 150,
        title: '操作',
        render: (text, item) => (
          <Fragment>
            <a onClick={() => this.handleEditClick(item)}>编辑</a>
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
        <WatchMachine
          WatchMachineModalVisible={this.state.WatchMachineModalVisible}
          WatchMachineHandleModalVisibleClick={this.WatchMachineHandleModalVisibleClick}
          machineList={this.state.machineList}
        />
      </PageHeaderLayout>
    );
  }
}
