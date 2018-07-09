import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Col, Row, Button, Input, Modal, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ staff }) => ({ staff }))
export default class Staff extends PureComponent {
  state = {
    userName: '',
    visible: false,
    allList: [],
    currentUserId: '',
    selectedRows: [],
  }
  componentDidMount = () => {
    this.getSystemUserList();
  }
  onChange = (e) => {
    this.setState({ userName: e.target.value });
    // console.log(111,e.target.value,this);
  }
  onFindData = (e) => {
    this.getSystemUserList();
    console.log(this, e, this.state.userName);
  }
  onToAuthorization = (record) => {
    this.getSystemRoleAlls();
    this.setState({
      visible: true,
    });
    this.state.currentUserId = record.id;
    console.log(record.id);
  }
  getSystemUserList = () => {
    this.props.dispatch({
      type: 'staff/getSystemUserList',
      payload: {
        restParams: {
          keyword: this.state.userName,
        },
      },
    });
  }
  getSystemRoleAlls = () => {
    this.props.dispatch({
      type: 'staff/getSystemRoleAll',
      payload: {
        restParams: {
          keyword: this.state.userName,
        },
      },
    }).then((res) => {
      const { code, data } = res;
      // if(!code) return;
      this.setState({
        allList: data,
      });
    });
  }
  hideOKModal = () => {
    let arr = [];
    for (let i = 0; i < this.state.selectedRows.length; i++) {
      arr.push(this.state.selectedRows[i].id);
    }
    // JSON.stringify({a:1,b:2})
    // console.log(arr);
    // return;
    this.props.dispatch({
      type: 'staff/getSystemUserAuth',
      payload: {
        restParams: {
          userId: this.state.currentUserId,
          roleIds: JSON.stringify(arr),
        },
      },
    }).then((res) => {
      const { code, msg } = res;
      if (code !== 0) {
        message.error(msg);
        return;
      }
      message.success(msg);
      this.setState({
        visible: false,
      });
    });
    console.log('hideOKModal::');
  }
  hideCancelModal = () => {
    this.setState({
      visible: false,
    });
    console.log('hideCancelModal::');
  }
  handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter);
  }
  render() {
    const { allList } = this.state;
    const { staff: { list, page } } = this.props;
    // console.log(111, list, page, allList, 222);
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '员工手机',
        dataIndex: 'mobile',
        key: 'mobile',
      }, {
        title: '邮箱',
        dataIndex: 'orgEmail',
        key: 'orgEmail',
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
      }, {
        title: '部门名称',
        dataIndex: 'deptName',
        key: 'deptName',
      }, {
        title: '授权',
        dataIndex: '',
        key: '',
        render: (record) => {
          return <Button type="primary" onClick={this.onToAuthorization.bind(this, record)}>授权</Button>;
        },
      },
    ];
    // const { userName } = this.state;
    const paginationProps = {
      showTotal: (total) => {
        return `共${total}条数据  每页${page.pageSize}条`;
      },
      ...page,
    };
    const columnsPop = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
      },
    ];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.state.selectedRows = selectedRows;
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
    };
    return (
      <PageHeaderLayout>
        <Modal
          title="角色集合"
          visible={this.state.visible}
          onOk={this.hideOKModal}
          onCancel={this.hideCancelModal}
          okText="确认"
          cancelText="取消"
        >
          <Table
            dataSource={allList}
            columns={columnsPop}
            rowSelection={rowSelection}
            rowKey="id"
          />
        </Modal>
        <Card>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={9} sm={24}>
              <Input placeholder="姓名" onChange={this.onChange} />
            </Col>
            <Col md={6} sm={24}>
              <Button style={{ marginLeft: 8 }} type="primary" onClick={this.onFindData.bind(this)}>查询</Button>
            </Col>
          </Row>
        </Card>
        <Card>
          <Table
            dataSource={list}
            columns={columns}
            pagination={paginationProps}
            onChange={this.handleTableChange}
            rowKey="id"
            bordered
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
