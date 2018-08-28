import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Table,
  Button,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './taskSetting.less'

@connect(({ common, loading, homePageSetting }) => ({
  common,
  homePageSetting,
  loading: loading.models.homePageSetting,
}))
@Form.create()
export default class TaskSetting extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    id: '',
    editModalConfirmLoading: false,
    pageNo: 1,
    keyword: '',
  };
  componentDidMount() {
    this.getLists();
  }
  // 获取列表
  getLists = () => {
    this.props.dispatch({
      type: 'homePageSetting/paiTotalList',
      payload: {
      },
    });
  }
  overActivity = (item) => {
    this.props.dispatch({
      type: 'homePageSetting/overPlanSetting',
      payload: {
        params: {
          id: item.activityPlanId,
          status: 2,
        }
      },
    });
    this.getLists()
  }
  render() {
    const {
      homePageSetting: { PaiTotalList },
      loading,
    } = this.props;
    const goodColumns = [ {
      title: '商品名称',
      dataIndex: 'goodsName',
      width: '100%',
    }]
    const goodColumns2 = [{
      title: '已派发数量',
      dataIndex: 'goodsCount',
      width: '100%',
    }]
    const goodColumns3 = [{
      title: '商品总数量',
      dataIndex: 'totalGoodsCount',
      width: '100%',
    }]
    const List = []
    const columns = [
      {
        title: '活动名称',
        dataIndex: 'activityName',
        width: '10%',
      },
      {
        title: '开始时间',
        width: '15%',
        dataIndex: 'startTime'
      },
      {
        title: '结束时间',
        width: '15%',
        dataIndex: 'endTime',
      },
      {
        title: '商品名称',
        width: '10%',
        render: (text, item) => (
          <div className={styles.goodsBox}>
            <Table
              loading={loading}
              rowKey={record => record.goodsName}
              dataSource={item.inno72PaiNowDataList}
              columns={goodColumns}
              pagination={false}
            />
          </div>
        )
      },
      {
        title: '已派发数量',
        width: '10%',
        render: (text, item) => (
          <div className={styles.goodsBox}>
            <Table
              loading={loading}
              rowKey={record => record.goodsName}
              dataSource={item.inno72PaiNowDataList}
              columns={goodColumns2}
              pagination={false}
            />
          </div>
        )
      },
      {
        title: '商品总数量',
        width: '10%',
        render: (text, item) => (
          <div className={styles.goodsBox}>
            <Table
              loading={loading}
              rowKey={record => record.goodsName}
              dataSource={item.inno72PaiNowDataList}
              columns={goodColumns3}
              pagination={false}
            />
          </div>
        )
      },
      {
        title: '统计时间',
        dataIndex: 'submitTime',
      },
      {
        // fixed: 'right',
        width: 150,
        title: '操作',
        render: (text, item) => (
          <Fragment>
            <a onClick={() => this.overActivity(item)}>结束活动</a>
          </Fragment>
        ),
      },
    ];
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Button icon="arrow-left" type="primary" onClick={() => history.go(-1)}>
            返回
          </Button>
          <div className={styles.tableList}>
            <Table
              loading={loading}
              rowKey={record => record.activityId}
              dataSource={PaiTotalList}
              columns={columns}
              pagination={false}
              onChange={this.handleTableChange}
              scroll={{ x: scrollX ? scrollX : 1050, y: scrollY ? scrollY : (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 34)}}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

