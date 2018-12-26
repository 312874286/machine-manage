import React, { PureComponent, Fragment } from 'react';
import { Table, Alert, Divider, Popconfirm, Input, Button } from 'antd';
import styles from './orderTable.less';
import { orderStatusData, orderTypeData } from '../../common/config/order';
const status = [
  '新退款订单',
  '退款中',
  '退款成功',
  '退款失败'
]
const orderStatus = {
  10: '未支付',
  20: '已支付',
  30: '已完成',
  40: '已退款',
}
// const status = [{ id: 0, name: '停用' }, { id: 1, name: '正常' }];
export default class orderTable extends PureComponent {
  state = {
    No: '',
    totalNo: 0
  };
  componentWillReceiveProps(nextProps) {
    const { page, } = this.props;
    // console.log('page', page)
    this.setState({
      totalNo: Math.ceil(page.total/page.pageSize)
    })
  }
  handleTableChange = (pagination, filters, sorter) => {
    this.props.handleTableChange(pagination, filters, sorter);
  }
  go = () => {
    const { totalNo, No } = this.state
    if (No) {
      if (No <= totalNo && No > 0) {
        this.props.handleTableChange({current: No, pageSize: 20 }, {}, {});
      } else {
        this.setState({
          No: ''
        })
      }
    } else {
      return false
    }
  }
  inputValue = (e) => {
    this.setState({
      No: e.target.value
    })
  }
  render() {
    const { No } = this.state;
    const {
      data,
      page,
      loading,
      unColumn,
      onDetailClick
    } = this.props;
    const columns = [
      {
        title: '订单编号',
        dataIndex: 'orderNum',
        width: 200,
        key: 'orderNum'
      },
      {
        title: '用户Id',
        dataIndex: 'userId',
        width: 300,
        key: 'userId'
      },
      {
        title: '机器点位',
        dataIndex: 'merPointAddress',
        width: 200,
        key: 'merPointAddress'
      },
      {
        title: '机器编号',
        dataIndex: 'machineCode',
        width: 100,
        key: 'machineCode'
      },
      {
        title: '渠道名称',
        dataIndex: 'channelName',
        width: 100,
        key: 'channelName'
      },
      {
        title: '活动名称',
        dataIndex: 'activityName',
        width: 100,
        key: 'activityName'
      },
      {
        title: '游戏名称',
        dataIndex: 'gameName',
        width: 100,
        key: 'gameName'
      },
      // {
      //   title: '是否掉货',
      //   dataIndex: 'goodsStatus',
      //   width: 100,
      //   render: (value) => {
      //     return value === 1 ? '已出货' : '未出货';
      //   },
      //   key: 'goodsStatus'
      // },
      // {
      //   title: '商品名称',
      //   dataIndex: 'orderGoodsList',
      //   width: 200,
      //   render: (value) => {
      //     if (!value) return '';
      //     const nameList = value.map((item) => {
      //       return item.goodsName;
      //     });
      //     return nameList.join('、');
      //   },
      //   key: 'orderGoodsList'
      // },
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
        key: 'orderTime'
      },
      // {
      //   title: '订单金额',
      //   dataIndex: 'orderPrice',
      // },orderStatus
      {
        title: '订单类型',
        dataIndex: 'orderType',
        width: 100,
        key: 'orderType',
        render: (value) => {
          if (value) {
            return orderStatus[value] || value;
          } else {
            return '-';
          }
        },
      },
      {
        title: '订单状态',
        dataIndex: 'payStatus',
        width: 100,
        render: (value) => {
          if (value === '1') {
            return '支付成功';
          } else if (value === '0') {
            return '支付失败';
          }
        },
        key: 'payStatus'
      },
      {
        title: '退款状态',
        dataIndex: 'refundStatus',
        width: 100,
        render: (value) => {
          if (value && value >= 0) {
            return status[value];
          } else {
            return '-';
          }
        },
        key: 'refundStatus'
      },
      {
        title: '操作',
        width: 100,
        fixed: "right",
        render: (text, item) => (
          <Fragment>
            <a onClick={() => onDetailClick(item)}>查看详情</a>
          </Fragment>
        ),
      }
    ];
    if (unColumn) {
      let leg = columns.length
      for (let i = leg - 1; i >= 0; i--) {
        for (let j = 0; j < unColumn.length; j++) {
          if (columns[i]) {
            if (columns[i].key === unColumn[j]) {
              columns.splice(i, 1)
              continue;
            }
          }
        }
      }
    }
    // `第${page.current}页 / 共${Math.ceil(total/page.pageSize)}页`
    const paginationProps = {
      showTotal: (total) => {
        // console.log(total, page)
        return (
          <div className="paginationBox">
            <span>当前显示{page.pageSize}条/页，共{page.total}条</span>
            {/*<div>*/}
              {/*<span>第{page.current}页 / 共{Math.ceil(total/page.pageSize)}页</span>*/}
              {/*<span>*/}
                 {/*<span>跳至 <Input value={No} onChange={this.inputValue}/>页</span>*/}
                 {/*<Button type="primary" onClick={() => this.go()}>Go</Button>*/}
               {/*</span>*/}
            {/*</div>*/}
          </div>
        );
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
          scroll={{ x: 1600, y: (document.documentElement.offsetHeight || document.body.offsetHeight) - (68 + 62 + 24 + 53 + 100 + 30) }}
          // showHeader={false}
        />
      </div>
    );
  }
}

