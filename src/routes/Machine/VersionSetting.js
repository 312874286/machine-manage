import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Table,
  Button,
  Tabs,
  message,
  Row,
  Col,
  Card,
  Input
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './VersionSetting.less'
import {getAccountMenus} from "../../utils/authority";
import { InnoMsg } from  "../../utils/utils"
import {Tab} from "../../components/Login";

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const tabNameLists = [
  {key: 1, name: '72App'},
  {key: 2, name: '72数据中心'},
  {key: 3, name: '72监控App'},
  {key: 4, name: '72安装器'},
  {key: 5, name: '管理App'},
  {key: 6, name: '蓝牙接收器'},
  {key: 7, name: '72上传'},
  {key: 8, name: '72守护'},
  {key: 9, name: '壶中界'},
  {key: 10, name:'新版壶中界'}
  ]
@connect(({ common, loading, homePageSetting }) => ({
  common,
  homePageSetting,
  loading: loading.models.homePageSetting,
}))
@Form.create()
export default class versionSetting extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    id: '',
    editModalConfirmLoading: false,
    pageNo: 1,
    keyword: '',
    account: {},
    TabPaneKey: "3",
  };
  componentDidMount() {
    this.getLists();
    this.getAccountMenus(getAccountMenus())
  }
  getAccountMenus = (setAccountMenusList) => {
    let account = setAccountMenusList.filter((item) => item.path === 'check')
    var obj = {}
    if (account[0]) {
      account = account[0].children.filter((item) => item.path === 'fault')
      if (account[0].children) {
        account[0].children.forEach((item, e) => {
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
      type: 'homePageSetting/findExceptionMachine',
      payload: {
        restParams: {
          type: 1
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

  callback = (key) => {
    console.log(key);
  }
  add = () => {
    message.config({
      top: 100,
      duration: 2,
      maxCount: 1,
    })
    message.error('111111')
  }
  // 新增modal确认事件 结束
  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={9} sm={24}>
            <FormItem>
              {getFieldDecorator('keyword')(<Input placeholder="请输入版本号、版本、更新内容搜索" />)}
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
      homePageSetting: { ExceptionMachineList },
      loading,
    } = this.props;
    const { account, TabPaneKey } = this.state
    const columns = [
      {
        title: 'App名称',
        dataIndex: 'machineCode1',
        width: '10%',
      },
      {
        title: '版本',
        width: '10%',
        dataIndex: 'local1',
      },
      {
        title: '版本号',
        dataIndex: 'offlineTime1',
        width: '10%',
      },
      {
        title: '升级路径',
        dataIndex: 'machineCode2',
        width: '30%',
      },
      {
        title: '更新内容',
        width: '20%',
        dataIndex: 'local2',
      },
      {
        title: '创建人',
        dataIndex: 'offlineTime2',
        width: '10%',
      },
      {
        title: '创建时间',
        dataIndex: 'offlineTime',
        width: '10%',
      },
    ];
    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
          <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
        </Card>
        <Card bordered={false}>
          <Button icon="arrow-left" type="primary" onClick={() => this.add()}>
            新增
          </Button>
          <Tabs onChange={this.callback} type="card" defaultActiveKey={TabPaneKey}>
            {tabNameLists.map((item) => {
              return (
                <TabPane key={item.key} tab={item.name}>{item.name}</TabPane>
              );
            })}
          </Tabs>
          <div className={styles.tableList}>
            <Table
              loading={loading}
              rowKey={record => record.id}
              dataSource={ExceptionMachineList}
              columns={columns}
              pagination={false}
              onChange={this.handleTableChange}
              scroll={{ x: scrollX ? scrollX : 1050, y: scrollY ? scrollY : (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 34)}}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
