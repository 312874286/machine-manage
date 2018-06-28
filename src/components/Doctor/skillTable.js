import React, { PureComponent, Fragment } from 'react';
import { Table, Alert, Divider, Popconfirm } from 'antd';
import styles from './skillTable.less';

export default class skillTable extends PureComponent {
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
      onDelClick,
      onMoveClick,
    } = this.props;
    const columns = [
      {
        title: '一级技能名称',
        dataIndex: 'firstSkill',
      },
      {
        title: '二级技能名称',
        dataIndex: 'secondSkill',
        width: '350px',
      },
      {
        title: '最后操作时间',
        dataIndex: 'updateTime',
      },
      {
        title: '操作人',
        dataIndex: 'updator',
      },
      {
        title: '操作',
        render: (text, record, index) => (
          <Fragment>
            <a onClick={() => onEditClick(record)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="确认删除？" onConfirm={() => onDelClick(record)}>
              <a style={{ color: '#FF0000' }}>删除</a>
            </Popconfirm>
            {index !== 0 && (
              <span>
                <Divider type="vertical" />
                <a onClick={() => onMoveClick(record, 1)}>上移</a>
              </span>
            )}
            {index < data.length - 1 && (
              <span>
                <Divider type="vertical" />
                <a onClick={() => onMoveClick(record, 0)}>下移</a>
              </span>
            )}
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

