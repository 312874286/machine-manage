import React, { PureComponent, Fragment } from 'react';
import { Table, Alert, Divider, Popconfirm, Input, Button } from 'antd';
import styles from './orderTable.less';
import { orderStatusData, orderTypeData } from '../../common/config/order';

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
      unColumn
    } = this.props;
    const columns = [
      {
        title: '订单号',
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
        title: '用户姓名',
        dataIndex: 'nickName',
        width: 100,
        key: 'nickName'
      },
      {
        title: '店铺',
        dataIndex: 'shopsName',
        width: 100,
        key: 'shopsName'
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
      {
        title: '是否掉货',
        dataIndex: 'goodsStatus',
        width: 100,
        render: (value) => {
          return value === 1 ? '已出货' : '未出货';
        },
        key: 'goodsStatus'
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
        key: 'orderGoodsList'
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
        key: 'orderTime'
      },
      // {
      //   title: '订单金额',
      //   dataIndex: 'orderPrice',
      // },
      {
        title: '订单类型',
        dataIndex: 'orderType',
        width: 100,
        key: 'orderType'
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
        key: 'payStatus'
      },
      {
        title: '支付时间',
        dataIndex: 'payTime',
        width: 200,
        key: 'payTime'
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
          scroll={{ x: 2300, y: (document.documentElement.offsetHeight || document.body.offsetHeight) - (68 + 62 + 24 + 53 + 100 + 30) }}
          // showHeader={false}
        />
      </div>
    );
  }
}

