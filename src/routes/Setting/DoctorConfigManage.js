import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Tabs, Input, Button, Divider, Table, Popconfirm, notification } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getUser } from '../../utils/authority';

const { TabPane } = Tabs;
const fieldMap = {
  DEPART: '科室',
  IDENTITY: '身份',
  SENIORITY: '资格',
  TECHNICAL: '职称',
};
const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);
@connect(({ doctorConfigManage, loading }) => ({
  doctorConfigManage,
  loading: loading.models.list,
}))
@Form.create()
export default class DoctorConfigManage extends PureComponent {
  state = {
    type: 'DEPART',
    editStatus: false,
    list: {
      datas: [],
      page: null,
    },
  }

  componentDidMount() {
    this.getList();
  }

  getList = (pageNo) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'doctorConfigManage/list',
      payload: {
        restParams: {
          merchantId: getUser().merchantId,
          businessType: this.state.type,
          status: '',
          pageNo: pageNo || 1,
        },
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
  }

  refreshList = () => {
    const { list: { page: { current } } } = this.state;
    this.getList(current);
  }

  handleTableChange = (pagination) => {
    this.getList(pagination.current);
  }

  handleTabChange(key) {
    this.setState({
      type: key,
    }, () => {
      this.getList();
    });
  }

  handleUpdateItemStatus = (data) => {
    this.props.dispatch(
      {
        type: 'doctorConfigManage/updateItemStatus',
        payload: {
          restParams: {
            merchantId: getUser().merchantId,
            configId: data.id,
            operation: data.status === 1 ? 'DISABLE' : 'ENABLE',
          },
        },
      }
    ).then((resp) => {
      if (resp && resp.code === 0) {
        notification.success({
          message: '操作成功',
        });
        this.refreshList();
      }
    });
  }

  handleAddItem() {
    const { list } = this.state;
    const datas = [...list.datas];
    datas.push({
      id: '',
      name: null,
      editable: true,
    });
    list.datas = datas;
    this.setState({
      editStatus: true,
      ...list,
    });
  }

  handleItemEdit(data) {
    if (this.state.editStatus) {
      notification.warning({
        message: '编辑锁定',
        description: '信息编辑中，无法操作',
      });
      return;
    }
    const { list } = this.state;
    const datas = [...list.datas];
    const target = datas.find(item => item.id === data.id);
    if (target) {
      target.editable = true;
      list.datas = datas;
      this.setState({
        editStatus: true,
        ...list,
      });
    }
  }

  handleItemSave(data) {
    const type = data.id ? 'doctorConfigManage/updateItem' : 'doctorConfigManage/addItem';
    const restParams = { merchantId: getUser().merchantId };
    if (data.id) {
      restParams.configId = data.id;
    }
    this.props.dispatch(
      {
        type,
        payload: {
          restParams,
          params: {
            name: data.name,
            businessType: this.state.type,
          },
        },
      }
    ).then((resp) => {
      if (resp && resp.code === 0) {
        notification.success({
          message: '操作成功',
        });
        this.setState({ editStatus: false });
        this.refreshList();
      }
    });
  }

  handleItemCancel() {
    this.setState({ editStatus: false }, this.refreshList);
  }

  handleItemEditChange(value, data, column) {
    const { list } = this.state;
    const datas = [...list.datas];
    const target = datas.find(item => item.id === data.id);
    if (target) {
      target[column] = value;
      list.datas = datas;
      this.setState({ ...list });
    }
  }

  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleItemEditChange(value, record, column)}
      />
    );
  }

  renderTable(datas, type) {
    const filedTitle = fieldMap[type];
    const columns = [
      {
        title: '序号',
        dataIndex: '',
        width: 160,
        render: (text, record, index) => index + 1,
      },
      {
        title: `${filedTitle}名称`,
        dataIndex: 'name',
        render: (text, record) => this.renderColumns(text, record, 'name'),
      },
      {
        title: '操作',
        width: 240,
        render: (text, record) => {
          const { editable } = record;
          return (
            <Fragment>
              {
                editable ?
                  (
                    <span>
                      <a onClick={() => this.handleItemSave(record)}>保存</a>
                      <Divider type="vertical" />
                      <Popconfirm title="确认取消?" onConfirm={() => this.handleItemCancel(record)}>
                        <a>取消</a>
                      </Popconfirm>
                    </span>
                  )
                  : (
                    <span>
                      <a onClick={() => this.handleItemEdit(record)} disabled={this.state.editStatus}>编辑</a>
                      <Divider type="vertical" />
                      <Popconfirm title={record.status === 1 ? `确认停用${filedTitle}"${record.name}"？` : `确认启用${filedTitle}"${record.name}"？`} onConfirm={() => this.handleUpdateItemStatus(record)}>
                        {record.status === 1 ? <a style={{ color: this.state.editStatus ? '' : 'red' }} disabled={this.state.editStatus}>停用</a> : <a style={{ color: this.state.editStatus ? '' : 'green' }} disabled={this.state.editStatus}>启用</a>}
                      </Popconfirm>
                    </span>
                  )
              }
            </Fragment >
          );
        },
      }];
    return (
      <div>
        <Table
          rowKey={record => record.id}
          dataSource={datas}
          columns={columns}
          pagination={false}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }

  render() {
    const { type, list, editStatus } = this.state;
    const addButton = <Button type="primary" onClick={() => this.handleAddItem()} disabled={editStatus}>添加设定</Button>;
    // const {modalVisible} = this.state;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Tabs
            defaultActiveKey="DEPART"
            onChange={(key) => { this.handleTabChange(key); }}
            tabBarExtraContent={addButton}
          >
            <TabPane tab="科室数据设定" key="DEPART" disabled={editStatus}>
              {this.renderTable(list.datas, type)}
            </TabPane>
            <TabPane tab="身份类型数据设定" key="IDENTITY" disabled={editStatus}>
              {this.renderTable(list.datas, type)}
            </TabPane>
            <TabPane tab="资格数据设定" key="SENIORITY" disabled={editStatus}>
              {this.renderTable(list.datas, type)}
            </TabPane>
            <TabPane tab="职称数据设定" key="TECHNICAL" disabled={editStatus}>
              {this.renderTable(list.datas, type)}
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderLayout >
    );
  }
}
