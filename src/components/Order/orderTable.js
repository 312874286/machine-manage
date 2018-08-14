import React, { PureComponent, Fragment } from 'react';
import { Table, Alert, Divider, Popconfirm } from 'antd';
import styles from './orderTable.less';
import { orderStatusData, orderTypeData } from '../../common/config/order';

// const status = [{ id: 0, name: '停用' }, { id: 1, name: '正常' }];
export default class orderTable extends PureComponent {
  state = {};

  handleTableChange = (pagination, filters, sorter) => {
    this.props.handleTableChange(pagination, filters, sorter);
  }

  render() {
    const {
      data,
      page,
      loading,
    } = this.props;
    const columns = [
      {
        title: '订单号',
        dataIndex: 'orderNum',
        width: 200,
      },
      {
        title: '用户Id',
        dataIndex: 'userId',
        width: 300,
      },
      {
        title: '用户姓名',
        dataIndex: 'nickName',
        width: 100,
      },
      {
        title: '店铺',
        dataIndex: 'shopsName',
        width: 100,
      },
      {
        title: '机器点位',
        dataIndex: 'merPointAddress',
        width: 200,
      },
      {
        title: '机器编号',
        dataIndex: 'machineCode',
        width: 100,
      },
      {
        title: '活动名称',
        dataIndex: 'activityName',
        width: 100,
      },
      {
        title: '游戏名称',
        dataIndex: 'gameName',
        width: 100,
      },
      {
        title: '是否掉货',
        dataIndex: 'goodsStatus',
        width: 100,
        render: (value) => {
          return value === 1 ? '已出货' : '未出货';
        },
      },
      {
        title: '商品名称',
        dataIndex: 'orderGoodsList',
        width: 200,
        render: (value) => {
          if (!value) return '';
          const nameList = value.map((item) => {
            return item.goodsName;
          });
          return nameList.join('、');
        },
      },
      // {
      //   title: '掉货数量',
      //   // dataIndex: 'orderGoodsList',
      //   render: (value, item) => {
      //     if(!value) return 0;
      //     return value.length;
      //   }
      // },
      {
        title: '下单时间',
        dataIndex: 'orderTime',
        width: 200,
      },
      // {
      //   title: '订单金额',
      //   dataIndex: 'orderPrice',
      // },
      {
        title: '订单类型',
        dataIndex: 'orderType',
        width: 100,
      },
      {
        title: '支付状态',
        dataIndex: 'payStatus',
        width: 100,
        render: (value) => {
          if (value === '1') {
            return '支付成功';
          } else if (value === '0') {
            return '支付失败';
          }
        },
      },
      {
        title: '支付时间',
        dataIndex: 'payTime',
        width: 200,
      },
      // {
      //   title: '操作',
      //   render: (text, item) => (
      //     <Fragment>
      //       <a onClick={() => onLogClick(item)}>日志</a>
      //     </Fragment>
      //   ),
      // },
    ];

    const paginationProps = {
      showTotal: (total) => {
        // console.log(total, page)
        return `第${page.current}页 / 共${Math.ceil(total/page.pageSize)}页`;
      },
      ...page,
      showQuickJumper: true,
    };

    return (
      <div className={styles.standardTable}>
        {/*<div className={styles.tableAlert}>*/}
          {/*<Alert*/}
            {/*message={(*/}
              {/*<div>*/}
                {/*查询结果：共{paginationProps.total}条数据&nbsp;&nbsp;*/}
                {/*每页{paginationProps.pageSize}条*/}
              {/*</div>*/}
            {/*)}*/}
            {/*type="info"*/}
            {/*showIcon*/}
          {/*/>*/}
        {/*</div>*/}
        <Table
          loading={loading}
          rowKey={record => record.id}
          dataSource={data}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          scroll={{ x: 2300, y: (document.documentElement.offsetHeight || document.body.offsetHeight) - (68 + 62 + 24 + 53 + 100 + 30) }}
          // showHeader={false}
        />
      </div>
    );
  }
}

