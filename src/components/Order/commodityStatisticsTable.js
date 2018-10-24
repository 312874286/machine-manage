import React, { PureComponent, Fragment } from 'react';
import { Table, Alert, Divider, Popconfirm, Input, Button } from 'antd';
import styles from './orderTable.less';
import { orderStatusData, orderTypeData } from '../../common/config/order';

// const status = [{ id: 0, name: '停用' }, { id: 1, name: '正常' }];
export default class CommodityStatisticsTable extends PureComponent {
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
        title: '商品名称',
        dataIndex: 'orderNum',
        width: '15%',
        key: 'orderNum'
      },
      {
        title: '机器编号',
        dataIndex: 'userId',
        width: '15%',
        key: 'userId'
      },
      {
        title: '机器点位',
        dataIndex: 'nickName',
        width: '20%',
        key: 'nickName'
      },
      {
        title: '补货前数量',
        dataIndex: 'shopsName',
        width: '10%',
        key: 'shopsName'
      },
      {
        title: '补货数量',
        dataIndex: 'merPointAddress',
        width: '10%',
        key: 'merPointAddress'
      },
      {
        title: '时间',
        dataIndex: 'machineCode',
        width: '10%',
        key: 'machineCode'
      },
      {
        title: '剩余数量',
        dataIndex: 'activityName',
        width: '10%',
        key: 'activityName'
      },
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
            <div>
              <span>第{page.current}页 / 共{Math.ceil(total/page.pageSize)}页</span>
              <span>
                 <span>跳至 <Input value={No} onChange={this.inputValue}/>页</span>
                 <Button type="primary" onClick={() => this.go()}>Go</Button>
               </span>
            </div>
          </div>
        );
      },
      ...page,
      showQuickJumper: false,
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
          scroll={{ x: 800, y: (document.documentElement.offsetHeight || document.body.offsetHeight) - (68 + 62 + 24 + 53 + 100 + 30) }}
          // showHeader={false}
        />
      </div>
    );
  }
}

