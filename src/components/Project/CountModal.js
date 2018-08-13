import React, { PureComponent } from 'react';
import { Table, Modal } from 'antd';
import styles from './CountModal.less';

export default class CountModal extends PureComponent {
  state = {};

  logModalhandleTableChange = (pagination, filters, sorter) => {
    this.props.logModalhandleTableChange(pagination, filters, sorter);
  }
  footer = (data) => {
    return (
      (data) ? (
        <div className={styles.footerBox}>
          <span>合计</span>
          <span>100</span>
          <span>100</span>
          <span>100</span>
          <span>100</span>
          <span>100</span>
        </div>
      ) : (
        ''
      )
    )
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
      title: '日期',
      dataIndex: 'createTime',
      width: '25%',
      align: 'center'
    }, {
      title: '用户数量',
      dataIndex: 'creator',
      width: '15%',
      align: 'center'
    }, {
      title: '订单数量',
      dataIndex: 'description',
      width: '15%',
      align: 'center'
    }, {
      title: '支付成功数量',
      dataIndex: 'remark',
      width: '15%',
      align: 'center'
    }, {
      title: '商品发放数量',
      dataIndex: 'remark2',
      width: '15%',
      align: 'center'
    }, {
      title: '优惠券发放数量',
      dataIndex: 'remark3',
      width: '15%',
      align: 'center'
    }];

    const paginationProps = {
      showTotal: (total) => {
        return `共${total}条数据  每页${page.pageSize}条`;
      },
      ...page,
    };

    return (
      <div className={styles.modalBox}>
        <Modal
          title={
            <div className="modalBox">
              <span className="leftSpan"></span>
              <span className="modalTitle">查看活动统计</span>
            </div>
          }
          footer={null}
          width="800px"
          visible={logVisible}
          onCancel={logHandleCancel}
          // onOk={logHandleCancel}
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
            footer={() => this.footer(data)}
          />
        </Modal>
      </div>
    );
  }
}

