import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Menu,
  DatePicker,
  Table
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './LabelSetting.less';
const { RangePicker } = DatePicker;

const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
@connect(({ common, loading, machineDataStatistics, log }) => ({
  common,
  machineDataStatistics,
  loading: loading.models.machineDataStatistics,
  log,
}))
@Form.create()
export default class machineDataStatistics extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    id: '',
    pageNo: 1,
    modalData: {},
    modalType: true,
    account: {},

    WatchPointModalVisible: false,
    pointList: [],
    machineCode: '',

    startDateString: moment().format('YYYY-MM-DD'),
    endDateString: moment().format('YYYY-MM-DD'),
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
      type: 'machineDataStatistics/machineStatisticsList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          startDate: this.state.startDateString,
          endDate: this.state.endDateString,
          machineCode: this.state.machineCode
        },
      },
    });
  }
  // 重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      pageNo: 1,
      machineCode: '',
      startDateString: moment().format('YYYY-MM-DD'),
      endDateString: moment().format('YYYY-MM-DD'),
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
      let startDateString = moment().format('YYYY-MM-DD')
      let endDateString = moment().format('YYYY-MM-DD')
      if (Array.isArray(fieldsValue.time)) {
        startDateString = fieldsValue.time[0].format('YYYY-MM-DD')
        endDateString = fieldsValue.time[1].format('YYYY-MM-DD')
      }
      this.setState({
        pageNo: 1,
        startDateString,
        endDateString,
        machineCode: fieldsValue.machineCode ? fieldsValue.machineCode : ''
      }, () => {
        this.getLists();
      });
    });
  };
  startDatePickerChange = (date, dateString) => {
    this.setState({
      startDateString: dateString[0],
      endDateString: dateString[1],
    });
  }
  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { startDateString, endDateString } = this.state
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem>
              {getFieldDecorator('time', {
                initialValue: [moment(startDateString, 'YYYY-MM-DD'), moment(endDateString, 'YYYY-MM-DD')],
              })(<RangePicker
                onChange={this.startDatePickerChange}
                format={dateFormat}
              />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem>
              {getFieldDecorator('machineCode')(<Input placeholder="请输入机器code搜索" />)}
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
      machineDataStatistics: { list, unColumn },
      loading,
    } = this.props;
    let columns = [
      {
        title: '机器编码',
        width: '10%',
        dataIndex: 'machineCode',
        key: 'machineCode'
      },
      {
        title: '点位',
        width: '20%',
        dataIndex: 'point',
        key: 'point'
      },
      {
        title: '时间',
        width: '10%',
        dataIndex: 'date',
        key: 'date'
      },
      {
        title: '总访客人数',
        width: '10%',
        dataIndex: 'pv',
        key: 'pv'
      },
      {
        title: '独立访客数',
        width: '10%',
        dataIndex: 'uv',
        key: 'uv'
      },
      {
        title: '订单量',
        width: '10%',
        dataIndex: 'order',
        key: 'order'
      },
      {
        title: '出货量',
        width: '10%',
        dataIndex: 'shipment',
        key: 'shipment'
      },
      {
        title: '入会数量',
        width: '10%',
        dataIndex: 'fans',
        key: 'fans'
      },
      {
        title: '关注数量',
        width: '10%',
        dataIndex: 'concern',
        key: 'concern'
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
              <Table
                loading={loading}
                rowKey={record => record.date + record.machineCode }
                // rowSelection={selectedRows}
                dataSource={list}
                columns={columns}
                pagination={false}
                // onChange={this.handleTableChange}
                scroll={{ x: 500 ? scrollX : 1050, y: (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62)}}
              />
            </div>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
