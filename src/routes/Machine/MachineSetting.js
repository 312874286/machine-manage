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
  Radio,
  Popconfirm,
  Tag,
  Table,
  Spin,
} from 'antd';
import StandardTable from '../../components/StandardTable';
import EditableTable from '../../components/EditableTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './MachineSetting.less';
import LogModal from '../../components/LogModal';
import EditableTagGroup from '../../components/Tag';
import {area} from "../../common/config/area";
import debounce from 'lodash/debounce'


const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];
// <Icon type="wifi" />
const netWorkMap = ['wifi'];

const CreateForm = Form.create()(
  (props) => {
    const { modalVisible, form, handleAdd, handleModalVisible, editModalConfirmLoading, handleTags, modalData } = props;
    // const okHandle = () => {
    //   form.validateFields((err, fieldsValue) => {
    //     if (err) return;
    //     form.resetFields();
    //     handleAdd(fieldsValue);
    //   });
    // };
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
        title={getFieldDecorator('machine_id') ? '编辑机器' : '新建机器'}
        visible={modalVisible}
        onOk={handleAdd}
        onCancel={() => handleModalVisible()}
        confirmLoading={editModalConfirmLoading}
      >
        <Form onSubmit={this.handleSearch}>
          <FormItem {...formItemLayout} label="机器ID">
            {getFieldDecorator('machine_id', {
              rules: [{ required: true, message: '请输入机器ID' }],
            })(<Input placeholder="请输入机器ID" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="机器名称">
            {getFieldDecorator('machine_name', {
              rules: [{ required: true, message: '请输入机器名称' }],
            })(<Input placeholder="请输入机器名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="选择点位">
            {getFieldDecorator('locale_id', {
              rules: [{ required: true, message: '请选择点位' }],
            })(<Input placeholder="请选择点位" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="机器状态">
            {getFieldDecorator('status', {
              rules: [{ required: true, message: '请选择机器状态' }],
              initialValue: '1',
            })(
              <RadioGroup>
                <Radio value="0">不可用</Radio>
                <Radio value="1">可用</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="机器标签">
            {getFieldDecorator('tags', {
              rules: [{ required: true, message: '请填写机器标签' }],
              initialValue: { tags: modalData.tags },
            })(
              <EditableTagGroup
                handleTags={handleTags}
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
});
const EditPointForm = Form.create()(
  (props) => {
    const { editPointmodalVisible, form, editPointHandleAddClick, editPointHandleModalVisibleClick, editPointEditModalConfirmLoading, onSelect, data, value, handleChange, onPopupScroll, onSearch, fetching } = props;
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
        title="修改点位"
        visible={editPointmodalVisible}
        onOk={editPointHandleAddClick}
        onCancel={() => editPointHandleModalVisibleClick()}
        confirmLoading={editPointEditModalConfirmLoading}
      >
        <Form onSubmit={this.handleSearch}>
          <FormItem {...formItemLayout} label="当前点位">
            {getFieldDecorator('machineCircle', {
              rules: [{ required: true, message: '请输入机器ID' }],
            })(<Input disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} label="新点位">
            {getFieldDecorator('keyword2', {
              rules: [{ required: true, message: '请输入新点位' }],
            })(
              <Select
              // mode="multiple"
              // labelInValue
                showSearch={true}
                placeholder="Select users"
                notFoundContent={fetching ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={onSearch}
                onChange={handleChange}
                onPopupScroll={onPopupScroll}
                onSelect={onSelect}
                style={{ width: '100%' }}
              >{data.map(d => <Option key={d.value} data-id={d.id}>{d.text}</Option>)}
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
});
const ManageAppForm = Form.create()(
  (props) => {
    const { form, ManageAppmodalVisible, ManageAppEditModalConfirmLoading, ManageAppHandleAddClick, ManageAppHandleModalVisibleClick, appLists } = props;
    // const okHandle = () => {
    //   form.validateFields((err, fieldsValue) => {
    //     if (err) return;
    //     form.resetFields();
    //     handleAdd(fieldsValue);
    //   });
    // };
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
    const columns = [{
      title: 'APP名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    }, {
      title: '安装状态',
      dataIndex: 'age',
      key: 'age',
      align: 'center',
    }, {
      title: '运行状态',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
    }, {
      title: '是否前台运行',
      dataIndex: 'status',
      align: 'center',
    }];
    const data = [{
      key: '1',
      name: '天猫APP V2.01',
      age: '已安装',
      address: '运行中',
      status: '是',
    }, {
      key: '2',
      name: '天猫APP V2.01',
      age: '已安装',
      address: '运行中',
      status: '是',
    }, {
      key: '3',
      name: '天猫APP V2.01',
      age: '已安装',
      address: '运行中',
      status: '是',
    }];
    return (
      <Modal
        title="管理App"
        visible={ManageAppmodalVisible}
        // onOk={ManageAppHandleAddClick}
        onCancel={() => ManageAppHandleModalVisibleClick()}
        footer={null}
        confirmLoading={ManageAppEditModalConfirmLoading}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexDirection: 'column' }}>
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>请您先点击更新，获取最新数据</span>
            <span><Button type="primary">更新</Button></span>
          </div>
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>上次更新时间：2018.07.15  15:38:30</span>
            <span><Button type="Default">刷新</Button></span>
          </div>
        </div>
        <Table columns={columns} dataSource={data} />
        <Form onSubmit={this.handleSearch}>
          <FormItem {...formItemLayout} label="切换App">
            {getFieldDecorator('appStatus', {
            })(<Input disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} label="请选择前台运行APP">
            {getFieldDecorator('newAppStatus', {
              rules: [{ required: true, message: '请选择前台运行APP' }],
            })(
              <Select placeholder="请选择">
                {appLists.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>{item.name}</Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem style={{ textAlign: 'right' }}>
            <Button type="primary" >确定</Button>
          </FormItem>
          <FormItem label="升级App"></FormItem>
          <FormItem {...formItemLayout} label="请选择升级App">
            {getFieldDecorator('appUpdateStatus', {
              rules: [{ required: true, message: '请选择升级App' }],
            })(
              <Select placeholder="请选择">
                {appLists.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>{item.name}</Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="升级版本">
            {getFieldDecorator('updateVersion', {
            })(<Input placeholder="请输入升级版本" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="升级链接">
            {getFieldDecorator('updateLink', {
            })(<Input placeholder="请输入升级链接" />)}
          </FormItem>
          <FormItem style={{ textAlign: 'right' }}>
            <Button type="primary" >确定</Button>
          </FormItem>
        </Form>
      </Modal>
    );
});
const ManageAisleForm = Form.create()(
  (props) => {
    const { form, ManageAislemodalVisible, ManageAisleEditModalConfirmLoading, ManageAisleHandleAddClick, ManageAisleHandleModalVisibleClick,
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = props;
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
        title="管理货道"
        width={'1100px'}
        visible={ManageAislemodalVisible}
        onOk={ManageAisleHandleAddClick}
        onCancel={() => ManageAisleHandleModalVisibleClick()}
        confirmLoading={ManageAisleEditModalConfirmLoading}
        footer={null}
      >
        <EditableTable />
      </Modal>
    );
  });

@connect(({ common, loading, machineSetting, log }) => ({
  common,
  machineSetting,
  loading: loading.models.rule,
  log,
}))
@Form.create()
export default class machineSettingList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    editModalConfirmLoading: false,
    pageNo: 1,
    keyword: '',
    modalData: {},
    logModalVisible: false,
    logModalLoading: false,
    logId: '',
    logModalPageNo: 1,

    data: [],
    dataId: '',
    value: '',
    editPointmodalVisible: false,
    editPointEditModalConfirmLoading: false,
    pointPageNo: 1,
    fetching: false,

    ManageAppmodalVisible: false,
    ManageAppEditModalConfirmLoading: false,

    ManageAislemodalVisible: false,
    ManageAisleEditModalConfirmLoading: false,
    appLists: [],
  };
  constructor(props) {
    super(props);
    this.getPointSettingList = debounce(this.getPointSettingList, 800);
    this.onPopupScroll = debounce(this.onPopupScroll, 800);
  }
  componentDidMount() {
    this.getLists();
  }
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };
  // 获取点位管理列表
  getLists = () => {
    this.props.dispatch({
      type: 'machineSetting/getMachineSettingList',
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
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      pageNo: 1,
      keyword: '',
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
      // const values = {
      //   ...fieldsValue,
      //   updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      // };
      // this.setState({
      //   formValues: values,
      // });
      this.setState({
        pageNo: 1,
        keyword: fieldsValue.keyword,
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
        type: 'machineSetting/delMachineSetting',
        payload: {
          params,
        },
      }).then(() => {
        message.success('Click on Yes');
        this.getLists();
        this.setState({
          editModalConfirmLoading: false,
        });
      });
    } else return false;
  }
  // 编辑modal 编辑事件
  handleEditClick = (item) => {
    item.tags = item.tag.split('，');
    console.log('handleEditClick', item)
    this.setState({
      modalVisible: false,
      modalData: item,
      editPointmodalVisible: true,
      data: [],
    });
    this.setModalData(item);
  }
  // 设置modal 数据
  setModalData = (data) => {
    if (data) {
      // this.form.setFieldsValue({
      //   machine_id: data.machine_id || '',
      //   machine_name: data.machine_name || '',
      //   locale_id: data.locale_id || '',
      //   tag: data.tag,
      //   status: data.status,
      //   keyword: '',
      // });
      this.pointForm.setFieldsValue({
        machineCircle: '商圈',
      });
    } else {
      // this.form.setFields({
      //   machine_id: '',
      //   machine_name: '',
      //   locale_id: '',
      //   tag: '',
      // });
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
      let url = 'machineSetting/saveMachineSetting';
      let params = { ...values };
      if (this.state.modalData.id) {
        url = 'machineSetting/editMachineSetting';
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
  // tag设置开始
  handleTags = (val) => {
    this.setState({
      modalData: { tags: val },
    });
  }
  // tag设置结束
  // 修改点位开始
  savePointFormRef = (form) => {
    this.pointForm = form;
  }
  getPointSettingList = (value) => {
    console.log('fetching user', value, this.state.value)
    if (value) {
      if (value !== this.state.value) {
        this.setState({
          value,
          pointPageNo: 1,
          data: [],
        });
      }
      console.log('fetching user', this.state.value)
      this.props.dispatch({
        type: 'machineSetting/getPointSettingList',
        payload: {
          restParams: {
            pageNo: this.state.pointPageNo ? this.state.pointPageNo : 1,
            keyword: value ? value : this.state.value,
            code: '',
          },
        },
      }).then((result) => {
        const list = [];
        result.forEach((r) => {
          list.push({
            value: r.areaName,
            text: r.areaName,
            id: r.id,
          });
        });
        let data = list
        if (this.state.pointPageNo !== 1) {
          data = [...list, ...this.state.data];
        }
        this.setState({ data, fetching: false });
        if (result.length < 10) {
          this.setState({
            fetching: true,
          });
          // return;
        }
      });
    }
  }
  handleChange = (value) => {
    // console.log('handleChange', value)
    // this.setState({
    //   value,
    //   pointKeyword: value,
    // }, () => {
    //   console.log('handleChange', value)
    //   this.getPointSettingList();
    // });

    console.log('handleChange', value)
    this.setState({
      pointPageNo: 1,
      data: [],
      fetching: false,
      value: '',
    });
  }
  editPointHandleAddClick = () => {
    // 确认修改点位
    console.log(this.state.dataId)
    this.setState({
      dataId: '',
      data: [],
      value: '',
    });
  }
  onSelect = (value, option) => {
    // this.form.setFieldsValue({
    //   keyword: value.label,
    // });
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
    console.log('onselect', value, option.props['data-id'], this.state.value);
  }
  editPointHandleModalVisibleClick = (flag) => {
    this.setState({
      editPointmodalVisible: !!flag,
    });
  };
  onPopupScroll = () => {
    // console.log(arguments)
    // console.log('滚动加载')
    if (!this.state.fetching) {
      this.setState({
        pointPageNo: this.state.pointPageNo + 1,
      }, () => {
        this.getPointSettingList(this.state.value);
      });
    }
  }
  // 修改点位结束
  // 管理App开始
  saveManageAppFormRef = (form) => {
    this.pointManageAppForm = form;
  }
  handleManageAppClick = (item) => {
    this.setState({
      modalVisible: false,
      modalData: item,
      editPointmodalVisible: false,
      ManageAppmodalVisible: true,
      ManageAislemodalVisible: false,
    });
    // appStatus
    const appLists = [{
      id: '1', name: '天猫APP  V2.01',
    }, {
      id: '2', name: '后台APP  V2.01',
    }];
    this.setState({
      appLists,
    });
    this.form.setFieldsValue({
      appStatus: '天猫APP  V2.01',
    });
  }
  ManageAppHandleAddClick = () => {
    // 确认管理App
    console.log('确认管理App');
  }
  ManageAppHandleModalVisibleClick = (flag) => {
    this.setState({
      ManageAppmodalVisible: !!flag,
    });
  };
  // 管理App结束
  // 管理货道开始
  saveManageAisleFormRef = (form) => {
    this.pointManageAisleForm = form;
  }
  handleManageAisleClick = (item) => {
    this.setState({
      modalVisible: false,
      modalData: item,
      editPointmodalVisible: false,
      ManageAppmodalVisible: false,
      ManageAislemodalVisible: true,
    });
  }
  ManageAisleHandleAddClick = () => {
    // 确认管理App
    console.log('确认管理Aisle货道');
  }
  ManageAisleHandleModalVisibleClick = (flag) => {
    this.setState({
      ManageAislemodalVisible: !!flag,
    });
  };
  // 管理货道结束
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
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={9} sm={24}>
            <FormItem label="关键字">
              {getFieldDecorator('keyword')(<Input placeholder="请输入机器ID、机器名称、标签" />)}
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
  // 四级联动结束
  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
  render() {
    const {
      machineSetting: { list, page },
      loading,
      log: { logList, logPage },
    } = this.props;
    const { selectedRows, modalVisible, editModalConfirmLoading, modalData, } = this.state;
    const columns = [
      {
        title: '机器编号',
        width: 200,
        dataIndex: 'machine_id',
      },
      {
        title: '机器点位',
        width: 300,
        dataIndex: 'machine_name',
      },
      {
        title: '网络',
        width: 100,
        dataIndex: 'netWork',
        render(val) {
          if (val == 1) {
            // <Icon type="wifi" />
            return <Icon type="wifi" />;
          } else {
            return '网络异常';
          }
        },
      },
      {
        title: '当前活动',
        width: 200,
        dataIndex: 'create_id',
      },
      {
        title: '机器状态',
        dataIndex: 'status',
        width: 200,
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '货道缺货状态',
        dataIndex: 'status2',
        width: 200,
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '货道状态',
        dataIndex: 'status3',
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        fixed: 'right',
        title: '操作',
        width: 300,
        render: (text, item) => (
          <Fragment>
            {/*<a onClick={() => this.handleEditClick(item)}>编辑</a>*/}
            <a onClick={() => this.handleEditClick(item)}>修改点位</a>
            {/*<Divider type="vertical" />*/}
            {/*<a onClick={() => this.handleLogClick(item)}>日志</a>*/}
            {/*<Divider type="vertical" />*/}
            {/*<Popconfirm title="确定要删除吗" onConfirm={() => this.handleDelClick(item)} okText="Yes" cancelText="No">*/}
              {/*<a>删除</a>*/}
            {/*</Popconfirm>*/}
            <Divider type="vertical" />
            <a onClick={() => this.handleManageAppClick(item)}>管理App</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleManageAisleClick(item)}>管理货道</a>
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
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={list}
              page={page}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              scrollX={1600}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          ref={this.saveFormRef}
          modalVisible={modalVisible}
          handleTags={this.handleTags}
          editModalConfirmLoading={editModalConfirmLoading}
          modalData={modalData}
        />
        <EditPointForm
          ref={this.savePointFormRef}
          editPointmodalVisible={this.state.editPointmodalVisible}
          editPointHandleAddClick={this.editPointHandleAddClick}
          editPointHandleModalVisibleClick={this.editPointHandleModalVisibleClick}
          editPointEditModalConfirmLoading={this.state.editPointEditModalConfirmLoading}
          data={this.state.data}
          // modalData={this.state.modalData}
          handleChange={this.handleChange}
          onPopupScroll={this.onPopupScroll}
          onSelect={this.onSelect}
          onSearch={this.getPointSettingList}
          fetching={this.state.fetching}
          // value={this.state.value}
        />
        <ManageAppForm
          ref={this.saveManageAppFormRef}
          ManageAppmodalVisible={this.state.ManageAppmodalVisible}
          ManageAppEditModalConfirmLoading={this.state.ManageAppEditModalConfirmLoading}
          ManageAppHandleAddClick={this.ManageAppHandleAddClick}
          ManageAppHandleModalVisibleClick={this.ManageAppHandleModalVisibleClick}
          appLists={this.state.appLists}
        />
        <ManageAisleForm
          ref={this.saveManageAisleFormRef}
          ManageAislemodalVisible={this.state.ManageAislemodalVisible}
          ManageAisleEditModalConfirmLoading={this.state.ManageAisleEditModalConfirmLoading}
          ManageAisleHandleAddClick={this.ManageAisleHandleAddClick}
          ManageAisleHandleModalVisibleClick={this.ManageAisleHandleModalVisibleClick}
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
