import React, { PureComponent, Fragment } from 'react';
import { Table, Alert, Divider, Popconfirm } from 'antd';
import styles from './compositingTable.less';

// const status = [{ id: 0, name: '停用' }, { id: 1, name: '正常' }];
export default class CompositingTable extends PureComponent {
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
      onDetailClick,
      onDelClick,
    } = this.props;
    const columns = [
      {
        title: '组合ID',
        dataIndex: 'code',
        width: 165,
      },
      {
        title: '组合名称',
        dataIndex: 'name',
        width: 130,
      },
      {
        title: '可售卖医生组',
        dataIndex: 'doctorGroupName',
      },
      {
        title: '组合价格',
        dataIndex: 'price',
        render: (value) => {
          return value && value.toFixed(2);
        },
      },
      {
        title: '折后总价',
        dataIndex: 'totalPrice',
        render: (value) => {
          return value && value.toFixed(2);
        },
      },
      {
        title: '可售卖状态',
        dataIndex: 'sellState',
        render: (value) => {
          return value === 1 ? '是' : '否';
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
      },
      {
        title: '最近修改时间',
        dataIndex: 'updateTime',
      },
      {
        title: '操作',
        render: (text, item) => (
          <Fragment>
            <a onClick={() => onDetailClick(item)}>详情</a>
            <Divider type="vertical" />
            <a onClick={() => onLogClick(item)}>日志</a>
            <Divider type="vertical" />
            <Popconfirm title="确认删除？" onConfirm={() => onDelClick(item)}>
              <a style={{ color: 'red' }}>删除</a>
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
          rowKey={record => record.id}
          dataSource={data}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          scroll={{ x: 1200 }}
        />
      </div>
    );
  }
}

