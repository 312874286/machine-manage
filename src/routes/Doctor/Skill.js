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
  message,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Skill.less';
import SkillTable from '../../components/Doctor/skillTable';

const FormItem = Form.Item;
const { TextArea } = Input;

const CreateModal = Form.create()(
  (props) => {
    const { visible, onCancel, onHandleOk, confirmLoading, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="编辑技能"
        okText="保存"
        confirmLoading={confirmLoading}
        onCancel={onCancel}
        onOk={onHandleOk}

      >
        <Form layout="vertical">
          <FormItem label="一及技能名称">
            {getFieldDecorator('firstSkill', {
              rules: [{ required: true, message: '请输入一级技能名称' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="二级技能名称">
            {getFieldDecorator('secondSkill')(<TextArea rows={6} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);


@connect(({ skill, loading }) => ({
  skill,
  loading: loading.models.skill,
}))
@Form.create()
export default class Skill extends PureComponent {
  state = {
    pageNo: 1,
    keyword: '',
    createModalConfirmLoading: false,
    detail: null,
  };

  componentDidMount = () => {
    this.getList();
  }

  // 获取列表
  getList = () => {
    this.props.dispatch({
      type: 'skill/getSkillList',
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
      firstSkill: data.firstSkill || '',
      secondSkill: data.secondSkill || '',
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

  // 删除事件
  handleDelClick = (record) => {
    this.props.dispatch({
      type: 'skill/delSkill',
      payload: {
        params: {
          id: record.id,
        },
      },
    }).then((resp) => {
      if (resp.code !== 0) {
        return;
      }
      message.success('操作成功');
      this.getList();
    });
  }

  // 上移下移事件
  handleMovelick = (record, type) => {
    this.props.dispatch({
      type: 'skill/moveSkill',
      payload: {
        params: {
          id: record.id,
          sequence: type,
        },
      },
    }).then((resp) => {
      if (resp.code !== 0) {
        return;
      }
      this.getList();
      message.success('操作成功');
    });
  }

  // 新建事件
  handleCreateClick = () => {
    this.props.dispatch({
      type: 'skill/addSkill',
      payload: {
        params: {
          firstSkill: this.state.keyword,
        },
      },
    }).then((resp) => {
      if (resp.code !== 0) return;
      message.success('操作成功');
    });
  }


  // 编辑modal 编辑事件
  handleEditClick = (item) => {
    this.props.dispatch({
      type: 'skill/getSkill',
      payload: {
        restParams: {
          id: item.id,
        },
      },
    }).then((resp) => {
      if (resp.code !== 0) return;
      this.setState({
        createModalVisible: true,
        detail: resp.data,
      });
      this.setModalData(resp.data);
    });
  }

  // 创建modal 取消事件
  createModalHandleCancel = () => {
    this.setState({
      createModalVisible: false,
    });
  }

  createFormRef = (form) => {
    this.form = form;
  }

  // 创建modal 确认事件
  createModalHandleOk = () => {
    this.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        createModalConfirmLoading: true,
      });

      this.props.dispatch({
        type: 'skill/editSkill',
        payload: {
          params: {
            id: this.state.detail.id,
            firstSkill: values.firstSkill,
            secondSkill: values.secondSkill,
          },
        },
      }).then((resp) => {
        if (resp.code !== 0) return;
        this.setState({
          createModalVisible: false,
          createModalConfirmLoading: false,
        });
        message.success('操作成功');
        this.getList();
      });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { skill: { list, page }, loading } = this.props;
    const {
      keyword,
    } = this.state;

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
                        <Input placeholder="请输入一级技能名称" />
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

          <SkillTable
            loading={loading}
            data={list}
            page={page}
            handleTableChange={this.handleTableChange}
            onEditClick={this.handleEditClick}
            onDelClick={this.handleDelClick}
            onMoveClick={this.handleMovelick}
          />
        </Card>

        <CreateModal
          ref={this.createFormRef}
          visible={this.state.createModalVisible}
          confirmLoading={this.state.createModalConfirmLoading}
          onCancel={this.createModalHandleCancel}
          onHandleOk={this.createModalHandleOk}
        />
      </PageHeaderLayout>
    )
  }
}
