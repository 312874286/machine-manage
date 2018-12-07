import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  InputNumber,
} from 'antd';
import StandardTable from '../../components/StandardTable/index';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './LabelSetting.less';

const FormItem = Form.Item;
@connect(({ common, loading, flowMonitoring, log }) => ({
  common,
  flowMonitoring,
  loading: loading.models.flowMonitoring,
  log,
}))
@Form.create()
export default class FlowMonitoring extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    id: '',
    pageNo: 1,
    machineCode: '',
    allTraffic: '',
    modalData: {},
    modalType: true,
    account: {},
  };
  componentDidMount() {
    this.getLists();
    // this.getAccountMenus(getAccountMenus())
  }
  getAccountMenus = (setAccountMenusList) => {
    if (setAccountMenusList) {
      const pointSettingMenu = setAccountMenusList.filter((item) => item.path === 'machine')[0]
        .children.filter((item) => item.path === 'label')
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
  getLists = () => {
    this.props.dispatch({
      type: 'flowMonitoring/flowMonitoringLists',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          machineCode: this.state.machineCode,
          allTraffic: this.state.allTraffic,
        },
      },
    });
  }
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
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    const { current } = pagination;
    // console.log('params', params)
    this.setState({
      pageNo: current,
    }, () => {
      this.getLists();
    });
  };
  // 重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      pageNo: 1,
      keyword: '',
    });
  };
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };
  // 搜索
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        pageNo: 1,
        keyword: fieldsValue.keyword ? fieldsValue.keyword : '',
        allTraffic: fieldsValue.allTraffic >= 0 ? fieldsValue.allTraffic : '',
      }, () => {
        this.getLists();
      });
    });
  };
  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem>
              {getFieldDecorator('machineCode')(<Input placeholder="请输入机器code搜索" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem>
              {getFieldDecorator('allTraffic')(<InputNumber placeholder="请输入总流量搜索" min={0}/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
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
      flowMonitoring: { list, page, unColumn },
      loading,
    } = this.props;
    let columns = [
      {
        title: '时间',
        width: '20%',
        dataIndex: 'createTime',
        key: 'createTime'
      },
      {
        title: '机器Code',
        width: '20%',
        dataIndex: 'machineId',
        key: 'machineId'
      },
      {
        title: '当日总流量',
        width: '20%',
        dataIndex: 'thatdayTraffic',
        key: 'thatdayTraffic'
      },
      {
        title: '当月流量',
        width: '20%',
        dataIndex: 'monthTraffic',
        key: 'monthTraffic'
      },
      {
        title: '总流量',
        width: '20%',
        dataIndex: 'allTraffic',
        key: 'allTraffic'
      },
    ];
    if (unColumn) {
      let leg = columns.length
      for (let i = leg - 1; i >= 0; i--) {
        for (let j = 0; j < unColumn.length; j++) {
          if (columns[i]) {
            if (columns[i].key === unColumn[j]) {
              columns.splice(i, 1)
              continue;
            }
          }
        }
      }
    }
    const width = 90/(columns.length - 1)
    for (let i = 0; i < columns.length; i++) {
      if (i < columns.length - 2) {
        columns[i].width = width + '%'
      }
      if (i === columns.length - 2) {
        columns[i].width = ''
      }
    }
    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
          <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div>
              <StandardTable
                loading={loading}
                data={list}
                page={page}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                scrollX={500}
              />
            </div>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
