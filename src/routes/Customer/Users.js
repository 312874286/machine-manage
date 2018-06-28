import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Modal,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Users.less';
import UsersTable from '../../components/Customer/usersTable';
import LogModal from '../../components/LogModal';

const FormItem = Form.Item;


const CollectionCreateForm = Form.create()(
  (props) => {
    const {
      editModalVisible,
      editModalHandleCancel,
      editModalHandleOk,
      editModalConfirmLoading,
      form } = props;
    const { getFieldDecorator } = form;
    // const { name, phone } = modalData;

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
            {getFieldDecorator('name', {
              // initialValue: name,
              rules: [{ required: true, message: '请输入姓名' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="手机"
          >
            {getFieldDecorator('phone', {
              // initialValue: phone,
              rules: [{ required: true, message: '请输入手机号' }],
            })(<Input type="textarea" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);

@connect(({ users, loading, log }) => ({
  users,
  log,
  loading: loading.models.users,
}))
@Form.create()
export default class CustomerUsers extends PureComponent {
  state = {
    pageNo: 1,
    keyword: '',
    editModalVisible: false,
    editModalConfirmLoading: false,
    modalData: {},
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
      type: 'users/getPatientList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          keyword: this.state.keyword,
        },
      },
    });
  }

  // 设置modal 数据
  setModalData = (data) => {
    this.form.setFieldsValue({
      name: data.name || '',
      phone: data.phone || '',
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
        keyword: fieldsValue.keyword,
      }, () => {
        this.getList();
      });
    });
  }

  // 编辑modal 编辑事件
  handleEditClick = (item) => {
    this.setState({
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
    this.setState({
      editModalConfirmLoading: true,
    });
    this.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const params = { ...values, id: this.state.modalData.id };
      this.props.dispatch({
        type: 'users/savePatient',
        payload: {
          params,
        },
      }).then(() => {
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

  // 日志相关
  getLogList = () => {
    this.props.dispatch({
      type: 'log/getLogList',
      payload: {
        restParams: {
          code: this.state.logId,
          pageNo: this.state.logModalPageNo,
          type: 1020403,
        },
      },
    }).then(() => {
      this.setState({
        logModalLoading: false,
      });
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const { users: { list, page }, log: { logList, logPage }, loading } = this.props;
    const { editModalVisible, editModalConfirmLoading, modalData, keyword } = this.state;

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={12}>
                    <FormItem label="关键字">
                      {getFieldDecorator('keyword', {
                        initialValue: keyword,
                      })(
                        <Input placeholder="请输入用户ID、姓名、联系电话" />
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

          <UsersTable
            loading={loading}
            data={list}
            page={page}
            onLogClick={this.handleLogClick}
            handleTableChange={this.handleTableChange}
            onEditClick={this.handleEditClick}
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
        <LogModal
          data={logList}
          page={logPage}
          loding={this.state.logModalLoading}
          logVisible={this.state.logModalVisible}
          logHandleCancel={this.logModalHandleCancel}
          logModalhandleTableChange={this.logModalhandleTableChange}
        />
      </PageHeaderLayout>
    )
  }
}
