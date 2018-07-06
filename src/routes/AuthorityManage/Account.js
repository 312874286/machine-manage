import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Button, Row, Col, Input, Modal, Tree } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { TreeNode } = Tree;
// const treeData = [{
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

@connect(({ account }) => ({ account }))
export default class Account extends PureComponent {
  state = {
    userName: '',
    visible: false,
    expandedKeys: [],
    autoExpandParent: true,
    checkedKeys: [],
    selectedKeys: [],
    treeData: [],
  }
  componentDidMount = () => {
    this.getSystemRoleList();
  }
  onToAuthorization = (record) => {
    console.log(record, this);
  }
  onFindData = (e) => {
    this.getSystemRoleList();
    console.log(this, e, this.state.userName);
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
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  }
  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
  }
  getSystemRoleList = () => {
    this.props.dispatch({
      type: 'account/getSystemRoleList',
      payload: {
        restParams: {
          keyword: this.state.userName,
        },
      },
    });
  }
  handleModalAdd = (e) => {
    this.props.dispatch({
      type: 'account/getSystemFunctionAll',
      payload: {
        restParams: {
        },
      },
    }).then((res) => {
      const { code, data } = res;
      // if(!code) return;
      const otherdata = data.children;
      for (const i in otherdata) {
        if (otherdata[i].children) {
          this.bianlijson(otherdata[i].children);
        }
        otherdata[i].key = otherdata[i].id;
      }

      console.log(otherdata);
      // treeData = data;
      this.setState({
        treeData: otherdata,
      });
    });
    this.setState({
      visible: true,
    });
  }
  bianlijson = (data) => {
    for (const i in data) {
      if (data[i].children) {
        this.bianlijson(data[i].children);
      }
      data[i].key = data[i].id;
    }
  }
  hideOKModal = (e) => {
    this.setState({
      visible: false,
    });
  }
  hideCancelModal = (e) => {
    this.setState({
      visible: false,
    });
  }
  renderTreeNodes = (data) => {
    return data.map((item) => {
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
  render() {
    const { treeData } = this.state;
    const { account: { list, page } } = this.props;
    // console.log(111,list,page);
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '权限集合',
        dataIndex: 'auths',
        key: 'auths',
      }, {
        title: '操作',
        dataIndex: '',
        key: '',
        render: (record) => {
          return (
            <div>
              <Button type="primary" onClick={this.onToAuthorization.bind(this, record)}>修改</Button>
              &nbsp;&nbsp;
              <Button type="danger" onClick={this.onToAuthorization.bind(this, record)}>删除</Button>
            </div>
          );
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
    return (
      <PageHeaderLayout>
        <Card>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={9} sm={24}>
              <Input placeholder="角色姓名" onChange={this.onChange} />
            </Col>
            <Col md={6} sm={24}>
              <Button style={{ marginLeft: 8 }} type="primary" onClick={this.onFindData.bind(this)}>查询</Button>
            </Col>
          </Row>
        </Card>
        <Card>
          <Button icon="plus" type="primary" onClick={() => this.handleModalAdd(true)}>新建</Button>
          <br /><br />
          <Table
            dataSource={list}
            columns={columns}
            pagination={paginationProps}
            onChange={this.handleTableChange}
            rowKey="id"
            bordered
          />
        </Card>
        <Modal
          title=""
          visible={this.state.visible}
          onOk={this.hideOKModal}
          onCancel={this.hideCancelModal}
          okText="确认"
          cancelText="取消"
        >
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              角色名称
            </Col>
            <Col md={15} sm={24}>
              <Input />
            </Col>
          </Row>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              权限集合
            </Col>
            <Col md={15} sm={24}>
              <Tree
                checkable
                onExpand={this.onExpand}
                expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                onCheck={this.onCheck}
                checkedKeys={this.state.checkedKeys}
                onSelect={this.onSelect}
                selectedKeys={this.state.selectedKeys}
              >
                {this.renderTreeNodes(treeData)}
              </Tree>
            </Col>
          </Row>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
