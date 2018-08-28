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
  Select
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


const CreateForm = Form.create()(
  (props) => {
    const {} = props;
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
        title={
          <div class="modalBox">
            <span class="leftSpan"></span>
            <span class="modalTitle">{!modalType ? '编辑排期' : '新增排期'}</span>
          </div>
        }
        visible={modalVisible}
        onOk={handleAdd}
        onCancel={() => handleModalVisible(false)}
        confirmLoading={editModalConfirmLoading}
        width={800} >
        <div className="manageAppBox">
          <Form onSubmit={this.handleSearch}>
            <FormItem {...formItemLayout} label="选择活动" style={{ display : modalData.id ? 'none' : 'block' }}>
              {getFieldDecorator('activityId', {
                rules: [{ required: false, message: '请选择活动' }],
              })(<Select placeholder="请选择" onSelect={onSelectShop} >
                {activityLists.map((item) => {
                  return (
                    <Option value={item.id} key={item.id} data-id={item.id} data-type={item.type}>{item.name}</Option>
                  );
                })}
              </Select>)}
            </FormItem>
            <FormItem {...formItemLayout} label="选择活动" style={{ display : modalData.id ? 'block' : 'none' }}>
              {getFieldDecorator('activityName', {
                rules: [{ required: false, message: '请选择活动' }],
              })(<Input disabled />)}
            </FormItem>
            <FormItem {...formItemLayout} label="选择开始时间" style={{ display: isDisabled ? 'none' : 'block' }}>
              {getFieldDecorator('startTimeStr', {
                rules: [{ required: true, message: '选择开始时间' }],
              })(
                <DatePicker
                  disabledDate={disabledStartDate}
                  disabledTime={disabledTime}
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  format="YYYY-MM-DD HH:mm"
                  // value={startValue}
                  placeholder="选择开始时间"
                  onChange={onStartChange}
                  onOpenChange={handleStartOpenChange}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="选择开始时间" style={{ display: isDisabled ? 'block' : 'none' }}>
              {getFieldDecorator('startTimeStr', {
                rules: [{ required: true, message: '选择开始时间' }],
              })(
                <DatePicker
                  disabledDate={disabledStartDate}
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  // value={startValue}
                  placeholder="选择开始时间"
                  onChange={onStartChange}
                  onOpenChange={handleStartOpenChange}
                  disabled
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="选择结束时间">
              {getFieldDecorator('endTimeStr', {
                rules: [{ required: true, message: '选择结束时间' }],
              })(
                <DatePicker
                  disabledTime={disabledEndTime}
                  disabledDate={disabledEndDate}
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  format="YYYY-MM-DD HH:mm"
                  // value={endValue}
                  placeholder="选择结束时间"
                  onChange={onEndChange}
                  open={endOpen}
                  onOpenChange={handleEndOpenChange}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="选择机器">
              {getFieldDecorator('remark', {
                rule: [{ validator: verifyTimeRequire }],
              }) (
                <div>
                  { selectCityName.length > 0 ? '已选择' + machineNum + '台机器，分别位于' + selectCityName.join('、') : (modalData.id ? (modalData.remark ? modalData.remark : '暂无') : '') }
                  <Button type="primary" onClick={openSelectMachineModal}>+ 选择</Button>
                </div>
              )
              }
            </FormItem>
            {/*style={{ display: isDisabled ? 'block' : 'none' }}*/}
            <FormItem {...formItemLayout} label="选择游戏">
              {getFieldDecorator('gameId', {
                rules: [{ required: false, message: '请选择游戏' }],
              })(
                <Select placeholder="请选择" onSelect={onSelectGame}>
                  {gameLists.map((item) => {
                    return (
                      <Option value={item.id} key={item.id} data-maxNumber={item.maxGoodsNum}>{item.name}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
            {/*<FormItem {...formItemLayout} label="选择游戏" style={{ display: isDisabled ? 'block' : 'none' }}>*/}
            {/*{getFieldDecorator('gameId', {*/}
            {/*rules: [{ required: false, message: '请选择游戏' }],*/}
            {/*})(*/}
            {/*<Select placeholder="请选择" disabled>*/}
            {/*{gameLists.map((item) => {*/}
            {/*return (*/}
            {/*<Option value={item.id} key={item.id} >{item.name}</Option>*/}
            {/*);*/}
            {/*})}*/}
            {/*</Select>*/}
            {/*)}*/}
            {/*</FormItem>*/}
            <FormItem {...formItemLayout} label="同一用户获得商品次数">
              {getFieldDecorator('userMaxTimes', {
                rules: [{ required: false, whitespace: true, message: '请填写同一用户获得商品次数' }],
              })(<Input placeholder="请填写同一用户获得商品次数" />)}
            </FormItem>
            {/*<FormItem {...formItemLayout} label="同一用户获得商品次数" style={{ display: isDisabled ? 'block' : 'none' }}>*/}
            {/*{getFieldDecorator('userMaxTimes', {*/}
            {/*rules: [{ required: false, whitespace: true, message: '请填写同一用户获得商品次数' }],*/}
            {/*})(<Input placeholder="请填写同一用户获得商品次数" disabled />)}*/}
            {/*</FormItem>*/}
            <FormItem {...formItemLayout} label="同一用户每天获得商品次数">
              {getFieldDecorator('dayUserMaxTimes', {
                rules: [{ required: false, whitespace: true, message: '请填写同一用户每天获得商品次数' }],
              })(<Input placeholder="请填写同一用户每天获得商品次数" />)}
            </FormItem>
            {/*<FormItem {...formItemLayout} label="同一用户每天获得商品次数" style={{ display: isDisabled ? 'block' : 'none' }}>*/}
            {/*{getFieldDecorator('dayUserMaxTimes', {*/}
            {/*rules: [{ required: false, whitespace: true, message: '请填写同一用户获得商品次数' }],*/}
            {/*})(<Input placeholder="请填写同一用户每天获得商品次数" disabled />)}*/}
            {/*</FormItem>*/}
            <FormItem label={`填写商品信息：最多可添加${maxNumber || 100}个商品`}>
              {/*<Table*/}
              {/*columns={goodsColumns}*/}
              {/*dataSource={goodsInitData}*/}
              {/*rowKey={record => record.prizeId}*/}
              {/*pagination={false}*/}
              {/*style={{ display: isDisabled ? 'block' : 'none' }} />*/}
              <div className={styles.goodsNoteBox}>
                <FormItem label='若要重新选择商品时，需要重新选择一下店铺'>
                  <GoodsTableField
                    initData={goodsInitData}
                    count={goodsCount}
                    clist={goodsLists}
                    shopClist={shopClist}
                    shopHandle={shopHandle}
                    goodsHandle={goodsHandle}
                    goodsHandleAdd={goodsHandleAdd}
                    goodsHandleDelete={goodsHandleDelete}
                    goodsHandleChange={goodsHandleChange}
                    couponsShow={!couponsShow}
                    maxNumber={maxNumber}
                  />
                </FormItem>
              </div>
            </FormItem>
            {/*style={{ display: couponsShow ? 'block' : 'none' }}*/}
            <FormItem label="填写优惠券信息">
              {/*<Table columns={couponsColumns} dataSource={couponsInitData} rowKey={record => record.code} pagination={false} style={{ display: isDisabled ? 'block' : 'none' }} />*/}
              <div>
                <DiscountDynamicField
                  shopClist={shopClist}
                  couponsShow={!couponsShow}
                  initData={couponsInitData}
                  count={couponsCount}
                  discountHandle={discountHandle}
                  discountHandleAdd={discountHandleAdd}
                  discountHandleDelete={discountHandleDelete}
                  discountHandleChange={discountHandleChange}
                />
              </div>
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
    selectedRows: [],
    formValues: {},
    id: '',
    editModalConfirmLoading: false,

    pageNo: 1,
    type: '',
    status: ''
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
  overActivity = (item) => {
    this.props.dispatch({
      type: 'homePageSetting/overPlanSetting',
      payload: {
        params: {
          id: item.activityPlanId,
          status: 2,
        }
      },
    });
    this.getLists()
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
    const goodColumns = [ {
      title: '商品名称',
      dataIndex: 'goodsName',
      width: '100%',
    }]
    const goodColumns2 = [{
      title: '已派发数量',
      dataIndex: 'goodsCount',
      width: '100%',
    }]
    const goodColumns3 = [{
      title: '商品总数量',
      dataIndex: 'totalGoodsCount',
      width: '100%',
    }]
    const List = []
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
        // fixed: 'right',
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
      </PageHeaderLayout>
    );
  }
}
