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
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Order.less';
import OrderTable from '../../components/Order/orderTable';
import LogModal from '../../components/LogModal';

const FormItem = Form.Item;


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
  };

  componentDidMount = () => {
    this.getList();
    this.getArea('');
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

        this.setState({
          keyword: fieldsValue.keyword,
          areaCode: fieldsValue.areaCode,
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
    const { order: { list, page }, log: { logList, logPage }, loading } = this.props;
    const { areaCode, keyword, areaList } = this.state;

    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={10} sm={12}>
                    <FormItem label="选择商圈">
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
                  <Col md={9} sm={12}>
                    <FormItem>
                      {getFieldDecorator('keyword', {
                        initialValue: keyword,
                      })(
                        <Input placeholder="请输入机器编号、活动名称、订单编号搜索" />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={5} sm={12}>
                    <span className={styles.submitButtons}>
                      <Button onClick={this.handleFormReset}>重置</Button>
                      <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>查询</Button>
                    </span>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </Card>
        <Card bordered={false}>
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
    );
  }
}
