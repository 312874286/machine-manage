import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Modal,
  message,
  Popconfirm,
  Divider,
  Table,
  Tree,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Roles.less';
import { getUser } from '../../utils/authority';
import { template } from 'handlebars';

const FormItem = Form.Item;
const getFunctionCheckedIds = (functions) => {
  let ids = [];
  functions.forEach((f) => {
    if (f.isOwn) {
      ids.push(f.functionId);
    }
    if (f.functions && f.functions.length > 0) {
      ids = ids.concat(getFunctionCheckedIds(f.functions));
    }
  });
  return ids;
};
@connect(({ account, loading }) => ({
  account,
  loading: loading.models.account,
}))
@Form.create()
export default class UserRoles extends PureComponent {
  state = {
    pageNo: 1,
    pageSize: 20,
    total: 0,
    keywords: '',
    roles: [],
    editModalVisible: false,
    role: null,
    roleName: '',
    roleChecked: [],
  };

  componentDidMount = () => {
    this.getList();
  }

  // 获取列表
  getList = () => {
    this.props.dispatch({
      type: 'account/getRoles',
      payload: {
        restParams: {
          merchantId: getUser().merchantId,
          queryString: {
            pageNo: this.state.pageNo,
            keywords: this.state.keywords,
          },
        },
      },
    }).then((resp) => {
      if (!resp || resp.code !== 0) return;
      this.setState({ roles: resp.data || [] });
    });
  }

  // 分页
  handleTableChange = (pagination) => {
    const { current } = pagination;
    this.setState({
      pageNo: current,
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
        pageNo: 1,
        keywords: fieldsValue.keywords,
      }, () => {
        this.getList();
      });
    });
  }

  // 新建事件
  handleCreateClick = () => {
    this.props.dispatch({
      type: 'account/getRoleFunctions',
      payload: {
        restParams: {
          merchantId: getUser().merchantId,
        },
      },
    }).then((resp) => {
      if (!resp || resp.code !== 0) return;
      this.setState({
        role: { functionVOs: resp.data },
        editModalVisible: true,
      });
    });
  }

  renderEditModal = () => {
    const { role, roleName, roleChecked, editModalVisible } = this.state;
    console.log(roleChecked);
    const onCheck = (checkedKeys) => {
      this.setState({ roleChecked: checkedKeys });
    };
    const getTreeNodes = (functions) => {
      return functions.length > 0 && functions.map((r) => {
        return (
          <Tree.TreeNode title={r.functionDepict} key={r.functionId} selectable={false}>
            {r.functions && getTreeNodes(r.functions)}
          </Tree.TreeNode>
        );
      });
    };
    const handleEditSave = () => {
      if (!roleName) {
        message.warning('角色名称不能为空');
        return;
      }
      let type = 'account/addRole';
      const params = { roleName, functionIdList: roleChecked };
      const restParams = { merchantId: getUser().merchantId };
      if (role && role.roleId) {
        type = 'account/updateRole';
        restParams.roleId = role.roleId;
      }
      this.props.dispatch({
        type,
        payload: {
          params,
          restParams,
        },
      }).then((resp) => {
        if (!resp || resp.code !== 0) return;
        message.success('保存成功');
        handleEditCancel();
        this.getList();
      });
    };
    const handleEditCancel = () => {
      this.setState({
        editModalVisible: false,
        role: null,
        roleName: '',
        roleChecked: [],
      });
    };
    return (
      <Modal
        title="角色授权"
        visible={editModalVisible}
        onOk={handleEditSave}
        onCancel={handleEditCancel}
        className={styles.thinModal}
      >
        <Input value={roleName} onChange={(e) => { this.setState({ roleName: e.target.value }); }} placeholder="请输入角色名称" style={{ marginBottom: 10 }} />
        <Tree
          checkable
          checkedKeys={roleChecked}
          onCheck={onCheck}
        >
          {role && role.functionVOs && getTreeNodes(role.functionVOs)}
        </Tree>
      </Modal>
    );
  }

  renderTable = () => {
    const { pageSize, pageNo, total, roles } = this.state;
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'roleName',
        width: 100,
      },
      {
        title: '权限',
        dataIndex: 'userDepartment',
        render: (text, item) => {
          return item.functions.map(f => f.functionDepict).join(' , ');
        },
      },
      {
        title: '操作',
        width: 120,
        render: (text, item) => (
          <Fragment>
            <a onClick={() => onEditClick(item)}>编辑</a>
            {item.superAdmin !== 1 && (
              <span>
                <Divider type="vertical" />
                <Popconfirm
                  title="确认删除？"
                  onConfirm={() => onDeleteClick(item)}
                >
                  <a>删除</a>
                </Popconfirm>
              </span>
            )}
          </Fragment>
        ),
      },
    ];
    const onEditClick = (item) => {
      this.props.dispatch({
        type: 'account/getRole',
        payload: {
          restParams: {
            merchantId: getUser().merchantId,
            roleId: item.roleId,
          },
        },
      }).then((resp) => {
        if (!resp || resp.code !== 0) return;
        this.setState({
          role: resp.data,
          roleName: resp.data.roleName,
          roleChecked: getFunctionCheckedIds(resp.data.functionVOs || []),
          editModalVisible: true,
        });
      });
    };
    const onDeleteClick = (item) => {
      this.props.dispatch({
        type: 'account/deleteRole',
        payload: {
          restParams: {
            merchantId: getUser().merchantId,
            roleId: item.roleId,
          },
        },
      }).then((resp) => {
        if (resp && resp.code === 0) {
          message.success('删除成功');
          this.getList();
        } else {
          message.success(`删除失败:${resp && resp.msg}`);
        }
      });
    };
    const paginationProps = {
      showTotal: (t) => {
        return `共${t}条数据  每页${pageSize}条`;
      },
      current: pageNo,
      pageSize,
      total,
    };
    return (
      <div className={styles.standardTable}>
        <Table
          loading={this.props.loading}
          rowKey={record => record.userId}
          dataSource={roles}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { keywords, editModalVisible } = this.state;
    const RoleTable = this.renderTable;
    const EditModal = this.renderEditModal;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={12}>
                    <FormItem label="关键字">
                      {getFieldDecorator('keywords', {
                        initialValue: keywords,
                      })(
                        <Input placeholder="请输入角色名称查询" />
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
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleCreateClick(true)}>新建</Button>
            </div>
          </div>
          <RoleTable />
        </Card>
        {editModalVisible && <EditModal />}
      </PageHeaderLayout>
    );
  }
}
