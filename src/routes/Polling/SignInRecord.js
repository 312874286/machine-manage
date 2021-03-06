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
  Checkbox,
  Popconfirm
} from 'antd';
import StandardTable from '../../components/StandardTable/index';
import styles from './SignInRecord.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {getAccountMenus} from "../../utils/authority";


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
    selectedRowKeys: '',
    account: {},
    status: ''
  };
  componentDidMount() {
    this.getAreaList();
    this.getLists();
    this.getAccountMenus(getAccountMenus())
  }
  getAccountMenus = (setAccountMenusList) => {
    if (setAccountMenusList) {
      const pointSettingMenu = setAccountMenusList.filter((item) => item.path === 'check')[0]
        .children.filter((item) => item.path === 'signIn')
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
      type: 'signInRecord/getRecordList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          keyword: this.state.keyword,
          code: this.state.code,
          startTime: this.state.startTime,
          endTime: this.state.endTime,
          status: this.state.status
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
      console.log('status',fieldsValue.status)
      if (err) return;
      let localCode = ''
      let startTime = ''
      let endTime = ''
      let status = ''
      if (fieldsValue.provinceCityAreaTrade) {
        if (fieldsValue.provinceCityAreaTrade.length > 0) {
          localCode = fieldsValue.provinceCityAreaTrade[fieldsValue.provinceCityAreaTrade.length - 1];
        }
      }
      if (fieldsValue.status) {
        status = fieldsValue.status
      }
      console.log('fieldsValue.time', fieldsValue.time)
      if (fieldsValue.time) {
        startTime = fieldsValue.time[0].format('YYYY-MM-DD')
        endTime = fieldsValue.time[1].format('YYYY-MM-DD')
      }

      this.setState({
        pageNo: 1,
        keyword: fieldsValue.keyword ? fieldsValue.keyword : '',
        startTime,
        endTime,
        code: localCode,
        status,
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
            <FormItem label="省市区">
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
            <span>
               <FormItem>
                  {getFieldDecorator('time')(<RangePicker onChange={this.onChange}/>)}
               </FormItem>
            </span>
          </Col>
          <Col md={8} sm={24}>
            <span>
               <FormItem >
               {getFieldDecorator('status')(
                  <Select placeholder="请选择状态">
                    <Option value="0">有效</Option>
                    <Option value="1">无效</Option>
                  </Select>
                  )}
               </FormItem>
            </span>
          </Col>
          
        </Row>
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          {/*<Col md={8} sm={24}>*/}
          {/*</Col>*/}
          {/*<Col md={9} sm={24}>*/}
          {/*</Col>*/}
          <Col md={8} sm={24}>
            <FormItem>
              {getFieldDecorator('keyword')(<Input placeholder="请输入姓名、手机号、公司、机器点位、编号搜索" />)}
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

  handleTableClick = (val, record) => {
    console.log(val, record)
    const { dispatch } = this.props
    dispatch({
      type: 'signInRecord/setUpdateStatus',
      payload: {
        params: {
          id: val.id,
          status: val.status == 0 ? 1 : 0
        }
      }
    }).then(res => {
      if (res.code == 0) {
        this.getLists();
      }
    })
  }

  setStatus = (status) => {
    const { dispatch } = this.props
    if (this.state.selectedRowKeys == '') return;

    dispatch({
      type: 'signInRecord/setUpdateStatus',
      payload: {
        params: {
          id: this.state.selectedRowKeys.join(','),
          status
        }
      }
    }).then(res => {
      if (res.code == 0) {
        this.getLists();
      }
    })
  }
  
  render() {
    const {
      signInRecord: { list, page, unColumn },
      loading,
    } = this.props;
    const { selectedRows, account, selectedRowKeys } = this.state;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys, selectedRows)
        this.setState({
          selectedRowKeys,
        })
      },
      // getCheckboxProps: record => ({
      //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
      //   name: record.name,
      // }),
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows)
      },
      // onSelect: (record, selected, selectedRows, nativeEvent) => {
      //   console.log(record, selected, selectedRows, nativeEvent)
      // }
    };
    let columns = [
      {
        title: <div style={{paddingLeft: 60}}>姓名</div>,
        dataIndex: 'name',
        width: 150,
        key: 'name'
      },
      {
        title: <div style={{paddingLeft: 40}}>手机号</div>,
        dataIndex: 'phone',
        width: 200,
        key: 'phone'
      },
      {
        title: <div style={{paddingLeft: 40}}>公司</div>,
        dataIndex: 'enterprise',
        width: 150,
        key: 'enterprise'
      },
      {
        title: <div style={{paddingLeft: 40}}>机器点位</div>,
        dataIndex: 'localeName',
        width: 200,
        key: 'localeName'
      },
      {
        title: <div style={{paddingLeft: 30}}>机器编号</div>,
        dataIndex: 'machineCode',
        width: 200,
        key: 'machineCode'
      },
      {
        title: <div style={{paddingLeft: 30}}>打卡时间</div>,
        dataIndex: 'createTime',
        width: 250,
        key: 'createTime'
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        key: 'status',
        render: (val, record) => <span>{ val == 0 && val != null ? '有效' : '-' }</span>
      },
      {
        title: '操作', 
        key: 'action', 
        render: (val, record) => {
        return (
          // <a onClick={() => {
          //   this.handleTableClick(val, record)
          // }}>{
          //   val.status == 0 ? '标为无效' : '标为有效'
          // }</a>
          <Popconfirm title={`确定要${val.status == 0 ? '标为无效' : '标为有效'}`} onConfirm={() => this.handleTableClick(val, record)} okText="Yes" cancelText="No">
              <a>
                {val.status == 0 ? '标为无效' : '标为有效'}
              </a>
            </Popconfirm>
        )}
      }
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
    const width = 100/(columns.length)
    for (let i = 0; i < columns.length; i++) {
      columns[i].width = width + '%'
    }
    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
          <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
        </Card>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListOperator">
              <Button icon="export" type="primary"
                      onClick={() => this.handleModalVisible(true)}
                      style={{ display: !account.excell ? 'none' : ''}}
              >导出</Button>
            </div>
          {/*<div className={styles.tableList}>*/}
            {/*<div className={styles.tableListOperator}>*/}
              {/*/!*<a href="" target="_blank" >*!/*/}
                {/*<Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>*/}
                  {/*导出*/}
                {/*</Button>*/}
              {/*/!*</a>*!/*/}
              {/*/!**!/*/}
            {/*</div>*/}
            <div className={styles.standardTable} style={{ display: !account.list ? 'none' : ''}}>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={list}
                page={page}
                columns={columns}
                selectedPointRows={rowSelection}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                scrollX={700}
                scrollY={(document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 100 + 120)}
                showFooter={() => {
                  return (
                    <div style={{paddingLeft: 50}}>
                      {/* <Checkbox onChange={() => {
                        
                      }}>全选（已选0条）</Checkbox> */}
                      <span>{`已选 ${selectedRowKeys.length} 条`}</span>
                      <a onClick={() => { this.setStatus(0)}} style={{marginLeft: 20}}>设为有效</a>
                      <a onClick={() => { this.setStatus(1)}} style={{marginLeft: 20}}>设为无效</a>
                    </div>
                  )
                }}
              />
            </div>

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
