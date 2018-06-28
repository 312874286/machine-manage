import React, { PureComponent } from 'react';
import { Table, Tabs } from 'antd';
import styles from './withdrawalDetailTabs.less';

const config = {
  verifyStatus: [
    // 1审核中 2已驳回 3已通过 8提现失败 9已完成
    { id: 1, name: '待审核' },
    { id: 2, name: '已驳回' },
    { id: 3, name: '审核通过' },
    { id: 8, name: '提现失败' },
    { id: 9, name: '已完成' },
  ],
};
// const status = [{ id: 0, name: '停用' }, { id: 1, name: '正常' }];
export default class withdrawalDetailTabs extends PureComponent {
  state = {
    list1: {
      datas: [],
      page: {
        total: 0,
        pageSize: 20,
        current: 1,
      },
    },
    list2: {
      datas: [],
      page: {
        total: 0,
        pageSize: 20,
        current: 1,
      },
    },
    list3: {
      datas: [],
      page: {
        total: 0,
        pageSize: 20,
        current: 1,
      },
    },
    list4: {
      datas: [],
      page: {
        total: 0,
        pageSize: 20,
        current: 1,
      },
    },
  };

  componentWillMount() {
    this.onChange(1);
  }

  componentWillReceiveProps({ datas }) {
    const { list1, list2, list3, list4 } = datas;
    this.setState({ list1, list2, list3, list4 });
  }

  onChange = (key) => {
    const currentList = this.state[`list${key}`];
    this.props.onChange(currentList.page, key);
  }

  handleTableChange = (pagination, type) => {
    this.props.onChange(pagination, type);
  }

  renderTable1 = () => {
    const list = this.state.list1;
    // const total = this.props.income.commisionSummary;
    const columns = [
      {
        title: '支付时间',
        dataIndex: 'payTime',
        width: 130,
      },
      {
        title: '服务项名称',
        dataIndex: 'goodsDesc',
        width: 170,
      },
      {
        title: '服务项ID',
        dataIndex: 'goodsId',
        width: 170,
      },
      {
        title: '订单ID',
        dataIndex: 'orderNum',
        width: 170,
      },
      {
        title: '微信支付订单号',
        dataIndex: 'transactionId',
        width: 170,
      },
      {
        title: '销售额(元)',
        dataIndex: 'totalAmount',
        width: 120,
      },
      {
        title: '佣金率',
        dataIndex: 'scale',
        width: 120,
        render: (text, record) => {
          return record.scale === 0 ? '-' : `${record.scale * 100}%`;
        },
      },
      {
        title: '佣金(元)',
        width: 120,
        dataIndex: 'shareAmount',
      },
    ];
    return (
      // <div>
      // { <div className={styles.summary}>总金额：{total}</div> }
      <Table
        rowKey={record => record.id}
        dataSource={list.datas}
        columns={columns}
        pagination={list.page}
        onChange={(pagination) => { this.handleTableChange(pagination, 1); }}
        loading={this.props.loading}
        scroll={{ y: 360 }}
      />
      // </div>
    );
  }
  renderTable2 = () => {
    const list = this.state.list2;
    // const total = this.props.income.subsidySummary;
    const columns = [
      {
        title: '订单ID',
        dataIndex: 'businessId',
      },
      {
        title: '扫码时间',
        dataIndex: 'saleTime',
      },
      {
        title: '微信账号',
        dataIndex: 'openId',
      },
      {
        title: '金额',
        dataIndex: 'totalAmount',
      },
    ];
    return (
      // <div>
      //  <div className={styles.summary}>总金额：{total}</div>
      <Table
        rowKey={record => record.id}
        dataSource={list.datas}
        columns={columns}
        pagination={list.page}
        onChange={(pagination) => { this.handleTableChange(pagination, 2); }}
        loading={this.props.loading}
      />
      // </div>
    );
  }
  renderTable3 = () => {
    const list = this.state.list3;
    // const total = this.props.income.withdrawalsSummary;
    const columns = [
      {
        title: '提现记录ID',
        dataIndex: 'depositNum',
      },
      {
        title: '提现时间',
        dataIndex: 'createTime',
      },
      {
        title: '医生ID',
        dataIndex: 'doctorShowId',
      },
      {
        title: '提现金额',
        dataIndex: 'applyAmount',
      },
      {
        title: '到账金额',
        dataIndex: 'amount',
      },
      {
        title: '微信账号',
        dataIndex: 'openId',
      },
      {
        title: '审核状态',
        render: (text, record) => {
          const status = config.verifyStatus.find(i => i.id === record.status);
          return status ? status.name : '';
        },
      },
    ];
    return (
      // <div>
      // { <div className={styles.summary}>总金额：{total}</div> }
      <Table
        rowKey={record => record.id}
        dataSource={list.datas}
        columns={columns}
        pagination={list.page}
        onChange={(pagination) => { this.handleTableChange(pagination, 3); }}
        loading={this.props.loading}
      />
      // </div>
    );
  }
  renderTable4 = () => {
    const list = this.state.list4;
    // const total = this.props.income.knowSummary;
    const columns = [
      {
        title: '订单支付时间',
        dataIndex: 'payTime',
      },
      {
        title: '服务项名称',
        dataIndex: 'goodsDesc',
      },
      {
        title: '订单ID',
        dataIndex: 'orderNum',
      },
      {
        title: '微信支付订单号',
        dataIndex: 'transactionId',
      },
      {
        title: '销售额',
        dataIndex: 'totalAmount',
      },
      {
        title: '佣金率',
        render: (text, record) => {
          return record.scale === 0 ? '-' : `${record.scale * 100}%`;
        },
      },
      {
        title: '佣金',
        dataIndex: 'shareAmount',
      },
    ];
    return (
      // <div>
      //  <div className={styles.summary}>总金额：{total}</div>
      <Table
        rowKey={record => record.id}
        dataSource={list.datas}
        columns={columns}
        pagination={list.page}
        onChange={(pagination) => { this.handleTableChange(pagination, 4); }}
        loading={this.props.loading}
      />
      // </div>
    );
  }

  render() {
    const { income, loading } = this.props;
    // const total = this.props.income.knowSummary;
    return (
      <Tabs defaultActiveKey="1" onChange={this.onChange}>
        <Tabs.TabPane tab={`佣金(${income.commisionSummary}元)`} key="1" disabled={loading}>
          {this.renderTable1()}
        </Tabs.TabPane>
        <Tabs.TabPane tab={`补贴(${income.subsidySummary}元)`} key="2" disabled={loading}>
          {this.renderTable2()}
        </Tabs.TabPane>
        <Tabs.TabPane tab={`提现(${income.withdrawalsSummary}元)`} key="3" disabled={loading}>
          {this.renderTable3()}
        </Tabs.TabPane>
        <Tabs.TabPane tab={`风车知道(${income.knowSummary}元)`} key="4" disabled={loading}>
          {this.renderTable4()}
        </Tabs.TabPane>
      </Tabs>);
  }
}
