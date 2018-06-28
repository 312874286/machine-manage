import React, { PureComponent, Fragment } from 'react';
import { Table, Alert, Divider, Popconfirm } from 'antd';
import styles from './operationTable.less';
import { consumers, operationType, operator } from '../../common/config/operationItem';

// const status = [{ id: 0, name: '停用' }, { id: 1, name: '正常' }];
export default class OperationTable extends PureComponent {
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
        title: '操作项ID',
        dataIndex: 'operationCode',
      },
      {
        title: '操作项名称',
        dataIndex: 'operationName',
      },
      {
        title: '操作项类型',
        dataIndex: 'operationType',
        render: (value) => {
          const typeItem = operationType.find(item => item.id === value);
          return typeItem ? typeItem.name : '';
        },
      },
      {
        title: '第一操作人',
        dataIndex: 'firstOperator',
        render: (value) => {
          const typeItem = operator.find(item => item.id === value);
          return typeItem ? typeItem.name : '无';
        },
      },
      {
        title: '第二操作人',
        dataIndex: 'secondOperator',
        render: (value) => {
          const typeItem = operator.find(item => item.id === value);
          return typeItem ? typeItem.name : '无';
        },
      },
      // {
      //   title: '使用方',
      //   dataIndex: 'ext1Int',
      //   render: (value) => {
      //     const typeItem = consumers.find(item => item.id === value);
      //     return typeItem ? typeItem.name : '无';
      //   },
      // },
      {
        title: '创建时间',
        dataIndex: 'created',
      },
      {
        title: '最近修改时间',
        dataIndex: 'updated',
      },
      {
        title: '操作',
        fixed: 'right',
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
        />
      </div>
    );
  }
}

