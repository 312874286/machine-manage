import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Cascader,
  Table,
  Modal,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './User.less';
import UserTable from '../../components/Player/userTable';
import LogModal from '../../components/LogModal';
import {getAccountMenus} from "../../utils/authority";
const { Option } = Select;

const sexOptions = ['男', '女', '未知']
const FormItem = Form.Item;
const WatchPoint = Form.create()(
  (props) => {
    const { WatchPointModalVisible, WatchPointHandleModalVisibleClick, pointList } = props;
    const pointColumns = [{
      title: '点位',
      dataIndex: 'area',
      align: 'left',
      width: '80%'
    }, {
      title: '登陆时间',
      dataIndex: 'loginTime',
      align: 'left',
      width: '20%'
    }];
    return (
      <Modal
        title={
          <div class="modalBox">
            <span class="leftSpan"></span>
            <span class="modalTitle">查看具体点位</span>
          </div>
        }
        width={800}
        visible={WatchPointModalVisible}
        onCancel={() => WatchPointHandleModalVisibleClick()}
        footer={null}
      >
        <div style={{ paddingBottom: '30px' }} className={styles.watchPointBox}>
          <Table columns={pointColumns} dataSource={pointList} rowKey={record => record.area} pagination={false} />
        </div>
      </Modal>
    );
  });
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
    options: [],
    sex: '',
    time: '',
    code: '',
    WatchPointModalVisible: false,
    pointList: [],

    account: {}
  };

  componentDidMount = () => {
    this.getList();
    this.getAccountMenus(getAccountMenus())
    this.loadData()
  }
  getAccountMenus = (setAccountMenusList) => {
    if (setAccountMenusList) {
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
  }
  // 获取列表
  getList = () => {
    this.props.dispatch({
      type: 'player/getList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          keyword: this.state.keyword,
          sex: this.state.sex,
          time: this.state.time,
          code: this.state.code,
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
  // 四级联动开始
  loadData = (selectedOptions) => {
    let code = ''
    if (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;
      code = targetOption.value
    }
    this.props.dispatch({
      type: 'common/getProvinceCityAreaTradeArea',
      payload: {
        restParams: {
          code,
        },
      },
    }).then((res) => {
      let options = []
      if (selectedOptions) {
        selectedOptions[selectedOptions.length - 1].loading = false;
        selectedOptions[selectedOptions.length - 1].children = res
        options = [...this.state.options]
      } else {
        options = res
      }
      this.setState({
        options,
      });
    });
  }
  // 搜索
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let code = ''
      if (fieldsValue.provinceCityAreaTrade) {
        if (fieldsValue.provinceCityAreaTrade.length > 0) {
          code = fieldsValue.provinceCityAreaTrade[fieldsValue.provinceCityAreaTrade.length - 1]
        }
      }
      this.setState({
        pageNo: 1,
        keyword: fieldsValue.keyword ? fieldsValue.keyword : '',
        code,
        sex: fieldsValue.sex ? fieldsValue.sex : '',
        time: fieldsValue.time ? fieldsValue.time.format('YYYY-MM-DD') : '',
      }, () => {
        this.getList();
      });
    });
  };
  getPoint = (item) => {
    this.setState({
      modalData: item,
    }, () => {
      // 获取数据
      this.props.dispatch({
        type: 'player/getAreaList',
        payload: {
          restParams: {
            userId: item.id,
          },
        },
      }).then((result) => {
        if (result && result.code === 0) {
          this.setState({
            pointList: result.data,
          }, () => {
            this.setState({
              WatchPointModalVisible: true,
            });
          });
        }
      });
    })
  }
  WatchPointHandleModalVisibleClick = () => {
    this.setState({
      WatchPointModalVisible: false,
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
                <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                  <Col md={8} sm={24}>
                    <FormItem label="省市区">
                      {getFieldDecorator('provinceCityAreaTrade')(
                        <Cascader
                          placeholder="请选择"
                          options={this.state.options}
                          loadData={this.loadData}
                          changeOnSelect
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={24}>
                    <FormItem label="注册时间">
                      {getFieldDecorator('time')(
                        <DatePicker style={{ width: '100%' }}/>
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={24}>
                    <FormItem label="性别">
                      {getFieldDecorator('sex')(
                        <Select placeholder="请选择" style={{ width: '100%' }}>
                          {sexOptions.map((item) => {
                            return (
                              <Option key={item} value={item}>{item}</Option>
                            );
                          })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                  <Col md={8} sm={24}>
                    <FormItem>
                      {getFieldDecorator('keyword')(
                        <Input placeholder="请输入手机号码、点位名称、 标签" />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={24}>
                  <span>
                    <FormItem>
                      <Button onClick={this.handleFormReset}>
                        重置
                      </Button>
                      <Button className={styles.serach} style={{ marginLeft: 8 }} type="primary" htmlType="submit">
                        查询
                      </Button>
                    </FormItem>
                </span>
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
              getPoint={this.getPoint}
            />
          </div>
        </Card>
        <WatchPoint
          WatchPointModalVisible={this.state.WatchPointModalVisible}
          WatchPointHandleModalVisibleClick={this.WatchPointHandleModalVisibleClick}
          pointList={this.state.pointList}
        />
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
