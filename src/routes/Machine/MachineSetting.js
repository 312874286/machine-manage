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
  Tabs,
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
  Switch,
  TimePicker,
  Alert
} from 'antd';
import StandardTable from '../../components/StandardTable';
import MachineAisleTable from '../../components/MachineAisleTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './MachineSetting.less';
import LogModal from '../../components/LogModal';
import EditableTagGroup from '../../components/Tag';
import debounce from 'lodash/debounce'
import domain from "../../common/config/domain"
import rAF from '../../utils/rAF'
import { getAccountMenus } from "../../utils/authority";
import {findTemperature} from "../../services/machine/machineSetting";

const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const machineStatus = ['未知', '已开机', '已初始化', '已通过测试', '已在点位', '', '', '', '', '合作中']
const appStatus = ['未启动', '前台运行', '后台运行']
const logOptions = [{id: 1, name: '系统日志'}, {id: 2, name: '产品日志'}, {id: 3, name: '业务日志'}]
const TemperatureOptions = [15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
const pointTypeOptions = [{id: 0, name: '渠道机器 '}, {id: 1, name: '活动机器'}, {id: 2, name: '合作机器'}]
const pointStatusOptions = [
  {id: 1, name: '已开机'},
  {id: 2, name: '已初始化 '},
  {id: 3, name: '已通过测试'},
  // {id: 4, name: '设置在点位'},
  {id: 4, name: '已在点位'}
  ]
const machineType = ['渠道机器', '活动机器', '合作机器', '']
const localTypeOptions = [{id: '0', name: '渠道点位'}, {id: '1', name: '活动点位'}, {id: '2', name: '合作点位'}]
const localType = {'0': '渠道点位', '1': '活动点位 ', '2': '合作点位'}
// <Icon type="wifi" />
message.config({
  top: 100,
  duration: 2,
  maxCount: 1,
});
const tabList = [
  {id: '0', name: '重置点位'},
  {id: '1', name: '管理APP'},
  {id: '2', name: '管理货道'},
  {id: '3', name: '机器温度'},
  {id: '4', name: '修改编号'},
  {id: '5', name: '系统状态'},
  {id: '6', name: '机器类型'},
]
const teamWorkTabList = [
  {id: '0', name: '重置点位'},
  {id: '1', name: '管理APP'},
  // {id: '4', name: '修改编号'},
  {id: '5', name: '系统状态'},
  {id: '6', name: '机器类型'},
]
let mySetInterval = null
let myLogSetInterval = null

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
    const { editPointmodalVisible, form, editPointHandleAddClick,
      handleSupervisorySwitch, switchStatus, handleSupervisoryStartTime,
      handleSupervisoryEndTime, editPointHandleModalVisibleClick, editPointEditModalConfirmLoading,
      onSelect, data, value, handleChange, onPopupScroll, onSearch, fetching, pointName, modalData,
      supervisoryStartTime, supervisoryEndTime,
      editManageHandleModalVisibleClick,
    } = props;
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
    const config = {
      rules: [{ type: 'object', required: true, message: 'Please select time!' }],
    };
    return (
      <div className="manageAppBox">
          <h3>重置点位</h3>
          <Form onSubmit={this.handleSearch}>
            <FormItem {...formItemLayout} label="当前点位">
              {getFieldDecorator('localDesc')(
                <span>{pointName}</span>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="新点位">
              {getFieldDecorator('locale')(
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
                  allowClear={true}>
                  {/*{*/}
                  {/*data.map(d => <Option key={d.value} data-id={d.id}>{d.text}</Option>)*/}
                  {/*}*/}
                  {data.map((item) => {
                    return (
                      <Option value={item.text} key={item.id} data-id={item.id}>
                        <a title={item.text}>
                          {item.text}
                        </a>
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem>
              <Button style={{ width: '120px', marginRight: '10px' }} type="primary" onClick={() => editManageHandleModalVisibleClick()}>取消</Button>
              <Button style={{ width: '120px' }} type="Default" onClick={() => editPointHandleAddClick()}>确定</Button>
            </FormItem>
          </Form>
          {/*<h3>监控设置</h3>*/}
          {/*<Form>*/}
            {/*<FormItem*/}
              {/*label="开启监控"*/}
              {/*{...formItemLayout}*/}
            {/*>*/}
              {/*/!*{getFieldDecorator('radio-group')(*!/*/}
              {/*/!*<RadioGroup>*!/*/}
              {/*/!*<Radio value="on">开启</Radio>*!/*/}
              {/*/!*<Radio value="off">关闭</Radio>*!/*/}
              {/*/!*</RadioGroup>*!/*/}
              {/*/!*)}*!/*/}
              {/*<Switch checked={switchStatus} checkedChildren="开" unCheckedChildren="关" onChange={handleSupervisorySwitch}/>*/}
            {/*</FormItem>*/}
            {/*<FormItem*/}
              {/*{...formItemLayout}*/}
              {/*label="监控时间">*/}
              {/*<TimePicker value={moment(supervisoryStartTime ? supervisoryStartTime : '00:00:00', 'HH:mm:ss')} onChange={handleSupervisoryStartTime} disabled={!switchStatus}/>*/}
              {/*<span>-</span>*/}
              {/*<TimePicker value={moment(supervisoryEndTime ? supervisoryEndTime : '23:59:59', 'HH:mm:ss')} onChange={handleSupervisoryEndTime} disabled={!switchStatus}/>*/}

            {/*</FormItem>*/}
          {/*</Form>*/}
      </div>
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
      <Form id="appCutTitle">
        <FormItem label="切换App" className={styles.appTitle} />
        <FormItem {...formItemLayout} label="运行中的APP" style={{ marginLeft: '11px' }}>
          {getFieldDecorator('appStatus', {
          })(<Input disabled style={{ marginLeft: '-8px', width: '103%' }} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="切换App">
          {getFieldDecorator('appPackageName', {
            rules: [{ required: true, message: '请选择要切换的App' }],
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
        <FormItem className={styles.rightBtn}>
          <div className={styles.tipsBox}>
            <span className={styles.tip}>提示：切换和升级App需要单独提交数据</span>
            <Button style={{ width: '120px' }} type="primary" onClick={okCutApp}>提交数据</Button>
            <div className={styles.clear}></div>
          </div>
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
      <Form id="appUpdateForm">
        <FormItem label="升级App" className={styles.appTitle} />
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
        <FormItem  className={styles.rightBtn}>
          <Button style={{ width: '120px' }} type="primary" onClick={okRefreshApp}>提交数据</Button>
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
        <div>
          <MachineAisleTable
            handleClose={handleClose}
            AisleList={AisleList}
            handleStop={handleStop}
            handleStart={handleStart}
            message={message}
            updateGoodsCount={updateGoodsCount}
          />
        </div>
    );
  });
const WatchForm = Form.create()(
  (props) => {
    const { form, ManageWatchModalVisible, ManageWatchEditModalConfirmLoading, ManageWatchHandleModalVisibleClick,
      appUpdate,appRefresh, machineDetail, returnBtn } = props;
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
    // let machineDetailData = machineDetail.status ? (machineDetail.status.length > 0 ? machineDetail.status.splice(0, 10) : '') : ''
    return (
        <div style={{ padding: '0 30px 30px 30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid #F2F2F2' }}>
              <span style={{ color: '#999'}}>请您先点击更新，获取最新数据</span>
              <div>
                <div style={{ marginBottom: '18px' }}>
                  {/*<Button style={{ width: '120px', marginRight: '10px' }} type="primary" onClick={() => returnBtn(2)}>返回App</Button>*/}
                  {/*<Button style={{ width: '120px', marginRight: '10px' }} type="primary" onClick={() => returnBtn(1)}>返回桌面</Button>*/}
                  {/*<Button style={{ width: '120px', marginRight: '10px' }} type="primary" onClick={() => appUpdate(3)}>截屏</Button>*/}
                  <Button style={{ width: '120px', marginRight: '10px' }} type="primary" onClick={() => appUpdate(1)}>更新</Button>
                  <Button style={{ width: '120px' }} type="Default" onClick={() => appRefresh()}>刷新</Button>
                </div>
              </div>
            </div>
          </div>
          <div style={{ padding: '0px' }}>
            <Row gutter={16}>
              <Col span={12}>
                <div class="machineStatus">
                  <Card title="机器状态" bordered={false}>
                    <div className={styles.statusBox}>
                      <span>机器门状态</span>
                      <span>
                   {machineDetail.machineStatus ? (machineDetail.machineStatus.machineDoorStatus === 0 ? '关闭' : '打开') : ''}
                  </span>
                    </div>
                    <div className={styles.statusBox}>
                      <span>温度</span>
                      <span>
                    {machineDetail.machineStatus ? (machineDetail.machineStatus.temperature ? machineDetail.machineStatus.temperature : '') : ''}
                  </span>
                    </div>
                    <div className={styles.statusBox}>
                      <span>掉货开关</span>
                      <span>
                   {machineDetail.machineStatus ? (machineDetail.machineStatus.dropGoodsSwitch === 0 ? '关闭' : (machineDetail.machineStatus.dropGoodsSwitch === -1 ? '未知' : '打开')) : ''}
                  </span>
                    </div>
                    <div className={styles.statusBox}>
                      <span>屏幕亮度</span>
                      <span>
                    {machineDetail.machineStatus ? (machineDetail.machineStatus.screenIntensity ? machineDetail.machineStatus.screenIntensity : '') : ''}
                  </span>
                    </div>
                    <div className={styles.statusBox}>
                  <span>
                    音量
                  </span>
                      <span>
                    {machineDetail.machineStatus ? (machineDetail.machineStatus.voice ? machineDetail.machineStatus.voice : '') : ''}
                   </span>
                    </div>
                    <div className={styles.statusBox}>
                  <span>
                    更新时间
                  </span>
                      <span>
                    {machineDetail.systemStatus ? machineDetail.systemStatus.createTime : '暂无'}
                  </span>
                    </div>
                  </Card>
                </div>
              </Col>
              <Col span={12}>
                <div class="machineStatus">
                  <Card title="硬件状态" bordered={false}>
                    <div className={styles.statusBox}>
                      <span>cpu：</span>
                      <span>{machineDetail.systemStatus ? (machineDetail.systemStatus.cpu ? machineDetail.systemStatus.cpu : '') : ''}</span>
                    </div>
                    <div className={styles.statusBox}>
                  <span>
                    运行内存
                  </span>
                      <span>
                    {machineDetail.systemStatus ? (machineDetail.systemStatus.memoryTotle ? machineDetail.systemStatus.memoryTotle : '') : ''}G
                    <span className={styles.paddingRight}>
                     剩余{machineDetail.systemStatus ? (machineDetail.systemStatus.memoryFree ? machineDetail.systemStatus.memoryFree : '') : ''}G
                    </span>
                  </span>
                    </div>
                    <div className={styles.statusBox}>
                  <span>
                    SD卡内存
                  </span>
                      <span>
                    {machineDetail.systemStatus ? (machineDetail.systemStatus.sdTotle ? machineDetail.systemStatus.sdTotle : '') : ''}G
                    <span className={styles.paddingRight}>
                      剩余{machineDetail.systemStatus ? (machineDetail.systemStatus.sdFree ? machineDetail.systemStatus.sdFree : '') : ''}G
                    </span>
                 </span>
                    </div>
                    <div className={styles.statusBox}>
                      <span>运营商</span>
                      <span>{machineDetail.systemStatus ? (machineDetail.systemStatus.networkOperateName ? machineDetail.systemStatus.networkOperateName :'') : ''}
                  </span>
                    </div>
                    <div className={styles.statusBox}>
                      <span>ACC ID</span>
                      <span>
                    {machineDetail.systemStatus ? (machineDetail.systemStatus.accid ? machineDetail.systemStatus.accid : '') : ''}
                  </span>
                    </div>
                    <div className={styles.statusBox}>
                      <span>更新时间</span>
                      <span>
                    {machineDetail.machineStatus ? machineDetail.machineStatus.createTime : '暂无'}
                  </span>
                    </div>
                  </Card>
                </div>
              </Col>
            </Row>
          </div>
          {/*<Table columns={machineColumns} dataSource={machineDetail.imgs} rowKey={record => record.id} pagination={false} />*/}
        </div>
    );
  });
const EditMachineCodeForm = Form.create()(
  (props) => {
    const { editMachineCodemodalVisible, form,
      editMachineCodeHandleAddClick, editMachineCodeHandleModalVisibleClick,
      editMachineCodeEditModalConfirmLoading,} = props;
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
            <span class="modalTitle">修改编号</span>
          </div>
        }
        visible={editMachineCodemodalVisible}
        onOk={editMachineCodeHandleAddClick}
        onCancel={() => editMachineCodeHandleModalVisibleClick()}
        confirmLoading={editMachineCodeEditModalConfirmLoading}
        width={800}>
        <div className="manageAppBox">
          <Form onSubmit={this.handleSearch}>
            <FormItem {...formItemLayout} label="机器编号">
              {getFieldDecorator('machineCode', {
                rules: [{ required: true, whitespace: true, message: '请填写机器编号' }],
              })(<Input placeholder="请填写机器编号" />)}
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  });

// const UploadLogForm = Form.create()(
//   (props) => {
//     const {
//       UploadLogVisible,
//       UploadLogConfirmLoading,
//       UploadLogVisibleClick,
//       logUpdate,
//       logRefresh,
//       modalData,
//       } = props;
//     const formItemLayout = {
//       labelCol: {
//         xs: { span: 24 },
//         sm: { span: 4 },
//       },
//       wrapperCol: {
//         xs: { span: 24 },
//         sm: { span: 16 },
//       },
//     };
//     return (
//       <Modal
//         title={
//           <div class="modalBox">
//             <span class="leftSpan"></span>
//             <span class="modalTitle">上传日志</span>
//           </div>
//         }
//         width={800}
//         visible={UploadLogVisible}
//         onCancel={() => UploadLogVisibleClick()}
//         confirmLoading={UploadLogConfirmLoading}
//         footer={null}
//       >
//         <div style={{ padding: '0 30px 30px 30px' }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexDirection: 'column' }}>
//             <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid #F2F2F2' }}>
//               <div>
//                 <div style={{ color: '#999'}}>请您先点击更新，获取最新数据</div>
//                 <div style={{ color: '#999'}}>上次更新时间：</div>
//               </div>
//               <div>
//                 <Button style={{ width: '120px', marginRight: '10px' }} type="primary" onClick={() => logUpdate()}>更新</Button>
//                 <Button style={{ width: '120px' }} type="Default" onClick={() => logRefresh()}>刷新</Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Modal>
//     );
//   });

const EditMonitoringForm = Form.create()(
  (props) => {
    const { editMonitoringFormVisible, editMonitoringHandleModalVisibleClick, callback,
      noticePosition, logLists, logTopLists, watchTop, machineCode, flagTop, returnInterval,
      handleMouseOver, handleMouseOut, mouseOver, onChange, excell, watchBtn,
      logRefresh, logUpdate, pointType, grabLogOnChange, machineLogLists, pointChange, machineId,
      appUpdate, appRefresh, returnBtn, machineDetail, monitorKey,
      logStartTime, logEndTime,
      customLogEndTime, customLogStartTime, getLogMessage, teamWorkMachineFlag
    } = props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    };
    const imgsColumns = [{
      title: '图片地址',
      dataIndex: 'imgUrl',
      align: 'left',
      width: '78%',
      render (text, render) {
        return (
          <a href={`${domain.url}${render.imgUrl}`} target='_blank'>{`${domain.url}${render.imgUrl}`}</a>
        )
      }
    }, {
      title: '截屏时间',
      dataIndex: 'createTime',
      align: 'left',
      width: '22%',
    }];
    const machineColumns = [{
      title: '日志文件',
      dataIndex: 'logUrl',
      align: 'left',
      width: '78%',
      render (text, render) {
        return (
          <a href={`${domain.url}${render.logUrl}`} target='_blank'>{`${domain.url}${render.logUrl}`}</a>
        )
      }
    }, {
      title: '获取时间',
      dataIndex: 'reciveTime',
      align: 'left',
      width: '22%',
    }];
    const dateFormat = 'YYYY-MM-DD';
    return (
      <Modal
        title={
          <div class="modalBox">
            <span class="leftSpan"></span>
            <span class="modalTitle">监控</span>
          </div>
        }
        visible={editMonitoringFormVisible}
        onCancel={() => editMonitoringHandleModalVisibleClick()}
        footer={null}
        // className={styles.manageAppBox}
        width={900}>
        <div class="manageAppBox">
          <Tabs type="card" onChange={callback} activeKey={ monitorKey }>
            <TabPane tab="截屏" key="0">
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid #F2F2F2' }}>
                <div style={{ marginBottom: '18px' }}>
                  <Button style={{ width: '120px', marginRight: '10px' }} type="primary" onClick={() => appUpdate(3)}>截屏</Button>
                  <Button style={{ width: '120px' }} type="Default" onClick={() => appRefresh(machineId)}>刷新</Button>
                </div>
                <div>
                  <Button style={{ width: '120px', marginRight: '10px' }} type="primary" onClick={() => returnBtn(2)}>返回App</Button>
                  <Button style={{ width: '120px', marginRight: '10px' }} type="primary" onClick={() => returnBtn(1)}>返回桌面</Button>
                </div>
              </div>
              <Table columns={imgsColumns} dataSource={machineDetail.imgs} rowKey={record => record.id} pagination={false} />
            </TabPane>
            <TabPane tab="实时日志" key="1">
              <div>
                <Button style={{ width: '120px', marginBottom: '10px', display: watchBtn ? '' : 'none' }}
                        type="Default"
                        onClick={() => watchTop(machineCode)}>
                  查看以前
                </Button>
                <span style={{ display: flagTop && getLogMessage === 2 ? '' : 'none', height: '300px' }}>
                    {getLogMessage === 2 ? '数据加载中，请稍等' : ''}
                </span>
                <div style={{ display: flagTop && getLogMessage === 3 ? '' : 'none', height: '300px', overflowY: 'scroll' }} className={ styles.logTopLists }>
                  {(logTopLists.length === 0) ? '' : (
                    logTopLists.map((item) => {
                      return (
                        <p style={{ color: item.type.indexOf('6') > -1 ? 'red' : '#999' }}>
                          <span style={{ color: item.type.indexOf('6') > -1 ? 'red' : '#000' }}>{item.pointTime}：</span>
                          <a style={{ color: item.type.indexOf('6') > -1 ? 'red' : '#999' }} >{item.detail}</a>
                        </p>
                      );
                    }))}
                </div>
                <Button style={{ width: '120px', marginTop: '10px', display: flagTop ? '' : 'none' }}
                        type="Default"
                        onClick={() => returnInterval(machineCode)}>
                  返回
                </Button>
              </div>
              <div className={styles.showNotice}
                // onMouseOver={handleMouseOver}
                // onMouseOut={handleMouseOut}
                   id="logTip"
                   style={{ display: !flagTop ? '' : 'none', overflow: 'scroll', height: '300px' }}>
                <div className={styles.showList}
                     id="logTipDiv"
                     style={{transform: 'translateY(-'+noticePosition+'px) translateZ(0px)'}}>
                  <span style={{ display: getLogMessage === 0 ? '' : 'none' }}>
                    {getLogMessage === 0 ? '数据加载中，请稍等' : ''}
                  </span>
                  <div style={{ display: getLogMessage === 0 ? 'none' : '' }}>
                    {(logLists.length === 0) ? '' : (logLists.map((item) => {
                      return (
                        <p style={{ color: item.type.indexOf('6') > -1 ? 'red' : '#999', }}>
                          <span style={{ color: item.type.indexOf('6') > -1 ? 'red' : '#000' }}>{item.pointTime}：</span>
                          <a  style={{ color: item.type.indexOf('6') > -1 ? 'red' : '#999' }}>{item.detail}</a>
                        </p>
                      );
                    }))}
                  </div>
                </div>
              </div>
            </TabPane>
            <TabPane tab="定制日志" key="2">
              <div>
                <RangePicker onChange={onChange}
                             value={[customLogStartTime ? moment(customLogStartTime, dateFormat) : undefined, customLogEndTime ? moment(customLogEndTime, dateFormat) : undefined]}
                />
                <Button style={{ width: '120px', marginTop: '10px' }}
                        type="Default"
                        onClick={() => excell(machineCode)}>
                  导出
                </Button>
              </div>
            </TabPane>
            <TabPane tab="获取日志" key="3">
              <Alert message="此功能用于获取异常数据日志，选择日志类型和时间，通过点击“更新”发起获取日志指令，通过点击“刷新”获取日志。" type="info" showIcon />
              <Form onSubmit={this.handleSearch} style={{ marginTop: '10px' }}>
                <FormItem {...formItemLayout} label="日志类型">
                  <div style={{ display: 'flex' }}>
                    <Select placeholder="选择日志类型" value={ pointType } onChange={pointChange}>
                      {logOptions.map((item) => {
                        return (
                          <Option key={item.id} value={item.id}>{item.name}</Option>
                        );
                      })}
                    </Select>
                    <Button style={{ width: '120px', marginLeft: '10px' }} type="Default" onClick={() => logRefresh(machineId)}>更新</Button>
                  </div>
                </FormItem>
                <FormItem {...formItemLayout} label="时间范围">
                  <div style={{ display: 'flex' }}>
                    <RangePicker onChange={grabLogOnChange}
                                 value={[logStartTime ? moment(logStartTime, dateFormat) : undefined, logEndTime ? moment(logEndTime, dateFormat) : undefined]}
                    />
                    <Button style={{ width: '120px', marginLeft: '10px' }} type="primary" onClick={() => logUpdate(machineId)}>刷新</Button>
                  </div>
                </FormItem>
                <FormItem>
                  <Table columns={machineColumns}
                         dataSource={machineLogLists}
                         rowKey={record => record.id}
                         pagination={false} />
                </FormItem>
              </Form>
            </TabPane>
          </Tabs>
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
    machineSearchCode: '',
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
    pointName: '',
    editMachineCodemodalVisible: false,
    editMachineCodeEditModalConfirmLoading: false,

    UploadLogVisible: false,
    UploadLogConfirmLoading: false,

    editMonitoringFormVisible: false,

    noticePosition: 0,
    notices: [],
    logLists: [],
    machineCode: '',
    logTopLists: [],
    flagTop: false,
    mouseOver: false,
    excelTimeRange: [],

    account: {},
    watchBtn: true,

    machineLogLists: [],
    pointType: undefined,
    logStartTime: '',
    logEndTime: '',
    machineId: '',

    Temperature: '',
    editManageFormVisible: false,
    TemperatureSelected: undefined,
    machineCodeNew: '',
    localeName: '',

    managekey: '0',
    monitorKey: '0',

    startTime: '',
    endTime: '',
    machineType: '',
    machineStatus: '',

    customLogStartTime: '',
    customLogEndTime: '',
    getLogMessage: 0,
    machineCodeOld: '',

    getLogMessage2: '数据加载中，请稍等',

    teamWorkMachineFlag: '',
    teamWorkLists: [],

    localType: '',
    MachineTypeSelected: '',
    MachineTypeDefault: 3,
    machineTypes: ''
  };
  constructor(props) {
    super(props);
    this.getPointSettingList = debounce(this.getPointSettingList, 800);
    this.onPopupScroll = debounce(this.onPopupScroll, 800);
  }
  componentDidMount() {
    this.getLists();
    this.getAreaList();
    this.getAccountMenus(getAccountMenus())
  }
  componentDidUpdate() {
    if (this.state.editMonitoringFormVisible) {
      // console.log('document.getElementById()', document.getElementById('logTip'))
      // document.getElementById('logTip').scrollTo = (this.state.logLists.length - 10) * 30
      // transform: none;
      // console.log('scrollTo', document.getElementById('logTip').scrollTo)
    }
  }
  getAccountMenus = (setAccountMenusList) => {
    if (setAccountMenusList) {
      const pointSettingMenu = setAccountMenusList.filter((item) => item.path === 'machine')[0]
        .children.filter((item) => item.path === 'machine-setting')
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
  IsNull = arg => {
    return !arg && arg !== 0 && typeof arg !== 'boolean' ? true : false;
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
          machineCode: this.state.machineSearchCode,
          startTime: this.state.startTime,
          endTime: this.state.endTime,
          machineType: this.state.machineType,
          machineStatus: this.state.machineStatus,
          localType: this.state.localType ? this.state.localType : ''
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
        machineSearchCode: fieldsValue.machineCode ? fieldsValue.machineCode : '',
        localCode: localCode,
        startTime: fieldsValue.rangeTime ? fieldsValue.rangeTime[0].format('YYYY-MM-DD') : '',
        endTime: fieldsValue.rangeTime ? fieldsValue.rangeTime[1].format('YYYY-MM-DD') : '',
        machineType: fieldsValue.machineType >= 0 ? fieldsValue.machineType : '',
        machineStatus: fieldsValue.machineStatus >= 0 ? fieldsValue.machineStatus : '',
        localType: fieldsValue.localType,
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
    this.props.dispatch({
      type: 'machineSetting/findMachineInfoById',
      payload: {
        params: {
          machineId: item.id
        }
      },
    }).then( (res) => {
      if (res && res.code === 0) {
        this.setState({
          modalVisible: false,
          modalData: res.data,
          switchStatus: !res.data.openStatus,
          supervisoryStartTime: res.data.monitorStart || '00:00:00',
          supervisoryEndTime: res.data.monitorEnd || '23:59:59',
          editPointmodalVisible: true,
          data: [],
        }, () => {
          this.setModalData(res.data);
        });
      }
    });
  }
  // 设置modal 数据
  setModalData = (data) => {
    if (data) {
      this.pointForm.resetFields()
      this.setState({
        pointName: data.localStr,
        data: []
      })
    } else {
      this.pointForm.resetFields()
      this.setState({
        pointName: '',
        data: []
      })
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
            value: r.areaName,
            text: r.areaName,
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
    console.log('value', value)
    this.setState({
      pointPageNo: 1,
      data: [],
      fetching: false,
      value: '',
    });
  }
  editPointHandleAddClick = () => {

    console.log('old localeId',this.state.modalData.localeId)
    console.log('new localeId',this.state.dataId)
    let localeId = this.state.dataId;
    if (localeId === '') {
      localeId = this.state.modalData.localeId
    }
    if (localeId === this.state.modalData.localeId) {
      message.success('当前无修改')
      return false
    }
    // 确认修改点位
    this.pointForm.validateFields((err, values) => {
      if (err) {
        return;
      }
      // this.setState({
      //   editPointEditModalConfirmLoading: true,
      // });
      let params = {
        id: this.state.modalData.id,
        localeId: localeId,
        // openStatus: this.state.switchStatus ? 0 : 1,
        // monitorStart: this.state.supervisoryStartTime,
        // monitorEnd: this.state.supervisoryEndTime
      };
      // if (this.state.modalData.id) {
      // url = 'machineSetting/updateLocaleMachineSetting';
      // url = 'machineSetting/updateMachine';
      console.log('updateMachine params ==== ',params)
      // }
      this.props.dispatch({
        type: 'machineSetting/updateLocaleMachineSetting',
        payload: {
          params,
        },
      }).then((res) => {
        if (res && res.code === 0) {
          console.log('onselect', this.state.localeName)
          if (localeId !== this.state.modalData.localeId) {
            this.setState({
              pointName: this.state.localeName
            })
          }
          message.success('修改成功')
        }
        this.pointForm.resetFields();
        // this.setState({
        //   editPointEditModalConfirmLoading: false,
        //   modalVisible: false,
        //   modalData: {},
        //   dataId: '',
        //   data: [],
        //   editPointmodalVisible: false,
        //   ManageAppmodalVisible: false,
        //   ManageAislemodalVisible: false,
        // });
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
    this.setState({
      data: [],
      dataId: option.props['data-id'],
      localeName: value,
    }, () => {
      console.log('onselect', value, option.props['data-id'], this.state.localeName);

    });
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

  // 监控开关
  handleSupervisorySwitch = (value) => {
    if (value == true) {
      this.setState({
        switchStatus: value,
        supervisoryStartTime: '00:00:00',
        supervisoryEndTime: '23:59:59'
      });
    } else {
      this.setState({
        switchStatus: value,
        supervisoryStartTime: '',
        supervisoryEndTime: ''
      });
    }
  }
  // 监控开始时间获取
  handleSupervisoryStartTime = (time,timeString) => {
    this.setState({
      supervisoryStartTime: timeString
    })
  }
  // 监控结束诗句获取
  handleSupervisoryEndTime = (time,timeString) => {
    this.setState({
      supervisoryEndTime: timeString
    })
  }

  // 修改机器code开始
  // MachineCode
  handleNoClick = (item) => {
    this.setState({
      modalVisible: false,
      modalData: item,
      editMachineCodemodalVisible: true,
    }, () => {
      this.MachineCodeForm.setFieldsValue({
        machineCode: item.machineCode,
      });
    });
  }
  saveMachineCodeFormRef = (form) => {
    this.MachineCodeForm = form;
  }
  editMachineCodeHandleAddClick = () => {
    // 确认修ga编码
    // console.log(this.state.dataId)
    this.MachineCodeForm.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        editMachineCodeEditModalConfirmLoading: true,
      });
      let url = '';
      let params = '';
      console.log('modalData', this.state.modalData)
      if (this.state.modalData.id) {
        url = 'machineSetting/updateMachineCode';
        params = { ...values, machineId: this.state.modalData.id};
      }
      this.props.dispatch({
        type: url,
        payload: {
          params,
        },
      }).then((data) => {
        message.config({
          top: 100,
          duration: 2,
          maxCount: 1,
        });
        message.info(data.data)
        this.getLists();
        this.setState({
          editMachineCodeEditModalConfirmLoading: false,
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
  editMachineCodeHandleModalVisibleClick = (flag) => {
    this.setState({
      editMachineCodemodalVisible: !!flag,
    });
  };
  // 修改机器code结束
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
    let updateStatusText = ''
    if (updateStatus === 1) {
      updateStatusText = '更新'
    } else if (updateStatus === 2) {
      updateStatusText = '更新'
    } else {
      updateStatusText = '截屏'
    }
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
        message.success(updateStatusText + '成功');
      }
    });
  }
  returnBtn = (returnStatus) => {
    this.props.dispatch({
      type: 'machineSetting/returnDeskTop',
      payload: {
        params: {
          machineId: this.state.modalData.id,
          status:  returnStatus ? returnStatus : '',
        },
      },
    }).then((resp) => {
      if (resp && resp.code === 0) {
        message.config({
          top: 100,
          duration: 2,
          maxCount: 1,
        });
        message.success('发送成功');
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
        const r = result[result.length - 1].code.slice(0, 1)
        console.log('r', r)
        for (let i = 0; i < 56; i++) {
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
        let trLists = []
        for (let i = 0; i <= r; i++) {
          let tr = AisleList.filter(item => item.value <= ( i * 10 + 8 ) && item.value >= ( i * 10 + 1 ))
          trLists = [...trLists, ...tr]
        }
        this.setState({
          AisleList: trLists,
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
    console.log('machineId', item.id);
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
        console.log('result', result)
        this.setState({
          machineDetail: result.data,
        }, () => {
          // console.log('machineDetail', this.state.machineDetail)
          // this.setState({
          //   ManageWatchModalVisible: true,
          // })
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
  // handleMonitoringClick 监控
  handleMonitoringClick = (item) => {
    // machinePointLog
    this.setState({
      customLogStartTime: '',
      customLogEndTime: '',
      logStartTime: '',
      logEndTime: '',
      editMonitoringFormVisible: true,
      flagTop: false,
      logTopLists: [],
      logLists: [],
      watchBtn: true,
      machineCode: item.machineCode,
      machineId: item.id,
      modalData: item,
      monitorKey: '0',
      teamWorkMachineFlag: item.machineStatus,
    }, () => {
      this.getMachineStatus(this.state.modalData);
    })
  }
  getLogs = (machineCode) => {
    this.setState({
      getLogMessage: 0,
    }, () => {
      this.props.dispatch({
        type: 'machineSetting/machinePointLog',
        payload: {
          restParams: {
            machineCode,
            startTime: '',
            endTime: '',
          },
        },
      }).then((res) => {
        // console.log('res', res)
        if (this.state.editMonitoringFormVisible && res.length > 0) {
          this.setState({
            //   editMonitoringFormVisible: true,
            logLists: res,
          }, () => {
            // let destination = 30
            // this.noticePosition = (res.length - 10) * 30
            this.setState({
              noticePosition: this.noticePosition
            })
            setTimeout(()=>{
              document.getElementById('logTip').scrollTop = document.getElementById('logTipDiv').clientHeight
            }, 0)
            // document.getElementById('logTip').scrollTop = (this.state.logLists.length - 10) * 30
            // console.log('scrollTo', document.getElementById('logTip').scrollTo)

            // mySetInterval = setInterval(() => {
            //   console.log('destination / 30 < res.length', destination / 30 < this.state.logLists.length)
            //   if (destination / 30 < this.state.logLists.length ) {
            //     this.move(destination, 500, res.length)
            //     destination += 30
            //   } else { // 列表到底
            //     // clearInterval(mySetInterval)
            //     // this.noticePosition = 0 // 设置列表为开始位置
            //     // destination = 30
            //     // this.move(destination, 500, res.length)
            //     // destination += 30
            //   }
            // }, 1500)
            this.getLogLists()
          });
        }
        this.setState({
          getLogMessage: 1
        })
      });
    })
  }
  getLogLists = () => {
    myLogSetInterval = setInterval(() => {
      this.props.dispatch({
        type: 'machineSetting/machinePointLog',
        payload: {
          restParams: {
            machineCode: this.state.machineCode,
            startTime: this.state.logLists.length > 0 ? this.state.logLists[this.state.logLists.length - 1].pointTime : '',
            endTime: '',
          },
        },
      }).then((res) => {
        if (res.length !== 0) {
          this.setState({
            logLists: [...this.state.logLists, ...res],
          }, () => {
            setTimeout(()=>{
              document.getElementById('logTip').scrollTop = document.getElementById('logTipDiv').clientHeight
            },0)
          })
        } else {
          // clearInterval(mySetInterval)
          // let destination = 30
          // mySetInterval = setInterval(() => {
          //   if (destination / 30 < res.length ) {
          //     this.move(destination, 500, res.length)
          //     destination += 30
          //   } else { // 列表到底
          //     this.noticePosition = 0 // 设置列表为开始位置
          //     destination = 30
          //     this.move(destination, 500, res.length)
          //     destination += 30
          //   }
          // }, 1500)
        }
      });
    }, 3000)
  }
  move = (destination, duration, len) => {
    console.log('noticePosition2', this.state.noticePosition)
    // 实现滚动动画
    let speed = ((destination - this.noticePosition) * 1000) / (duration * 60)
    let count = 0
    let step = () => {
      this.noticePosition += speed
      count++
      console.log('noticePosition', this.state.noticePosition)
      rAF(() => {
        if (this.noticePosition < destination) {
          step()
        } else {
          this.noticePosition = destination
        }
      })
      this.setState({
        noticePosition: this.noticePosition
      })
    }
    step()
  }
  watchTop = (machineCode) => {
    console.log('machineCode', machineCode, this.state.machineCode)
    // clearInterval(mySetInterval)
    // clearInterval(myLogSetInterval)
    clearInterval(myLogSetInterval)
    this.setState({
      getLogMessage: 2,
    }, () => {
      let endTime = null
      if (this.state.logTopLists.length === 0) {
        endTime = this.state.logLists.length > 0 ? this.state.logLists[this.state.logLists.length - 1].pointTime : ''
      } else {
        endTime = this.state.logTopLists.length > 0 ? this.state.logTopLists[this.state.logTopLists.length - 1].pointTime : ''
      }
      this.props.dispatch({
        type: 'machineSetting/machinePointLog',
        payload: {
          restParams: {
            machineCode,
            startTime: '',
            endTime,
          },
        },
      }).then((res) => {
        if (res) {
          if (res.length > 0) {
            this.setState({
              flagTop: true,
              logTopLists: [...this.state.logTopLists, ...res],
            });
          } else {
            this.setState({
              watchBtn: false
            })
          }
        }
        this.setState({
          getLogMessage: 3,
        })
      });
    })
  }
  returnInterval = (machineCode) => {
    console.log('returnInterval', machineCode, this.state.machineCode, this.state.modalData)
    this.setState({
      flagTop: false,
      getLogMessage: 0,
    }, () => {
      // this.handleMonitoringClick(this.state.modalData)
      this.setState({
        editMonitoringFormVisible: true,
        logTopLists: [],
        logLists: [],
        watchBtn: true,
        machineCode: this.state.modalData.machineCode,
        machineId: this.state.modalData.id,
        modalData: this.state.modalData,
        monitorKey: '1',
      }, () => {
        this.getLogs(machineCode)
        this.getMachineStatus(this.state.modalData);
      })
    })
  }
  handleMouseOver = () => {
    this.setState({
      mouseOver: true
    })

    clearInterval(mySetInterval)
    // clearInterval(myLogSetInterval)
  }
  handleMouseOut = () => {
    this.setState({
      mouseOver: false
    })
    let destination = this.state.logLists.length * 30
    this.noticePosition = (this.state.logLists.length - 10) * 30
    this.setState({
      noticePosition: this.noticePosition
    })
    if (this.state.logLists.length > 20) {
      mySetInterval = setInterval(() => {
        if (destination / 30 < this.state.logLists.length ) {
          this.move(destination, 500)
          destination += 30
        } else { // 列表到底
          clearInterval(mySetInterval)
          // this.noticePosition = 0 // 设置列表为开始位置
          // destination = 30
          // this.move(destination, 500)
          // destination += 30
        }
      }, 1500)
    }
    // this.handleMonitoringClick(this.state.machineCode)
  }
  onChange = (date, dateString) => {
    console.log(date, dateString);
    this.setState({
      excelTimeRange: dateString,
      customLogStartTime: dateString[0],
      customLogEndTime: dateString[1],
    })
  }
  excell = (machineCode) => {
    if (this.state.excelTimeRange.length === 0) {
      message.config({
        top: 100,
        duration: 2,
        maxCount: 1,
      });
      message.warn('请先选择时间')
      return false
    }
    this.props.dispatch({
      type: 'machineSetting/exportMachinePointLog',
      payload: {
        restParams: {
          machineCode,
          startTime: this.state.excelTimeRange[0],
          endTime: this.state.excelTimeRange[1],
        },
      },
    })
  }
  callback = (key) => {
    this.setState({
      monitorKey: key
    })
    if (key === '2') {
    } else if (key === '1') {
      this.getLogs(this.state.modalData.machineCode)
    } else if (key === '3') {
      this.logUpdate(this.state.modalData.id)
    } else if (key === '0') {

    }
    if (key !== '1') {
      // clearInterval(mySetInterval)
      clearInterval(myLogSetInterval)
    }
  }
  editMonitoringHandleModalVisibleClick = () => {
    clearInterval(mySetInterval)
    clearInterval(myLogSetInterval)
    this.setState({
      editMonitoringFormVisible: false,
    });
  }
  // logRefresh监控
  pointChange = (value) => {
    this.setState({
      pointType: value
    })
  }
  grabLogOnChange = (date, dateString) => {
    console.log(date, dateString);
    if (dateString.length ===  2) {
      this.setState({
        logStartTime: dateString[0],
        logEndTime: dateString[1],
      })
    }
  }
  logRefresh = (machineId) => {
    const { pointType, logStartTime, logEndTime } = this.state
    if (!pointType || !logStartTime || !logEndTime) {
      message.config({
        top: 100,
        duration: 2,
        maxCount: 1,
      });
      message.error('请填写时间或者选择日志类型')
      return false
    }
    this.props.dispatch({
      type: 'machineSetting/grabLog',
      payload: {
        params: {
          machineId,
          logType: pointType,
          startTime: logStartTime,
          endTime: logEndTime,
        },
      },
    }).then((res) => {
      if (res && res.code === 0) {
        message.config({
          top: 100,
          duration: 2,
          maxCount: 1,
        });
        this.setState({
          pointType: undefined,
        })
        message.success(res.message ? res.message : '发送成功')
      } else {
        message.config({
          top: 100,
          duration: 2,
          maxCount: 1,
        });
        message.error(res.message)
      }
    })
  }
  logUpdate = (machineId) => {
    this.props.dispatch({
      type: 'machineSetting/getLogs',
      payload: {
        restParams: {
          machineId,
        },
      },
    }).then((res) => {
      if (res && res.code === 0) {
        this.setState({
          machineLogLists: res.data
        })
      }
    })
  }

  // handleManageClick 管理
  handleManageClick = (item) => {
    if (item.machineType === 2) {
      this.setState({
        teamWorkLists: teamWorkTabList
      })
    } else {
      this.setState({
        teamWorkLists: tabList
      })
    }
    this.setState({
      modalData: item,
      editManageFormVisible: true,
      managekey: '0',
      TemperatureSelected: undefined,
      MachineTypeDefault: item.machineType ? item.machineType : undefined,
      // machineTypes: item.machineType,
      machineCodeOld: item.machineCode,
      machineCodeNew: undefined,
      teamWorkMachineFlag: item.machineType,
    });
    this.handleEditClick(item)
  }
  editManageHandleModalVisibleClick = () => {
    this.setState({
      editManageFormVisible: false,
      modalData: {},
      TemperatureSelected: undefined,
      machineCodeOld: '',
      machineCodeNew: undefined,
    });
  }
  // 温度提交
  temperatureSubmit = () => {
    const { TemperatureSelected } = this.state
    if (!TemperatureSelected) {
      message.config({
        top: 100,
        duration: 2,
        maxCount: 1,
      });
      message.error('请先选择温度再提交')
      return false
    }
    this.props.dispatch({
      type: 'machineSetting/updateTemperature',
      payload: {
        params: {
          machineId: this.state.modalData.id,
          temperature: this.state.TemperatureSelected
        },
      },
    }).then((res) => {
      if (res && res.code === 0) {
        message.config({
          top: 100,
          duration: 2,
          maxCount: 1,
        });
        this.setState({
          Temperature: this.state.TemperatureSelected
        })
        message.success('修改成功')
      }
    })
  }
  // 机器类型
  machineTypeSubmit = () => {
    const { MachineTypeSelected } = this.state
    if (this.IsNull(MachineTypeSelected)) {
      message.config({
        top: 100,
        duration: 2,
        maxCount: 1,
      });
      message.error('请先选择机器类型再提交')
      return false
    }
    this.props.dispatch({
      type: 'machineSetting/updateMachineType',
      payload: {
        params: {
          machineId: this.state.modalData.id,
          machineType: this.state.MachineTypeSelected
        },
      },
    }).then((res) => {
      if (res && res.code === 0) {
        message.config({
          top: 100,
          duration: 2,
          maxCount: 1,
        });
        this.setState({
          MachineTypeDefault: MachineTypeSelected,
          MachineTypeSelected: undefined,
          teamWorkLists: MachineTypeSelected === '2' ? teamWorkTabList : tabList
        })
        message.success('修改成功')
      }
    })
  }
  inputCodeChange = (e) => {
    this.setState({
      machineCodeNew: e.target.value,
    })
  }
  machineCodeSubmit = () => {
    const { machineCodeNew } = this.state
    if (!machineCodeNew) {
      message.config({
        top: 100,
        duration: 2,
        maxCount: 1,
      });
      message.error('请填写编码后再保存')
      return false
    }
    let url = 'machineSetting/updateMachineCode'
    let params = {
        machineCode: machineCodeNew,
        machineId: this.state.modalData.id
      };

    this.props.dispatch({
      type: url,
      payload: {
        params,
      },
    }).then((data) => {
      if (data && data.code === 0) {
        message.config({
          top: 100,
          duration: 2,
          maxCount: 1,
        });
        this.setState({
          machineCodeOld: this.state.machineCodeNew
        })
        message.info(data.data ? data.data : '修改成功')
      }
    });
  }
  onTemperatureSelected = (value) => {
    this.setState({
      TemperatureSelected: value
    })
  }
  onMachineTypeSelected = (value) => {
    this.setState({
      MachineTypeSelected: value
    })
  }
  // manageCallBack
  manageCallBack = (key) => {
    this.setState({
      managekey: key
    })
    if (key === '3') {
      // 机器温度
      this.getTemperature(this.state.modalData.id)
    } else if (key === '0') {
      // 重置点位
      this.handleEditClick(this.state.modalData)
    } else if (key === '1') {
      // 管理APP
      this.appRefresh()
    } else if (key === '2') {
      // 管理货道
      this.handleManageAisleClick(this.state.modalData)
    } else if (key === '4') {
      // 修改编号
    } else if (key === '5') {
      // 系统状态
      this.getMachineStatus(this.state.modalData)
    }
  }
  getTemperature = (machineId) => {
    this.props.dispatch({
      type: 'machineSetting/findTemperature',
      payload: {
        restParams: {
          machineId,
        },
      },
    }).then((res) => {
      if (res && res.code === 0) {
        this.setState({
          Temperature: res.data
        })
      }
    })
  }
  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    // <RangePicker onChange={onChange} />
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="省市区">
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
          <Col md={8} sm={24}>
            <FormItem label="入场时间">
              {getFieldDecorator('rangeTime')(
                <RangePicker
                  placeholder={['开始时间', '结束时间']}
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="机器类型">
              {getFieldDecorator('machineType')(
                <Select placeholder="请选择">
                  {pointTypeOptions.map((item) => {
                    return (
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="机器状态">
              {getFieldDecorator('machineStatus')(
                <Select placeholder="请选择">
                  {pointStatusOptions.map((item) => {
                    return (
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem>
              {getFieldDecorator('machineCode')(
                <Input placeholder="请输入机器编号、点位、点位标签搜索" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="点位类型">
              {getFieldDecorator('localType')(
                <Select placeholder="请选择">
                  {localTypeOptions.map((item) => {
                    return (
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
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
      machineSetting: { list, page, unColumn },
      loading,
      log: { logList, logPage },
    } = this.props;
    const { account, selectedRows,
      modalVisible, editModalConfirmLoading, modalData,
      updateList, appLists, AisleList, message, appLists2,
      createTime, teamWorkMachineFlag, managekey, teamWorkLists, machineTypes } = this.state;
    const columns = [
      {
        title: '机器编号',
        width: '15%',
        dataIndex: 'machineCode',
        key: 'machineCode',
      },
      {
        title: '机器点位',
        width: '18%',
        dataIndex: 'localDesc',
        key: 'localDesc'
      },
      { // machineType
        title: '机器类型',
        width: '18%',
        dataIndex: 'machineType',
        key: 'machineType',
        render(val) {
          if (val !== null) {
            return <span>{machineType[val]}</span>;
          }
        },
      },
      { // machineType
        title: '点位类型',
        width: '18%',
        dataIndex: 'localType',
        key: 'localType',
        render(val) {
          if (val !== null) {
            return <span>{localType[val]}</span>;
          }
        },
      },
      {
        title: '连接状态',
        width: '10%',
        dataIndex: 'netStatus',
        render(val) {
          if (val !== null) {
            return <div className={styles.netStatusStyles}>
              <img src={require(`../../assets/images/signalIcon/sign${val ? val : 0}.png`)}/>
            </div>;
          }
        },
        key: 'netStatus'
      },
      // {
      //   title: '当前活动',
      //   width: '10%',
      //   dataIndex: 'activityName',
      //   key: 'activityName'
      // },
      {
        title: '机器状态',
        dataIndex: 'machineStatus',
        render(val) {
          if (val) {
            return <span>{machineStatus[val]}</span>
          } else {
            return <span>{machineStatus[0]}</span>
          }
        },
        key: 'machineStatus'
      },
      {
        title: '入场时间',
        width: '10%',
        dataIndex: 'insideTime',
        key: 'insideTime'
      },
      {
        fixed: 'right',
        title: '操作',
        width: 180,
        render: (text, item) => (
          <Fragment>
            <a onClick={() => this.handleMonitoringClick(item)}>监控</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleManageClick(item)}>管理</a>
          </Fragment>
        ),
      },
    ];
    // unColumn
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
    // console.log('columns', columns, width)
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
          <div className={styles.tableList} style={{ display: !account.list ? 'none' : ''}}>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={list}
              page={page}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              scrollX={1000}
              scrollY={(document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 180)}
            />
          </div>
        </Card>

        <EditMachineCodeForm
          ref={this.saveMachineCodeFormRef}
          editMachineCodemodalVisible={this.state.editMachineCodemodalVisible}
          editMachineCodeHandleAddClick={this.editMachineCodeHandleAddClick}
          editMachineCodeHandleModalVisibleClick={this.editMachineCodeHandleModalVisibleClick}
          editMachineCodeEditModalConfirmLoading={this.state.editMachineCodeEditModalConfirmLoading}
        />
        <EditMonitoringForm
          editMonitoringFormVisible={this.state.editMonitoringFormVisible}
          editMonitoringHandleModalVisibleClick={this.editMonitoringHandleModalVisibleClick}
          noticePosition={this.state.noticePosition}
          logLists={this.state.logLists}
          machineCode={this.state.machineCode}
          watchTop={this.watchTop}
          flagTop={this.state.flagTop}
          logTopLists={this.state.logTopLists}
          returnInterval={this.returnInterval}
          handleMouseOver={this.handleMouseOver}
          handleMouseOut={this.handleMouseOut}
          mouseOver={this.state.mouseOver}
          onChange={this.onChange}
          excell={this.excell}
          callback={this.callback}
          watchBtn={this.state.watchBtn}


          logRefresh={this.logRefresh}
          logUpdate={this.logUpdate}
          pointType={this.state.pointType}
          grabLogOnChange={this.grabLogOnChange}
          machineLogLists={this.state.machineLogLists}
          pointChange={this.pointChange}
          machineId={this.state.machineId}


          appUpdate={this.appUpdate}
          appRefresh={this.appMachineRefresh}
          machineDetail={this.state.machineDetail}
          returnBtn={this.returnBtn}

          monitorKey={this.state.monitorKey}
          logStartTime={this.state.logStartTime}
          logEndTime={this.state.logEndTime}

          customLogStartTime={this.state.customLogStartTime}
          customLogEndTime={this.state.customLogEndTime}

          getLogMessage={this.state.getLogMessage}
        />
        <Modal
          title={
            <div class="modalBox">
              <span class="leftSpan"></span>
              <span class="modalTitle">管理</span>
            </div>
          }
          visible={this.state.editManageFormVisible}
          onCancel={() => this.editManageHandleModalVisibleClick()}
          footer={null}
          width={1250}>
          <div class="manageAppBox">
            <Tabs type="card" onChange={this.manageCallBack} activeKey={ this.state.managekey }>
              {teamWorkLists.map((item) => {
                return (
                  <TabPane tab={item.name} key={item.id}>

                  </TabPane>
                );
              })}
            </Tabs>
            <div style={{ display: managekey === '0' ? '' : 'none' }}>
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
                handleSupervisorySwitch={this.handleSupervisorySwitch}
                handleSupervisoryStartTime={this.handleSupervisoryStartTime}
                handleSupervisoryEndTime={this.handleSupervisoryEndTime}
                // value={this.state.value}
                modalData={this.state.modalData}
                pointName={this.state.pointName}
                switchStatus={this.state.switchStatus}
                supervisoryStartTime={this.state.supervisoryStartTime}
                supervisoryEndTime={this.state.supervisoryEndTime}

                editManageHandleModalVisibleClick={this.editManageHandleModalVisibleClick}
              />
            </div>
            <div style={{ display: managekey === '1' ? '' : 'none' }}>
              <div id="manageAppBox">
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexDirection: 'column', }}>
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', marginBottom: '10px', padding: '0 30px 20px 40px' }}>
                    <div>
                      <div style={{ color: '#999'}}>请您先点击更新，获取最新数据</div>
                      <div style={{ color: '#999'}}>上次更新时间：{createTime}</div>
                    </div>
                    <div>
                      <Button style={{ width: '120px', marginRight: '10px' }} type="Default" onClick={() => this.appRefresh()}>刷新</Button>
                      <Button style={{ width: '120px' }} type="primary" onClick={() => this.appUpdate(2, '更新')}>更新</Button>
                    </div>
                  </div>
                </div>
                <Table
                  id="appTable"
                  className={styles.appTable}
                  columns={columns1}
                  dataSource={updateList}
                  rowKey={record => record.appPackageName}
                  pagination={false} />
                <div style={{ padding: '10px', display: teamWorkMachineFlag === '9' ? 'none' : '' }}  className={styles.manageAppBox}>
                  <Row gutter={16}>
                    <Col span={24}>
                      <div className={styles.leftBox}>
                        {/*<Card title="切换App" bordered={false}>*/}
                        <ManageCutAppForm ref={this.ManageCutAppFormRef} appLists={appLists} okCutApp={this.okCutApp} />
                        {/*</Card>*/}
                      </div>
                    </Col>
                    {/*<Col span={12}>*/}
                      {/*/!*<Card title="升级App" bordered={false}>*!/*/}
                      {/*<div className={styles.rightBox}>*/}
                        {/*<ManageUpdateAppForm ref={this.ManageUpdateAppFormRef} appLists={appLists2} okRefreshApp={this.okRefreshApp} />*/}
                      {/*</div>*/}
                      {/*/!*</Card>*!/*/}
                    {/*</Col>*/}
                  </Row>
                </div>
              </div>
            </div>
            <div style={{ display: managekey === '2' && teamWorkMachineFlag !== 2 ? '' : 'none' }}>
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
            </div>
            <div style={{ display: managekey === '3' && teamWorkMachineFlag !== 2  ? '' : 'none' }}>
              <Form>
                <FormItem {...formItemLayout} label="当前温度">
                  <span>{parseInt(this.state.Temperature) === -1 ? '暂无' : this.state.Temperature}</span>
                </FormItem>
                <FormItem {...formItemLayout} label="机器温度">
                  <Select placeholder="请选择" value={ this.state.TemperatureSelected } onChange={this.onTemperatureSelected}>
                    {TemperatureOptions.map((item) => {
                      return (
                        <Option value={item} key={item}>{item}</Option>
                      );
                    })}
                  </Select>
                </FormItem>
                <FormItem {...formItemLayout}>
                  <Button style={{ width: '120px', marginRight: '10px' }} type="primary" onClick={() => this.editManageHandleModalVisibleClick()}>取消</Button>
                  <Button style={{ width: '120px' }} type="Default" onClick={() => this.temperatureSubmit()}>确定</Button>
                </FormItem>
              </Form>
            </div>
            <div style={{ display: managekey === '4' && teamWorkMachineFlag !== 2 ? '' : 'none' }}>
              <Form>
                <FormItem {...formItemLayout} label="当前编号">
                  <span>{this.state.machineCodeOld}</span>
                </FormItem>
                <FormItem {...formItemLayout} label="机器编号">
                  <Input placeholder="请填写机器编号" value={this.state.machineCodeNew} onChange={this.inputCodeChange}/>
                </FormItem>
                <FormItem {...formItemLayout}>
                  <Button style={{ width: '120px', marginRight: '10px' }} type="primary" onClick={() => this.editManageHandleModalVisibleClick()}>取消</Button>
                  <Button style={{ width: '120px' }} type="Default" onClick={() => this.machineCodeSubmit()}>确定</Button>
                </FormItem>
              </Form>
            </div>
            <div style={{ display: managekey === '5' ? '' : 'none' }}>
              <WatchForm
                ref={this.ManageWatchFormRef}
                ManageWatchModalVisible={this.state.ManageWatchModalVisible}
                ManageWatchEditModalConfirmLoading={this.state.ManageWatchEditModalConfirmLoading}
                ManageWatchHandleModalVisibleClick={this.ManageWatchHandleModalVisibleClick}
                appUpdate={this.appUpdate}
                appRefresh={this.appMachineRefresh}
                machineDetail={this.state.machineDetail}
                // returnBtn={this.returnBtn}
              />
            </div>
            <div style={{ display: managekey === '6' ? '' : 'none' }}>
              <Form>
                <FormItem {...formItemLayout} label="当前类型">
                  <span>{machineType[this.state.MachineTypeDefault]}</span>
                </FormItem>
                <FormItem {...formItemLayout} label="选择类型">
                  <Select placeholder="请选择" value={ this.state.MachineTypeSelected } onChange={this.onMachineTypeSelected}>
                    {pointTypeOptions.filter(i => parseInt(i.id) !== this.state.MachineTypeDefault).map((item) => {
                      return (
                        <Option value={item.id} key={item.id}>{item.name}</Option>
                      );
                    })}
                  </Select>
                </FormItem>
                <FormItem {...formItemLayout}>
                  <Button style={{ width: '120px', marginRight: '10px' }} type="primary" onClick={() => this.editManageHandleModalVisibleClick()}>取消</Button>
                  <Button style={{ width: '120px' }} type="Default" onClick={() => this.machineTypeSubmit()}>确定</Button>
                </FormItem>
              </Form>
            </div>
          </div>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
