import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Cascader,
  Select,
  Modal,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Order.less';
import OrderTable from '../../components/Order/orderTable';
import LogModal from '../../components/LogModal';
import {getAccountMenus} from "../../utils/authority";

const { Option } = Select;
const FormItem = Form.Item;
const payStatusLists = [{id: 10, name: '未支付'}, {id: 20, name: '已支付'}, {id: 30, name: '已完成'}]
const goodsStatusLists = [{id: 0, name: '未出货'}, {id: 1, name: '已出货'}]
const orderType = {
  10: '点72订单',
  20: '天猫订单',
}
const goodsStatus = {
  0: '未掉落',
  1: '已出货',
}
const orderStatus = {
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
const status = {
  0: '新退款订单',
  1: '退款中',
  2: '退款成功',
  3: '退款失败'
}
const WatchForm = Form.create()(props => {
  const { watchModalVisible, modalData, handleWatchModalVisible } = props;
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
          <span class="modalTitle">订单详情</span>
        </div>
      }
      visible={watchModalVisible}
      onCancel={() => handleWatchModalVisible()}
      footer={null}
      width={1000}>
      <div className="manageAppBox">
        <Form onSubmit={this.handleSearch}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="订单编号">
                <span>{modalData.orderNum}</span>
              </FormItem>
            </Col>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="用户ID">
                <span>{modalData.userId ? modalData.userId : '---'}</span>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="第三方单号">
                <span>{modalData.refOrderId ? modalData.refOrderId : '---'}</span>
              </FormItem>
            </Col>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="登录名">
                <span>{modalData.loginName ? modalData.loginName : '---'}</span>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={23} sm={24}>
              <FormItem labelCol = {{
                xs: { span: 24 },
                sm: { span: 3 }
              }}
              wrapperCol = {{
                xs: { span: 24 },
                sm: { span: 21 }
              }}  label="机器点位">
                <span>{modalData.merPointAddress}</span>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="机器编号">
                <span>{modalData.machineCode}</span>
              </FormItem>
            </Col>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="活动名称">
                <span>{modalData.activityName}</span>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="渠道名称">
                <span>{modalData.channelName}</span>
              </FormItem>
            </Col>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="商户名称">
                <span>{modalData.merchantName}</span>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="店铺名称">
                <span>{modalData.shopsName}</span>
              </FormItem>
            </Col>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="商品类型">
                <span>{modalData.goodsType ? goodsType[modalData.goodsType] : '-'}</span>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="商品名称">
                <span>{modalData.orderGoodsList && modalData.orderGoodsList[0].goodsName}</span>
              </FormItem>
            </Col>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="下单时间">
                <span>{modalData.orderTime}</span>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="订单类型">
                <span>{modalData.orderType !== '999' ? orderType[modalData.orderType] : modalData.orderType}</span>
              </FormItem>
            </Col>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="订单金额">
                <span>{modalData.orderPrice}</span>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="出货状态">
                <span>{modalData.goodsStatus >= 0 ? goodsStatus[modalData.goodsStatus.toString()] : '---'}</span>
              </FormItem>
            </Col>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="订单状态">
                <span>{modalData.orderStatus ? orderStatus[modalData.orderStatus] : '---'}</span>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="支付状态">
                <span>{modalData.payStatus ? payStatus[modalData.payStatus] : '---'}</span>
              </FormItem>
            </Col>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="支付方式">
                <span>{modalData.payType ? payType[modalData.payType] : '---'}</span>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={12}>
              <FormItem {...formItemLayout} label="支付时间">
                <span>{modalData.payTime}</span>
              </FormItem>
            </Col>
          </Row>
          <div style={{ display: modalData.orderRefund && modalData.orderRefund.status === 2 ? '' : 'none' }}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12} sm={12}>
                <FormItem {...formItemLayout} label="退款详情">
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12} sm={12}>
                <FormItem {...formItemLayout} label="退款编号">
                  <span>{modalData.orderRefund && modalData.orderRefund.refundNum}</span>
                </FormItem>
              </Col>
              <Col md={12} sm={12}>
                <FormItem {...formItemLayout} label="申请时间">
                  <span>{modalData.orderRefund && modalData.orderRefund.createTime}</span>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12} sm={12}>
                <FormItem {...formItemLayout} label="退款金额">
                  <span>{modalData.orderRefund && modalData.orderRefund.amount}</span>
                </FormItem>
              </Col>
              <Col md={12} sm={12}>
                <FormItem {...formItemLayout} label="退款说明">
                  <span>{modalData.orderRefund && modalData.orderRefund.reason || '---'}</span>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12} sm={12}>
                <FormItem {...formItemLayout} label="退款状态">
                  <span>{modalData.orderRefund && modalData.orderRefund.status >= 0 && status[modalData.orderRefund.status] || '---'}</span>
                </FormItem>
              </Col>
            </Row>
          </div>
        </Form>
      </div>
    </Modal>
  );
});

@connect(({ order, loading, log, common }) => ({
  order,
  log,
  loading: loading.models.order,
  common,
}))
@Form.create()
export default class Order extends PureComponent {
  state = {
    pageNo: 1,
    keyword: '',
    areaCode: '',
    logModalVisible: false,
    logModalLoading: false,
    logId: '',
    logModalPageNo: 1,
    areaList: [],
    orderStatus: '',
    channelId: '',
    channelsLists: [],
    modalData: {},
    watchModalVisible: false,

    account: {},
  };

  componentDidMount = () => {
    this.getList();
    this.getArea('');
    this.getAccountMenus(getAccountMenus())
    this.getChannelsList()
  }
  getAccountMenus = (setAccountMenusList) => {
    if (setAccountMenusList) {
      const pointSettingMenu = setAccountMenusList.filter((item) => item.path === 'order')[0]
        .children.filter((item) => item.path === 'order')
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


  // 获取列表
  getList = () => {
    this.props.dispatch({
      type: 'order/getOrderList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          areaCode: this.state.areaCode,
          keyword: this.state.keyword,
          orderStatus: this.state.orderStatus,
          channelId: this.state.channelId
        },
      },
    });
  }
  // getChannelsList
  getChannelsList = () => {
    this.props.dispatch({
      type: 'common/getChannelsList',
      payload: {
      },
    }).then((res) => {
      if (res && res.code === 0) {
        console.log('res.data', res.data)
        this.setState({
          channelsLists: res.data
        })
      }
    });
  }
  // 获取商圈信息
  getArea = (selectedOptions) => {
    let code = '';
    let targetOption = null;
    if (selectedOptions) {
      targetOption = selectedOptions[selectedOptions.length - 1];
      code = targetOption.value;
      targetOption.loading = true;
    }

    this.props.dispatch({
      type: 'common/getProvinceCityAreaTradeArea',
      payload: {
        restParams: {
          code,
        },
      },
    }).then((data) => {
      if (selectedOptions) {
        targetOption.loading = false;
        targetOption.children = data;

        this.setState({
          areaList: [...this.state.areaList],
        });
      } else {
        this.setState({
          areaList: data,
        });
      }
    });
  }

  // 日志相关
  getLogList = () => {
    this.props.dispatch({
      type: 'log/getLogList',
      payload: {
        restParams: {
          code: this.state.logId,
          pageNo: this.state.logModalPageNo,
        },
      },
    }).then(() => {
      this.setState({
        logModalLoading: false,
      });
    });
  }


    // 搜索
    handleSearch = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, fieldsValue) => {
        if (err) return;
        let areaCode = ''
        if (fieldsValue.areaCode) {
          if (fieldsValue.areaCode.length > 0) {
            areaCode = fieldsValue.areaCode[fieldsValue.areaCode.length - 1]
          }
        }
        this.setState({
          keyword: fieldsValue.keyword,
          areaCode,
          orderStatus: fieldsValue.orderStatus >= 0 ? fieldsValue.orderStatus : '',
          channelId: fieldsValue.channelId ? fieldsValue.channelId : ''
        }, () => {
          this.getList();
        });
      });
    }


  // 分页
  handleTableChange = (pagination) => {
    const { current } = pagination;
    this.setState({
      pageNo: current,
    }, () => {
      this.getList();
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

  // 商圈选择事件
  areaChange = (value) => {
    this.setState({
      areaCode: value.value,
    }, () => {
      this.getList();
    });
  }
  // 重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      pageNo: 1,
      areaCode: '',
      keyword: '',
    });
  };
  onDetailClick = (item) => {
    console.log('item', item)
    // orderDetail
    this.props.dispatch({
      type: 'order/orderDetail',
      payload: {
        restParams: {
          id: item.id,
        },
      },
    }).then((res) => {
      if (res && res.code === 0) {
        this.setState({
          watchModalVisible: true,
          modalData: res.data,
        });
      }
    });
  }
  handleWatchModalVisible = flag => {
    this.setState({
      watchModalVisible: !!flag,
      modalData: {}
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { order: { list, page, unColumn }, log: { logList, logPage }, loading } = this.props;
    const { areaCode, keyword, areaList, account, channelsLists, watchModalVisible, modalData } = this.state;
    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={12}>
                    <FormItem label="选择省市区">
                      {getFieldDecorator('areaCode', {
                        initialValue: areaCode,
                      })(
                        <Cascader
                          options={areaList}
                          // onChange={(value) => { this.areaChange(value); }}
                          loadData={this.getArea}
                          changeOnSelect
                          placeholder="请选择"
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={12}>
                    <FormItem>
                      {getFieldDecorator('keyword', {
                        initialValue: keyword,
                      })(
                        <Input placeholder="请输入机器编号、活动名称、订单编号搜索" />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={12}>
                    <FormItem label="选择订单状态">
                      {getFieldDecorator('orderStatus')(
                        <Select placeholder="选择订单状态">
                          {payStatusLists.map((item) => {
                            return (
                              <Option key={item.id} value={item.id}>{item.name}</Option>
                            );
                          })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={12}>
                    <FormItem label="选择渠道">
                      {getFieldDecorator('channelId')(
                        <Select placeholder="选择渠道">
                          {channelsLists.map((item) => {
                            return (
                              <Option key={item.id} value={item.id}>{item.channelName}</Option>
                            );
                          })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col md={7} sm={12}>
                    <FormItem>
                      <Button onClick={this.handleFormReset}>重置</Button>
                      <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>查询</Button>
                    </FormItem>
                    {/*<span className={styles.submitButtons}>*/}
                    {/*<Button onClick={this.handleFormReset}>重置</Button>*/}
                    {/*<Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>查询</Button>*/}
                    {/*</span>*/}
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </Card>
        <Card bordered={false}>
          <div style={{ display: !account.list ? 'none' : ''}}>
            <OrderTable
              loading={loading}
              data={list}
              page={page}
              unColumn={unColumn}
              handleTableChange={this.handleTableChange}
              onDetailClick={this.onDetailClick}
            />
          </div>
        </Card>
        <WatchForm
          modalData={modalData}
          watchModalVisible={watchModalVisible}
          handleWatchModalVisible={this.handleWatchModalVisible}
        />
        <LogModal
          data={logList}
          page={logPage}
          loding={this.state.logModalLoading}
          logVisible={this.state.logModalVisible}
          logHandleCancel={this.logModalHandleCancel}
          logModalhandleTableChange={this.logModalhandleTableChange}
        />
      </PageHeaderLayout>
    );
  }
}
