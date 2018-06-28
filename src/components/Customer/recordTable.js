import React, { PureComponent, Fragment } from 'react';
import { Table, Alert, Divider, Popconfirm } from 'antd';
import styles from './usersTable.less';

// const status = [{ id: 0, name: '停用' }, { id: 1, name: '正常' }];
export default class usersTable extends PureComponent {
  state = {};

  handleTableChange = (pagination, filters, sorter) => {
    this.props.handleTableChange(pagination, filters, sorter);
  }

  render() {
    const {
      data,
      page,
      loading,
      onEditClick,
      onLogClick,
    } = this.props;
    const columns = [
      {
        title: '档案ID',
        dataIndex: 'id',
      },
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '姓名拼音',
        dataIndex: 'userName',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        render: (text) => {
          return text === 1 ? '男' : '女';
        },
      },
      {
        title: '出生日期',
        dataIndex: 'birthday',
      },
      {
        title: '建档时间',
        dataIndex: 'createTime',
      },
      {
        title: '操作',
        render: (text, item) => (
          <Fragment>
            <a onClick={() => onEditClick(item)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => onLogClick(item)}>日志</a>

          </Fragment>
        ),
      },
    ];

    const paginationProps = {
      showTotal: (total) => {
        return `共${total}条数据  每页${page.pageSize}条`;
      },
      ...page,
    };

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
          loading={loading}
          rowKey={record => record.id}
          dataSource={data}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

