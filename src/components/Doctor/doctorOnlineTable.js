import React, { PureComponent, Fragment } from 'react';
import { Table, Alert, Divider, Popconfirm } from 'antd';
import styles from './doctorOnlineTable.less';

export default class doctorOnlineTable extends PureComponent {
  state = {};

  handleTableChange = (pagination, filters, sorter) => {
    this.props.handleTableChange(pagination, filters, sorter);
  }

  render() {
    const {
      data,
      page,
      loading,
      onDelClick,
      onUnlock,
    } = this.props;
    const columns = [
      {
        title: '医生ID',
        dataIndex: 'doctorId',
      },
      {
        title: '医生姓名',
        dataIndex: 'doctorName',
      },
      {
        title: '在线状态',
        dataIndex: 'onlineStatus',
      },
      {
        title: '锁定状态',
        dataIndex: 'acceptType',
      },
      {
        title: '出诊类型',
        dataIndex: 'type',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <Popconfirm title="确认下线？" onConfirm={() => onDelClick(record)}>
              <a style={{ color: '#FF0000' }}>下线</a>
            </Popconfirm>
            {(record.acceptType === '已锁定' && (
              <span>
                <Divider type="vertical" />
                <Popconfirm title="确认解锁？" onConfirm={() => onUnlock(record)}>
                  <a style={{ color: 'orange' }}>解锁</a>
                </Popconfirm>
              </span>
            ))}
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
          rowKey={record => record.doctorId}
          dataSource={data}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

