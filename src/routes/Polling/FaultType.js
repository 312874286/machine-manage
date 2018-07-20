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
@connect(({ common, loading, faultType }) => ({
  common,
  faultType,
  loading: loading.models.faultType,
}))
@Form.create()
export default class faultType extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    pageNo: 1,
    keyword: '',
    code: '',
  };
  componentDidMount() {
    this.getLists();
  }
  // 获取列表
  getLists = () => {
    this.props.dispatch({
      type: 'faultType/getFaultTypeList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          keyword: this.state.keyword,
          code: this.state.code,
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
  // 搜索
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let localCode = ''
      if (fieldsValue.provinceCityAreaTrade) {
        if (fieldsValue.provinceCityAreaTrade.length > 0) {
          localCode = fieldsValue.provinceCityAreaTrade[fieldsValue.provinceCityAreaTrade.length - 1];
        }
      }
      this.setState({
        pageNo: 1,
        keyword: fieldsValue.keyword ? fieldsValue.keyword : '',
        code: localCode,
      }, () => {
        this.getLists();
      });
    });
  };
  handleModalVisible = () => {
    console.log('新增');
  }
  // 新增modal确认事件 结束
  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={9} sm={24}>
            <FormItem label="关键字">
              {getFieldDecorator('keyword')(<Input placeholder="请输入故障类型名称、解决方案、添加人" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span style={{ float: 'right' }}>
               <FormItem>
                  <Button className={styles.serach} style={{ marginLeft: 8, background: 'rgba(245, 75, 48, 1)' }} type="primary" htmlType="submit">
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
      faultType: { list, page },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    const columns = [
      {
        title: '故障类型名称',
        dataIndex: 'name',
      },
      {
        title: '故障解决方案',
        dataIndex: 'phone',
      },
      {
        title: '添加时间',
        dataIndex: 'enterprise',
      },
      {
        title: '添加人',
        dataIndex: 'localeName',
      },
      {
        fixed: 'right',
        width: 150,
        title: '操作',
        render: (text, item) => (
          <Fragment>
            <a onClick={() => this.handleEditClick(item)}>编辑</a>
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
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新增
              </Button>
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
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
