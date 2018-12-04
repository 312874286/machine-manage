import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Menu,
  Modal,
  Cascader,
  Table,
  Alert,
} from 'antd';
import StandardTable from '../../components/StandardTable/index';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './AreaSetting.less';
import LogModal from '../../components/LogModal/index';
import {getAccountMenus} from "../../utils/authority";


const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['processing', 'default', 'success', 'error'];
const status = ['运行中', '关闭', '已上线', '异常'];

const WatchMachine = Form.create()(
  (props) => {
    const { WatchMachineModalVisible, WatchMachineHandleModalVisibleClick, machineList } = props;
    const machineColumns = [{
      title: '入场时间',
      dataIndex: 'createTime',
      align: 'center',
      width: '20%'
    }, {
      title: '入场前点位',
      dataIndex: 'oldLocale',
      align: 'center',
      width: '40%',
      render: record => {
        return (
          record  ||
          "-"
        );
      }
    }, {
      title: '入场后点位',
      dataIndex: 'locale',
      align: 'center',
      width: '40%',
      render: record => {
        return (
          record ||
          "-"
        );
      }
    }];
    return (
      <Modal
        title={
          <div class="modalBox">
            <span class="leftSpan"></span>
            <span class="modalTitle">查看明细</span>
          </div>
        }
        width={800}
        visible={WatchMachineModalVisible}
        onCancel={() => WatchMachineHandleModalVisibleClick()}
        footer={null}
      >
        <div style={{ margin: '10px 20px 20px 20px' }}>
          <Alert message="如果入场前和入场后点位相同，可能是由于机器更换硬件导致" type="warning" showIcon />
        </div>
        <div style={{ paddingBottom: '30px' }} className={styles.watchMachineBox}>
          <Table columns={machineColumns} dataSource={machineList} rowKey={record => record.id} pagination={false} />
        </div>
      </Modal>
    );
  });
@connect(({ common, loading, enterTimeDetail, log }) => ({
  common,
  enterTimeDetail,
  loading: loading.models.enterTimeDetail,
  log,
}))
@Form.create()
export default class areaSettingList extends PureComponent {
  state = {
    modalVisible: false,
    formValues: {},
    pageNo: 1,
    code: '',
    keyword: '',
    account: {},
    areaList: [],
    options: [],
    WatchMachineModalVisible: false,
    machineList: [],
  };
  componentDidMount() {
    this.getLists();
    this.getAreaSerach('')
    // this.getAccountMenus(getAccountMenus())
  }
  getAccountMenus = (setAccountMenusList) => {
    if (setAccountMenusList) {
      const pointSettingMenu = setAccountMenusList.filter((item) => item.path === 'machine')[0]
        .children.filter((item) => item.path === 'enterTimeDetail')
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
  getLists = () => {
    this.props.dispatch({
      type: 'enterTimeDetail/machineLocaleDetailList',
      payload: {
        restParams: {
          code: this.state.code,
          pageNo: this.state.pageNo,
          keyword: this.state.keyword
        },
      },
    });
  }
  // 四级联动开始
  // 获取商圈信息
  getArea = (selectedOptions) => {
    let code = '';
    let targetOption = null;
    if (selectedOptions) {
      targetOption = selectedOptions[selectedOptions.length - 1];
      code = targetOption.value;
      targetOption.loading = true;
    }
    this.props.dispatch({
      type: 'common/getProvinceCity',
      payload: {
        restParams: {
          code,
        },
      },
    }).then((data) => {
      if (selectedOptions) {
        targetOption.loading = false;
        targetOption.children = data;
        this.setState({
          areaList: [...this.state.areaList],
        });
      } else {
        this.setState({
          areaList: data,
        });
      }
    });
  }
  getAreaSerach = (selectedOptions) => {
    let code = '';
    let targetOption = null;
    if (selectedOptions) {
      targetOption = selectedOptions[selectedOptions.length - 1];
      code = targetOption.value;
      targetOption.loading = true;
    }
    this.props.dispatch({
      type: 'common/getProvinceCityAreaTradeArea',
      payload: {
        restParams: {
          code,
        },
      },
    }).then((data) => {
      if (selectedOptions) {
        targetOption.loading = false;
        targetOption.children = data;
        this.setState({
          options: [...this.state.options]
        });
      } else {
        this.setState({
          options: data,
        });
      }
    });
  }
  // 四级联动结束
  // 分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    const { current } = pagination;
    // console.log('params', params)
    this.setState({
      pageNo: current,
    }, () => {
      this.getLists();
    });
  };
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
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };
  // 搜索
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let localCode = ''
      if (fieldsValue.provinceCityAreaTrade) {
        if (fieldsValue.provinceCityAreaTrade.length > 0) {
          localCode = fieldsValue.provinceCityAreaTrade[fieldsValue.provinceCityAreaTrade.length - 1]
        }
      }
      this.setState({
        pageNo: 1,
        code: localCode,
        keyword: fieldsValue.keyword ? fieldsValue.keyword : '',
      }, () => {
        this.getLists();
      });
    });
  };
  //
  WatchMachineHandleModalVisibleClick = () => {
    this.setState({
      WatchMachineModalVisible: false,
    });
  }
  // 查看
  getMachineStatus = (item) => {
    console.log('item', item)
    // 获取数据
    this.props.dispatch({
      type: 'enterTimeDetail/machineLocaleDetail',
      payload: {
        restParams: {
          machineId: item.id,
        },
      },
    }).then((result) => {
      // console.log(result)
      if (result && result.code === 0) {
        this.setState({
          machineList: result.data,
        }, () => {
          this.setState({
            WatchMachineModalVisible: true,
          });
        });
      }
    });
  }
  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={9} sm={24}>
            <FormItem label="省市区">
              {getFieldDecorator('provinceCityAreaTrade')(
                <Cascader
                  placeholder="请选择"
                  options={this.state.options}
                  loadData={this.getAreaSerach}
                  changeOnSelect
                />
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem>
              {getFieldDecorator('keyword')(<Input placeholder="请输入机器编号、机器点位搜索" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
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
    );
  }
  render() {
    const {
      enterTimeDetail: { list, page, unColumn },
      loading,
      log: { logList, logPage },
    } = this.props;
    const { selectedRows, modalVisible, editModalConfirmLoading, modalData, modalType, account, areaList } = this.state;
    let columns = [
      {
        title: '机器编号',
        width: '15%',
        dataIndex: 'machineCode',
        key: 'machineCode'
      },
      {
        title: '机器点位',
        width: '30%',
        dataIndex: 'locale',
        key: 'locale'
      },
      {
        title: '首次入场',
        width: '20%',
        dataIndex: 'firstTime',
        key: 'firstTime'
      },
      {
        title: '最后一次入场',
        dataIndex: 'lastTime',
        key: 'lastTime'
      },
      {
        fixed: 'right',
        width: 150,
        title: '明细',
        render: (text, item) => (
          <Fragment>
            <a onClick={() => this.getMachineStatus(item)}>查看</a>
          </Fragment>
        ),
      },
    ];
    if (unColumn) {
      let leg = columns.length
      for (let i = leg - 1; i >= 0; i--) {
        for (let j = 0; j < unColumn.length; j++) {
          if (columns[i]) {
            if (columns[i].key === unColumn[j]) {
              columns.splice(i, 1)
              continue;
            }
          }
        }
      }
    }
    const width = 90/(columns.length - 1)
    for (let i = 0; i < columns.length; i++) {
      if (i < columns.length - 2) {
        columns[i].width = width + '%'
      }
      if (i === columns.length - 2) {
        columns[i].width = ''
      }
    }
    // this.state.options = this.props.common.list
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
          <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={list}
                page={page}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                scrollX={500}
              />
            </div>
          </div>
        </Card>
        <WatchMachine
          WatchMachineModalVisible={this.state.WatchMachineModalVisible}
          WatchMachineHandleModalVisibleClick={this.WatchMachineHandleModalVisibleClick}
          machineList={this.state.machineList}
        />
      </PageHeaderLayout>
    );
  }
}
