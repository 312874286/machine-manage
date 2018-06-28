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
  message
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './InspectionReport.less';
import { childDiseaseStatusData } from '../../common/config/order';
import LogModal from '../../components/LogModal';
import ReportDetail from '../../components/Content/inspectionReport';

const { RangePicker } = DatePicker;
const { Option } = Select;
const FormItem = Form.Item;
const config = {
  assignedStatus: [
    { id: 0, name: '待分配' },
    { id: 1, name: '部分分配' },
    { id: 2, name: '已分配' },
  ],
  reportStatus: [
    { id: 1, name: '待获取' },
    { id: 2, name: '已获取待审核' },
    { id: 3, name: '已审核' },
  ],
};
@connect(({ inspectionReport, loading, log }) => ({
  inspectionReport,
  log,
  loading: loading.models.inspectionReport,
}))
@Form.create()
export default class InspectionReport extends PureComponent {
  state = {
    list: {
      datas: [],
      page: {
        total: 0,
        pageSize: 20,
        current: 1,
      },
    },
    detail: {
      data: null,
    },
    startDate: '',
    endDate: '',
    reportStatus: '',
    assignedStatus: '',
    id: '',
    name: '',
    detailVisible: false,
    previewVisible: false,
    previewImage: null,
  };

  componentDidMount = () => {
    this.getList();
  }

  // 获取列表
  getList = () => {
    this.props.dispatch({
      type: 'inspectionReport/list',
      payload: {
        restParams: {
          queryString: {
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            status: this.state.reportStatus,
            reportStatus: this.state.assignedStatus,
            babyName: this.state.name,
            orderNum: this.state.id,
            pageNo: this.state.list.page.current,
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
        reportStatus: fieldsValue.reportStatus,
        assignedStatus: fieldsValue.assignedStatus,
        id: fieldsValue.id,
        name: fieldsValue.name,
      }, () => {
        this.getList();
      });
    });
  }

  handleSearchReset = () => {
    this.props.form.resetFields();
    this.getList();
  }

  handleDetail = (data) => {
    this.props.dispatch({
      type: 'inspectionReport/detail',
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
      this.setState({
        detail,
        detailVisible: true,
      });
    });
  }
  handleDetailCancel = () => {
    this.setState({
      detail: {
        data: null,
      },
      detailVisible: false,
    });
  }
  handleReportPreview = (image) => {
    this.setState({
      previewVisible: true,
      previewImage: image,
    });
  }
  handleReportPreviewCancel = () => {
    this.setState({
      previewVisible: false,
    }, () => {
      this.setState({
        previewImage: null,
      });
    });
  }
  handleReportApprove = (params) => {
    this.props.dispatch({
      type: 'inspectionReport/approve',
      payload: {
        params,
      },
    }).then((resp) => {
      if (resp.code !== 0) return;
      message.success('审核成功');
      this.handleDetail({ id: this.state.detail.data.id });
    });
  }
  handleReportRetrieve = (params) => {
    this.props.dispatch({
      type: 'inspectionReport/retrieve',
      payload: {
        params,
      },
    }).then((resp) => {
      if (resp.code !== 0) return;
      message.success('操作成功（数据获取会有延迟时间）');
      this.handleDetail({ id: this.state.detail.data.id });
    });
  }
  handleReportRemarkChange = (params) => {
    this.props.dispatch({
      type: 'inspectionReport/updateRemark',
      payload: {
        params,
      },
    }).then((resp) => {
      if (resp.code !== 0) return;
      message.success('指标说明更新成功');
      this.handleDetail({ id: this.state.detail.data.id });
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
        title: '合约ID',
        dataIndex: 'orderNum',
      },
      {
        title: '儿童姓名',
        dataIndex: 'babyName',
      },
      {
        title: '儿童性别',
        render: (text, record) => {
          return record.babySex === '0' ? '女' : record.babySex === '1' ? '男' : '';
        },
      },
      {
        title: '儿童生日',
        dataIndex: 'babyBirthday',
      },
      {
        title: '报告状态',
        render: (text, record) => {
          const status = config.reportStatus.find(i => i.id === record.status);
          return (status && status.name) || '暂无';
        },
      },
      {
        title: '体检时间',
        dataIndex: 'classesDate',
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <Fragment>
              <a onClick={() => { this.handleDetail(record); }}>查看检验报告</a>
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
  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      detail,
      detailVisible,
      previewVisible,
      previewImage,
    } = this.state;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={12}>
                    <FormItem label="合约ID">
                      {getFieldDecorator('id', {
                        initialValue: '',
                      })(
                        <Input placeholder="请输入电话/合约ID/宝宝姓名" />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={12}>
                    <FormItem label="儿童姓名">
                      {getFieldDecorator('name', {
                        initialValue: '',
                      })(
                        <Input placeholder="请输入电话/合约ID/宝宝姓名" />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={12}>
                    <FormItem label="体检时间">
                      {getFieldDecorator('time')(
                        <RangePicker />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={12}>
                    <FormItem label="分配状态">
                      {getFieldDecorator('assignedStatus', {
                        initialValue: '',
                      })(
                        <Select placeholder="请选择">
                          {config.assignedStatus.map((item) => {
                            return <Option key={item.id} value={item.id}>{item.name}</Option>;
                          })}
                          <Option value="">全部</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={12}>
                    <FormItem label="报告状态">
                      {getFieldDecorator('reportStatus', {
                        initialValue: '',
                      })(
                        <Select placeholder="请选择">
                          {config.reportStatus.map((item) => {
                            return <Option key={item.id} value={item.id}>{item.name}</Option>;
                          })}
                          <Option value="">全部</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={12}>
                    <span className={styles.submitButtons}>
                      <Button type="primary" htmlType="submit">查询</Button>
                      <Button htmlType="reset" onClick={this.handleSearchReset}>重置</Button>
                    </span>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
          {this.renderTable()}
        </Card>
        {
          detail && detail.data && (
            <ReportDetail
              title="详情"
              width="80%"
              data={detail.data}
              onClose={this.handleDetailCancel}
              visible={detailVisible}
              onReportApprove={this.handleReportApprove}
              onReportRetrieve={this.handleReportRetrieve}
              onReportRemarkChange={this.handleReportRemarkChange}
              onReportPreview={this.handleReportPreview}
            />
          )
        }
        <Modal visible={previewVisible} footer={null} onCancel={this.handleReportPreviewCancel}>
          <img alt="图片预览" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderLayout>
    );
  }
}

