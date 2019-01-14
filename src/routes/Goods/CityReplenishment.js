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
import styles from './CityReplenishment.less'
import StandardTable from '../../components/StandardTable/index';
import {getAccountMenus} from "../../utils/authority";
import moment from "moment/moment";
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const WatchMachine = Form.create()(
  (props) => {
    const {
      WatchMachineModalVisible,
      WatchMachineHandleModalVisibleClick,
      machineList
    } = props;
    const columns = [
      {
        title: "补货时间",
        width: '30%',
        key: "id",
        render: (data, datas, index) => {
          const result = {
            children: data.createTime,
            props: {}
          };
          if (data.count > 1) {
            if (data.start) {
              result.props.rowSpan = data.count;
            } else {
              result.props.rowSpan = 0;
            }
          }
          return result;
        }
      },
      {
        title: "实收数量",
        width: '20%',
        dataIndex: "receiveCount"
      },
      {
        title: "实补数量",
        width: '30%',
        dataIndex: "supplyCount"
      },
      {
        title: "差异数量",
        width: '20%',
        dataIndex: "differCount"
      }
    ];
    const times = {};
    let result = [];
    machineList.forEach((item, index) => {
      let curData = result.find(
        i => i.createTime === item.createTime && i.id === item.id
      );
      if (!times[item.createTime]) {
        times[item.createTime] = {};
      }
      if (!curData) {
        curData = {
          createTime: item.createTime,
          start: !result.some(i => i.createTime === item.createTime),
          id: index,
          receiveCount: item.receiveCount,
          supplyCount: item.supplyCount,
          differCount: item.differCount,
        };
        result.push(curData);
      }
      // curData[item.goodsCode] = item;
    });
    result = result.map((item, index, array) => {
      return {
        ...item,
        count: array.filter(i => i.createTime === item.createTime).length
      };
    });
    console.log('machine', result)
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
        className={styles.statisticsTabs}
      >
        <div style={{ paddingBottom: '30px' }} className={styles.watchMachineBox}>
          <Table columns={columns}
                 dataSource={result}
                 rowKey={record => record.id}
                 pagination={false} />
        </div>
      </Modal>
    );
  });
@connect(({ common, loading, cityReplenishment }) => ({
  common,
  cityReplenishment,
  loading: loading.models.cityReplenishment,
}))
@Form.create()
export default class CityReplenishment extends PureComponent {
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

    account: {},
  };
  componentDidMount() {
    this.getLists();
    // this.getAreaList('')
    // this.getAccountMenus(getAccountMenus())
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
      type: 'cityReplenishment/replenishList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
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


      this.setState({
        keyword: fieldsValue.keyword ? fieldsValue.keyword : '',
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
    });
  };
  getMachineStatus = (item) => {
    this.props.dispatch({
      type: 'cityReplenishment/replenishDetail',
      payload: {
        restParams: {
          id: item.id,
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
            <FormItem label="关键字">
              {getFieldDecorator('keyword')(<Input placeholder="请输入商品ID，商品名称搜索" />)}
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
    );
  }
  render() {
    const {
      cityReplenishment: { list, page, unColumn },
      loading,
    } = this.props;
    const { selectedRows, account } = this.state;
    let columns = [
      {
        title: '商品ID',
        dataIndex: 'goodsId',
        width: '10%',
        key: 'goodsId'
      },
      {
        title: '商品名称',
        width: '10%',
        dataIndex: 'goodsName',
        key: 'goodsName'
      },
      {
        title: '活动名称',
        dataIndex: 'activityName',
        width: '10%',
        key: 'activityName'
      },
      {
        title: '巡检人员',
        dataIndex: 'checkUserName',
        width: '10%',
        key: 'checkUserName'
      },
      {
        title: '实收合计',
        width: '10%',
        dataIndex: 'receiveTotalCount',
        key: 'receiveTotalCount'
      },
      {
        title: '实补合计',
        dataIndex: 'supplyTotalCount',
        width: '10%',
        key: 'supplyTotalCount'
      },
      {
        title: '差异数量',
        dataIndex: 'differTotalCount',
        key: 'differTotalCount',
        render: (text, item) => (
          <div style={{ color: item.differTotalCount >= 0 ? '#000' : 'red' }}>
            {item.differTotalCount}
          </div>
        ),
      },
      {
        title: '操作',
        render: (text, item) => (
          <div style={{ color: '#5076FF', border: 0, background: 'transparent', cursor: 'pointer' }} onClick={() => this.getMachineStatus(item)} >查看明细</div>
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
          <div className={styles.tableList}>
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
