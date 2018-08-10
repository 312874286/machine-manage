import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Table,
  Modal,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './OffLine.less'


const WatchMachine = Form.create()(
  (props) => {
    const { WatchMachineModalVisible, WatchMachineHandleModalVisibleClick, machineList } = props;
    const machineColumns = [{
      title: '商品名称',
      dataIndex: 'goodName',
      align: 'left',
      width: '85%'
    }, {
      title: '剩余数量',
        dataIndex: 'goodCount',
        align: 'left',
        width: '15%'
    }];
    return (
      <Modal
        title={
          <div class="modalBox">
            <span class="leftSpan"></span>
            <span class="modalTitle">查看剩余数量</span>
          </div>
        }
        width={800}
        visible={WatchMachineModalVisible}
        onCancel={() => WatchMachineHandleModalVisibleClick()}
        footer={null}
      >
        <div style={{ paddingBottom: '30px' }} className={styles.watchMachineBox}>
          <Table columns={machineColumns} dataSource={machineList} rowKey={record => record.machineCode} pagination={false} />
        </div>
      </Modal>
    );
  });
@connect(({ common, loading, homePageSetting }) => ({
  common,
  homePageSetting,
  loading: loading.models.homePageSetting,
}))
@Form.create()
export default class stockOut extends PureComponent {
  state = {
    WatchMachineModalVisible: false,
    machineList: [],
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
  getMachineStatus = (item) => {
    this.props.dispatch({
      type: 'homePageSetting/findMachineStockoutInfo',
      payload: {
        restParams: {
          machineId: item.id
        },
      },
    }).then((res) => {
      if (res) {
        this.setState({
          machineList: res,
        }, () => {
          this.setState({
            WatchMachineModalVisible: true,
          });
        });
      }
    });
  }
  WatchMachineHandleModalVisibleClick = () => {
    this.setState({
      WatchMachineModalVisible: false,
    });
  }
  render() {
    const {
      homePageSetting: { ExceptionMachineList },
      loading,
    } = this.props;
    const columns = [
      {
        title: '机器编号',
        dataIndex: 'machineCode',
        width: '30%',
      },
      {
        title: '机器点位',
        width: '25%',
        dataIndex: 'local',
      },
      {
        title: '剩余数量',
        dataIndex: 'stockoutInfo',
        render: (text, item) => (
          <div style={{ color: '#5076FF', border: 0, background: 'transparent', cursor: 'pointer' }} onClick={() => this.getMachineStatus(item)} >查看</div>
        ),
      },
      {
        fixed: 'right',
        width: 150,
        title: '操作',
        render: () => (
          <Fragment>
            <a>创建工单</a>
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
              dataSource={ExceptionMachineList}
              columns={columns}
              pagination={false}
              onChange={this.handleTableChange}
              scroll={{ x: scrollX ? scrollX : 1050, y: scrollY ? scrollY : (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 100 + 50)}}
            />
          </div>
        </Card>
        <WatchMachine
          WatchMachineModalVisible={this.state.WatchMachineModalVisible}
          WatchMachineHandleModalVisibleClick={this.WatchMachineHandleModalVisibleClick}
          machineList={this.state.machineList}
        />
      </PageHeaderLayout>
    );
  }
}
