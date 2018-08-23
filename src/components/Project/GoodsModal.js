import React, { PureComponent } from 'react';
import { Table, Modal } from 'antd';
import styles from './GoodsModal.less';

export default class GoodsModal extends PureComponent {
  state = {};

  goodsModalhandleTableChange = (pagination, filters, sorter) => {
    this.props.goodsModalhandleTableChange(pagination, filters, sorter);
  }
  footer = (data, count) => {
    return (
      (data) ? (
        <div className={styles.footerBox}>
          <span>合计</span>
          <span></span>
          <span>{count.totalGoodsCount}</span>
          <span>{count.totalUserCount}</span>
          <span>{count.totalOrderCount}</span>
          <span>{count.totalPayCount}</span>
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
      goodsHandleCancel,
      goodsVisible,
      count
    } = this.props;

    const columns = [{
      title: '日期',
      dataIndex: 'createDate',
      width: '25%',
      // align: 'center'
    }, {
      title: '商品名称',
      dataIndex: 'goodsName',
      width: '15%',
      align: 'center'
    }, {
      title: '商品发送数量',
      dataIndex: 'goodsCount',
      width: '15%',
      align: 'center'
    }, {
      title: '用户数量',
      dataIndex: 'userCount',
      width: '15%',
      align: 'center'
    }, {
      title: '订单数量',
      dataIndex: 'orderCount',
      width: '15%',
      align: 'center'
    }, {
      title: '支付成功数量',
      dataIndex: 'payCount',
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
              <span className="modalTitle">查看商品统计</span>
            </div>
          }
          footer={null}
          width="800px"
          visible={goodsVisible}
          onCancel={goodsHandleCancel}
          // onOk={logHandleCancel}
          className={styles.modal}
        >
          <Table
            size="small"
            scroll={{ y: 240 }}
            loading={loding}
            rowKey={record => record.id}
            dataSource={data}
            columns={columns}
            pagination={false}
            onChange={this.goodsModalhandleTableChange}
            footer={() => this.footer(data, count)}
          />
        </Modal>
      </div>
    );
  }
}

