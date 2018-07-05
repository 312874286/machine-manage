import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Button } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ department }) => ({ department }))
export default class Department extends PureComponent {
  state = {
  }
  componentDidMount = () => {
    this.getAccountSystemUserList();
  }
  onToAuthorization = (record) => {
    console.log(record, this);
  }
  getAccountSystemUserList = () => {
    this.props.dispatch({
      type: 'department/getAccountSystemUserList',
      payload: {
        restParams: {
          keyword: '',
        },
      },
    });
  }
  render() {
    const { department: { list, page } } = this.props;
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
