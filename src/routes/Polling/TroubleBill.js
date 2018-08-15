import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Table, Button, Form, Row, Col, Input, Modal, DatePicker, Tree, message, Popconfirm, List, Select,Upload, Icon, Cascader, Alert, Radio, Popover } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TroubleBill.less';
import moment from 'moment';
import 'moment/locale/zh-cn';

const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const workType = ['故障', '报警', '补货', '投诉']
const workTypeOption = [{id: 1, name: '故障'}, {id: 2, name: '报警'}, {id: 3, name: '补货'}, {id: 4, name: '投诉'}]
const source = ['巡检上报', '运营派单', '报警派单']
const sourceOption = [{id: 1, name: '巡检上报'}, {id: 2, name: '运营派单'}, {id: 3, name: '报警派单'}]
const urgentStatusOption = [{id: 1, name: '日常'}, {id: 2, name: '紧急'}]
const urgentStatus = ['日常', '紧急']
const status = ['待接单', '处理中', '已完成', '已确认', '已关闭']
const statusOption = [{id: 1, name: '待接单'}, {id: 2, name: '处理中'}, {id: 3, name: '已完成'}, {id: 4, name: '已确认'}, {id: 5, name: '已关闭'}]

const CreateForm = Form.create()(
  (props) => {
    const { modalVisible, form, handleAdd, handleModalVisible, editModalConfirmLoading, openSelectMachineModal, machineId } = props;
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
            <span class="modalTitle">创建工单</span>
          </div>
        }
        visible={modalVisible}
        onOk={handleAdd}
        onCancel={() => handleModalVisible(false)}
        confirmLoading={editModalConfirmLoading}
        width={800}
      >
        <div style={{ padding: '30px 60px' }}>
          <Form onSubmit={this.handleSearch}>
            <FormItem {...formItemLayout} label="工单类型">
              {getFieldDecorator('workType', {
                rules: [{ required: Array, message: '请选择工单类型' }],
              })(
                <Select placeholder="请选择" style={{ width: '100%'}}>
                  {workTypeOption.map((item) => {
                    return (
                      <Option value={item.id} key={item.id}>{item.name}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="选择机器">
              {getFieldDecorator('machineId', {
                rules: [{ required: true, message: '请选择机器' }],
              })(
                <div>
                  { machineId ? machineId.split('、')[1] : '' }
                  <Button type="primary" onClick={openSelectMachineModal}>+ 选择</Button>
                </div>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="工单描述">
              {getFieldDecorator('remark', {
                rules: [{ required: true, whitespace: true, message: '请填写工单描述' }],
              })(
                <TextArea placeholder="请输入"  autosize={{ minRows: 6, maxRows: 6 }} style={{ marginBottom: '30px' }}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="紧急状态">
              {getFieldDecorator('urgentStatus', {
                rules: [{ required: Array, message: '请选择紧急状态' }],
              })(
                <Select placeholder="请选择" style={{ width: '100%'}}>
                  {urgentStatusOption.map((item) => {
                    return (
                      <Option value={item.id} key={item.id}>{item.name}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  });
const SelectMachineForm = Form.create()(
  (props) => {
    const { editMachineModalVisible, form, onEditMachineHandleAddClick, onEditMachineHandleModalVisibleClick, editMachineEditModalConfirmLoading, insertOptions,
      loadData, sourceData, findSourceData, onSelectMachineChange,
    } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    };
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    return (
      <Modal
        title="选择机器"
        visible={editMachineModalVisible}
        onOk={onEditMachineHandleAddClick}
        onCancel={() => onEditMachineHandleModalVisibleClick()}
        confirmLoading={editMachineEditModalConfirmLoading}
        width={800}>
        <div className="manageAppBox">
          <Form onSubmit={this.handleSearch}>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={20} sm={24}>
                <FormItem>
                  {getFieldDecorator('provinceCityAreaTrade')(
                    <Cascader
                      placeholder="请选择"
                      options={insertOptions}
                      loadData={loadData}
                      changeOnSelect
                    />
                  )}
                </FormItem>
              </Col>
              <Col md={4} sm={24} style={{ paddingLeft: '3px' }}>
                <FormItem>
                  <Button onClick={() => findSourceData()} style={{ width: '70px', borderRadius: '4px' }}>
                    搜索
                  </Button>
                </FormItem>
              </Col>
            </Row>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('machine')(
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '100%' }}>
                    <div>
                      <span className={styles.machineName}>机器名称</span>
                      <div >
                         <span className={styles.machineTable} style={{ display: sourceData.length > 0 ? 'none' : 'block' }} >暂无数据</span>
                         <RadioGroup style={{ maxHeight: '200px', overflowY: 'scroll', width: '100%', display: sourceData.length > 0 ? 'block' : 'none' }} onChange={onSelectMachineChange}>
                          {sourceData.map((item) => {
                            return (
                              <Radio style={radioStyle} value={`${item.machineId}、${item.machineCode}`} key={item.machineId}>{item.machineCode}</Radio>
                            );
                          })}
                        </RadioGroup>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  });

@connect(({ troubleBill }) => ({ troubleBill }))
export default class troubleBill extends PureComponent {
  state = {
    seeVisible: false,
    replyVisible: false,
    textAreaVal: '',
    userId: '',
    type: '1',
    startDateString: '',
    endDateString: '',
    userName: '',
    seeData: {},
    pageNo: 1,
    currentRecord: {
      "id": "",
      "machineId": "",
      "type": '',
      "submitUser": "",
      "finishUser": '',
      "submitTime": 0,
      "finishTime": 0,
      "status": 0,
      "finishRemark": '',
      "remindStatus": 0,
      "remark": "",
    },
    previewVisible: false,
    previewImage: '',
    fileList: [],
    getMachineUserList: [],


    modalVisible: false,
    editModalConfirmLoading: false,
    modalData: {},
    channelLists: [],

    WatchMachineModalVisible: false,
    machineList: [],

    // machines: [],
    // machineNum: 0,
    // selectCity: [],
    // selectCityName: [],
    editMachineEditModalConfirmLoading: false,

    insertOptions: [],
    sourceData: [],
    options: [],
    defaultValue: [],
    statusValue: undefined,
    sourceValue: undefined,
  };
  constructor(props) {
    super(props);
    // console.log(1111,moment().subtract(30,'days').format('YYYY-MM-DD'));
    this.state.startDateString = moment().subtract(30,'days').format('YYYY-MM-DD');
    this.state.endDateString = moment().format('YYYY-MM-DD');
  }
  componentDidMount = () => {
    if (this.props.location.query) {
      const { flag, statusValue } = this.props.location.query;
      if (flag === 'openFault') {
        this.setState({
          modalVisible: true,
        }, () => {
          this.props.location.query = {}
          this.getLists();
        });
      }
      // statusValue
      if (statusValue) {
        this.setState({
          statusValue,
        }, () => {
          this.props.location.query = {}
          this.getLists();
        });
      }
    } else {
      this.getLists();
    }
  }
  onChange = (e) => {
    this.setState({ userName: e.target.value });
    // console.log(111,e.target.value,this);
  }
  onTextAreaChange = (e) => {
    this.setState({
      textAreaVal: e.target.value,
    });
    console.log(this.state.textAreaVal, e.target.value);
  }
  onFindData = (e) => {

    if (this.state.startDateString === '') {
      message.info('请选择开始时间');
      return;
    }
    if (this.state.endDateString === '') {
      message.info('请选择解决时间');
      return;
    }

    this.getLists();
  }
  onSeeHandle = (record) => {
    this.getFaultDetail(record)
    this.setState({
      seeVisible: true,
    });
  }
  onReplyHandle = (record) => {
   this.getFaultDetail(record)
   this.setState({
     replyVisible: true,
   });
  }
  getFaultDetail = (record) => {
    this.setState({
      textAreaVal: '',
      currentRecord: record,
    });
    this.props.dispatch({
      type: 'troubleBill/getCheckFaultDetail',
      payload: {
        params: {
          id: record.id,
        },
      },
    }).then((res) => {
      const { code, data, msg } = res;
      for(var j = 0 ; j < data.answerList.length; j++) {
        for(var i = 0 ; i < data.answerList[j].imgList.length ; i++){
          data.answerList[j].imgList[i] = {
            uid: i,
            name: '',
            status: 'done',
            url: data.answerList[j].imgList[i].image,
          }
        }
        // let i = 0
        // data.answerList[j].imgList.map((item) => {
        //   i++
        //   return {
        //     uid: i,
        //     name: '',
        //     status: 'done',
        //     url: item.image,
        //   }
        // })
      }
      this.getMachineUserList(data.machineId ? data.machineId : '')
      this.setState({
        seeData: data,
      });
    });
  }
  // 获取列表
  getLists = () => {
    this.props.dispatch({
      type: 'troubleBill/getCheckFaultList',
      payload: {
        params: {
          type: this.state.type,
          startTime: this.state.startDateString,
          endTime: this.state.endDateString,
          keyword: this.state.userName,
          status: this.state.statusValue,
          pageNo: this.state.pageNo,
          source: this.state.sourceValue,
        },
      },
    });
  }
  getMachineUserList = (machineId) => {
    this.props.dispatch({
      type: 'troubleBill/getMachineUserList',
      payload: {
        restParams: {
          machineId,
        },
      },
    }).then((res) => {
      this.setState({
        getMachineUserList: res
      })
    });
  }
  selectUserChange = (value) => {
    this.setState({
      userId: value,
    });
    // console.log(`selected ${value}`);
  }
  seeHandleCancel = (e) => {
    this.setState({
      seeVisible: false,
    });
  }
  replyOKHandle = (e) => {
    if (this.state.textAreaVal.replace(/\s+/g, '') === '' || this.state.userId.replace(/\s+/g, '') === '') {
      message.info('请补全信息');
      return;
    }
    this.props.dispatch({
      type: 'troubleBill/getCheckFaultAnswer',
      payload: {
        params: {
          id: this.state.currentRecord.id,
          remark: this.state.textAreaVal,
          userId: this.state.userId,
        },
      },
    }).then((res) => {
      const { code, data, msg } = res;
      // console.log(data.functions);
      console.log(data);
      if (code === 0) {
        message.success(msg);
        this.setState({
          replyVisible: false,
          userId: ''
        });
      } else {
        message.error(msg);
      }
      // treeData = data;

    });


  }
  replyHandleCancel = (e) => {
    this.setState({
      replyVisible: false,
    });
  }
  startDatePickerChange = (date, dateString) => {
    console.log('startDatePickerChange::', date, dateString);
    this.setState({
      // type: '1',
      startDateString: dateString[0],
      endDateString: dateString[1],
    });
  }
  endDatePickerChange = (date, dateString) => {
    this.setState({
      // type: '2',
      endDateString: new Date(dateString).getTime(),
    });
    console.log('endDatePickerChange::', date, dateString, new Date(dateString).getTime());
  }
  selectHandleChange = (value) => {
    this.setState({
      type: value,
    });
    // console.log(`selected ${value}`);
  }
  selectStatusChange = (value) => {
    this.setState({
      statusValue: value,
    });
  }
  selectSourceChange = (value) => {
    this.setState({
      sourceValue: value,
    });
  }
  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      pageNo: pagination.current,
    }, () => {
      this.getLists();
    });

    console.log(pagination, filters, sorter);
  }
  handleReset = () => {
    this.setState({
      type: '1',
      userName: '',
      startDateString: moment().subtract(30,'days').format('YYYY-MM-DD'),
      endDateString: moment().format('YYYY-MM-DD'),
      statusValue: undefined,
      sourceValue: undefined,
    });
    console.log('handleReset::');
  }
  handleCancel = () => this.setState({ previewVisible: false })
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  // 新增modal确认事件 开始
  saveFormRef = (form) => {
    this.form = form;
  }
  // 添加modal 添加事件
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
      modalData: {},
    });
    this.areaList('')
    this.setModalData();
  };
  // 获取城市列表
  areaList = (selectedOptions) => {
    let targetOption = null;
    let code = ''
    if (selectedOptions) {
      targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;
      code = targetOption.value
    }
    this.props.dispatch({
      type: 'common/getUserArea',
      payload: {
        restParams: {
          code,
        }
      },
    }).then((res) => {
      if (!selectedOptions) {
        this.setState({
          options: res,
        });
      } else {
        targetOption.loading = false;
        targetOption.children = res
        this.setState({
          options: [...this.state.options],
        });
      }
    });
  }
  // 设置modal 数据
  setModalData = (data) => {
    this.form.setFieldsValue({
      workType: undefined,
      machineId: undefined,
      remark: undefined,
      urgentStatus: undefined,
    });
    this.setState({
      machineId: ''
    })
  }
  // 编辑modal 确认事件
  handleAdd = () => {
    this.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        editModalConfirmLoading: true,
        modalData: {},
      });
      // let remark = ''
      // if (this.state.machineNum) {
      //   remark = '已选择' + this.state.machineNum + '台机器，分别位于' + this.state.selectCityName.join('、');
      // }
      let url = 'troubleBill/saveCheckFault';
      let params = { ...values, machines: this.state.machines,};
      this.props.dispatch({
        type: url,
        payload: {
          params,
        },
      }).then((res) => {
        if (res && res.code === 0) {
          // message.success(messageTxt + '成功');
          this.getLists();
          this.setState({
            modalVisible: false,
          });
          // this.getLists();
        }
        this.setState({
          editModalConfirmLoading: false,
        });
      });
    });
  }
  // 回显省市区商圈数据源开始
  getAreaList = (selectedOptions) => {
    let code = '';
    let targetOption = null;
    let params = { code: code }
    if (selectedOptions) {
      if (selectedOptions.level) {
        params = { ...params, level: 1 }
      } else if (selectedOptions.code) {
        params = { code: selectedOptions.code }
      } else {
        targetOption = selectedOptions[selectedOptions.length - 1];
        code = targetOption.value;
        targetOption.loading = true;
        params = { code: code, level: targetOption.level + 1}
      }
    }
    this.props.dispatch({
      type: 'user/selectMachine',
      payload: {
        params,
      },
    }).then((res) => {
      if (selectedOptions.level) {
        this.setState({
          insertOptions: res,
        });
      } else if (selectedOptions.code) {
        this.setState({
          sourceData: res,
        });
      } else {
        targetOption.loading = false;
        targetOption.children = res
        this.setState({
          insertOptions: [...this.state.insertOptions],
        });
      }
    });
  }
  // 回显省市区商圈数据源结束
  // 选择机器控件
  onEditMachineHandleAddClick = () => {
    if (this.state.machineId) {
      this.form.setFieldsValue({
        machineId: this.state.machineId.split('、')[0],
      });
      this.setState({
        editMachineModalVisible: false,
      });
    } else {
      message.config({
        top: 100,
        duration: 2,
        maxCount: 1,
      });
      message.warn('请先选择机器');
    }
  }
  findSourceData = () => {
    this.selectMachineform.validateFields((err, fieldsValue) => {
      if (err) return;
      let localCode = ''
      if (fieldsValue.provinceCityAreaTrade) {
        if (fieldsValue.provinceCityAreaTrade.length > 0) {
          localCode = fieldsValue.provinceCityAreaTrade[fieldsValue.provinceCityAreaTrade.length - 1]
        }
      }
      // console.log('localCode', localCode, fieldsValue, fieldsValue.provinceCityAreaTrade)
      if (!localCode) {
        message.config({
          top: 100,
          duration: 2,
          maxCount: 1,
        });
        message.error('请选择一个地区')
        return;
      }
      this.getAreaList({code: localCode})
    });
  }
  onSelectMachineChange = (e) => {
    // console.log('radio checked', e.target);
    this.setState({
      machineId: e.target.value,
    });
  }
  openSelectMachineModal = () => {
    this.setState({
      sourceData: [],
      editMachineModalVisible: true,
    }, () => {
      this.getAreaList({level: 1});
    });
    this.selectMachineform.setFieldsValue({
      provinceCityAreaTrade: undefined
    })
  }
  onEditMachineHandleModalVisibleClick = () => {
    this.setState({
      editMachineModalVisible: false,
    });
  }
  selectMachineFormRef = (form) => {
    this.selectMachineform = form;
  }
  closeFault = (item) => {
 // updateCheckStatus
    this.updateCheckStatus(item.id, 'close')
  }
  okFault = () => {
    this.updateCheckStatus(item.id, 'ok')
  }
  updateCheckStatus = (id, flag) => {
    let status = 0
    if (flag === 'close') {
      status = 5
    } else {
      status = 4
    }
    let url = 'troubleBill/updateCheckStatus';
    this.props.dispatch({
      type: url,
      payload: {
        params: {
          status,
          id,
        }
      },
    }).then((res) => {
      if (res && res.code === 0) {
        this.getLists();
      }
    });
  }
  handleChange = ({ fileList }) => this.setState({ fileList })
  go = () => {
    const { totalNo, No } = this.state
    if (No) {
      if (No <= totalNo) {
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
    const { seeVisible, replyVisible, seeData, currentRecord, textAreaVal, type, userName, startDateString, endDateString, previewVisible, previewImage, statusValue, sourceValue, getMachineUserList, userId, No } = this.state;
    const { troubleBill: { list, page } } = this.props;

    var arr = ['未解决','已解决'];
    // console.log(11111, list, page);
    const columns = [{
      title: '故障单ID',
      dataIndex: 'code',
      width: '10%'
    }, {
      title: '机器ID',
      dataIndex: 'machineCode',
      key: 'machineCode',
      width: '7%'
    }, {
      title: '工单类型',
      dataIndex: 'workType',
      key: 'workType',
      width: '5%',
      render: (text, record) => (
        <span>
          { workType[record.workType - 1] }
        </span>
      )
    },  {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: '5%',
      render: (text, record) => (
        <span>
          { source[record.source - 1] }
        </span>
      )
    }, {
      title: '紧急状态',
      dataIndex: 'urgentStatus',
      key: 'urgentStatus',
      width: '5%',
      render: (text, record) => (
        <span>
          { urgentStatus[record.urgentStatus - 1] }
        </span>
      )
    },  {
      title: '工单描述',
      dataIndex: 'remark',
      key: 'remark',
      width: '10%'
    }, {
      title: '派单时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: '7%'
    }, {
      title: '派单人',
      dataIndex: 'submitUser',
      key: 'submitUser',
      width: '7%'
    }, {
      title: '接单时间',
      dataIndex: 'talkingTime',
      key: 'talkingTime',
      width: '7%'
    },  {
      title: '解决时间',
      dataIndex: 'finishTime',
      key: 'finishTime',
      width: '7%'
    }, {
      title: '解决人',
      dataIndex: 'finishUser',
      key: 'finishUser',
      width: '7%'
    }, {
      title: '解决方案',
      dataIndex: 'finishRemark',
      key: 'finishRemark',
      width: '9%'
    }, {
      title: '工单状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <span>
          { status[record.status - 1] }
        </span>
      )
    }, {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (text, record) => (
        <Fragment>
          <a href="javascript:;" onClick={this.onReplyHandle.bind(this, record)} style={{ display: record.status === 1 || record.status === 2 ? '' : 'none' }}>编辑</a>
          <a href="javascript:;" onClick={this.onSeeHandle.bind(this, record)} style={{ display: record.status === 3 || record.status === 4 || record.status === 5 ? '' : 'none' }}>查看</a>
           <a href="javascript:;" onClick={() => (record.status === 1 || record.status === 2) ? this.closeFault(record) : null}
           style={{ cursor: (record.status !== 1 && record.status !== 2) ? 'not-allowed' : '', color: (record.status !== 1 && record.status !== 2) ? '#999' : ''}}
           >关闭</a>
          <a href="javascript:;" onClick={() => (record.status === 3) ? this.okFault(record) : null}
             style={{ cursor: (record.status !== 3) ? 'not-allowed' : '', color: (record.status !== 3) ? '#999' : ''}}
          >确认</a>
        </Fragment>
      ),
    }];
    const paginationProps = {
      showTotal: (total) => {
        // console.log(total, page)
        return (
          <div className="paginationBox">
            <span>当前显示{page.pageSize}条/页，共{page.total}条</span>
            <div>
              <span>第{page.current}页 / 共{Math.ceil(total/page.pageSize)}页</span>
              <span>
                 <span>跳至 <Input value={No} onChange={this.inputValue}/>页</span>
                 <Button type="primary" onClick={() => this.go()}>Go</Button>
               </span>
            </div>
          </div>
        );
        // return `第${page.current}页 / 共${Math.ceil(total/page.pageSize)}页`;
       },
      ...page,
      showQuickJumper: false,
    };
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <PageHeaderLayout>
        <div className={styles.faultBox}>
          <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0px'}}>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={3} sm={24}>
                <Select value={type} onChange={this.selectHandleChange}>
                  <Option value="1">上报时间</Option>
                  <Option value="2">解决时间</Option>
                </Select>
              </Col>
              <Col md={6} sm={24}>
                {/* <DatePicker placeholder="开始时间"
              selectedValue={this.state.startDateString}
              value={this.state.startDateString}
              showTime={{
                defaultValue: this.state.startDateString,
                value: this.state.startDateString,
              }}
              onChange={this.startDatePickerChange} /> */}
                <RangePicker
                  allowClear={false}
                  value={[moment(startDateString, 'YYYY-MM-DD'), moment(endDateString, 'YYYY-MM-DD')]}
                  onChange={this.startDatePickerChange}
                />
              </Col>
              {/* <Col md={2} sm={24}>
              解决时间
            </Col>
            <Col md={4} sm={24}>
              <DatePicker onChange={this.endDatePickerChange} />
            </Col> */}
              <Col md={8} sm={24}>
                <Input placeholder="请输入工单id、机器id、派单人，解决人搜索" value={userName} onChange={this.onChange} />
              </Col>
              <Col md={7} sm={24}>
                <Select placeholder="请选择工单状态" style={{ width: '100%'}} value={statusValue} onChange={this.selectStatusChange}>
                  {statusOption.map((item) => {
                    return (
                      <Option value={item.id} key={item.id}>{item.name}</Option>
                    );
                  })}
                </Select>
              </Col>
            </Row>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <Select placeholder="请选择工单来源" style={{ width: '100%'}} value={sourceValue} onChange={this.selectSourceChange}>
                  {sourceOption.map((item) => {
                    return (
                      <Option value={item.id} key={item.id}>{item.name}</Option>
                    );
                  })}
                </Select>
              </Col>
              <Col md={8} sm={24}>
              </Col>
              <Col md={8} sm={24}>
                <Button onClick={this.handleReset}>
                  重置
                </Button>
                <Button className={styles.serach} style={{ marginLeft: 8 }} type="primary" onClick={this.onFindData.bind(this)}>查询</Button>
              </Col>
            </Row>
          </Card>
          <Card bordered={false}>
            <div className="tableListOperator">
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>派单</Button>
            </div>
            <Table
              columns={columns}
              dataSource={list}
              rowKey={record => record.id}
              onChange={this.handleTableChange}
              pagination={paginationProps}
              scroll={{ x: 1800, y: (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 100 + 100) }}
            />
          </Card>
        </div>

        <Modal
          // title="回复"
          title={
            <div class="modalBox">
              <span class="leftSpan"></span>
              <span class="modalTitle">查看</span>
              {/*<span class="resolved" class={} style={{ display: currentRecord.finishTime ? '' : 'none'}}>已解决</span>*/}
              {/*<span class="willResolve">未解决</span>*/}
              {/*<span class={ currentRecord.finishTime ? 'resolved' : 'willResolve' }>*/}
                {/*{ currentRecord.finishTime ? '已解决' : '未解决' }*/}
              {/*</span>*/}
            </div>
          }
          width={800}
          visible={seeVisible}
          onCancel={this.seeHandleCancel}
          footer={[
            <Button key="submit" type="primary" onClick={this.seeHandleCancel}>
              关闭
            </Button>,
          ]}
          className={styles.checkFaultModalBox}>
          <div className={styles.middleLine}></div>
          <div className={styles.checkFaultBox}>
            <div className={styles.checkLeftFaultBox}>
              <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                <Col md={4} sm={24}>
                  <span>工单类型</span>
                </Col>
                <Col md={20} sm={24}>
                  <span className={styles.workType}>
                    {workType[seeData.workType - 1]}
                  </span>
                </Col>
              </Row>
              <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                <Col md={4} sm={24}>
                  <span>工单描述</span>
                </Col>
                <Col md={20} sm={24}>
                  <List
                    dataSource={seeData.answerList}
                    renderItem={item => (
                      <List.Item key={item.answerTime}>
                        <div>
                          <div className={styles.answerStatus}>
                            <span>{item.answerType === '1' ? '巡检人员' : '运营人员'}</span>
                            <span>{item.answerTime}</span>
                          </div>
                          <div className={styles.answer}>{item.answer}</div>
                          <div className={item.imgList.length > 0 ? styles.imgRight: ''}>
                            <Upload
                              // action="//jsonplaceholder.typicode.com/posts/"
                              listType="picture-card"
                              fileList={item.imgList}
                              onPreview={this.handlePreview}
                              onChange={this.handleChange}
                            >
                            </Upload>
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                              <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                <Col md={4} sm={24}>
                  <span className={styles.left}>解决方案</span>
                </Col>
                <Col md={20} sm={24}>
                  {seeData.finishRemark ? seeData.finishRemark : '无'}
                </Col>
              </Row>
            </div>
            <div className={styles.checkRightFaultBox}>
              <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                <Col md={24} sm={24}>
                  <Popover placement="top" content={seeData.code}>
                    <span className={styles.idStyle}>工单编号 {seeData.code}</span>
                  </Popover>
                </Col>
              </Row>
              <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                <Col md={24} sm={24}>
                  <Popover placement="top" content={seeData.machineCode}>
                    <span className={styles.machineStyle}>机器编号 {seeData.machineCode}</span>
                  </Popover>
                </Col>
              </Row>
              <div className={styles.checkRightBottomFaultBox} >
                <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                  <Col md={4} sm={24}>
                    <span className={styles.left}>指派人</span>
                  </Col>
                  <Col md={20} sm={24}>
                    <span className={styles.right}>{seeData.submitUser}</span>
                  </Col>
                </Row>
                <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                  <Col md={4} sm={24}>
                    <span className={styles.left}>指派时间</span>
                  </Col>
                  <Col md={20} sm={24}>
                    <span className={styles.right}>{seeData.submitTime}</span>
                  </Col>
                </Row>
                <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                  <Col md={4} sm={24}>
                    <span className={styles.left}>接单人</span>
                  </Col>
                  <Col md={20} sm={24}>
                    <span className={styles.right}>{seeData.receiveUser}</span>
                  </Col>
                </Row>
                <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                  <Col md={4} sm={24}>
                    <span className={styles.left}>接单时间</span>
                  </Col>
                  <Col md={20} sm={24}>
                    <span className={styles.right}>{seeData.talkingTime}</span>
                  </Col>
                </Row>
                <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                  <Col md={4} sm={24}>
                    <span className={styles.left}>解决人</span>
                  </Col>
                  <Col md={20} sm={24}>
                    <span className={styles.right}>{seeData.finishUser}</span>
                  </Col>
                </Row>
                <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                  <Col md={4} sm={24}>
                    <span className={styles.left}>解决时间</span>
                  </Col>
                  <Col md={20} sm={24}>
                    <span className={styles.right}>{seeData.finishTime}</span>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Modal>
        <Modal
          title={
            <div class="modalBox">
              <span class="leftSpan"></span>
              <span class="modalTitle">回复</span>
              {/*<span class="resolved" class={} style={{ display: currentRecord.finishTime ? '' : 'none'}}>已解决</span>*/}
              {/*<span class="willResolve">未解决</span>*/}
              {/*<span class={ seeData.finishTime ? 'resolved' : 'willResolve' }>*/}
                {/*{ seeData.finishTime ? '已解决' : '未解决' }*/}
              {/*</span>*/}
            </div>
          }
          width={800}
          visible={replyVisible}
          onOk={this.replyOKHandle}
          onCancel={this.replyHandleCancel}
          className={styles.checkFaultModalBox}>
          <div className={styles.middleLine}></div>
          <div className={styles.checkFaultBox}>
            <div className={styles.checkLeftFaultBox}>
              <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                <Col md={4} sm={24}>
                  <span>工单类型</span>
                </Col>
                <Col md={20} sm={24}>
                  <span className={styles.workType}>
                    {workType[seeData.workType - 1]}
                  </span>
                </Col>
              </Row>
              <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                <Col md={4} sm={24}>
                  <span>工单描述</span>
                </Col>
                <Col md={20} sm={24}>
                  <List
                    dataSource={seeData.answerList}
                    renderItem={item => (
                      <List.Item key={item.answerTime}>
                        <div>
                          <div className={styles.answerStatus}>
                            <span>{item.answerType === '1' ? '巡检人员' : '运营人员'}</span>
                            <span>{item.answerTime}</span>
                          </div>
                          <div className={styles.answer}>{item.answer}</div>
                          <div className={item.imgList.length > 0 ? styles.imgRight: ''}>
                            <Upload
                              // action="//jsonplaceholder.typicode.com/posts/"
                              listType="picture-card"
                              fileList={item.imgList}
                              onPreview={this.handlePreview}
                              onChange={this.handleChange}
                            >
                            </Upload>
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                              <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                <Col md={4} sm={24}>
                  <span className={styles.left}>解决方案</span>
                </Col>
                <Col md={20} sm={24}>
                  {seeData.finishRemark ? seeData.finishRemark : '无'}
                </Col>
              </Row>
              <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                <Col md={4} sm={24}>
                  <span className={styles.left}>回复内容</span>
                </Col>
                <Col md={20} sm={24}>
                  <TextArea placeholder="请输入" value={textAreaVal} onChange={this.onTextAreaChange.bind(this)} autosize={{ minRows: 2, maxRows: 6 }} style={{ marginBottom: '30px' }}/>
                </Col>
              </Row>
              <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                <Col md={4} sm={24}>
                  <span>指派给</span>
                </Col>
                <Col md={20} sm={24}>
                  <Select placeholder="请选择" style={{ width: '100%'}} value={ userId } onChange={this.selectUserChange}>
                    {getMachineUserList.map((item) => {
                      return (
                      <Option value={item.id} key={item.id}>{item.name}</Option>
                      );
                    })}
                  </Select>
                </Col>
              </Row>
            </div>
            <div className={styles.checkRightFaultBox}>
              <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                <Col md={24} sm={24}>
                  <Popover placement="top" content={seeData.code}>
                    <span className={styles.idStyle}>工单编号 {seeData.code}</span>
                  </Popover>
                </Col>
              </Row>
              <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                <Col md={24} sm={24}>
                  <Popover placement="top" content={seeData.machineCode}>
                    <span className={styles.machineStyle}>机器编号 {seeData.machineCode}</span>
                  </Popover>
                </Col>
              </Row>
              <div className={styles.checkRightBottomFaultBox} >
                <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                  <Col md={4} sm={24}>
                    <span className={styles.left}>指派人</span>
                  </Col>
                  <Col md={20} sm={24}>
                    <span className={styles.right}>{seeData.submitUser}</span>
                  </Col>
                </Row>
                <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                  <Col md={4} sm={24}>
                    <span className={styles.left}>指派时间</span>
                  </Col>
                  <Col md={20} sm={24}>
                    <span className={styles.right}>{seeData.submitTime}</span>
                  </Col>
                </Row>
                <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                  <Col md={4} sm={24}>
                    <span className={styles.left}>接单人</span>
                  </Col>
                  <Col md={20} sm={24}>
                    <span className={styles.right}>{seeData.receiveUser}</span>
                  </Col>
                </Row>
                <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                  <Col md={4} sm={24}>
                    <span className={styles.left}>接单时间</span>
                  </Col>
                  <Col md={20} sm={24}>
                    <span className={styles.right}>{seeData.talkingTime}</span>
                  </Col>
                </Row>
                <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                  <Col md={4} sm={24}>
                    <span className={styles.left}>解决人</span>
                  </Col>
                  <Col md={20} sm={24}>
                    <span className={styles.right}>{seeData.finishUser}</span>
                  </Col>
                </Row>
                <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                  <Col md={4} sm={24}>
                    <span className={styles.left}>解决时间</span>
                  </Col>
                  <Col md={20} sm={24}>
                    <span className={styles.right}>{seeData.finishTime}</span>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Modal>
        <CreateForm
          {...parentMethods}
          ref={this.saveFormRef}
          modalVisible={this.state.modalVisible}
          editModalConfirmLoading={this.state.editModalConfirmLoading}
          openSelectMachineModal={this.openSelectMachineModal}
          machineId={this.state.machineId}
        />
        <SelectMachineForm
          ref={this.selectMachineFormRef}
          editMachineModalVisible={this.state.editMachineModalVisible}
          onEditMachineHandleAddClick={this.onEditMachineHandleAddClick}
          onEditMachineHandleModalVisibleClick={this.onEditMachineHandleModalVisibleClick}
          editMachineEditModalConfirmLoading={this.state.editMachineEditModalConfirmLoading}
          insertOptions={this.state.insertOptions}
          loadData={this.getAreaList}

          sourceData={this.state.sourceData}
          onSelectMachineChange={this.onSelectMachineChange}
          findSourceData={this.findSourceData}
        />
      </PageHeaderLayout>
    );
  }
}
