import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Table,
  Button,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './OffLine.less'
import {getAccountMenus} from "../../utils/authority";

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
          type: 5
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
        align: 'center',
        title: '机器编号',
        dataIndex: 'machineCode',
        width: '30%',
      },
      {
        align: 'center',
        title: '机器点位',
        width: '25%',
        dataIndex: 'local',
        render: (text, item) => (
          (item.local) ? (
            <span>{item.local}</span>
          ) :(
            <span>无</span>
          )
        )
      },
      {
        title: '被锁定货道个数',
        dataIndex: 'lockCount',
        align: 'center'
      }
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
      </PageHeaderLayout>
    );
  }
}
