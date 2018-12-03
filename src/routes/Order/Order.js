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
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Order.less';
import OrderTable from '../../components/Order/orderTable';
import LogModal from '../../components/LogModal';
import {getAccountMenus} from "../../utils/authority";

const { Option } = Select;
const FormItem = Form.Item;
const payStatusLists = [{id: 0, name: '未支付'}, {id: 1, name: '支付成功'}]
const goodsStatusLists = [{id: 0, name: '未出货'}, {id: 1, name: '已出货'}]

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
    payStatus: '',
    goodsStatus: '',

    account: {},
  };

  componentDidMount = () => {
    this.getList();
    this.getArea('');
    this.getAccountMenus(getAccountMenus())
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
          payStatus: this.state.payStatus,
          goodsStatus: this.state.goodsStatus
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
        let areaCode = ''
        if (fieldsValue.areaCode) {
          if (fieldsValue.areaCode.length > 0) {
            areaCode = fieldsValue.areaCode[fieldsValue.areaCode.length - 1]
          }
        }
        this.setState({
          keyword: fieldsValue.keyword,
          areaCode,
          payStatus: fieldsValue.payStatus >= 0 ? fieldsValue.payStatus : '',
          goodsStatus: fieldsValue.goodsStatus >= 0 ? fieldsValue.goodsStatus : ''
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
                    <FormItem label="选择省市区">
                      {getFieldDecorator('areaCode', {
                        initialValue: areaCode,
                      })(
                        <Cascader
                          options={areaList}
                          onChange={(value) => { this.areaChange(value); }}
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
                    <FormItem>
                      {getFieldDecorator('payStatus')(
                        <Select placeholder="选择支付状态">
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
                  <Col md={9} sm={12}>
                    <FormItem>
                      {getFieldDecorator('goodsStatus')(
                        <Select placeholder="选择掉落状态">
                          {goodsStatusLists.map((item) => {
                            return (
                              <Option key={item.id} value={item.id}>{item.name}</Option>
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
