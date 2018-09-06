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
import StandardTable from '../../components/StandardTable';
import {getAccountMenus} from "../../utils/authority";

const FormItem = Form.Item;
const { Option } = Select;
const taskTypeOptions = [{id: 1, name: '升级App'}, {id: 2, name: '卸载App'}, {id: 3, name: '合并货道'}, {id: 4, name: '拆分货道'}]
const taskTypeLists = ['', '升级App', '卸载App', '合并货道', '拆分货道']
const taskStatusOptions = [{id: 0, name: '未执行'}, {id: 1, name: '待执行'}, {id: 2, name: '已执行'} ]
const taskStatus = ['未执行', '待执行', '已执行', '待执行']
const doType = [{id: 1, name: 'socket'}, {id: 2, name: 'push'}]
const doTypeLists = ['', 'socket', 'push']
const doStatus = ['未执行', '成功', '失败']

const  TaskForm = Form.create()(
  (props) => {
    const {
      form, appLists, modalData, taskType, handleAdd,
      handleModalVisible, modalVisible, selectCityName, machineNum,
      saveUpgradeAppFormRef, disabledStartDate, disabledTime, AisleList,
      HandleAisle, saveUnloadAppFormRef, saveAisleTaskSettingFormRef, editModalConfirmLoading  } = props;
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
            <span class="modalTitle">{modalData.id ? '编辑任务' : '新增任务'}</span>
          </div>
        }
        visible={modalVisible}
        onOk={handleAdd}
        onCancel={() => handleModalVisible(false)}
        confirmLoading={editModalConfirmLoading}
        width={1250} >
        <div className="manageAppBox">
          <Form>
            <FormItem {...formItemLayout} label="选择任务类型" style={{ display: modalData.id ? '' : 'none'}}>
              <Input value={taskTypeLists[modalData.type]} disabled/>
            </FormItem>
            <FormItem {...formItemLayout} label="选择机器">
              {/*<div>*/}
              {/*<Button type="primary" onClick={this.openSelectMachineModal}>+ 选择</Button>*/}
              {/*</div>*/}
              <div>
                { modalData.remark ? modalData.remark : (selectCityName.length > 0 ? '已选择' + machineNum + '台机器，分别位于' + selectCityName.join('、') : null) }
                <Button type="primary" onClick={this.openSelectMachineModal}>+ 选择</Button>
              </div>
            </FormItem>
          </Form>
          {/*升级App*/}
          <div style={{ display: (taskType === 1 || modalData.type === 1) ? '' : 'none' }}>
            <UpgradeAppForm
              ref={saveUpgradeAppFormRef}
              appLists={appLists}
              disabledStartDate={disabledStartDate}
              disabledTime={disabledTime}
            />
          </div>
          {/*卸载App unload*/}
          <div style={{ display: (taskType === 2 || modalData.type === 2) ? '' : 'none' }}>
            <UnloadAppForm
              ref={saveUnloadAppFormRef}
              appLists={appLists}
              disabledStartDate={disabledStartDate}
              disabledTime={disabledTime}
            />
          </div>
          {/*合并货道AisleTaskSetting*/}
          <div style={{ display: (taskType === 3 || modalData.type === 3 || taskType === 4 || modalData.type === 4) ? '' : 'none' }}>
            <AisleTaskSettingForm
              ref={saveAisleTaskSettingFormRef}
              AisleList={AisleList}
              HandleAisle={HandleAisle}
              disabledStartDate={disabledStartDate}
              disabledTime={disabledTime}
            />
          </div>
        </div>
      </Modal>
    );
  });
const UpgradeAppForm = Form.create({mapPropsToFields(props){
    return {
      appId:Form.createFormField({
        value:props.data.appId
      }),
      appVersion:Form.createFormField({
        value:props.data.appVersion
      }),
      appUrl:Form.createFormField({
        value:props.data.appUrl
      }),
      doTimeStr:Form.createFormField({
        value:props.data.doTime ? moment(props.data.doTime) : undefined
      }),
      doType:Form.createFormField({
        value:props.data.doType
      }),
    }
  }})(
  (props) => {
    const { form, appLists, disabledStartDate, disabledTime} = props;
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
      <Form>
            <FormItem {...formItemLayout} label="选择App">
              {getFieldDecorator('appId', {
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
                rules: [{ required: false, message: '选择开始时间' }],
              })(
                <DatePicker
                  disabledDate={disabledStartDate}
                  disabledTime={disabledTime}
                  // showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
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
                      <Option key={item.id} value={item.id} >{item.name}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
      </Form>
    );
  });
const UnloadAppForm = Form.create({mapPropsToFields(props){
    return {
      appId:Form.createFormField({
        value:props.data.appId
      }),
      doTimeStr:Form.createFormField({
        value:props.data.doTime ? moment(props.data.doTime) : undefined
      }),
      doType:Form.createFormField({
        value:props.data.doType
      }),
    }
  }})(
  (props) => {
    const { form, appLists, disabledStartDate, disabledTime,} = props;
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
      <Form>
        <FormItem {...formItemLayout} label="选择App">
          {getFieldDecorator('appId', {
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
            rules: [{ required: false, message: '选择执行时间' }],
          })(
            <DatePicker
              disabledDate={disabledStartDate}
              disabledTime={disabledTime}
              // showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
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
                  <Option key={item.id} value={item.id}>{item.name}</Option>
                );
              })}
            </Select>
          )}
        </FormItem>
      </Form>
    );
  });
const AisleTaskSettingForm = Form.create({mapPropsToFields(props){
    return {
      doTimeStr:Form.createFormField({
        value:props.data.doTime ? moment(props.data.doTime) : undefined
      }),
      doType:Form.createFormField({
        value:props.data.doType
      }),
    }
  }})(
  (props) => {
    const { form, AisleList, disabledStartDate, HandleAisle, disabledTime, selectedNo } = props;
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
      <Form>
        <FormItem {...formItemLayout} label="选择执行时间">
          {getFieldDecorator('doTimeStr', {
            rules: [{ required: false, message: '选择执行时间' }],
          })(
            <DatePicker
              disabledDate={disabledStartDate}
              disabledTime={disabledTime}
              // showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
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
                  <Option key={item.id} value={item.id}>{item.name}</Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem>
          <TaskAisletable
            HandleAisle={HandleAisle}
            modalData={false}
            AisleList={AisleList}
            selectedNo={selectedNo}
          />
        </FormItem>
      </Form>
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
      dataIndex: 'machineCode',
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
      title: '机器编号',
      dataIndex: 'machineCode',
      width: '30%'
    }, {
      title: '机器点位',
      dataIndex: 'name',
      width: '50%'
    }, {
      title: '网络',
      // dataIndex: 'planed',
      render: (val, record) => {
        return <div className={styles.netStatusStyles}>
          <img src={require(`../../assets/images/signalIcon/sign${(record.planed === null || record) ? 0 : record.planed}.png`)}/>
        </div>;
      },
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
            <div style={{ marginBottom: '10px' }}>
              <Alert
                message="任务类型是合并/拆分货道，请选择同一批次的机器，否则无法执行操作。机器编号开头两位数代表机器批次。"
                type="warning"
                showIcon
              />
            </div>
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
                    rowKey={record => record.machineId}
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
                <div style={{ marginLeft: '20px', marginTop: '10px' }}>
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
                    rowKey={record => record.machineId}
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

const watchColumns = [{
  title: '机器编号',
  dataIndex: 'machineCode',
  width: '30%'
}, {
  title: '机器点位',
  dataIndex: 'name',
  width: '50%'
}, {
  title: '执行结果',
  dataIndex: 'doStatus',
  render(val) {
    return doStatus[val] ? doStatus[val] : '-';
  },
}];

const WatchUpgradeAppForm = Form.create()(
  (props) => {
    const { modalData, goOn } = props;
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
      <div>
        <FormItem {...formItemLayout} label="任务类型">
          <span>{taskTypeLists[modalData.type]}</span>
        </FormItem>
        <FormItem {...formItemLayout} label="APP名称">
          <span>{modalData.appName}</span>
        </FormItem>
        <FormItem {...formItemLayout} label="升级版本">
          <span>{modalData.appVersion}</span>
        </FormItem>
        <FormItem {...formItemLayout} label="升级链接">
          <span>{modalData.appUrl}</span>
        </FormItem>
        <FormItem {...formItemLayout} label="执行时间">
          <span>{modalData.doTime}</span>
        </FormItem>
        <FormItem {...formItemLayout} label="执行方式">
          <span>{doTypeLists[modalData.doType]}</span>
        </FormItem>
        <FormItem {...formItemLayout} label="任务进度">
          <Table
            rowKey={record => record.machineId}
            columns={watchColumns}
            dataSource={modalData.machineList}
            scroll={{ y: 200 }}
            pagination={false}
          />
        </FormItem>
        <Button onClick={() => goOn(modalData)} className={styles.btnGoon}  style={{ display: modalData.flag !== 0 ? 'flex' : 'none' }}>
          继续执行
        </Button>
      </div>
    );
  });
const WatchUnloadAppForm = Form.create()(
  (props) => {
    const { modalData, goOn } = props;
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
      <div>
        <FormItem {...formItemLayout} label="任务类型">
          <span>{taskTypeLists[modalData.type]}</span>
        </FormItem>
        <FormItem {...formItemLayout} label="APP名称">
          <span>{modalData.appName}</span>
        </FormItem>
        <FormItem {...formItemLayout} label="执行时间">
          <span>{modalData.doTime}</span>
        </FormItem>
        <FormItem {...formItemLayout} label="执行方式">
          <span>{doTypeLists[modalData.doType]}</span>
        </FormItem>
        <FormItem {...formItemLayout} label="任务进度">
          <Table
            rowKey={record => record.machineId}
            columns={watchColumns}
            dataSource={modalData.machineList}
            scroll={{ y: 200 }}
            pagination={false}
          />
        </FormItem>
        <Button onClick={() => goOn(modalData)} className={styles.btnGoon} style={{ display: modalData.flag !== 0 ? 'flex' : 'none' }}>
          继续执行
        </Button>
      </div>
    );
  });
const WatchAisleTaskSettingForm = Form.create()(
  (props) => {
    const { modalData, AisleList, goOn } = props;
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
      <div>
        <FormItem {...formItemLayout} label="任务类型">
          <span>{taskTypeLists[modalData.type]}</span>
        </FormItem>
        <FormItem {...formItemLayout} label="执行时间">
          <span>{modalData.doTime}</span>
        </FormItem>
        <FormItem {...formItemLayout} label="执行方式">
          <span>{doTypeLists[modalData.doType]}</span>
        </FormItem>
        <FormItem>
          <TaskAisletable
            modalData={true}
            AisleList={AisleList}
          />
        </FormItem>
        <FormItem {...formItemLayout} label="任务进度">
          <Table
            rowKey={record => record.machineId}
            columns={watchColumns}
            dataSource={modalData.machineList}
            scroll={{ y: 200 }}
            pagination={false}
          />
        </FormItem>
        <Button onClick={() => goOn(modalData)} className={styles.btnGoon} style={{ display: modalData.flag !== 0 ? 'flex' : 'none' }}>
          继续执行
        </Button>
      </div>
    );
  });

const GoOnForm = Form.create()(
  (props) => {
    const { form, editGoOnWayVisible, editGoOnWayAddClick, editGoOnWayVisibleClick, editGoOnWayConfirmLoading  } = props;
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
            <span class="modalTitle">执行方式</span>
          </div>
        }
        visible={editGoOnWayVisible}
        onOk={editGoOnWayAddClick}
        onCancel={() => editGoOnWayVisibleClick()}
        confirmLoading={editGoOnWayConfirmLoading}
        width={800}
      >
        <div className="manageAppBox">
          <Form>
            <FormItem {...formItemLayout} label="选择执行方式">
              {getFieldDecorator('doType', {
                rules: [{ required: true, message: '请选择执行方式' }],
              })(
                <Select placeholder="请选择执行方式">
                  {doType.map((item) => {
                    return (
                      <Option key={item.id} value={item.id} >{item.name}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
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
    modalData: {},
    selectedRows: [],
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
    repeat: [],
    selectedRowKeys: [],
    options: [],
    defaultValue: [],

    WatchModalVisible: false,
    editGoOnWayVisible: false,
    editGoOnWayConfirmLoading: false,
    remark: '',

    machineNumber: '',
    selectedNo: 28,

    account: {}
  };
  componentDidMount() {
    this.getLists();
    this.getAccountMenus(getAccountMenus())
  }
  getAccountMenus = (setAccountMenusList) => {
    const pointSettingMenu = setAccountMenusList.filter((item) => item.path === 'machine')[0]
      .children.filter((item) => item.path === 'task-setting')
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
  componentDidUpdate(comp,state) {
    // console.log(arguments)
    // console.log('当前%s组件卸载app组件',comp.constructor === UpgradeAppForm.constructor?'是':'不是')
    // if (this.state.modalVisible) {
    //   this.setModalUnloadAppData(this.state.modalData)
    // }
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
  disabledStartDate = (startValue) => {
    return startValue < moment(new Date().setDate(new Date().getDate() - 1)).endOf('day');
  }
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
      remark: '',
      selectCityName: [],
      targetData: [],
      taskType: undefined,
      AisleList: [],
      selectedNo: 28,
    }, () => {
      this.setState({
        modalVisible: flag,
        modalData: {},
      });
    })
  };
  handleWatchModalVisible = (flag) => {
    this.setState({
      targetData: [],
      taskType: undefined,
    })
    this.setState({
      WatchModalVisible: flag,
      modalData: {},
    });
  }
  // 设置modal 数据
  setModalUpgradeAppData = (data) => {
    if (this.UpgradeAppForm) {
      if (data) {
        this.UpgradeAppForm.setFieldsValue({
          app: data.app || '',
          appUrl: data.appUrl || undefined,
          appVersion: data.appVersion || undefined,
          doType: data.doType || undefined,
          doTimeStr: data.doTime ? moment(data.doTime) : undefined || undefined,
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
          appId: data.appId || '',
          appUrl: data.appUrl || undefined,
          appVersion: data.appVersion || undefined,
          doType: data.doType || undefined,
          doTimeStr: moment(data.doTime) || undefined,
        });
      } else {
        this.UnloadAppForm.setFieldsValue({
          appId: undefined,
          appUrl: undefined,
          appVersion: undefined,
          doType: undefined,
          doTimeStr: undefined,
        });
      }
    }
  }
  setModalAisleTaskSettingData = (data) => {
    if (this.AisleTaskSettingForm) {
      if (data) {
        this.AisleTaskSettingForm.setFieldsValue({
          doType: data.doType || undefined,
          doTimeStr: moment(data.doTime) || undefined,
        });
      } else {
        this.AisleTaskSettingForm.setFieldsValue({
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
    let params = {};
    const { taskType, AisleList, modalData } = this.state
    if (this.state.targetData.length === 0) {
      message.config({
        top: 100,
        duration: 2,
        maxCount: 1,
      });
      message.error('请先选择机器')
      return;
    }
    if (taskType === 1 || modalData.type === 1) {
      this.UpgradeAppForm.validateFields((err, values) => {
        if (err) {
          return;
        }
        params = {
          type: taskType,
          ...values,
          doTimeStr: values.doTimeStr ? values.doTimeStr.format('YYYY-MM-DD HH:mm') : undefined,
          machineList: this.state.targetData,
        };
        this.taskAdd(params)
      })
    } else if (taskType === 2 || modalData.type === 2) {
      this.UnloadAppForm.validateFields((err, values) => {
        if (err) {
          return;
        }
        params = {
          type: taskType,
          ...values,
          doTimeStr: values.doTimeStr ? values.doTimeStr.format('YYYY-MM-DD HH:mm') : undefined,
          machineList: this.state.targetData,
        };
        this.taskAdd(params)
      })
    } else {
      this.AisleTaskSettingForm.validateFields((err, values) => {
        if (err) {
          return;
        }
        let channelCode = []
        for (let i = 0; i < AisleList.length; i ++) {
          if (AisleList[i].isSelected === 1) {
            if (AisleList[i].value % 2 !== 0) {
              channelCode.push(AisleList[i].value)
            }
          }
        }
        if (channelCode.length === 0) {
          message.config({
            top: 100,
            duration: 2,
            maxCount: 1,
          });
          message.error('请先选择货道号')
          return;
        }
        channelCode = channelCode.join(',')
        console.log('channelCode', channelCode)
        params = {
          type: taskType,
          ...values,
          doTimeStr: values.doTimeStr ? values.doTimeStr.format('YYYY-MM-DD HH:mm') : undefined,
          machineList: this.state.targetData,
          channelCode
        };
        this.taskAdd(params)
      })
    }
  }
  joinChannelCode = (data) => {
    let result = data ? `${data.channelCode},` : []
    let p = []
    if (result.length > 0) {
      result = result.split(',')
      result = result.slice(0, result.length - 1)
      for (let i = 0; i < result.length; i++) {
        p.push(parseInt(result[i]))
        p.push(parseInt(result[i]) + 1)
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
    return AisleList.map((item) => {
      return { value: item.value, key: key += 1, code: item.code, isSelected: item.isSelected ? item.isSelected : 0 }
    })
  }
  joinChannelCode19 = (data) => {
    let result = data ? `${data.channelCode},` : []
    let p = []
    if (result.length > 0) {
      result = result.split(',')
      result = result.slice(0, result.length - 1)
      for (let i = 0; i < result.length; i++) {
        p.push(parseInt(result[i]))
        p.push(parseInt(result[i]) + 1)
      }
    }
    let AisleList = []
    for (let i = 0; i < 56; i++) {
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
    let tr6 = AisleList.filter(item => item.value <= 56 && item.value >= 51)
    AisleList = [...tr1, ...tr2, ...tr3, ...tr4, ...tr5, ...tr6]
    let key = -1
    return AisleList.map((item) => {
      return { value: item.value, key: key += 1, code: item.code, isSelected: item.isSelected ? item.isSelected : 0 }
    })
  }
  taskAdd = (params) => {
    const { modalData } = this.state
    if (modalData.id) {
      // 编辑
      params = { ...params, id: modalData.id, type: modalData.type}
      this.props.dispatch({
        type: 'taskSetting/taskUpdate',
        payload: {
          params,
        },
      }).then((res) => {
        if (res.code === 0) {
          this.setState({
            modalVisible: false,
            modalData: {}
          });
        }
      });
    } else {
      this.props.dispatch({
        type: 'taskSetting/taskAdd',
        payload: {
          params,
        },
      }).then((res) => {
        if (res.code === 0) {
          this.setState({
            modalVisible: false,
            taskType: undefined
          });
          this.getLists();
        }
      });
    }
  }
  watchTask = async (item, flag) => {
    let res = await this.getTaskDetail(item)
    let modalData = res
    modalData['flag'] = flag
    let AisleList = await this.joinChannelCode(res)
    await this.setState({
      targetData: res.machineList,
      WatchModalVisible: true,
      modalData,
      AisleList,
    })
  }
  editTask = async (item) => {
    let res = await this.getTaskDetail(item)
    let AisleList
    const selectedNo = res.machineList[0].machineCode.slice(0, 2)
    if (selectedNo === '18') {
      AisleList = await this.joinChannelCode(res)
    } else if (selectedNo === '19') {
      AisleList = await this.joinChannelCode19(res)
    }
    this.getAppLists()
    this.setState({
      targetData: res.machineList,
      modalData: res,
      modalVisible: true,
      remark: res.remark,
      AisleList,
      taskType: res.type,
      selectedNo: selectedNo === '18' ? 28 : 38
    })
    // setTimeout(() => {
    //   if (res.type === 1) {
    //     this.getAppLists()
    //     this.setModalUpgradeAppData(res);
    //   } else if (res.type === 2) {
    //     this.getAppLists()
    //     this.setModalUnloadAppData(res);
    //   } else {
    //     this.setModalAisleTaskSettingData(res);
    //   }
    // }, 500)
    // taskUpdate
    // this.getLists();
  }
  getTaskDetail = async(item) => {
    return await this.props.dispatch({
      type: 'taskSetting/taskDetail',
      payload: {
        params: {
          id: item.id
        },
      },
    })
  }
  deleteTask = (item) => {
   // taskDelete
    this.props.dispatch({
      type: 'taskSetting/taskDelete',
      payload: {
        params: {
          id: item.id
        },
      },
    }).then((res) => {
      if (res.code === 0) {
        this.getLists();
      }
    });
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
    console.log('this.state.targetData.machines', this.state.targetData)
    const { taskType } = this.state
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
        remark: '',
        machineNum: this.state.targetData.length,
        selectCityName,
        machines: this.state.targetData,
      }, () => {
        this.setState({
          editMachineModalVisible: false,
        });
      });
      if (taskType === 3 || taskType === 4) {
        //
        const Number = this.state.targetData[0].machineCode.slice(0, 2)
        if (Number === '18') {
          let AisleList = this.joinChannelCode()
          this.setState({
            AisleList,
            selectedNo: 28,
          });
        } else if (Number === '19') {
          let AisleList = this.joinChannelCode19()
          this.setState({
            AisleList,
            selectedNo: 38,
          });
        }
      }
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
    if (!this.state.taskType) {
      message.config({
        top: 100,
        duration: 2,
        maxCount: 1,
      });
      message.warn('请先选择任务类型');
      return
    }
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
        code: undefined,
        machineCode: undefined,
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
    for (let [i, a] of  new Map(selectedRows.map((item, i) => [i, item]))) {
      let selectedRowKeys = this.state.selectedRowKeys.indexOf(a.machineCode)
      // console.log('selectedRowKeys', selectedRowKeys)
      this.state.selectedRowKeys.splice(selectedRowKeys, 1)
      const machineNumber = await this.checkMachineNumber(selectedRows)
      if (a.machineCode.slice(0, 2) !== machineNumber) {
        Modal.warning({
          content: '请选择同一批次的机器，否则无法执行操作',
        });
        return false
      }
      // console.log('selectedRowKeys', a.machineCode.slice(0, 2), machineNumber)
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
  checkMachineNumber = (arr) => {
   for (let [i, a] of  new Map(arr.map((item, i) => [i, item]))) {
     if (i === 0 && this.state.targetData.length === 0) {
       return a.machineCode.slice(0, 2)
     } else if (i === 0 && this.state.targetData.length > 0) {
       return this.state.targetData[0].machineCode.slice(0, 2)
     }
   }
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
    const dataSource = [...this.state.sourceData];
    this.setState({ sourceData: dataSource.filter(item => item.machineCode !== key) });
    let targetData = [...this.state.targetData, ...dataSource.filter(item => item.machineCode === key)]
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
  onEditMachineHandleModalVisibleClick = () => {
    this.setState({
      editMachineModalVisible: false,
    });
    if (this.state.modalData.machines) {
      this.setState({
        targetData: this.state.modalData.machines,
      })
    }
  }
  selectMachineFormRef = (form) => {
    this.selectMachineform = form;
  }
  // 选择机器结束
  // goOn继续执行
  saveGoOnFormRef = (form) => {
    this.GoOnForm = form;
  }
  goOn = (item) => {
    this.setState({
      editGoOnWayVisible: true,
      modalData: item,
    });
  }
  editGoOnWayAddClick = () => {
    this.GoOnForm.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.props.dispatch({
        type: 'taskSetting/taskUpdateStatus',
        payload: {
          params: {
            id: this.state.modalData.id,
            status: 3,
            ...values,
          },
        },
      }).then((res) => {
        if (res.code === 0) {
          this.getLists();
          this.setState({
            editGoOnWayVisible: false,
            WatchModalVisible: false
          });
        }
      });
    })
  }
  editGoOnWayVisibleClick = (flag) => {
    this.setState({
      editGoOnWayVisible: flag,
    });
  }
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
      taskSetting: { list, page },
      loading,
    } = this.props;
    const { modalType, WatchModalVisible, modalVisible, taskType, AisleList,
      appLists, editModalConfirmLoading, selectCityName, machineNum, modalData,
      editGoOnWayVisible, editGoOnWayConfirmLoading, selectedRows, remark, selectedNo, account } = this.state
    console.log('taskType', taskType)
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
          return <span>{taskTypeLists[val]}</span>;
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
            <a onClick={() => this.watchTask(item, item.taskAll - item.taskSuss)} style={{ display: !account.detail ? 'none' : ''}}>查看</a>
            <Divider type="vertical" style={{ display: item.status === 0 ? '' : 'none' }} />
            <a onClick={item.status === 0 ? () => this.editTask(item) : null }
               style={{ display: (item.status !== 0 && !account.update) ? 'none' : '' }}
            >编辑</a>
            <Divider type="vertical" style={{ display: item.status === 0 ? '' : 'none' }}/>
            <a onClick={item.status === 0 ? () => this.deleteTask(item) : null }
               style={{ display: (item.status !== 0 && !account.delete) ? 'none' : '' }}>删除</a>
          </Fragment>
        ),
      },
    ];
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
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
          <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)} style={{ display: !account.add ? 'none' : '' }}>
                新建
              </Button>
            </div>
            <div className={styles.tableList} style={{ display: !account.list ? 'none' : ''}}>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={list}
                page={page}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                scrollX={1400}
                scrollY={(document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 160)}
              />
            </div>
          </div>
        </Card>
        <Modal
          title={
            <div class="modalBox">
              <span class="leftSpan"></span>
              <span class="modalTitle">{modalData.id ? '编辑任务' : '新增任务'}</span>
            </div>
          }
          visible={modalVisible}
          onOk={this.handleAdd}
          onCancel={() => this.handleModalVisible(false)}
          confirmLoading={editModalConfirmLoading}
          width={1250} >
          <div className="manageAppBox">
            <Form>
              <FormItem {...formItemLayout} label="选择任务类型" style={{ display: modalData.id ? 'none' : ''}}>
                  <Select placeholder="请选择" onSelect={this.taskType} value={taskType} >
                  {taskTypeOptions.map((item) => {
                    return (
                      <Option value={item.id} key={item.id}>{item.name}</Option>
                    );
                  })}
                 </Select>
              </FormItem>
              <FormItem {...formItemLayout} label="选择任务类型" style={{ display: modalData.id ? '' : 'none'}}>
                <Input value={taskTypeLists[modalData.type]} disabled/>
              </FormItem>
              <FormItem {...formItemLayout} label="选择机器">
                {/*<div>*/}
                  {/*{ modalData.remark ? modalData.remark : (selectCityName.length > 0 ? '已选择' + machineNum + '台机器，分别位于' + selectCityName.join('、') : null) }*/}
                  {/*<Button type="primary" onClick={this.openSelectMachineModal}>+ 选择</Button>*/}
                {/*</div>*/}
                <div>
                  {
                    (remark ? remark : (
                      selectCityName.length > 0
                        ? '已选择' + machineNum + '台机器，分别位于' + selectCityName.join('、')
                        : ''
                    ))
                  }
                  <Button type="primary" onClick={this.openSelectMachineModal}>+ 选择</Button>
                </div>
              </FormItem>
            </Form>
            {/*升级App*/}
            <div style={{ display: (taskType === 1 || modalData.type === 1) ? '' : 'none' }}>
              <UpgradeAppForm
                data={modalData}
                taskType={taskType}
                ref={this.saveUpgradeAppFormRef}
                appLists={appLists}
                disabledStartDate={this.disabledStartDate}
                disabledTime={this.disabledTime}
              />
            </div>
            {/*卸载App unload*/}
            <div style={{ display: (taskType === 2 || modalData.type === 2) ? '' : 'none' }}>
              <UnloadAppForm
                data={modalData}
                taskType={taskType}
                ref={this.saveUnloadAppFormRef}
                appLists={appLists}
                disabledStartDate={this.disabledStartDate}
                disabledTime={this.disabledTime}
              />
            </div>
            {/*合并货道AisleTaskSetting*/}
            <div style={{ display: (taskType === 3 || modalData.type === 3 || taskType === 4 || modalData.type === 4) ? '' : 'none' }}>
              <AisleTaskSettingForm
                data={modalData}
                ref={this.saveAisleTaskSettingFormRef}
                AisleList={AisleList}
                selectedNo={selectedNo}
                HandleAisle={this.HandleAisle}
                disabledStartDate={this.disabledStartDate}
                disabledTime={this.disabledTime}
              />
            </div>
          </div>
        </Modal>
        {/*<TaskForm*/}
          {/*appLists={appLists}*/}
          {/*modalData={modalData}*/}
          {/*taskType={taskType}*/}
          {/*handleAdd={this.handleAdd}*/}
          {/*handleModalVisible={this.handleModalVisible}*/}
          {/*modalVisible={modalVisible}*/}
          {/*selectCityName={selectCityName}*/}
          {/*machineNum={machineNum}*/}
          {/*saveUpgradeAppFormRef={this.saveUpgradeAppFormRef}*/}
          {/*disabledStartDate={this.disabledStartDate}*/}
          {/*disabledTime={this.disabledTime}*/}
          {/*AisleList={AisleList}*/}
          {/*HandleAisle={this.HandleAisle}*/}
          {/*saveUnloadAppFormRef={this.saveUnloadAppFormRef}*/}
          {/*saveAisleTaskSettingFormRef={this.saveAisleTaskSettingFormRef}*/}
          {/*editModalConfirmLoading={this.editModalConfirmLoading}*/}
         {/*/>*/}
        <Modal
          title={
            <div class="modalBox">
              <span class="leftSpan"></span>
              <span class="modalTitle">{'查看任务'}</span>
            </div>
          }
          visible={WatchModalVisible}
          footer={null}
          onCancel={() => this.handleWatchModalVisible(false)}
          width={1250} >
          <div className="manageAppBox">
            <Form>
              <div style={{ display: (taskType === 1 || modalData.type === 1) ? '' : 'none' }}>
                <WatchUpgradeAppForm
                  modalData={modalData}
                  goOn={this.goOn}
                />
              </div>
              <div style={{ display: (taskType === 2 || modalData.type === 2) ? '' : 'none' }}>
                <WatchUnloadAppForm
                  modalData={modalData}
                  goOn={this.goOn}
                />
              </div>
              <div style={{ display: (taskType === 3 || modalData.type === 3 || taskType === 4 || modalData.type === 4) ? '' : 'none' }}>
                <WatchAisleTaskSettingForm
                  modalData={modalData}
                  AisleList={AisleList}
                  selectedNo={selectedNo}
                  goOn={this.goOn}
                />
              </div>
            </Form>
          </div>
        </Modal>
        <GoOnForm
          ref={this.saveGoOnFormRef}
          editGoOnWayVisible={editGoOnWayVisible}
          editGoOnWayAddClick={this.editGoOnWayAddClick}
          editGoOnWayVisibleClick={this.editGoOnWayVisibleClick}
          editGoOnWayConfirmLoading={editGoOnWayConfirmLoading}
          />
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
