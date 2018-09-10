import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Row,
  Col,
  Input,
  Button,
  Cascader,
  DatePicker,
  Modal,
  Table
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './replenish.less'
import StandardTable from '../../components/StandardTable/index';
import {getAccountMenus} from "../../utils/authority";
const FormItem = Form.Item;
const { RangePicker } = DatePicker;


const WatchMachine = Form.create()(
  (props) => {
    const { WatchMachineModalVisible, WatchMachineHandleModalVisibleClick, machineList } = props;
    const machineColumns = [{
      title: '商品名称',
      dataIndex: 'goodsName',
      align: 'left',
      width: '85%'
    }, {
      title: '补货数量',
      dataIndex: 'subCount',
      align: 'left',
      width: '15%'
    }];
    return (
      <Modal
        title={
          <div class="modalBox">
            <span class="leftSpan"></span>
            <span class="modalTitle">查看补货明细</span>
          </div>
        }
        width={800}
        visible={WatchMachineModalVisible}
        onCancel={() => WatchMachineHandleModalVisibleClick()}
        footer={null}
      >
        <div style={{ paddingBottom: '30px' }} className={styles.watchMachineBox}>
          <Table columns={machineColumns} dataSource={machineList} rowKey={record => record.machineCode} pagination={false} />
        </div>
      </Modal>
    );
  });
@connect(({ common, loading, replenish }) => ({
  common,
  replenish,
  loading: loading.models.replenish,
}))
@Form.create()
export default class replenish extends PureComponent {
  state = {
    WatchMachineModalVisible: false,
    machineList: [],
    pageNo: 1,
    keyword: '',
    beginTime: '',
    endTime: '',
    areaCode: '',
    selectedRows: [],
    options: [],

    account: {}
  };
  componentDidMount() {
    this.getLists();
    this.getAreaList('')
    this.getAccountMenus(getAccountMenus())
  }
  getAccountMenus = (setAccountMenusList) => {
    if (setAccountMenusList) {
      const pointSettingMenu = setAccountMenusList.filter((item) => item.path === 'check')[0]
        .children.filter((item) => item.path === 'fault')
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
      type: 'replenish/replenishList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
        },
        params: {
          keyword: this.state.keyword,
          areaCode: this.state.areaCode,
          beginTime: this.state.beginTime,
          endTime: this.state.endTime,
        }
      },
    });
  }
  // 分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
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
  // 搜索
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let areaCode = ''
      let beginTime = ''
      let endTime = ''
      if (fieldsValue.areaCode) {
        if (fieldsValue.areaCode.length > 0) {
          areaCode = fieldsValue.areaCode[fieldsValue.areaCode.length - 1];
        }
      }
      if (fieldsValue.time) {
        beginTime = fieldsValue.time[0].format('YYYY-MM-DD')
        endTime = fieldsValue.time[1].format('YYYY-MM-DD')
      }

      this.setState({
        keyword: fieldsValue.keyword ? fieldsValue.keyword : '',
        beginTime,
        endTime,
        areaCode,
      }, () => {
        this.getLists();
      });
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
      localCode: '',
      beginTime: '',
      endTime: '',
    });
  };
  getAreaList = (selectedOptions) => {
    let targetOption = null;
    let code = ''
    if (selectedOptions) {
      targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;
      code = targetOption.value
    }
    this.props.dispatch({
      type: 'common/getProvinceCityAreaTradeArea',
      payload: {
        restParams: {
          code,
        }
      },
    }).then((res) => {
      if (!selectedOptions) {
        this.setState({
          options: res,
        });
      } else {
        targetOption.loading = false;
        targetOption.children = res
        this.setState({
          options: [...this.state.options],
        });
      }
    });
  }
  getMachineStatus = (item) => {
    this.props.dispatch({
      type: 'replenish/replenishDetail',
      payload: {
        restParams: {
          batchNo: item.batchNo
        },
      },
    }).then((res) => {
      if (res) {
        this.setState({
          machineList: res,
        }, () => {
          this.setState({
            WatchMachineModalVisible: true,
          });
        });
      }
    });
  }
  WatchMachineHandleModalVisibleClick = () => {
    this.setState({
      WatchMachineModalVisible: false,
    });
  }
  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="省市区商圈">
              {getFieldDecorator('areaCode')(
                <Cascader
                  placeholder="请选择"
                  options={this.state.options}
                  loadData={this.getAreaList}
                  changeOnSelect
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem>
              {getFieldDecorator('keyword')(<Input placeholder="请输入机器编码、补货人、手机号搜索" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span>
               <FormItem>
                  {getFieldDecorator('time')(<RangePicker onChange={this.onChange}/>)}
               </FormItem>
            </span>
          </Col>
        </Row>
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
           <Col md={8} sm={24}>
             <FormItem></FormItem>
             </Col>
           <Col md={8} sm={24}>
             <FormItem></FormItem>
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
    );
  }
  render() {
    const {
      replenish: { list, page, unColumn },
      loading,
    } = this.props;
    const { selectedRows, account } = this.state;
    let columns = [
      {
        title: '补货时间',
        dataIndex: 'createTime',
        width: '15%',
        key: 'createTime'
      },
      {
        title: '机器编号',
        width: '10%',
        dataIndex: 'machineCode',
        key: 'machineCode'
      },
      {
        title: '机器点位',
        dataIndex: 'localeStr',
        width: '30%',
        key: 'localeStr'
      },
      {
        title: '补货人',
        dataIndex: 'name',
        width: '10%',
        key: 'name',
        align: 'center'
      },
      {
        title: '手机号',
        width: '10%',
        dataIndex: 'phone',
        key: 'phone'
      },
      {
        title: '负责区域',
        dataIndex: 'area',
        width: '10%',
        key: 'area'
      },
      {
        title: '补货明细',
        dataIndex: 'stockoutInfo',
        render: (text, item) => (
          <div style={{ color: '#5076FF', border: 0, background: 'transparent', cursor: 'pointer' }} onClick={() => this.getMachineStatus(item)} >查看</div>
        ),
        key: 'detail'
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
    const width = 100/(columns.length)
    for (let i = 0; i < columns.length; i++) {
      columns[i].width = width + '%'
    }
    // console.log('list', list)
    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
          <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList} style={{ display: !account.list ? 'none' : ''}}>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={list}
              page={page}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              scrollX={1000}
              scrollY={(document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 100 + 50)}
            />
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
