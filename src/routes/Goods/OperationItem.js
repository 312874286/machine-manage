import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Select,
  Modal,
  message,
} from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import OperationTable from '../../components/Goods/operationTable';
import { consumers, operationType, operator } from '../../common/config/operationItem';
import LogModal from '../../components/LogModal';

import styles, { editor, createModal } from './OperationItem.less';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;


const CreateModal = Form.create()(
  (props) => {
    const {
      modalType,
      createModalVisible,
      createModalHandleCancel,
      createModalHandleOk,
      createModalConfirmLoading,
      editorOnChange,
      editorContent,
      upload,
      editorContentStatue,
      form,
      editorInstance,
    } = props;
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
        title="操作项设置"
        width="1000px"
        visible={createModalVisible}
        onOk={createModalHandleOk}
        confirmLoading={createModalConfirmLoading}
        onCancel={createModalHandleCancel}
        className={createModal}
      >
        <Form>
          {modalType === 'edit' &&
            <FormItem {...formItemLayout} label="操作项ID">
              {getFieldDecorator('operationCode')(
                <Input disabled placeholder="请输入" />
              )}
            </FormItem>
          }

          <FormItem {...formItemLayout} label="操作项名称" >
            {getFieldDecorator('operationName', {
              rules: [{ required: true, message: '请输入操作项名称' }],
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="简介" >
            {getFieldDecorator('operationDesc')(
              <TextArea placeholder="请输入内容" autosize={{ minRows: 2, maxRows: 6 }} />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="操作项类型" >
            {getFieldDecorator('operationType', {
              rules: [{ required: true, message: '请选择' }],
            })(
              <Select placeholder="请选择">
                {operationType.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>{item.name}</Option>
                  );
                })}
              </Select>
            )}
          </FormItem>

          <FormItem className={editor} {...formItemLayout} label="操作流程" >
            {getFieldDecorator('operationContent')(
              <div>
                <div id="braft-editor" className={editorContentStatue === 'show' ? 'braft-editor red' : 'braft-editor'}>
                  <BraftEditor
                    contentFormat="html"
                    initialContent={editorContent}
                    onChange={editorOnChange}
                    excludeControls={['code']}
                    media={{ video: false, audio: false, uploadFn: upload }}
                    ref={(instance) => { editorInstance(instance); }}
                  />
                </div>
                {editorContentStatue === 'show' && <div className="ant-form-explain">请输入</div>}
              </div>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="标准时长(单位：分)" >
            {getFieldDecorator('operationTimes', {
              rules: [{ required: true, message: '请输入' }],
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="第一操作人" >
            {getFieldDecorator('firstOperator', {
              rules: [{ required: true, message: '请选择' }],
            })(
              <Select placeholder="请选择">
                {operator.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>{item.name}</Option>
                  );
                })}
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="第二操作人" >
            {getFieldDecorator('secondOperator', {
              rules: [{ required: true, message: '请选择' }],
            })(
              <Select placeholder="请选择">
                <Option value={99} key="1111109999">无</Option>
                {operator.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>{item.name}</Option>
                  );
                })}
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="备注" >
            {getFieldDecorator('remark')(
              <TextArea placeholder="请输入内容" autosize={{ minRows: 2, maxRows: 6 }} />
            )}
          </FormItem>

          {/* <FormItem {...formItemLayout} label="使用方" >
            {getFieldDecorator('ext1Int', {
              rules: [{ required: true, message: '请选择' }],
            })(
              <Select placeholder="请选择">
                {consumers.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>{item.name}</Option>
                  );
                })}
              </Select>
            )}
          </FormItem> */}

        </Form>
      </Modal>
    );
  }
);

@connect(({ operationItem, loading, log }) => ({
  operationItem,
  log,
  loading: loading.models.operationItem,
}))
@Form.create()
export default class OperationItem extends PureComponent {
  state = {
    parameters: '',
    useType: '',
    pageNo: 1,
    logModalVisible: false,
    logModalLoading: false,
    logId: '',
    logModalPageNo: 1,
    createModalVisible: false,
    createModalEditorContent: '',
    editorContentStatue: '',
    modalType: 'create',
    createModalConfirmLoading: false,
    detailData: null,
  };

  componentDidMount = () => {
    this.getList();
  }

  // 获取列表
  getList = () => {
    this.props.dispatch({
      type: 'operationItem/getOperationList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          parameters: this.state.parameters,
          // useType: this.state.useType,
        },
      },
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
    this.props.form.validateFields((err, value) => {
      if (err) return;
      console.log(value);
      this.setState({
        parameters: value.parameters,
        // useType: value.useType,
        pageNo: 1,
      }, () => {
        this.getList();
      });
    });
  }

  // 日志相关
  getLogList = () => {
    this.props.dispatch({
      type: 'log/getLogList',
      payload: {
        restParams: {
          code: this.state.logId,
          pageNo: this.state.logModalPageNo,
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

  // 新建
  createOperationItem = () => {
    this.setState({
      createModalVisible: true,
      createModalEditorContent: '',
    });
    this.form.setFieldsValue({
      operationDesc: '',
      operationName: '',
      operationTimes: '',
      operationType: undefined,
      remark: '',
      firstOperator: 3,
      secondOperator: 99,
      // ext1Int: undefined,
    });
    if (this.editorInstance) {
      this.editorInstance.setContent('', 'html');
    }
  }

  // 详情事件
  handleDetailClick = (data) => {
    this.setState({ detailData: data });
    this.getOperationItemDetail(data);
  }

  // 详情请求数据
  getOperationItemDetail = ({ id }) => {
    this.props.dispatch({
      type: 'operationItem/getOperationItemDetail',
      payload: {
        restParams: {
          id,
        },
      },
    }).then((res) => {
      const { code, data } = res;
      if (code !== 0) return;

      this.setState({
        createModalVisible: true,
        modalType: 'edit',
        createModalEditorContent: data.operationContent,
      });
      this.form.setFieldsValue({
        operationCode: data.operationCode,
        operationDesc: data.operationDesc,
        operationName: data.operationName,
        operationTimes: data.operationTimes,
        operationType: data.operationType,
        remark: data.remark,
        firstOperator: data.firstOperator,
        secondOperator: data.secondOperator,
        // ext1Int: data.ext1Int,
      });
      if (this.editorInstance) {
        this.editorInstance.setContent(data.operationContent, 'html');
      }
    });
  }

  // 删除
  handleDelClick = (data) => {
    this.props.dispatch({
      type: 'operationItem/delOperationItem',
      payload: {
        params: { id: data.id, status: 99 },
      },
    }).then((res) => {
      const { code, msg } = res;
      if (code === 0) {
        message.success('操作成功');
        this.getList();
      } else {
        message.error(msg);
      }
    });
  }

  // 富文本编辑器
  createModalEditorOnChange = (editorState) => {
    let editorContentStatue = '';
    if (!editorState || editorState === '<p></p>') {
      editorContentStatue = 'show';
    }
    this.setState({
      createModalEditorContent: editorState,
      editorContentStatue,
    });
  }

  // 上传图片
  upload = (param) => {
    if (!FileReader) {
      message.error('浏览器不支持上传图片，请更换浏览器');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(param.file);
    reader.onload = (e) => {
      param.success({
        url: e.target.result,
      });
    };
  }

  saveFormRef = (form) => {
    this.form = form;
  }

  // 创建操作项确定事件
  createModalHandleOk = () => {
    this.form.validateFields((err, value) => {
      if (!this.state.createModalEditorContent || this.state.createModalEditorContent === '<p></p>') {
        this.setState({ editorContentStatue: 'show' });
        return;
      }
      if (err) {
        return;
      }
      const submitData = {
        firstOperator: value.firstOperator,
        operationContent: this.state.createModalEditorContent,
        operationDesc: value.operationDesc,
        operationName: value.operationName,
        operationTimes: value.operationTimes,
        operationType: value.operationType,
        remark: value.remark,
        secondOperator: value.secondOperator,
      };
      if (this.state.modalType === 'edit') {
        submitData.id = this.state.detailData.id;
      }
      this.submitOperationItem(submitData);
    });
  }

  // 创建事件
  submitOperationItem = (submitData) => {
    this.setState({
      createModalConfirmLoading: true,
    });
    this.props.dispatch({
      type: 'operationItem/addOrEditGoodsOperation',
      payload: {
        params: { ...submitData },
      },
    }).then((res) => {
      const { code } = res;
      if (code !== 0) return;
      this.getList();
      this.setState({
        createModalVisible: false,
        createModalConfirmLoading: false,
      });
    });
  }

  // 创建modal 取消事件
  createModalHandleCancel = () => {
    this.setState({
      createModalVisible: false,
      createModalEditorContent: '',
    });
  }

  editorInstanceFn = (instance) => {
    this.editorInstance = instance;
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { operationItem: { list, page }, log: { logList, logPage }, loading } = this.props;
    const { useType, parameters, createModalConfirmLoading, createModalVisible, createModalEditorContent, editorContentStatue, modalType } = this.state;

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  {/* <Col md={8} sm={12}>
                    <FormItem label="使用方">
                      {getFieldDecorator('useType', {
                        initialValue: useType,
                      })(
                        <Select placeholder="请选择">
                          {consumers.map((item, index) => {
                            return <Option key={index} value={item.id}>{item.name}</Option>;
                          })}
                          <Option value="">全部</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col> */}
                  <Col md={8} sm={12}>
                    <FormItem label="关键字">
                      {getFieldDecorator('parameters', {
                        initialValue: parameters,
                      })(
                        <Input placeholder="请输入操作项名称/ID关键字" />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={12}>
                    <span className={styles.submitButtons}>
                      <Button type="primary" htmlType="submit">查询</Button>
                    </span>
                  </Col>
                  <Col md={8} sm={12} style={{ textAlign: 'right' }}>
                    <Button type="primary" onClick={this.createOperationItem}>新建操作项</Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>

          <OperationTable
            loading={loading}
            data={list}
            page={page}
            handleTableChange={this.handleTableChange}
            onLogClick={this.handleLogClick}
            onDetailClick={this.handleDetailClick}
            onDelClick={this.handleDelClick}
          />
        </Card>
        <LogModal
          data={logList}
          page={logPage}
          loding={this.state.logModalLoading}
          logVisible={this.state.logModalVisible}
          logHandleCancel={this.logModalHandleCancel}
          logModalhandleTableChange={this.logModalhandleTableChange}
        />
        <CreateModal
          modalType={modalType}
          createModalVisible={createModalVisible}
          createModalHandleOk={this.createModalHandleOk}
          createModalHandleCancel={this.createModalHandleCancel}
          createModalConfirmLoading={createModalConfirmLoading}
          editorOnChange={this.createModalEditorOnChange}
          editorContent={createModalEditorContent}
          upload={this.upload}
          editorContentStatue={editorContentStatue}
          ref={this.saveFormRef}
          editorInstance={this.editorInstanceFn}
        />
      </PageHeaderLayout>
    )
  }
}
