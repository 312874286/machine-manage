import React, { PureComponent, Fragment } from "react";
import { connect } from "dva";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Select,
  Input,
  DatePicker,
  Divider,
  Modal,
  Table,
  Tree,
  Tabs,
  Radio,
  message
} from "antd";
import StandardTable from "../../components/StandardTable/index";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import styles from "./InteractSamplingSetting.less";
import { getAccountMenus } from "../../utils/authority";
import GoodsStatistics from "../../components/Project/Activity/GoodsStatistics";
import OrderStatistics from "../../components/Project/Activity/OrderStatistics";
import {Checkbox} from "antd/lib/index";

const TabPane = Tabs.TabPane;
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const status = ["未提交", "未开始", "进行中", "已结束", "已超时"];
const statusOption = [
  { id: 0, name: "未提交" },
  { id: 1, name: "未开始" },
  { id: 2, name: "进行中" },
  { id: 3, name: "已结束" },
  { id: 4, name: "已超时" }
];
const sortOption = [
  { id: "goodsSend desc,real_num desc", name: "按发放率倒序" },
  { id: "goodsSend,real_num", name: "按发放率正序" },
  { id: "real_day DESC", name: "按持续时长倒序" },
  { id: "real_day", name: "按持续时长正序" }
];
const activityTypeOptions = [
  '派样',
  '互派',
  '互动',
  '新零售'
]
const RadioGroup = Radio.Group;
const WatchForm = Form.create()(props => {
  const {
    watchModalVisible,
    modalData,
    handleWatchModalVisible,
    allGoods,
    watchDetailClick,
    watchMachineDetailClick,
    handleEnterPlatFormVisible,
  } = props;
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 }
    }
  };
  const columns = [
    {
      title: "商品名称",
      dataIndex: "name",
      width: "70%"
    },
    {
      title: "每天可派发数",
      dataIndex: "userDayNumber",
      render: (text, record) => {
        return (
          <span>
            {parseInt(record.userDayNumber) === -1
              ? "不限"
              : record.userDayNumber}
          </span>
        );
      }
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
          <FormItem {...formItemLayout} label="1.基本信息" />
          <FormItem {...formItemLayout} label="互派名称">
            <span>{modalData.name}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="游戏编号">
            <span>{modalData.planCode}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="互派游戏">
            <span>{modalData.gameName}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="预计时长/天">
            <span>{modalData.day}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="负责人">
            <span>{modalData.manager}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="2.商户商品信息">
            <a onClick={() => watchDetailClick(modalData.id)}>查看详情</a>
          </FormItem>
          <FormItem {...formItemLayout} label="3.选择机器">
            <a onClick={() => watchMachineDetailClick(modalData.id)}>
              查看详情
            </a>
            <a style={{ marginLeft: 30 }} onClick={() => handleEnterPlatFormVisible(true)}>
              查看入驻平台
            </a>
          </FormItem>
          <FormItem {...formItemLayout} label="4.规则设置" />
          <FormItem {...formItemLayout} label="4.1活动规则" />
          <FormItem {...formItemLayout} label="同一用户参与活动次数">
            <span>{modalData.times === -1 ? "不限" : modalData.times}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="同一用户每天参与活动次数">
            <span>
              {modalData.dayTimes === -1 ? "不限" : modalData.dayTimes}
            </span>
          </FormItem>
          <FormItem {...formItemLayout} label="同一用户获得商品次数">
            <span>
              {modalData.number === -1 ? "不限" : modalData.number}
            </span>
          </FormItem>
          <FormItem {...formItemLayout} label="同一用户每天获取商品次数">
            <span>
              {modalData.dayNumber === -1 ? "不限" : modalData.dayNumber}
            </span>
          </FormItem>
          <FormItem {...formItemLayout} label="4.2商品信息">
            <Table
              rowKey={record => record.id}
              columns={columns}
              dataSource={allGoods}
              pagination={false}
            />
          </FormItem>
        </Form>
      </div>
    </Modal>
  );
});
const WatchMerchantGoodsForm = Form.create()(props => {
  const {
    watchModalMerchantTreeVisible,
    treeData,
    handleMerchantTreeModalVisible,
    renderTreeNodes
  } = props;
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 }
    }
  };
  return (
    <Modal
      title={
        <div class="modalBox">
          <span class="leftSpan" />
          <span class="modalTitle">查看商户商品信息</span>
        </div>
      }
      visible={watchModalMerchantTreeVisible}
      onCancel={() => handleMerchantTreeModalVisible()}
      footer={null}
      width={800}
    >
      <div className="manageAppBox">
        <Tree>{renderTreeNodes(treeData)}</Tree>
      </div>
    </Modal>
  );
});
const WatchMachineGoodsForm = Form.create()(props => {
  const {
    watchModalMerchantTreeVisible,
    treeData,
    handleMerchantTreeModalVisible,
    renderTreeNodes
  } = props;
  return (
    <Modal
      title={
        <div class="modalBox">
          <span class="leftSpan" />
          <span class="modalTitle">查看机器商品信息</span>
        </div>
      }
      visible={watchModalMerchantTreeVisible}
      onCancel={() => handleMerchantTreeModalVisible()}
      footer={null}
      width={800}
    >
      <div className="manageAppBox">
        <Tree>{renderTreeNodes(treeData)}</Tree>
      </div>
    </Modal>
  );
});
const EnterPlatForm = Form.create()(props => {
  const { form, EnterPlatFormVisible, handleEnterPlatFormVisible, enter,
    loading, list, page, handleStandardTableChange, handleEditEnterModalVisible, updateBatchEnter,
    handleSearchEnterAdd, handleEnterFormReset
  } = props;
  const { getFieldDecorator } = form;
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 }
    }
  };
  const enterTypeOptions = {'1': '蚂蚁金服', '2': '京东金融'}
  const enterStatusOptions = ['未入驻', '入驻']
  const enterStatus = [{
    id: '0',
    name: '未入驻'
  }, {
    id: '1',
    name: '入驻'
  }]
  const columns = [
    {
      title: "机器编号",
      dataIndex: "machineCode",
      key: "machineCode",
      width: "30%"
    },
    {
      title: "点位",
      width: "40%",
      dataIndex: "localDesc",
      key: "localDesc"
    },
    {
      title: "入驻平台",
      dataIndex: "enterList",
      key: "enterList",
      render: (text, item) => (
        <Fragment>
          {
            item.enterList.map((i) => {
              return (<span>{enterTypeOptions[i.enterType]}:{enterStatusOptions[i.enterStatus]}<br/></span>)
            })
          }
        </Fragment>
      ),
    },
    {
      width: 100,
      title: "操作",
      render: (text, item) => (
        <Fragment>
          <a
            disabled={
              item.enterList.length > 0
            && item.enterList.filter(i => i.enterStatus === 1).length === enter.length
                ? true : false}
            onClick={() => handleEditEnterModalVisible(true, item)}>
            入驻
          </a>
        </Fragment>
      )
    }
  ];
  return (
    <Modal
      title={
        <div class="modalBox">
          <span class="leftSpan" />
          <span class="modalTitle">入驻平台</span>
        </div>
      }
      visible={EnterPlatFormVisible}
      onCancel={() => handleEnterPlatFormVisible(false)}
      footer={null}
      width={1000}
      className={styles.enterPlatModal}>
      <div className="manageAppBox">
        <Form onSubmit={handleSearchEnterAdd} >
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={10} sm={24}>
              <FormItem label="状态" {...formItemLayout}>
                {getFieldDecorator("enterStatus")(
                  <Select placeholder="请选择入驻状态">
                    {enterStatus.map(item => {
                      return (
                        <Option value={item.id} key={item.id}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('machineCode')(<Input placeholder="请输入机器编号" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <span>
                 <FormItem {...formItemLayout}>
                    <Button onClick={handleEnterFormReset} style={{ width: '45%' }}>
                      重置
                    </Button>
                    <Button className={styles.serach} style={{ marginLeft: 8, width: '45%' }} type="primary" htmlType="submit">
                      查询
                    </Button>
                 </FormItem>
              </span>
            </Col>
          </Row>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={10} sm={24}>
              <FormItem label="入驻平台" {...formItemLayout}>
                {getFieldDecorator("enterType")(
                  <Select placeholder="请选择入驻平台">
                    {enter.map(item => {
                      return (
                        <Option value={item.enterType} key={item.enterType}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <span>
                 <FormItem {...formItemLayout}>
                    <Button onClick={() => updateBatchEnter()} className={styles.serach} style={{ marginLeft: 8, width: '100%'}} type="primary" htmlType="submit">
                      批量入驻
                    </Button>
                 </FormItem>
              </span>
            </Col>
          </Row>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
                <StandardTable
                  loading={loading}
                  data={list}
                  page={page}
                  columns={columns}
                  onChange={handleStandardTableChange}
                  scrollX={800}
                />
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
})
const EnterForm = Form.create()((props) => {
    const { enterModalVisible, form, handleUpdateEnterAdd, handleEditEnterModalVisible, editModalConfirmLoading, enterList } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
    };
    return (
      <Modal
        title={
          <div class="modalBox">
            <span class="leftSpan">{enterModalVisible}</span>
            <span class="modalTitle"></span>
          </div>
        }
        visible={enterModalVisible}
        onOk={handleUpdateEnterAdd}
        onCancel={() => handleEditEnterModalVisible(false)}
        confirmLoading={editModalConfirmLoading}
      >
        <div className="manageAppBox">
          <Form onSubmit={this.handleSearch}>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('enterType', {
                rules: [{ required: true, message: '请选择入驻平台' }],
              })(
                <CheckboxGroup>
                  {enterList.map((item) => {
                    return (
                      <Checkbox key={item.enterType} value={item.enterType}>{item.name}</Checkbox>
                    );
                  })}
                </CheckboxGroup>
              )}
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  });
@connect(({ common, loading, interactSamplingSetting }) => ({
  common,
  interactSamplingSetting,
  loading: loading.models.interactSamplingSetting
}))
@Form.create()
export default class areaSettingList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    pageNo: 1,
    status: "",
    account: {},
    keyword: "",
    orderBy: "",

    watchModalVisible: false,
    modalData: {},
    allGoods: [],

    watchModalMerchantTreeVisible: false,
    treeData: [],
    watchModalMachineTreeVisible: false,
    machineTreeData: [],

    StatisticsTabsVisible: false,
    StatisticsActivityKey: "1",
    StatisticsTabsLoading: false,
    OrderStatistics: [],
    GoodsStatistics: [],

    EnterPlatFormVisible: false,

    enterLoading: false,
    enterLists: [],
    enterPage: 0,
    enterPageNo: 1,

    interactId: '',
    enterStatus: '',
    machineCode: '',

    enterModalVisible: false,
    enterType: '',
    enter: [],
    enterList: [],
    machineId: '',
    enterTypeFlag: '',
  };
  componentDidMount() {
    this.getLists();
    // this.getChannelList()
    // this.getAccountMenus(getAccountMenus())
  }
  getAccountMenus = setAccountMenusList => {
    if (setAccountMenusList) {
      const pointSettingMenu = setAccountMenusList
        .filter(item => item.path === "project")[0]
        .children.filter(item => item.path === "sampling-setting");
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
      type: "interactSamplingSetting/interactLists",
      payload: {
        restParams: {
          status: this.state.status,
          pageNo: this.state.pageNo,
          keyword: this.state.keyword,
          orderBy: this.state.orderBy,
          pageSize: 20,
        }
      }
    });
  };
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
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      pageNo: 1,
      keyword: ""
    });
  };
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows
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
          status: fieldsValue.status >= 0 ? fieldsValue.status : "",
          orderBy: fieldsValue.orderBy ? fieldsValue.orderBy : ""
        },
        () => {
          this.getLists();
        }
      );
    });
  };
  giveUp = item => {
    this.props
      .dispatch({
        type: "interactSamplingSetting/interactUpdate",
        payload: {
          params: {
            id: item.id,
            type: 2
          }
        }
      })
      .then(res => {
        if (res && res.code === 0) {
          this.getLists();
        }
      });
  };
  handleWatchModalVisible = flag => {
    this.setState({
      watchModalVisible: !!flag,
      modalData: {}
    });
  };
  // interactDetail
  getInteractDetail = item => {
    this.props
      .dispatch({
        type: "interactSamplingSetting/interactDetail",
        payload: {
          params: {
            id: item.id
          }
        }
      })
      .then(res => {
         console.log('enterres', res, res.enterTypeList)
        if (res) {
          this.setState({
            watchModalVisible: true,
            modalData: res,
            interactId: item.id,
            enter: res.enterTypeList || [],
            enterTypeFlag: res.enterType
          });
        }
      });
    this.getGoods(item);
  };
  // 获取所有商品开始
  getGoods = item => {
    let params = { interactId: item.id };
    this.props
      .dispatch({
        type: "interactSamplingSetting/getInteractGoodsList",
        payload: {
          params
        }
      })
      .then(res => {
        if (res && res.code === 0) {
          this.setState({
            allGoods: res.data
          });
        }
      });
  };
  watchDetailClick = interactId => {
    this.props
      .dispatch({
        type: "interactSamplingSetting/getMerchantTree",
        payload: {
          restParams: {
            interactId
          }
        }
      })
      .then(res => {
        if (res && res.code === 0) {
          this.setState({
            watchModalMerchantTreeVisible: true,
            treeData: res.data,
            interactId,
          });
        }
      });
  };
  handleMerchantTreeModalVisible = flag => {
    this.setState({
      watchModalMerchantTreeVisible: !!flag
    });
  };
  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  };
  watchMachineDetailClick = interactId => {
    this.props
      .dispatch({
        type: "interactSamplingSetting/getMachineTree",
        payload: {
          params: {
            interactId
          }
        }
      })
      .then(res => {
        if (res && res.code === 0) {
          this.setState({
            watchModalMachineTreeVisible: true,
            machineTreeData: res.data
          });
        }
      });
  };
  handleMachineTreeModalVisible = flag => {
    this.setState({
      watchModalMachineTreeVisible: !!flag
    });
  };
  // 统计
  getOrderStatistics = data => {
    this.setState(
      {
        StatisticsTabsLoading: true
      },
      () => {
        this.props
          .dispatch({
            type: "interactSamplingSetting/getOrderStatistics",
            payload: {
              params: {
                activityCode: this.state.logId,
                name: "pvuv",
                outputType: 1,
                activityType: 2
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
            type: "interactSamplingSetting/getGoodsStatistics",
            payload: {
              params: {
                activityCode: this.state.logId,
                name: "goodsInfo",
                outputType: 1,
                activityType: 2
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
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    console.log("recordgoodsHandleChange", newData);
    this.setState({ goodsInitData: newData });
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
        type: "interactSamplingSetting/activityExcel",
        payload: {
          restParams: {
            activityId: item.id,
            activityType: 1,
          }
        }
      })
  }
  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={9} sm={24}>
            <FormItem label="互派状态">
              {getFieldDecorator("status")(
                <Select placeholder="请选择">
                  {statusOption.map(item => {
                    return (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={15} sm={24}>
            <span>
              <FormItem>
                {getFieldDecorator("keyword")(
                  <Input placeholder="请输入互派名称，互派游戏，负责人，机器编号，机器点位，商品编号，商品名称" />
                )}
              </FormItem>
            </span>
          </Col>
        </Row>
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          {/*<Col md={8} sm={24}>*/}
          {/*<FormItem label="创建时间">*/}
          {/*{getFieldDecorator('creatTime')(*/}
          {/*<DatePicker placeholder="请选择创建时间" />*/}
          {/*)}*/}
          {/*</FormItem>*/}
          {/*</Col>*/}
          <Col md={8} sm={24}>
            <FormItem label="排序">
              {getFieldDecorator("orderBy")(
                <Select placeholder="请选择排序方式">
                  {sortOption.map(item => {
                    return (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
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
  // 获取入驻平台列表
  getChannelList = () => {
    this.props.dispatch({
      type: 'interactSamplingSetting/getBaseDict',
      payload: {
        params: {
          type: ''
        },
      },
    }).then((res) => {
      if (res && res.code === 0) {
        this.setState({
          enter: res.data.enter
        });
      }
    });
  }
  // 入驻平台form
  handleEnterPlatFormVisible = (flag = false) => {
    const { enterTypeFlag } = this.state
    if (!enterTypeFlag) {
      message.warn('当前活动暂无入驻平台信息')
      return false
    }
    if (flag) {
      this.getEnterList()
    }
    this.setState({
      EnterPlatFormVisible: flag,
    })
  }
  getEnterList = () => {
    //  enterLoading: false,
    //     enterLists: [],
    //     enterPage: 0,
    // enterLists,
    //   updateEnter,
    //   updateBatchEnter,
    this.props.dispatch({
      type: "interactSamplingSetting/enterLists",
      payload: {
        restParams: {
          interactId: this.state.interactId,
          status: this.state.enterStatus,
          machineCode: this.state.machineCode,
          pageSize: 20,
          pageNo: this.state.enterPageNo,
        }
      }
    }).then((res) => {
      console.log('res', res)
      this.setState({
        enterLists: res.data,
        enterPage: {
          total: res.page.totalCount,
          pageSize: res.page.pageSize,
          current: res.page.pageNo,
         },
      })
    });
  }
  handleStandardEnterTableChange = (pagination, filtersArg, sorter) => {
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
        this.getEnterList();
      }
    );
  };
  saveEnterFormRef = form => {
    this.saveEnterForm = form;
  }
  // 重置
  handleEnterFormReset = () => {
    this.saveEnterForm.resetFields();
    this.setState({
      formValues: {},
      pageNo: 1,
    });
  };
  handleSearchEnterAdd = () => {
    this.saveEnterForm.validateFields((err, fieldsValue) => {
      console.log('form', fieldsValue)
      const { interactId } = this.state
      if (err) {
        return false
      }
      this.setState(
        {
          enterPageNo: 1,
          machineCode: fieldsValue.machineCode ? fieldsValue.machineCode : "",
          enterStatus: fieldsValue.enterStatus >= 0 ? fieldsValue.enterStatus : "",
        },
        () => {
          this.getEnterList();
        }
      );
    })
  }
  updateBatchEnter = () => {
    this.saveEnterForm.validateFields((err, fieldsValue) => {
      console.log('form', fieldsValue)
      const { interactId } = this.state
      if (err) {
        return false
      }
      this.props.dispatch({
        type: "interactSamplingSetting/updateBatchEnter",
        payload: {
          params: {
            interactId,
            enterType: fieldsValue.enterType,
          }
        }
      }).then((res) => {
        if (res && res.code === 0) {
          message.success('入驻成功')
          this.getEnterList()
        } else {
          message.error('入驻失败')
        }
      });
    })
  }
  saveFormRef = form => {
    this.form = form;
  };
  handleUpdateEnterAdd = () => {
    this.form.validateFields((err, fieldsValue) => {
      console.log('form', fieldsValue)
      const { machineId, interactId } = this.state
      if (err) {
        return false
      }
      this.props.dispatch({
        type: "interactSamplingSetting/updateEnter",
        payload: {
          params: {
            interactId,
            machineId,
            enterType: fieldsValue.enterType.join(','),
          }
        }
      }).then((res) => {
        if (res && res.code === 0) {
          message.success('入驻成功')
          this.handleEditEnterModalVisible()
          this.getEnterList()
        }
      });
    })
  }
  handleEditEnterModalVisible = (flag = false, item) => {
    this.setState({
      enterModalVisible: flag,
    })
    if (item) {
      const { enter } = this.state
     let enterList = enter.filter(a => true === item.enterList.some(b => (a.enterType === b.enterType) && b.enterStatus === 0))
      this.setState({
        enterList,
        machineId: item.machineId
      })
    }
  }
  render() {
    const {
      interactSamplingSetting: { list, page, unColumn },
      loading
    } = this.props;
    const { selectedRows } = this. state;
    let columns = [
      {
        title: "创建时间",
        dataIndex: "createTime",
        key: "createTime",
        width: "10%"
      },
      {
        title: "活动名称",
        width: "10%",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "游戏名称",
        dataIndex: "gameName",
        key: "gameName",
        width: "10%"
      },
      {
        title: "所属渠道",
        width: "10%",
        dataIndex: "channel",
        key: "channel"
      },
      {
        title: "活动类型",
        dataIndex: "paiyangType",
        key: "paiyangType",
        width: "10%",
        render: (text, item) => (
          <Fragment>
            <span>
              {activityTypeOptions[item.paiyangType]}
            </span>
          </Fragment>
        ),
      },
      {
        title: "机器数",
        dataIndex: "merchantNum",
        key: "merchantNum",
        width: "5%"
      },
      {
        title: "商品数",
        width: "5%",
        dataIndex: "goodsNum",
        key: "goodsNum",
        render: (text, item) => (
          <Fragment>
            <span>
              {item.goodsNum ? item.goodsNum : 0}
            </span>
          </Fragment>
        ),
      },
      {
        title: "活动时长",
        dataIndex: "realDay",
        key: "realDay",
        render: (text, item) => (
          <Fragment>
            <span style={{ color: parseInt(item.status) === 4 ? 'rgba(226, 10, 30, 1)' : '' }}>
              {item.realDay ? item.realDay : 0}/{item.day}
            </span>
          </Fragment>
        ),
        width: "10%"
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        render(val) {
          if (val) {
            return <span>{status[val]}</span>;
          }
        }
      },
      {
        title: "负责人",
        dataIndex: "manager",
        key: "manager",
      },
      // {
      //   title: "发放率",
      //   dataIndex: "realNum",
      //   key: "realNum",
      //   render: (text, item) => (
      //     <Fragment>
      //       <span>
      //         {item.realNum ? item.realNum : 0}/{item.number ? item.number : 0}
      //       </span>
      //     </Fragment>
      //   ),
      //   width: "10%"
      // },
      {
        fixed: "right",
        width: 200,
        title: "操作",
        render: (text, item) => (
          <Fragment>
            <a
              style={{ display: parseInt(item.status) === 3 ? "none" : "" }}
              onClick={() =>
                this.props.history.push({
                  pathname: `/project/addBasicInteractSampling/${item.id}`,
                  query: { id: item.id }
                })
              }
            >
              编辑
            </a>
            <Divider
              type="vertical"
              style={{ display: parseInt(item.status) === 3 ? "none" : "" }}
            />
            <a
              onClick={() => {
                this.handleMachineStatisticsClick(item);
              }}
            >
              统计
            </a>
            <Divider
              type="vertical"
              style={{ display: parseInt(item.status) === 3 ? "none" : "" }}
            />
            <a
              onClick={() => this.giveUp(item)}
              style={{ display: parseInt(item.status) === 3 ? "none" : "" }}
            >
              结束
            </a>
            <Divider type="vertical" />
            <a onClick={() => this.getInteractDetail(item)}>详情</a>
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
                onClick={() =>
                  this.props.history.push({
                    pathname: "/project/addBasicInteractSampling"
                  })
                }
              >
                新建
              </Button>
            </div>
            <div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={list}
                page={page}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                scrollX={1800}
              />
            </div>
          </div>
        </Card>
        <WatchForm
          watchModalVisible={this.state.watchModalVisible}
          modalData={this.state.modalData}
          handleWatchModalVisible={this.handleWatchModalVisible}
          allGoods={this.state.allGoods}
          watchDetailClick={this.watchDetailClick}
          watchMachineDetailClick={this.watchMachineDetailClick}
          handleEnterPlatFormVisible={this.handleEnterPlatFormVisible}
        />
        <WatchMerchantGoodsForm
          watchModalMerchantTreeVisible={
            this.state.watchModalMerchantTreeVisible
          }
          treeData={this.state.treeData}
          handleMerchantTreeModalVisible={this.handleMerchantTreeModalVisible}
          renderTreeNodes={this.renderTreeNodes}
        />
        <WatchMachineGoodsForm
          watchModalMerchantTreeVisible={
            this.state.watchModalMachineTreeVisible
          }
          treeData={this.state.machineTreeData}
          handleMerchantTreeModalVisible={this.handleMachineTreeModalVisible}
          renderTreeNodes={this.renderTreeNodes}
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
        <EnterPlatForm
          ref={this.saveEnterFormRef}
          EnterPlatFormVisible={this.state.EnterPlatFormVisible}
          handleEnterPlatFormVisible={this.handleEnterPlatFormVisible}
          loading={this.state.enterLoading}
          list={this.state.enterLists}
          page={this.state.enterPage}
          handleStandardTableChange={this.handleStandardEnterTableChange}
          handleEditEnterModalVisible={this.handleEditEnterModalVisible}
          updateBatchEnter={this.updateBatchEnter}
          enter={this.state.enter}
          handleSearchEnterAdd={this.handleSearchEnterAdd}
          handleEnterFormReset={this.handleEnterFormReset}
        />
        <EnterForm
          ref={this.saveFormRef}
          enterModalVisible={this.state.enterModalVisible}
          handleUpdateEnterAdd={this.handleUpdateEnterAdd}
          handleEditEnterModalVisible={this.handleEditEnterModalVisible}
          enterList={this.state.enterList}
        />
      </PageHeaderLayout>
    );
  }
}
