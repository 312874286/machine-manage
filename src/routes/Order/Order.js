import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Order.less';
import OrderTable from '../../components/Order/orderTable';
import { orderStatusData, orderTypeData } from '../../common/config/order';
import LogModal from '../../components/LogModal';

const { RangePicker } = DatePicker;
const { Option } = Select;
const FormItem = Form.Item;


@connect(({ order, loading, log }) => ({
  order,
  log,
  loading: loading.models.order,
}))
@Form.create()
export default class Order extends PureComponent {
  state = {
    pageNo: 1,
    startDate: '',
    endDate: '',
    orderNum: '',
    orderType: '',
    status: '',
    logModalVisible: false,
    logModalLoading: false,
    logId: '',
    logModalPageNo: 1,
  };

  componentDidMount = () => {
    this.getList();
  }

  // 获取列表
  getList = () => {
    this.props.dispatch({
      type: 'order/getOrderList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          startDate: this.state.startDate,
          endDate: this.state.endDate,
          orderNum: this.state.orderNum,
          orderType: this.state.orderType,
          status: this.state.status,
        },
      },
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

  // 搜索
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.setState({
        startDate: fieldsValue.time ? fieldsValue.time[0].format('YYYY-MM-DD') : '',
        endDate: fieldsValue.time ? fieldsValue.time[1].format('YYYY-MM-DD') : '',
        orderNum: fieldsValue.orderNum,
        orderType: fieldsValue.orderType,
        status: fieldsValue.status,
      }, () => {
        this.getList();
      });
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


  render() {
    const { getFieldDecorator } = this.props.form;
    const { order: { list, page }, log: { logList, logPage }, loading } = this.props;
    const { orderNum, time, orderType, status } = this.state;

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={12}>
                    <FormItem label="支付时间">
                      {getFieldDecorator('time', {
                        initialValue: time,
                      })(
                        <RangePicker />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={12}>
                    <FormItem label="订单类型">
                      {getFieldDecorator('orderType', {
                        initialValue: orderType,
                      })(
                        <Select placeholder="请选择">
                          {orderTypeData.map((item, index) => {
                            return <Option key={index} value={item.id}>{item.name}</Option>;
                          })}
                          <Option value="">全部</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={12}>
                    <FormItem label="订单状态">
                      {getFieldDecorator('status', {
                        initialValue: status,
                      })(
                        <Select placeholder="请选择" >
                          {orderStatusData.map((item, index) => {
                            return <Option key={index} value={item.id}>{item.name}</Option>
                          })}
                          <Option value="">全部</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={12}>
                    <FormItem label="订单号">
                      {getFieldDecorator('orderNum', {
                        initialValue: orderNum,
                      })(
                        <Input placeholder="请输入" />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={12}>
                    <span className={styles.submitButtons}>
                      <Button type="primary" htmlType="submit">查询</Button>
                    </span>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>

          <OrderTable
            loading={loading}
            data={list}
            page={page}
            handleTableChange={this.handleTableChange}
            onLogClick={this.handleLogClick}
          />
        </Card>
        <LogModal
          data={logList}
          page={logPage}
          loding={this.state.logModalLoading}
          logVisible={this.state.logModalVisible}
          logHandleCancel={this.logModalHandleCancel}
          logModalhandleTableChange={this.logModalhandleTableChange}
        />
      </PageHeaderLayout>
    )
  }
}
