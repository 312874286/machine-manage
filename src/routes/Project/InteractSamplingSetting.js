import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Select,
  Input,
  DatePicker,
} from 'antd';
import StandardTable from '../../components/StandardTable/index';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './InteractSamplingSetting.less';
import {getAccountMenus} from "../../utils/authority";


const FormItem = Form.Item;
const { Option } = Select;
const status = ['未提交', '未开始', '进行中', '已结束', '已超时']
const statusOption = [{id: 0, name: '未提交'}, {id: 1, name: '未开始'}, {id: 2, name: '进行中'}, {id: 3, name: '已结束'}, {id: 4, name: '已超时'}]
const sortOption = [{id: 0, name: '默认排序'}, {id: 1, name: '按发放率倒序'}, {id: 2, name: '按发放率正序'}, {id: 3, name: '按持续时长倒序'}, {id: 4, name: '按持续时长正序'}]

@connect(({ common, loading, interactSamplingSetting }) => ({
  common,
  interactSamplingSetting,
  loading: loading.models.interactSamplingSetting,
}))
@Form.create()
export default class areaSettingList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    pageNo: 1,
    status: '',
    account: {},
    keyword: ''
  };
  componentDidMount() {
    this.getLists();
    // this.getAccountMenus(getAccountMenus())
  }
  getAccountMenus = (setAccountMenusList) => {
    if (setAccountMenusList) {
      const pointSettingMenu = setAccountMenusList.filter((item) => item.path === 'project')[0]
        .children.filter((item) => item.path === 'sampling-setting')
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
      type: 'interactSamplingSetting/interactLists',
      payload: {
        restParams: {
          status: this.state.status,
          pageNo: this.state.pageNo,
          keyword: this.state.keyword
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
        status: this.state.status,
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
          <Col md={9} sm={24}>
            <FormItem label="互派状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择">
                  {statusOption.map((item) => {
                    return (
                      <Option value={item.id} key={item.id}>{item.name}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={15} sm={24}>
            <span>
              <FormItem>
                {getFieldDecorator('keyword')(
                  <Input placeholder="请输入互派名称，互派游戏，负责人，机器编号，机器点位，商品编号，商品名称，商户信息等" />
                )}
              </FormItem>
            </span>
          </Col>
        </Row>
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="创建时间">
              {getFieldDecorator('creatTime')(
                <DatePicker placeholder="请选择创建时间" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="排序">
              {getFieldDecorator('status')(
                <Select placeholder="请选择排序方式">
                  {sortOption.map((item) => {
                    return (
                      <Option value={item.id} key={item.id}>{item.name}</Option>
                    );
                  })}
                </Select>
              )}
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
      interactSamplingSetting: { list, page, unColumn },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    let columns = [
      {
        title: '互派名称',
        width: '10%',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '互动游戏',
        dataIndex: 'gameName',
        key: 'gameName',
        width: '10%',
      },
      {
        title: '互派机器数',
        dataIndex: 'merchantNum',
        key: 'merchantNum',
        width: '10%',
      },
      {
        title: '互派商品数',
        width: '10%',
        dataIndex: 'goodsNum',
        key: 'goodsNum',
      },
      {
        title: '互派持续时长',
        dataIndex: 'realDay',
        key: 'realDay',
        render: (text, item) => (
          <Fragment>
            <span>{item.realDay}/{item.day}</span>
          </Fragment>
        ),
        width: '10%',
      },
      {
        title: '发放率',
        dataIndex: 'realNum',
        key: 'realNum',
        render: (text, item) => (
          <Fragment>
            <span>{item.realNum}/{item.number}</span>
          </Fragment>
        ),
        width: '10%',
      },
      {
        title: '负责人 创建时间',
        dataIndex: 'managerCreateTime',
        key: 'managerCreateTime',
        render: (text, item) => (
          <Fragment>
            <span>{item.manager}{item.createTime}</span>
          </Fragment>
        ),
        width: '20%',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render (val) {
          if (val) {
            return <span>{status[val]}</span>
          }
        }
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
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary"
                      onClick={() => this.props.history.push({pathname: '/project/addBasicInteractSampling', query: {statusValue: 3}})}>
                新建
              </Button>
            </div>
            <div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={list}
                page={page}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                scrollX={1200}
              />
            </div>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
