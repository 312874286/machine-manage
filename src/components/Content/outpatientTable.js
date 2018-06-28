import React, { PureComponent, Fragment } from 'react';
import { Table, Alert, Divider, Popconfirm } from 'antd';
import styles from './outpatientTable.less';
import { outpatientOrderStatusData, orderTypeData } from '../../common/config/order'

// const status = [{ id: 0, name: '停用' }, { id: 1, name: '正常' }];
export default class outpatientTable extends PureComponent {
  state = {};

  handleTableChange = (pagination, filters, sorter) => {
    this.props.handleTableChange(pagination, filters, sorter);
  }

  render() {
    const {
      data,
      page,
      loading,
      onDetailClick,
      onLogClick,
      onCancelClick,
    } = this.props;
    const columns = [
      {
        title: '订单号',
        dataIndex: 'orderNum',
      },
      {
        title: '宝宝姓名',
        dataIndex: 'performerName',
      },
      {
        title: '医生姓名',
        dataIndex: 'doctorName',
      },
      {
        title: '门诊状态',
        dataIndex: 'businessStatus',
        render: (value) => {
          const statusItem = outpatientOrderStatusData.find(item => item.id === value);
          return statusItem && statusItem.name || '';
        },
      },
      {
        title: '用户下单时间',
        dataIndex: 'orderTime',
      },
      {
        title: '门诊类型',
        dataIndex: 'outpatientType',
      },
      {
        title: '操作',
        render: (text, item) => (
          <Fragment>
            <a onClick={() => onDetailClick(item)}>详情</a>
            <Divider type="vertical" />
            <a onClick={() => onLogClick(item)}>日志</a>
            {
              (item.businessStatus !== 1 && item.businessStatus !== 0) && (
                <span>
                  <Divider type="vertical" />
                  <a onClick={() => onCancelClick(item)}>取消</a>
                </span>)
            }

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

