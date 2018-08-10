import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Table,
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
          type: 3
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
        width: '10%',
      },
      {
        title: '机器点位',
        width: '15%',
        dataIndex: 'local',
      },
      {
        title: '机器门',
        width: '10%',
        dataIndex: 'machineDoorStatus',
        render(val) {
          if (val) {
            return machineDoorStatus[val]
          } else {
            return '暂无'
          }
        }
      },
      {
        title: '温度',
        dataIndex: 'temperature',
        width: '10%',
        render: (text, item) => (
          (item.temperature) ? (
            <span>{item.temperature}</span>
          ) :(
            <span>暂无</span>
          )
        )
      },
      {
        title: '调货开关',
        width: '10%',
        dataIndex: 'dropGoodsSwitch',
        render(val) {
          if (val) {
            return machineDoorStatus[val]
          } else {
            return '暂无'
          }
        }
      },
      {
        title: '屏幕亮度',
        dataIndex: 'screenIntensity',
        width: '10%',
        render: (text, item) => (
          (item.screenIntensity) ? (
            <span>{item.screenIntensity}</span>
          ) :(
            <span>暂无</span>
          )
        )
      },
      {
        title: '音量',
        dataIndex: 'voice',
        width: '10%',
        render: (text, item) => (
          (item.voice) ? (
            <span>{item.voice}</span>
          ) :(
            <span>暂无</span>
          )
        )
      },
      {
        title: '货道故障',
        width: '10%',
        dataIndex: 'goodsChannelStatus',
        render: (text, item) => (
          (item.goodsChannelStatus) ? (
            <span>{item.goodsChannelStatus}</span>
          ) :(
            <span>暂无</span>
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
            <span>暂无</span>
          )
        )
      },
      // {
      //   fixed: 'right',
      //   width: 150,
      //   title: '历史解决方案',
      //   render: (text, item) => (
      //     <Fragment>
      //       <a onClick={() => this.handleLogClick(item)}>查看</a>
      //     </Fragment>
      //   ),
      // },
    ];
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Table
              loading={loading}
              rowKey={record => record.id}
              dataSource={ExceptionMachineList}
              columns={columns}
              pagination={false}
              onChange={this.handleTableChange}
              scroll={{ x: scrollX ? scrollX : 1050, y: scrollY ? scrollY : (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 100 + 50)}}
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
