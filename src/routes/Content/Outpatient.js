import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Modal,
  message,
  DatePicker,
  Select,
  Table,
  Spin,
  Upload,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Outpatient.less';
import OutpatientTable from '../../components/Content/outpatientTable';
import { outpatientOrderStatusData } from '../../common/config/order';
import LogModal from '../../components/LogModal';

const { RangePicker } = DatePicker;
const { Option } = Select;
const FormItem = Form.Item;


const CollectionCreateForm = Form.create()(
  (props) => {
    const {
      cancelModalvisible,
      cancelModalhandleOk,
      cancelModalconfirmLoading,
      cancelModalhandleCancel,
      form,
    } = props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <Modal
        title="提示"
        visible={cancelModalvisible}
        onOk={cancelModalhandleOk}
        confirmLoading={cancelModalconfirmLoading}
        onCancel={cancelModalhandleCancel}
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label="取消原因"
          >
            {getFieldDecorator('cancelLog', {
              rules: [{ required: true, message: '请输入取消原因' }],
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);

@connect(({ outpatient, loading, log }) => ({
  outpatient,
  log,
  loading: loading.models.outpatient,
}))
@Form.create()
export default class Outpatient extends PureComponent {
  state = {
    pageNo: 1,
    status: '',
    startDate: '',
    endDate: '',
    keyword: '',
    appointmentTime: '',
    updateTime: '',
    detailModalVisible: false,
    detail: {
      patient: {},
      orders: {},
      times: {},
      info: {},
    },
    modalLoading: false,
    cancelModalvisible: false,
    cancelModalconfirmLoading: false,
    calcelItem: null,
    previewVisible: false,
    previewImage: '',
    logModalVisible: false,
    logModalLoading: false,
    logId: '',
    logModalPageNo: 1,
    reason: '',
  };

  componentDidMount = () => {
    this.getList();
  }

  // 获取列表
  getList = () => {
    this.props.dispatch({
      type: 'outpatient/getOutpatientList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          startDate: this.state.startDate,
          endDate: this.state.endDate,
          status: this.state.status,
          keyword: this.state.keyword,
          appointmentTime: this.state.appointmentTime,
          updateTime: this.state.updateTime,
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
        startDate: fieldsValue.time ? fieldsValue.time[0].format('YYYY-MM-DD') : '',
        endDate: fieldsValue.time ? fieldsValue.time[1].format('YYYY-MM-DD') : '',
        status: fieldsValue.status,
        keyword: fieldsValue.keyword,
      }, () => {
        this.getList();
      });
    });
  }

  // 详情
  handleDetailClick = (item) => {
    this.setState({
      detailModalVisible: true,
      modalLoading: true,
    });

    this.props.dispatch({
      type: 'outpatient/getOutpatientDetail',
      payload: {
        restParams: {
          orderId: item.id,
        },
      },
    }).then((resp) => {
      const detail = resp.data;
      this.setState({
        detail,
        modalLoading: false,
      });
    });
  }

  // 表格取消事件
  handleCancelClick = (item) => {
    this.setState({
      cancelModalvisible: true,
      calcelItem: item,
    });
  }

  // 详情modal 取消事件
  detailModalHandleCancel = () => {
    this.setState({
      detailModalVisible: false,
      detail: {
        patient: {},
        orders: {},
        times: {},
        info: {},
      },
      reason: '',
    });
  }

  // 编辑modal 确认事件
  cancelModalhandleOk = () => {
    this.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        cancelModalconfirmLoading: true,
      });

      this.props.dispatch({
        type: 'outpatient/cancelOrder',
        payload: {
          params: {
            orderId: this.state.calcelItem.id,
            cancelLog: values.cancelLog,
          },
        },
      }).then(() => {
        this.getList();
        this.setState({
          cancelModalconfirmLoading: false,
          cancelModalvisible: false,
        });
        this.form.setFieldsValue({ cancelLog: '' });
      });
    });
  }

  // 取消modal 取消事件
  cancelModalhandleCancel = () => {
    this.form.setFieldsValue({ cancelLog: '' });
    this.setState({
      cancelModalvisible: false,
    });
  }

  saveFormRef = (form) => {
    this.form = form;
  }

  // 图片放大展示
  imgHandleCancel = () => this.setState({ previewVisible: false })
  imgHandlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
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

  handleSaveReason = () => {
    const { reason, detail: { orders } } = this.state;
    if (!reason) {
      message.warning('转接电话原因不能为空');
      return;
    }
    this.props.dispatch({
      type: 'outpatient/saveTransferReason',
      payload: {
        params: {
          orderId: orders.id,
          reason,
        },
      },
    }).then((resp) => {
      if (resp && resp.code === 0) {
        message.success('保存成功');
        this.handleDetailClick(orders);
      } else {
        message.warning(`保存失败：${resp && resp.msg}`);
      }
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


  render() {
    const { getFieldDecorator } = this.props.form;
    const { outpatient: { list, page }, log: { logList, logPage }, loading } = this.props;
    const {
      keyword,
      time,
      status,
      detailModalVisible,
      detail,
      cancelModalvisible,
      cancelModalconfirmLoading,
      previewVisible,
      previewImage,
      reason,
    } = this.state;

    const {
      patient,
      orders,
      times,
      info,
      callTransferReason,
    } = detail;
    const fileList = [];

    if (info.info) {
      info.info = typeof info.info === 'string' ? JSON.parse(info.info) : info.info;
      console.log(info.info);
      if (info.info.imgs && info.info.imgs.length > 0) {
        info.info.imgs.forEach((item, index) => {
          fileList.push({
            uid: -index,
            name: item,
            status: 'done',
            url: `http://static.pinwheelmedical.com/${item}`,
          });
        });
      }
    }

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={12}>
                    <FormItem label="订单状态">
                      {getFieldDecorator('status', {
                        initialValue: status,
                      })(
                        <Select placeholder="请选择" >
                          {outpatientOrderStatusData.map((item, index) => {
                            return <Option key={index} value={item.id}>{item.name}</Option>
                          })}
                          <Option value="">全部</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={12}>
                    <FormItem label="预约时间">
                      {getFieldDecorator('time', {
                        initialValue: time,
                      })(
                        <RangePicker />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={12}>
                    <FormItem label="订单号">
                      {getFieldDecorator('keyword', {
                        initialValue: keyword,
                      })(
                        <Input placeholder="请输入" />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row className={styles.submitButtons} gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={12}>
                    <Button type="primary" htmlType="submit">查询</Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>

          <OutpatientTable
            loading={loading}
            data={list}
            page={page}
            handleTableChange={this.handleTableChange}
            onLogClick={this.handleLogClick}
            onDetailClick={this.handleDetailClick}
            onCancelClick={this.handleCancelClick}
          />
        </Card>

        <Modal
          title="详情"
          width="1100px"
          style={{ top: 20 }}
          visible={detailModalVisible}
          onCancel={this.detailModalHandleCancel}
          footer={null}
        >
          <Spin spinning={this.state.modalLoading} >
            <div className={styles.modalBody}>
              <Row gutter={12}>
                <Col span={12}>
                  <Card title="门诊基本信息" >
                    <Row>
                      <Col span={6} className="label">家长ID</Col>
                      <Col span={18}>
                        <p>{orders && orders.userId}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6} className="label">家长姓名</Col>
                      <Col span={18}>
                        <p>{orders && orders.ext3Str}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6} className="label">电话号码</Col>
                      <Col span={18}>
                        <p>{orders && orders.userTelno}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6} className="label">医生ID</Col>
                      <Col span={18}>
                        <p>{orders && orders.doctorId}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6} className="label">医生姓名</Col>
                      <Col span={18}>
                        <p>{orders && orders.doctorName}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6} className="label">预约时间</Col>
                      <Col span={18}>
                        <p>{orders && orders.ext1Str}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6} className="label">接诊时间</Col>
                      <Col span={18}>
                        <p>{times && times.actionTime}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6} className="label">回电时间</Col>
                      <Col span={18}>
                        <p>{times && times.callbackTime}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6} className="label">订单生成时间</Col>
                      <Col span={18}>
                        <p>{orders && orders.orderTime}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6} className="label">医嘱提交时间</Col>
                      <Col span={18}>
                        <p>{times && times.submitAdviceTime}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6} className="label">审核通过时间</Col>
                      <Col span={18}>
                        <p>{orders && orders.finishTime}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6} className="label">订单价格(元)</Col>
                      <Col span={18}>
                        {orders && orders.orderPrice}
                      </Col>
                    </Row>

                  </Card>

                  <Card title="诊断建议" style={{ marginTop: 18 }}>
                    {(info && info.info) && <div dangerouslySetInnerHTML={{ __html: info.info.doctorAdviceEnd }} style={{ whiteSpace: 'pre-wrap' }} />}
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="宝宝信息">
                    <Row>
                      <Col span={6} className="label">宝宝ID</Col>
                      <Col span={18}>
                        <p>{patient && patient.id}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6} className="label">宝宝姓名</Col>
                      <Col span={18}>
                        <p>{patient && patient.name}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6} className="label">拼音</Col>
                      <Col span={18}>
                        <p>{patient && patient.userName}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6} className="label">性别</Col>
                      <Col span={18}>
                        <p>{patient && patient.sex === 1 ? '男' : '女'}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6} className="label">生日</Col>
                      <Col span={18}>
                        <p>{patient && patient.birthday}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6} className="label">身高(cm)</Col>
                      <Col span={18}>
                        <p>{info && info.info ? info.info.patientHeight : ''}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6} className="label">体重(kg)</Col>
                      <Col span={18}>
                        {info && info.info ? info.info.patientWeight : ''}
                      </Col>
                    </Row>
                  </Card>

                  <Card title="家长描述" style={{ marginTop: 18 }}>
                    <Row>
                      <Col span={6} className="label">用户自述</Col>
                      <Col span={18}>
                        <p>{info && info.info ? info.info.illness : ''}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6} className="label">症状图片</Col>
                      <Col span={18}>
                        <Upload
                          disabled
                          action="//example.com"
                          listType="picture-card"
                          fileList={fileList}
                          onPreview={this.imgHandlePreview}
                        />
                        <Modal visible={previewVisible} footer={null} onCancel={this.imgHandleCancel}>
                          <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                      </Col>
                    </Row>
                  </Card>

                  <Card title="转接电话" style={{ marginTop: 18 }}>
                    {info.info && info.info.callTransferReason ?
                      (
                        <div>
                          <Row>
                            <Col span={6} className="label">原因</Col>
                            <Col span={18}><p>{info.info.callTransferReason.callTransferReason}</p></Col>
                          </Row>
                          <Row>
                            <Col span={6} className="label">转接人</Col>
                            <Col span={4}>
                              {info.info.callTransferReason.callTransferReasonUserName}
                            </Col>
                            <Col span={6} className="label">转接时间</Col>
                            <Col span={8}>
                              {info.info.callTransferReason.callTransferReasonTime}
                            </Col>
                          </Row>
                        </div>
                      ) : (
                        <Row>
                          <Col span={6} className="label" style={{ paddingTop: 4 }}>原因</Col>
                          <Col span={14}>
                            <Input value={reason} onChange={(e) => { this.setState({ reason: e.target.value }); }} placeholder="请输入转接电话原因" />
                          </Col>
                          <Col span={4} style={{ textAlign: 'right' }}>
                            <Button type="primary" onClick={() => { this.handleSaveReason(); }}>确认</Button>
                          </Col>
                        </Row>

                      )}
                  </Card>
                </Col>
              </Row>
            </div>
          </Spin>
        </Modal>

        <CollectionCreateForm
          ref={this.saveFormRef}
          cancelModalvisible={cancelModalvisible}
          cancelModalhandleOk={this.cancelModalhandleOk}
          cancelModalconfirmLoading={cancelModalconfirmLoading}
          cancelModalhandleCancel={this.cancelModalhandleCancel}
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
