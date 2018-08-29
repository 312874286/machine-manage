import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  Modal,
  Divider,
  Cascader,
  Alert,
  Popconfirm
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TaskSetting.less'
import TaskAisletable from '../../components/Machine/taskAisleTable'
import moment from "moment/moment";
import {message} from "antd/lib/index";
const FormItem = Form.Item;
const { Option } = Select;
const taskTypeOptions = [{id: 1, name: '升级App'}, {id: 2, name: '卸载App'}, {id: 3, name: '合并货道'}, {id: 4, name: '拆分货道'}]
const taskType = ['', '升级App', '卸载App', '合并货道', '拆分货道']
const taskStatusOptions = [{id: 0, name: '未执行'}, {id: 1, name: '待执行'}, {id: 2, name: '已执行'} ]
const taskStatus = ['未执行', '待执行', '已执行']
const doType = ['socket', 'push']

const UpgradeAppForm = Form.create()(
  (props) => {
    const { form, appLists, disabledStartDate, disabledTime } = props;
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
          <Form>
            <FormItem {...formItemLayout} label="选择App">
              {getFieldDecorator('app', {
                rules: [{ required: true, message: '请选择App' }],
              })(<Select placeholder="请选择App">
                {appLists.map((item) => {
                  return (
                    <Option value={item.id} key={item.id} data-id={item.id}>{item.appName}</Option>
                  );
                })}
              </Select>)}
            </FormItem>
            <FormItem {...formItemLayout} label="升级版本">
              {getFieldDecorator('appVersion', {
                rules: [{ required: true, message: '请填写升级版本' }],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="升级链接">
              {getFieldDecorator('appUrl', {
                rules: [{ required: true, message: '请填写升级链接' }],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="选择开始时间">
              {getFieldDecorator('doTimeStr', {
                rules: [{ required: true, message: '选择开始时间' }],
              })(
                <DatePicker
                  disabledDate={disabledStartDate}
                  disabledTime={disabledTime}
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder="选择开始时间"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="选择执行方式">
              {getFieldDecorator('doType', {
                rules: [{ required: true, message: '请选择执行方式' }],
              })(
                <Select placeholder="请选择执行方式">
                  {doType.map((item) => {
                    return (
                      <Option key={item}>{item}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Form>
    );
  });
const UnloadAppForm = Form.create()(
  (props) => {
    const { form, appLists, disabledStartDate, disabledTime } = props;
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
      <Form>
        <FormItem {...formItemLayout} label="选择App">
          {getFieldDecorator('app', {
            rules: [{ required: true, message: '请选择App' }],
          })(<Select placeholder="请选择App">
            {appLists.map((item) => {
              return (
                <Option value={item.id} key={item.id} data-id={item.id}>{item.appName}</Option>
              );
            })}
          </Select>)}
        </FormItem>
        <FormItem {...formItemLayout} label="选择执行时间">
          {getFieldDecorator('doTimeStr', {
            rules: [{ required: true, message: '选择执行时间' }],
          })(
            <DatePicker
              disabledDate={disabledStartDate}
              disabledTime={disabledTime}
              showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
              format="YYYY-MM-DD HH:mm"
              placeholder="选择执行时间"
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="选择执行方式">
          {getFieldDecorator('doType', {
            rules: [{ required: true, message: '请选择执行方式' }],
          })(
            <Select placeholder="请选择执行方式">
              {doType.map((item) => {
                return (
                  <Option key={item}>{item}</Option>
                );
              })}
            </Select>
          )}
        </FormItem>
      </Form>
    );
  });
const AisleTaskSettingForm = Form.create()(
  (props) => {
    const { form, AisleList, disabledStartDate, HandleAisle, disabledTime } = props;
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
      <div>
        <FormItem {...formItemLayout} label="选择执行时间">
          {getFieldDecorator('doTimeStr', {
            rules: [{ required: true, message: '选择执行时间' }],
          })(
            <DatePicker
              disabledDate={disabledStartDate}
              disabledTime={disabledTime}
              showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
              format="YYYY-MM-DD HH:mm"
              placeholder="选择执行时间"
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="选择执行方式">
          {getFieldDecorator('doType', {
            rules: [{ required: true, message: '请选择执行方式' }],
          })(
            <Select placeholder="请选择执行方式">
              {doType.map((item) => {
                return (
                  <Option key={item}>{item}</Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem>
          <TaskAisletable
            HandleAisle={HandleAisle}
            AisleList={AisleList}
          />
        </FormItem>
      </div>
    );
  });
const SelectMachineForm = Form.create()(
  (props) => {
    const { editMachineModalVisible, form,
      onEditMachineHandleAddClick, onEditMachineHandleModalVisibleClick, editMachineEditModalConfirmLoading, insertOptions,
      loadData, addData, targetData, onChangeRowSelection, selectedRowKeys, onSelectAll, sourceData, handleSave, selectAll,
      onLeftSelect, targetHandleSave, targetHandleDelete, findSourceData
    } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    };
    this.columns = [{
      title: '机器编号',
      dataIndex: 'code',
      width: '30%'
    }, {
      title: '机器点位',
      dataIndex: 'name',
      width: '50%'
    }, {
      title: '网络',
      dataIndex: 'planed',
      render(val) {
        return <div className={styles.netStatusStyles}>
          <img src={require(`../../assets/images/signalIcon/sign${val === null ? 0 : val}.png`)}/>
        </div>;
      },
    }];
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: handleSave,
        }),
      };
    });

    const rowSelection = {
      selectedRowKeys,
      onChange: onChangeRowSelection,
      onSelect: onLeftSelect,
      onSelectAll: onSelectAll,
    };
    this.columnsRight = [{
      title: '名称',
      dataIndex: 'machineCode',
      render: text => <a href="javascript:;">{text}</a>,
    }, {
      title: '操作',
      width: 70,
      dataIndex: 'operation',
      render: (text, record) => {
        return (
          targetData.length > 0
            ? (
              <Popconfirm title="确认要删除吗?" onConfirm={() => targetHandleDelete(record.machineCode)}>
                <a href="javascript:;">删除</a>
              </Popconfirm>
            ) : null
        );
      }
    }];
    const columnsRight = this.columnsRight.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: targetHandleSave,
        }),
      };
    });

    return (
      <Modal
        title="选择机器"
        visible={editMachineModalVisible}
        onOk={onEditMachineHandleAddClick}
        onCancel={() => onEditMachineHandleModalVisibleClick()}
        confirmLoading={editMachineEditModalConfirmLoading}
        width={1000}>
        <div className="manageAppBox">
          <Form onSubmit={this.handleSearch}>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={10} sm={24}>
                <FormItem>
                  {getFieldDecorator('code')(
                    <Cascader
                      placeholder="请选择"
                      options={insertOptions}
                      loadData={loadData}
                      changeOnSelect
                    />
                  )}
                </FormItem>
              </Col>
              <Col md={10} sm={24}>
                <FormItem>
                  {getFieldDecorator('machineCode')(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col md={4} sm={24} style={{ paddingLeft: '3px' }}>
                <FormItem>
                  <Button onClick={() => findSourceData()} style={{ width: '70px', borderRadius: '4px' }}>
                    搜索
                  </Button>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={24} sm={24} style={{ paddingLeft: '3px' }}>
                <div style={{ marginLeft: '20px', marginTop: '10px' }}>
                  <Alert
                    message={(
                      <div>
                        已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}/{sourceData.length} </a> 项
                      </div>
                    )}
                    type="info"
                    showIcon
                  />
                  <Table
                    rowKey={record => record.machineCode}
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={sourceData}
                    id="leftTable"
                    style={{ marginBottom: '20px', marginTop: '10px' }}
                    scroll={{ y: 200 }}
                    pagination={false}
                  />
                  <Button onClick={() => addData()} style={{ display: selectAll ? 'block' : 'none' }}>
                    添加
                  </Button>
                </div>
              </Col>
            </Row>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={24} sm={24} style={{ paddingLeft: '3px' }}>
                <div style={{ marginLeft: '20px' }}>
                  <Alert
                    message={(
                      <div>
                        已有 <a style={{ fontWeight: 600 }}>{targetData.length}</a> 项
                      </div>
                    )}
                    type="success"
                    showIcon
                  />
                  <Table
                    rowKey={record => record.machineCode}
                    columns={columnsRight}
                    dataSource={targetData}
                    id="rightTable"
                    style={{ marginTop: '10px' }}
                    scroll={{ y: 200 }}
                    pagination={false}/>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    );
  });

@connect(({ common, loading, taskSetting }) => ({
  common,
  taskSetting,
  loading: loading.models.taskSetting,
}))
@Form.create()
export default class TaskSetting extends PureComponent {
  state = {
    modalVisible: false,
    formValues: {},
    editModalConfirmLoading: false,
    pageNo: 1,
    type: '',
    status: '',
    modalType: true,
    taskType: '',
    AisleList: [],
    appLists: [],

    editMachineModalVisible: false,
    selectCity: [],
    selectCityName: [],
    editMachineEditModalConfirmLoading: false,
    insertOptions: [],
    targetData: [],
    sourceData: [],
    sourceKey: [],
    targetKey: [],
    selectAll: false,
    selectedRows: [],
    repeat: [],
    selectedRowKeys: [],
    options: [],
    defaultValue: [],
  };
  componentDidMount() {
    this.getLists();
  }
  // 获取列表
  getLists = () => {
    this.props.dispatch({
      type: 'taskSetting/taskList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          status: this.state.status,
          type: this.state.type,
        },
      },
    });
  }
  getAppLists = () => {
    this.props.dispatch({
      type: 'taskSetting/taskSelectAppList',
      payload: {
        restParams: {
        },
      },
    }).then((res) => {
      this.setState({
        appLists: res
      })
    });
  }
  // 重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      pageNo: 1,
      type: '',
      status: '',
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
        type: fieldsValue.type >= 0 ? fieldsValue.type : '',
        status: fieldsValue.status >= 0 ? fieldsValue.status : ''
      }, () => {
        this.getLists();
      });
    });
  };
  // 新增modal确认事件 开始
  saveUpgradeAppFormRef = (form) => {
    this.UpgradeAppForm = form;
  }
  saveUnloadAppFormRef = (form) => {
    this.UnloadAppForm = form;
  }
  saveAisleTaskSettingFormRef = (form) => {
    this.AisleTaskSettingForm = form;
  }
  // 添加modal 添加事件
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: flag,
      modalData: {},
      modalType: true,
    });
  };
  // 设置modal 数据
  setModalUpgradeAppData = (data) => {
    if (this.UpgradeAppForm) {
      if (data) {
        this.UpgradeAppForm.setFieldsValue({
          app: data.app || '',
          appUrl: data.appUrl || undefined,
          appVersion: data.appVersion || undefined,
          doType: data.doType || undefined,
          doTimeStr: data.doTimeStr || undefined,
        });
      } else {
        this.UpgradeAppForm.setFieldsValue({
          app: undefined,
          appUrl: undefined,
          appVersion: undefined,
          doType: undefined,
          doTimeStr: undefined,
        });
      }
    }
  }
  setModalUnloadAppData = (data) => {
    if (this.UnloadAppForm) {
      if (data) {
        this.UnloadAppForm.setFieldsValue({
          app: data.app || '',
          appUrl: data.appUrl || undefined,
          appVersion: data.appVersion || undefined,
          doType: data.doType || undefined,
          doTimeStr: data.doTimeStr || undefined,
        });
      } else {
        this.UnloadAppForm.setFieldsValue({
          app: undefined,
          appUrl: undefined,
          appVersion: undefined,
          doType: undefined,
          doTimeStr: undefined,
        });
      }
    }
  }
  setModalAisleTaskSettingData = (data) => {
    let result = []
    let p = []
    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        p.push(result[i])
        p.push(result[i] + 1)
      }
    }
    let AisleList = []
    for (let i = 0; i < 48; i++) {
      let r = {}
      for (let j = 0; j < p.length; j++) {
        if (parseInt(p[j]) === (i+1)) {
          r = {
            value: i + 1,
            key: i + 1,
            code: i + 1,
            isSelected: 1
          }
          AisleList.push(r);
          break;
        }
      }
      if (!AisleList[i]) {
        r = {
          value: i + 1,
          key: i,
          code: i + 1,
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
    let key = -1
    AisleList = AisleList.map((item) => {
      return { value: item.value, key: key += 1, code: item.code, isSelected: item.isSelected ? item.isSelected : 0 }
    })
    this.setState({
      AisleList,
    });
    if (this.AisleTaskSettingForm) {
      if (data) {
        this.AisleTaskSettingForm.setFieldsValue({
          app: data.app || '',
          appUrl: data.appUrl || undefined,
          appVersion: data.appVersion || undefined,
          doType: data.doType || undefined,
          doTimeStr: data.doTimeStr || undefined,
        });
      } else {
        this.AisleTaskSettingForm.setFieldsValue({
          app: undefined,
          appUrl: undefined,
          appVersion: undefined,
          doType: undefined,
          doTimeStr: undefined,
        });
      }
    }
  }
  taskType = (value) => {
    if (value === 1) {
      this.getAppLists()
      this.setModalUpgradeAppData();
    } else if (value === 2) {
      this.getAppLists()
      this.setModalUnloadAppData();
    } else {
      this.setModalAisleTaskSettingData();
    }
    this.setState({
      taskType: value
    })
  }
  handleAdd = () => {
    const { taskType } = this.state
    let params = {};
    if (taskType === 1) {
      this.UpgradeAppForm.validateFields((err, values) => {
        if (err) {
          return;
        }
        params = {
          ...values,
          doTimeStr: values.doTimeStr.format('YYYY-MM-DD HH:mm'),
        };
      })
    } else if (taskType === 2) {
      this.UnloadAppForm.validateFields((err, values) => {
        if (err) {
          return;
        }
        params = {
          ...values,
          doTimeStr: values.doTimeStr.format('YYYY-MM-DD HH:mm'),
        };
      })
    } else {
      this.AisleTaskSettingForm.validateFields((err, values) => {
        if (err) {
          return;
        }
        params = {
          ...values,
          doTimeStr: values.doTimeStr.format('YYYY-MM-DD HH:mm'),
        };
      })
    }
    this.props.dispatch({
      type: 'taskSetting/taskAdd',
      payload: {
        params,
      },
    }).then((res) => {
      if (res.code !== 0) {

      }
    });
  }
  watchTask = () => {

  }
  editTask = () => {

  }
  deleteTask = () => {

  }
  HandleAisle = (val) => {
    console.log('val', val)
    this.setState({
      AisleList: []
    }, () => {
      this.setState({
        AisleList: val,
      });
    })
  }
  // 选择机器开始
  onEditMachineHandleAddClick = () => {
    // console.log('选择机器确认');
    // let selectCity = this.state.selectCity
    // if (selectCity.length > 0) {
    //   this.uniq(selectCity);
    //   // console.log('selectCity', this.state.machines)
    // } else {
    //   message.error('请先选择机器');
    // }
    console.log('this.state.targetData.machines', this.state.targetData)
    if (this.state.targetData.length >0) {
      let arr = this.state.targetData
      let selectCityName = []
      for (var i = 0; i < arr.length; i++) {
        var item = arr[i]
        if (!(item['province'] in selectCityName)) {
          selectCityName[item['province']] = item.province;
        }
      }
      selectCityName = Object.values(selectCityName)
      this.setState({
        machineNum: this.state.targetData.length,
        selectCityName,
        machines: this.state.targetData,
      }, () => {
        // console.log(this.state.machines)
        this.setState({
          editMachineModalVisible: false,
        });
      });
    } else {
      message.config({
        top: 100,
        duration: 2,
        maxCount: 1,
      });
      message.warn('请先选择机器');
    }
  }
  openSelectMachineModal = () => {
    this.setState({
      sourceData: [],
      selectMachineFlag: true,
      checkedKeys: [],
      expandedKeys: [],
      autoExpandParent: true,
    }, () => {
      this.setState({
        editMachineModalVisible: true,
      }, () => {
        this.getAreaList({level: 1});
      });
      this.selectMachineform.setFieldsValue({
        provinceCityAreaTrade: undefined
      })
    });
  }
  getAreaList = (selectedOptions) => {
    let code = '';
    let targetOption = null;
    let params = { code: code }
    if (selectedOptions) {
      if (selectedOptions.level) {
        params = { ...params, level: 1, startTime: this.state.machineStartTime, endTime: this.state.machineEndTime }
      } else if (selectedOptions.code) {
        params = { code: selectedOptions.code, startTime: this.state.machineStartTime, endTime: this.state.machineEndTime }
      } else {
        targetOption = selectedOptions[selectedOptions.length - 1];
        code = targetOption.value;
        targetOption.loading = true;
        params = { code: code, level: targetOption.level + 1, startTime: this.state.machineStartTime, endTime: this.state.machineEndTime}
      }
    }
    this.props.dispatch({
      type: 'taskSetting/taskSelectAreaMachines',
      payload: {
        params,
      },
    }).then((res) => {
      if (selectedOptions.level) {
        this.setState({
          insertOptions: res,
        });
      } else if (selectedOptions.code) {
        this.setState({
          sourceData: res,
        });
      } else {
        targetOption.loading = false;
        targetOption.children = res
        this.setState({
          insertOptions: [...this.state.insertOptions],
        });
      }
    });
  }
  addData = async () => {
    const selectedRows = this.state.selectedRows
    for (let a of selectedRows) {
      let selectedRowKeys = this.state.selectedRowKeys.indexOf(a.machineCode)
      this.state.selectedRowKeys.splice(selectedRowKeys, 1)
      await this.handleDelete(a, a.machineCode)
    }
    // console.log(this.state.repeat)
    if (this.state.repeat.length > 0) {
      Modal.warning({
        title: '以下机器和已选机器重复',
        content: this.state.repeat.join('\n') + '',
      });
    }
    this.setState({
      selectAll: false
    })
  }
  unique = (arr) => {
    let targetData = []
    let repeat = []
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i]
      if (!(item['machineCode'] in targetData)) {
        targetData[item['machineCode']] = item;
      } else {
        repeat = [...this.state.repeat, item.machineCode]
      }
    }
    this.setState({
      repeat,
    })
    return Object.values(targetData)
  }
  handleSave = (row) => {
    const newData = [...this.state.sourceData];
    const index = newData.findIndex(item => row.machineCode === item.machineCode);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    console.log('newDatahandleSave', newData)
    this.setState({ sourceData: newData });
  }
  handleDelete = (a, key) => {
    // console.log('key', key, this.state.targetData)
    if (a.planed === '1') {
      message.config({
        top: 100,
        duration: 2,
        maxCount: 1,
      });
      message.error('该机器已占用，重新选择！')
      return;
    }
    const dataSource = [...this.state.sourceData];
    // console.log('dataSource', dataSource)
    this.setState({ sourceData: dataSource.filter(item => item.machineCode !== key) });
    let targetData = [...this.state.targetData, ...dataSource.filter(item => item.machineCode === key)]
    // console.log('targetData', targetData)
    targetData = this.unique(targetData)
    this.setState({ targetData });
  }
  targetHandleSave = (row) => {
    const newData = [...this.state.targetData];
    const index = newData.findIndex(item => row.machineCode === item.machineCode);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    console.log('newDatahandleSave', newData)
    this.setState({ targetData: newData });
  }
  targetHandleDelete = (key) => {
    // console.log('key', key)
    const dataSource = [...this.state.targetData];
    this.setState({ targetData: dataSource.filter(item => item.machineCode !== key) });
  }
  onChangeRowSelection = (selectedRowKeys, selectedRows) => {
    // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    this.setState({
      sourceKey: selectedRowKeys,
      selectedRowKeys,
    })
  }
  onSelectAll = (selected, selectedRows, changeRows) => {
    this.setState({
      selectedRows,
      selectAll: selected
    })
    console.log(selected, selectedRows, changeRows);
  }
  onLeftSelect = (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
    this.setState({
      selectedRows,
      selectAll: true
    })
  }
  // 回显省市区商圈数据源结束
  // 选择机器控件
  findSourceData = () => {
    this.selectMachineform.validateFields((err, fieldsValue) => {
      if (err) return;
      let localCode = ''
      if (fieldsValue.code) {
        if (fieldsValue.code.length > 0) {
          localCode = fieldsValue.code[fieldsValue.code.length - 1]
        }
      }
      // console.log('localCode', localCode, fieldsValue, fieldsValue.provinceCityAreaTrade)
      if (!localCode) {
        message.config({
          top: 100,
          duration: 2,
          maxCount: 1,
        });
        message.error('请选择一个地区')
        return;
      }
      this.getAreaList({code: localCode})
    });
  }
  // openSelectMachineModal = () => {
  //   this.setState({
  //     editMachineModalVisible: true,
  //   }, () => {
  //     this.getAreaList({level: 1});
  //   });
  //   this.selectMachineform.setFieldsValue({
  //     provinceCityAreaTrade: undefined
  //   })
  // }
  onEditMachineHandleModalVisibleClick = () => {
    this.setState({
      editMachineModalVisible: false,
    });
  }
  selectMachineFormRef = (form) => {
    this.selectMachineform = form;
  }
  // 选择机器结束
  renderAdvancedForm() {
    const { form } = this.props;
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
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="选择任务类型">
              {getFieldDecorator('type')(
                <Select placeholder="选择任务类型">
                  {taskTypeOptions.map((item) => {
                    return (
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={9} sm={24}>
            <FormItem label="选择任务状态">
              {getFieldDecorator('status')(
                <Select placeholder="选择任务状态">
                  {taskStatusOptions.map((item) => {
                    return (
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    );
                  })}
                </Select>
              )}
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
      taskSetting: { list },
      loading,
    } = this.props;
    const { modalType, modalVisible, taskType, AisleList, appLists, editModalConfirmLoading, selectCityName, machineNum } = this.state
    const columns = [
      {
        title: '任务ID',
        dataIndex: 'id',
        width: '10%',
      },
      {
        title: '任务类型',
        width: '15%',
        dataIndex: 'type',
        render(val) {
          return <span>{taskType[val]}</span>;
        },
      },
      {
        title: '执行时间',
        width: '15%',
        dataIndex: 'doTime',

      },
      {
        title: '任务状态',
        width: '15%',
        dataIndex: 'status',
        render(val) {
          return <span>{taskStatus[val]}</span>;
        },
      },
      {
        title: '执行结果',
        width: '10%',
        render: (text, item) => (
          <div className={styles.goodsBox}>
            <div>总任务数：{item.taskAll}</div>
            <div>成功任务数：{item.taskSuss}</div>
            <div>执行失败： {item.taskAll - item.taskSuss}</div>
          </div>
        )
      },
      {
        title: '创建人',
        width: '10%',
        dataIndex: 'creater',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
      },
      {
        fixed: 'right',
        width: 150,
        title: '操作',
        render: (text, item) => (
          <Fragment>
            <a onClick={() => this.watchTask(item)}>查看</a>
            <Divider type="vertical" />
            <a onClick={() => this.editTask(item)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.deleteTask(item)}>删除</a>
          </Fragment>
        ),
      },
    ];
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
          </div>
        </Card>
        <Modal
          title={
            <div class="modalBox">
              <span class="leftSpan"></span>
              <span class="modalTitle">{!modalType ? '编辑任务' : '新增任务'}</span>
            </div>
          }
          visible={modalVisible}
          onOk={this.handleAdd}
          onCancel={() => this.handleModalVisible(false)}
          confirmLoading={editModalConfirmLoading}
          width={1250} >
          <div className="manageAppBox">
            <Form>
              <FormItem {...formItemLayout} label="选择任务类型">
                  <Select placeholder="请选择" onSelect={this.taskType}>
                  {taskTypeOptions.map((item) => {
                    return (
                      <Option value={item.id} key={item.id} data-id={item.id} data-type={item.type}>{item.name}</Option>
                    );
                  })}
                </Select>
              </FormItem>
              <FormItem {...formItemLayout} label="选择机器">
                  {/*<div>*/}
                    {/*<Button type="primary" onClick={this.openSelectMachineModal}>+ 选择</Button>*/}
                  {/*</div>*/}
                  <div>
                    { selectCityName.length > 0 ? '已选择' + machineNum + '台机器，分别位于' + selectCityName.join('、') : null }
                    <Button type="primary" onClick={this.openSelectMachineModal}>+ 选择</Button>
                  </div>
              </FormItem>
              {/*升级App*/}
              <div style={{ display: taskType === 1 ? '' : 'none' }}>
                <UpgradeAppForm
                  ref={this.saveUpgradeAppFormRef}
                  appLists={appLists}
                  disabledStartDate={this.disabledStartDate}
                  disabledTime={this.disabledTime}
                />
              </div>
              {/*卸载App unload*/}
              <div style={{ display: taskType === 2 ? '' : 'none' }}>
                <UnloadAppForm
                  ref={this.saveUnloadAppFormRef}
                  appLists={appLists}
                  disabledStartDate={this.disabledStartDate}
                  disabledTime={this.disabledTime}
                />
              </div>
              {/*合并货道AisleTaskSetting*/}
              <div style={{ display: (taskType === 3 || taskType === 4) ? '' : 'none' }}>
                <AisleTaskSettingForm
                  ref={this.saveAisleTaskSettingFormRef}
                  AisleList={AisleList}
                  HandleAisle={this.HandleAisle}
                  disabledStartDate={this.disabledStartDate}
                  disabledTime={this.disabledTime}
                />
              </div>
            </Form>
          </div>
        </Modal>
        <SelectMachineForm
          ref={this.selectMachineFormRef}
          editMachineModalVisible={this.state.editMachineModalVisible}
          onEditMachineHandleAddClick={this.onEditMachineHandleAddClick}
          onEditMachineHandleModalVisibleClick={this.onEditMachineHandleModalVisibleClick}
          editMachineEditModalConfirmLoading={this.state.editMachineEditModalConfirmLoading}
          insertOptions={this.state.insertOptions}
          loadData={this.getAreaList}
          addData={this.addData}
          targetData={this.state.targetData}
          onChangeRowSelection={this.onChangeRowSelection}
          onSelectAll={this.onSelectAll}
          selectedRowKeys={this.state.selectedRowKeys}
          sourceData={this.state.sourceData}
          handleSave={this.handleSave}
          // handleDelete={this.handleDelete}
          selectAll={this.state.selectAll}
          targetHandleSave={this.targetHandleSave}
          targetHandleDelete={this.targetHandleDelete}
          onLeftSelect={this.onLeftSelect}
          findSourceData={this.findSourceData}
        />
      </PageHeaderLayout>
    );
  }
}
