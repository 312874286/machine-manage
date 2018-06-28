import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Divider,
  Table,
  Alert,
  Modal,
  message,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ChildDisease.less';
import { childDiseaseStatusData } from '../../common/config/order';
import LogModal from '../../components/LogModal';

const { RangePicker } = DatePicker;
const { Option } = Select;
const FormItem = Form.Item;

@connect(({ childDisease, loading, log }) => ({
  childDisease,
  log,
  loading: loading.models.childDisease,
}))
@Form.create()
export default class ChildDisease extends PureComponent {
  state = {
    list: {
      datas: [],
      page: {
        total: 0,
        pageSize: 20,
        current: 1,
      },
    },
    log: {
      datas: [],
      page: {
        total: 0,
        pageSize: 20,
        current: 1,
      },
    },
    detail: {
      data: undefined,
      carId: undefined,
      doctorId: undefined,
    },
    startDate: '',
    endDate: '',
    status: '',
    detailModalVisible: false,
    detailGoodsModalVisible: false,
    detailCancelModalVisible: false,
    logModalVisible: false,
    logModalLoading: false,
    logId: '',
    logModalPageNo: 1,
  };

  componentDidMount = () => {
    this.getList();
  }

  // 获取列表
  getList = () => {
    this.props.dispatch({
      type: 'childDisease/orders',
      payload: {
        restParams: {
          queryString: {
            pageNo: this.state.list.page.current,
            startTime: this.state.startDate,
            endTime: this.state.endDate,
            status: this.state.status,
          },
        },
      },
    }).then((resp) => {
      if (resp.code !== 0) return;
      const list = { ...this.state.list };
      list.datas = resp.data;
      list.page.pageSize = resp.page.pageSize;
      list.page.total = resp.page.totalCount;
      this.setState({ list });
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

  updateOrder = () => {
    const {
      data: {
        paasOrdersChildrenDisease: { id, status },
        good,
      },
      carId,
      doctorId } = this.state.detail;
    const params = { id };
    if (status === 1) {
      if (!good || !good.id) {
        message.warn('请设置关联套餐');
        return;
      } else if (!carId) {
        message.warn('请设置车辆');
        return;
      }
      params.goodsId = good.id;
      params.carId = carId;
    } else if (status === 2 || status === 3) {
      if (!doctorId) {
        message.warn('请选择出诊医生');
        return;
      }
      params.doctorId = doctorId;
    }
    this.props.dispatch({
      type: 'childDisease/updateOrder',
      payload: {
        params,
      },
    }).then((resp) => {
      if (resp.code !== 0) return;
      message.success('保存成功');
      this.handleDetailModalVisible();
      this.getList();
    });
  }

  // 分页
  handleTableChange = (pagination) => {
    const { current } = pagination;
    const list = { ...this.state.list };
    list.page.current = current;
    this.setState({
      list,
    }, () => {
      this.getList();
    });
  }

  // 搜索
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        startDate: fieldsValue.time && fieldsValue.time.length === 2 ? fieldsValue.time[0].format('YYYY-MM-DD') : '',
        endDate: fieldsValue.time && fieldsValue.time.length === 2 ? fieldsValue.time[1].format('YYYY-MM-DD') : '',
        status: fieldsValue.status,
      }, () => {
        this.getList();
      });
    });
  }

  handleDetail = (data) => {
    this.props.dispatch({
      type: 'childDisease/order',
      payload: {
        restParams: {
          queryString: {
            id: data.id,
          },
        },
      },
    }).then((resp) => {
      if (resp.code !== 0) return;
      const detail = { ...this.state.detail };
      detail.data = resp.data;
      detail.doctorId = (resp.data.doctor && resp.data.doctor.id) || undefined;
      detail.carId = (resp.data.car && resp.data.car.id) || undefined;
      this.setState({
        detail,
        detailModalVisible: true,
      });
    });
  }

  handleDetailModalVisible = () => {
    this.setState({
      detail: {
        data: null,
        carId: undefined,
        doctorId: undefined,
      },
      detailModalVisible: false,
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

  renderTable = () => {
    const { list: { datas, page } } = this.state;
    const { loading } = this.props;
    const paginationProps = {
      showTotal: (total) => {
        return `共${total}条数据  每页${page.pageSize}条`;
      },
      ...page,
    };
    const columns = [
      {
        title: '预约单号',
        dataIndex: 'appNum',
      },
      {
        title: '联系电话',
        dataIndex: 'phone',
      },
      {
        title: '下单时间',
        dataIndex: 'createTime',
      },
      {
        title: '预约状态',
        dataIndex: 'status',
        render: (text, record) => {
          const status = childDiseaseStatusData.find(i => i.id === record.status);
          return status && status.name;
        },
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <Fragment>
              <a onClick={() => { this.handleDetail(record); }}>详情</a>
              <Divider type="vertical" />
              <a onClick={() => { this.handleLogClick(record); }}>日志</a>
            </Fragment>
          );
        },
      }];
    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={(
              <div>
                <Row>
                  <Col span={6}>
                    查询结果：共{paginationProps.total}条数据&nbsp;&nbsp;每页{paginationProps.pageSize}条
                  </Col>
                </Row>
              </div >
            )}
            type="info"
            showIcon
          />
        </div>
        <Table
          rowKey={record => record.id}
          dataSource={datas}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          loading={loading}
        />
      </div>
    );
  }

  renderGoods = () => {
    const { detail: { data }, detailGoodsModalVisible } = this.state;
    const goods = (data && data.goods) || [];
    const handleSelect = (good) => {
      const detail = { ...this.state.detail };
      detail.data.good = good;
      this.setState({
        detail,
        detailGoodsModalVisible: false,
      });
    };
    const columns = [
      {
        title: '套餐ID',
        dataIndex: 'code',
        width: 170,
      },
      {
        title: '套餐名称',
        dataIndex: 'name',
      },
      {
        title: '套餐价格(元)',
        width: 120,
        dataIndex: 'totalPrice',
      }, {
        title: '售卖状态',
        width: 100,
        render: (text, record) => {
          return record.sellState === 0 ? '停售' : '在售';
        }
      },
      {
        title: '操作',
        width: 80,
        render: (text, record) => {
          return (
            <Fragment>
              <a onClick={() => { handleSelect(record); }} disabled={!record.sellState}>选择</a>
            </Fragment>
          );
        },
      }];
    return (
      <Modal
        title="关联套餐"
        visible={detailGoodsModalVisible}
        footer={null}
        width={720}
        className={styles.goodsModal}
        onCancel={() => { this.setState({ detailGoodsModalVisible: false }); }}
      >
        <Table
          rowKey={record => record.id}
          dataSource={goods}
          columns={columns}
          pagination={false}
        />
      </Modal>
    );
  }

  renderCancelReason = () => {
    const { detail: { data: { paasOrdersChildrenDisease: { cancelReason, id } } }, detailCancelModalVisible } = this.state;
    const change = (e) => {
      const detail = { ...this.state.detail };
      detail.data.paasOrdersChildrenDisease.cancelReason = e.target.value;
      this.setState({
        detail,
      });
    };
    const cancel = () => {
      this.setState({
        detailCancelModalVisible: false,
      });
    };
    const confirm = () => {
      if (!cancelReason) {
        message.warn('请输入取消原因');
        return;
      }
      this.props.dispatch({
        type: 'childDisease/cancelOrder',
        payload: {
          params: {
            id,
            reason: cancelReason,
          },
        },
      }).then((resp) => {
        if (resp.code !== 0) return;
        message.success('取消成功');
        this.setState({ detailCancelModalVisible: false }, () => {
          this.handleDetailModalVisible();
          this.getList();
        });
      });
    };
    return (
      <Modal
        title="请输入取消原因"
        visible={detailCancelModalVisible}
        footer={[
          <Button key="confirm" type="primary" onClick={confirm}>确认</Button>,
          <Button key="cancel" onClick={cancel}>取消</Button>,
        ]}
        width={360}
        className={styles.goodsModal}
      >
        <Input.TextArea value={cancelReason} onChange={change} autosize={{ minRows: 3, maxRows: 6 }} style={{ border: 0 }} />
      </Modal>
    );
  }

  renderDetail = () => {
    const { detail: { data, carId, doctorId }, detailModalVisible } = this.state;
    const detail = (data && data.paasOrdersChildrenDisease) || {};
    const patient = (data && data.patient) || {};
    const good = (data && data.good) || {};
    const car = (data && data.car) || {};
    const cars = (data && data.cars) || [];
    const doctor = (data && data.doctor) || {};
    const doctors = (data && data.doctors) || [];
    const state = childDiseaseStatusData.find(i => i.id === detail.status);
    let footer = [];
    if (detail.status === 1 || detail.status === 2 || detail.status === 3) {
      footer = [
        <Button key="save" type="primary" onClick={() => save()}>保存预约单</Button>,
        <Button key="cancel" onClick={() => cancel()}>取消预约单</Button>,
      ];
    } else {
      footer = null;
    }
    const save = () => {
      this.updateOrder();
    };
    const cancel = () => {
      this.setState({ detailCancelModalVisible: true });
    };
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const handleCarChange = (value) => {
      const newDetail = { ...this.state.detail };
      newDetail.carId = value;
      this.setState({ detail: newDetail });
    };
    const handleDoctorChange = (value) => {
      const newDetail = { ...this.state.detail };
      newDetail.doctorId = value;
      this.setState({ detail: newDetail });
    };
    return (
      <div>
        <Modal
          title="详情"
          visible={detailModalVisible}
          onCancel={() => this.handleDetailModalVisible()}
          footer={footer}
          width={720}
        >
          <Form>
            <FormItem {...formItemLayout} label="家长ID">
              <span className="ant-form-text">{detail.userId}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="电话号码">
              <span className="ant-form-text">{detail.phone}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="下单时间">
              <span className="ant-form-text">{detail.createTime}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="预约单状态">
              <span className="ant-form-text">{state && state.name}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="就诊医院">
              <span className="ant-form-text">{detail.hospital}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="就诊科室">
              <span className="ant-form-text">{detail.department}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="就诊费">
              <span className="ant-form-text">{detail.payPrice}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="宝宝信息">
              <span className="ant-form-text">{`(${patient.id}) ${patient.name} ${patient.sex === 0 ? '女' : patient.sex === 1 ? '男' : ''} ${patient.birthday}`}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="出车地址">
              <span className="ant-form-text">{detail.province}{detail.city}{detail.district}{detail.address}{detail.poi}</span>
            </FormItem>
            {detail.status === 1 && (
              <FormItem {...formItemLayout} label="关联套餐">
                {
                  good.id ?
                    (
                      <Table
                        rowKey={record => record.id}
                        columns={[
                          {
                            title: '套餐ID',
                            dataIndex: 'code',
                          },
                          {
                            title: '套餐名称',
                            dataIndex: 'name',
                          },
                          {
                            title: '操作',
                            render: () => {
                              return (
                                <Fragment>
                                  <a onClick={() => { this.setState({ detailGoodsModalVisible: true }); }}>
                                    修改套餐
                                  </a>
                                </Fragment>
                              );
                            },
                          }]}
                        dataSource={[good]}
                        pagination={false}
                        bordered
                      />
                    )
                    :
                    (
                      <a onClick={() => { this.setState({ detailGoodsModalVisible: true }) }}>设置关联套餐</a>
                    )
                }
              </FormItem>
            )}
            {detail.status !== 1 && good.id && (
              <FormItem {...formItemLayout} label="选择套餐">
                <span className="ant-form-text">{`(${good.code}) ${good.name}`}</span>
              </FormItem>
            )}
            {detail.status === 1 && (
              <FormItem {...formItemLayout} label="设置车辆">
                <Select value={carId} placeholder="请选择" onChange={handleCarChange}>
                  {cars.map((item) => {
                    return <Option key={item.id} value={item.id}>{item.carName}&nbsp;({item.info || '空闲'})</Option>;
                  })}
                </Select>
              </FormItem>
            )}
            {detail.status !== 1 && car.id && (
              <FormItem {...formItemLayout} label="出车车辆">
                <span className="ant-form-text">{car.carName}</span>
              </FormItem>
            )}
            {(detail.status === 2 || detail.status === 3) && (
              <FormItem {...formItemLayout} label="选择出诊医生">
                <Select value={doctorId} placeholder="请选择" onChange={handleDoctorChange}>
                  {doctors.map((item) => {
                    return <Option key={item.id} value={item.id}>{item.doctorName}</Option>;
                  })}
                </Select>
              </FormItem>
            )}
            {(detail.status === 9) && doctor.id && (
              <FormItem {...formItemLayout} label="出诊医生">
                <span className="ant-form-text">{doctor.doctorName}</span>
              </FormItem>
            )}
            {detail.status === 9 && (
              <FormItem {...formItemLayout} label="完成时间">
                <span className="ant-form-text">{detail.finishTime}</span>
              </FormItem>
            )}
            {detail.status === 0 && (
              <FormItem {...formItemLayout} label="取消时间">
                <span className="ant-form-text">{detail.cancelTime}</span>
              </FormItem>
            )}
            {detail.status === 0 && (
              <FormItem {...formItemLayout} label="取消原因">
                <span className="ant-form-text">{detail.cancelReason}</span>
              </FormItem>
            )}
          </Form>
        </Modal>
        {this.renderGoods()}
        {this.renderCancelReason()}
      </div>);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { detail } = this.state;
    const { log: { logList, logPage } } = this.props;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={12}>
                    <FormItem label="预约单状态">
                      {getFieldDecorator('status', {
                        initialValue: '',
                      })(
                        <Select placeholder="请选择">
                          {childDiseaseStatusData.map((item) => {
                            return <Option key={item.id} value={item.id}>{item.name}</Option>;
                          })}
                          <Option value="">全部</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={12}>
                    <FormItem label="支付时间">
                      {getFieldDecorator('time')(
                        <RangePicker />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={12}>
                    <span className={styles.submitButtons}>
                      <Button type="primary" htmlType="submit">查询</Button>
                    </span>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
          {this.renderTable()}
        </Card>
        <LogModal
          data={logList}
          page={logPage}
          loding={this.state.logModalLoading}
          logVisible={this.state.logModalVisible}
          logHandleCancel={this.logModalHandleCancel}
          logModalhandleTableChange={this.logModalhandleTableChange}
        />
        {detail.data && this.renderDetail()}
      </PageHeaderLayout>
    );
  }
}
