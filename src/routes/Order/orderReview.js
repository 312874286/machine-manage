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

const orderType = {
  10: '点72订单',
  20: '天猫订单',
}
const goodsStatus = {
  0: '未掉落',
  1: '已出货',
}
const orderStatusArr = {
  10: '未支付',
  20: '已支付',
  30: '已完成',
  40: '已退款',
}
const payType = {
  1: '支付宝',
  2: '微信'
}
const payStatus = {
  0: '未支付',
  1: '已支付'
}
const goodsType = {
  1: '商品',
  2: '优惠券'
}
const auditStatus = {
  0: '未通过',
  1: '通过'
}
const status = [
  '新退款订单',
  '退款中',
  '退款成功',
  '退款异常'
]
const RefundAuditForm = Form.create()(props => {
  const {
    watchRefundAuditForm,
    tabKey,
    refundAuditModalVisible,
    refundAuditModalData,
    orderStatus
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
          <span class="modalTitle">订单审核</span>
        </div>
      }
      visible={watchRefundAuditForm}
      onCancel={() => refundAuditModalVisible()}
      footer={null}
      width={1000}
    >
      <div className="manageAppBox">
        <Form onSubmit={this.handleSearch}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="订单详情" />
            </Col>
          </Row>

          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="订单编号">
                <span>{refundAuditModalData.orderNum}</span>
              </FormItem>
            </Col>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="用户ID">
                <span>
                  {refundAuditModalData.userId
                    ? refundAuditModalData.userId
                    : "---"}
                </span>
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="机器点位">
                <span>{refundAuditModalData.local}</span>
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="机器编号">
                <span>{refundAuditModalData.machineCode}</span>
              </FormItem>
            </Col>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="活动名称">
                <span>{refundAuditModalData.activityName}</span>
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="渠道名称">
                <span>{refundAuditModalData.channelName}</span>
              </FormItem>
            </Col>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="商品名称">
                <span>{refundAuditModalData.goodsName}</span>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="下单时间">
                <span>{refundAuditModalData.orderTime}</span>
              </FormItem>
            </Col>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="订单类型">
                <span>
                  {refundAuditModalData.orderType &&
                  refundAuditModalData.orderType !== "999"
                    ? orderType[refundAuditModalData.orderType]
                    : refundAuditModalData.orderType}
                </span>
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="订单金额">
                <span>{refundAuditModalData.orderPrice >= 0 && `¥${refundAuditModalData.orderPrice.toFixed(2)}`}</span>
              </FormItem>
            </Col>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="出货状态">
                <span>
                  {refundAuditModalData.goodsStatus >= 0
                    ? goodsStatus[refundAuditModalData.goodsStatus.toString()]
                    : "---"}
                </span>
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="订单状态">
                <span>
                  {refundAuditModalData.orderStatus
                    ? orderStatusArr[refundAuditModalData.orderStatus.toString()]
                    : "---"}
                </span>
              </FormItem>
            </Col>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="支付时间">
                <span>{refundAuditModalData.payTime || '---'}</span>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col gutter={{ md: 8, lg: 24, xl: 48 }}>
              <FormItem label="退款详情：" />
            </Col>
          </Row>

          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="退款编号">
                <span>{refundAuditModalData.refundNum}</span>
              </FormItem>
            </Col>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="申请时间">
                <span>{refundAuditModalData.createTime}</span>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="退款金额">
                <span>{refundAuditModalData.amount >= 0 && `¥${refundAuditModalData.amount.toFixed(2)}`}</span>
              </FormItem>
            </Col>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="退款说明">
                <span>{refundAuditModalData.reason}</span>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={12}>
              <div className={refundAuditModalData.status === 3 ? styles.red : ''}>
                <FormItem {...formItemLayout} label="退款状态">
                  <span>{refundAuditModalData.status == 0 && "新退款订单"}</span>
                  <span>{refundAuditModalData.status == 1 && "退款中"}</span>
                  <span>{refundAuditModalData.status == 2 && "退款成功"}</span>
                  <span>{refundAuditModalData.status == 3 && "退款失败"}</span>
                </FormItem>
              </div>
            </Col>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="退款时间" style={{ display: refundAuditModalData.status === 2 ? '' : 'none'}}>
                {refundAuditModalData.refundTime || '---'}
              </FormItem>
              <div className={refundAuditModalData.status === 3 ? styles.red : ''}>
                <FormItem {...formItemLayout} label="异常原因" style={{ display: refundAuditModalData.status === 3 ? '' : 'none' }}>
                  <span>{refundAuditModalData.refundMsg || '---'}</span>
                </FormItem>
              </div>
            </Col>
          </Row>
          <div style={{ display: tabKey === '0' ? 'none' : ''}}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12} sm={12}>
                <FormItem {...formItemLayout} label="审核信息">
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12} sm={12}>
                <FormItem {...formItemLayout} label="审核人">
                  {refundAuditModalData.auditUser}
                </FormItem>
              </Col>
              <Col md={12} sm={12}>
                <FormItem {...formItemLayout} label="审核时间">
                  {refundAuditModalData.auditTime}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12} sm={12}>
                <FormItem {...formItemLayout} label="审核结果">
                  {refundAuditModalData.auditStatus >= 0 && auditStatus[refundAuditModalData.auditStatus.toString()] || '---'}
                </FormItem>
              </Col>
              <Col md={12} sm={12}>
                <FormItem {...formItemLayout} label="未通过原因" style={{ display: tabKey === '2' ? '' : 'none'}}>
                  {refundAuditModalData.auditReason}
                </FormItem>
              </Col>
            </Row>
          </div>
          <Row style={{ display: tabKey === '0' ? '' : 'none'}}>
            <Col md={24} sm={24}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Button onClick={() => orderStatus(2)} style={{ marginRight: 20 }}>不通过</Button>
                <Button type="primary" onClick={() => orderStatus(1)}>通过</Button>
              </div>
            </Col>
          </Row>
          {/*<Row style={{ display: tabKey === 1 ? '' : 'none'}}>*/}
            {/*<Col md={12} sm={12}>*/}
              {/*<Button type="primary">线下退款</Button>*/}
              {/*<Button type="primary">再次退款</Button>*/}
            {/*</Col>*/}
          {/*</Row>*/}
        </Form>
      </div>
    </Modal>
  );
});
const RefuseAuditForm = Form.create()(props => {
  const {
    handleModalVisible,
    handleAdd,
    refuseModalVisible,
    refuseEditModalConfirmLoading,
    form,
    getByteLen
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
  return (
    <Modal
      title={
        <div class="modalBox">
          <span class="leftSpan" />
          <span class="modalTitle">提示</span>
        </div>
      }
      visible={refuseModalVisible}
      onCancel={() => handleModalVisible()}
      onOk={handleAdd}
      confirmLoading={refuseEditModalConfirmLoading}
      width={1000}
    >
      <div className="manageAppBox">
        <Form>
          {/*<Row gutter={{ md: 8, lg: 24, xl: 48 }}>*/}
            {/*<Col md={12} sm={12}>*/}
              {/*<FormItem {...formItemLayout} label="不通过原因" />*/}
            {/*</Col>*/}
          {/*</Row>*/}
          <FormItem {...formItemLayout} label="不通过原因">
            {getFieldDecorator('auditReason', {
              rules: [{ required: true, whitespace: true, message: '请输入不通过原因' }, {
                validator: getByteLen
              }],
            })(
              <TextArea placeholder="请填写不通过原因（50字内），填写内容将告知给用户" autosize={{ minRows: 2, maxRows: 6 }} />
            )}
          </FormItem>
        </Form>
      </div>
    </Modal>
  );
});
const EditRemarkForm = Form.create()(props => {
  const {
    handleModalVisible,
    handleAdd,
    refuseModalVisible,
    refuseEditModalConfirmLoading,
    form,
    getByteLen
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
  return (
    <Modal
      title={
        <div class="modalBox">
          <span class="leftSpan" />
          <span class="modalTitle">编辑备注</span>
        </div>
      }
      visible={refuseModalVisible}
      onCancel={() => handleModalVisible()}
      onOk={handleAdd}
      confirmLoading={refuseEditModalConfirmLoading}
      width={1000}
    >
      <div className="manageAppBox">
        <Form>
          <FormItem {...formItemLayout} label="备注">
            {getFieldDecorator('remark', {
              rules: [{ required: true, whitespace: true, message: '请输入备注' }, {
                validator: getByteLen
              }],
            })(
              <TextArea placeholder="请输入备注说明，不超过50字" autosize={{ minRows: 2, maxRows: 6 }} />
            )}
          </FormItem>
        </Form>
      </div>
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
    tabKey: '0', // tab标签index
    channelLists: [], // 渠道列表
    tableList: [],
    searchParams: {},
    refundAuditModalData: {},
    watchRefundAuditForm: false,

    refuseModalVisible: false,
    refuseEditModalConfirmLoading: false,

    editRemarkModalVisible: false,
    editRemarkModalConfirmLoading: false,
  };

  componentDidMount() {
    this.getBaseDictLists();
    const { form } = this.props;
    if (this.props.location.query) {
      const { active, status } = this.props.location.query;
      this.setState({
        tabKey: active,
        searchParams: {
          status,
        }
      }, () => {
        this.getLists();
      })
      form.setFieldsValue({
        status,
      });
    } else {
      this.getLists();
    }
    this.setColumns(this.props.location.query && this.props.location.query.active);
  }
  // 获取渠道
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
  getByteLen = (rule, value, callback) => {
    let len = 0;
    for (let i = 0; i < value.length; i++) {
      let length = value.charCodeAt(i);
      if(length >= 0 && length <= 128)
      {
        len += 1;
      }
      else
      {
        len += 2;
      }
    }
    if(len > 100){
      callback('不能超过50汉字, 其中2个字符算一个中文')
    }
    callback()
  }
  // 重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      searchParams: {},
      pageNo: 1
    });
  };
  // 头部搜索
  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { channelLists, tabKey } = this.state;
    const refundStatus = [
      // { id: 0, name: '新退款订单' },
      { id: 1, name: "退款中" },
      { id: 2, name: "退款成功" },
      { id: 3, name: "退款异常" }
    ];
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={8} sm={24} lg={8}>
            <FormItem label="渠道名称：">
              {getFieldDecorator("channel")(
                <Select placeholder="选择渠道">
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
          <Col md={8} sm={24} lg={8}>
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
          <Col md={8} sm={24} lg={8}>
            <FormItem label="退款状态">
              {getFieldDecorator("status")(
                <Select disabled={tabKey === '0' || tabKey === '2'} placeholder="选择退款状态">
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
  // 点击日期
  onDateChange = (date, dateString) => {
    console.log(date, dateString);
  };
  // 点击搜索
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    // const { tabKey } = this.state
    form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue);
      if (err) return;
      const values = {
        ...fieldsValue,
        time: fieldsValue.time ? fieldsValue.time.format("YYYY-MM-DD") : '',
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
    const params = Object.assign(tabKey === '1' ? searchParams : {
      ...searchParams, status: ''
    }, { pageNo, auditStatus: tabKey });
    console.log(params);
    dispatch({
      type: "orderReview/getRefundList",
      payload: {
        params
      }
    }).then(res => {
      console.log(res);
      if (res && res.code == 0) {
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
        type: "orderReview/refundDetail",
        payload: {
          params: { id }
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
  // 点击表格中的审核
  gotoReview = text => {
    console.log(text);
    this.getOrderDetail(text.id).then(res => {
      if (res && res.code == 0) {
        this.setState(
          {
            refundAuditModalData: res.data
          },
          () => {
            this.setState({
              watchRefundAuditForm: true
            });
          }
        );
      }
    });
  };
  // 审核通过
  orderStatus = (auditStatus) => {
    // refundAudit
    if (auditStatus === 2) {
      this.setState({
        refuseModalVisible: true,
      });
      return;
    }
    this.editRefundAudit(auditStatus)
  }
  editRefundAudit = (auditStatus, auditReason) => {
    const { dispatch } = this.props;
    const { refundAuditModalData } = this.state
    console.log('refundAuditModalData', refundAuditModalData)
    let params = {
      id: refundAuditModalData.id,
      auditStatus,
    }
    if (auditStatus === 2) {
      params = {
        ...params,
        auditReason,
      }
    }
    return new Promise((resolve, reject) => {
      dispatch({
        type: "orderReview/refundAudit",
        payload: {
          params: {
            ...params,
          }
        }
      }).then(res => {
        if (res && res.code === 0) {
          message.success('审核成功')
          this.setState({
            refuseModalVisible: false,
            refuseEditModalConfirmLoading: false,
            watchRefundAuditForm: false,
          })
          this.getLists();
        }
      })
        .catch(err => {
          reject(err);
        });
    });
  }
  // 点击关闭Model
  refundAuditModalVisible = flag => {
    console.log(flag);
    this.setState({
      watchRefundAuditForm: false,
      refundAuditModalData: {}
    });
  };
  // 根据tabKey来判断表头显示
  setColumns = (k = 0) => {
    let columns = [];
    switch (parseInt(k)) {
      case 0:
        columns = [
          {
            title: "订单编号",
            dataIndex: "orderNum",
            key: "orderNum",
            // fixed: "left"
            width: '12%'
          },
          { title: "手机号", dataIndex: "phone", key: "phone", width: '8%', },
          { title: "机器点位", dataIndex: "local", key: "local", width: '12%', },
          { title: "机器编号", dataIndex: "machineCode", key: "machineCode", width: '8%', },
          { title: "渠道名称", dataIndex: "channelName", key: "channelName", width: '6%', },
          { title: "活动名称", dataIndex: "activityName", key: "activityName", width: '5%', },
          { title: "退款编号", dataIndex: "refundNum", key: "refundNum", width: '8%', },
          { title: "申请时间", dataIndex: "createTime", key: "createTime", width: '10%', },
          { title: "退款金额", dataIndex: "amount", key: "amount", width: '8%',render: (value) => {
              if (value >= 0) {
                return `¥${value.toFixed(2)}`;
              } else {
                return '-';
              }
            }
          },
          { title: "退款说明", dataIndex: "reason", key: "reason", width: '8%', },
          { title: "备注", dataIndex: "remark", key: "remark"},
          {
            title: "操作",
            key: "action",
            width: 100,
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
                    this.editNote(text);
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
            width: '12%'
            // fixed: "left"
          },
          { title: "手机号", dataIndex: "phone", key: "phone", width: '8%', },
          { title: "机器点位", dataIndex: "local", key: "local", width: '10%', },
          { title: "机器编号", dataIndex: "machineCode", key: "machineCode", width: '6%', },
          { title: "渠道名称", dataIndex: "channelName", key: "channelName", width: '6%', },
          { title: "活动名称", dataIndex: "activityName", key: "activityName", width: '5%', },
          { title: "退款编号", dataIndex: "refundNum", key: "refundNum", width: '8%', },
          { title: "退款申请时间", dataIndex: "createTime", key: "createTime", width: '10%', },
          { title: "退款金额", dataIndex: "amount", key: "amount", width: '8%', render: (value) => {
              if (value >= 0) {
                return `¥${value.toFixed(2)}`;
              } else {
                return '-';
              }
            }},
          { title: "退款状态", dataIndex: "status", key: "status", width: '8%', render: (value) => {
              if (value >= 0) {
                return status[value] || value;
              } else {
                return '-';
              }
            }
          },
          { title: "异常原因", dataIndex: "refundMsg", key: "refundMsg", width: '8%',  render: (value) => {
              return value || '-';
            }  },
          { title: "备注", dataIndex: "remark", key: "remark" },
          {
            title: "操作",
            key: "action",
            fixed: "right",
            width: 100,
            render: (text, record) => (
              <span className={styles.action}>
                <a
                  onClick={() => {
                    this.gotoReview(text, record.key);
                  }}
                >
                  查看
                </a>
                <a
                  onClick={() => {
                    this.handRefundUpdate(2, '', text);
                  }}
                  style={{ display: text.status === 3 ? '' : 'none'}}
                >
                  线下退款
                </a>
                <a
                  onClick={() => {
                    this.handRefundUpdate(3, '', text);
                  }}
                  style={{ display: text.status === 3 ? '' : 'none'}}
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
            width: '12%'
            // fixed: "left"
          },
          { title: "手机号", dataIndex: "phone", key: "phone", width: '8%', },
          { title: "机器点位", dataIndex: "local", key: "local" , width: '10%',},
          { title: "机器编号", dataIndex: "machineCode", key: "machineCode", width: '6%', },
          { title: "渠道名称", dataIndex: "channelName", key: "channelName", width: '6%', },
          { title: "活动名称", dataIndex: "activityName", key: "activityName", width: '6%', },
          { title: "退款编号", dataIndex: "refundNum", key: "refundNum", width: '8%', },
          { title: "退款申请时间", dataIndex: "createTime", key: "createTime", width: '10%', },
          { title: "退款金额", dataIndex: "amount", key: "amount", width: '8%', render: (value) => {
              if (value >= 0) {
                return `¥${value.toFixed(2)}`;
              } else {
                return '-';
              }
            }
          },
          { title: "未通过原因", dataIndex: "auditReason", key: "auditReason", width: '10%', },
          { title: "备注", dataIndex: "remark", key: "remark" },
          {
            title: "操作",
            key: "action",
            fixed: "right",
            width: 100,
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
  // 审核状态弹框
  saveFormRef = (form) => {
    this.form = form;
  }
  handleModalVisible = (flag) => {
    this.setState({
      refuseModalVisible: !!flag,
      refuseEditModalConfirmLoading: false,
    });
  };
  handleAdd = () => {
    this.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      this.editRefundAudit(2, fieldsValue.auditReason)
    })
  }
  // 编辑备注
  saveEditRemarkFormRef = (form) => {
    this.saveEditRemarkForm = form;
  }
  handleEditRemarkModalVisible = (flag) => {
    this.setState({
      editRemarkModalVisible: !!flag,
      editRemarkModalConfirmLoading: false,
      refundAuditModalData: ''
    });
  };
  handleEditRemarkAdd = () => {
    this.setState({
      editRemarkModalConfirmLoading: true,
    });
    this.saveEditRemarkForm.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      // refundUpdate
      this.handRefundUpdate(1, fieldsValue.remark)
    })
  }
  editNote = (text) => {
    this.setState({
      editRemarkModalVisible: true,
      editRemarkModalConfirmLoading: false,
      refundAuditModalData: text
    }, () => {
      const { refundAuditModalData } = this.state
      this.saveEditRemarkForm.setFieldsValue({
        remark: refundAuditModalData.remark || '',
      });
    });
  }
  handRefundUpdate = (type, remark, record) => {
    const { dispatch } = this.props;
    const RefundUpdate = {
      1: '编辑备注更新成功',
      2: '线下付款成功',
      3: '再次退款成功'
    }
    const { refundAuditModalData } = this.state
    let params = {
      id: refundAuditModalData.id || record.id,
      type,
    }
    if (remark) {
      params = {
        ...params,
        remark,
      }
    }
    return new Promise((resolve, reject) => {
      dispatch({
        type: "orderReview/refundUpdate",
        payload: {
          params: {
            ...params,
          }
        }
      }).then(res => {
        if (res && res.code === 0) {
          message.success(RefundUpdate[type && type.toString()] || '更新成功')
          this.setState({
            editRemarkModalVisible: false,
            editRemarkModalConfirmLoading: false,
          });
          this.getLists();
        }
      }).catch(err => {
          reject(err);
        });
    });
  }
  render() {
    const { loading } = this.props;
    const { columns, tableList, tabKey } = this.state;
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
          <Tabs onChange={this.callback} type="card" activeKey={tabKey}>
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
              scroll={{ x: 1800 }}
            />
          </div>
        </Card>
        <RefundAuditForm
          watchRefundAuditForm={this.state.watchRefundAuditForm}
          refundAuditModalVisible={this.refundAuditModalVisible}
          refundAuditModalData={this.state.refundAuditModalData}
          tabKey={this.state.tabKey}
          orderStatus={this.orderStatus}
        />
        <RefuseAuditForm
          ref={this.saveFormRef}
          handleModalVisible={this.handleModalVisible}
          handleAdd={this.handleAdd}
          refuseModalVisible={this.state.refuseModalVisible}
          refuseEditModalConfirmLoading={this.state.refuseEditModalConfirmLoading}
          getByteLen={this.getByteLen}
        />
        <EditRemarkForm
          ref={this.saveEditRemarkFormRef}
          handleModalVisible={this.handleEditRemarkModalVisible}
          handleAdd={this.handleEditRemarkAdd}
          refuseModalVisible={this.state.editRemarkModalVisible}
          refuseEditModalConfirmLoading={this.state.editRemarkModalConfirmLoading}
          getByteLen={this.getByteLen}
        />
      </PageHeaderLayout>
    );
  }
}
