import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Card, Form, Input, Modal, Divider, Table, Popconfirm, Alert, notification, Col, Button, DatePicker, Select } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getUser } from '../../utils/authority';
import { parseUploadFileUrl } from '../../utils/utils';
import LogModal from '../../components/LogModal';
import styles from './Question.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
@connect(({ question, loading, log }) => ({
  question,
  log,
  loading: loading.models.questions,
}))
@Form.create()
export default class Question extends PureComponent {
  state = {
    config: [
      { id: 1, name: '未完成' },
      { id: 2, name: '已完成' },
    ],
    list: {
      status: {
        loading: false,
      },
      pagination: {
        current: 0,
        pageSize: 20,
        total: 0,
      },
      datas: [],
    },
    dialog: {
      log: {
        list: {
          datas: [],
          pagination: {
            current: 0,
            pageSize: 20,
            total: 0,
          },
          status: {
            loading: false,
          },
        },
      },
      detail: {
        source: null,
        data: null,
      },
    },
    detailModalVisible: false,
    logModalLoading: false,
    logModalVisible: false,
    previewVisible: false,
  };

  componentDidMount() {
    this.getList();
  }

  // 日志相关
  getLogList = (data) => {
    this.props.dispatch({
      type: 'log/getLogList',
      payload: {
        restParams: {
          code: data.id,
          pageNo: this.state.dialog.log.list.pagination.current,
        },
      },
    }).then(() => {
      this.setState({
        logModalLoading: false,
      });
    });
  }

  getList = () => {
    const { dispatch, form } = this.props;
    const { list } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const restParams = {
        pageNo: this.state.list.pagination.current,
        startTime: '',
        endTime: '',
      };
      for (const key in fieldsValue) {
        if (Object.prototype.hasOwnProperty.call(fieldsValue, key)) {
          if (key === 'dateRange') {
            if (fieldsValue[key].length > 1) {
              restParams.startTime = `${fieldsValue[key][0].format('YYYY-MM-DD')} 00:00:00`;
              restParams.endTime = `${fieldsValue[key][1].format('YYYY-MM-DD')} 23:59:59`;
            }
          } else {
            restParams[key] = fieldsValue[key] !== undefined ? fieldsValue[key] : '';
          }
        }
      }
      dispatch({
        type: 'question/list',
        payload: {
          restParams,
        },
      }).then((resp) => {
        if (resp && resp.code === 0 && resp.data) {
          const { data, page } = resp;
          this.setState({
            list: {
              status: {
                loading: false,
              },
              datas: data,
              pagination: {
                total: page.totalCount,
                current: page.pageNo,
                pageSize: page.pageSize,
              },
            },
          });
        }
      });
    });
  }

  handleSearch = (e) => {
    e && e.preventDefault();
    this.getList();
  }

  handleFormReset = () => {
    this.props.form.resetFields();
    this.getList();
  }

  handleDetailClick = (item) => {
    this.props.dispatch({
      type: 'question/detail',
      payload: {
        restParams: {
          id: item.id,
        },
      },
    }).then((resp) => {
      const { dialog } = this.state;
      const { data } = resp;
      if (data.baseData && data.baseData.imgs) {
        data.baseData.imgs = JSON.parse(data.baseData.imgs);
      }
      dialog.detail = {
        source: item,
        data,
      };
      this.setState({ dialog, detailModalVisible: true });
    });
  }

  handlePreview = (url) => {
    this.setState({
      previewImage: url,
      previewVisible: true,
    });
  }

  handleModalVisible = (name) => {
    const modal = {};
    modal[name] = false;
    this.setState(modal);
  }
  handlePriviewCancel = () => {
    this.setState({
      previewVisible: false,
    });
  }

  handleLogClick = (data) => {
    this.setState({
      logModalVisible: !!data,
      logModalLoading: true,
    }, () => {
      this.getLogList(data);
    });
  }

  handleTableChange = (pagination) => {
    const { list } = this.state;
    list.pagination.current = pagination.current;
    this.setState({ list });
    this.getList();
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

  renderList = () => {
    const { list: { datas, pagination, status: { loading } } } = this.state;
    const columns = [
      {
        title: '门诊订单号',
        dataIndex: 'orderNum',
      },
      {
        title: '儿童姓名',
        dataIndex: 'performerName',
      },
      {
        title: '医生姓名',
        dataIndex: 'doctorName',
      },
      {
        title: '追问状态',
        dataIndex: 'traceStatus',
      },
      {
        title: '用户追问时间',
        dataIndex: 'traceTime',
      },
      {
        title: '操作',
        render: (text, data) => (
          <Fragment>
            <a onClick={() => this.handleDetailClick(data)}>详情</a>
            {/* <Divider type="vertical" />
            <a onClick={() => this.handleLogClick(data)}>日志</a> */}
          </Fragment >
        ),
      },
    ];
    const paginationProps = {
      showTotal: (total) => {
        return `共${total}条数据  每页${pagination.pageSize}条`;
      },
      ...pagination,
    };

    return (
      <div className={styles.standardTable} >
        <div className={styles.tableAlert}>
          <Alert
            message={(
              <div>
                查询结果：共{paginationProps.total}条数据&nbsp;&nbsp;
                每页{paginationProps.pageSize}条
              </div>
            )}
            type="info"
            showIcon
          />
        </div>
        <Table
          loading={loading}
          rowKey={record => record.id}
          dataSource={datas}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }

  renderDetail = () => {
    const {
      dialog: {
        detail: { data: { baseData, questionTraces } },
      },
      detailModalVisible,
    } = this.state;
    const columns = [
      {
        title: '角色',
        dataIndex: 'tracerType',
        width: 80,
        render: (text, record) => { return record.tracerType === 1 ? '家长' : '医生'; },
      },
      {
        title: '追问/回复内容',
        dataIndex: 'traceContent',
        render: (text, record) => {
          return (
            <div>
              {record.traceContent && <div style={{ pointerEvents: 'none' }} dangerouslySetInnerHTML={{ __html: record.traceContent }} />}
              {record.imgs && record.imgs.length > 0 && (
                <div>
                  {record.imgs.map((img) => {
                    return (<a onClick={() => { this.handlePreview(parseUploadFileUrl(img.imgPath)); }}><img src={parseUploadFileUrl(img.imgPath)} className={styles.avatar} alt="" /></a>);
                  })}
                </div>
              )}
            </div>
          );
        },
      },
      {
        title: '追问/回复时间',
        width: 180,
        dataIndex: 'traceTime',
      },
    ];
    const infoTableColumns = [
      {
        title: '家长ID',
        dataIndex: 'parentId',
      }, {
        title: '家长姓名',
        dataIndex: 'parentName',
      }, {
        title: '电话号码',
        dataIndex: 'phone',
      }, {
        title: '医生ID',
        dataIndex: 'doctorId',
      }, {
        title: '医生姓名',
        dataIndex: 'doctorName',
      }, {
        title: '门诊审核通过时间',
        dataIndex: 'finishTime',
      }, {
        title: '门诊订单号',
        dataIndex: 'orderNum',
      },
    ];
    const infoTableTitle = () => {
      return (<strong>追问基本信息</strong>);
    };
    const babyTableColumns = [
      {
        title: '宝宝ID',
        dataIndex: 'childId',
      }, {
        title: '宝宝姓名',
        dataIndex: 'name',
      }, {
        title: '姓名拼音',
        dataIndex: 'py',
      }, {
        title: '宝宝性别',
        dataIndex: 'sex',
      }, {
        title: '宝宝生日',
        dataIndex: 'birthday',
      }, {
        title: '宝宝身高',
        dataIndex: 'patientHeight',
      }, {
        title: '宝宝体重',
        dataIndex: 'patientWeight',
      },
    ];
    const babyTableTitle = () => {
      return (<strong>宝宝信息</strong>);
    };
    return (
      <Modal
        title="详情"
        visible={detailModalVisible}
        onCancel={() => this.handleModalVisible('detailModalVisible')}
        footer={null}
        width={960}
      >
        <Table
          rowKey={record => record.orderNum}
          dataSource={baseData ? [baseData] : []}
          columns={infoTableColumns}
          title={infoTableTitle}
          pagination={false}
          border={false}
          size="small"
        />
        <Table
          rowKey={record => record.orderNum}
          dataSource={baseData ? [baseData] : []}
          columns={babyTableColumns}
          title={babyTableTitle}
          pagination={false}
          border={false}
          size="small"
          style={{ marginTop: 15 }}
        />
        <div className="ant-table ant-table-small ant-table-empty ant-table-scroll-position-left" style={{ marginTop: 15 }}>
          <div className="ant-table-title"><strong>诊断建议</strong></div>
          <div style={{ padding: '10px 10px', pointerEvents: 'none' }} dangerouslySetInnerHTML={{ __html: baseData.doctorAdvice }} />
          <div className="ant-table-title"><strong>家长描述</strong></div>
          <div style={{ padding: '10px 10px' }}>
            <div><strong>用户自述：</strong><span>{baseData.illness}</span></div>
            <div><strong>病症图片：</strong>
              <span>
                {baseData.imgs && baseData.imgs.length > 0 && baseData.imgs.map((img) => {
                  return (<a onClick={() => { this.handlePreview(parseUploadFileUrl(img)); }}><img src={parseUploadFileUrl(img)} className={styles.avatar} alt="" /></a>);
                })}
              </span>
            </div>
          </div>
        </div>
        <Table
          rowKey={record => record.id}
          dataSource={questionTraces}
          columns={columns}
          pagination={false}
          size="small"
          style={{ marginTop: 15 }}
        />
      </Modal>);
  }

  renderSearchForm = () => {
    const { form: { getFieldDecorator }, loading } = this.props;
    const { config } = this.state;
    const rangePickerLocale = { lang: { rangePlaceholder: ['开始日期', '结束日期'] } };
    return (
      <Form onSubmit={this.handleSearch} layout="inline" >
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <Form.Item label="追问状态">
              {getFieldDecorator('status', { initialValue: '' })(
                <Select placeholder="请选择追问状态" style={{ width: '100%' }}>
                  {
                    config.map((item) => {
                      return <Option key={item.id}>{item.name}</Option>;
                    })
                  }
                  <Option value="">全部</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col md={12} sm={24}>
            <Form.Item label="追问时间">
              {getFieldDecorator('dateRange', { initialValue: [] })(
                <RangePicker style={{ width: '100%' }} locale={rangePickerLocale} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <Form.Item label="订单查询">
              {getFieldDecorator('keyword', { initiaValue: '' })(
                <Input placeholder="使用订单号/儿童姓名搜索/医生姓名" />
              )}
            </Form.Item>
          </Col>
          <Col md={{ span: 12, lg: 24, xl: 48 }} sm={24}>
            <div className={styles.queryCol}>
              <Button type="primary" htmlType="submit" loading={loading}>查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset} loading={loading}>重置</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { dialog: { log, detail }, logModalVisible, logModalLoading, previewImage, previewVisible } = this.state;
    const TableList = this.renderList;
    const DetailModal = this.renderDetail;
    const SearchForm = this.renderSearchForm;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <SearchForm />
            </div>
            <TableList />
          </div>
        </Card>
        {detail.data && <DetailModal />}
        <LogModal
          data={log.list.datas}
          page={log.list.pagination}
          loding={logModalLoading}
          logVisible={logModalVisible}
          logHandleCancel={this.logModalHandleCancel}
          logModalhandleTableChange={this.logModalhandleTableChange}
        />
        <Modal visible={previewVisible} footer={null} onCancel={this.handlePriviewCancel}>
          <img alt="图片预览" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderLayout >
    );
  }
}
