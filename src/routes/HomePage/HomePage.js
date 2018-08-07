import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import styles from './HomePage.less'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {
  Form,
  Card,
} from 'antd';
@connect(({ common, loading, user }) => ({
  common,
  user,
  loading: loading.models.user,
}))
@Form.create()
export default class user extends PureComponent {
  state = {
  };
  componentDidMount() {
    // this.getLists();
  }
  // 获取列表
  getLists = () => {
    this.props.dispatch({
      type: 'user/getUserList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          keyword: this.state.keyword,
        },
      },
    });
  }

  render() {
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
                  <Card title="200台" bordered={false}>机器在线</Card>
                </Card.Grid>
              </a>
              <a onClick={() => this.props.history.push('/offline')}>
                <Card.Grid style={gridStyle}>
                  <Card title="200台" bordered={false}>机器离线</Card>
                </Card.Grid>
              </a>
              <a onClick={() => this.props.history.push('/Unusual')}>
                <Card.Grid style={gridStyle}>
                  <Card title="200台" bordered={false}>机器异常</Card>
                </Card.Grid>
              </a>
              <a onClick={() => this.props.history.push('/StockOut')}>
                <Card.Grid style={gridStyle}>
                  <Card title="200台" bordered={false}>机器缺货</Card>
                </Card.Grid>
              </a>
            </Card>
            <Card title="工单：">
              <Card.Grid style={gridStyle}>
                <Card title="10台" bordered={false}>待接单</Card>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <Card title="10台" bordered={false}>处理中</Card>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <Card title="10台" bordered={false}>待确认</Card>
              </Card.Grid>
            </Card>
          </div>
        </PageHeaderLayout>
      </div>
    );
  }
}
