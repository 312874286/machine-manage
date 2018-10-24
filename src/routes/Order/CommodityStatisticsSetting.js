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
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Order.less';
import CommodityStatisticsTable from '../../components/Order/commodityStatisticsTable.js';
import LogModal from '../../components/LogModal';
import {getAccountMenus} from "../../utils/authority";

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

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

    account: {},
    startTime: '',
    endTime: '',
  };

  componentDidMount = () => {
    this.getList();
    this.getArea('');
    // this.getAccountMenus(getAccountMenus())
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
          startTime: this.state.startTime,
          endTime: this.state.endTime,
        },
      },
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
      let startTime = ''
      let endTime = ''
      if (fieldsValue.time) {
        startTime = fieldsValue.time[0].format('YYYY-MM-DD')
        endTime = fieldsValue.time[1].format('YYYY-MM-DD')
      }
      this.setState({
        keyword: fieldsValue.keyword,
        startTime,
        endTime,
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const { order: { list, page, unColumn }, log: { logList, logPage }, loading } = this.props;
    const { areaCode, keyword, areaList, account } = this.state;

    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={12}>
                    <FormItem label="选择时间">
                      {getFieldDecorator('time')(<RangePicker />)}
                    </FormItem>
                  </Col>
                  <Col md={9} sm={12}>
                    <FormItem>
                      {getFieldDecorator('keyword', {
                        initialValue: keyword,
                      })(
                        <Input placeholder="请输入机器点位、机器编号、商品名称搜索" />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={7} sm={12}>
                    <FormItem>
                      <Button onClick={this.handleFormReset}>重置</Button>
                      <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>查询</Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </Card>
        <Card bordered={false}>
          <div>数据更新时间：</div>
          <div>
            <CommodityStatisticsTable
              loading={loading}
              data={list}
              page={page}
              unColumn={unColumn}
              handleTableChange={this.handleTableChange}
              onLogClick={this.handleLogClick}
            />
          </div>
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
    );
  }
}
