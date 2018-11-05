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
  message,
} from 'antd';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Order.less';
import CommodityStatisticsTable from '../../components/Order/commodityStatisticsTable.js';
import LogModal from '../../components/LogModal';
import {getAccountMenus} from "../../utils/authority";

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(({ commodityStatistics, loading, log, common }) => ({
  commodityStatistics,
  log,
  loading: loading.models.commodityStatistics,
  common,
}))
@Form.create()
export default class CommodityStatisticsSetting extends PureComponent {
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
    beginTime: '',
    endTime: '',

  };

  componentDidMount = () => {
    this.getList();
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
      type: 'commodityStatistics/historydayGoodsCount',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          beginTime: this.state.beginTime,
          endTime: this.state.endTime,
          keyword: this.state.keyword,
        },
      },
    });
  }
  // 搜索
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      let beginTime = ''
      let endTime = ''
      if (fieldsValue.time) {
        beginTime = fieldsValue.time[0].format('YYYY-MM-DD')
        endTime = fieldsValue.time[1].format('YYYY-MM-DD')
      }
      this.setState({
        keyword: fieldsValue.keyword,
        beginTime,
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
  handleExcel = () => {
    // dayGoodsCountExcel
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      let beginTime = ''
      let endTime = ''
      if (!fieldsValue.time) {
        message.warn('请选择一个时间')
        return
      } else {
        beginTime = fieldsValue.time[0].format('YYYY-MM-DD')
        endTime = fieldsValue.time[1].format('YYYY-MM-DD')
      }
      this.setState({
        keyword: fieldsValue.keyword,
        beginTime,
        endTime,
      }, () => {
        this.props.dispatch({
          type: 'commodityStatistics/dayGoodsCountExcel',
          payload: {
            restParams: {
              beginTime: this.state.beginTime,
              endTime: this.state.endTime,
              keyword: this.state.keyword,
            },
          },
        });
      });
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { commodityStatistics: { list, page, unColumn }, loading } = this.props;
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
          <div>
            数据更新时间：{moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}
            <Button icon="plus" type="primary" style={{ marginLeft: 20}} onClick={() => this.handleExcel(true)}>
              导出
            </Button>
         </div>
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
      </PageHeaderLayout>
    );
  }
}
