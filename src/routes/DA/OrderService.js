import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Table, message, DatePicker, Modal } from 'antd';
import { getUser } from '../../utils/authority';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { RangePicker } = DatePicker;
@connect(({ orderService, loading }) => ({
  orderService,
  loading: loading.models.orderService,
}))
@Form.create()
export default class OrderService extends PureComponent {
  state = {
    list: {
      datas: [],
    },
    modalVisible: false,
    currentData: null,
  }

  componentDidMount() {
    this.getList();
  }

  getList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderService/list',
    }).then((resp) => {
      if (resp && Object.prototype.hasOwnProperty.call(resp, 'code') && resp.code === 0) {
        this.setState({
          list: {
            datas: resp.data,
          },
        });
      }
    });
  }

  handleModalVisible = () => {
    const { form: { setFieldsValue } } = this.props;
    this.setState({
      currentData: null,
      modalVisible: false,
    }, () => {
      setFieldsValue({ dateRange: [] });
    });
  }

  handleExportVisible = (data) => {
    this.setState({
      currentData: data,
      modalVisible: true,
    });
  }

  handleModalOk = () => {
    const { currentData: { id } } = this.state;
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const restParams = {
        id,
        merchantId: getUser().merchantId,
      };
      const { dateRange } = fieldsValue;
      if (dateRange.length > 1) {
        restParams.startTime = dateRange[0].format('YYYY-MM-DD hh:mm:ss');
        restParams.endTime = dateRange[1].format('YYYY-MM-DD hh:mm:ss');
      } else {
        message.warning('请选择导出时间段');
        return;
      }
      dispatch({
        type: 'orderService/export',
        payload: {
          restParams,
        },
      }).then(this.handleModalVisible);
    });
  }

  renderTable(datas) {
    const { loading } = this.props;
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '责任人',
        dataIndex: 'principal',
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <Fragment>
              <a onClick={() => { this.handleExportVisible(record); }}>导出</a>
            </Fragment>
          );
        },
      }];
    return (
      <Table
        rowKey={record => record.id}
        dataSource={datas}
        columns={columns}
        pagination={false}
        onChange={this.handleTableChange}
        loading={loading}
      />
    );
  }

  render() {
    const { list, modalVisible } = this.state;
    const { form: { getFieldDecorator } } = this.props;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          {this.renderTable(list.datas)}
        </Card>
        <Modal
          title="请选择导出范围"
          visible={modalVisible}
          onCancel={this.handleModalVisible}
          onOk={this.handleModalOk}
          width={760}
          okText="导出"
        >
          <Form layout="inline" style={{ textAlign: 'center' }}>
            <Form.Item label="时间范围">
              {getFieldDecorator('dateRange', { initialValue: [] })(
                <RangePicker
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  style={{ width: '100%' }}
                  placeholder={['开始时间', '结束时间']}
                />
              )}
            </Form.Item>
          </Form>
        </Modal>
      </PageHeaderLayout >
    );
  }
}
