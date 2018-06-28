import React, { PureComponent, Fragment } from 'react';
import { Table, Alert, Divider, Popconfirm } from 'antd';
import styles from './outpatientTable.less';
import { auditStatusData, outpatientOrderStatusData, orderTypeData } from '../../common/config/order'

// const status = [{ id: 0, name: '停用' }, { id: 1, name: '正常' }];
export default class SuggestTable extends PureComponent {
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
    } = this.props;
    const columns = [
      {
        title: '订单号',
        dataIndex: 'orderNum',
      },
      {
        title: '提交时间',
        dataIndex: 'submitTime',
      },
      {
        title: '医生姓名',
        dataIndex: 'doctorName',
      },
      {
        title: '审核状态',
        dataIndex: 'auditStatus',
        render: (value) => {
          const statusItem = auditStatusData.find(item => item.id === value);
          return statusItem && statusItem.name || '';
        },
      },
      {
        title: '审核时间',
        dataIndex: 'auditTime',
      },
      {
        title: '审核结果',
        dataIndex: 'auditInfo',
      },
      {
        title: '审核人',
        dataIndex: 'auditor',
      },
      {
        title: '操作',
        render: (text, item) => (
          <Fragment>
            <a onClick={() => onDetailClick(item)}>详情</a>
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

