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
          <div style={{background: '#fff', height: (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 10)}}>
            <Card title={
              <div>
                运行监控
                <span className={styles.titleSpan}>(单位:台)</span>
              </div>
            }>
              <div className={styles.gridCardBox}>
                <a style={{ cursor: 'not-allowed' }}>
                  <div className={styles.machineLeftBox}>
                    <img src={require('../../assets/images/indexPage/onLine.png')}/>
                  </div>
                  <div className={styles.machineRightBox}>
                    <span>{MachinePortalDataList.online === 0 ? "0" : MachinePortalDataList.online}</span>
                    <span>机器在线</span>
                  </div>
                </a>
                <a onClick={() => this.props.history.push('/offline')}>
                  <div className={styles.machineLeftBox}>
                    <img src={require('../../assets/images/indexPage/offLine.png')}/>
                  </div>
                  <div className={styles.machineRightBox}>
                    <span>{MachinePortalDataList.offline === 0 ? "0" : MachinePortalDataList.offline}</span>
                    <span>机器离线</span>
                  </div>
                </a>
                <a onClick={() => this.props.history.push('/Unusual')}>
                  <div className={styles.machineLeftBox}>
                    <img src={require('../../assets/images/indexPage/unusual.png')}/>
                  </div>
                  <div className={styles.machineRightBox}>
                    <span>{MachinePortalDataList.exception === 0 ? "0" : MachinePortalDataList.exception}</span>
                    <span>机器异常</span>
                  </div>
                </a>
                <a onClick={() => this.props.history.push('/StockOut')}>
                  <div className={styles.machineLeftBox}>
                    <img src={require('../../assets/images/indexPage/stockOut.png')}/>
                  </div>
                  <div className={styles.machineRightBox}>
                    <span>{MachinePortalDataList.stockout === 0 ? "0" : MachinePortalDataList.stockout}</span>
                    <span>机器缺货</span>
                  </div>
                </a>
              </div>
            </Card>
            <Card title={
              <div>
                工单
                <span className={styles.titleSpan}>(单位:条)</span>
              </div>}>
              <div className={styles.gridCardBox}>
                <a>
                  <div className={styles.machineLeftBox}>
                    <img src={require('../../assets/images/indexPage/receiveOrder.png')}/>
                  </div>
                  <div className={styles.machineRightBox}>
                    <span>{MachinePortalDataList.waitOrder === 0 ? "0" : MachinePortalDataList.waitOrder}</span>
                    <span>待接单</span>
                  </div>
                </a>
                <a>
                  <div className={styles.machineLeftBox}>
                    <img src={require('../../assets/images/indexPage/processed.png')}/>
                  </div>
                  <div className={styles.machineRightBox}>
                    <span>{MachinePortalDataList.processed === 0 ? "0" : MachinePortalDataList.processed}</span>
                    <span>处理中</span>
                  </div>
                </a>
                <a>
                  <div className={styles.machineLeftBox}>
                    <img src={require('../../assets/images/indexPage/affirm.png')}/>
                  </div>
                  <div className={styles.machineRightBox}>
                    <span>{MachinePortalDataList.waitConfirm === 0 ? "0" : MachinePortalDataList.waitConfirm}</span>
                    <span>待确认</span>
                  </div>
                </a>
              </div>
            </Card>
          </div>

        </PageHeaderLayout>
      </div>
    );
  }
}
