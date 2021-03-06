import React, { PureComponent, Fragment } from "react";
import { connect } from "dva";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Menu,
  DatePicker,
  Modal,
  Divider,
  Popconfirm,
  Badge,
  Spin,
  Radio,
  message,
  Alert,
  Table,
  List,
  Tabs
} from "antd";
import StandardTable from "../../components/StandardTable/index";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import styles from "./ActivitySetting.less";
import CountModal from "../../components/Project/CountModal";
import GoodsModal from "../../components/Project/GoodsModal";
import VipModal from "../../components/Project/VipModal";
import moment from "moment/moment";
import { getAccountMenus } from "../../utils/authority";
import GoodsStatistics from "../../components/Project/Activity/GoodsStatistics";
import OrderStatistics from "../../components/Project/Activity/OrderStatistics";
import {getMerchantsLists} from "../../services/project/activitySetting";

const TabPane = Tabs.TabPane;

// const status = ['全部','未开始', '进行中', '已结束'];
const ActivityStatus = [
  { id: 0, name: "全部" },
  { id: 1, name: "未开始" },
  { id: 2, name: "进行中" },
  { id: 3, name: "已结束" },
  { id: 4, name: "未排期" }
];
const activityType = [{ id: 0, name: "互动活动" }, { id: 1, name: "派样活动" }];
const activityTypeLine = ["互动活动", "派样活动"];
// const statusMap = [100100, 100200, 100300];
// const prizeTypeStatus = ['商品', '优惠券', '商品+优惠券'];

const statusMap = ["processing", "default", "success", "error"];
const status = {
  "100100": "商品",
  "100200": "优惠券",
  "100300": "商品+优惠券"
};
const isVip = [{ id: 0, name: "不加入" }, { id: 1, name: "加入" }];
const vip = ["不加入", "加入"];
const AState = ["", "未开始", "进行中", "已结束"];
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(",");
const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;

const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    editModalConfirmLoading,
    modalType,
    merchantLists,
    shopsLists,
    onSelect,
    addData,
    targetData,
    onChangeRowSelection,
    selectedRowKeys,
    onSelectAll,
    sourceData,
    handleSave,
    selectAll,
    onLeftSelect,
    targetHandleSave,
    targetHandleDelete,
    findSourceData,
    selectType,
    selectTypeValue,

    goodsInitData,
    goodsCount,
    goodsHandle,
    goodsHandleAdd,
    goodsHandleDelete,
    goodsHandleChange,
    goodsLists,
    shopClist,
    couponsShow,
    shopHandle,
    maxNumber,
    sessionKeyIndexOf
  } = props;
  const { getFieldDecorator } = form;
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 }
    }
  };
  this.columns = [
    {
      title: "名称",
      dataIndex: "shopName",
      render: text => <a href="javascript:;">{text}</a>
    }
  ];
  const columns = this.columns.map(col => {
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
        handleSave: handleSave
      })
    };
  });

  const rowSelection = {
    selectedRowKeys,
    onChange: onChangeRowSelection,
    onSelect: onLeftSelect,
    onSelectAll: onSelectAll
  };
  this.columnsRight = [
    {
      title: "名称",
      dataIndex: "shopName",
      render: text => <a href="javascript:;">{text}</a>
    },
    {
      title: "操作",
      width: 70,
      dataIndex: "operation",
      render: (text, record) => {
        return targetData.length > 0 ? (
          <Popconfirm
            title="确认要删除吗?"
            onConfirm={() => targetHandleDelete(record.id)}
          >
            <a href="javascript:;">删除</a>
          </Popconfirm>
        ) : null;
      }
    }
  ];
  const columnsRight = this.columnsRight.map(col => {
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
        handleSave: targetHandleSave
      })
    };
  });

  return (
    <Modal
      title={
        <div class="modalBox">
          <span class="leftSpan" />
          <span class="modalTitle">
            {modalType === "edit"
              ? "编辑活动"
              : modalType === "add"
                ? "新建活动"
                : "查看活动"}
          </span>
        </div>
      }
      visible={modalVisible}
      onOk={handleAdd}
      onCancel={() => handleModalVisible()}
      confirmLoading={editModalConfirmLoading}
      width={800}
    >
      <div className="manageAppBox">
        <Form onSubmit={this.handleSearch}>
          {/*<FormItem {...formItemLayout} label="是否是默认活动">*/}
          {/*{getFieldDecorator('isDefault', {*/}
          {/*initialValue: '0',*/}
          {/*})(*/}
          {/*<RadioGroup disabled>*/}
          {/*<Radio value="1">是</Radio>*/}
          {/*<Radio value="0">否</Radio>*/}
          {/*</RadioGroup>*/}
          {/*)}*/}
          {/*</FormItem>*/}
          <FormItem {...formItemLayout} label="活动名称">
            {getFieldDecorator("name", {
              rules: [
                { required: true, whitespace: true, message: "请输入活动名称" }
              ]
            })(<Input placeholder="请输入活动名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="活动编码">
            {getFieldDecorator("code", {
              rules: [
                { required: true, whitespace: true, message: "请输入活动编码" }
              ]
            })(<Input placeholder="请输入活动编码" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="活动类型">
            {getFieldDecorator("type", {
              rules: [{ required: true, message: "请选择活动类型" }]
            })(
              <Select placeholder="请选择" onSelect={selectType}>
                {activityType.map(item => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          {/*<FormItem {...formItemLayout} label="是否入会" style={{ display: selectTypeValue === 0 ? 'none' : ''}}>*/}
          {/*{getFieldDecorator('isVip', {*/}
          {/*rules: [{ required: false, message: '请选择是否入会' }],*/}
          {/*})(*/}
          {/*<Select placeholder="请选择是否入会">*/}
          {/*{isVip.map((item) => {*/}
          {/*return (*/}
          {/*<Option value={item.id} key={item.id}>{item.name}</Option>*/}
          {/*);*/}
          {/*})}*/}
          {/*</Select>*/}
          {/*)}*/}
          {/*</FormItem>*/}
          <div
            style={{
              padding: 0,
              border: "1px solid #ececec",
              paddingLeft: "10px",
              marginBottom: "20px"
            }}
          >
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={10} sm={24}>
                <FormItem label="选择商户">
                  {getFieldDecorator("sellerId")(
                    <Select placeholder="请选择商户" onSelect={onSelect}>
                      {merchantLists.map(item => {
                        return (
                          <Option value={item.id} key={item.id}>
                            {item.merchantName}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={2} sm={24} style={{ paddingLeft: "3px" }} />
            </Row>
            <FormItem {...formItemLayout}>
              {getFieldDecorator("machine")(
                <div style={{ display: "flex" }}>
                  <div>
                    <Alert
                      message={
                        <div>
                          已选择{" "}
                          <a style={{ fontWeight: 600 }}>
                            {selectedRowKeys ? selectedRowKeys.length : 0}/
                            {sourceData ? sourceData.length : 0}{" "}
                          </a>{" "}
                          项
                        </div>
                      }
                      type="info"
                      showIcon
                    />
                    <Table
                      rowKey={record => record.id}
                      rowSelection={rowSelection}
                      columns={columns}
                      dataSource={sourceData}
                      id="leftTable"
                      style={{
                        width: "350px",
                        marginBottom: "20px",
                        marginTop: "10px"
                      }}
                      scroll={{ y: 200 }}
                      pagination={false}
                    />
                    <Button
                      onClick={() => addData()}
                      style={{ display: selectAll ? "block" : "none" }}
                    >
                      添加
                    </Button>
                  </div>
                  <div style={{ marginLeft: "20px" }}>
                    <Alert
                      message={
                        <div>
                          已有{" "}
                          <a style={{ fontWeight: 600 }}>{targetData.length}</a>{" "}
                          项
                        </div>
                      }
                      type="success"
                      showIcon
                    />
                    <Table
                      rowKey={record => record.id}
                      columns={columnsRight}
                      dataSource={targetData}
                      id="rightTable"
                      style={{ width: "350px", marginTop: "10px" }}
                      scroll={{ y: 200 }}
                      pagination={false}
                    />
                  </div>
                </div>
              )}
            </FormItem>
          </div>
          <FormItem {...formItemLayout} label="备注描述">
            {getFieldDecorator("remark")(
              <TextArea
                placeholder="请输入备注描述"
                autosize={{ minRows: 2, maxRows: 6 }}
              />
            )}
          </FormItem>
          <FormItem>
            <div
              className={styles.VipModalBox}
              style={{ display: selectTypeValue === 0 ? "none" : "" }}
            >
              {/*<FormItem label="不入会无需填写访问码">*/}
              <VipModal
                initData={goodsInitData}
                count={goodsCount}
                clist={goodsLists}
                shopClist={shopClist}
                shopHandle={shopHandle}
                goodsHandle={goodsHandle}
                // goodsHandleAdd={goodsHandleAdd}
                // goodsHandleDelete={goodsHandleDelete}
                goodsHandleChange={goodsHandleChange}
                sessionKeyIndexOf={sessionKeyIndexOf}
                // couponsShow={!couponsShow}
                // maxNumber={maxNumber}
              />
              {/*</FormItem>*/}
            </div>
          </FormItem>
        </Form>
      </div>
    </Modal>
  );
});
const WatchForm = Form.create()(props => {
  const { watchModalVisible, modalData, handleWatchModalVisible } = props;
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 }
    }
  };
  const columns = [
    {
      title: "店铺名称",
      dataIndex: "shopName",
      render: text => <a href="javascript:;">{text}</a>
    },
    {
      title: "是否入会",
      dataIndex: "isVip",
      render: text => <a href="javascript:;">{vip[text]}</a>
    },
    {
      title: "访问码",
      dataIndex: "sessionKey",
      render: text => <a href="javascript:;">{text}</a>
    }
  ];
  return (
    <Modal
      title={
        <div class="modalBox">
          <span class="leftSpan" />
          <span class="modalTitle">查看活动</span>
        </div>
      }
      visible={watchModalVisible}
      onCancel={() => handleWatchModalVisible()}
      footer={null}
      width={800}
    >
      <div className="manageAppBox">
        <Form onSubmit={this.handleSearch}>
          <FormItem {...formItemLayout} label="活动名称">
            <span>{modalData.name}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="活动编码">
            <span>{modalData.code}</span>
          </FormItem>
          {/*<FormItem {...formItemLayout} label="是否入会">*/}
          {/*<span>{parseInt(modalData.isVip) === 1 ? '加入' : '不加入'}</span>*/}
          {/*</FormItem>*/}
          <FormItem {...formItemLayout} label="活动类型">
            <span>
              {parseInt(modalData.type) === 1 ? "派样活动" : "互动活动"}
            </span>
          </FormItem>
          <FormItem {...formItemLayout} label="所属店铺">
            {/*<span>{modalData.merchantName}</span>*/}
            <List
              header={null}
              footer={null}
              bordered
              dataSource={modalData.shops}
              renderItem={item => (
                <List.Item>{item.shopName ? item.shopName : item.id}</List.Item>
              )}
            />
          </FormItem>
          <div
            style={{ display: parseInt(modalData.type) === 1 ? "" : "none" }}
          >
            <FormItem {...formItemLayout} label="">
              <Table
                rowKey={record => record.id}
                columns={columns}
                dataSource={modalData.shops}
                pagination={false}
              />
            </FormItem>
          </div>
          <FormItem {...formItemLayout} label="备注描述">
            <span>{modalData.remark}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="活动详情">
            {/*<span>{modalData.merchantName}</span>*/}
            <List
              header={null}
              footer={null}
              bordered
              dataSource={modalData.planTime}
              renderItem={item => (
                <List.Item>
                  活动时间: {item.startTime ? item.startTime : ""} -{" "}
                  {item.endTime ? item.endTime : ""}
                  <br />
                  活动状态： {item.state}
                </List.Item>
              )}
            />
          </FormItem>
        </Form>
      </div>
    </Modal>
  );
});
const SetDefaultForm = Form.create()(props => {
  const {
    editActivitymodalVisible,
    form,
    editActivityHandleAddClick,
    editActivityHandleModalVisibleClick,
    editActivityEditModalConfirmLoading,
    onSelect,
    data,
    value,
    handleChange,
    onPopupScroll,
    onSearch,
    fetching,
    gameLists
  } = props;
  const { getFieldDecorator } = form;
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 }
    }
  };
  return (
    <Modal
      title={
        <div class="modalBox">
          <span class="leftSpan" />
          <span class="modalTitle">设置默认活动</span>
        </div>
      }
      visible={editActivitymodalVisible}
      onOk={editActivityHandleAddClick}
      onCancel={() => editActivityHandleModalVisibleClick()}
      confirmLoading={editActivityEditModalConfirmLoading}
    >
      <div className="manageAppBox">
        <Form onSubmit={this.handleSearch}>
          <FormItem {...formItemLayout} label="活动名称">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "请输入活动名称" }]
            })(<Input placeholder="请输入活动名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="活动编码">
            {getFieldDecorator("code", {
              rules: [{ required: true, message: "请输入活动编码" }]
            })(<Input placeholder="请输入活动编码" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="选择游戏">
            {getFieldDecorator("gameId", {
              rules: [{ required: true, message: "请选择游戏" }]
            })(
              <Select placeholder="请选择">
                {gameLists.map(item => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
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
@connect(({ common, loading, activitySetting, log }) => ({
  common,
  activitySetting,
  loading: loading.models.activitySetting,
  log
}))
@Form.create()
export default class activitySettingList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    editModalConfirmLoading: false,
    pageNo: 1,
    keyword: "",
    type: "",
    modalData: {},
    logModalVisible: false,
    logModalLoading: false,
    logId: "",
    logModalPageNo: 1,
    modalType: "add",
    merchantLists: [],
    shopsLists: [],
    watchModalVisible: false,

    data: [],
    dataId: "",
    value: "",
    editActivitymodalVisible: false,
    editActivityEditModalConfirmLoading: false,
    pointPageNo: 1,
    fetching: false,
    gameLists: [],

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

    goodsModalVisible: false,
    goodsModalLoading: false,
    goodsId: "",
    goodsModalPageNo: 1,

    selectTypeValue: 0,

    // vip
    goodsInitData: [],
    goodsCount: 0,
    goodsLists: [],
    shopClist: [],
    vipTables: [],

    StatisticsTabsVisible: false,
    StatisticsActivityKey: "1",
    StatisticsTabsLoading: false,
    OrderStatistics: [],
    GoodsStatistics: [],

    account: {},
    sessionKeyIndexOf: -1,
  };
  // {/*<Select*/}
  // {/*// mode="multiple"*/}
  // {/*// labelInValue*/}
  // {/*showSearch={true}*/}
  // {/*placeholder="请输入游戏名称进行选择"*/}
  // {/*notFoundContent={fetching ? <Spin size="small" /> : null}*/}
  // {/*filterOption={false}*/}
  // {/*onSearch={onSearch}*/}
  // {/*onChange={handleChange}*/}
  // {/*onPopupScroll={onPopupScroll}*/}
  // {/*onSelect={onSelect}*/}
  // {/*style={{ width: '100%' }}*/}
  // {/*allowClear={true}*/}
  // {/*>{data.map(d => <Option key={d.key} value={d.value} data-id={d.id}>{d.text}</Option>)}*/}
  componentDidMount() {
    this.getLists();
    this.getMerchantLists()
    this.getAccountMenus(getAccountMenus());
  }
  getAccountMenus = setAccountMenusList => {
    if (setAccountMenusList) {
      const pointSettingMenu = setAccountMenusList
        .filter(item => item.path === "project")[0]
        .children.filter(item => item.path === "activity");
      var obj = {};
      if (pointSettingMenu[0].children) {
        pointSettingMenu[0].children.forEach((item, e) => {
          obj[item.path] = true;
        });
        this.setState({
          account: obj
        });
      }
    }
  };
  // 获取列表
  getLists = () => {
    this.props.dispatch({
      type: "activitySetting/getActivitySettingList",
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          keyword: this.state.keyword,
          type: this.state.type
        }
      }
    });
  };
  getMerchantLists = () => {
    this.props
      .dispatch({
        type: "activitySetting/getMerchantsList",
        payload: {
          params: {
            channelCode: '002001',
          }
        }
      })
      .then(res => {
        if (res && res.code === 0) {
          this.setState({
            merchantLists: res.data
          });
        }
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
      ...filters
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    const { current } = pagination;
    // console.log('params', params)
    this.setState(
      {
        pageNo: current
      },
      () => {
        this.getLists();
      }
    );
  };
  // 重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      pageNo: 1,
      keyword: "",
      code: ""
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm
    });
  };
  // 批量
  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case "remove":
        dispatch({
          type: "",
          payload: {
            no: selectedRows.map(row => row.no).join(",")
          },
          callback: () => {
            this.setState({
              selectedRows: []
            });
          }
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows
    });
  };
  // onSelect
  onSelect = (value, option) => {
    // console.log('value', value, option)
    // shopsLists
    this.props
      .dispatch({
        type: "activitySetting/getMerchantShops",
        payload: {
          restParams: {
            sellerId: value
          }
        }
      })
      .then(res => {
        this.setState({
          sourceData: res
        });
      });
  };
  // 搜索
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState(
        {
          pageNo: 1,
          keyword: fieldsValue.keyword ? fieldsValue.keyword : "",
          type: fieldsValue.type >= 0 ? fieldsValue.type : ""
        },
        () => {
          this.getLists();
        }
      );
    });
  };
  // 添加modal 添加事件
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      modalData: {},
      modalType: "add"
    });
    this.setModalData();
  };
  handleWatchModalVisible = flag => {
    this.setState({
      watchModalVisible: !!flag,
      modalData: {}
    });
  };
  // 删除modal 删除事件
  handleDelClick = item => {
    this.setState({
      editModalConfirmLoading: true
    });
    if (item) {
      const params = { id: item.id };
      this.props
        .dispatch({
          type: "activitySetting/delActivitySetting",
          payload: {
            params
          }
        })
        .then(() => {
          // message.success('Click on Yes');
          this.getLists();
          this.setState({
            editModalConfirmLoading: false
          });
        });
    } else return false;
  };
  // 编辑modal 编辑事件
  handleEditClick = item => {
    this.setState({
      modalVisible: true,
      watchModalVisible: false,
      modalData: item,
      modalType: "edit"
    });
    this.props
      .dispatch({
        type: "activitySetting/getActivitySettingDetail",
        payload: {
          restParams: {
            id: item.id
          }
        }
      })
      .then(res => {
        this.setModalData(res);
      });
  };
  // handleWatchClick
  handleWatchClick = item => {
    this.setState({
      modalVisible: false,
      watchModalVisible: true,
      modalType: "watch"
    });
    this.props
      .dispatch({
        type: "activitySetting/getActivitySettingDetail",
        payload: {
          restParams: {
            id: item.id
          }
        }
      })
      .then(res => {
        this.setState({
          modalData: res
        });
      });
  };
  // 设置modal 数据
  setModalData = data => {
    if (data) {
      // console.log('targetData', data.shops)
      let key = 0;
      // if (data.shops) {}
      let goodsInitDatas = data.shops.map((item, index) => {
        return {
          key: (key += 1),
          id: item.id,
          shopName: item.shopName,
          isVip: item.isVip,
          sessionKey: item.sessionKey
        };
      });
      this.setState({
        targetData: goodsInitDatas,
        goodsCount: data.shops.length,
        goodsInitData: data.shops.length > 0 ? goodsInitDatas : []
      });
      if (data.type === 1) {
        this.setState({
          selectTypeValue: 1
        });
      }
      this.form.setFieldsValue({
        name: data.name || "",
        code: data.code || undefined,
        sellerId: data.sellerId || undefined,
        // shopId: data.shopId || undefined,
        remark: data.remark || undefined,
        type: data.type
        // isVip: data.isVip || undefined
      });
    } else {
      this.setState({
        targetData: [],
        sourceData: [],
        sourceKey: [],
        targetKey: [],
        selectAll: false,
        selectedRows: [],
        goodsInitData: [],
        goodsCount: 0,
        selectTypeValue: 0
      });
      this.form.setFieldsValue({
        name: undefined,
        code: undefined,
        sellerId: undefined,
        // shopId: undefined,
        remark: undefined,
        type: undefined
        // isVip: undefined
      });
    }
  };
  // 新增modal确认事件 开始
  saveFormRef = form => {
    this.form = form;
  };
  // 编辑modal 确认事件
  handleAdd = () => {
    this.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      // if (this.state.selectTypeValue === 1) {
      //   // 派样
      //   console.log('fieldsValue.type', fieldsValue.isVip)
      //   if (fieldsValue.isVip !== 0 || fieldsValue.isVip !== 1) {
      //     message.config({
      //       top: 100,
      //       duration: 2,
      //       maxCount: 1,
      //     });
      //     message.warning(`请选择是否入会`)
      //     return false
      //   }
      // }
      // const rangeTimeValue = fieldsValue.rangeTime
      const { goodsInitData, selectTypeValue } = this.state;
      console.log("goodsInitData", goodsInitData);
      if (selectTypeValue === 1) {
        for (let i = 0; i < goodsInitData.length; i++) {
          if (parseInt(goodsInitData[i].isVip) === 0) {
            console.log("goodsInitData", goodsInitData[i].sessionKey);
            if (goodsInitData[i].sessionKey) {
              message.config({
                top: 100,
                duration: 2,
                maxCount: 1
              });
              message.warning(`非入会不要填写访问码`);
              return false;
            }
          } else {
            if (!goodsInitData[i].sessionKey || goodsInitData[i].sessionKey === '请填写访问码') {
              message.config({
                top: 100,
                duration: 2,
                maxCount: 1
              });
              this.setState({
                sessionKeyIndexOf: i
              })
              // goodsInitData[i].sessionKey = ' 2344'
              message.warning(`入会需要填写访问码`);
              return false;
            }
          }
        }
      }
      let params = {
        ...fieldsValue,
        // isVip: fieldsValue.isVip,
        isDefault: 0,
        shops: this.state.goodsInitData
        // rangeTime: undefined,
        // createTime: rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
        // endTime: rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
      };

      this.setState({
        editModalConfirmLoading: true
      });
      let url = "activitySetting/saveActivitySetting";
      if (this.state.modalData.id) {
        url = "activitySetting/editActivitySetting";
        params = { ...params, id: this.state.modalData.id };
      }
      this.props
        .dispatch({
          type: url,
          payload: {
            params
          }
        })
        .then(res => {
          if (res && res.code === 0) {
            this.getLists();
            this.setState({
              modalData: {},
              editModalConfirmLoading: false,
              modalVisible: false,
              sourceData: [],
            });
          }
          this.setState({
            editModalConfirmLoading: false
          });
        });
    });
  };
  // 新增modal确认事件 结束
  // 设置默认活动开始
  saveActivityFormRef = form => {
    this.defaultActivityForm = form;
  };
  getGameList = () => {
    this.props
      .dispatch({
        type: "activitySetting/gameList",
        payload: {
          restParams: {}
        }
      })
      .then(res => {
        this.setState(
          {
            gameLists: res
          },
          () => {
            this.getDefaultActivity();
          }
        );
      });
  };
  handleEditActivityClick = () => {
    this.getGameList();
  };
  getDefaultActivity = () => {
    this.props
      .dispatch({
        type: "activitySetting/getDefaultActivity",
        payload: {
          restParams: {}
        }
      })
      .then(res => {
        if (res) {
          this.defaultActivityForm.setFieldsValue({
            name: res.name,
            code: res.code,
            gameId: res.gameId
          });
        } else {
          this.defaultActivityForm.setFieldsValue({
            name: undefined,
            code: undefined,
            gameId: undefined
          });
        }
        this.setState({
          modalVisible: false,
          editActivitymodalVisible: true,
          data: []
        });
      });
  };
  getActivitySettingList = value => {
    if (value) {
      if (value !== this.state.value) {
        this.setState({
          value,
          pointPageNo: 1,
          data: []
        });
      }
      this.props
        .dispatch({
          type: "activitySetting/gameList",
          payload: {
            params: {
              pageNo: this.state.pointPageNo ? this.state.pointPageNo : 1,
              keyword: value ? value : this.state.value
            }
          }
        })
        .then(result => {
          const list = [];
          // console.log('list', result)
          result.forEach(r => {
            list.push({
              key: r.id,
              value: r.name,
              text: r.name,
              id: r.id
            });
          });
          let data = list;
          if (this.state.pointPageNo !== 1) {
            data = [...list, ...this.state.data];
          }
          this.setState({ data, fetching: false });
          if (result.length < 20) {
            this.setState({
              fetching: true
            });
            // return;
          }
        });
    }
  };
  handleChange = value => {
    this.setState({
      pointPageNo: 1,
      data: [],
      fetching: false,
      value: ""
    });
  };
  editActivityHandleAddClick = () => {
    // 确认修改点位
    // console.log(this.state.dataId)
    this.defaultActivityForm.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        editActivityEditModalConfirmLoading: true
      });
      console.log("values", values);
      //  gameId: this.state.dataId
      const url = "activitySetting/saveActivitySetting";
      const params = { ...values, isDefault: 1 };
      this.props
        .dispatch({
          type: url,
          payload: {
            params
          }
        })
        .then(() => {
          this.getLists();
          this.setState({
            editActivityEditModalConfirmLoading: false,
            modalVisible: false,
            modalData: {},
            data: [],
            editActivitymodalVisible: false
          });
        });
    });
  };
  onSetDefaultSelect = (value, option) => {
    // let v = '';
    // if (value.length > 1) {
    //   v = value[1]['key']
    // } else {
    //   v = value[0]['key']
    // }
    // this.pointForm.setFieldsValue({
    //   keyword2: v,
    // });
    this.setState({ data: [], dataId: option.props["data-id"], value: "" });
    // console.log('onselect', value, option.props['data-id'], this.state.value);
  };
  editActivityHandleModalVisibleClick = flag => {
    this.setState({
      editActivitymodalVisible: !!flag
    });
  };
  onPopupScroll = () => {
    // console.log('滚动加载')
    if (!this.state.fetching) {
      this.setState(
        {
          pointPageNo: this.state.pointPageNo + 1
        },
        () => {
          this.getActivitySettingList(this.state.value);
        }
      );
    }
  };
  // 设置默认活动结束
  // 排样统计开始
  // paiActivity
  handleGoodsClick = data => {
    this.setState(
      {
        // logModalVisible: !!data,
        logModalLoading: true,
        logId: data.id
      },
      () => {
        this.getGoodsList(data);
      }
    );
  };
  getGoodsList = data => {
    this.props
      .dispatch({
        type: "activitySetting/paiActivity",
        payload: {
          params: {
            activityId: data.id
          }
        }
      })
      .then(res => {
        // if (!res) {
        //   this.setState({
        //     logModalLoading: false,
        //   });
        //   message.config({
        //     top: 100,
        //     duration: 2,
        //     maxCount: 1,
        //   })
        //   message.error('该活动暂无统计')
        // } else {
        this.setState({
          goodsModalLoading: false,
          goodsModalVisible: true
        });
        // }
      });
  };
  handleCountClick = data => {
    this.setState(
      {
        // logModalVisible: !!data,
        goodsModalLoading: true,
        goodsId: data.id
      },
      () => {
        this.getCountList(data);
      }
    );
  };
  goodsModalHandleCancel = () => {
    this.setState({
      goodsModalVisible: false
    });
  };
  goodsModalhandleTableChange = pagination => {
    const { current } = pagination;
    this.setState(
      {
        goodsModalPageNo: current
      },
      () => {
        this.getGoodsList();
      }
    );
  };
  // 排样统计结束
  // 日志相关
  getCountList = data => {
    this.props
      .dispatch({
        type: "activitySetting/getActivityCount",
        payload: {
          restParams: {
            activityId: data.id
          }
        }
      })
      .then(res => {
        // if (!res) {
        //   this.setState({
        //     logModalLoading: false,
        //   });
        //   message.config({
        //     top: 100,
        //     duration: 2,
        //     maxCount: 1,
        //   })
        //   message.error('该活动暂无统计')
        // } else {
        this.setState({
          logModalLoading: false,
          logModalVisible: true
        });
        // }
      });
  };
  handleCountClick = data => {
    this.setState(
      {
        // logModalVisible: !!data,
        logModalLoading: true,
        logId: data.id
      },
      () => {
        this.getCountList(data);
      }
    );
  };
  logModalHandleCancel = () => {
    this.setState({
      logModalVisible: false
    });
  };
  logModalhandleTableChange = pagination => {
    const { current } = pagination;
    this.setState(
      {
        logModalPageNo: current
      },
      () => {
        this.getCountList();
      }
    );
  };
  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { merchantLists, shopsLists } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="选择活动类型">
              {getFieldDecorator("type")(
                <Select placeholder="请选择活动类型">
                  {activityType.map(item => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={9} sm={24}>
            <FormItem>
              {getFieldDecorator("keyword")(
                <Input placeholder="请输入活动名称、所属商户、所属店铺" />
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <span>
              <FormItem>
                <Button onClick={this.handleFormReset}>重置</Button>
                <Button
                  className={styles.serach}
                  style={{ marginLeft: 8 }}
                  type="primary"
                  htmlType="submit"
                >
                  查询
                </Button>
              </FormItem>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  // 回显数据源开始
  addData = async () => {
    const selectedRows = this.state.selectedRows;
    for (let a of selectedRows) {
      let selectedRowKeys = this.state.selectedRowKeys.indexOf(a.id);
      this.state.selectedRowKeys.splice(selectedRowKeys, 1);
      await this.handleDelete(a.id);
    }
    // console.log(this.state.repeat)
    if (this.state.repeat.length > 0) {
      Modal.warning({
        title: "以下店铺和已选店铺重复",
        content: this.state.repeat.join("\n") + ""
      });
    }
    this.setState({
      selectAll: false
    });
    this.intVipList();
  };
  unique = arr => {
    let targetData = [];
    let repeat = [];
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      if (!(item["id"] in targetData)) {
        targetData[item["id"]] = item;
      } else {
        // ...this.state.repeat,
        repeat = [item.shopName];
      }
    }
    this.setState({
      repeat
    });
    return Object.values(targetData);
  };
  handleSave = row => {
    const newData = [...this.state.sourceData];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    console.log("newDatahandleSave", newData);
    this.setState({ sourceData: newData });
  };
  handleDelete = key => {
    const dataSource = [...this.state.sourceData];
    this.setState({ sourceData: dataSource.filter(item => item.id !== key) });
    let targetData = [
      ...this.state.targetData,
      ...dataSource.filter(item => item.id === key)
    ];
    // console.log('targetData', targetData)
    targetData = this.unique(targetData);
    this.setState({ targetData });
  };
  targetHandleSave = row => {
    const newData = [...this.state.targetData];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    this.setState({ targetData: newData });
  };
  targetHandleDelete = key => {
    // console.log('key', key)
    const dataSource = [...this.state.targetData];
    console.log(
      "dataSource",
      dataSource,
      key,
      dataSource.filter(item => item.id !== key)
    );
    this.setState(
      {
        targetData: dataSource.filter(item => item.id !== key)
      },
      () => {
        this.intVipList();
      }
    );
  };
  onChangeRowSelection = (selectedRowKeys, selectedRows) => {
    // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    this.setState({
      sourceKey: selectedRowKeys,
      selectedRowKeys
    });
  };
  onSelectAll = (selected, selectedRows, changeRows) => {
    this.setState({
      selectedRows,
      selectAll: selected
    });
    console.log(selected, selectedRows, changeRows);
  };
  onLeftSelect = (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
    this.setState({
      selectedRows,
      selectAll: true
    });
  };
  // 回显数据源结束
  // 选择机器控件
  findSourceData = () => {
    this.selectMachineform.validateFields((err, fieldsValue) => {
      if (err) return;
      let localCode = "";
      if (fieldsValue.provinceCityAreaTrade) {
        if (fieldsValue.provinceCityAreaTrade.length > 0) {
          localCode =
            fieldsValue.provinceCityAreaTrade[
            fieldsValue.provinceCityAreaTrade.length - 1
              ];
        }
      }
      // console.log('localCode', localCode, fieldsValue, fieldsValue.provinceCityAreaTrade)
      if (!localCode) {
        message.config({
          top: 100,
          duration: 2,
          maxCount: 1
        });
        message.error("请选择一个地区");
        return;
      }
      this.getAreaList({ code: localCode });
    });
  };
  openSelectMachineModal = () => {
    this.setState(
      {
        editMachineModalVisible: true
      },
      () => {
        this.getAreaList({ level: 1 });
      }
    );
    this.selectMachineform.setFieldsValue({
      provinceCityAreaTrade: undefined
    });
  };
  onEditMachineHandleModalVisibleClick = () => {
    this.setState({
      editMachineModalVisible: false
    });
  };
  selectMachineFormRef = form => {
    this.selectMachineform = form;
  };
  // 检测是否需要有入会选项
  selectType = value => {
    console.log("selectTypeValue", value);
    this.setState({
      selectTypeValue: value
    });
  };
  // 店铺下的vip
  intVipList = () => {
    let { targetData } = this.state;
    // console.log('targetData2222', targetData)
    let key = 0;
    targetData = targetData.map(item => {
      return {
        key: (key += 1),
        id: item.id,
        shopName: item.shopName,
        isVip: item.isVip ? item.isVip : 0,
        sessionKey: item.sessionKey ? item.sessionKey : ''
      };
    });
    // console.log('targetData3333', targetData)
    this.setState({
      goodsInitData: targetData,
      goodsCount: targetData.length
    });
  };
  goodsHandle = (initData, value, record) => {
    console.log("1111record::", initData, record);
    // if (value === 1) {
    //   initData[record.key - 1].sessionKey = "请填写访问码";
    // } else {
    //   initData[record.key - 1].sessionKey = "";
    // }
    console.log("value", value);
    this.setState(
      {
        goodsInitData: []
      },
      () => {
        this.setState({
          goodsInitData: initData
        });
      }
    );
  };
  // goodsHandleChange = (row) => {
  //   console.log('row', row)
  //   const newData = [...this.state.goodsInitData];
  //   const index = newData.findIndex(item => row.key === item.key);
  //   const item = newData[index];
  //   newData.splice(index, 1, {
  //     ...item,
  //     ...row,
  //   });
  //
  //   this.setState({ goodsInitData: newData });
  //   // console.log('goodsHandleChange::', row);
  // }
  getGoodsNumber = (value, record) => {
    let vipTables = this.state.targetData;
    const vip = [{ id: 0, name: "" }, { id: 1, name: "请填写访问码" }];
    console.log("vipTables", record);
    // vipTables[record.key - 1].isVip = value
    if (value === 1) {
      vipTables[record.key - 1].sessionKey = "请填写访问码";
    } else {
      vipTables[record.key - 1].sessionKey = "";
    }
    return vipTables;
  };

  getOrderStatistics = data => {
    this.setState(
      {
        StatisticsTabsLoading: true
      },
      () => {
        this.props
          .dispatch({
            type: "activitySetting/getOrderStatistics",
            payload: {
              params: {
                activityCode: this.state.logId,
                name: "pvuv",
                outputType: 1,
                activityType: 1
              }
            }
          })
          .then(resp => {
            if (resp && resp.code === 0) {
              this.setState({
                StatisticsTabsLoading: false,
                OrderStatistics: resp.data
              });
            }
          });
      }
    );
  };

  getGoodsStatistics = () => {
    this.setState(
      {
        StatisticsTabsLoading: true
      },
      () => {
        this.props
          .dispatch({
            type: "activitySetting/getGoodsStatistics",
            payload: {
              params: {
                activityCode: this.state.logId,
                name: "goodsInfo",
                outputType: 1,
                activityType: 1
              }
            }
          })
          .then(resp => {
            if (resp && resp.code === 0) {
              this.setState({
                StatisticsTabsLoading: false,
                GoodsStatistics: resp.data
              });
            }
          });
      }
    );
  };

  goodsHandleChange = row => {
    const newData = [...this.state.goodsInitData];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    console.log('v', item)
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    console.log("recordgoodsHandleChange", newData);
    this.setState({
      goodsInitData: newData,
      sessionKeyIndexOf: -1
    });
    // console.log('goodsHandleChange::', row);
  };

  handleStatisticsTabsVisible = () => {
    this.setState({
      StatisticsTabsVisible: false,
      StatisticsActivityKey: "1",
      StatisticsTabsLoading: false,
      GoodsStatistics: [],
      OrderStatistics: []
    });
  };
  handleMachineStatisticsClick(data) {
    this.setState(
      {
        StatisticsTabsVisible: true,
        StatisticsActivityKey: "1",
        logId: data.id
      },
      () => {
        this.getOrderStatistics();
      }
    );
  }
  handleStatisticsTabsChange = key => {
    this.setState({ StatisticsActivityKey: key }, () => {
      if (key === "1") {
        this.getOrderStatistics();
      } else {
        this.getGoodsStatistics();
      }
    });
  };
  handleExcelShop = (item) => {
// activityExcel
    this.props
      .dispatch({
        type: "activitySetting/activityExcel",
        payload: {
          restParams: {
            activityId: item.id,
            activityType: 0,
          }
        }
      })
  }
  handleExportShopClick = () => {
    this.props
      .dispatch({
        type: "activitySetting/activityExcel",
        payload: {
          restParams: {
            activityId: '',
            activityType: '',
          }
        }
      })
  }
  render() {
    const {
      activitySetting: { list, page, unColumn },
      loading,
      activitySetting: { activityCountList, count },
      activitySetting: { activityPaiCountList, PaiCount }
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      editModalConfirmLoading,
      modalType,
      merchantLists,
      shopsLists,
      watchModalVisible,
      modalData,
      account
    } = this.state;
    let columns = [
      {
        title: "活动名称",
        width: "15%",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "活动编码",
        width: "10%",
        dataIndex: "code",
        key: "code"
      },
      // {
      //   title: '所属商户',
      //   width: '12%',
      //   dataIndex: 'merchantName',
      // },
      {
        title: "活动类型",
        width: "10%",
        dataIndex: "type",
        render(val) {
          return <span>{activityTypeLine[val]}</span>;
        },
        key: "type"
      },
      // {
      //   title: '商品/优惠券',
      //   width: '12%',
      //   dataIndex: 'prizeType',
      //   render(val) {
      //     return <span>{activityType[val]}</span>;
      //   },
      // },
      // {
      //   title: '活动状态',
      //   width: '10%',
      //   dataIndex: 'state',
      // },
      {
        title: "负责人",
        width: "10%",
        dataIndex: "managerId",
        key: "managerId"
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
        key: "createTime"
      },
      {
        fixed: "right",
        width: 210,
        title: "操作",
        render: (text, item) => (
          <Fragment>
            <a
              onClick={() => this.handleWatchClick(item)}
              style={{ display: !account.detail ? "none" : "" }}
            >
              查看
            </a>
            <Divider
              type="vertical"
              style={{ display: !account.detail ? "none" : "" }}
            />
            <a
              style={{
                cursor: item.state === "已结束" ? "not-allowed" : "pointer"
              }}
              onClick={() =>
                item.state === "已结束" ? null : this.handleEditClick(item)
              }
              style={{ display: !account.update ? "none" : "" }}
            >
              编辑
            </a>
            <Divider
              type="vertical"
              style={{ display: !account.update ? "none" : "" }}
            />
            <Popconfirm
              title="确定要删除吗"
              onConfirm={() =>
                !account.delete ? null : this.handleDelClick(item)
              }
              okText="Yes"
              cancelText="No"
            >
              <a
                className={styles.delete}
                style={{ display: !account.delete ? "none" : "" }}
              >
                删除
              </a>
            </Popconfirm>
            <Divider
              type="vertical"
              style={{ display: !account.delete ? "none" : "" }}
            />
            {/*活动统计*/}
            <a
              style={{
                display: item.type === 0 && account.statistics ? "" : "none"
              }}
              onClick={
                item.type === 0 ? () => this.handleCountClick(item) : null
              }
            >
              统计
            </a>
            {/*<Divider type="vertical" />*/}
            {/*商品统计*/}
            <a
              style={{
                display: item.type === 1 && account.statistics ? "" : "none"
              }}
              onClick={
                item.type === 1 ? () => this.handleGoodsClick(item) : null
              }
            >
              统计
            </a>
            <Divider type="vertical" />
            {/*机器统计*/}
            <a
              onClick={() => {
                this.handleMachineStatisticsClick(item);
              }}
            >
              机器统计
            </a>
            {/*<Divider type="vertical" />*/}
            {/*<a*/}
              {/*onClick={() => {*/}
                {/*this.handleExcelShop(item);*/}
              {/*}}*/}
            {/*>*/}
              {/*导出门店*/}
            {/*</a>*/}
          </Fragment>
        )
      }
    ];
    if (unColumn) {
      let leg = columns.length;
      for (let i = leg - 1; i >= 0; i--) {
        for (let j = 0; j < unColumn.length; j++) {
          if (columns[i]) {
            if (columns[i].key === unColumn[j]) {
              columns.splice(i, 1);
              continue;
            }
          }
        }
      }
    }
    const width = 90 / (columns.length - 1);
    for (let i = 0; i < columns.length; i++) {
      if (i < columns.length - 2) {
        columns[i].width = width + "%";
      }
      if (i === columns.length - 2) {
        columns[i].width = "";
      }
    }
    // this.state.options = this.props.common.list
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible
    };

    return (
      <PageHeaderLayout>
        <Card
          bordered={false}
          bodyStyle={{ marginBottom: "10px", padding: "15px 32px 0" }}
        >
          <div className={styles.tableListForm}>
            {this.renderAdvancedForm()}
          </div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => this.handleModalVisible(true)}
                style={{ display: !account.add ? "none" : "" }}>
                新建
              </Button>
              {/*{selectedRows.length > 0 && (*/}
              {/*<span>*/}
              {/*<Button>批量操作</Button>*/}
              {/*<Dropdown overlay={menu}>*/}
              {/*<Button>*/}
              {/*更多操作 <Icon type="down" />*/}
              {/*</Button>*/}
              {/*</Dropdown>*/}
              {/*</span>*/}
              {/*)}*/}
              <Button
                type="primary"
                onClick={() => this.handleEditActivityClick(true)}
                style={{ display: !account.setDefault ? "none" : "" }}
              >
                设置默认活动
              </Button>
              <Button
                type="primary"
                onClick={() => this.handleExportShopClick(true)}
              >
                导出门店
              </Button>
            </div>
            <div style={{ display: !account.list ? "none" : "" }}>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={list}
                page={page}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                scrollX={1200}
              />
            </div>
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          ref={this.saveFormRef}
          modalVisible={modalVisible}
          editModalConfirmLoading={editModalConfirmLoading}
          modalType={modalType}
          merchantLists={merchantLists}
          shopsLists={shopsLists}
          onSelect={this.onSelect}
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
          selectType={this.selectType}
          selectTypeValue={this.state.selectTypeValue}
          goodsInitData={this.state.goodsInitData}
          goodsCount={this.state.goodsCount}
          goodsLists={this.state.goodsLists}
          shopClist={this.state.shopClist}
          goodsHandle={this.goodsHandle}
          shopHandle={this.shopHandle}
          // goodsHandleAdd={this.goodsHandleAdd}
          // goodsHandleDelete={this.goodsHandleDelete}
          goodsHandleChange={this.goodsHandleChange}
          sessionKeyIndexOf={this.state.sessionKeyIndexOf}
        />
        <WatchForm
          modalData={modalData}
          watchModalVisible={watchModalVisible}
          handleWatchModalVisible={this.handleWatchModalVisible}
        />
        <SetDefaultForm
          ref={this.saveActivityFormRef}
          editActivitymodalVisible={this.state.editActivitymodalVisible}
          editActivityHandleAddClick={this.editActivityHandleAddClick}
          editActivityHandleModalVisibleClick={
            this.editActivityHandleModalVisibleClick
          }
          editActivityEditModalConfirmLoading={
            this.state.editActivityEditModalConfirmLoading
          }
          data={this.state.data}
          // modalData={this.state.modalData}
          handleChange={this.handleChange}
          onPopupScroll={this.onPopupScroll}
          onSelect={this.onSetDefaultSelect}
          onSearch={this.getActivitySettingList}
          fetching={this.state.fetching}
          gameLists={this.state.gameLists}
          // value={this.state.value}
        />
        <CountModal
          data={activityCountList}
          // page={logPage}
          count={count}
          loding={this.state.logModalLoading}
          logVisible={this.state.logModalVisible}
          logHandleCancel={this.logModalHandleCancel}
          logModalhandleTableChange={this.logModalhandleTableChange}
        />
        <GoodsModal
          data={activityPaiCountList}
          // page={logPage}
          count={PaiCount}
          loding={this.state.goodsModalLoading}
          goodsVisible={this.state.goodsModalVisible}
          goodsHandleCancel={this.goodsModalHandleCancel}
          goodsModalhandleTableChange={this.goodsModalhandleTableChange}
        />
        <Modal
          className={styles.statisticsTabs}
          title="机器统计"
          visible={this.state.StatisticsTabsVisible}
          width={1000}
          style={{ top: 20 }}
          onCancel={this.handleStatisticsTabsVisible}
          footer={[
            <Button
              key="ok"
              type="primary"
              loading={this.state.StatisticsTabsLoading}
              onClick={this.handleStatisticsTabsVisible}
              style={{ margin: "0 auto", display: "block" }}
            >
              确定
            </Button>
          ]}
        >
          <Tabs
            activeKey={this.state.StatisticsActivityKey}
            onChange={this.handleStatisticsTabsChange}
          >
            <TabPane tab="PV/UV/订单量" key="1">
              {this.state.StatisticsActivityKey === "1" && (
                <OrderStatistics
                  datas={this.state.OrderStatistics}
                  loading={this.state.StatisticsTabsLoading}
                />
              )}
            </TabPane>
            <TabPane tab="商品出货量" key="2">
              {this.state.StatisticsActivityKey === "2" && (
                <GoodsStatistics
                  datas={this.state.GoodsStatistics}
                  loading={this.state.StatisticsTabsLoading}
                />
              )}
            </TabPane>
          </Tabs>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
