import React, { PureComponent, Fragment } from 'react';
import { Table, Alert, Divider, Popconfirm } from 'antd';
import styles from './orderTable.less';
import { orderStatusData, orderTypeData } from '../../common/config/order'

// const status = [{ id: 0, name: '停用' }, { id: 1, name: '正常' }];
export default class orderTable extends PureComponent {
  state = {};

  handleTableChange = (pagination, filters, sorter) => {
    this.props.handleTableChange(pagination, filters, sorter);
  }

  render() {
    const {
      data,
      page,
      loading,
      onLogClick,
    } = this.props;
    const columns = [
      {
        title: '订单号',
        dataIndex: 'orderNum',
      },
      {
        title: '订单类型',
        dataIndex: 'orderType',
        render: (value) => {
          const typeItem = orderTypeData.find(item => item.id === value);
          return typeItem && typeItem.name || '';
        },
      },
      {
        title: '医生姓名',
        dataIndex: 'doctorName',
      },
      {
        title: '家长姓名',
        dataIndex: 'name',
      },
      {
        title: '售价',
        dataIndex: 'orderPrice',
      },
      {
        title: '订单状态',
        dataIndex: 'orderStatus',
        render: (value) => {
          const statusItem = orderStatusData.find(item => item.id === value);
          return statusItem && statusItem.name || '';
        },
      },
      {
        title: '支付时间',
        dataIndex: 'payTime',
      },
      {
        title: '操作',
        render: (text, item) => (
          <Fragment>
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

