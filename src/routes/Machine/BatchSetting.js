import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Table,
  Button,
  Divider,
  message,
  Row,
  Col,
  Input
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './BatchSetting.less';
import BatchTableField from '../../components/Machine/batchTableSetting';
import {getAccountMenus} from "../../utils/authority";

const FormItem = Form.Item;
@connect(({ common, loading, batchSetting }) => ({
  common,
  batchSetting,
  loading: loading.models.batchSetting,
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
    account: {}
  };
  componentDidMount() {
    this.getLists();
    // this.getAccountMenus(getAccountMenus())
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
      type: 'batchSetting/batchList',
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
      batchSetting: { list },
      loading,
    } = this.props;
    const { account } = this.state
    const columns = [
      {
        title: '批次名称',
        dataIndex: 'batchName',
        width: '20%',
      },
      {
        title: '批次编号',
        width: '20%',
        dataIndex: 'id',
      },
      {
        title: '创建人',
        dataIndex: 'createUser',
        width: '20%',
      },
      {
        title: '创建时间',
        dataIndex: 'updateTime',
      },
      {
        fixed: 'right',
        width: 150,
        title: '操作',
        render: () => (
          <Fragment>
            <a
              onClick={() => this.props.history.push({pathname: '/check/fault', query: {flag: 'openFault'}})}>
              查看
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => this.props.history.push({pathname: '/check/fault', query: {flag: 'openFault'}})}>
              编辑
            </a>
          </Fragment>
        ),
      },
    ];
    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
          <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
        </Card>
        <Card bordered={false}>
          <Button icon="arrow-left" type="primary" onClick={() => history.go(-1)}>
            新增
          </Button>
          <div className={styles.tableList}>
            <Table
              loading={loading}
              rowKey={record => record.id}
              dataSource={list}
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
