import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  Modal,
  Divider,
  Popconfirm,
  message,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './DataStatement.less'
import StandardTable from '../../components/StandardTable';
import EditableTagGroup from '../../components/Tag';
import {templateQuery} from "../../services/data/dataStatement";
import moment from "moment/moment";
import { getUser } from "../../utils/authority";

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;

@connect(({ common, loading, dataStatement, scheduleSetting }) => ({
  common,
  scheduleSetting,
  dataStatement,
  loading: loading.models.dataStatement,
}))
@Form.create()
export default class DataStatistics extends PureComponent {
  state = {
    formValues: {},
    activityId: '',
    goodsId: '',
    merchantId: '',
    city: '',
    startTime: '',
    endTime: '',
    pageNo: 1,
    pageSize: 20,
    outputType: 1,
    keyword: '',

    activityLists: [],
    merchantLists: [{
        id: '',
        name: '全部'
    }],
    cityLists: [],
    goodsLists: [{
      id: '',
      name: '全部'
    }],
  };
  componentDidMount() {
    this.getLists('');
    this.getSearch()
  }
  componentDidUpdate(comp,state) {
  }
  getSearch = (activityId, merchantId) => {
    this.props.dispatch({
      type: 'dataStatement/getActivitySearchParams',
      payload: {
        params: {
          activityId,
          merchantId,
        },
      },
    }).then((res) => {
      if (res && res.code === 0) {
        this.setState({
          activityLists: res.data.activity,
          merchantLists: activityId ? res.data.merchant : this.state.merchantLists,
          cityLists: res.data.city,
          goodsLists: merchantId ? res.data.goods : [{
            id: '',
            name: '全部'
          }],
        })
      }
    });
  }
  // 获取列表
  getLists = () => {
    this.props.dispatch({
      type: 'dataStatement/getReportActivity',
      payload: {
        restParams: {
          activityId: this.state.activityId,
          goodsId: this.state.goodsId,
          merchantId: this.state.merchantId,
          city: this.state.city,
          startTime: this.state.startTime,
          endTime: this.state.endTime,
          pageNo: this.state.pageNo,
          pageSize: this.state.pageSize,
          outputType: this.state.outputType,
          keyword: this.state.keyword,
        },
      },
    });
  }
  // 分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
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
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    const { current } = pagination;
    // console.log('params', params)
    this.setState({
      pageNo: current,
      outputType: 1,
    }, () => {
      this.getLists('');
    });
  };
  // 重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      name: '',
      merchantLists: [{
        id: '',
        name: '全部'
      }],
      cityLists: [],
      goodsLists: [{
        id: '',
        name: '全部'
      }],
    });
  };
  // 搜索
  handleSearch = (e, flag = 1) => {
    e && e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        startTime: fieldsValue.rangeTime && fieldsValue.rangeTime.length > 0  ? fieldsValue.rangeTime[0].format('YYYY-MM-DD') : '',
        endTime: fieldsValue.rangeTime && fieldsValue.rangeTime.length > 0 ? fieldsValue.rangeTime[1].format('YYYY-MM-DD') : '',
        activityId: fieldsValue.activityId ? fieldsValue.activityId : '',
        goodsId: fieldsValue.goodsId ? fieldsValue.goodsId : '',
        merchantId: fieldsValue.merchantId ? fieldsValue.merchantId : '',
        city: fieldsValue.city ? fieldsValue.city : '',
        outputType: flag === 0 ? 0 : flag,
        keyword: fieldsValue.keyword ? fieldsValue.keyword : '',
        pageNo: 1,
      }, () => {
        this.getLists();
      });
    });
  };
  changeMerchants = (v) => {
    this.getSearch(v ? v : '', '')
    const { form } = this.props;
    form.setFieldsValue({
      goodsId: undefined,
      merchantId: undefined,
    });
  }
  changeGoods = (v) => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.getSearch(fieldsValue.activityId ? fieldsValue.activityId : '', v ? v : '')
    });
  }
  disabledDate(current) {
    // Can not select days before today and today
    return current && current > moment().endOf('day') - 1;
  }
  renderAdvancedForm() {
    const { form } = this.props;
    const { activityLists, merchantLists, cityLists, goodsLists } = this.state
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={7} sm={24}>
            <FormItem {...formItemLayout} label="选择活动">
              {getFieldDecorator('activityId', {
                rules: [{ required: false, message: '请选择活动' }],
              })(<Select placeholder="请选择" onChange={this.changeMerchants}>
                {activityLists.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>{item.name}</Option>
                  );
                })}
              </Select>)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem {...formItemLayout} label="时间">
              {getFieldDecorator('rangeTime')(
                <RangePicker
                  placeholder={['开始时间', '结束时间']}
                  disabledDate={this.disabledDate}
                />
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem {...formItemLayout} label="选择地区">
              {getFieldDecorator('city', {
                rules: [{ required: false, message: '请选择地区' }],
              })(<Select placeholder="请选择" >
                {cityLists.map((item) => {
                  return (
                    <Option value={item.name} key={item.name}>{item.name}</Option>
                  );
                })}
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={7} sm={24}>
            <FormItem {...formItemLayout} label="商户商品">
              {getFieldDecorator('merchantId', {
                rules: [{ required: false, message: '请选择商户商品' }],
              })(<Select placeholder="请选择" onChange={this.changeGoods}>
                {merchantLists.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>{item.name}</Option>
                  );
                })}
              </Select>)}
              {getFieldDecorator('goodsId', {
                rules: [{ required: false, message: '请选择商户商品' }],
              })(<Select placeholder="请选择" >
                {goodsLists.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>{item.name}</Option>
                  );
                })}
              </Select>)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem {...formItemLayout} label="">
              {getFieldDecorator('keyword')(<Input placeholder="请输入机器编号，点位信息" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <span>
              <FormItem>
                <Button onClick={this.handleFormReset}>
                  重置
                </Button>
                <Button className={styles.serach} style={{ marginLeft: 8 }} type="primary" htmlType="submit">
                  查询
                </Button>
              </FormItem>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  render() {
    const {
      dataStatement: { list, page, totalinfo },
      loading,
    } = this.props;
    const columns = [
      {
        title: '时间',
        dataIndex: 'handleTime',
        width: '10%',
      },
      {
        title: '活动名称',
        dataIndex: 'activityName',
        width: '10%',
      }, {
        title: '地区',
        dataIndex: 'city',
        width: '10%',
      },
      {
        title: '点位信息',
        dataIndex: 'localName',
        width: '10%',
      }, {
        title: '机器编号',
        dataIndex: 'machineCode',
        width: '7%',
      },
      {
        title: '商户名称',
        dataIndex: 'merchantName',
        width: '8%',
      }, {
        title: '商品名称',
        dataIndex: 'goodsName',
        width: '8%',
      },
      {
        title: '客流量',
        dataIndex: 'vistor',
        width: '5%',
      }, {
        title: '互动次数',
        dataIndex: 'pv',
        width: '7%',
      },
      {
        title: '互动人数',
        dataIndex: 'uv',
        width: '7%',
      }, {
        title: '订单数',
        dataIndex: 'orders',
        width: '5%',
      }, {
        title: '掉货数',
        dataIndex: 'shipment',
        width: '5%',
      }, {
        title: '关注数',
        dataIndex: 'follow',
        width: '5%',
      }
    ];
    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
          <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="export" type="primary" onClick={() => this.handleSearch('', 0)}>
                导出
              </Button>
            </div>
            <div className={styles.tableList}>
              <div style={{margin: '10px 0'}}>
                合计：<span className={styles.totalI}>客流量：</span>{totalinfo && totalinfo.vistor} <i className={styles.totalI}>互动次数：</i>{totalinfo && totalinfo.pv} <i className={styles.totalI}>互动人数：</i>{totalinfo && totalinfo.uv} <i className={styles.totalI}>订单数：</i>{totalinfo && totalinfo.orders} <i className={styles.totalI}>掉货数：</i>{totalinfo && totalinfo.shipment} <i className={styles.totalI}>关注数：</i>{totalinfo && totalinfo.follow}
              </div>
              <StandardTable
                loading={loading}
                data={list}
                page={page}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                scrollX={1650}
              />
            </div>
          </div>
        </Card>

      </PageHeaderLayout>
    );
  }
}
