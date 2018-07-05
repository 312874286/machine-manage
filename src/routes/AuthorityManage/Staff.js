import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Col, Row, Button, Input } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ staff }) => ({ staff }))
export default class Staff extends PureComponent {
  state = {
    userName: '',
  }
  componentDidMount = () => {
    this.getSystemUserList();
  }
  onChange = (e) => {
    this.setState({ userName: e.target.value });
    // console.log(111,e.target.value,this);
  }
  onFindData = (e) => {
    this.getSystemUserList();
    console.log(this, e, this.state.userName);
  }
  onToAuthorization = (record) => {
    console.log(record, this);
  }
  getSystemUserList = () => {
    this.props.dispatch({
      type: 'staff/getSystemUserList',
      payload: {
        restParams: {
          keyword: this.state.userName,
        },
      },
    });
  }
  handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter);
  }
  render() {
    const { staff: { list, page } } = this.props;
    // console.log(111,list,page);
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '员工手机',
        dataIndex: 'mobile',
        key: 'mobile',
      }, {
        title: '邮箱',
        dataIndex: 'orgEmail',
        key: 'orgEmail',
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
      }, {
        title: '部门名称',
        dataIndex: 'deptName',
        key: 'deptName',
      }, {
        title: '授权',
        dataIndex: '',
        key: '',
        render: (record) => {
          return <Button type="primary" onClick={this.onToAuthorization.bind(this, record)}>授权</Button>;
        },
      },
    ];
    // const { userName } = this.state;
    const paginationProps = {
      showTotal: (total) => {
        return `共${total}条数据  每页${page.pageSize}条`;
      },
      ...page,
    };
    return (
      <PageHeaderLayout>
        <Card>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={9} sm={24}>
              <Input placeholder="姓名" onChange={this.onChange} />
            </Col>
            <Col md={6} sm={24}>
              <Button style={{ marginLeft: 8 }} type="primary" onClick={this.onFindData.bind(this)}>查询</Button>
            </Col>
          </Row>
        </Card>
        <Card>
          <Table
            dataSource={list}
            columns={columns}
            pagination={paginationProps}
            onChange={this.handleTableChange}
            rowKey="id"
            bordered
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
