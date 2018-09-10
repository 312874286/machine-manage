import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './User.less';
import UserTable from '../../components/Player/userTable';
import LogModal from '../../components/LogModal';
import {getAccountMenus} from "../../utils/authority";

const FormItem = Form.Item;
@connect(({ player, loading, log }) => ({
  player,
  log,
  loading: loading.models.player,
}))
@Form.create()
export default class PlayerUser extends PureComponent {
  state = {
    pageNo: 1,
    keyword: '',
    logModalVisible: false,
    logModalLoading: false,
    logId: '',
    logModalPageNo: 1,

    account: {}
  };

  componentDidMount = () => {
    this.getList();
    this.getAccountMenus(getAccountMenus())
  }
  getAccountMenus = (setAccountMenusList) => {
    const pointSettingMenu = setAccountMenusList.filter((item) => item.path === 'player')[0]
      .children.filter((item) => item.path === 'user')
    var obj = {}
    if (pointSettingMenu[0].children) {
      pointSettingMenu[0].children.forEach((item, e) => {
        obj[item.path] = true;
      })
      this.setState({
        account: obj
      })
    }
  }
  // 获取列表
  getList = () => {
    this.props.dispatch({
      type: 'player/getList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          keyword: this.state.keyword,
        },
      },
    });
  }

  // 日志相关
  getLogList = () => {
    this.props.dispatch({
      type: 'log/getLogList',
      payload: {
        restParams: {
          code: this.state.logId,
          pageNo: this.state.logModalPageNo,
        },
      },
    }).then(() => {
      this.setState({
        logModalLoading: false,
      });
    });
  }

    // 搜索
    handleSearch = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, fieldsValue) => {
        if (err) return;

        this.setState({
          keyword: fieldsValue.keyword,
        }, () => {
          this.getList();
        });
      });
    }


  // 分页
  handleTableChange = (pagination) => {
    const { current } = pagination;
    this.setState({
      pageNo: current,
    }, () => {
      this.getList();
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
  // 重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      pageNo: 1,
      keyword: '',
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { player: { list, page, unColumn }, log: { logList, logPage }, loading } = this.props;
    const { keyword, account } = this.state;

    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={10} sm={12}>
                    <FormItem>
                      {getFieldDecorator('keyword', {
                        initialValue: keyword,
                      })(
                        <Input placeholder="请输入用户昵称、渠道名称" />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={7} sm={12}>
                    <FormItem>
                      <Button onClick={this.handleFormReset} >重置</Button>
                      <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>查询</Button>
                    </FormItem>
                    {/*<span className={styles.submitButtons}>*/}
                     {/**/}
                    {/*</span>*/}
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </Card>
        <Card bordered={false}>
          <div style={{ display: !account.list ? 'none' : '' }}>
            <UserTable
              loading={loading}
              data={list}
              page={page}
              unColumn={unColumn}
              handleTableChange={this.handleTableChange}
              onLogClick={this.handleLogClick}
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
