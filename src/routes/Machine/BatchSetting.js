import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Table,
  Button,
  Divider,
  message,
  Row,
  Col,
  Input,
  Modal
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './BatchSetting.less';
import BatchTableField from '../../components/Machine/batchTableSetting';
import {getAccountMenus} from "../../utils/authority";
import moment from "moment/moment";

const FormItem = Form.Item;
const CreateForm = Form.create()(
  (props) => {
    const { modalVisible, form, handleAdd, handleModalVisible, editModalConfirmLoading, modalType,
      verifyTimeRequire, gameLists, activityLists, openSelectMachineModal, selectCityName, machineNum,
      goodsInitData, goodsCount, couponsInitData, couponsCount, goodsHandle, goodsHandleAdd, goodsHandleDelete,
      goodsHandleChange, discountHandle, discountHandleAdd, discountHandleDelete, discountHandleChange, modalData,
      onSelectShop, goodsLists, shopClist,
      disabledStartDate, onStartChange, disabledEndDate, onEndChange, handleStartOpenChange, handleEndOpenChange, endOpen,
      isDisabled, selectMachineFlag, disabledTime, disabledEndTime, couponsShow, shopHandle, onSelectGame, maxNumber, remark
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
    const goodsColumns = [{
      title: '商品名称',
      dataIndex: 'name',
      align: 'center',
    }, {
      title: '规则',
      dataIndex: 'resultCode',
      align: 'center',
    }, {
      title: '规则描述',
      dataIndex: 'resultRemark',
      align: 'center',
    }];
    const couponsColumns = [{
      title: 'InteractID',
      dataIndex: 'code',
      align: 'center',
    }, {
      title: '优惠券名称',
      dataIndex: 'name',
      align: 'center',
    }, {
      title: '规则',
      dataIndex: 'resultCode',
      align: 'center',
    }, {
      title: '规则描述',
      dataIndex: 'resultRemark',
      align: 'center',
    }];
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
                  {
                    (remark ? remark : (
                      selectCityName.length > 0
                        ? '已选择' + machineNum + '台机器，分别位于' + selectCityName.join('、')
                        : ''
                    ))
                  }
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
            <FormItem {...formItemLayout} label="同一用户每天获得商品总次数">
              {getFieldDecorator('dayUserMaxTimes', {
                rules: [{ required: false, whitespace: true, message: '请填写同一用户每天获得商品总次数' }],
              })(<Input placeholder="请填写同一用户每天获得商品总次数" />)}
            </FormItem>
            {/*<FormItem {...formItemLayout} label="同一用户每天获得商品次数" style={{ display: isDisabled ? 'block' : 'none' }}>*/}
            {/*{getFieldDecorator('dayUserMaxTimes', {*/}
            {/*rules: [{ required: false, whitespace: true, message: '请填写同一用户获得商品次数' }],*/}
            {/*})(<Input placeholder="请填写同一用户每天获得商品次数" disabled />)}*/}
            {/*</FormItem>*/}
            <FormItem label={`填写商品信息：最多可添加${maxNumber}个商品`}>
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
@connect(({ common, loading, batchSetting }) => ({
  common,
  batchSetting,
  loading: loading.models.batchSetting,
}))
@Form.create()
export default class versionSetting extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    id: '',
    editModalConfirmLoading: false,
    pageNo: 1,
    keyword: '',
    account: {}
  };
  componentDidMount() {
    this.getLists();
    // this.getAccountMenus(getAccountMenus())
  }
  getAccountMenus = (setAccountMenusList) => {
    let account = setAccountMenusList.filter((item) => item.path === 'check')
    var obj = {}
    if (account[0]) {
      account = account[0].children.filter((item) => item.path === 'fault')
      if (account[0].children) {
        account[0].children.forEach((item, e) => {
          obj[item.path] = true;
        })
        this.setState({
          account: obj
        })
      }
    }
  }
  // 获取列表
  getLists = () => {
    this.props.dispatch({
      type: 'batchSetting/batchList',
      payload: {
        restParams: {
          type: 1
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
  // 新增modal确认事件 结束
  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={9} sm={24}>
            <FormItem>
              {getFieldDecorator('keyword')(<Input placeholder="请输入版本号、版本、更新内容搜索" />)}
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
      batchSetting: { list },
      loading,
    } = this.props;
    const { account } = this.state
    const columns = [
      {
        title: '批次名称',
        dataIndex: 'batchName',
        width: '20%',
      },
      {
        title: '批次编号',
        width: '20%',
        dataIndex: 'id',
      },
      {
        title: '创建人',
        dataIndex: 'createUser',
        width: '20%',
      },
      {
        title: '创建时间',
        dataIndex: 'updateTime',
      },
      {
        fixed: 'right',
        width: 150,
        title: '操作',
        render: () => (
          <Fragment>
            <a
              onClick={() => this.props.history.push({pathname: '/check/fault', query: {flag: 'openFault'}})}>
              查看
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => this.props.history.push({pathname: '/check/fault', query: {flag: 'openFault'}})}>
              编辑
            </a>
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
          <Button icon="arrow-left" type="primary" onClick={() => history.go(-1)}>
            新增
          </Button>
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
        </Card>
        <CreateForm />
      </PageHeaderLayout>
    );
  }
}
