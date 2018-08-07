import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Table,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './OffLine.less'

@connect(({ common, loading, channelSetting, log }) => ({
  common,
  channelSetting,
  loading: loading.models.channelSetting,
}))
@Form.create()
export default class channelSettingList extends PureComponent {
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
  // 获取点位管理列表
  getLists = () => {
    this.props.dispatch({
      type: 'channelSetting/getChannelSettingList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          keyword: this.state.keyword,
        },
      },
    });
  }
  render() {
    const {
      channelSetting: { list, page },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, editModalConfirmLoading, modalData, modalType } = this.state;
    const columns = [
      {
        title: '机器编号',
        dataIndex: 'id',
        width: '10%',
      },
      {
        title: '机器点位',
        width: '10%',
        dataIndex: 'channelCode',
      },
      {
        title: '机器门',
        width: '10%',
        dataIndex: 'channelCode1',
      },
      {
        title: '温度',
        dataIndex: 'id1',
        width: '10%',
      },
      {
        title: '调货开关',
        width: '10%',
        dataIndex: 'channelCode2',
      },
      {
        title: '屏幕亮度',
        dataIndex: 'channelCode3',
        width: '10%',
      },
      {
        title: '音量',
        dataIndex: 'id2',
        width: '10%',
      },
      {
        title: '货道故障',
        width: '10%',
        dataIndex: 'channelCode4',
      },
      {
        title: '更新时间',
        dataIndex: 'channelCode5',
      },
      {
        fixed: 'right',
        width: 150,
        title: '历史解决方案',
        render: () => (
          <Fragment>
            <a>查看</a>
          </Fragment>
        ),
      },
    ];
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Table
              loading={loading}
              rowKey={record => record.id}
              dataSource={list}
              columns={columns}
              pagination={false}
              onChange={this.handleTableChange}
              scroll={{ x: scrollX ? scrollX : 1050, y: scrollY ? scrollY : (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 100 + 50)}}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
