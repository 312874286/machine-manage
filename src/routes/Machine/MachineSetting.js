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
  Popover,
  Cascader,
} from 'antd';
import StandardTable from '../../components/StandardTable';
import MachineAisleTable from '../../components/MachineAisleTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './MachineSetting.less';
import LogModal from '../../components/LogModal';
import EditableTagGroup from '../../components/Tag';
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
const machineStatus = ['未知', '已开机', '已初始化', '已通过测试', '已在点位']
const appStatus = ['未启动', '前台运行', '后台运行']
// <Icon type="wifi" />
const netWorkMap = ['wifi'];
message.config({
  top: 100,
  duration: 2,
  maxCount: 1,
});

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
        title="重置点位"
        visible={editPointmodalVisible}
        onOk={editPointHandleAddClick}
        onCancel={() => editPointHandleModalVisibleClick()}
        confirmLoading={editPointEditModalConfirmLoading}
      >
        <Form onSubmit={this.handleSearch}>
          <FormItem {...formItemLayout} label="当前点位">
            {getFieldDecorator('localDesc')(<Input disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} label="新点位">
            {getFieldDecorator('locale', {
              rules: [{ required: true, message: '请输入新点位' }],
            })(
              <Select
              // mode="multiple"
              // labelInValue
                showSearch={true}
                placeholder="请输入点位关键字进行选择"
                notFoundContent={fetching ? <Spin size="small" /> : '暂无数据'}
                filterOption={false}
                onSearch={onSearch}
                onChange={handleChange}
                // onPopupScroll={onPopupScroll}
                onSelect={onSelect}
                style={{ width: '100%' }}
                allowClear={true}
              >{data.map(d => <Option key={d.value} data-id={d.id}>{d.text}</Option>)}
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
});
const ManageCutAppForm = Form.create()(
  (props) => {
    const { form, appLists, okCutApp, } = props;
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
      <Form>
        <FormItem {...formItemLayout} label="切换App">
          {getFieldDecorator('appStatus', {
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...formItemLayout} label="请选择前台运行APP">
          {getFieldDecorator('appPackageName', {
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
          <Button type="primary" onClick={okCutApp}>确定</Button>
        </FormItem>
      </Form>
    );
  });
const ManageUpdateAppForm = Form.create()(
  (props) => {
    const { form, appLists, okRefreshApp } = props;
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
      <Form>
        <FormItem label="升级App" />
        <FormItem {...formItemLayout} label="请选择升级App">
          {getFieldDecorator('appPackageName', {
            rules: [{ required: true, whitespace: true, message: '请选择升级App' }],
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
          {getFieldDecorator('versionCode', {
            rules: [{ required: true, whitespace: true, message: '请填写升级版本' }],
          })(<Input placeholder="请填写升级版本" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="升级链接">
          {getFieldDecorator('url', {
            rules: [{ required: true, whitespace: true, message: '请输入升级链接' }],
          })(<Input placeholder="请输入升级链接" />)}
        </FormItem>
        <FormItem style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={okRefreshApp}>确定</Button>
        </FormItem>
      </Form>
    );
  });
const ManageAisleForm = Form.create()(
  (props) => {
    const { form, ManageAislemodalVisible, ManageAisleEditModalConfirmLoading, ManageAisleHandleAddClick, ManageAisleHandleModalVisibleClick, handleClose, AisleList, handleStop, handleStart, message, updateGoodsCount } = props;
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
        width={1250}
        visible={ManageAislemodalVisible}
        onOk={ManageAisleHandleAddClick}
        onCancel={() => ManageAisleHandleModalVisibleClick()}
        confirmLoading={ManageAisleEditModalConfirmLoading}
        footer={null}
      >
        <MachineAisleTable
          handleClose={handleClose}
          AisleList={AisleList}
          handleStop={handleStop}
          handleStart={handleStart}
          message={message}
          updateGoodsCount={updateGoodsCount}
          />
      </Modal>
    );
  });
const WatchForm = Form.create()(
  (props) => {
    const { form, ManageWatchModalVisible, ManageWatchEditModalConfirmLoading, ManageWatchHandleModalVisibleClick,
      appUpdate,appRefresh, machineDetail } = props;
    // const { getFieldDecorator } = form;
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
        title="查看机器状态"
        width={1100}
        visible={ManageWatchModalVisible}
        onCancel={() => ManageWatchHandleModalVisibleClick()}
        confirmLoading={ManageWatchEditModalConfirmLoading}
        footer={null}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexDirection: 'column' }}>
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>请您先点击更新，获取最新数据</span>
            <span><Button type="primary" onClick={() => appUpdate(1)}>更新</Button></span>
          </div>
          <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end', marginBottom: '10px' }}>

            <span><Button type="Default" onClick={() => appRefresh()}>刷新</Button></span>
          </div>
        </div>
        <div style={{ background: '#ECECEC', padding: '30px' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Card title="机器状态" bordered={false}>
                <div>机器门状态：{machineDetail.machineStatus ? (machineDetail.machineStatus.machineDoorStatus === 0 ? '关闭' : '打开') : ''}</div>
                <div>温度：{machineDetail.machineStatus ? (machineDetail.machineStatus.temperature ? machineDetail.machineStatus.temperature : '') : ''}</div>
                <div>掉货开关：{machineDetail.machineStatus ? (machineDetail.machineStatus.dropGoodsSwitch === 0 ? '关闭' : '打开') : ''}</div>
                <div>屏幕亮度：{machineDetail.machineStatus ? (machineDetail.machineStatus.screenIntensity ? machineDetail.machineStatus.screenIntensity : '') : ''}</div>
                <div>音量：{machineDetail.machineStatus ? (machineDetail.machineStatus.voice ? machineDetail.machineStatus.voice : '') : ''}</div>
                <div>上次更新时间：{machineDetail.systemStatus ? machineDetail.systemStatus.createTime : '暂无'}</div>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="硬件状态" bordered={false}>
                <div>cpu：{machineDetail.systemStatus ? (machineDetail.systemStatus.cpu ? machineDetail.systemStatus.cpu : '') : ''}</div>
                <div>运行内存：{machineDetail.systemStatus ? (machineDetail.systemStatus.memoryTotle ? machineDetail.systemStatus.memoryTotle : '') : ''}G 剩余：{machineDetail.systemStatus ? (machineDetail.systemStatus.memoryFree ? machineDetail.systemStatus.memoryFree : '') : ''}G</div>
                <div>SD卡内存：{machineDetail.systemStatus ? (machineDetail.systemStatus.sdTotle ? machineDetail.systemStatus.sdTotle : '') : ''}G 剩余：{machineDetail.systemStatus ? (machineDetail.systemStatus.sdFree ? machineDetail.systemStatus.sdFree : '') : ''}G </div>
                <div>运营商：{machineDetail.systemStatus ? (machineDetail.systemStatus.networkOperateName ? machineDetail.systemStatus.networkOperateName :'') : ''}</div>
                <div>ACC ID: {machineDetail.systemStatus ? (machineDetail.systemStatus.accid ? machineDetail.systemStatus.accid : '') : ''}</div>
                <div>上次更新时间：{machineDetail.machineStatus ? machineDetail.machineStatus.createTime : '暂无'}</div>
              </Card>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  });
@connect(({ common, loading, machineSetting, log }) => ({
  common,
  machineSetting,
  loading: loading.models.machineSetting,
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
    machineCode: '',
    localCode: '',
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
    appLists2: [],
    updateList: [],
    AisleList: [],
    message: -1,

    machineDetail: {},
    ManageWatchModalVisible: false,
    ManageWatchEditModalConfirmLoading: false,
    createTime: '',

    options: [],
    code: '',
  };
  constructor(props) {
    super(props);
    this.getPointSettingList = debounce(this.getPointSettingList, 800);
    this.onPopupScroll = debounce(this.onPopupScroll, 800);
  }
  componentDidMount() {
    this.getLists();
    this.getAreaList();
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
          localCode: this.state.localCode,
          machineCode: this.state.machineCode,
        },
      },
    });
  }
  // 分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
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
      localCode: '',
      machineCode: '',
    });
  };
  // 获取城市列表
  getAreaList = () => {
    this.props.dispatch({
      type: 'common/getProvinceCityAreaTradeArea',
      payload: {
        restParams: {
          code: this.state.code,
        },
      },
    }).then( (res) => {
      this.setState({
        options: res,
      });
    });
  }
  // 搜索
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let localCode = ''
      if (fieldsValue.provinceCityAreaTrade) {
        if (fieldsValue.provinceCityAreaTrade.length > 0) {
          localCode = fieldsValue.provinceCityAreaTrade[fieldsValue.provinceCityAreaTrade.length - 1]
        }
      }
      this.setState({
        pageNo: 1,
        machineCode: fieldsValue.machineCode ? fieldsValue.machineCode : '',
        localCode: localCode,
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
  // 编辑modal 编辑事件
  handleEditClick = (item) => {
    this.setState({
      modalVisible: false,
      modalData: item,
      editPointmodalVisible: true,
      data: [],
    }, () => {
      this.setModalData(item);
    });
  }
  // 设置modal 数据
  setModalData = (data) => {
    if (data) {
      this.pointForm.setFieldsValue({
        localDesc: data.localDesc,
        locale: undefined,
      });
    } else {
      this.pointForm.setFieldsValue({
        localDesc: undefined,
        locale: undefined,
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
      });
      let url = '';
      let params = { ...values };
      if (this.state.modalData.id) {
        url = 'machineSetting/updateLocaleMachineSetting';
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
          modalData: {},
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
    if (value) {
      if (value !== this.state.value) {
        this.setState({
          value,
          pointPageNo: 1,
          data: [],
          fetching: true,
        });
      }
      this.props.dispatch({
        type: 'machineSetting/getPointSettingList',
        payload: {
          restParams: {
            pageNo: this.state.pointPageNo ? this.state.pointPageNo : 1,
            keyword: value ? value.trim() : this.state.value.trim(),
            code: '',
          },
        },
      }).then((result) => {
        if (result.length === 0) {
          this.setState({
            fetching: false,
            data: [], // 无分页
          });
          return;
        }
        if (result.length < 20) {
          this.setState({
            fetching: true,
          });
          // return;
        }
        const list = [];
        result.forEach((r) => {
          list.push({
            value: r.areaName + r.mall + r.name + r.id,
            text: r.areaName + r.mall + r.name + r.id,
            id: r.id,
          });
        });
        let data = list
        // if (this.state.pointPageNo !== 1) {
        //   data = [...list, ...this.state.data];
        // }
        // this.setState({ data, fetching: false });
        this.setState({ data });
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
  editPointHandleAddClick = () => {
    // 确认修改点位
    // console.log(this.state.dataId)
    this.pointForm.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        editPointEditModalConfirmLoading: true,
      });
      let url = '';
      let params = '';
      if (this.state.modalData.id) {
        url = 'machineSetting/updateLocaleMachineSetting';
        params = { id: this.state.modalData.id, localeId: this.state.dataId };
      }
      this.props.dispatch({
        type: url,
        payload: {
          params,
        },
      }).then(() => {
        this.getLists();
        this.setState({
          editPointEditModalConfirmLoading: false,
          modalVisible: false,
          modalData: {},
          dataId: '',
          data: [],
          editPointmodalVisible: false,
          ManageAppmodalVisible: false,
          ManageAislemodalVisible: false,
        });
      });
    });
  }
  onSelect = (value, option) => {
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
  editPointHandleModalVisibleClick = (flag) => {
    this.setState({
      editPointmodalVisible: !!flag,
    });
  };
  onPopupScroll = () => {
    console.log('滚动加载', this.state.fetching)
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
  handleClose = () => {
    this.setState({
      ManageAislemodalVisible: false,
    });
  }
  ManageCutAppFormRef = (form) => {
    this.ManageCutAppForm = form;
  }
  ManageUpdateAppFormRef = (form) => {
    this.ManageUpdateAppForm = form;
  }
  handleManageAppClick = (item) => {
    this.setState({
      modalVisible: false,
      modalData: item,
      editPointmodalVisible: false,
      ManageAppmodalVisible: true,
      ManageAislemodalVisible: false,
    }, () => {
      // appStatus
      // const appLists = [{
      //   id: '1', name: '天猫APP  V2.01',
      // }, {
      //   id: '2', name: '后台APP  V2.01',
      // }];
      this.props.dispatch({
        type: 'machineSetting/getAppStatus',
        payload: {
          restParams: {
            machineId: this.state.modalData.id,
          },
        },
      }).then((result) => {
        // console.log('result', result)
        let appLists = [], appLists2 = [], appStatus = '当前没有运行的app';
        if (result) {
          result.status.forEach((item) => {
            if (item.appType === 2) {
              let tmp =  { id: item.appPackageName, name: item.appName }
              appLists.push(tmp);
            }
            if (item.appStatus === 1) {
              appStatus =  item.appName + 'v' + item.versionName
            }
            appLists2.push({ id: item.appPackageName, name: item.appName })
          })
          // console.log('appLists', appLists)
          this.setState({
            updateList: result.status,
            appLists,
            appLists2,
            createTime: result.createTime ? result.createTime : '暂无',
          }, () => {
            this.ManageCutAppForm.setFieldsValue({
              appStatus,
            });
          });
        } else {
          this.setState({
            createTime: result ? result.createTime : '暂无',
            updateList: [],
            appLists: [],
            appLists2: [],
          }, () => {
            this.ManageCutAppForm.setFieldsValue({
              appStatus,
            });
          });
        }
      });
    });
  }
  okCutApp = () => {
    this.ManageCutAppForm.validateFields((err, values) => {
      if (err) {
        return;
      }
      let url = '';
      let params = { ...values };
      // console.log(params, this.state.modalData)
      if (this.state.modalData.id) {
        url = 'machineSetting/cutApp';
        params = { ...values, machineId: this.state.modalData.id };
      }
      this.props.dispatch({
        type: url,
        payload: {
          restParams: params,
        },
      }).then((resp) => {
        if (resp && resp.code === 0) {
          message.success('切换成功');
        }
      });
    });
  }
  okRefreshApp = () => {
    this.ManageUpdateAppForm.validateFields((err, values) => {
      if (err) {
        return;
      }
      let url = '';
      let params = { ...values };
      // console.log('okRefreshApp', params, this.state.modalData)
      if (this.state.modalData.id) {
        url = 'machineSetting/installApp';
        params = { ...values, machineId: this.state.modalData.id };
      }
      this.props.dispatch({
        type: url,
        payload: {
          restParams: params,
        },
      }).then((resp) => {
        if (resp && resp.code === 0) {
          message.success('升级成功');
        }
      });
    });
  }
  ManageAppHandleModalVisibleClick = (flag) => {
    this.setState({
      ManageAppmodalVisible: !!flag,
    });
  };
  appUpdate = (updateStatus) => {
    // console.log('点击了更新app', this.state.modalData, updateStatus);
    this.props.dispatch({
      type: 'machineSetting/machineUpdateInfo',
      payload: {
        params: {
          machineId: this.state.modalData.id,
          updateStatus:  updateStatus ? updateStatus : '',
        },
      },
    }).then((resp) => {
      if (resp && resp.code === 0) {
        message.config({
          top: 100,
          duration: 2,
          maxCount: 1,
        });
        message.success('更新成功');
      }
    });
  }
  appRefresh = () => {
    // console.log('刷新了app', this.state.modalData);
    this.handleManageAppClick(this.state.modalData);
  }
  appMachineRefresh = () => {
    this.getMachineStatus(this.state.modalData);
  }
  getUpdateList = () => {
    const updateList = [{
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
    this.setState({
      updateList,
    });
    // 获取数据
    // this.props.dispatch({
    //   type: 'machineSetting/getAppStatus',
    //   payload: {
    //     restParams: {
    //       id: this.state.modalData.id
    //     },
    //   },
    // }).then((result) => {
    //   this.setState({
    //     updateList: result,
    //   });
    // });
  }
  // 管理App结束
  // 管理货道开始

  handleStop = (val) => {
    // deleteChannelMachineSetting
    this.props.dispatch({
      type: 'machineSetting/deleteChannelMachineSetting',
      payload: {
        params: val,
      },
    }).then((resp) => {
      if (resp && resp.code === 0) {
        message.success('停用成功');
        this.getAisleList();
      } else {
        message.error(resp ? resp.msg : '停用失败');
      }
    });
  }
  handleStart = (val) => {
    this.props.dispatch({
      type: 'machineSetting/deleteChannelMachineSetting',
      payload: {
        params: val,
      },
    }).then((resp) => {
      if (resp && resp.code === 0) {
        message.success('启动成功');
        this.getAisleList();
        // this.setState({
        //   message: resp.code
        // })
      } else {
        message.error(resp ? resp.msg : '启动失败');
      }
    });
  }
  updateGoodsCount = (val) => {
    this.props.dispatch({
      type: 'machineSetting/updateGoodsCountMachineSetting',
      payload: {
        params: val,
      },
    }).then((resp) => {
      if (resp && resp.code === 0) {
        message.success('修改成功');
        this.getAisleList();
      } else {
        message.error(resp ? resp.msg : '修改失败');
      }
    });
  }
  saveManageAisleFormRef = (form) => {
    this.pointManageAisleForm = form;
  }
  handleManageAisleClick = (item) => {
    this.setState({
      modalVisible: false,
      modalData: item,
      editPointmodalVisible: false,
      ManageAppmodalVisible: false,
    }, () => {
      this.getAisleList();
    });
  }
  getAisleList = () => {
    this.props.dispatch({
      type: 'machineSetting/getAisleList',
      payload: {
        restParams: {
          machineId: this.state.modalData.id,
        },
      },
    }).then((result) => {
      if (result.length === 0) {
        message.config({
          top: 100,
          duration: 2,
          maxCount: 1,
        });
        message.error('该货道为空，暂时不能操作')
        return;
      }
      this.setState({
        ManageAislemodalVisible: true,
      }, () => {
        let AisleList = []
        for (let i = 0; i < 48; i++) {
          let r = {}
          // console.log('i', i)
          for (let j = 0; j < result.length; j++) {
            // console.log('parseInt(result[j].code) === i',parseInt(result[j].code), i, j)
            if (parseInt(result[j].code) === (i+1)) {
              let item = result[j]
              r = {
                value: parseInt(item.code),
                key: item.id,
                code: item.code,
                goodsName: item.goodsName,
                goodsPrice: item.goodsPrice,
                volumeCount: item.volumeCount,
                goodsCount: item.goodsCount,
                workStatusreason: item.workStatusreason,
                isDelete: item.isDelete
              }
              AisleList.push(r);
              break;
            }
          }
          if (!AisleList[i]) {
            r = {
              value: i + 1,
              key: i + 1,
            }
            AisleList.push(r);
          }
        }
        let tr1 = AisleList.filter(item => item.value <= 8)
        let tr2 = AisleList.filter(item => item.value <= 18 && item.value >= 11)
        let tr3 = AisleList.filter(item => item.value <= 28 && item.value >= 21)
        let tr4 = AisleList.filter(item => item.value <= 38 && item.value >= 31)
        let tr5 = AisleList.filter(item => item.value <= 48 && item.value >= 41)
        AisleList = [...tr1, ...tr2, ...tr3, ...tr4, ...tr5]
        // console.log('AisleList.push(r);', AisleList)
        // result.forEach((item) => {
        //   let r = { key: item.id, code: item.code, goodsName: item.goodsName, goodsPrice: item.goodsPrice, volumeCount: item.volumeCount, goodsCount: item.goodsCount, workStatusreason: item.workStatusreason, isDelete: item.isDelete}
        //   AisleList.push(r);
        // })
        this.setState({
          AisleList,
        });
      });
    });
  }
  ManageAisleHandleAddClick = () => {
    // 确认管理App
    // console.log('确认管理Aisle货道');
  }
  ManageAisleHandleModalVisibleClick = (flag) => {
    this.setState({
      ManageAislemodalVisible: !!flag,
    });
  };
  // 管理货道结束
  // 日志相关开始
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
  // 日志相关结束
  // watchStatus查看机器状态开始
  ManageWatchFormRef = () => {
    // this.watchForm = form;
  }
  ManageWatchHandleModalVisibleClick = (flag) => {
    this.setState({
      ManageWatchModalVisible: !!flag,
    });
  }
  getMachineStatus = (item) => {
    // console.log('machineId', item.id);
    // getMachineStatus
    this.setState({
      modalData: item,
    }, () => {
      // 获取数据
      this.props.dispatch({
        type: 'machineSetting/getMachineStatus',
        payload: {
          restParams: {
            machineId: item.id,
          },
        },
      }).then((result) => {
        // console.log(result)
        this.setState({
          machineDetail: result.data,
        }, () => {
          console.log('machineDetail', this.state.machineDetail)
          this.setState({
            ManageWatchModalVisible: true,
          })
        });
      });
    })
  }
  // handleMouseOver
  // 查看机器状态结束
  // 四级联动开始
  loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    this.setState({
      code: targetOption.value,
    }, () => {
      this.props.dispatch({
        type: 'common/getProvinceCityAreaTradeArea',
        payload: {
          restParams: {
            code: targetOption.value,
          },
        },
      }).then((res) => {
        targetOption.loading = false;
        targetOption.children = res
        this.setState({
          options: [...this.state.options],
        });
      });
    });
  }
  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="省市区商圈">
              {getFieldDecorator('provinceCityAreaTrade')(
                <Cascader
                  placeholder="请选择"
                  options={this.state.options}
                  loadData={this.loadData}
                  changeOnSelect
                />
              )}
            </FormItem>
          </Col>
          <Col md={9} sm={24}>
            <FormItem>
              {getFieldDecorator('machineCode')(<Input placeholder="请输入机器编号" />)}
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
      machineSetting: { list, page },
      loading,
      log: { logList, logPage },
    } = this.props;
    const { selectedRows, modalVisible, editModalConfirmLoading, modalData, updateList, appLists, AisleList, message, appLists2, createTime } = this.state;
    const columns = [
      {
        title: '机器编号',
        width: 150,
        dataIndex: 'machineCode',
      },
      {
        title: '机器点位',
        width: 250,
        dataIndex: 'localDesc',
      },
      {
        title: '系统状态',
        width: 100,
        render: (text, item) => (
          <div style={{ color: '#174a79', border: 0, background: 'transparent', cursor: 'pointer' }} onClick={() => this.getMachineStatus(item)} >查看</div>
        ),
      },
      {
        title: '网络',
        width: 100,
        dataIndex: 'netStatus',
        render(val) {
          if (val === 1) {
            return <Icon type="wifi" />;
          } else {
            return '网络异常';
          }
        },
      },
      {
        title: '当前活动',
        width: 150,
        dataIndex: 'activityName',
      },
      {
        title: '商品缺货状态',
        render: (text, item) => ((!item.goodsStatus) ? (
          <span>正常</span>
        ) : (
          <Popover placement="left" content={item.goodsStatus} title={null} trigger="hover">
            <div style={{ color: 'red', border: 0, background: 'transparent' }}>缺货</div>
          </Popover>
        )),
        width: 100,
      },
      {
        title: '货道故障',
        render: (text, item) => ((!item.channelStatus) ? (
          <span>无</span>
        ) : (
          <Popover placement="left" content={item.channelStatus} title={null} trigger="hover">
            <div style={{ color: 'red', border: 0, background: 'transparent' }}>缺货</div>
          </Popover>
        )),
        width: 100,
      },
      {
        title: '机器状态',
        dataIndex: 'machineStatus',
        render(val) {
          if (val) {
            return <span>{machineStatus[val]}</span>
          } else {
            return <span>{machineStatus[0]}</span>
          }
        }
      },
      {
        fixed: 'right',
        title: '操作',
        width: 240,
        render: (text, item) => (
          (item.localDesc) ? (
            <Fragment>
              <a onClick={() => this.handleEditClick(item)}>重置点位</a>
              <Divider type="vertical" />
              <a onClick={() => this.handleManageAppClick(item)}>管理App</a>
              <Divider type="vertical" />
              <a onClick={() => this.handleManageAisleClick(item)}>管理货道</a>
            </Fragment>) : (
            <Fragment>
              <a style={{ color: 'grey', cursor: 'not-allowed' }}>重置点位</a>
              <Divider type="vertical" />
              <a onClick={() => this.handleManageAppClick(item)}>管理App</a>
              <Divider type="vertical" />
              <a onClick={() => this.handleManageAisleClick(item)}>管理货道</a>
            </Fragment>
          )
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
    const columns1 = [{
      title: 'APP名称',
      dataIndex: 'appName',
      align: 'center',
    }, {
      title: '安装版本',
      dataIndex: 'versionName',
      align: 'center',
      render: (text, item) => (
        (item.versionCode === -1) ? (
          <span>未安装</span>
        ) : ( <span>{item.versionName}</span>))
    }, {
      title: '运行状态',
      render: (text, item) => (
        (item.versionCode === -1) ? (<span>--</span>) : (
          (item.appStatus !== -1) ? (<span>{appStatus[item.appStatus]}</span>) : (<span>--</span>))
      ),
      align: 'center',
    }, {
      title: 'App类型',
      dataIndex: 'appType',
      align: 'center',
      render(val) {
        if (val === 1) {
          return '监控';
        } else if (val === 2) {
          return '正常';
        }
      },
    }];
    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
          <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={list}
              page={page}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              scrollX={1400}
              scrollY={(document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 100)}
            />
          </div>
        </Card>
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
        <Modal
          title="管理App"
          visible={this.state.ManageAppmodalVisible}
          onCancel={() => this.ManageAppHandleModalVisibleClick()}
          width={900}
          footer={null}
          confirmLoading={this.state.ManageAppEditModalConfirmLoading}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>请您先点击更新，获取最新数据</span>
              <span><Button type="primary" onClick={() => this.appUpdate(2)}>更新</Button></span>
            </div>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>上次更新时间：{createTime}</span>
              <span><Button type="Default" onClick={() => this.appRefresh()}>刷新</Button></span>
            </div>
          </div>
          <Table columns={columns1} dataSource={updateList} rowKey={record => record.appPackageName} pagination={false} />
          <ManageCutAppForm ref={this.ManageCutAppFormRef} appLists={appLists} okCutApp={this.okCutApp} />
          <ManageUpdateAppForm ref={this.ManageUpdateAppFormRef} appLists={appLists2} okRefreshApp={this.okRefreshApp} />
        </Modal>
        {/*<ManageForm*/}
          {/*ManageAppmodalVisible={this.state.ManageAppmodalVisible}*/}
          {/*ManageAppHandleModalVisibleClick={this.ManageAppHandleModalVisibleClick()}*/}
          {/*ManageAppEditModalConfirmLoading={this.state.ManageAppEditModalConfirmLoading}*/}
          {/*appUpdate={this.appUpdate}*/}
          {/*appRefresh={this.appRefresh}*/}
          {/*columns1={columns1}*/}
          {/*updateList={updateList}*/}
          {/*ManageCutAppFormRef={this.ManageCutAppFormRef}*/}
          {/*appLists={appLists}*/}
          {/*okCutApp={this.okCutApp}*/}
          {/*ManageUpdateAppFormRef={this.ManageUpdateAppFormRef}*/}
          {/*appLists2={appLists2}*/}
          {/*okRefreshApp={this.okRefreshApp}*/}
       {/*/>*/}
        <ManageAisleForm
          ref={this.saveManageAisleFormRef}
          ManageAislemodalVisible={this.state.ManageAislemodalVisible}
          ManageAisleEditModalConfirmLoading={this.state.ManageAisleEditModalConfirmLoading}
          ManageAisleHandleAddClick={this.ManageAisleHandleAddClick}
          ManageAisleHandleModalVisibleClick={this.ManageAisleHandleModalVisibleClick}
          handleClose={this.handleClose}
          AisleList={AisleList}
          handleStop={this.handleStop}
          handleStart={this.handleStart}
          message={message}
          updateGoodsCount={this.updateGoodsCount}
        />
        <WatchForm
          ref={this.ManageWatchFormRef}
          ManageWatchModalVisible={this.state.ManageWatchModalVisible}
          ManageWatchEditModalConfirmLoading={this.state.ManageWatchEditModalConfirmLoading}
          ManageWatchHandleModalVisibleClick={this.ManageWatchHandleModalVisibleClick}
          appUpdate={this.appUpdate}
          appRefresh={this.appMachineRefresh}
          machineDetail={this.state.machineDetail}
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
