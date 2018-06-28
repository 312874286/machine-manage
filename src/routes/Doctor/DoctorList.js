import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Table, Button, Divider, Popconfirm, message, Alert } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './DoctorList.less';
import LogModal from '../../components/LogModal';

const FormItem = Form.Item;
const { Option } = Select;
function parseConfig(data) {
  const result = { ...this.state.config, ...data };
  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      if (!result[key]) {
        result[key] = [];
      }
    }
  }
  if (result.skills.length > 0) {
    result.skills = result.skills.map((item) => {
      return {
        label: item.firstSkill,
        value: item.id,
      };
    });
  }
  result.currentCitys = [];
  return result;
}
@connect(({ doctorConfigManage, loading, log }) => ({
  doctorConfigManage,
  log,
  loading: loading.models.list,
}))
@Form.create()
export default class DoctorList extends PureComponent {
  state = {
    list: {
      datas: [],
      page: {
        total: 0,
        pageSize: 20,
        current: 1,
      },
    },
    config: {
      cityObj: [],
      hospitalType: [],
      education: [],
      hospitalLv: [],
      doctorQualification: [],
      doctorSpecialty: [],
      doctorTitle: [],
      doctorIdentity: [],
      skills: [],
      all: [],
      currentCitys: [],
      deptVos: [],
    },
    logModalVisible: false,
    logModalLoading: false,
    logId: '',
    logModalPageNo: 1,
  }

  componentDidMount() {
    this.getConfig();
    this.getList();
  }

  getList = (pageNo) => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const restParams = {
        pageNo: pageNo || 1,
      };
      for (const key in fieldsValue) {
        if (Object.prototype.hasOwnProperty.call(fieldsValue, key)) {
          if (key === 'skillS') {
            if (fieldsValue[key].length > 0) {
              restParams[key] = fieldsValue[key].join(',');
            }
          } else {
            restParams[key] = fieldsValue[key] !== undefined ? fieldsValue[key] : '';
          }
        }
      }
      console.log(fieldsValue, restParams);
      dispatch({
        type: 'doctorList/list',
        payload: {
          restParams: {
            queryString: restParams,
          },
        },
      }).then((resp) => {
        if (resp && Object.prototype.hasOwnProperty.call(resp, 'code') && resp.code === 0) {
          this.setState({
            list: {
              datas: resp.data,
              page: {
                total: resp.page.totalCount,
                pageSize: resp.page.pageSize,
                current: resp.page.pageNo,
              },
            },
          });
        }
      });
    });
  }

  getConfig = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'doctorList/config',
    }).then((resp) => {
      if (resp && resp.code === 0) {
        this.setState({
          config: parseConfig.bind(this)(resp.data),
        });
      }
    });
  }

  refreshList = () => {
    const { list: { page: { current } } } = this.state;
    this.getList(current);
  }

  handleFormReset = () => {
    this.props.form.resetFields();
    this.getList();
  }

  handleSearch = (e) => {
    e && e.preventDefault();
    this.getList();
  }

  handleDoctorStatusChange = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'doctorList/status',
      payload: {
        restParams: {
          doctorId: data.id,
          status: data.status === 1 ? 0 : 1,
        },
      },
    }).then((resp) => {
      if (resp && resp.code === 0) {
        message.success('操作成功');
      } else {
        message.error(`操作失败：${resp.msg}`);
      }
      this.getList();
    });
  }

  handleTableChange = (pagination) => {
    this.getList(pagination.current);
  }

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { config: { doctorIdentity, deptVos, skills } } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" >
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="认证状态">
              {getFieldDecorator('status', { initialValue: '' })(
                <Select placeholder="请选择认证状态" style={{ width: '100%' }}>
                  <Option value="1">认证医生</Option>
                  <Option value="0">账户停用</Option>
                  <Option value="">全部</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="医生身份">
              {getFieldDecorator('identity', { initialValue: '' })(
                <Select placeholder="请选择身份" style={{ width: '100%' }}>
                  {
                    doctorIdentity.filter(item => item.status === 1).map((item) => {
                      return <Option key={item.id}>{item.desc}</Option>;
                    })
                  }
                  <Option value="">全部</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="医生科室">
              {getFieldDecorator('departmentId', { initialValue: '' })(
                <Select placeholder="请选择科室" style={{ width: '100%' }}>
                  {
                    deptVos.filter(item => item.status === 1).map((item) => {
                      return <Option key={item.id}>{item.name}</Option>;
                    })
                  }
                  <Option value="">全部</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="医生查询">
              {getFieldDecorator('keyword', { initiaValue: '' })(
                <Input placeholder="请输入医生姓名/医生ID" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="医生技能">
              {getFieldDecorator('skillS', { initialValue: [] })(
                <Select placeholder="请选择医生技能" mode="multiple" style={{ width: '100%' }} allowClear>
                  {
                    skills.map((item) => {
                      return <Option key={item.value}>{item.label}</Option>;
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <div className={styles.queryCol}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  renderTable(datas, page) {
    const paginationProps = {
      showTotal: (total) => {
        return `共${total}条数据  每页${page.pageSize}条`;
      },
      ...page,
    };
    const columns = [
      {
        title: '医生姓名',
        dataIndex: 'doctorName',
      },
      {
        title: '医生ID',
        dataIndex: 'id',
      },
      {
        title: '身份',
        dataIndex: 'identity',
      },
      {
        title: '科室',
        dataIndex: 'departmentName',
      },
      {
        title: '认证状态',
        dataIndex: 'status',
        render: (text, record) => {
          return record.status === 1 ? '启用' : '停用';
        },
      },
      {
        title: '操作',
        width: 160,
        render: (text, record) => {
          return (
            <Fragment>
              <Link to={`/doctor/detail/${record.id}`}>
                详情
              </Link>
              <Divider type="vertical" />
              <Popconfirm title={record.status === 1 ? `确认停用"${record.doctorName}"？` : `确认启用"${record.doctorName}"？`} onConfirm={() => this.handleDoctorStatusChange(record)}>
                {record.status === 1 ? <a style={{ color: 'red' }}>停用</a> : <a style={{ color: 'green' }}>启用</a>}
              </Popconfirm>
              <Divider type="vertical" />
              <a onClick={() => this.handleLogClick(record)}>日志</a>
            </Fragment>
          );
        },
      }];
    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={(
              <div>
                查询结果：共{paginationProps.total}条数据&nbsp;&nbsp;
                每页{paginationProps.pageSize}条
              </div>
            )}
            type="info"
            showIcon
          />
        </div>
        <Table
          rowKey={record => record.id}
          dataSource={datas}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }

  // 日志相关
  getLogList = () => {
    this.props.dispatch({
      type: 'log/getLogList',
      payload: {
        restParams: {
          code: this.state.logId,
          pageNo: this.state.logModalPageNo,
          type: 10202,
        },
      },
    }).then(() => {
      this.setState({
        logModalLoading: false,
      });
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

  render() {
    const { list } = this.state;
    const { log: { logList, logPage } } = this.props;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Link to="/doctor/detail">
                <Button icon="plus" type="primary">
                  创建医生档案
                </Button>
              </Link>
            </div>
            {this.renderTable(list.datas, list.page)}
          </div>
        </Card>
        <LogModal
          data={logList}
          page={logPage}
          loding={this.state.logModalLoading}
          logVisible={this.state.logModalVisible}
          logHandleCancel={this.logModalHandleCancel}
          logModalhandleTableChange={this.logModalhandleTableChange}
        />
      </PageHeaderLayout >
    );
  }
}
