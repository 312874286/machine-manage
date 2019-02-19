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
  Popconfirm,
  message,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './DataStatistics.less'
import StandardTable from '../../components/StandardTable';
import EditableTagGroup from '../../components/Tag';
import {templateQuery} from "../../services/data/dataStatistics";
import moment from "moment/moment";
import { getUser } from "../../utils/authority";

const FormItem = Form.Item;
const { Option } = Select;
const opType = [{id: 1, name: 'mysql'}, {id: 2, name: 'mongo'}, {id: 3, name: 'redis'}, {id: 4, name: 'hibrid'}]
const opTypeLists = ['', 'mysql', 'mongo', 'redis', 'hybrid']
const ModalForm = Form.create()(
  (props) => {
    const { form, modalVisible, editModalAddClick, editModalVisibleClick, editModalConfirmLoading, modalData, handleTags, modalFlag, userInfo} = props;
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
            <span class="modalTitle">{!modalFlag ? '新增' : '编辑'}数据统计模板</span>
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
            <FormItem {...formItemLayout} label="名称" style={{ display: modalFlag ? 'none' : ''}}>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请填写名称' }],
              })(<Input placeholder="请填写名称"/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="名称" style={{ display: !modalFlag ? 'none' : ''}}>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请填写名称' }],
              })(<Input disabled />)}
            </FormItem>
            <FormItem {...formItemLayout} label="选择执行类型" style={{ display: modalFlag ? 'none' : ''}}>
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
            <FormItem {...formItemLayout} label="选择执行类型" style={{ display: !modalFlag ? 'none' : ''}}>
              {getFieldDecorator('opType', {
                rules: [{ required: true, message: '请选择执行类型' }],
              })(
                <Select placeholder="请选择执行类型" disabled>
                  {opType.map((item) => {
                    return (
                      <Option key={item.id} value={item.id} >{item.name}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="请选择可执行人">
              {getFieldDecorator('executor', {
                rules: [{ required: false, message: '请选择可执行人' }],
              })(
                <Select mode="tags" placeholder="请选择可执行人">
                  {userInfo.map((item) => {
                    return (
                      <Option key={item.uid} value={item.uid} >{item.name}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="标签">
              {getFieldDecorator('titles', {
                rules: [{ required: false }],
                initialValue: { tags: modalData.tags },
              })(
                <EditableTagGroup
                  handleTags={handleTags}
                  tags={modalData.tags}
                  search={false}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="模版信息">
              {getFieldDecorator('template', {
                rules: [{ required: true, message: '请填写模版信息' }],
              })(
                <Input.TextArea rows={8} placeholder="请填写模版信息" />
              )}
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  });

const GoOnForm = Form.create()(
  (props) => {
    const { form,
      modalGoOnVisible, editGoOnModalAddClick, editGoOnModalVisibleClick, editGoOnModalConfirmLoading, activityLists,
      disabledStartDate, onStartChange, disabledEndDate, onEndChange, handleStartOpenChange, handleEndOpenChange,
      endOpen, disabledTime, disabledEndTime,
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
        title={
          <div class="modalBox">
            <span class="leftSpan"></span>
            <span class="modalTitle">执行</span>
          </div>
        }
        visible={modalGoOnVisible}
        onOk={editGoOnModalAddClick}
        onCancel={() => editGoOnModalVisibleClick()}
        confirmLoading={editGoOnModalConfirmLoading}
        width={800}>
        <div className="manageAppBox">
          <Form>
            <FormItem {...formItemLayout} label="选择活动">
              {getFieldDecorator('activityCode', {
                rules: [{ required: false, message: '请选择活动' }],
              })(<Select placeholder="请选择" >
                {activityLists.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>{item.name}</Option>
                  );
                })}
              </Select>)}
            </FormItem>
            <FormItem {...formItemLayout} label="选择开始时间">
              {getFieldDecorator('startTime', {
                rules: [{ required: false, message: '选择开始时间' }],
              })(
                <DatePicker
                  //disabledDate={disabledStartDate}
                  //disabledTime={disabledTime}
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  format="YYYY-MM-DD HH:mm"
                  // value={startValue}
                  placeholder="选择开始时间"
                  onChange={onStartChange}
                  onOpenChange={handleStartOpenChange}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="选择结束时间">
              {getFieldDecorator('endTime', {
                rules: [{ required: false, message: '选择结束时间' }],
              })(
                <DatePicker
                  disabledTime={disabledEndTime}
                  disabledDate={disabledEndDate}
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  format="YYYY-MM-DD HH:mm"
                  // value={endValue}
                  placeholder="选择结束时间"
                  onChange={onEndChange}
                  open={endOpen}
                  onOpenChange={handleEndOpenChange}
                />
              )}
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  });


@connect(({ common, loading, dataStatistics, scheduleSetting }) => ({
  common,
  scheduleSetting,
  dataStatistics,
  loading: loading.models.dataStatistics,
}))
@Form.create()
export default class DataStatistics extends PureComponent {
  state = {
    formValues: {},
    modalData: { },
    pageNo: 1,
    name: '',
    selectedRows: [],

    modalVisible: false,
    editModalConfirmLoading: false,
    currentData: {},
    activityLists: [],
    userInfo:[],

    modalGoOnVisible: false,
    editGoOnModalConfirmLoading: false,


    startValue: null,
    endValue: null,
    endOpen: false,
    modalFlag: false,
  };
  componentDidMount() {
    this.getLists('');
  }
  componentDidUpdate(comp,state) {
  }
  // 获取列表
  getLists = () => {
    this.props.dispatch({
      type: 'dataStatistics/templateQuery',
      payload: {
        restParams: {
          name: this.state.name,
          user:getUser().userId,
        },
      },
    });
  }

  getUserInfo = () => {
    return this.props.dispatch({
      type: 'dataStatistics/getUserInfo',
      payload: {},
    }).then(res => {
      let data = [];
      if(res)
        for(let index in res){
          data.push({
            uid:res[index][0],
            name:res[index][1],
          })
        }
      return data;
    })
  };

  getActivityLists = () => {
    this.props.dispatch({
      type: 'scheduleSetting/activityList',
      payload: {
        restParams: {},
      },
    }).then((res) => {
      res = res.map((item) => {
        return { type: item.type, id: item.id, name: item.name }
      })
      this.setState({
        activityLists: res,
      }, () => {
        this.props.dispatch({
          type: 'interactSamplingSetting/interactDataLists',
          payload: {
            restParams: {
              status: '',
              keyword: '',
              pageNo: '1_2000',
              orderBy: '',
              pageSize: '2000',
            },
          },
        }).then((res) => {
          if (res && res.code === 0) {
            res = res.data.map((item) => {
              return { id: item.id, name: item.name }
            })
            this.setState({
              activityLists: this.state.activityLists.concat(res),
            });
          }
        });
      });
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
      this.getLists('');
    });
  };
  // 重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      name: ''
    });
  };
  // 搜索
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        name: fieldsValue.name
      }, () => {
        this.getLists('');
      });
    });
  };
  // 添加modal 添加事件
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: flag,
      modalData: { },
      currentData: {},
      modalFlag: false
    }, () => {
      this.setModalData()
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
    this.getActivityLists()
    this.setState({
      modalGoOnVisible: true,
      currentData: item
    })
    this.setGoOnModalData()
  }
  edit = (item) => {
    // currentData
    this.setState({
      modalVisible: true,
      currentData: item,
      modalFlag: true
    }, () => {
      this.props.dispatch({
        type: 'dataStatistics/templateList',
        payload: {
          restParams: {
            name: item.name,
            user:getUser().userId,
          },
        },
      }).then((res) => {
        if (res.code === 0 && res.data.length > 0) {
          this.setState({
            modalData: { tags: res.data[0].titles },
          }, () => {
            this.setModalData(res.data[0])
          })
        }
      });
    });
  }
  delete = (item) => {
    this.props.dispatch({
      type: 'dataStatistics/templateDelete',
      payload: {
        restParams: {
          name: item.name,
          owner:getUser().userId,
        },
      },
    }).then((res) => {
      if (res.code === 0) {
        message.config({
          top: 100,
          duration: 2,
          maxCount: 1,
        });
        message.success('删除成功')
        this.getLists('')
      }
    });
  }
  setModalData = (data) => {
    this.getUserInfo().then(userInfo => {
      if (data) {
        this.setState({
          modalData: { tags: data.titles },
          userInfo,
        }, () => {
          this.ModalForm.setFieldsValue({
            name: data.name || '',
            template: data.template || undefined,
            opType: data.opType || undefined,
            executor: data.executor || undefined,
          });
        })
      } else {
        this.setState({
          modalData: { tags: [] },
          userInfo,
        }, () => {
          this.ModalForm.setFieldsValue({
            name: undefined,
            template: undefined,
            opType: undefined,
            executor: undefined,
          });
        })
      }
    });
  }
  setGoOnModalData = () => {
    this.GoOnModalForm.setFieldsValue({
      startTime: undefined,
      endTime: undefined,
      activityCode: undefined
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

      let url = 'dataStatistics/templateInsert'
      let params = {
        ...values,
        owner:getUser().userId,
        titles: this.state.modalData ? this.state.modalData.tags : ''
      }

      if (this.state.currentData.name) {
        url = 'dataStatistics/templateUpdate'
        params = { ...params, name: this.state.currentData.name}
      }
      this.props.dispatch({
        type: url,
        payload: {
          params,
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
  // saveGoOnModalFormRef
  saveGoOnModalFormRef= (form) => {
    this.GoOnModalForm = form;
  }
  // 时间控件开始
  range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }
  disabledTime = () => {
    return {
      disabledSeconds: () => this.range(1, 60),
    };
  }
  disabledEndTime = () => {
    return {
      disabledSeconds: () => this.range(0, 59),
    };
  }
  disabledStartDate = (startValue) => {
    return startValue < moment(new Date().setDate(new Date().getDate() - 1)).endOf('day');
  }
  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }
  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }
  onStartChange = (value) => {
    this.onChange('startValue', value);
  }

  onEndChange = (value) => {
    this.onChange('endValue', value);
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  }
  // 时间控件结束
  editGoOnModalAddClick = () => {
    this.GoOnModalForm.validateFields((err, values) => {
      if (err) {
        return;
      }
      let url = 'dataStatistics/templateExecute'
      let restParams = {
        ...values,
        startTime: values.startTime ? values.startTime.format('YYYY-MM-DD HH:mm:ss') : '',
        endTime: values.endTime ? values.endTime.format('YYYY-MM-DD HH:mm:ss') : '',
        name: this.state.currentData.name,
        user: getUser().userId,
      }
      console.log('params', restParams)
      this.props.dispatch({
        type: url,
        payload: {
          restParams,
        },
      }).then((res) => {
        this.getLists();
        this.setState({
          modalGoOnVisible: false,
        });
      });
    })
  }
  editGoOnModalVisibleClick = (flag) => {
    this.setState({
      modalGoOnVisible: flag,
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
        title: '时间',
        dataIndex: 'time',
        width: '10%',
      },
      {
        title: '活动名称',
        dataIndex: 'activityName',
        width: '10%',
      }, {
        title: '地区',
        dataIndex: 'name',
        width: '10%',
      },
      {
        title: '点位信息',
        dataIndex: 'opType',
        width: '10%',
      }, {
        title: '机器编号',
        dataIndex: 'name',
        width: '7%',
      },
      {
        title: '商户名称',
        dataIndex: 'opType',
        width: '8%',
      }, {
        title: '商品名称',
        dataIndex: 'name',
        width: '8%',
      },
      {
        title: '客流量',
        dataIndex: 'opType',
        width: '5%',
      }, {
        title: '互动次数',
        dataIndex: 'name',
        width: '7%',
      },
      {
        title: '互动人数',
        dataIndex: 'opType',
        width: '7%',
      }, {
        title: '订单数',
        dataIndex: 'name',
        width: '5%',
      }, {
        title: '掉货数',
        dataIndex: 'name',
        width: '5%',
      }, {
        title: '关注数',
        dataIndex: 'name',
        width: '5%',
      }
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
                scroll={{ x: scrollX ? scrollX : 1650, y: scrollY ? scrollY : (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 34)}}
              />
            </div>
          </div>
        </Card>
        <ModalForm
          ref={this.saveModalFormRef}
          modalVisible={modalVisible}
          editModalAddClick={this.editModalAddClick}
          editModalVisibleClick={this.editModalVisibleClick}
          editModalConfirmLoading={editModalConfirmLoading}
          modalData={modalData}
          handleTags={this.handleTags}
          modalFlag={this.state.modalFlag}
          userInfo={this.state.userInfo}
        />
        <GoOnForm
          ref={this.saveGoOnModalFormRef}
          modalGoOnVisible={this.state.modalGoOnVisible}
          editGoOnModalAddClick={this.editGoOnModalAddClick}
          editGoOnModalVisibleClick={this.editGoOnModalVisibleClick}
          editGoOnModalConfirmLoading={this.state.editGoOnModalConfirmLoading}
          activityLists={this.state.activityLists}
          disabledStartDate={this.disabledStartDate}
          onStartChange={this.onStartChange}
          disabledEndDate={this.disabledEndDate}
          onEndChange={this.onEndChange}
          handleStartOpenChange={this.handleStartOpenChange}
          handleEndOpenChange={this.handleEndOpenChange}
          endOpen={this.state.endOpen}
          disabledTime={this.disabledTime}
          disabledEndTime={this.disabledEndTime}

        />
      </PageHeaderLayout>
    );
  }
}
