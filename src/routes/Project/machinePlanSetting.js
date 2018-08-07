import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Table,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './machinePlanSetting.less'
import MachinePlanTable  from '../../components/Project/machinePlanTable'

@connect(({ common, loading, machinePlanSetting }) => ({
  common,
  machinePlanSetting,
  loading: loading.models.machinePlanSetting,
}))
@Form.create()
export default class machinePlanSettingList extends PureComponent {
  state = {
    machineCode: '',
    startTime: '',
    localCode: '',
    endTime: '',
  };
  componentDidMount() {
    // this.getLists();
  }
  // 获取点位管理列表
  getLists = () => {
    this.props.dispatch({
      type: 'machinePlanSetting/getMachinePLanSetting',
      payload: {
        restParams: {
          machineCode: '',
          startTime: '',
          localCode: '',
          endTime: '',
        },
      },
    });
  }
  render() {
    return (
      <PageHeaderLayout>
        <MachinePlanTable />
      </PageHeaderLayout>
    );
  }
}
