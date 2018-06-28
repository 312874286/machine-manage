import React, { PureComponent } from 'react';
import { Table, Modal } from 'antd';
import styles from './index.less';

export default class logModal extends PureComponent {
  state = {};

  logModalhandleTableChange = (pagination, filters, sorter) => {
    this.props.logModalhandleTableChange(pagination, filters, sorter);
  }

  render() {
    const {
      // dataSource: { data = [], page = {} },
      data,
      page,
      loding,
      logHandleCancel,
      logVisible,
    } = this.props;

    const columns = [{
      title: '操作时间',
      dataIndex: 'createTime',
      width: 180,
    }, {
      title: '操作人',
      dataIndex: 'creator',
      width: 150,
    }, {
      title: '事件',
      dataIndex: 'description',
      width: 150,
    }, {
      title: '备注',
      dataIndex: 'remark',
    }];

    const paginationProps = {
      showTotal: (total) => {
        return `共${total}条数据  每页${page.pageSize}条`;
      },
      ...page,
    };

    return (
      <Modal
        title="操作日志"
        width="1000px"
        visible={logVisible}
        onCancel={logHandleCancel}
        onOk={logHandleCancel}
        className={styles.modal}
      >
        <Table
          size="small"
          scroll={{ y: 240 }}
          loading={loding}
          rowKey={record => record.uuid}
          dataSource={data}
          columns={columns}
          pagination={paginationProps}
          onChange={this.logModalhandleTableChange}
        />
      </Modal>
    );
  }
}

