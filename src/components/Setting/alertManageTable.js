import React, { PureComponent, Fragment } from 'react';
import { Table, Alert, Divider, Popconfirm } from 'antd';
import styles from './alertManageTable.less';

class alertManageTable extends PureComponent {
  state = {};

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  render() {
    const {
      data: { datas, pagination },
      loading, onDetailClick, onDisableClick, onLogClick,
    } = this.props;

    const columns = [
      {
        title: '报警名称',
        dataIndex: 'alarmName',
      },
      {
        title: '报警接收人',
        dataIndex: 'alarmPerson',
      },
      {
        title: '修改时间',
        width: 170,
        dataIndex: 'updateTime',
      },
      {
        title: '操作人',
        width: 160,
        dataIndex: 'operator',
      },
      {
        title: '操作',
        width: 190,
        fixed: 'right',
        render: (text, data) => (
          <Fragment>
            <a onClick={() => onDetailClick(data)}>详情</a>
            <Divider type="vertical" />
            <Popconfirm title={data.status === 1 ? `确认关闭"${data.alarmName}"？` : `确认开启"${data.alarmName}"？`} onConfirm={() => onDisableClick(data)}>
              {data.status === 1 ? <a style={{ color: 'red' }}>关闭报警</a> : <a style={{ color: 'green' }}>开启报警</a>}
            </Popconfirm>
            <Divider type="vertical" />
            <a onClick={() => onLogClick(data)}>日志</a>
          </Fragment >
        ),
      },
    ];

    const paginationProps = {
      showTotal: (total) => {
        return `共${total}条数据  每页${pagination.pageSize}条`;
      },
      ...pagination,
    };

    return (
      <div className={styles.standardTable} >
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
          dataSource={datas}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default alertManageTable;
