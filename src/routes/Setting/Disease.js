import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Card, Form, Input, Modal, Divider, Table, Popconfirm, Alert, message, Col, Button, DatePicker, Select } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getUser } from '../../utils/authority';
import { parseUploadFileUrl } from '../../utils/utils';
import LogModal from '../../components/LogModal';
import styles from './Disease.less';


const formItemLayout = {
  labelCol: {
    md: { span: 24 },
    lg: { span: 8 },
  },
  wrapperCol: {
    md: { span: 24 },
    lg: { span: 12 },
  },
};
@connect(({ disease, loading, log }) => ({
  disease,
  log,
  loading: loading.models.disease,
}))
@Form.create()
export default class Disease extends PureComponent {
  state = {
    list: {
      pagination: {
        current: 0,
        pageSize: 20,
        total: 0,
      },
      datas: [],
    },
    dialog: {
      detail: {
        source: null,
        data: null,
      },
    },
    keyword: '',
    detailModalVisible: false,
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
    const { dispatch } = this.props;
    const restParams = {
      pageNo: this.state.list.pagination.current,
      keyword: this.state.keyword,
    };
    dispatch({
      type: 'disease/list',
      payload: {
        restParams,
      },
    }).then((resp) => {
      if (resp && resp.code === 0 && resp.data) {
        const { data, page } = resp;
        this.setState({
          list: {
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
  }

  handleSearch = (e) => {
    e && e.preventDefault();
    this.getList();
  }

  handleFormReset = () => {
    this.props.form.resetFields();
    this.getList();
  }

  handleAddClick = () => {
    this.props.form.resetFields();
    this.setState({
      dialog: {
        detail: {
          source: null,
          data: null,
        },
      },
      detailModalVisible: true,
    });
  }

  handleDetailClick = (item) => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'disease/detail',
      payload: {
        restParams: {
          id: item.id,
        },
      },
    }).then((resp) => {
      if (resp && resp.code === 0 && resp.data) {
        const { data } = resp;
        form.setFieldsValue({
          code: data.code,
          name: data.name,
          assistCode: data.assistCode,
          pushNum: data.pushNum,
          delayedDays: data.delayedDays,
        });
        this.setState({
          dialog: {
            detail: {
              source: item,
              data,
            },
          },
          detailModalVisible: true,
        });
      } else {
        message.error(resp ? resp.msg : '详情获取失败');
      }
    });
  }

  handleDetailSave = () => {
    const { form, dispatch } = this.props;
    const { dialog: { detail: { source } } } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const params = { ...fieldsValue };
      if (source) {
        params.id = source.id;
      }
      dispatch({
        type: 'disease/save',
        payload: {
          params,
        },
      }).then((resp) => {
        if (!!resp && resp.code === 0) {
          message.success('保存成功');
          this.setState({
            detailModalVisible: false,
          }, () => {
            this.handleTableChange({ current: 0 });
          });
        } else {
          message.error(resp ? resp.msg : '保存失败');
        }
      });
    });
  }

  handleDetailCancelClick = () => {
    this.setState({ detailModalVisible: false });
  }

  handleDeleteClick = (item) => {
    this.props.dispatch({
      type: 'disease/delete',
      payload: {
        restParams: {
          id: item.id,
        },
      },
    }).then((resp) => {
      if (resp && resp.code === 0) {
        message.success('删除成功');
        this.getList();
      } else {
        message.error(resp ? resp.msg : '删除失败');
      }
    });
  }

  handleModalVisible = () => {
    this.setState({
      detailModalVisible: false,
    }, () => {
      this.props.form.resetFields();
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
    const { list: { datas, pagination } } = this.state;
    const { loading } = this.props;

    const columns = [
      {
        title: '编码',
        dataIndex: 'code',
      },
      {
        title: '疾病名称',
        dataIndex: 'name',
      },
      {
        title: '辅助码',
        dataIndex: 'assistCode',
      },
      {
        title: '最长观察期(天)',
        dataIndex: 'delayedDays',
      },
      {
        title: '推送次数',
        dataIndex: 'pushNum',
      },
      {
        title: '操作人',
        dataIndex: 'operator',
      },
      {
        title: '操作',
        render: (text, data) => (
          <Fragment>
            <a onClick={() => this.handleDetailClick(data)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="确认删除?" onConfirm={() => this.handleDeleteClick(data)}>
              <a>删除</a>
            </Popconfirm>
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
    const { detailModalVisible } = this.state;
    const { form: { getFieldDecorator }, loading } = this.props;
    return (
      <Modal
        title="详情"
        visible={detailModalVisible}
        onCancel={() => this.handleModalVisible()}
        width={720}
        footer={[
          <Button key="submit" type="primary" onClick={this.handleDetailSave} loading={loading}>保存</Button>,
          <Button key="back" onClick={this.handleModalVisible}>取消</Button>,
        ]}
      >
        <Form>
          <Form.Item {...formItemLayout} label="编码">
            {getFieldDecorator('code', {
              rules: [{ required: true, message: '编码不能为空' }],
            })(
              <Input placeholder="请输入编码" />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="疾病名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '疾病名称不能为空' }],
            })(
              <Input placeholder="请输入疾病名称" />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="辅助码">
            {getFieldDecorator('assistCode', {
              rules: [{ required: true, message: '辅助码不能为空' }],
            })(
              <Input placeholder="请输入辅助码" />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="推送次数">
            {getFieldDecorator('pushNum', {
              rules: [{ required: true, message: '推送次数不能为空' }],
            })(
              <Input placeholder="请输入推送次数" />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="最长观察期">
            {getFieldDecorator('delayedDays', {
              rules: [{ required: true, message: '最长观察期不能为空' }],
            })(
              <Input placeholder="请输入最长观察期" />
            )}
          </Form.Item>
        </Form>
      </Modal>);
  }

  render() {
    const { dialog: { log, detail }, logModalVisible, logModalLoading } = this.state;
    const { loading } = this.props;
    const TableList = this.renderList;
    const DetailModal = this.renderDetail;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12} sm={24}>
                  <Form.Item>
                    <Input placeholder="使用疾病名称/编码搜索" value={this.state.keyword} onChange={(e) => { this.setState({ keyword: e.target.value }); }} />
                  </Form.Item>
                </Col>
                <Col md={{ span: 12, lg: 24, xl: 48 }} sm={24}>
                  <Button style={{ marginLeft: 8 }} type="primary" onClick={() => { this.handleTableChange({ current: 0 }); }} loading={loading}>查询</Button>
                  <Button style={{ marginLeft: 8 }} type="primary" onClick={this.handleAddClick} loading={loading}>新增</Button>
                </Col>
              </Row >
            </div>
            <TableList />
          </div>
        </Card>
        <DetailModal />
        {/* <LogModal
          data={log.list.datas}
          page={log.list.pagination}
          loding={logModalLoading}
          logVisible={logModalVisible}
          logHandleCancel={this.logModalHandleCancel}
          logModalhandleTableChange={this.logModalhandleTableChange}
        /> */}
      </PageHeaderLayout >
    );
  }
}
