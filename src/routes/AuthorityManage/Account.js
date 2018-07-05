import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
import { Table, Card } from 'antd';
// import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import styles from './Account.less';
// import { getTestList } from '../../services/authorityManage/account';
// import LogModal from '../../components/LogModal';
// import EditableTagGroup from '../../components/Tag';
// import {area} from "../../common/config/area";
@connect(({ account }) => ({ account }))
export default class Account extends PureComponent {
  componentDidMount = () => {
    this.getTestList();
  }
  getTestList = () => {
    this.props.dispatch({
      type: 'account/getTestList',
      payload: {
        restParams: {
          pageNo: 'pageno',
          keyword: 222,
        },
      },
    });
  }
  render() {
    const { account: { dataSource } } = this.props;
    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    }, {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    }];
    return (
      <PageHeaderLayout>
        <Card>
          <Table dataSource={dataSource} columns={columns} />
        </Card>
      </PageHeaderLayout>
    );
  }
}