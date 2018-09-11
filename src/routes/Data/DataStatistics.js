import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  Modal,
  Divider,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './DataStatistics.less'
import StandardTable from '../../components/StandardTable';
import EditableTagGroup from '../../components/Tag';
import {templateQuery} from "../../services/data/dataStatistics";


const FormItem = Form.Item;
const { Option } = Select;
const opType = [{id: 1, name: 'mysql'}, {id: 2, name: 'mongo'}, {id: 3, name: 'redis'}, {id: 4, name: 'hibrid'}]
const opTypeLists = ['', 'mysql', 'mongo', 'redis', 'hibrid']
const GoOnForm = Form.create()(
  (props) => {
    const { form, modalVisible, editModalAddClick, editModalVisibleClick, editModalConfirmLoading, modalData, handleTags  } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    return (
      <Modal
        title={
          <div class="modalBox">
            <span class="leftSpan"></span>
            <span class="modalTitle">新增数据统计模板</span>
          </div>
        }
        visible={modalVisible}
        onOk={editModalAddClick}
        onCancel={() => editModalVisibleClick()}
        confirmLoading={editModalConfirmLoading}
        width={800}
      >
        <div className="manageAppBox">
          <Form>
            <FormItem {...formItemLayout} label="名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请填写名称' }],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="选择执行类型">
              {getFieldDecorator('opType', {
                rules: [{ required: true, message: '请选择执行类型' }],
              })(
                <Select placeholder="请选择执行类型">
                  {opType.map((item) => {
                    return (
                      <Option key={item.id} value={item.id} >{item.name}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="机器标签">
              {getFieldDecorator('titles', {
                rules: [{ required: false }],
                initialValue: { tags: modalData.tags },
              })(
                <EditableTagGroup
                  handleTags={handleTags}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="模版信息">
              {getFieldDecorator('template', {
                rules: [{ required: true, message: '请填写模版信息' }],
              })(
                <Input.TextArea rows={4} placeholder="请填写模版信息" />
              )}
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  });


@connect(({ common, loading, dataStatistics }) => ({
  common,
  dataStatistics,
  loading: loading.models.dataStatistics,
}))
@Form.create()
export default class DataStatistics extends PureComponent {
  state = {
    formValues: {},
    modalData: { },
    pageNo: 1,
    type: '',
    selectedRows: [],

    modalVisible: false,
    editModalConfirmLoading: false,
  };
  componentDidMount() {
    this.getLists();
  }
  componentDidUpdate(comp,state) {
  }
  // 获取列表
  getLists = () => {
    this.props.dispatch({
      type: 'dataStatistics/templateQuery',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          status: this.state.status,
          type: this.state.type,
        },
      },
    });
  }
  // 分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    const { current } = pagination;
    // console.log('params', params)
    this.setState({
      pageNo: current,
    }, () => {
      this.getLists();
    });
  };
  // 重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      pageNo: 1,
      type: '',
      status: '',
    });
  };
  // 搜索
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        pageNo: 1,
        type: fieldsValue.type >= 0 ? fieldsValue.type : '',
        status: fieldsValue.status >= 0 ? fieldsValue.status : ''
      }, () => {
        this.getLists();
      });
    });
  };
  // 添加modal 添加事件
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: flag,
      modalData: { },
    });
  };
  // tag设置开始
  handleTags = (val) => {
    // tags: ["445", "6789"]
    this.setState({
      modalData: { tags: val },
    });
  }
  // tag设置结束
  goOn = (item) => {
    this.props.dispatch({
      type: 'dataStatistics/templateExecute',
      payload: {
        params: {
          pageNo: this.state.pageNo,
          status: this.state.status,
          type: this.state.type,
        },
      },
    });
  }
  edit = (item) => {
    this.props.dispatch({
      type: 'dataStatistics/templateUpdate',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          status: this.state.status,
          type: this.state.type,
        },
      },
    });
  }
  delete = (item) => {
    this.props.dispatch({
      type: 'dataStatistics/templateDelete',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          status: this.state.status,
          type: this.state.type,
        },
      },
    });
  }
  // goOn继续执行
  saveModalFormRef = (form) => {
    this.ModalForm = form;
  }

  editModalAddClick = () => {
    this.ModalForm.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.props.dispatch({
        type: 'dataStatistics/templateInsert',
        payload: {
          params: {
            id: this.state.modalData.id,
            status: 3,
            ...values,
          },
        },
      }).then((res) => {
        if (res.code === 0) {
          this.getLists();
          this.setState({
            modalVisible: false,
          });
        }
      });
    })
  }
  editModalVisibleClick = (flag) => {
    this.setState({
      modalVisible: flag,
    });
  }
  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="选择任务类型">
              {getFieldDecorator('type')(
                <Select placeholder="选择任务类型">
                  {taskTypeOptions.map((item) => {
                    return (
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={9} sm={24}>
            <FormItem label="选择任务状态">
              {getFieldDecorator('status')(
                <Select placeholder="选择任务状态">
                  {taskStatusOptions.map((item) => {
                    return (
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <span>
              <FormItem>
                <Button onClick={this.handleFormReset}>
                  重置
                </Button>
                <Button className={styles.serach} style={{ marginLeft: 8 }} type="primary" htmlType="submit">
                  查询
                </Button>
              </FormItem>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  render() {
    const {
      dataStatistics: { list, page },
      loading,
    } = this.props;
    const { modalVisible, editModalConfirmLoading, selectedRows, modalData } = this.state
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        width: '50%',
      },
      {
        title: '类型',
        dataIndex: 'opType',
        render(val) {
          return <span>{opTypeLists[val]}</span>;
        }
      },{
        fixed: 'right',
        width: 150,
        title: '操作',
        render: (text, item) => (
          <Fragment>
            <a onClick={() => this.goOn(item)}>执行</a>
            <Divider type="vertical" />
            <a onClick={item.status === 0 ? () => this.edit(item) : null }>编辑</a>
            <Divider type="vertical" />
            <a onClick={item.status === 0 ? () => this.delete(item) : null }>删除</a>
          </Fragment>
        ),
      },
    ];
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    return (
      <PageHeaderLayout>
        {/*<Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>*/}
          {/*<div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>*/}
        {/*</Card>*/}
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
            </div>
            <div className={styles.tableList}>
              {/*<StandardTable*/}
                {/*selectedRows={selectedRows}*/}
                {/*loading={loading}*/}
                {/*data={[]}*/}
                {/*// page={page}*/}
                {/*columns={columns}*/}
                {/*// onSelectRow={this.handleSelectRows}*/}
                {/*onChange={this.handleStandardTableChange}*/}
                {/*scrollX={1400}*/}
                {/*scrollY={(document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 160)}*/}
              {/*/>*/}
              <Table
                loading={loading}
                rowKey={record => record.name}
                dataSource={list}
                columns={columns}
                pagination={false}
                onChange={this.handleStandardTableChange}
                scroll={{ x: scrollX ? scrollX : 1050, y: scrollY ? scrollY : (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 34)}}
              />
            </div>
          </div>
        </Card>
        <GoOnForm
          ref={this.saveModalFormRef}
          modalVisible={modalVisible}
          editModalAddClick={this.editModalAddClick}
          editModalVisibleClick={this.editModalVisibleClick}
          editModalConfirmLoading={editModalConfirmLoading}
          modalData={modalData}
          handleTags={this.handleTags}
        />
      </PageHeaderLayout>
    );
  }
}
