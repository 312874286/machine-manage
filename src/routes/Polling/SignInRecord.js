import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Cascader,
  Table,
  DatePicker,
} from 'antd';
import StandardTable from '../../components/StandardTable/index';
import styles from './PunchingRecord.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';


const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const { RangePicker } = DatePicker;
@connect(({ common, loading, signInRecord, log }) => ({
  common,
  signInRecord,
  loading: loading.models.signInRecord,
}))
@Form.create()
export default class signInRecord extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    pageNo: 1,
    keyword: '',
    code: '',
    channelLists: [],
    options: [],
    startTime: '',
    endTime: '',
  };
  componentDidMount() {
    this.getAreaList();
    this.getLists();
  }
  // 获取列表
  getLists = () => {
    this.props.dispatch({
      type: 'signInRecord/getRecordList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          keyword: this.state.keyword,
          code: this.state.code,
          startTime: this.state.startTime,
          endTime: this.state.endTime,
        },
      },
    });
  }
  // 获取城市列表
  getAreaList = () => {
    this.props.dispatch({
      type: 'common/getProvinceCityAreaTradeArea',
      payload: {
        restParams: {
          code: this.state.code,
        },
      },
    }).then( (res) => {
      this.setState({
        options: res,
      });
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
  // 搜索
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let localCode = ''
      let startTime = ''
      let endTime = ''
      if (fieldsValue.provinceCityAreaTrade) {
        if (fieldsValue.provinceCityAreaTrade.length > 0) {
          localCode = fieldsValue.provinceCityAreaTrade[fieldsValue.provinceCityAreaTrade.length - 1];
        }
      }
      console.log('fieldsValue.time', fieldsValue.time)
      if (fieldsValue.time) {
        startTime = fieldsValue.time[0].format('YYYY-MM-DD HH:mm')
        endTime = fieldsValue.time[1].format('YYYY-MM-DD HH:mm')
      }

      this.setState({
        pageNo: 1,
        keyword: fieldsValue.keyword ? fieldsValue.keyword : '',
        startTime,
        endTime,
        code: localCode,
      }, () => {
        this.getLists();
      });
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
      code: ''
    });
  };
  // 四级联动开始
  onChange = (value, selectedOptions) => {
    // 当前选中的value[3]商圈
    // console.log(value, selectedOptions);
  }
  loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    this.setState({
      code: targetOption.value,
    }, () => {
      this.props.dispatch({
        type: 'common/getProvinceCityAreaTradeArea',
        payload: {
          restParams: {
            code: targetOption.value,
          },
        },
      }).then((res) => {
        targetOption.loading = false;
        targetOption.children = res
        this.setState({
          options: [...this.state.options],
        });
      });
    });
  }
  // 四级联动结束
  handleModalVisible = () => {
    this.props.dispatch({
      type: 'signInRecord/getUserExcel',
      payload: {
        restParams: {
          keyword: this.state.keyword,
          code: this.state.code,
          startTime: this.state.startTime,
          endTime: this.state.endTime
        },
      },
    })
  }
  onChange = (date, dateString) => {
    this.setState({
      startTime: dateString[0],
      endTime: dateString[1],
    })
  }
  // 新增modal确认事件 结束
  renderAdvancedForm() {
    const { form } = this.props;
    const { channelLists } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="省市区商圈">
              {getFieldDecorator('provinceCityAreaTrade')(
                <Cascader
                  placeholder="请选择"
                  options={this.state.options}
                  loadData={this.loadData}
                  onChange={this.onChange}
                  changeOnSelect
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem>
              {getFieldDecorator('keyword')(<Input placeholder="请输入姓名、手机号、公司搜索" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span>
               <FormItem>
                  {getFieldDecorator('time')(<RangePicker onChange={this.onChange}/>)}
               </FormItem>
            </span>
          </Col>
        </Row>
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          {/*<Col md={8} sm={24}>*/}
          {/*</Col>*/}
          {/*<Col md={9} sm={24}>*/}
          {/*</Col>*/}
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
      signInRecord: { list, page },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        width: 150,
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        width: 200,
      },
      {
        title: '公司',
        dataIndex: 'enterprise',
        width: 150,
      },
      {
        title: '机器点位',
        dataIndex: 'localeName',
        width: 200,
      },
      {
        title: '机器编号',
        dataIndex: 'machineCode',
        width: 200,
      },
      {
        title: '打卡时间',
        dataIndex: 'createTime',
        width: 250,
      },
    ];
    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
          <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              {/*<a href="" target="_blank" >*/}
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  导出
                </Button>
              {/*</a>*/}
              {/**/}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={list}
              page={page}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              scrollX={700}
              scrollY={(document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 100 + 100)}
            />
            {/*<Table */}
              {/*columns={columns}*/}
              {/*dataSource={list} */}
              {/*rowKey={record => record.createTime}*/}
              {/*pagination={false}*/}
              {/*scrollY={(document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 100 + 50)}*/}

            {/*/>*/}

          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
