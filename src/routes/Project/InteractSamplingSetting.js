import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Select,
  Input,
  DatePicker,
  Divider,
  Modal,
  Table,
  Tree
} from 'antd';
import StandardTable from '../../components/StandardTable/index';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './InteractSamplingSetting.less';
import {getAccountMenus} from "../../utils/authority";

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const { Option } = Select;
const status = ['未提交', '未开始', '进行中', '已结束', '已超时']
const statusOption = [{id: 0, name: '未提交'}, {id: 1, name: '未开始'}, {id: 2, name: '进行中'}, {id: 3, name: '已结束'}, {id: 4, name: '已超时'}]
const sortOption = [{id: 'goodsSend DESC', name: '按发放率倒序'}, {id: 'goodsSend', name: '按发放率正序'}, {id: 'real_day DESC', name: '按持续时长倒序'}, {id: 'real_day', name: '按持续时长正序'}]
const WatchForm = Form.create()(
  (props) => {
    const { watchModalVisible, modalData, handleWatchModalVisible, allGoods, watchDetailClick, watchMachineDetailClick } = props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const columns = [{
      title: '商品名称',
      dataIndex: 'name',
      width: '70%',
    }, {
      title: '每天可派发数',
      dataIndex: 'userDayNumber',
      render: (text, record) => {
        return (
          <span>{parseInt(record.userDayNumber) === -1 ? '不限' : record.userDayNumber}</span>
        );
      },
    }];
    return (
      <Modal
        title={
          <div class="modalBox">
            <span class="leftSpan"></span>
            <span class="modalTitle">查看活动</span>
          </div>
        }
        visible={watchModalVisible}
        onCancel={() => handleWatchModalVisible()}
        footer={null}
        width={800}
      >
        <div className="manageAppBox">
          <Form onSubmit={this.handleSearch}>
            <FormItem {...formItemLayout} label="1.基本信息">
            </FormItem>
            <FormItem {...formItemLayout} label="互派名称">
              <span>{modalData.name}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="游戏编号">
              <span>{modalData.planCode}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="互派游戏">
              <span>{modalData.gameName}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="预计时长/天">
              <span>{modalData.day}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="负责人">
              <span>{modalData.manager}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="2.商户商品信息">
              <a onClick={() => watchDetailClick(modalData.id)}>查看详情</a>
            </FormItem>
            <FormItem {...formItemLayout} label="3.选择机器">
              <a onClick={() => watchMachineDetailClick(modalData.id)}>查看详情</a>
            </FormItem>
            <FormItem {...formItemLayout} label="4.规则设置">
            </FormItem>
            <FormItem {...formItemLayout} label="4.1活动规则">
            </FormItem>
            <FormItem {...formItemLayout} label="同一用户参与活动次数">
              <span>{modalData.times === -1 ? '不限' : modalData.times}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="同一用户每天参与活动次数">
              <span>{modalData.dayTimes === -1 ? '不限' : modalData.dayTimes}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="同一用户获得商品次数">
              <span>{modalData.dayNumber === -1 ? '不限' : modalData.dayNumber}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="4.2商品信息">
              <Table
                rowKey={record => record.id}
                columns={columns}
                dataSource={allGoods}
                pagination={false}/>
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  });
const WatchMerchantGoodsForm = Form.create()(
  (props) => {
    const {
      watchModalMerchantTreeVisible,
      treeData,
      handleMerchantTreeModalVisible,
      renderTreeNodes } = props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    return (
      <Modal
        title={
          <div class="modalBox">
            <span class="leftSpan"></span>
            <span class="modalTitle">查看商户商品信息</span>
          </div>
        }
        visible={watchModalMerchantTreeVisible}
        onCancel={() => handleMerchantTreeModalVisible()}
        footer={null}
        width={800}
      >
        <div className="manageAppBox">
          <Tree>
            {renderTreeNodes(treeData)}
          </Tree>
        </div>
      </Modal>
    );
  });
const WatchMachineGoodsForm = Form.create()(
  (props) => {
    const {
      watchModalMerchantTreeVisible,
      treeData,
      handleMerchantTreeModalVisible,
      renderTreeNodes } = props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    return (
      <Modal
        title={
          <div class="modalBox">
            <span class="leftSpan"></span>
            <span class="modalTitle">查看机器商品信息</span>
          </div>
        }
        visible={watchModalMerchantTreeVisible}
        onCancel={() => handleMerchantTreeModalVisible()}
        footer={null}
        width={800}
      >
        <div className="manageAppBox">
          <Tree>
            {renderTreeNodes(treeData)}
          </Tree>
        </div>
      </Modal>
    );
  });
@connect(({ common, loading, interactSamplingSetting }) => ({
  common,
  interactSamplingSetting,
  loading: loading.models.interactSamplingSetting,
}))
@Form.create()
export default class areaSettingList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    pageNo: 1,
    status: '',
    account: {},
    keyword: '',
    orderBy: '',

    watchModalVisible: false,
    modalData: {},
    allGoods: [],

    watchModalMerchantTreeVisible: false,
    treeData: [],
    watchModalMachineTreeVisible: false,
    machineTreeData: [],
  };
  componentDidMount() {
    this.getLists();
    // this.getAccountMenus(getAccountMenus())
  }
  getAccountMenus = (setAccountMenusList) => {
    if (setAccountMenusList) {
      const pointSettingMenu = setAccountMenusList.filter((item) => item.path === 'project')[0]
        .children.filter((item) => item.path === 'sampling-setting')
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
      type: 'interactSamplingSetting/interactLists',
      payload: {
        restParams: {
          status: this.state.status,
          pageNo: this.state.pageNo,
          keyword: this.state.keyword,
          orderBy: this.state.orderBy,
        },
      },
    });
  }
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
      this.setState({
        pageNo: 1,
        keyword: fieldsValue.keyword ? fieldsValue.keyword : '',
        status: fieldsValue.status >= 0 ? fieldsValue.status : '',
        orderBy: fieldsValue.orderBy ? fieldsValue.orderBy : '',
      }, () => {
        this.getLists();
      });
    });
  };
  giveUp = (item) => {
    this.props.dispatch({
      type: 'interactSamplingSetting/interactUpdate',
      payload: {
        params: {
          id: item.id,
          type: 2,
        },
      },
    }).then((res) => {
      if (res && res.code === 0) {
       this.getLists()
      }
    });
  }
  handleWatchModalVisible = (flag) => {
    this.setState({
      watchModalVisible: !!flag,
      modalData: {},
    });
  }
  // interactDetail
  getInteractDetail = (item) => {
    this.props.dispatch({
      type: 'interactSamplingSetting/interactDetail',
      payload: {
        params: {
          id: item.id
        },
      },
    }).then((res) => {
      if (res) {
        this.setState({
          watchModalVisible: true,
          modalData: res
        })
      }
    });
    this.getGoods(item)
  }
  // 获取所有商品开始
  getGoods = (item) => {
    let params = { interactId: item.id }
    this.props.dispatch({
      type: 'interactSamplingSetting/getInteractGoodsList',
      payload: {
        params,
      },
    }).then((res) => {
      if (res && res.code === 0) {
        this.setState({
          allGoods: res.data
        })
      }
    });
  }
  watchDetailClick = (interactId) => {
    this.props.dispatch({
      type: 'interactSamplingSetting/getMerchantTree',
      payload: {
        restParams: {
          interactId,
        },
      },
    }).then((res) => {
      if (res && res.code === 0) {
        this.setState({
          watchModalMerchantTreeVisible: true,
          treeData: res.data
        })
      }
    });
  }
  handleMerchantTreeModalVisible = (flag) => {
    this.setState({
      watchModalMerchantTreeVisible: !!flag,
    });
  }
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  }
  watchMachineDetailClick = (interactId) => {
    this.props.dispatch({
      type: 'interactSamplingSetting/getMachineTree',
      payload: {
        restParams: {
          interactId,
        },
      },
    }).then((res) => {
      if (res && res.code === 0) {
        this.setState({
          watchModalMachineTreeVisible: true,
          machineTreeData: res.data
        })
      }
    });
  }
  handleMachineTreeModalVisible = (flag) => {
    this.setState({
      watchModalMachineTreeVisible: !!flag,
    });
  }
  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={9} sm={24}>
            <FormItem label="互派状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择">
                  {statusOption.map((item) => {
                    return (
                      <Option value={item.id} key={item.id}>{item.name}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={15} sm={24}>
            <span>
              <FormItem>
                {getFieldDecorator('keyword')(
                  <Input placeholder="请输入互派名称，互派游戏，负责人，机器编号，机器点位，商品编号，商品名称，商户信息等" />
                )}
              </FormItem>
            </span>
          </Col>
        </Row>
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          {/*<Col md={8} sm={24}>*/}
            {/*<FormItem label="创建时间">*/}
              {/*{getFieldDecorator('creatTime')(*/}
                {/*<DatePicker placeholder="请选择创建时间" />*/}
              {/*)}*/}
            {/*</FormItem>*/}
          {/*</Col>*/}
          <Col md={8} sm={24}>
            <FormItem label="排序">
              {getFieldDecorator('orderBy')(
                <Select placeholder="请选择排序方式">
                  {sortOption.map((item) => {
                    return (
                      <Option value={item.id} key={item.id}>{item.name}</Option>
                    );
                  })}
                </Select>
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
    );
  }
  render() {
    const {
      interactSamplingSetting: { list, page, unColumn },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    let columns = [
      {
        title: '互派名称',
        width: '10%',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '互动游戏',
        dataIndex: 'gameName',
        key: 'gameName',
        width: '10%',
      },
      {
        title: '互派机器数',
        dataIndex: 'merchantNum',
        key: 'merchantNum',
        width: '10%',
      },
      {
        title: '互派商品数',
        width: '10%',
        dataIndex: 'goodsNum',
        key: 'goodsNum',
      },
      {
        title: '互派持续时长/天',
        dataIndex: 'realDay',
        key: 'realDay',
        render: (text, item) => (
          <Fragment>
            <span>{item.realDay ? item.realDay : 0}/{item.day}</span>
          </Fragment>
        ),
        width: '15%',
      },
      {
        title: '发放率',
        dataIndex: 'realNum',
        key: 'realNum',
        render: (text, item) => (
          <Fragment>
            <span>{item.realNum ? item.realNum : 0}/{item.number ? item.number : 0}</span>
          </Fragment>
        ),
        width: '10%',
      },
      {
        title: '负责人 创建时间',
        dataIndex: 'managerCreateTime',
        key: 'managerCreateTime',
        render: (text, item) => (
          <Fragment>
            <span>{item.manager}{item.createTime}</span>
          </Fragment>
        ),
        width: '30%',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render (val) {
          if (val) {
            return <span>{status[val]}</span>
          }
        }
      },
      {
        fixed: 'right',
        width: 150,
        title: '操作',
        render: (text, item) => (
          <Fragment>
            <a
              style={{ display: parseInt(item.status) === 3 ? 'none' : ''}}
              onClick={() => this.props.history.push({pathname: `/project/addBasicInteractSampling`, query: {id: item.id}})}
            >详情</a>
            <Divider type="vertical" style={{ display: parseInt(item.status) === 3 ? 'none' : ''}}/>
            <a>统计</a>
            <Divider type="vertical" style={{ display: parseInt(item.status) === 3 ? 'none' : ''}}/>
            <a onClick={() => this.giveUp(item)} style={{ display: parseInt(item.status) === 3 ? 'none' : ''}}>结束</a>
            <Divider type="vertical"/>
            <a onClick={() => this.getInteractDetail(item)}>查看</a>
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
    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
          <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary"
                      onClick={() => this.props.history.push({pathname: '/project/addBasicInteractSampling'})}>
                新建
              </Button>
            </div>
            <div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={list}
                page={page}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                scrollX={1500}
              />
            </div>
          </div>
        </Card>
        <WatchForm
          watchModalVisible={this.state.watchModalVisible}
          modalData={this.state.modalData}
          handleWatchModalVisible={this.handleWatchModalVisible}
          allGoods={this.state.allGoods}
          watchDetailClick={this.watchDetailClick}
          watchMachineDetailClick={this.watchMachineDetailClick}
          />
        <WatchMerchantGoodsForm
          watchModalMerchantTreeVisible={this.state.watchModalMerchantTreeVisible}
          treeData={this.state.treeData}
          handleMerchantTreeModalVisible={this.handleMerchantTreeModalVisible}
          renderTreeNodes={this.renderTreeNodes}
          />
        <WatchMachineGoodsForm
          watchModalMerchantTreeVisible={this.state.watchModalMachineTreeVisible}
          treeData={this.state.machineTreeData}
          handleMerchantTreeModalVisible={this.handleMachineTreeModalVisible}
          renderTreeNodes={this.renderTreeNodes}
        />
      </PageHeaderLayout>
    );
  }
}
