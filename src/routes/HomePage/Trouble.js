import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Table,
  Button
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import LogModal from '../../components/LogModal';
import styles from './OffLine.less'

const machineDoorStatus = ['关闭', '打开']

@connect(({ common, loading, homePageSetting, log }) => ({
  common,
  homePageSetting,
  loading: loading.models.homePageSetting,
  log
}))
@Form.create()
export default class unusual extends PureComponent {
  state = {
    logModalVisible: false,
    logModalLoading: false,
    logId: '',
    logModalPageNo: 1,
  };
  componentDidMount() {
    this.getLists();
  }
  // 获取列表
  getLists = () => {
    this.props.dispatch({
      type: 'homePageSetting/findExceptionMachine',
      payload: {
        restParams: {
          type: 4
        },
      },
    });
  }
  // 日志相关开始
  getLogList = () => {
    this.props.dispatch({
      type: 'log/getLogList',
      payload: {
        restParams: {
          code: this.state.logId,
          pageNo: this.state.logModalPageNo,
          type: 1020403,
        },
      },
    }).then(() => {
      this.setState({
        logModalLoading: false,
      });
    });
  }

  handleLogClick = (data) => {
    this.setState({
      logModalVisible: !!data,
      logModalLoading: true,
      logId: data.id,
    }, () => {
      this.getLogList();
    });
  }

  logModalHandleCancel = () => {
    this.setState({
      logModalVisible: false,
    });
  }

  logModalhandleTableChange = (pagination) => {
    const { current } = pagination;
    this.setState({
      logModalPageNo: current,
    }, () => {
      this.getLogList();
    });
  }
  // 日志相关结束
  render() {
    const {
      homePageSetting: { ExceptionMachineList },
      loading,
      log: { logList, logPage },
    } = this.props;
    const columns = [
      {
        title: '机器编号',
        dataIndex: 'machineCode',
        width: '25%',
      },
      {
        title: '机器点位',
        width: '25%',
        dataIndex: 'local',
      },
      {
        title: '货道故障',
        width: '25%',
        dataIndex: 'goodsChannelStatus',
        render: (text, item) => (
          (item.goodsChannelStatus) ? (
            <span>{item.goodsChannelStatus}</span>
          ) :(
            <span>无</span>
          )
        )
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        render: (text, item) => (
          (item.updateTime) ? (
            <span>{item.updateTime}</span>
          ) :(
            <span>无</span>
          )
        )
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
              rowKey={record => record.id}
              dataSource={ExceptionMachineList}
              columns={columns}
              pagination={false}
              onChange={this.handleTableChange}
              scroll={{ x: scrollX ? scrollX : 1050, y: scrollY ? scrollY : (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 34)}}
            />
          </div>
        </Card>
        <LogModal
          data={logList}
          page={logPage}
          loding={this.state.logModalLoading}
          logVisible={this.state.logModalVisible}
          logHandleCancel={this.logModalHandleCancel}
          logModalhandleTableChange={this.logModalhandleTableChange}
        />
      </PageHeaderLayout>
    );
  }
}
