import React, { PureComponent } from "react";
import { connect } from "dva";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import {
  Form,
  Table,
  Button,
  Tabs,
  message,
  Select,
  Row,
  Col,
  Card,
  Input,
  DatePicker,
  Modal,
  InputNumber
} from "antd";
import styles from "./orderReview.less";

const FormItem = Form.Item;
const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

const RefundAuditForm = Form.create()(props => {
  const {
    showRefundAuditForm,
    approved,
    rejected,
    refundAuditModalVisible
  } = props;
  return (
    <Modal
      visible={showRefundAuditForm}
      title="审核"
      footer={null}
      maskClosable={true}
      onCancel={() => refundAuditModalVisible()}
    >
      <Row>
        <Col />
      </Row>
    </Modal>
  );
});
@Form.create()
@connect(({ orderReview, loading, log, common }) => ({
  orderReview,
  log,
  loading: loading.models.order,
  common
}))
export default class OrderReview extends PureComponent {
  state = {
    formValues: {}, // 搜索条件
    pageNo: 1, // 列表页码
    keyword: "", // 搜索关键字
    tabKey: 0, // tab标签index
    channelLists: [], // 渠道列表
    tableList: [],
    searchParams: {},
    orderDetail: {},
    showRefundAuditForm: false
  };

  componentDidMount() {
    this.getLists();
    this.setColumns();
    this.getBaseDictLists();
  }

  getBaseDictLists = () => {
    this.props
      .dispatch({
        type: "orderReview/getBaseDict",
        payload: {
          params: {
            type: "002"
          }
        }
      })
      .then(res => {
        if (res && res.code === 0) {
          this.setState({
            channelLists: res.data.channel
          });
        }
      });
  };

  // 重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      searchParams: {},
      pageNo: 1
    });
  };

  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { channelLists } = this.state;
    const refundStatus = [
      { id: 0, name: "新退款订单" },
      { id: 1, name: "退款中" },
      { id: 2, name: "退款成功" },
      { id: 3, name: "退款失败" }
    ];
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={8} sm={24} lg={10}>
            <FormItem label="渠道名称：">
              {getFieldDecorator("channel")(
                <Select
                  // onChange={selectChannel}
                  placeholder="选择渠道"
                  // onSelect={(val, option) => {
                  //   saveChannelId(val, option);
                  // }}
                >
                  {channelLists.map(item => {
                    return (
                      <Option value={item.code} key={item.code}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24} lg={10}>
            <FormItem label="申请时间：">
              {getFieldDecorator("time")(
                <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width: "100%" }}
                  onChange={this.onDateChange}
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24} lg={10}>
            <FormItem label="退款状态">
              {getFieldDecorator("status")(
                <Select
                  // onChange={selectChannel}
                  placeholder="选择渠道"
                  // onSelect={(val, option) => {
                  //   saveChannelId(val, option);
                  // }}
                >
                  {refundStatus.map(item => {
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
          <Col md={8} sm={24} lg={8}>
            <FormItem>
              {getFieldDecorator("keyword")(
                <Input placeholder="请输入机器编号、活动名称、订单编号、退款编号搜索" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24} lg={6}>
            <FormItem>
              <Button onClick={this.handleFormReset}>重置</Button>
              <Button
                className={styles.serach}
                style={{ marginLeft: 8 }}
                type="primary"
                htmlType="submit"
              >
                搜索
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  onDateChange = (date, dateString) => {
    console.log(date, dateString);
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue);
      if (err) return;
      const values = {
        ...fieldsValue,
        time: fieldsValue["time"].format("YYYY-MM-DD")
      };
      this.setState(
        {
          searchParams: values
        },
        () => {
          this.getLists();
        }
      );
    });
  };
  // 获取退款列表
  getLists = (pageNo = 1) => {
    const { dispatch } = this.props;
    const { searchParams, tabKey } = this.state;
    console.log("auditStatus", tabKey);
    const params = Object.assign(searchParams, { pageNo, auditStatus: tabKey });
    console.log(params);
    dispatch({
      type: "orderReview/getRefundList",
      payload: {
        params
      }
    }).then(res => {
      console.log(res);
      if (res.code == 0) {
        this.setState({
          tableList: res.data
        });
      }
    });
  };
  // 获取订单详情
  getOrderDetail = id => {
    const { dispatch } = this.props;
    return new Promise((resolve, reject) => {
      dispatch({
        type: "orderReview/getOrderDetail",
        payload: {
          restParams: { id }
        }
      })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  // 点击审核
  gotoReview = text => {
    console.log(text);
    this.getOrderDetail(text.orderNum).then(res => {
      if (res.code == 0) {
        this.setState(
          {
            orderDetail: res.data
          },
          () => {
            this.setState({
              showRefundAuditForm: true
            });
          }
        );
      }
    });
  };
  // 审核不通过
  rejected = () => {
    console.log("审核不通过");
  };
  // 审核通过
  approved = () => {
    console.log("审核通过");
  };
  // 点击关闭Model
  refundAuditModalVisible = flag => {
    console.log(flag);
    this.setState({
      showRefundAuditForm: false,
      orderDetail: {}
    })
  };

  setColumns = (k = 0) => {
    let columns = [];
    switch (parseInt(k)) {
      case 0:
        columns = [
          {
            title: "订单编号",
            dataIndex: "orderNum",
            key: "orderNum",
            fixed: "left"
          },
          { title: "手机号", dataIndex: "phone", key: "phone" },
          { title: "机器点位", dataIndex: "local", key: "local" },
          { title: "机器编号", dataIndex: "machineCode", key: "machineCode" },
          { title: "渠道名称", dataIndex: "channelName", key: "channelName" },
          { title: "活动名称", dataIndex: "activityName", key: "activityName" },
          { title: "退款编号", dataIndex: "refundNum", key: "refundNum" },
          { title: "申请时间", dataIndex: "createTime", key: "createTime" },
          { title: "退款金额", dataIndex: "amount", key: "amount" },
          { title: "退款说明", dataIndex: "reason", key: "reason" },
          { title: "备注", dataIndex: "remark", key: "remark" },
          {
            title: "操作",
            key: "action",
            fixed: "right",
            render: (text, record) => (
              <span className={styles.action}>
                <a
                  onClick={() => {
                    this.gotoReview(text, record.key);
                  }}
                >
                  审核
                </a>
                <a
                  onClick={() => {
                    this.editNote(text, record.key);
                  }}
                >
                  编辑备注
                </a>
              </span>
            )
          }
        ];
        break;
      case 1:
        columns = [
          {
            title: "订单编号",
            dataIndex: "orderNum",
            key: "orderNum",
            fixed: "left"
          },
          { title: "手机号", dataIndex: "phone", key: "phone" },
          { title: "机器点位", dataIndex: "local", key: "local" },
          { title: "机器编号", dataIndex: "machineCode", key: "machineCode" },
          { title: "渠道名称", dataIndex: "channelName", key: "channelName" },
          { title: "活动名称", dataIndex: "activityName", key: "activityName" },
          { title: "退款编号", dataIndex: "refundNum", key: "refundNum" },
          { title: "退款申请时间", dataIndex: "createTime", key: "createTime" },
          { title: "退款金额", dataIndex: "amount", key: "amount" },
          { title: "退款状态", dataIndex: "status", key: "status" },
          { title: "异常原因", dataIndex: "auditReason", key: "auditReason" },
          { title: "备注", dataIndex: "remark", key: "remark" },
          {
            title: "操作",
            key: "action",
            fixed: "right",
            render: (text, record) => (
              <span className={styles.action}>
                <a
                  onClick={() => {
                    this.toView(text, record.key);
                  }}
                >
                  查看
                </a>
                <a
                  onClick={() => {
                    this.editNote(text, record.key);
                  }}
                >
                  线下退款
                </a>
                <a
                  onClick={() => {
                    this.editNote(text, record.key);
                  }}
                >
                  再次退款
                </a>
              </span>
            )
          }
        ];
        break;
      case 2:
        columns = [
          {
            title: "订单编号",
            dataIndex: "orderNum",
            key: "orderNum",
            fixed: "left"
          },
          { title: "手机号", dataIndex: "phone", key: "phone" },
          { title: "机器点位", dataIndex: "local", key: "local" },
          { title: "机器编号", dataIndex: "machineCode", key: "machineCode" },
          { title: "渠道名称", dataIndex: "channelName", key: "channelName" },
          { title: "活动名称", dataIndex: "activityName", key: "activityName" },
          { title: "退款编号", dataIndex: "refundNum", key: "refundNum" },
          { title: "退款申请时间", dataIndex: "createTime", key: "createTime" },
          { title: "退款金额", dataIndex: "amount", key: "amount" },
          { title: "未通过原因", dataIndex: "auditReason", key: "auditReason" },
          { title: "备注", dataIndex: "remark", key: "remark" },
          {
            title: "操作",
            key: "action",
            fixed: "right",
            render: (text, record) => (
              <span className={styles.action}>
                <a
                  onClick={() => {
                    this.gotoReview(text, record.key);
                  }}
                >
                  查看
                </a>
              </span>
            )
          }
        ];
        break;
      default:
        break;
    }

    this.setState({
      columns
    });
  };

  // tab 事件
  callback = key => {
    console.log(key);
    this.setState(
      {
        tabKey: key
      },
      () => {
        this.setColumns(key);
        this.getLists();
      }
    );
  };
  render() {
    const { loading } = this.props;
    const { columns, tableList } = this.state;
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
        <Card>
          <Tabs onChange={this.callback} type="card">
            <TabPane tab="待审核" key="0" />
            <TabPane tab="已通过" key="1" />
            <TabPane tab="未通过" key="2" />
          </Tabs>
          <div className={styles.tableList}>
            <Table
              loading={loading}
              rowKey={record => record.id}
              dataSource={tableList}
              columns={columns}
              pagination={false}
              onChange={this.handleTableChange}
              scroll={{ x: 1600 }}
            />
          </div>
        </Card>
        <RefundAuditForm
          showRefundAuditForm={this.state.showRefundAuditForm}
          rejected={this.rejected}
          approved={this.approved}
          refundAuditModalVisible={this.refundAuditModalVisible}
        />
      </PageHeaderLayout>
    );
  }
}
