import React, { PureComponent, Fragment } from 'react';
import { Table, Alert, Divider, Popconfirm } from 'antd';
import styles from './priceManageTable.less';

// const status = [{ id: 0, name: '停用' }, { id: 1, name: '正常' }];
export default class priceManageTable extends PureComponent {
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
        title: '医生姓名',
        dataIndex: 'doctorName',
      },
      {
        title: '医生ID',
        dataIndex: 'doctorId',
      },
      {
        title: '分成比例',
        dataIndex: 'proportion',
      },
      {
        title: '分成比例期限',
        dataIndex: 'deadline',
      },
      {
        title: '最近操作时间',
        dataIndex: 'updateTime',
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

