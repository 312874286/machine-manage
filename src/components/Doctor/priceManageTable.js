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
    } = this.props;
    const columns = [
      {
        title: '医生姓名',
        dataIndex: 'merchantDoctorName',
      },
      {
        title: '医生ID',
        dataIndex: 'merchantDoctorId',
      },
      {
        title: '出诊类型',
        dataIndex: 'visitType',
        render: (text) => {
          if (!text) return '';
          const arr = [];
          if (text.charAt(text.length - 1) === '1') {
            arr.push('排班');
          }
          if (text.charAt(text.length - 2) === '1') {
            arr.push('特需');
          }
          if (!arr.length) return '';
          return arr.join('，');
        },
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

