import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Col, Row, Button, Input, Modal, message, Tree } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { TreeNode } = Tree;

// var treeData = [{
//   title: '0-0',
//   key: '0-0',
//   children: [{
//     title: '0-0-0',
//     key: '0-0-0',
//     children: [
//       { title: '0-0-0-0', key: '0-0-0-0' },
//       { title: '0-0-0-1', key: '0-0-0-1' },
//       { title: '0-0-0-2', key: '0-0-0-2' },
//     ],
//   }, {
//     title: '0-0-1',
//     key: '0-0-1',
//     children: [
//       { title: '0-0-1-0', key: '0-0-1-0' },
//       { title: '0-0-1-1', key: '0-0-1-1' },
//       { title: '0-0-1-2', key: '0-0-1-2' },
//     ],
//   }, {
//     title: '0-0-2',
//     key: '0-0-2',
//   }],
// }, {
//   title: '0-1',
//   key: '0-1',
//   children: [
//     { title: '0-1-0-0', key: '0-1-0-0' },
//     { title: '0-1-0-1', key: '0-1-0-1' },
//     { title: '0-1-0-2', key: '0-1-0-2' },
//   ],
// }, {
//   title: '0-2',
//   key: '0-2',
// }];


@connect(({ staff }) => ({ staff }))
export default class Staff extends PureComponent {
  state = {
    userName: '',
    visible: false,
    allList: [],
    currentUserId: '',
    // selectedRows: [],
    expandedKeys: [],
    autoExpandParent: true,
    checkedKeys: [],
    selectedKeys: [],
    isJiaoLeft: 'none',
    pageNo: 1,
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
    this.setState({
      allList: [],
    });
    // treeData = [];
    // this.state.selectedRows;
    this.getSystemRoleAlls();
    this.setState({
      visible: true,
      currentUserId: record.id,
    });
    // this.state.currentUserId = record.id;
    console.log(record.id);
  }
  onExpand = (expandedKeys) => {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  onCheck = (checkedKeys) => {
    // this.setState({
    //   selectedRows: checkedKeys,
    // });
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  }
  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
  }
  getSystemUserList = () => {
    this.props.dispatch({
      type: 'staff/getSystemUserList',
      payload: {
        restParams: {
          keyword: this.state.userName,
          pageNo: this.state.pageNo,
        },
      },
    });
  }
  getSystemUserQueryUserRoles = (data_) => {
    if (data_.length === 0) {
      this.setState({
        isJiaoLeft: 'block',
      });
    } else {
      this.setState({
        isJiaoLeft: 'none',
      });
    }
    var arr = [];
    for (var i = 0; i < data_.length; i++) {
      let obj = {};
      obj.title = data_[i].name;
      obj.key = data_[i].id;
      obj.id = data_[i].id;
      arr.push(obj);
    }

    this.props.dispatch({
      type: 'staff/getSystemUserQueryUserRoles',
      payload: {
        restParams: {
          userId: this.state.currentUserId,
        },
      },
    }).then((res) => {
      const { code, data, msg} = res;
      let checkedKeysarr = [];
      for (let i = 0; i < data.length; i++) {
        checkedKeysarr.push(data[i].roleId);
      }

      this.setState({
        allList: arr,
      }, () => {
        this.setState({
          checkedKeys: checkedKeysarr,
        });
      });
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
      console.log(data);
      this.getSystemUserQueryUserRoles(data);

    });
  }
  hideOKModal = () => {

    if (this.state.checkedKeys.length === 0) {
      console.log('请授权::');
      message.info('请授权');
      return;
    }

    let arr = [];
    for (let i = 0; i < this.state.checkedKeys.length; i++) {
      arr.push(this.state.checkedKeys[i]);
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
        // message.error(msg);
        const modal = Modal.error({
          title: '提示',
          content: msg,
        });
        setTimeout(() => modal.destroy(), 2000);
        return;
      }
      // message.success(msg);
      const modal = Modal.success({
        title: '提示',
        content: msg,
      });
      setTimeout(() => modal.destroy(), 2000);
      this.setState({
        visible: false,
      });
      this.getSystemUserList();
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
    this.setState({
      pageNo: pagination.current,
    }, () => {
      this.getSystemUserList();
    });

    console.log(pagination, filters, sorter);
  }
  renderTreeNodes = (data) => {
    return data.map((item) => {
      // console.log(item);
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  }
  handleReset = () => {
    this.setState({
      userName: '',
    });
  }
  go = (totalNo) => {
    const { No } = this.state
    if (No) {
      if (No <= totalNo && No > 0) {
        this.handleTableChange({current: No, pageSize: 20 }, {}, {});
      } else {
        this.setState({
          No: ''
        })
      }
    } else {
      return false
    }
  }
  inputValue = (e) => {
    this.setState({
      No: e.target.value
    })
  }
  render() {
    const { allList, checkedKeys, isJiaoLeft, userName, No } = this.state;
    const { staff: { list, page, totalNo } } = this.props;
    // console.log(111, list, page, allList, 222);
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: '15%'
      }, {
        title: '员工手机',
        dataIndex: 'mobile',
        key: 'mobile',
        width: '15%'
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: '15%'
      }, {
        title: '角色',
        dataIndex: 'roles',
        key: 'roles',
        width: '20%'
      }, {
        title: '部门名称',
        dataIndex: 'deptName',
        key: 'deptName',
      }, {
        title: '授权',
        dataIndex: '',
        width: '15%',
        key: '',
        render: (record) => {
          return <a onClick={this.onToAuthorization.bind(this, record)}>授权</a>;
        },
      },
    ];
    // const { userName } = this.state;
    const paginationProps = {
      showTotal: (total) => {
        // console.log(total, page)
        // return `第${page.current}页 / 共${Math.ceil(total/page.pageSize)}页`;
        return (
          <div className="paginationBox">
            <span>当前显示{page.pageSize}条/页，共{page.total}条</span>
            <div>
              <span>第{page.current}页 / 共{Math.ceil(total/page.pageSize)}页</span>
              <span>
                 <span>跳至 <Input value={No} onChange={this.inputValue}/>页</span>
                 <Button type="primary" onClick={() => this.go(totalNo)}>Go</Button>
               </span>
            </div>
          </div>
        );
      },
      ...page,
      showQuickJumper: false,
    };
    // const columnsPop = [
    //   {
    //     title: '角色名称',
    //     dataIndex: 'name',
    //     key: 'name',
    //   },
    // ];
    // // console.log(111, this.state.selectedRows);
    // const rowSelection = {
    //   onChange: (selectedRowKeys, selectedRows) => {
    //     this.state.selectedRows = selectedRows;
    //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    //   },
    // };
    console.log(111, checkedKeys);
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
          <div style={{display:isJiaoLeft}}>角色管理未添加角色</div>
          <Tree
            checkable
            onExpand={this.onExpand}
            expandedKeys={this.state.expandedKeys}
            autoExpandParent={this.state.autoExpandParent}
            onCheck={this.onCheck}
            checkedKeys={checkedKeys}
            onSelect={this.onSelect}
            selectedKeys={this.state.selectedKeys}
          >
            {this.renderTreeNodes(allList)}
          </Tree>
        </Modal>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 10px'}}>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={9} sm={24}>
              <Input placeholder="请输入员工姓名、员工手机、邮箱、角色、部门名称" value={userName} onChange={this.onChange} />
            </Col>
            <Col md={6} sm={24}>
              <Button onClick={this.handleReset}>
                  重置
              </Button>
              <Button style={{ marginLeft: 8 }} type="primary" onClick={this.onFindData.bind(this)}>查询</Button>
            </Col>
          </Row>
        </Card>
        <Card bordered={false}>
          {/*<Table*/}
            {/*dataSource={list}*/}
            {/*columns={columns}*/}
            {/*pagination={paginationProps}*/}
            {/*onChange={this.handleTableChange}*/}
            {/*rowKey="id"*/}
          {/*/>*/}
          <Table
            columns={columns}
            dataSource={list}
            rowKey="id"
            pagination={paginationProps}
            onChange={this.handleTableChange}
            scroll={{ y: (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 100) }}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
