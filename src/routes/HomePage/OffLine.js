import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Table,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './OffLine.less'

@connect(({ common, loading, homePageSetting }) => ({
  common,
  homePageSetting,
  loading: loading.models.homePageSetting,
}))
@Form.create()
export default class offLine extends PureComponent {
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
      type: 'homePageSetting/findExceptionMachine',
      payload: {
        restParams: {
          type: 1
        },
      },
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
        title: '离线时间',
        dataIndex: 'offline_time',
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
      </PageHeaderLayout>
    );
  }
}
