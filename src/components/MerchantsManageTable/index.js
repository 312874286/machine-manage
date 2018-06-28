import React, { PureComponent, Fragment } from 'react';
import { Table, Alert, Divider, Popconfirm } from 'antd';
import styles from './index.less';

// const status = [{ id: 0, name: '停用' }, { id: 1, name: '正常' }];
class MerchantsManageTable extends PureComponent {
  state = {};

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  render() {
    const { data: { datas, pagination }, loading, onDetailClick, onDisableClick, onLogClick } = this.props;

    const columns = [
      {
        title: '商户名称',
        dataIndex: 'merchantName',
      },
      {
        title: '机构简称',
        dataIndex: 'simpleName',
      },
      {
        title: '机构名称',
        dataIndex: 'organName',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
      },
      {
        title: '商户版本',
        dataIndex: 'merchantVersion',
      },
      {
        title: '有效期',
        dataIndex: 'expireTime',
      },
      {
        title: '操作',
        render: (text, data) => (
          <Fragment>
            <a onClick={() => onDetailClick(data)}>详情</a>
            <Divider type="vertical" />
            <Popconfirm title="确认禁用该商家？" onConfirm={() => onDisableClick(data)}>
              <a>禁用</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a onClick={() => onLogClick(data)}>日志</a>
          </Fragment>
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
          rowKey={record => record.merchantId}
          dataSource={datas}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default MerchantsManageTable;
