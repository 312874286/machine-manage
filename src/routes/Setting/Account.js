import React, { PureComponent } from 'react';
import moment from 'moment';
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
  Spin,
  Icon,
  Radio,
  DatePicker,
  Table,
} from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Account.less';
import { getUser } from '../../utils/authority';
import AccountTable from '../../components/Setting/accountTable';

const FormItem = Form.Item;


const CollectionCreateForm = Form.create()(
  (props) => {
    const {
      editModalVisible,
      editModalHandleCancel,
      editModalHandleOk,
      editModalConfirmLoading,
      modalData,
      form } = props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <Modal
        title="编辑用户"
        visible={editModalVisible}
        onOk={editModalHandleOk}
        confirmLoading={editModalConfirmLoading}
        onCancel={editModalHandleCancel}
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label="姓名"
          >
            {getFieldDecorator('userName', {
              rules: [{ required: true, message: '请输入姓名' }],
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="部门"
          >
            {getFieldDecorator('userDepartment', {
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="手机"
          >
            {getFieldDecorator('userMoblie', {
              rules: [{ required: true, message: '请输入手机号码' }],
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="邮箱"
          >
            {getFieldDecorator('userEmail', {
              rules: [{
                type: 'email', message: '请输入正确格式的邮箱',
              }, {
                required: true, message: '请输入邮箱',
              }],
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="职位"
          >
            {getFieldDecorator('userTitle', {
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="办公地点"
          >
            {getFieldDecorator('userOfficeAddress', {
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);

@connect(({ account, loading }) => ({
  account,
  loading: loading.models.account,
}))
@Form.create()
export default class Account extends PureComponent {
  state = {
    pageNo: 1,
    keywords: '',
    editModalVisible: false,
    editModalConfirmLoading: false,
    modalData: {},
    modalType: '',
    roleModalVisible: false,
    roles: [],
    roleSelected: [],
    roleUser: null,
  };

  componentDidMount = () => {
    this.getList();
  }

  // 获取列表
  getList = () => {
    this.props.dispatch({
      type: 'account/getUsers',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          keywords: this.state.keywords,
          merchantId: getUser().merchantId,
        },
      },
    });
  }

  // 设置modal 数据
  setModalData = (data) => {
    this.form.setFieldsValue({
      userName: data.userName || '',
      userEmail: data.userEmail || '',
      userMoblie: data.userMoblie || '',
      userTitle: data.userTitle || '',
      userOfficeAddress: data.userOfficeAddress || '',
      userDepartment: data.userDepartment || '',
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
    this.setState({
      modalType: 'create',
      editModalVisible: true,
      modalData: {},
    });
    this.setModalData({});
  }

  // 编辑modal 编辑事件
  handleEditClick = (item) => {
    this.setState({
      modalType: 'edit',
      editModalVisible: true,
      modalData: item,
    });

    this.setModalData(item);
  }

  // 编辑modal 取消事件
  editModalHandleCancel = () => {
    this.setState({
      editModalVisible: false,
    });
  }

  // 编辑modal 确认事件
  editModalHandleOk = () => {
    this.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        editModalConfirmLoading: true,
      });
      const params = {
        ...values,
      };
      const { modalData, modalType } = this.state;
      this.props.dispatch({
        type: modalType === 'edit' ? 'account/saveUser' : 'account/createUser',
        payload: {
          params,
          restParams: {
            merchantId: getUser().merchantId,
            userId: modalData.userId || '',
          },
        },
      }).then((resp) => {
        if (resp.code !== 0) {
          this.setState({
            editModalConfirmLoading: false,
          });
          return;
        }
        this.getList();
        this.setState({
          editModalConfirmLoading: false,
          editModalVisible: false,
        });
      });
    });
  }

  saveFormRef = (form) => {
    this.form = form;
  }


  // 启用禁用账户
  handleTableDisabled = (item) => {
    this.props.dispatch({
      type: 'account/setUserStatus',
      payload: {
        restParams: {
          merchantId: getUser().merchantId,
          userId: item.userId,
        },
        params: {
          status: item.merchantAdmin ? 0 : 1,
        },
      },
    }).then((response) => {
      if (response.code !== 0) return;
      this.getList();
    });
  }

  getUserRoles = (cb) => {
    this.props.dispatch({
      type: 'account/getUserRoles',
      payload: {
        restParams: {
          merchantId: getUser().merchantId,
          userId: this.state.roleUser.userId,
        },
      },
    }).then((response) => {
      if (response.code !== 0) return;
      const roles = response.data;
      const roleSelected = roles.filter(item => item.isOwn);
      this.setState({
        roleSelected,
        roles,
      }, cb);
    });
  }

  handleRoleOK = () => {
    this.props.dispatch({
      type: 'account/setUserRoles',
      payload: {
        restParams: {
          merchantId: getUser().merchantId,
          userId: this.state.roleUser.userId,
        },
        params: {
          roleIds: this.state.roleSelected.map(item => item.roleId).join('|'),
        },
      },
    }).then((response) => {
      if (response.code !== 0) return;
      message.success('授权成功');
      this.setState({
        roleModalVisible: false,
        roleSelected: [],
        roleUser: null,
      }, () => {
        this.getList();
      });
    });
  }

  handleRoleModalCancel = () => {
    this.setState({
      roleModalVisible: false,
      roleSelected: [],
      roleUser: null,
    });
  }

  handleAuthorizeClick = (item) => {
    this.setState({ roleUser: item }, () => {
      this.getUserRoles(() => {
        this.setState({ roleModalVisible: true });
      });
    });
  }

  renderRoles = () => {
    const { roleModalVisible, roleSelected, roles } = this.state;
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'roleName',
      },
    ];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ roleSelected: selectedRows });
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      selectedRowKeys: roleSelected.map(item => item.roleId),
    };
    return (
      <Modal
        title="角色授权"
        visible={roleModalVisible}
        onOk={this.handleRoleOK}
        onCancel={this.handleRoleModalCancel}
        className={styles.thinModal}
      >
        <Table rowKey="roleId" rowSelection={rowSelection} columns={columns} dataSource={roles} pagination={false} />
      </Modal>
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { account: { list, page }, loading } = this.props;
    const { editModalVisible, editModalConfirmLoading, modalData, keywords } = this.state;
    const RoleModal = this.renderRoles;
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
                        <Input placeholder="请输入姓名、手机号查询" />
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

          <AccountTable
            loading={loading}
            data={list}
            page={page}
            handleTableChange={this.handleTableChange}
            onEditClick={this.handleEditClick}
            onDisableClick={this.handleTableDisabled}
            onAuthorizeClick={this.handleAuthorizeClick}
          />
        </Card>
        <CollectionCreateForm
          ref={this.saveFormRef}
          editModalVisible={editModalVisible}
          editModalHandleCancel={this.editModalHandleCancel}
          editModalHandleOk={this.editModalHandleOk}
          editModalConfirmLoading={editModalConfirmLoading}
          modalData={modalData}
        />
        <RoleModal />
      </PageHeaderLayout>
    );
  }
}
