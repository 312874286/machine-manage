import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import styles from './HomePage.less'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {
  Form,
  Card,
} from 'antd';
import {getAccountMenus} from "../../utils/authority";


@connect(({ common, loading, homePageSetting }) => ({
  common,
  homePageSetting,
  loading: loading.models.homePageSetting,
}))
@Form.create()
export default class homePageSetting extends PureComponent {
  state = {
    account: []
  };
  componentDidMount() {
    this.getLists();
    this.getAccountMenus(getAccountMenus())
  }
  getAccountMenus = (setAccountMenusList) => {
    if (setAccountMenusList) {
      let account = setAccountMenusList.filter((item) => item.path === 'check')
        if (account[0]) {
          this.setState({
            account: account[0].children.filter((item) => item.path === 'fault'),
          })
        }

    }
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
    const { account } = this.state
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
                {/*<a style={{ cursor: 'not-allowed' }}>*/}
                  {/*<div className={styles.machineLeftBox}>*/}
                    {/*<img src={require('../../assets/images/indexPage/onLine.png')}/>*/}
                  {/*</div>*/}
                  {/*<div className={styles.machineRightBox}>*/}
                    {/*<span>{MachinePortalDataList.online === 0 ? "0" : MachinePortalDataList.online}</span>*/}
                    {/*<span>机器在线</span>*/}
                  {/*</div>*/}
                {/*</a>*/}
                <a onClick={() => this.props.history.push('/offline')}>
                  <div className={styles.machineLeftBox}>
                    <img src={require('../../assets/images/indexPage/offLine.png')}/>
                  </div>
                  <div className={styles.machineRightBox}>
                    <span>{MachinePortalDataList.offline === 0 ? "0" : MachinePortalDataList.offline}</span>
                    <span>机器离线</span>
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
                <a onClick={() => this.props.history.push('/Unusual')}>
                  <div className={styles.machineLeftBox}>
                    <img src={require('../../assets/images/indexPage/unusual.png')}/>
                  </div>
                  <div className={styles.machineRightBox}>
                    <span>{MachinePortalDataList.dropGoodsSwitchException === 0 ? "0" : MachinePortalDataList.dropGoodsSwitchException}</span>
                    <span>掉货开关异常</span>
                  </div>
                </a>
                <a onClick={() => this.props.history.push('/Trouble')}>
                  <div className={styles.machineLeftBox}>
                    <img src={require('../../assets/images/indexPage/trouble.png')}/>
                  </div>
                  <div className={styles.machineRightBox}>
                    <span>{MachinePortalDataList.channelException === 0 ? "0" : MachinePortalDataList.channelException}</span>
                    <span>货道故障</span>
                  </div>
                </a>
                <a onClick={() => this.props.history.push('/Lock')}>
                  <div className={styles.machineLeftBox}>
                    <img src={require('../../assets/images/indexPage/lock.png')}/>
                  </div>
                  <div className={styles.machineRightBox}>
                    <span>{MachinePortalDataList.lockCount === 0 ? "0" : MachinePortalDataList.lockCount}</span>
                    <span>货道被锁定</span>
                  </div>
                </a>
                <a onClick={() => this.props.history.push('/flowWarn')}>
                  <div className={styles.machineLeftBox}>
                    <img src={require('../../assets/images/indexPage/flowWarn.jpg')}/>
                  </div>
                  <div className={styles.machineRightBox}>
                    <span>{MachinePortalDataList.trafficCount === 0 ? "0" : MachinePortalDataList.trafficCount}</span>
                    <span>今日流量预警</span>
                  </div>
                </a>
                <a onClick={() => this.props.history.push('/RAMWarn')}>
                  <div className={styles.machineLeftBox}>
                    <img src={require('../../assets/images/indexPage/RAMWarn.jpg')}/>
                  </div>
                  <div className={styles.machineRightBox}>
                    <span>{MachinePortalDataList.sdCount === 0 ? "0" : MachinePortalDataList.sdCount}</span>
                    <span>机器内存预警</span>
                  </div>
                </a>
              </div>
            </Card>
            <Card title={
              <div>
                活动监控
                <span className={styles.titleSpan}>(单位:个)</span>
              </div>}>
              <div className={styles.gridCardBox}>
                <a onClick={() => this.props.history.push('/paiActivity')}>
                  <div className={styles.machineLeftBox}>
                    <img src={require('../../assets/images/indexPage/doing.png')}/>
                  </div>
                  <div className={styles.machineRightBox}>
                    <span>{MachinePortalDataList.paiActivityCount === 0 ? "0" : MachinePortalDataList.paiActivityCount}</span>
                    <span>进行中的派样活动</span>
                  </div>
                </a>
              </div>
            </Card>
            <div style={{ display: account.length === 0 ? 'none' : ''}}>
              <Card title={
                <div>
                  工单
                  <span className={styles.titleSpan}>(单位:条)</span>
                </div>}>
                <div className={styles.gridCardBox} >
                  <a onClick={() => this.props.history.push({pathname: '/check/fault', query: {statusValue: 1}})}>
                    <div className={styles.machineLeftBox}>
                      <img src={require('../../assets/images/indexPage/receiveOrder.png')}/>
                    </div>
                    <div className={styles.machineRightBox}>
                      <span>{MachinePortalDataList.waitOrder === 0 ? "0" : MachinePortalDataList.waitOrder}</span>
                      <span>待接单</span>
                    </div>
                  </a>
                  <a onClick={() => this.props.history.push({pathname: '/check/fault', query: {statusValue: 2}})}>
                    <div className={styles.machineLeftBox}>
                      <img src={require('../../assets/images/indexPage/processed.png')}/>
                    </div>
                    <div className={styles.machineRightBox}>
                      <span>{MachinePortalDataList.processed === 0 ? "0" : MachinePortalDataList.processed}</span>
                      <span>处理中</span>
                    </div>
                  </a>
                  <a onClick={() => this.props.history.push({pathname: '/check/fault', query: {statusValue: 3}})}>
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
          </div>
        </PageHeaderLayout>
      </div>
    );
  }
}
