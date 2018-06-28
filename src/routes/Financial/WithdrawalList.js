import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Table, Button, Divider, Popconfirm, message, DatePicker, Alert, Modal, Icon, Popover } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getUser } from '../../utils/authority';
import WithdrawalDetailTabs from '../../components/Finacial/withdrawalDetailTabs';
import styles from './WithdrawalList.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const config = {
  verifyStatus: [
    // 1审核中 2已驳回 3已通过 8提现失败 9已完成
    { id: 1, name: '待审核' },
    { id: 2, name: '已驳回' },
    { id: 3, name: '审核通过' },
    { id: 8, name: '提现失败' },
    { id: 9, name: '已完成' },
  ],
};
@connect(({ withdrawals, loading }) => ({
  withdrawals,
  loading: loading.models.withdrawals,
}))
@Form.create()
export default class WithdrawalList extends PureComponent {
  state = {
    list: {
      datas: [],
      page: {
        total: 0,
        pageSize: 20,
        current: 1,
      },
    },
    tabDatas: {
      list1: {
        datas: [],
        page: {
          total: 0,
          pageSize: 20,
          current: 1,
        },
      },
      list2: {
        datas: [],
        page: {
          total: 0,
          pageSize: 20,
          current: 1,
        },
      },
      list3: {
        datas: [],
        page: {
          total: 0,
          pageSize: 20,
          current: 1,
        },
      },
      list4: {
        datas: [],
        page: {
          total: 0,
          pageSize: 20,
          current: 1,
        },
      },
    },
    modalVisible: false,
    currentData: null,
    doctorWallet: {},
    auditStatistics: {},
    auditRemark: '',
    auditModalVisible: false,
  }

  componentDidMount() {
    this.getList();
  }

  getStatistics = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'withdrawals/withdrawalAuditStatistics',
      payload: {
        restParams: {
          merchantId: getUser().merchantId,
        },
      },
    }).then((resp) => {
      if (resp && Object.prototype.hasOwnProperty.call(resp, 'code') && resp.code === 0) {
        this.setState({
          auditStatistics: resp.data,
        });
      }
    });
  }

  getList = (pageNo) => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const restParams = {
        pageNo: pageNo || 1,
        merchantId: getUser().merchantId,
        startDate: '',
        endDate: '',
      };
      for (const key in fieldsValue) {
        if (Object.prototype.hasOwnProperty.call(fieldsValue, key)) {
          if (key === 'dateRange') {
            if (fieldsValue[key].length > 1) {
              restParams.startDate = fieldsValue[key][0].format('YYYY-MM-DD');
              restParams.endDate = fieldsValue[key][1].format('YYYY-MM-DD');
            }
          } else {
            restParams[key] = fieldsValue[key] !== undefined ? fieldsValue[key] : '';
          }
        }
      }
      dispatch({
        type: 'withdrawals/list',
        payload: {
          restParams,
        },
      }).then((resp) => {
        if (resp && Object.prototype.hasOwnProperty.call(resp, 'code') && resp.code === 0) {
          this.setState({
            list: {
              datas: resp.data,
              page: {
                total: resp.page.totalCount,
                pageSize: resp.page.pageSize,
                current: resp.page.pageNo,
              },
            },
          });
        }
      });
    });
    this.getStatistics();
  }

  getTabList = (pageNo, tabIndex) => {
    const { dispatch } = this.props;
    const { currentData: { doctorId }, tabDatas } = this.state;
    if (!doctorId) {
      message.error('医生ID不存在');
      return;
    }
    const type = tabIndex === '3' ? 'withdrawals/doctorDepositList' : 'withdrawals/doctorIncomeList';
    const restParams = {
      doctorId,
      type: tabIndex,
      merchantId: getUser().merchantId,
      pageNo: pageNo || 1,
    };
    dispatch({
      type,
      payload: {
        restParams,
      },
    }).then((resp) => {
      if (resp && Object.prototype.hasOwnProperty.call(resp, 'code') && resp.code === 0) {
        const newData = { ...tabDatas };
        newData[`list${tabIndex}`] = {
          datas: resp.data,
          page: {
            total: resp.page.totalCount,
            pageSize: resp.page.pageSize,
            current: resp.page.pageNo,
          },
        };
        this.setState({
          tabDatas: newData,
        });
      }
    });
  }

  handleFormReset = () => {
    this.props.form.resetFields();
    this.getList();
  }

  handleSearch = (e) => {
    e && e.preventDefault();
    this.getList();
  }

  handleDetail = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'withdrawals/doctorIncomeInfo',
      payload: {
        restParams: {
          merchantId: getUser().merchantId,
          doctorId: data.doctorId,
        },
      },
    }).then((resp) => {
      if (resp && Object.prototype.hasOwnProperty.call(resp, 'code') && resp.code === 0) {
        this.setState({
          currentData: data,
          doctorWallet: resp.data,
          modalVisible: true,
        });
      }
    });
  }

  handleTableChange = (pagination) => {
    this.getList(pagination.current);
  }

  handleDetailTabChange = (pagination, type) => {
    this.getTabList(pagination.current, type);
  }

  handleModalVisible = () => {
    this.setState({
      modalVisible: false,
    }, () => {
      this.setState({
        doctorWallet: {},
        currentData: null,
        tabDatas: {
          list1: {
            datas: [],
            page: {
              total: 0,
              pageSize: 20,
              current: 1,
            },
          },
          list2: {
            datas: [],
            page: {
              total: 0,
              pageSize: 20,
              current: 1,
            },
          },
          list3: {
            datas: [],
            page: {
              total: 0,
              pageSize: 20,
              current: 1,
            },
          },
          list4: {
            datas: [],
            page: {
              total: 0,
              pageSize: 20,
              current: 1,
            },
          },
        },
      });
    });
  }

  handleAuditRejectModalVisible = () => {
    this.setState({
      auditModalVisible: false,
      auditRemark: '',
      currentData: null,
    });
  }

  handleAuditRejectModal = (data) => {
    this.setState({
      auditModalVisible: true,
      auditRemark: '',
      currentData: data,
    });
  }

  handleAudit = (data, status) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'withdrawals/withdrawalStatus',
      payload: {
        restParams: {
          merchantId: getUser().merchantId,
        },
        params: {
          id: data.id,
          status,
        },
      },
    }).then((resp) => {
      if (resp && Object.prototype.hasOwnProperty.call(resp, 'code') && resp.code === 0) {
        this.getList(this.state.list.page.current);
        message.success('操作成功');
      }
    });
  }

  auditReject = () => {
    const { currentData, auditRemark } = this.state;
    const { dispatch } = this.props;
    if (!auditRemark) {
      message.error('请输入驳回原因');
      return;
    }
    dispatch({
      type: 'withdrawals/withdrawalStatus',
      payload: {
        restParams: {
          merchantId: getUser().merchantId,
        },
        params: {
          id: currentData.id,
          remark: auditRemark,
          status: 2,
        },
      },
    }).then((resp) => {
      if (resp && Object.prototype.hasOwnProperty.call(resp, 'code') && resp.code === 0) {
        this.getList(this.state.list.page.current);
        message.success('操作成功');
        this.handleAuditRejectModalVisible();
      }
    });
  }

  renderForm() {
    const { form: { getFieldDecorator }, loading } = this.props;
    const rangePickerLocale = { lang: { rangePlaceholder: ['开始日期', '结束日期'] } };
    return (
      <Form onSubmit={this.handleSearch} layout="inline" >
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="时间区间">
              {getFieldDecorator('dateRange', { initialValue: [] })(
                <RangePicker style={{ width: '100%' }} locale={rangePickerLocale} />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="审核状态">
              {getFieldDecorator('status', { initialValue: '' })(
                <Select placeholder="请选择审核状态" style={{ width: '100%' }}>
                  {
                    config.verifyStatus.map((item) => {
                      return <Option key={item.id}>{item.name}</Option>;
                    })
                  }
                  <Option value="">全部</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="医生查询">
              {getFieldDecorator('keyword', { initiaValue: '' })(
                <Input placeholder="请输入医生姓名/医生ID" />
              )}
            </FormItem>
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

  renderTable(datas, page) {
    const { auditStatistics } = this.state;
    const { loading } = this.props;
    const paginationProps = {
      showTotal: (total) => {
        return `共${total}条数据  每页${page.pageSize}条`;
      },
      ...page,
    };
    const columns = [
      {
        title: '提现ID',
        dataIndex: 'depositNum',
      },
      {
        title: '申请时间',
        dataIndex: 'createTime',
      },
      {
        title: '医生姓名',
        dataIndex: 'doctorName',
      },
      {
        title: '医生ID',
        dataIndex: 'doctorShowId',
      },
      {
        title: '提现账号',
        dataIndex: 'openId',
      },
      {
        title: '申请提现金额(元)',
        dataIndex: 'amount',
      },
      {
        title: '审核状态',
        render: (text, record) => {
          const status = config.verifyStatus.find(i => i.id === record.status);
          const rejectInfo = (name) => {
            return (
              <Popover content={record.remark} title="审核意见" trigger="hover">
                {name}&nbsp;<Icon type="info-circle-o" style={{ color: 'orange' }} />
              </Popover>
            );
          }
          return (status ? (status.id === 2 ? rejectInfo(status.name) : status.name) : '');
        },
      },
      // {
      //   title: '审核意见',
      //   dataIndex: 'remark',
      // },
      {
        title: '审核人',
        dataIndex: 'operatorName',
      },
      {
        title: '审核时间',
        dataIndex: 'updateTime',
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <Fragment>
              <a onClick={() => { this.handleDetail(record); }}>详情</a>
              {
                (record.status === 1 &&
                  (
                    <span>
                      <Divider type="vertical" />
                      <Popconfirm title="确认审核通过？" onConfirm={() => this.handleAudit(record, 1)}>
                        <a style={{ color: 'green' }}>通过</a>
                      </Popconfirm>
                      <Divider type="vertical" />
                      <a style={{ color: 'red' }} onClick={() => this.handleAuditRejectModal(record)}>驳回</a>
                    </span>
                  )) || (record.status === 8 &&
                    (
                      <span>
                        <Divider type="vertical" />
                        <Popconfirm title="确认重新转账？" onConfirm={() => this.handleAudit(record, 3)}>
                          <a style={{ color: 'orange' }}>重新转账</a>
                        </Popconfirm>
                      </span>
                    )
                )
              }
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
                  <Col span={18} style={{ textAlign: 'right' }}>
                    应付总额：{auditStatistics.dueAmount}元&nbsp;&nbsp;医生可提现总额：{auditStatistics.canDepositAmount}元&nbsp;&nbsp;待审核总额：{auditStatistics.waitAuditAmount}元
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
    const { list, tabDatas, modalVisible, doctorWallet, auditRemark, auditModalVisible } = this.state;
    const { loading } = this.props;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            {this.renderTable(list.datas, list.page)}
          </div>
        </Card>
        <Modal
          title="审核驳回"
          visible={auditModalVisible}
          onCancel={() => this.handleAuditRejectModalVisible()}
          onOk={() => this.auditReject()}
        >
          <Input value={auditRemark} onChange={(e) => { this.setState({ auditRemark: e.target.value }); }} placeholder="请输入驳回原因" />
        </Modal>
        <Modal
          title="详情"
          visible={modalVisible}
          onCancel={() => this.handleModalVisible()}
          footer={null}
          width={1080}
        >
          <div style={{ marginBottom: 10 }}>
            <Row>
              <Col span={8}>医生姓名：{doctorWallet.doctorName || ''}</Col>
              <Col span={8}>医生ID：{doctorWallet.doctorShowId || ''}</Col>
            </Row>
            <Row>
              <Col span={8}>应付款：{doctorWallet.saleAmount || ''}</Col>
              <Col span={8}>可提现金额：{doctorWallet.canDepositAmount || ''}</Col>
              <Col span={8}>到账金额：{doctorWallet.arriveAmount || ''}</Col>
              <Col span={8}>已提现金额：{doctorWallet.incomeAmount || ''}</Col>
            </Row>
          </div>
          {modalVisible &&
            (
              <WithdrawalDetailTabs
                datas={tabDatas}
                income={doctorWallet}
                onChange={this.handleDetailTabChange}
                loading={loading}
              />
            )
          }
        </Modal>
      </PageHeaderLayout >
    );
  }
}
