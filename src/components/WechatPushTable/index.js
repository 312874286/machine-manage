import React, { PureComponent, Fragment } from 'react';
import { Table, Alert, Divider } from 'antd';
import styles from './index.less';

// const status = [{ id: 0, name: '停用' }, { id: 1, name: '正常' }];
class WechatPushTable extends PureComponent {
  state = {};

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  render() {
    const { data, page, loading, onDetailClick, onLogClick } = this.props;

    const columns = [
      {
        title: '模板标题',
        dataIndex: 'title',
      },
      {
        title: '模板ID',
        dataIndex: 'wechatTemplateId',
      },
      {
        title: '修改时间',
        dataIndex: 'updateTime',
      },
      {
        title: '操作人',
        dataIndex: 'operator',
      },
      {
        title: '操作',
        render: (text, data) => (
          <Fragment>
            <a onClick={() => onDetailClick(data)}>详情</a>
            <Divider type="vertical" />
            <a onClick={() => onLogClick(data)}>日志</a>
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
                查询结果：共{paginationProps.totalCount}条数据&nbsp;&nbsp;
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

export default WechatPushTable;
