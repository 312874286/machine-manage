import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Input,
  Table,
  Divider,
  Modal,
  message,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './GoodsType.less';

const FormItem = Form.Item;

const CreateForm = Form.create()(
  (props) => {
    const { modalVisible, form, handleAdd, handleModalVisible, editModalConfirmLoading, modalType, modalData, level } = props;
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
        title={
          <div class="modalBox">
            <span class="leftSpan"></span>
            <span class="modalTitle">{modalType ? '编辑类目' : '新建类目'}</span>
          </div>
        }
        visible={modalVisible}
        onOk={handleAdd}
        onCancel={() => handleModalVisible()}
        confirmLoading={editModalConfirmLoading}
      >
        <div className="manageAppBox">
          <Form onSubmit={this.handleSearch}>
            <FormItem {...formItemLayout} label="上级类目" style={{ display: level === 2 ? '' : 'none' }}>
              {getFieldDecorator('name')(
                <span>{modalData && modalData.name}</span>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="类目名称">
              {getFieldDecorator('name', {
                rules: [{ required: true,whitespace: true,  message: '请输入类目名称' }],
              })(<Input placeholder="请输入类目名称" />)}
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  });
@connect(({ common, loading, goodsType }) => ({
  common,
  goodsType,
  loading: loading.models.goodsType,
}))
@Form.create()
export default class goodsType extends PureComponent {
  state = {
    modalVisible: false,
    editModalConfirmLoading: false,
    modalType: false,
    modalData: {},
    level: 1,
    expandedRows: [],

    pageNo: 1,
    code: '',
    keyword: '',
  };
  componentDidMount() {
    this.getLists()
  }
  getLists = () => {
    this.props.dispatch({
      type: 'goodsType/goodsTypeLists',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          code: this.state.code,
          keyword: this.state.keyword,
        },
      },
    })
  }
  saveFormRef = (form) => {
    this.form = form;
  }
  handleAdd = () => {
    const { level, modalData, modalType } = this.state
    this.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        editModalConfirmLoading: true,
      });
      let url = 'goodsType/addGoodsType';
      let params = { ...values, level, };
      console.log('modalData', modalData)
      if (modalType) {
        url = 'goodsType/editGoodsType';
        params = { ...values, level, code: modalData.code };
      }
      if (level === 2 && !modalType) {
        params = {
          ...params,
          parentCode: modalData && modalData.code,
        }
      }
      this.props.dispatch({
        type: url,
        payload: {
          params,
        },
      }).then((res) => {
        if (res && res.code === 0) {
          this.getLists();
          this.setState({
            modalData: {},
            modalVisible: false,
            expandedRows: [],
          });
          message.success('操作成功')
        }
        this.setState({
          editModalConfirmLoading: false,
        });
      });
    });
  }
  handleModalVisible = (flag, level, item) => {
    this.setState({
      modalVisible: !!flag,
      editModalConfirmLoading: false,
      modalType: false,
      modalData: item,
      level,
    });
    this.form.setFieldsValue({
     name: undefined
    });
  }
  handleEditClick = (item, level, text) => {
    this.setState({
      modalVisible: true,
      modalType: true,
      // modalData: level === 2 ? {
      //   id: item.parentId,
      //   code: item.parentCode,
      //   name: item.parentName,
      // } : item,
      modalData: {...item, name: item.parentName },
      level,
    });
    this.form.setFieldsValue({
      name: item.name
    });
  }
  onExpandedRowsChange = (expandedRows) => {
    console.log('expandedRows', expandedRows)
    this.setState({
      expandedRows,
    })
  }
  // 搜索
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        expandedRows: [],
        pageNo: 1,
        keyword: fieldsValue.keyword ? fieldsValue.keyword : '',
      }, () => {
        this.getLists();
      });
    });
  };
  // 重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      pageNo: 1,
      keyword: '',
      code: '',
    });
  };
  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { merchantLists } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={9} sm={24}>
            <FormItem>
              {getFieldDecorator('keyword')(<Input placeholder="请输入类目名称搜索" />)}
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
      goodsType: { list, page, unColumn },
      loading,
    } = this.props;
    const { modalVisible, editModalConfirmLoading,modalType, modalData, level, expandedRows } = this.state
    const columns = [{
      title: '分类编号',
      dataIndex: 'code',
      key: 'code',
      width: '20%',
    }, {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
      width: '15%',
    }, {
      title: '操作人',
      dataIndex: 'updateId',
      width: '20%',
      key: 'updateId',
    },  {
      title: '操作时间',
      dataIndex: 'updateTime',
      width: '20%',
      key: 'updateTime',
    }, {
      title: '操作',
      width: '300px',
      render: (text, item) => (
        (item.level === 1 ?
          <Fragment>
            <a onClick={() => this.handleModalVisible(true, 2, item)}>添加二级分类</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleEditClick(item, 1)}>编辑</a>
          </Fragment>
         :
          <Fragment>
            <a onClick={() => this.handleEditClick(item, 2, text)}>编辑</a>
          </Fragment>
        )
      ),
    }];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
      },
    };
    list.map((item) => {
      if (item.children && item.children.length === 0) {
          return item.children = null
      }
    })
    console.log('list', list)
    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
          <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
        </Card>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
          <div className={styles.stepsContent}>
            {
              <Button type="primary" style={{ marginBottom: 8 }}  onClick={() => this.handleModalVisible(true, 1)}>添加一级分类</Button>
            }
            <Table
              columns={columns}
              dataSource={list}
              onExpandedRowsChange={this.onExpandedRowsChange}
              expandedRowKeys={expandedRows}
              rowKey={record => record.code}
            />
          </div>
        </Card>
        <CreateForm
          handleAdd={this.handleAdd}
          handleModalVisible={this.handleModalVisible}
          ref={this.saveFormRef}
          modalVisible={modalVisible}
          editModalConfirmLoading={editModalConfirmLoading}
          modalType={modalType}
          modalData={modalData}
          level={level}
        />
      </PageHeaderLayout>
    );
  }
}
