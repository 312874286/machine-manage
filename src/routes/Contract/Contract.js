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
import Barcode from 'react-barcode';
import Print from '../../utils/printer';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Contract.less';
import LogModal from '../../components/LogModal';
import ContractDetail from '../../components/Contract/detail';
import PrintConfig from './PrintConfig';

const { RangePicker } = DatePicker;
const { Option } = Select;
const FormItem = Form.Item;
const config = {
  contractStatus: {
    0: '取消',
    1: '报告已上传完成',
    2: '待排班',
    3: '待履约',
    4: '待用户上车',
    5: '开始履约',
    6: '待上传报告',
    8: '待第三方上传报告',
  }
};
@connect(({ manage, loading, log }) => ({
  manage,
  log,
  loading: loading.models.manage,
}))
@Form.create()
export default class Contract extends PureComponent {
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
      data: null,
      printData: [],
    },
    startCreateTime: '',
    endCreateTime: '',
    startActionTime: '',
    endActionTime: '',
    status: '',
    keywords: '',
    detailVisible: true,
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
      type: 'manage/contracts',
      payload: {
        restParams: {
          queryString: {
            startCreateTime: this.state.startCreateTime,
            endCreateTime: this.state.endCreateTime,
            startActionTime: this.state.startActionTime,
            endActionTime: this.state.endActionTime,
            status: this.state.status,
            keyWords: this.state.keywords,
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
  // 声明打印容器
  printBox = null;

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
        startCreateTime: fieldsValue.createTime && fieldsValue.createTime.length === 2 ? fieldsValue.createTime[0].format('YYYY-MM-DD') : '',
        endCreateTime: fieldsValue.createTime && fieldsValue.createTime.length === 2 ? fieldsValue.createTime[1].format('YYYY-MM-DD') : '',
        startActionTime: fieldsValue.arriveTime && fieldsValue.arriveTime.length === 2 ? fieldsValue.arriveTime[0].format('YYYY-MM-DD') : '',
        endActionTime: fieldsValue.arriveTime && fieldsValue.arriveTime.length === 2 ? fieldsValue.arriveTime[1].format('YYYY-MM-DD') : '',
        status: fieldsValue.status,
        keywords: fieldsValue.keywords,
      }, () => {
        this.getList();
      });
    });
  }

  handlePrint = (data) => {
    this.props.dispatch({
      type: 'manage/contractPrint',
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
      detail.printData = resp.data;
      this.setState({
        detail,
      }, () => {
        if (detail.printData.length > 0) {
          Print(this.printBox, { mode: 'iframe', extraHead: `<style type="text/css">${PrintConfig.style}</style>` });
        } else {
          message.info('合约无可打印条形码');
        }
      });
    });
  }

  handleDetail = (data) => {
    this.props.dispatch({
      type: 'manage/contract',
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

  handleDetailVisible = () => {
    this.setState({
      detail: {
        data: null,
      },
      detailVisible: false,
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
        title: '合约ID',
        width: 170,
        dataIndex: 'orderNum',
      },
      {
        title: '班次ID',
        width: 130,
        dataIndex: 'classesId',
      },
      {
        title: '联系电话',
        width: 120,
        dataIndex: 'parentsPhone',
      },
      {
        title: '宝宝姓名',
        width: 120,
        dataIndex: 'babyName',
      },
      {
        title: '合约状态',
        width: 120,
        render: (text, record) => {
          return config.contractStatus[record.status];
        },
      },
      {
        title: '合约生成时间',
        width: 170,
        dataIndex: 'createTime',
      },
      {
        title: '预约到达时间',
        width: 170,
        dataIndex: 'ext1Time',
      },
      {
        title: '最近更新时间',
        width: 170,
        dataIndex: 'updateTime',
      },
      {
        title: '商户',
        width: 120,
        dataIndex: 'merchantName',
      },
      {
        title: '备注',
        width: 160,
        dataIndex: 'remark',
      },
      {
        title: '操作',
        fixed: 'right',
        render: (text, record) => {
          return (
            <Fragment>
              <a onClick={() => { this.handleDetail(record); }}>详情</a>
              <Divider type="vertical" />
              <a onClick={() => { this.handlePrint(record); }}>打印条码</a>
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
                  <Col span={12}>
                    查询结果：共{paginationProps.total}条数据&nbsp;&nbsp;每页{paginationProps.pageSize}条
                  </Col>
                  <Col span={12} style={{ textAlign: 'right', color: 'red' }}>
                    *打印时请务必在打印预览窗口中将“更多设置-边距”设置为无边距
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
          scroll={{ x: 1560 }}
        />
      </div>
    );
  }

  renderPrintBox = ({ data }) => {
    const barcodeProps = {
      displayValue: true,
      height: 26,
      width: 1,
      margin: 0,
      fontSize: 12,
      textMargin: 0,
    };
    return (
      <div className="hiddenContent">
        <div ref={(ref) => { this.printBox = ref; }} className="print-box">
          {
            data && data.length > 0 && data.map(
              (d) => {
                const items = [];
                for (let index = 0; index < 3; index += 1) {
                  const item = (
                    <div className="print-item">
                      <div className="print-item-desc">{d.desc}</div>
                      <div>
                        <div className="print-item-row">
                          <div>宝宝姓名：{d.name}{d.sex === '1' ? '(男)' : d.sex === '0' ? '(女)' : ''}</div>
                        </div>
                        <div className="print-item-row">
                          <div>生日：{d.birthday}</div>
                        </div>
                        <div className="print-item-row">
                          <div className="barcode">
                            {
                              d.num && <Barcode value={d.num} {...barcodeProps} />
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                  items.push(item);
                }
                return items;
              })
          }
        </div>
      </div>
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { log: { datas, page }, detail, detailVisible } = this.state;
    const PrintBox = this.renderPrintBox;

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={12}>
                    <FormItem label="状态">
                      {getFieldDecorator('status', {
                        initialValue: '',
                      })(
                        <Select placeholder="请选择">
                          {Object.keys(config.contractStatus).map((key) => {
                            const value = config.contractStatus[key];
                            return <Option key={key} value={key}>{value}</Option>;
                          })}
                          <Option value="">全部</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={12}>
                    <FormItem label="合约生成时间">
                      {getFieldDecorator('createTime')(
                        <RangePicker />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={12}>
                    <FormItem label="预约到达时间">
                      {getFieldDecorator('arriveTime')(
                        <RangePicker />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={12}>
                    <FormItem label="查询">
                      {getFieldDecorator('keywords', {
                        initialValue: '',
                      })(
                        <Input placeholder="请输入电话/合约ID/宝宝姓名" />
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
          data={datas}
          page={page}
          loding={this.state.logModalLoading}
          logVisible={this.state.logModalVisible}
          logHandleCancel={this.logModalHandleCancel}
          logModalhandleTableChange={this.logModalhandleTableChange}
        />
        {
          detail && detail.data && (
            <ContractDetail data={detail.data} title="详情" width="80%" onClose={this.handleDetailVisible} visible={detailVisible} />
          )
        }
        <PrintBox data={detail.printData} />
      </PageHeaderLayout>
    );
  }
}

