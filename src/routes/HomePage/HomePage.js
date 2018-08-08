import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import styles from './HomePage.less'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {
  Form,
  Card,
} from 'antd';
@connect(({ common, loading, homePageSetting }) => ({
  common,
  homePageSetting,
  loading: loading.models.homePageSetting,
}))
@Form.create()
export default class homePageSetting extends PureComponent {
  state = {
  };
  componentDidMount() {
    this.getLists();
  }
  // 获取列表
  getLists = () => {
    this.props.dispatch({
      type: 'homePageSetting/findMachinePortalData',
      payload: {
        restParams: {},
      },
    });
  }

  render() {
    const {
      homePageSetting: { MachinePortalDataList },
    } = this.props;
    const gridStyle = {
      width: '25%',
      textAlign: 'center',
    };
    return (
      <div className={styles.gridBox}>
        <PageHeaderLayout>
          <div className={styles.gridCardBox}>
            <Card title="运行监控">
              <a>
                <Card.Grid style={gridStyle}>
                  <Card title={MachinePortalDataList.online === 0 ? "0" : MachinePortalDataList.online} bordered={false}>机器在线</Card>
                </Card.Grid>
              </a>
              <a onClick={() => this.props.history.push('/offline')}>
                <Card.Grid style={gridStyle}>
                  <Card title={MachinePortalDataList.offline} bordered={false}>机器离线</Card>
                </Card.Grid>
              </a>
              <a onClick={() => this.props.history.push('/Unusual')}>
                <Card.Grid style={gridStyle}>
                  <Card title={MachinePortalDataList.exception} bordered={false}>机器异常</Card>
                </Card.Grid>
              </a>
              <a onClick={() => this.props.history.push('/StockOut')}>
                <Card.Grid style={gridStyle}>
                  <Card title={MachinePortalDataList.stockout} bordered={false}>机器缺货</Card>
                </Card.Grid>
              </a>
            </Card>
            <Card title="工单：">
              <Card.Grid style={gridStyle}>
                <Card title={MachinePortalDataList.waitOrder} bordered={false}>待接单</Card>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <Card title={MachinePortalDataList.processed} bordered={false}>处理中</Card>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <Card title={MachinePortalDataList.waitConfirm} bordered={false}>待确认</Card>
              </Card.Grid>
            </Card>
          </div>
        </PageHeaderLayout>
      </div>
    );
  }
}
