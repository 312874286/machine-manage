import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Button, Row, Col, Input } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ department }) => ({ department }))
export default class Department extends PureComponent {
  state = {
    userName: '',
  }
  componentDidMount = () => {
    this.getSystemDeptList();
  }
  onToAuthorization = (record) => {
    console.log(record, this);
  }
  onFindData = (e) => {
    this.getSystemDeptList();
    console.log(this, e, this.state.userName);
  }
  getSystemDeptList = () => {
    this.props.dispatch({
      type: 'department/getSystemDeptList',
      payload: {
        restParams: {
          keyword: this.state.userName,
        },
      },
    });
  }
  render() {
    const { department: { list, page } } = this.props;
    // console.log(111,list,page);
    const columns = [
      {
        title: '部门名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '上级部门',
        dataIndex: 'mobile',
        key: 'mobile',
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
              <Input placeholder="角色姓名" onChange={this.onChange} />
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
