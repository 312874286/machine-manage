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
  Modal
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TaskSetting.less'
import moment from "moment/moment";
const FormItem = Form.Item;
const { Option } = Select;
const taskTypeOptions = [{id: 1, name: '升级App'}, {id: 2, name: '卸载App'}, {id: 3, name: '合并货道'}, {id: 4, name: '拆分货道'}]
const taskType = ['', '升级App', '卸载App', '合并货道', '拆分货道']
const taskStatusOptions = [{id: 0, name: '未执行'}, {id: 1, name: '待执行'}, {id: 2, name: '已执行'} ]
const taskStatus = ['未执行', '待执行', '已执行']
const doType = ['socket', 'push']

const CreateForm = Form.create()(
  (props) => {
    const {
      form, modalVisible, handleAdd, handleModalVisible,
      editModalConfirmLoading, openSelectMachineModal,
      disabledStartDate, modalType, disabledTime
    } = props;
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
      <Modal
        // title={
        //   <div class="modalBox">
        //     <span class="leftSpan"></span>
        //     <span class="modalTitle">{!modalType ? '编辑任务' : '新增排期'}</span>
        //   </div>
        // }
        // visible={modalVisible}
        onOk={handleAdd}
        // onCancel={() => handleModalVisible(false)}
        confirmLoading={editModalConfirmLoading}
        width={800} >
        {/*<div className="manageAppBox">*/}
          <Form>
            {/*<FormItem {...formItemLayout} label="选择任务类型">*/}
              {/*{getFieldDecorator('activityId', {*/}
                {/*rules: [{ required: false, message: '请选择任务类型' }],*/}
              {/*})(<Select placeholder="请选择">*/}
                {/*{taskTypeOptions.map((item) => {*/}
                  {/*return (*/}
                    {/*<Option value={item.id} key={item.id} data-id={item.id} data-type={item.type}>{item.name}</Option>*/}
                  {/*);*/}
                {/*})}*/}
              {/*</Select>)}*/}
            {/*</FormItem>*/}
            {/*<FormItem {...formItemLayout} label="选择机器">*/}
              {/*{getFieldDecorator('remark')(*/}
                {/*<div>*/}
                  {/*<Button type="primary" onClick={openSelectMachineModal}>+ 选择</Button>*/}
                {/*</div>)*/}
              {/*}*/}
            {/*</FormItem>*/}
            <FormItem {...formItemLayout} label="选择App">
              {getFieldDecorator('activityName', {
                rules: [{ required: false, message: '请选择App' }],
              })(<Select placeholder="请选择App">
                {taskTypeOptions.map((item) => {
                  return (
                    <Option value={item.id} key={item.id} data-id={item.id} data-type={item.type}>{item.name}</Option>
                  );
                })}
              </Select>)}
            </FormItem>
            <FormItem {...formItemLayout} label="升级版本">
              {getFieldDecorator('activityName', {
                rules: [{ required: false, message: '请填写升级版本' }],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="升级链接">
              {getFieldDecorator('activityName', {
                rules: [{ required: false, message: '请填写升级链接' }],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="选择开始时间">
              {getFieldDecorator('startTimeStr', {
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
              {getFieldDecorator('gameId', {
                rules: [{ required: false, message: '请选择执行方式' }],
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
        {/*</div>*/}
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
  saveFormRef = (form) => {
    this.form = form;
    console.log('this.form', this.form)
  }
  // 添加modal 添加事件
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: flag,
      modalData: {},
      modalType: true,
    });
    this.setModalData();
  };
  // 设置modal 数据
  setModalData = (data) => {
    console.log('this.form', this.form)
    if (data) {
      this.form.setFieldsValue({
        type: data.type || '',
        doType: data.doType || undefined,
        app: data.app || undefined,
        appUrl: data.appUrl || undefined,
        appVersion: data.appVersion,
      });
    } else {
      this.form.setFieldsValue({
        name: undefined,
        code: undefined,
        sellerId: undefined,
        remark: undefined,
        type: undefined,
      });
    }
  }
  taskType = (value) => {
    console.log('value', value)
  }
  watchTask = () => {

  }
  editTask = () => {

  }
  deleteTask = () => {

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
      taskSetting: { list },
      loading,
    } = this.props;
    const { modalType, modalVisible } = this.state
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
            <a onClick={() => this.editTask(item)}>编辑</a>
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
              <span class="modalTitle">{!modalType ? '编辑任务' : '新增排期'}</span>
            </div>
          }
          visible={modalVisible}
          // onOk={handleAdd}
          onCancel={() => this.handleModalVisible(false)}
          // confirmLoading={editModalConfirmLoading}
          width={800} >
          <div className="manageAppBox">
            <Form>
              <FormItem {...formItemLayout} label="选择任务类型">
                {/*{getFieldDecorator('activityId', {*/}
                  {/*rules: [{ required: false, message: '请选择任务类型' }],*/}
                {/*})(*/}
                  <Select placeholder="请选择" onSelect={() => this.taskType}>
                  {taskTypeOptions.map((item) => {
                    return (
                      <Option value={item.id} key={item.id} data-id={item.id} data-type={item.type}>{item.name}</Option>
                    );
                  })}
                </Select>
                {/*)}*/}
              </FormItem>
              <FormItem {...formItemLayout} label="选择机器">
                {/*{getFieldDecorator('remark')(*/}
                  <div>
                    <Button type="primary" onClick={this.openSelectMachineModal}>+ 选择</Button>
                  </div>)
                {/*}*/}
              </FormItem>
              {/*<div style={{ display: '' }}>*/}
                <CreateForm
                  ref={this.saveFormRef}
                  // modalVisible={this.state.modalVisible}
                  handleAdd={this.handleAdd}
                  // handleModalVisible={this.handleModalVisible}
                  // editModalConfirmLoading={this.state.editModalConfirmLoading}
                  // openSelectMachineModal={this.openSelectMachineModal}
                  disabledStartDate={this.disabledStartDate}
                  disabledTime={this.disabledTime}
                />
              {/*</div>*/}
            </Form>
          </div>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
