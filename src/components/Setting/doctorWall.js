import React, { PureComponent, Fragment } from 'react';
import { Table, Alert, Divider, Popconfirm } from 'antd';
import styles from './doctorWall.less';

// const status = [{ id: 0, name: '停用' }, { id: 1, name: '正常' }];
class doctorWallTable extends PureComponent {
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
      onDeleteClick,
      tableHandleUpClick,
      tableHandleDownClick,
    } = this.props;
    const columns = [
      {
        title: '科室名称',
        dataIndex: 'subjectName',
      },
      {
        title: '医生',
        dataIndex: 'doctorNames',
      },
      {
        title: '最后操作时间',
        dataIndex: 'updateTime',
      },
      {
        title: '操作人',
        dataIndex: 'operatorName',
      },
      {
        title: '操作',
        render: (text, item, index) => (
          <Fragment>
            <a onClick={() => onEditClick(item)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="确认删除？" onConfirm={() => onDeleteClick(item)}>
              <a style={{ color: '#FF0000' }}>删除</a>
            </Popconfirm>
            {index !== 0 && (
              <span>
                <Divider type="vertical" />
                <a onClick={() => tableHandleUpClick(item)}>上移</a>
              </span>
            )}
            {index < data.length - 1 && (
              <span>
                <Divider type="vertical" />
                <a onClick={() => tableHandleDownClick(item)}>下移</a>
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
          rowKey={record => record.subjectId}
          dataSource={data}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default doctorWallTable;
