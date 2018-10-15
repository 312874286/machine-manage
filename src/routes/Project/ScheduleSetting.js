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
  Tree,
  Radio,
  Table,
  Alert
} from 'antd';
import GoodsTableField from '../../components/GoodsTableField';
import DiscountDynamicField from '../../components/DiscountDynamicField';
import ScheduleTable from '../../components/ScheduleTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ScheduleSetting.less';
import {getAccountMenus} from "../../utils/authority";


const FormItem = Form.Item;
const { TextArea } = Input
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const RangePicker = DatePicker.RangePicker;
const TreeNode = Tree.TreeNode;
const couponsInitData = []
const ActivityStatus = [{ id: 0, name: '全部' }, { id: 1, name: '未开始' }, { id: 2, name: '进行中' }, { id: 3, name: '已结束' }];
const activityType = [{id: 0, name: '互动活动'}, {id: 1, name: '派样活动'}]

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
// const SelectMachineForm = Form.create()(
//   (props) => {
//     const { editMachineModalVisible, form, onEditMachineHandleAddClick, onEditMachineHandleModalVisibleClick, editMachineEditModalConfirmLoading,
//     renderTreeNodes, treeData, onLoadData, onExpand, expandedKeys, autoExpandParent, checkedKeys, selectedKeys, onCheck, onSelect, } = props;
//     const { getFieldDecorator } = form;
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
//             <span class="modalTitle">选择机器</span>
//           </div>
//         }
//         visible={editMachineModalVisible}
//         onOk={onEditMachineHandleAddClick}
//         onCancel={() => onEditMachineHandleModalVisibleClick()}
//         confirmLoading={editMachineEditModalConfirmLoading}
//         width={800}>
//         <div className="manageAppBox">
//           <Form onSubmit={this.handleSearch}>
//           <FormItem {...formItemLayout} label="选择机器">
//             {getFieldDecorator('machine', {
//               rules: [{ type: 'array', required: true, message: '请选择机器' }],
//             })(
//               <Tree
//                 loadData={onLoadData}
//                 checkable
//                 onExpand={onExpand}
//                 expandedKeys={expandedKeys}
//                 autoExpandParent={autoExpandParent}
//                 onCheck={onCheck}
//                 checkedKeys={checkedKeys}
//                 onSelect={onSelect}
//                 selectedKeys={selectedKeys}
//               >
//                 {renderTreeNodes(treeData)}
//               </Tree>
//             )}
//           </FormItem>
//         </Form>
//         </div>
//       </Modal>
//     );
// });
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
      title: '名称',
      dataIndex: 'machineCode',
      // render: text => <a href="javascript:;">{text}</a>,
      render: (text, record) => {
        return (
          record.planed === '1' ? (
            <a href="javascript:;">{record.machineCode}<span style={{ color : 'red' }}>/已占用</span></a>
          ) : (
            <a href="javascript:;">{record.machineCode}</a>
          )
        )
      }
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
              <Col md={8} sm={24}>
                <FormItem>
                  {getFieldDecorator('provinceCityAreaTrade')(
                    <Cascader
                      placeholder="请选择"
                      options={insertOptions}
                      loadData={loadData}
                      changeOnSelect
                    />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem>
                  {getFieldDecorator('machineCode')(<Input placeholder="请输入机器编码搜索" />)}
                </FormItem>
              </Col>
              <Col md={2} sm={24} style={{ paddingLeft: '3px' }}>
                <FormItem>
                  <Button onClick={() => findSourceData()} style={{ width: '70px', borderRadius: '4px' }}>
                    搜索
                  </Button>
                </FormItem>
              </Col>
            </Row>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('machine')(
                <div style={{ display: 'flex' }}>
                  <div>
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
                      style={{ width: '460px', marginBottom: '20px', marginTop: '10px' }}
                      scroll={{ y: 200 }}
                      pagination={false}
                    />
                    <Button onClick={() => addData()} style={{ display: selectAll ? 'block' : 'none' }}>
                      添加
                    </Button>
                  </div>
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
                      style={{ width: '460px', marginTop: '10px' }}
                      scroll={{ y: 200 }}
                      pagination={false}/>
                  </div>
                </div>
              )}
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  });
const WatchForm = Form.create()(
  (props) => {
    const { watchModalVisible, modalData, handleWatchModalVisible, goodsList, couponsList, watchDetailClick, couponsShow } = props;
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
    const goodsColumns = [{
      title: '店铺名称',
      dataIndex: 'shopName',
      align: 'center',
    }, {
      title: '商品名称',
      dataIndex: 'activityPlanId',
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
    const goodsColumns2 = [{
      title: '店铺名称',
      dataIndex: 'shopName',
      align: 'center',
    },{
      title: '商品名称',
      dataIndex: 'activityPlanId',
      align: 'center',
    }, {
      title: '数量',
      dataIndex: 'number',
      align: 'center',
    }, {
      title: '同一用户每天获得商品次数',
      dataIndex: 'userDayNumber',
      align: 'center',
    }];
    const couponsColumns = [{
      title: '店铺名称',
      dataIndex: 'shopName',
      align: 'center',
    }, {
      title: 'InteractID',
      dataIndex: 'code',
      align: 'center',
    }, {
      title: '优惠券名称',
      dataIndex: 'name',
      align: 'center',
    }];
    const couponsColumns2 = [{
      title: '店铺名称',
      dataIndex: 'shopName',
      align: 'center',
    }, {
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
            <span class="modalTitle">查看排期</span>
          </div>
        }
        visible={watchModalVisible}
        onCancel={() => handleWatchModalVisible()}
        footer={null}
        width={900}
      >
        <div className="manageAppBox">
          <Form>
          <FormItem {...formItemLayout} label="活动名称">
            <span>{modalData.activityName}</span>
          </FormItem>
          {/*<FormItem {...formItemLayout} label="所属商户">*/}
            {/*<span>{modalData.merchantName}</span>*/}
          {/*</FormItem>*/}
          {/*<FormItem {...formItemLayout} label="所属店铺">*/}
            {/*<span>{modalData.shopName}</span>*/}
          {/*</FormItem>*/}
          <FormItem {...formItemLayout} label="活动时间">
            <span>{modalData.startTime} - {modalData.endTime}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="机器">
            <span>{modalData.remark}</span>
            <a onClick={() => watchDetailClick(modalData.id)}>查看详情</a>
          </FormItem>
          <FormItem {...formItemLayout} label="游戏">
            <span>{modalData.gameName}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="同一用户获得商品次数">
            <span>{modalData.userMaxTimes}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="同一用户每天获得商品次数">
            <span>{modalData.dayUserMaxTimes}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="商品信息">
            <Table columns={couponsShow ? goodsColumns : goodsColumns2} dataSource={goodsList} rowKey={record => record.prizeId} pagination={false} />
          </FormItem>
          <FormItem {...formItemLayout} label="优惠券信息">
            <Table columns={couponsShow ? couponsColumns2 : couponsColumns} dataSource={couponsList} rowKey={record => record.code} pagination={false} />
          </FormItem>
        </Form>
        </div>
      </Modal>
    );
  });
const WatchMachine = Form.create()(
  (props) => {
    const { WatchMachineModalVisible, WatchMachineHandleModalVisibleClick, machineList } = props;
    const machineColumns = [{
      title: '机器点位',
      dataIndex: 'machineLocale',
      align: 'left',
      width: '80%'
    }, {
      title: '机器编码',
      dataIndex: 'machineCode',
      align: 'left',
      width: '20%'
    }];
    return (
      <Modal
        title={
          <div class="modalBox">
            <span class="leftSpan"></span>
            <span class="modalTitle">查看机器</span>
          </div>
        }
        width={600}
        visible={WatchMachineModalVisible}
        onCancel={() => WatchMachineHandleModalVisibleClick()}
        footer={null}
      >
        <div style={{ paddingBottom: '30px' }} className={styles.watchMachineBox}>
          <Table columns={machineColumns} dataSource={machineList} rowKey={record => record.prizeId} pagination={false} />
        </div>
      </Modal>
    );
  });
@connect(({ common, loading, scheduleSetting }) => ({
  common,
  scheduleSetting,
  loading: loading.models.rule,
}))
@Form.create()
export default class ScheduleSettingList extends PureComponent {
  state = {
    modalVisible: false,
    // selectedRows: [],
    formValues: {},
    // options: '',
    editModalConfirmLoading: false,
    pageNo: 1,
    keyword: '',
    modalData: {},
    code: '',
    status: '',
    type: '',
    modalType: true,
    activityLists: [],
    gameLists: [],

    editMachineModalVisible: false,
    // confirmLoading: false,
    // treeData: [
    //   // { title: 'Expand to load', key: '0' },
    //   // { title: 'Expand to load', key: '1' },
    //   // { title: 'Tree Node', key: '2', isLeaf: true },
    // ],
    selectCity: [],
    selectCityName: [],
    // expandedKeys: [],
    // autoExpandParent: true,
    // checkedKeys: [],
    // selectedKeys: [],
    editMachineEditModalConfirmLoading: false,
    // selectStatus: '0',
    insertOptions: [],
    targetData: [],
    sourceData: [],
    sourceKey: [],
    targetKey: [],
    selectAll: false,
    selectedRows: [],
    // code: '',
    repeat: [],
    // level: 1,
    selectedRowKeys: [],
    options: [],
    defaultValue: [],


    dateList: [],
    resList: [],
    goodsLists: [],
    shopClist: [],
    handleDays: {},
    startTime: '',
    getDataStartDay: '',
    endTime: '',
    getDataEndDay: '',
    machineNum: 0,

    goodsInitData: [],
    couponsInitData: [],
    goodsCount: 0,
    couponsCount: 0,
    machines: [],
    machineStartTime: '',
    machineEndTime: '',

    WatchMachineModalVisible: false,
    machineList: [],

    startValue: null,
    endValue: null,
    endOpen: false,
    isDisabled: false,
    selectMachineFlag: false,
    couponsShow: true,

    goodsTables: [],
    maxNumber: 0,
    remark: '',

    account: {}
  };
  componentDidMount() {
    this.getSearchAreaList();
    // this.getLists();
    this.getAccountMenus(getAccountMenus())
  }
  getAccountMenus = (setAccountMenusList) => {
    const pointSettingMenu = setAccountMenusList.filter((item) => item.path === 'project')[0]
      .children.filter((item) => item.path === 'schedule')
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
  // 获取城市列表
  getSearchAreaList = () => {
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
  // 时间控件开始
  range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }
  disabledTime = () => {
    return {
      disabledSeconds: () => this.range(1, 60),
    };
  }
  disabledEndTime = () => {
    return {
      disabledSeconds: () => this.range(0, 59),
    };
  }
  disabledStartDate = (startValue) => {
    // console.log('disabledStartDate', startValue)
    // const endValue = this.state.endValue;
    // if (!startValue || !endValue) {
    //   return false;
    // }
    // return startValue.valueOf() > endValue.valueOf();
    return startValue < moment(new Date().setDate(new Date().getDate() - 1)).endOf('day');
  }
  disabledEndDate = (endValue) => {
    // console.log('disabledEndDate', endValue)
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    // console.log('1', endValue, '2', this.state.endValue, '3', startValue.valueOf())
    // return endValue.valueOf() <= startValue.valueOf() 时间戳
    // endValue <= moment(startValue.valueOf()) &&
    // console.log(typeof this.state.endValue)
    return !this.state.modalType ? (endValue < moment(new Date().setDate(new Date().getDate() - 1)).endOf('day')) : (endValue.valueOf() <= startValue.valueOf()) ;
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }
  onStartChange = (value) => {
    // console.log('onStartChange', value)
    this.onChange('startValue', value);
  }

  onEndChange = (value) => {
    // console.log('onEndChange', value)
    this.onChange('endValue', value);
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  }
  // 时间控件结束
  onSelectShop = (value, option) => {
    console.log('value, option', value, option)
    if (option.props['data-type'] === 1) {
      this.setState({
        couponsShow: false
      })
    } else {
      this.setState({
        couponsShow: true
      })
    }
    this.getActivityShops(value)
    // this.getGoodsLists(option.props['data-id']);
  }
  getActivityLists = () => {
    this.props.dispatch({
      type: 'scheduleSetting/activityList',
      payload: {
        restParams: {},
      },
    }).then((res) => {
      res = res.map((item) => {
        return { type: item.type, id: item.id, name: item.name }
      })
      this.setState({
        activityLists: res,
      });
    });
  }
  getActivityShops = (activityId) => {
    this.props.dispatch({
      type: 'scheduleSetting/getActivityShops',
      payload: {
        restParams: {
          activityId: activityId ? activityId : ''
        },
      },
    }).then((res) => {
      // 初始化商品
      // const goodsData = {
      //   key: 0,
      //   shopName: '',
      //   prizeId: '',
      //   number: 0,
      //   resultCode: '1',
      //   resultRemark: '描述',
      //   prizeType: '1',
      // };
      this.setState({
        goodsInitData: [],
        goodsCount: 0,
        couponsInitData: [],
        couponsCount: 0,
        goodsTables: [],
        shopClist: res
      });
      // this.setState({
      //   shopClist: res
      // });
      // 初始化优惠券
      // const couponsData = {
      //   key: 0,
      //   code: '优惠券编号',
      //   name: '优惠券名称',
      //   resultCode: '1',
      //   resultRemark: '描述',
      //   prizeType: '2',
      // };
      // this.setState({
      //   couponsInitData: [],
      //   couponsCount: 0,
      // });
    });
  }
  getGamesLists = (shopId) => {
    this.props.dispatch({
      type: 'scheduleSetting/gameList',
      payload: {
        restParams: {
          shopId: shopId ? shopId : ''
        },
      },
    }).then((res) => {
      this.setState({
        gameLists: res,
      });
    });
  }
  getGoodsLists = (shopId) => {
    this.props.dispatch({
      type: 'scheduleSetting/getGoodsList',
      payload: {
        restParams: {
          shopId: shopId ? shopId : ''
        },
      },
    }).then((res) => {
      if (res.length > 0) {
        if (this.state.goodsInitData.length >0) {
          let goodsInitData = this.state.goodsInitData
          for (let i = 0; i < goodsInitData.length; i++ ) {
            for (let j = 0; j < res.length; j++) {
              // console.log('res[j].id === goodsInitData.prizeId', j, i, res[j].id, goodsInitData[i].prizeId)
              if (res[j].id === goodsInitData[i].prizeId) {
                res.splice(j, 1)
                break
              }
            }
          }
        }
      }
      this.setState({
        goodsLists: res,
      });
    });
  }
  // 获取列表
  getLists = () => {
    this.props.dispatch({
      type: 'scheduleSetting/getScheduleSettingList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          endTime: this.state.endTime,
          startTime: this.state.startTime,
          code: this.state.code,
          status: this.state.status,
          type: this.state.type
        },
      },
    }).then((res) => {
      // console.log('总时间', this.state.startTime, this.state.endTime)
      // console.log('获取数据时间', this.state.getDataStartDay, this.state.getDataEndDay)
      // console.log(this.state.startTime === this.state.getDataStartDay && this.state.endTime === this.state.getDataEndDay)
      if (this.state.startTime === this.state.getDataStartDay && this.state.endTime === this.state.getDataEndDay) {
        this.setState({
          resList: []
        });
      }
      if (res) {
        let activityArrs = res.length > 0 ? res : this.state.resList
        if (this.state.resList.length > 0) {
          if (res.length > 0) {
            activityArrs = [...res, ...this.state.resList]
            let temp = []
            for (var i = 0; i < activityArrs.length; i++) {
              var item = activityArrs[i]
              if (!(item['id'] in temp)) {
                temp[item['id']] = item;
              }
            }
            activityArrs = Object.values(temp);
          }
        }
        // console.log('activityArrs', activityArrs)
        let dateList = this.drawLine(activityArrs)
        console.log('dateList', dateList)
        this.setState({
          resList: activityArrs,
          dateList,
        });
      };
    });
  }
  drawLine = (arr) => {
    // console.log('time', this.state.startTime, this.state.endTime)
    // console.log('startTime', this.state.handleDays.getDataStartDay, this.state.handleDays.getDataEndDay)
    let activityArr =[]
    let left;
    let width;
    let background = 'Green'
    arr.forEach((item, index) => {
      let time = '开始时间：' + item.startTime + '--' + '结束时间: ' + item.endTime
      const DateNo = 24 * 60 * 60 * 1000
      if (moment(item.startTime) >= moment(this.state.startTime)) {
        // 开始日期>范围的开始日期
        if (moment(item.endTime) <= moment(this.state.endTime)) {
          // 开始时间及结束日期在15天的范围
          left = Math.floor((moment(item.startTime) - moment(this.state.startTime)) / DateNo)
          width = Math.floor((moment(item.endTime) - moment(item.startTime)) / DateNo)
          // console.log('开始时间及结束日期在15天的范围')
        } else {
          // 结束日期>范围的结束日期
          left = Math.floor((moment(item.startTime) - moment(this.state.startTime)) / DateNo)
          width = Math.ceil((moment(this.state.endTime) - moment(item.startTime)) / DateNo)
          // console.log('结束日期>范围的结束日期', left, width)
        }
      } else {
        // 开始日期<范围的开始日期
        left = 0, width = '';
        if (moment(item.endTime) >= moment(this.state.handleDays.endDay)) {
          // console.log('jieshu日期<范围的开始日期', left, width)
          width = Math.floor((moment(this.state.endTime) - moment(this.state.startTime)) / DateNo)
        } else {
          width = Math.floor((moment(item.endTime) - moment(this.state.startTime)) / DateNo)
          // console.log('开始日期<范围的开始日期', left, width)
        }
      }
      let tmp = {
        // left: (6.5 * left) + '%',
        // top: (25 + (index * 4)) + '%',
        // width: (6.496 * (width + 1)) + '%',
        left: (69.33 * left) + 'px',
        top: (85 + (index * 50)) + 'px',
        width: (69.33 * (width + 1)) + 'px',
        background: background,
        height: '20px',
        Time: time,
        startTime: item.startTime,
        endTime: item.endTime,
        name: item.activityName,
        id: item.id,
        isDelete: item.isDelete,
      }
      activityArr.push(tmp);
    })
    return activityArr;
  }
  handleDays = (val) => {
    // console.log('val', val)
    this.setState({
      handleDays: val,
      startTime: val.startDay,
      endTime: val.endDay,
      getDataStartDay: val.getDataStartDay,
      getDataEndDay: val.getDataEndDay,
    }, () => {
      this.getLists();
    });
  }
  // 验证
  verifyPhone = (rule, value, callback) => {
    const reg = /^[1][0-9][0-9]{9}$/;
    if (!reg.test(value)) {
      callback('请填写正确的手机号码');
    } else {
      callback();
    }
  }
  verifyString = (rule, value, callback) => {
    if (value.length < 4) {
      callback('请填写完整的省市区商圈');
    } else {
      callback();
    }
  }
  verifyTrim = (rule, value, callback) => {
    let v = value.replace(/(^\s*)|(\s*$)/g, '')
    if (v === '') {
      callback('不可输入空格');
    } else {
      callback();
    }
  }
  verifyTimeRequire = (rule, value, callback) => {

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
      code: '',
    });
  };

  // 搜索
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let localCode = ''
      if (fieldsValue.provinceCityAreaTrade) {
        if (fieldsValue.provinceCityAreaTrade.length > 0) {
          localCode = fieldsValue.provinceCityAreaTrade[fieldsValue.provinceCityAreaTrade.length - 1];
        }
      }
      // console.log('fieldsValue.status', fieldsValue.status)
      this.setState({
        pageNo: 1,
        keyword: fieldsValue.keyword ? fieldsValue.keyword : '',
        code: localCode,
        status: fieldsValue.status >= 0 ? fieldsValue.status : '',
        type: fieldsValue.type >= 0 ? fieldsValue.type : ''
      }, () => {
        this.getLists();
      });
    });
  };
  // 添加modal 添加事件
  handleModalVisible = (flag) => {
    // activityList
    this.getActivityLists()
    // gameList
    this.getGamesLists()
    this.setState({
      goodsInitData: [],
      couponsInitData: [],
    }, () => {
      this.setState({
        modalVisible: !!flag,
        modalData: {},
        modalType: true,
      });
      this.setModalData();
    })
    if (!flag) {
      this.setState({ endOpen: false });
    }

  };
  // 删除modal 删除事件
  handleDelClick = (item) => {

  }
  // 编辑modal 编辑事件
  handleEditClick = (item) => {
    console.log('handleEditClick', item)
    // activityList
    this.getActivityLists()
    // gameList
    this.getGamesLists()
    this.setState({
      modalVisible: true,
      modalData: item,
      modalType: false,
    });
    this.props.dispatch({
      type: 'scheduleSetting/getScheduleSettingDetail',
      payload: {
        restParams: {
          id: item.id,
        },
      },
    }).then((res) => {
      // this.getGoodsLists()
    });
  }
  // 设置modal 数据
  setModalData = (data) => {
    // isDisabled
    if (data) {
      if (moment(data.startTime) < new Date().getTime()) {
        // 活动开始比现在晚，可以更改日期
        this.setState({
          isDisabled: true,
          startValue: data.startTime,
          endValue: data.endTime,
        });
      }
      this.setState({
        remark: data.remark
      })
      this.form.setFieldsValue({
        activityId: data.activityId,
        gameId: data.gameId,
        userMaxTimes: data.userMaxTimes,
        dayUserMaxTimes: data.dayUserMaxTimes,
        activityName: data.activityName,
        startTimeStr: moment(data.startTime),
        endTimeStr: moment(data.endTime),
      });
    } else {
      this.form.setFieldsValue({
        startTimeStr: undefined,
        endTimeStr: undefined,
        activityId: undefined,
        gameId: undefined,
        userMaxTimes: undefined,
        dayUserMaxTimes: undefined,
      });
      this.setState({
        isDisabled: false,
        machineNum: '',
        selectCityName: '',
        goodsInitData: [],
        goodsCount: 0,
        couponsInitData: [],
        couponsCount: 0,
        goodsLists: [],
        endValue: '',
        startValue: '',
        remark: ''
      });
    }
  }
  // 商品信息及优惠券的操作开始
  goodsHandle = (initData, value, record, key) => {
    // console.log('1111record::', record);
    // const { goodsLists } = this.state
    // let goodsInitData = record
    // for (var i = 0; i < goodsLists.length; i++ ) {
    //   if (goodsLists[i].id === value) {
    //     // record.name = this.state.clist[i].name;
    //     goodsInitData[0].number = goodsLists[i].number
    //   }
    // }

    // for (let i = 0; i < this.state.goodsTables.length; i++) {
    //   console.log('value === this.state.goodsTables[i].prizeId', value, this.state.goodsTables[i].prizeId)
    //   if (value === this.state.goodsTables[i].prizeId) {
    //     return false
    //   }
    // }
    console.log('initData', initData)
    record = this.getGoodsNumber(value, record, initData, key)
    console.log('record', record)
    this.setState({
      goodsTables: [...this.state.goodsTables, record]
    }, () => {
      // console.log('2222record::', record, initData);
      this.setState({
        goodsInitData: record,
        goodsLists: []
      });
    })
  }
  getGoodsNumber = (value, record, initData, key) => {
    const { goodsLists } = this.state
    for (let j = 0; j < initData.length; j++) {
      if (initData[j].key === key) {
        for (var i = 0; i < goodsLists.length; i++ ) {
          if (goodsLists[i].id === value) {
            // record.name = this.state.clist[i].name;
            record.number = goodsLists[i].number
          }
        }
      }
    }
    return initData;
  }
  shopHandle = (shopId) => {
    this.getGoodsLists(shopId)
  }
  goodsHandleAdd = (val, currentValue) => {
    // console.log(v);
    const { goodsInitData, goodsCount } = this.state;
    const newData = {
      key: goodsCount,
      shopName: '',
      prizeId: '',
      number: 0,
      userDayNumber: 0,
      resultCode: '1',
      resultRemark: '描述',
      prizeType: '1',
    };
    this.setState({
      goodsInitData: [...goodsInitData, newData],
      goodsCount: goodsCount+1,
    }, () => {
      console.log('goodsHandleAdd::', this.state.goodsCount);
    });
  }
  goodsHandleDelete = (key) => {
    const goodsInitData = [...this.state.goodsInitData];
    this.setState({ goodsInitData: goodsInitData.filter(item => item.key !== key) });
    // console.log('goodsHandleDelete::', key, goodsInitData);
  }
  goodsHandleChange = (row) => {
    const newData = [...this.state.goodsInitData];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });

    this.setState({ goodsInitData: newData });
    // console.log('goodsHandleChange::', row);
  }
  discountHandle = (val) => {
    console.log('val', val)
    this.setState({
      couponsInitData: val,
    });
  }
  discountHandleAdd = (val, currentValue) => {
    const { couponsInitData, couponsCount } = this.state;
    const newData = {
      key: couponsCount,
      shopsId: '',
      shopName: '',
      code: '优惠券编号',
      name: '优惠券名称',
      resultCode: '1',
      resultRemark: '描述',
      prizeType: '2',
    };
    this.setState({
      couponsInitData: [...couponsInitData, newData],
      couponsCount: couponsCount+1,
    }, () => {
      console.log('discountHandleAdd::', this.state.couponsCount);
    });
  }
  discountHandleDelete = (key) => {
    const couponsInitData = [...this.state.couponsInitData];
    this.setState({ couponsInitData: couponsInitData.filter(item => item.key !== key), });
    // console.log('discountHandleDelete::', key, couponsInitData.filter(item => item.key !== key));
  }
  discountHandleChange = (row) => {
    const newData = [...this.state.couponsInitData];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ couponsInitData: newData });
  }
  // 商品信息及优惠券的操作结束
  // 选择游戏之后限制新增商品的数量
  onSelectGame = (value, option) => {
    console.log('value, option', value, option)
    this.setState({
      maxNumber: parseInt(option.props['data-maxNumber']) || 100
    })
  }
  // 新增modal确认事件 开始
  saveFormRef = (form) => {
    this.form = form;
  }
  // 编辑modal 确认事件
  handleAdd = () => {
    this.setState({
      selectMachineFlag: false,
    }, () => {
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          return;
        }
        if (!fieldsValue.activityId || !fieldsValue.gameId || !fieldsValue.userMaxTimes) {
          message.config({
            top: 100,
            duration: 2,
            maxCount: 1,
          });
          message.error('请补全信息')
          return;
        }
        console.log('fieldsValue.dayUserMaxTimes > fieldsValue.userMaxTimes', fieldsValue.dayUserMaxTimes, fieldsValue.userMaxTimes)
        if (parseInt(fieldsValue.dayUserMaxTimes) > parseInt(fieldsValue.userMaxTimes)) {
          message.config({
            top: 100,
            duration: 2,
            maxCount: 1,
          });
          message.error('同一用户每天获得商品次数应该小于同一用户获得商品次数，请重新填写')
          return;
        }
        console.log('fieldsValue', fieldsValue, this.state.targetData)
        // if (!this.state.modalData.id) {
        if (this.state.targetData.length === 0) {
          message.config({
            top: 100,
            duration: 2,
            maxCount: 1,
          });
          message.error('请先选择机器')
          return;
        }
        // }
        let goods = this.state.goodsInitData
        if (!this.state.couponsShow) {
          // 派样活动
          if (goods.length === 0) {
            message.config({
              top: 100,
              duration: 2,
              maxCount: 1,
            });
            message.error('请添加商品信息')
            return;
          }
          goods = goods.map((item) => {
             return { prizeId: item.prizeId, number: item.number, userDayNumber: item.userDayNumber }
          })
        } else {
          // 非派样活动
          // if (this.state.couponsInitData.length === 0) {
          //   message.config({
          //     top: 100,
          //     duration: 2,
          //     maxCount: 1,
          //   });
          //   message.error('非派样活动请添加优惠券')
          //   return;
          // }
          goods = goods.map((item) => {
            return { prizeId: item.prizeId, resultCode: item.resultCode, resultRemark: item.resultRemark }
          })
        }
        let coupons = this.state.couponsInitData
        console.log('this.state.couponsInitData', this.state.couponsInitData)
        if (this.state.couponsInitData) {
          if (!this.state.couponsShow) {
            // 派样活动
            coupons = coupons.map((item) => {
              return { code: item.code, name: item.name, shopsId: item.shopsId}
            })
          } else {
            coupons = coupons.map((item) => {
              return {  code: item.code, name: item.name, shopsId: item.shopsId, resultCode: item.resultCode, resultRemark: item.resultRemark  }
            })
          }
        }
        let params = {
          ...fieldsValue,
          goods,
          coupons,
          machines: this.state.targetData,
          startTimeStr: fieldsValue.startTimeStr.format('YYYY-MM-DD HH:mm'),
          endTimeStr: fieldsValue.endTimeStr.format('YYYY-MM-DD HH:mm'),
        };
        this.setState({
          editModalConfirmLoading: true,
        });
        let url = 'scheduleSetting/saveScheduleSetting';
        let messageTxt = '新增';
        if (this.state.modalData.id) {
          url = 'scheduleSetting/editScheduleSetting';
          params = { ...params, id: this.state.modalData.id };
          messageTxt = '编辑';
        } else {
          params = { ...params, remark: this.state.selectCityName.length > 0 ? '已选择' + this.state.machineNum + '台机器，分别位于' + this.state.selectCityName.join('、') : ''}
        }
        this.props.dispatch({
          type: url,
          payload: {
            params,
          },
        }).then((resp) => {
          if (resp && resp.code === 0) {
            // message.success( messageTxt + '成功');
            this.setState({
              code: '',
              getDataStartDay: this.state.startTime,
              getDataEndDay: this.state.endTime,
              modalData: {},
              maxNumber: 100,
              targetData: [],
              goodsCount: 0,
              couponsCount: 0,
              goodsInitData: [],
              couponsInitData: [],
            }, () => {
              this.getLists();
            });
          } else {
            // Modal.error({
            //   title: '',
            //   content: resp ? resp.msg : messageTxt + '失败',
            // });
            this.setState({
              editModalConfirmLoading: false,
            });
            return;
          }
          this.setState({
            editModalConfirmLoading: false,
            modalVisible: false,
          });
        });
      });
    });
  }
  // 新增modal确认事件 结束
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
  // 四级联动结束
  // tree开始
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      // parseInt(item.canUseNum) === 0
      return (item.disabledFlag) ? (<TreeNode {...item} dataRef={item} disabled />) : (<TreeNode {...item} dataRef={item} />);
    });
  }
  onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      // console.log('treeNode.props.dataRef', treeNode.props.dataRef.value, treeNode.props.children)
      const targetOption = treeNode.props.dataRef;
      // targetOption.loading = true;
      this.setState({
        code: targetOption.value,
      }, () => {
        this.props.dispatch({
          type: 'scheduleSetting/selectAreaMachines',
          payload: {
            restParams: {
              code: targetOption.value,
              level: targetOption.level + 1,
              startTime: this.state.machineStartTime,
              endTime: this.state.machineEndTime,
            },
          },
        }).then((res) => {
          // targetOption.loading = false;
          targetOption.children = res
          console.log('res', res)
          this.setState({
            treeData: [...this.state.treeData],
          });
          resolve();
        });
      });
    });
  }
  onExpand = (expandedKeys, node) => {
    // console.log('onExpand展开/收起节点时触发', expandedKeys, node);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  onCheck = (checkedKeys, node) => {
    // .checkedNodes[0].props.dataRef.value
    console.log('onCheck点击复选框触发', checkedKeys, node);

    // let node =
    this.setState({ checkedKeys, selectCity: node.checkedNodes });
  }
  onSelect = (selectedKeys, info) => {
    // console.log('onSelect点击树节点触发', info);
    // this.setState({ selectedKeys });
  }
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
        remark: '',
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
      return false
    }
  }
  uniq = (arr) => {
    let max = [];
    let selectCityName = []
    // for(var i=0;i<arr.length;i++) {
    //   var item = arr[i].props.dataRef;
    //   if(!(item['province'] in max) || (item['level'] > max[item['province']]['level'])){
    //     // init compare
    //     max[item['province']] = item;
    //   }
    // }
    // Object.values(max)
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i].props.dataRef
      if (!item.children) {
        item.machines.forEach((MItem) => {
          max.push(MItem);
        });
        if (!(item['province'] in selectCityName)) {
          selectCityName[item['province']] = item.province;
        }
        // selectCityName.push(item.province)
      }
    }
    selectCityName = Object.values(selectCityName)
    this.setState({
      machineNum: max.length,
      selectCityName,
      machines: max,
    }, () => {
      console.log(this.state.machines)
      this.setState({
        editMachineModalVisible: false,
      });
    });
  }
  timeFormRef = (form) => {
    this.timeFormRef = form;
  }
  openSelectMachineModal = () => {
    this.setState({
      sourceData: [],
      selectMachineFlag: true,
      checkedKeys: [],
      expandedKeys: [],
      autoExpandParent: true,
    }, () => {
      this.form.validateFields((err, fieldsValue) => {
        console.log('224', this.state.isDisabled)
        if (err) return;
        // if (fieldsValue.gameId)
        // if (fieldsValue.remark)
        // if (fieldsValue.userMaxTimes)
        console.log('fieldsValue', fieldsValue)
        let params = {
          ...fieldsValue,
          code: this.state.code,
          level: 1,
          startTimeStr: !this.state.isDisabled ? fieldsValue.startTimeStr.format('YYYY-MM-DD HH:mm') : moment().format('YYYY-MM-DD HH:mm'),
          endTimeStr: fieldsValue.endTimeStr.format('YYYY-MM-DD HH:mm'),
        };
        this.setState({
          machineStartTime: params.startTimeStr,
          machineEndTime: params.endTimeStr,
        }, () => {
          // this.props.dispatch({
          //   type: 'scheduleSetting/selectAreaMachines',
          //   payload: {
          //     restParams: {
          //       code: this.state.code,
          //       level: 1,
          //       startTime: this.state.machineStartTime,
          //       endTime: this.state.machineEndTime,
          //     },
          //   },
          // }).then((res) => {
          //   this.setState({
          //     treeData: res,
          //   }, () => {
          //     this.setState({
          //       editMachineModalVisible: true,
          //     });
          //   });
          // });
            this.setState({
              editMachineModalVisible: true,
            }, () => {
              this.getAreaList({level: 1});
            });
            this.selectMachineform.setFieldsValue({
              provinceCityAreaTrade: undefined
            })
        });
      });
    });
  }
  // onEditMachineHandleModalVisibleClick = () => {
  //   this.setState({
  //     editMachineModalVisible: false,
  //   });
  // }
  // selectMachineFormRef = (form) => {
  //   this.selectMachineform = form;
  // }
  // tree结束
  // 动态添加开始
  onRadioChange = (e) => {
    this.setState({
      selectStatus: e.target.value,
    });
  }
  //   动态添加结束
  // 日历排期表格的编辑，查看，删除
  getDetail = (item) => {
  }
  handleWatchModalVisible = () => {
    this.setState({
      watchModalVisible: false,
    });
  }
  getEditActivityShops = (activityId) => {
    this.props.dispatch({
      type: 'scheduleSetting/getActivityShops',
      payload: {
        restParams: {
          activityId: activityId ? activityId : ''
        },
      },
    }).then((res) => {
      this.setState({
        shopClist: res
      });
    });
  }
  // 编辑
  onEditClick = (item) => {
    // key: goodsCount,
    //   shopName: '',
    //   prizeId: '',
    //   number: 0,
    //   resultCode: '1',
    //   resultRemark: '描述',
    //   prizeType: '1',
    console.log('item编辑', item)
    // activityList
    // this.getActivityLists()
    // gameList
    this.getGamesLists()
    this.props.dispatch({
      type: 'scheduleSetting/getScheduleSettingDetail',
      payload: {
        restParams: {
          id: item.id,
        },
      },
    }).then((res) => {
      // console.log('res', res)
      // this.getGoodsLists(res.shopId)
      if (parseInt(res.activityType) === 1) {
        this.setState({
          couponsShow: false
        })
      } else {
        this.setState({
          couponsShow: true
        })
      }
      this.getEditActivityShops(res.activityId)
      // for (let i = 0; i< res.goods.length; i++) {
      //   console.log('res.goods[i].shopId', res.goods[i], res.goods[i].shopsId)
      //   this.getGoodsLists(res.goods[i].shopsId)
      // }
      let goodsInitDatas = res.goods.map((item, index) => {
        return {
          key: index,
          id: item.shopId,
          shopName: item.shopName,
          number: item.number,
          userDayNumber: item.userDayNumber,
          name: item.activityPlanId,
          prizeId: item.prizeId,
          prizeType: item.prizeType,
          resultCode: item.resultCode,
          resultRemark: item.resultRemark
        }
      })
      let couponsInitDatas = res.coupons.map((item, index) => {
        return {
          key: index,
          shopName: item.shopName,
          shopsId: item.shopsId,
          code: item.code,
          name: item.name,
          prizeType: item.prizeType,
          resultCode: item.resultCode,
          resultRemark: item.resultRemark
        }
      })
      this.setState({
        maxNumber: res.maxGoodsNum ? res.maxGoodsNum : '',
        targetData: res.machines,
        goodsCount: res.goods.length,
        couponsCount: res.coupons.length,
        goodsInitData: res.goods.length > 0 ? goodsInitDatas : [],
        couponsInitData: res.coupons.length > 0 ? couponsInitDatas : [],
      }, () => {
        this.setState({
          modalVisible: true,
          modalData: res,
          modalType: false,
        });
        this.setModalData(res);
      });
    });
  }
  onWatchClick = (item) => {
    console.log('item查看', item)
    this.props.dispatch({
      type: 'scheduleSetting/getScheduleSettingDetail',
      payload: {
        restParams: {
          id: item.id,
        },
      },
    }).then((res) => {
      if (parseInt(res.activityType) === 1) {
        this.setState({
          couponsShow: false
        })
      } else {
        this.setState({
          couponsShow: true
        })
      }
      this.setState({
        goodsInitData: res.goods.length > 0 ? res.goods : [],
        couponsInitData: res.coupons.length > 0 ? res.coupons : [],
      }, () => {
        this.setState({
          modalVisible: false,
          modalData: res,
          watchModalVisible: true,
        });
      });
    });
  }
  onDeleteClick = (item) => {
    console.log('item删除', item)
    this.setState({
      editModalConfirmLoading: true,
    });
    if (item) {
      const params = { id: item.id, status: 1 };
      this.props.dispatch({
        type: 'scheduleSetting/delScheduleSetting',
        payload: {
          params,
        },
      }).then((res) => {
        if (res && res.code === 0) {
          message.success('删除成功');
          this.setState({
            code: '',
            getDataStartDay: this.state.startTime,
            getDataEndDay: this.state.endTime,
          }, () => {
            this.getLists();
          })
          this.setState({
            editModalConfirmLoading: false,
          });
        }
        // else {
        //   message.error(res ? res.msg : '删除失败');
        // }
      });
    } else return false;
  }
  watchDetailClick = () => {
    console.log('查看机器详情', this.state.modalData)
    this.props.dispatch({
      type: 'scheduleSetting/getPlanMachineDetailList',
      payload: {
        restParams: {
          id: this.state.modalData.id,
        },
      },
    }).then((res) => {
      this.setState({
        machineList: res,
        WatchMachineModalVisible: true,
      });
    });
  }
  WatchMachineHandleModalVisibleClick = () => {
    this.setState({
      WatchMachineModalVisible: false,
    });
  }
  // 日历table操作开始
  // 日历table操作结束
  // 选择机器开始
  // 回显省市区商圈数据源开始
  getAreaList = (selectedOptions) => {
    console.log('res', selectedOptions)
    let code = '';
    let targetOption = null;
    let params = { code: code }
    if (selectedOptions) {
      if (selectedOptions.level) {
        params = { ...params, level: 1, startTime: this.state.machineStartTime, endTime: this.state.machineEndTime }
      } else if (selectedOptions.code) {
        params = {
          code: selectedOptions.code,
          startTime: this.state.machineStartTime,
          endTime: this.state.machineEndTime,
          machineCode: selectedOptions.machineCode ? selectedOptions.machineCode : ''
        }
      } else {
        targetOption = selectedOptions[selectedOptions.length - 1];
        code = targetOption.value;
        targetOption.loading = true;
        params = { code: code, level: targetOption.level + 1, startTime: this.state.machineStartTime, endTime: this.state.machineEndTime}
      }
    }
    this.props.dispatch({
      type: 'scheduleSetting/selectAreaMachines',
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
      if (fieldsValue.provinceCityAreaTrade) {
        if (fieldsValue.provinceCityAreaTrade.length > 0) {
          localCode = fieldsValue.provinceCityAreaTrade[fieldsValue.provinceCityAreaTrade.length - 1]
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
      // , machineCode: fieldsValue.machineCode
      this.getAreaList({code: localCode, machineCode: fieldsValue.machineCode})
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
    this.setState({
      targetData: this.state.modalData.machines ? this.state.modalData.machines : [],
    });
  }
  selectMachineFormRef = (form) => {
    this.selectMachineform = form;
  }
  // 选择机器结束
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
                  onChange={this.onChange}
                  changeOnSelect
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="活动状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择活动状态">
                  {ActivityStatus.map((item) => {
                    return (
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="选择活动类型">
              {getFieldDecorator('type')(
                <Select placeholder="请选择活动类型">
                  {activityType.map((item) => {
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
  // 四级联动结束
  render() {
    const {
      scheduleSetting: { list, page },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, editModalConfirmLoading, modalData, modalType,
      options, gameLists, activityLists, goodsLists, shopClist, account } = this.state;
    const columns = [
      {
        title: '所属省市区商圈',
        // width: 200,
        dataIndex: 'areaName',
      },
      {
        title: '商场',
        // width: 200,
        dataIndex: 'mall',
      },
      {
        title: '运营人',
        width: 100,
        dataIndex: 'manager',
      },
      {
        title: '手机号',
        width: 150,
        dataIndex: 'mobile',
      },
      {
        title: '机器个数',
        width: 150,
        dataIndex: 'userNum',
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
            {/*<Divider type="vertical" />*/}
            {/*<a onClick={() => this.handleLogClick(item)}>日志</a>*/}
            <Divider type="vertical" />
            <Popconfirm title="确定要删除吗" onConfirm={() => this.handleDelClick(item)} okText="Yes" cancelText="No">
              <a className={styles.delete}>删除</a>
            </Popconfirm>
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
    // setTimeout(() => {
    //   this.handleModalVisible(true);
    // }, 1000);
    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
          <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
        </Card>
        {/*<Card bordered={false}>*/}
          {/*<div className={styles.tableList}>*/}
            {/*<div className={styles.tableListOperator}>*/}
              {/*/!*<Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>*!/*/}
                {/*/!*新建*!/*/}
              {/*/!*</Button>*!/*/}
              {/*/!*{selectedRows.length > 0 && (*!/*/}
              {/*/!*<span>*!/*/}
              {/*/!*<Button>批量操作</Button>*!/*/}
              {/*/!*<Dropdown overlay={menu}>*!/*/}
              {/*/!*<Button>*!/*/}
              {/*/!*更多操作 <Icon type="down" />*!/*/}
              {/*/!*</Button>*!/*/}
              {/*/!*</Dropdown>*!/*/}
              {/*/!*</span>*!/*/}
              {/*/!*)}*!/*/}
            {/*</div>*/}
          {/*</div>*/}
        {/*</Card>*/}
        <div style={{ display: !account.list ? 'none' : ''}}>
          <ScheduleTable
            account={account}
            dateList={this.state.dateList}
            handleDays={this.handleDays}
            onEditClick={this.onEditClick}
            onWatchClick={this.onWatchClick}
            onDeleteClick={this.onDeleteClick}
            handleModalVisible={this.handleModalVisible}
            minHeight={(document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 120)}
          />
        </div>
        <CreateForm
          {...parentMethods}
          ref={this.saveFormRef}
          modalVisible={modalVisible}
          onChange={this.onRadioChange}
          selectStatus={this.state.selectStatus}
          editModalConfirmLoading={editModalConfirmLoading}
          modalData={modalData}
          modalType={modalType}
          verifyTimeRequire={this.verifyTimeRequire}
          gameLists={gameLists}

          activityLists={activityLists}
          disabledDate={this.disabledDate}
          disabledDateTime={this.disabledDateTime}
          openSelectMachineModal={this.openSelectMachineModal}
          selectCityName={this.state.selectCityName}

          machineNum={this.state.machineNum}
          goodsInitData={this.state.goodsInitData}
          goodsCount={this.state.goodsCount}
          couponsInitData={this.state.couponsInitData}
          couponsCount={this.state.couponsCount}
          goodsLists={goodsLists}
          shopClist={shopClist}
          goodsHandle={this.goodsHandle}
          shopHandle={this.shopHandle}
          goodsHandleAdd={this.goodsHandleAdd}
          goodsHandleDelete={this.goodsHandleDelete}
          goodsHandleChange={this.goodsHandleChange}
          discountHandle={this.discountHandle}
          discountHandleAdd={this.discountHandleAdd}
          discountHandleDelete={this.discountHandleDelete}
          discountHandleChange={this.discountHandleChange}
          onSelectShop={this.onSelectShop}

          onSelectGame={this.onSelectGame}
          maxNumber={this.state.maxNumber}
          disabledStartDate={this.disabledStartDate}
          disabledTime={this.disabledTime}
          disabledEndTime={this.disabledEndTime}
          onStartChange={this.onStartChange}
          disabledEndDate={this.disabledEndDate}
          onEndChange={this.onEndChange}
          handleStartOpenChange={this.handleStartOpenChange}
          handleEndOpenChange={this.handleEndOpenChange}
          endOpen={this.state.endOpen}
          isDisabled={this.state.isDisabled}
          selectMachineFlag={this.state.selectMachineFlag}

          couponsShow={this.state.couponsShow}
          remark={this.state.remark}
        />
        {/*<SelectMachineForm*/}
          {/*ref={this.selectMachineFormRef}*/}
          {/*editMachineModalVisible={this.state.editMachineModalVisible}*/}
          {/*onEditMachineHandleAddClick={this.onEditMachineHandleAddClick}*/}
          {/*onEditMachineHandleModalVisibleClick={this.onEditMachineHandleModalVisibleClick}*/}
          {/*editMachineEditModalConfirmLoading={this.state.editMachineEditModalConfirmLoading}*/}
          {/*renderTreeNodes={this.renderTreeNodes}*/}
          {/*treeData={this.state.treeData}*/}
          {/*onLoadData={this.onLoadData}*/}
          {/*expandedKeys={this.state.expandedKeys}*/}
          {/*autoExpandParent={this.state.autoExpandParent}*/}
          {/*checkedKeys={this.state.checkedKeys}*/}
          {/*selectedKeys={this.state.selectedKeys}*/}
          {/*onExpand={this.onExpand}*/}
          {/*onCheck={this.onCheck}*/}
          {/*onSelect={this.onSelect}*/}
        {/*/>*/}
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
        <WatchForm
          watchModalVisible={this.state.watchModalVisible}
          modalData={this.state.modalData}
          handleWatchModalVisible={this.handleWatchModalVisible}
          goodsList={this.state.goodsInitData}
          couponsList={this.state.couponsInitData}
          watchDetailClick={this.watchDetailClick}
          couponsShow={this.state.couponsShow}
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
