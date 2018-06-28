import React, { PureComponent, Fragment } from 'react';
import { Table, Alert, Divider, Popconfirm } from 'antd';
import styles from './accountTable.less';

// const status = [{ id: 0, name: '停用' }, { id: 1, name: '正常' }];
export default class accountTable extends PureComponent {
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
      onDisableClick,
      onAuthorizeClick,
    } = this.props;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'userName',
      },
      {
        title: '部门',
        dataIndex: 'userDepartment',
      },
      {
        title: '角色',
        dataIndex: 'roles',
      },
      {
        title: '手机',
        dataIndex: 'userMoblie',
      },
      {
        title: '邮箱',
        dataIndex: 'userEmail',
      },
      {
        title: '职位',
        dataIndex: 'userTitle',
      },
      {
        title: '办公地点',
        dataIndex: 'userOfficeAddress',
      },
      {
        title: '操作',
        render: (text, item) => (
          <Fragment>
            <a onClick={() => onEditClick(item)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => onAuthorizeClick(item)}>授权</a>
            <Divider type="vertical" />
            <Popconfirm
              title={
                item.merchantAdmin === 0 ?
                  `确认启用"${item.userName}"账户？` :
                  `确认停用"${item.userName}"账户？`}
              onConfirm={() => onDisableClick(item)}
            >
              {item.merchantAdmin === 0 ?
                <a style={{ color: 'green' }}>启用</a> :
                <a style={{ color: 'red' }}>禁用</a>
              }
            </Popconfirm>

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
          rowKey={record => record.userId}
          dataSource={data}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

