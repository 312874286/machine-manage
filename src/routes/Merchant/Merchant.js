import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  Modal,
  message,
  Badge,
  Divider,
  Cascader,
  Popconfirm,
  Radio,
  Checkbox,
  Table,
  DatePicker,
} from 'antd';
import StandardTable from '../../components/StandardTable/index';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Merchant.less';
import {getAccountMenus} from "../../utils/authority";
import {RegexTool} from "../../utils/utils";

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['processing', 'default', 'success', 'error'];
const status = ['运行中', '关闭', '已上线', '异常'];
const merchantList = ['汽车行业', '快销品行业', '美妆行业', '母婴行业', '酒品行业']

const CreateForm = Form.create()(
  (props) => {
    const { modalVisible, form, handleAdd, handleModalVisible, editModalConfirmLoading, modalType, BaseDictLists } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
    };
    return (
      <Modal
        title={
          <div class="modalBox">
            <span class="leftSpan"></span>
            <span class="modalTitle">{!modalType ? '编辑商户' : '新建商户'}</span>
          </div>
        }
        visible={modalVisible}
        onOk={handleAdd}
        onCancel={() => handleModalVisible()}
        confirmLoading={editModalConfirmLoading}
      >
        <div className="manageAppBox">
          <Form onSubmit={this.handleSearch}>
            <FormItem {...formItemLayout} label="商户名称">
              {getFieldDecorator('merchantName', {
                rules: [{ required: true, whitespace: true, message: '请输入商户名称' }],
              })(<Input placeholder="请输入商户名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="商户行业">
              {getFieldDecorator('industryCode', {
                rules: [{ required: true, whitespace: true, message: '请选择商户行业' }],
              })(
                <Select placeholder="请选择">
                  {BaseDictLists.map((item) => {
                    return (
                      <Option value={item.code} key={item.code}>{item.name}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="允许登录商户平台">
              {getFieldDecorator('loginStatus', {
                rules: [{ required: true, message: '请选择允许登录商户平台' }],
                initialValue: '0',
              })(
                <RadioGroup>
                  <Radio value="0">不允许</Radio>
                  <Radio value="1">允许</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="商户账号">
              {getFieldDecorator('loginName', {
                rules: [{ required: true, whitespace: true, message: '请输入商户账号' }],
              })(<Input placeholder="请输入商户账号" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="手机号码">
              {getFieldDecorator('phone', {
                validateFirst: true,
                rules: [
                  { type: 'string', required: true, message: '请输入手机号' },
                  {
                    validator(rule, value, callback) {
                      if (!(RegexTool.mobile.test(value))) {
                        callback('请输入正确的手机号');
                      }
                      callback();
                    },
                  }],
              })(<Input placeholder="请输入手机号码" />)}
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  });
let deliveryFormId = 0;
const ActivityMsgForm = Form.create()(
  (props) => {
    const { modalVisible, form, handleAdd, handleModalVisible, editModalConfirmLoading, ActivityLists,
      activityIndex1, activityIndex2, activityIndex3, handleActivityIndexChange1, handleActivityIndexChange2, handleActivityIndexChange3,
      activityInfo, modalActivityData, saveMsgLogs, handleDeleteClick, getDetail
    } = props;
    const { getFieldDecorator, getFieldValue } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
    };
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const modalColumns = [
      {
        title: "操作",
        dataIndex: "infoType",
        key: "infoType",
        width: "20%",
        render: (text, record) => <span style={{ color: "#666" }}>{text === 1 ? '新增' : '变更'}</span>,
        align: "center",
      },
      {
        title: "时间",
        dataIndex: "time",
        key: "time",
        width: "20%",
        align: "center",
        render: (text, record) => (
          <span style={{ color: "#666" }}>
            {moment(text).format("YYYY-MM-DD")}
          </span>
        ),
      },
      {
        title: "操作描述",
        dataIndex: "infoDesc",
        key: "infoDesc",
        align: "center",
      },
      {
        title: "操作",
        key: "edit",
        align: "center",
        render: (text, item) => (
          <Fragment>
            <a onClick={() => handleDeleteClick(item)}>删除</a>
          </Fragment>
        ),
      },
    ];
    const add = () => {
      form.validateFields((err, val) => {
        if (!err) {
          const keys = form.getFieldValue("keys");
          const nextKeys = keys.concat(++deliveryFormId);
          console.log(keys, nextKeys);
          form.setFieldsValue({
            keys: nextKeys
          });
        }
      });
    };
    const remove = (k) => {
      // can use data-binding to get
      const keys = form.getFieldValue('keys');
      form.setFieldsValue({
        keys: keys.filter(key => key !== k),
      });
    }
    const saveMsg = async (k) => {
      const res = await saveMsgLogs(k)
      if (res && res.code === 0) {
        const keys = form.getFieldValue('keys');
        form.setFieldsValue({
          keys: keys.filter(key => key !== k),
        });
        getDetail(0)
      }
    }
    getFieldDecorator("keys", { initialValue: [] });
    const keys = getFieldValue("keys");

    const formItems = keys.map((k, index) => (
      <Row key={k} gutter={{ sm: 24 }}>
        {/*<Col sm={24}>*/}
          {/*<span style={{ color: "rgba(0, 0, 0, 0.85)" }}>物流单{index + 1}</span>*/}
        {/*</Col>*/}
        <Col offset={0} sm={24}>
          <FormItem {...formItemLayout} label="类型">
            {getFieldDecorator(`infoType[${k}]`, {
              rules: [
                { required: true, message: "请选择类型" }
              ]
            })(
              <Select placeholder="请选择">
                <Option value={1} key={1}>新增</Option>
                <Option value={2} key={2}>变更</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="变更信息日期">
            {getFieldDecorator(`infoDate[${k}]`, {
              rules: [
                { required: true, message: "请输入变更信息日期" }
              ]
            })(<DatePicker />)}
          </FormItem>
          <FormItem {...formItemLayout} label="描述">
            {getFieldDecorator(`infoDesc[${k}]`, {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "请输入变更描述"
                  // validator: (rule, value, callback) => {
                  //   if (!/^[0-9]*$/.test(value)) {
                  //     callback("请输入正确的商品数量");
                  //   } else if (value === "") {
                  //     callback("请输入商品数量");
                  //   } else {
                  //     callback();
                  //   }
                  // }
                }
              ]
            })(
              <div>
                <Input placeholder="请输入描述" />
              </div>
            )}
          </FormItem>
          <FormItem {...formItemLayout}>
            <button className={styles.buttonStyle} onClick={() => saveMsg(k)}>保存</button>
            <button className={styles.buttonStyle} onClick={() => remove(k)}>删除</button>
          </FormItem>
        </Col>
      </Row>
    ));
    return (
      <Modal
        title={
          <div class="modalBox">
            <span class="leftSpan"></span>
            <span class="modalTitle">活动信息</span>
          </div>
        }
        visible={modalVisible}
        onOk={handleAdd}
        onCancel={() => handleModalVisible()}
        confirmLoading={editModalConfirmLoading}
        width={680}
        className={styles.modal}
      >
        <div className="manageAppBox">
          <Form onSubmit={this.handleSearch}>
            <FormItem {...formItemLayout} label="活动">
              {getFieldDecorator('activityId', {
                rules: [{ required: true, whitespace: true, message: '请选择活动' }],
              })(
                <Select placeholder="请选择" onChange={activityInfo}>
                  {ActivityLists.map((item) => {
                    return (
                      <Option value={item.actId} key={item.actId}>{item.actName}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>

              <FormItem {...formItemLayout} label="活动核心指标"></FormItem>
              <div style={{ display: 'flex' }} className={styles.index}>
                <div style={{ marginTop: '10px', marginRight: '15px' }}>
                  <Checkbox
                    checked={activityIndex1}
                    onChange={handleActivityIndexChange1}>
                  </Checkbox>
                </div>
                <FormItem {...formItemLayout1} label="参与人数">
                  {getFieldDecorator('activityIndex1', {
                    rules: [{ required: activityIndex1, message: '请输入参与人数' }],
                  })(
                    <InputNumber
                      placeholder="请输入参与人数"
                      disabled={!activityIndex1}
                    />
                  )}
                </FormItem>
              </div>
              <div  style={{ display: 'flex' }} className={styles.index}>
                <div style={{ marginTop: '10px', marginRight: '15px' }}>
                  <Checkbox
                    checked={activityIndex2}
                    onChange={handleActivityIndexChange2}>
                  </Checkbox>
                </div>
                <FormItem {...formItemLayout1} label="商品订单数">
                  {getFieldDecorator('activityIndex2', {
                    rules: [{ required: activityIndex2, message: '请输入商品订单数' }],
                  })(
                    <InputNumber
                      placeholder="请输入商品订单数"
                      disabled={!activityIndex2}
                    />
                  )}
                </FormItem>
              </div>
              <div  style={{ display: 'flex' }} className={styles.index}>
                <div style={{ marginTop: '10px', marginRight: '15px' }}>
                  <Checkbox
                    checked={activityIndex3}
                    onChange={handleActivityIndexChange3}>
                  </Checkbox>
                </div>
                <FormItem {...formItemLayout1} label="商品掉货数">
                  {getFieldDecorator('activityIndex3', {
                    rules: [{ required: activityIndex3, message: '请输入商品掉货数' }],
                  })(
                    <InputNumber
                      placeholder="请输入商品掉货数"
                      disabled={!activityIndex3}
                    />
                  )}
                </FormItem>
              </div>
              <FormItem {...formItemLayout} label="活动信息变更">
                <a onClick={add}>新增</a>
              </FormItem>
              <Table
                columns={modalColumns}
                dataSource={modalActivityData.infoList}
                pagination={false}
                scroll={{ y: 500 }}
              />
              {formItems}

          </Form>
        </div>
      </Modal>
    );
  });
@connect(({ common, loading, merchant }) => ({
  common,
  merchant,
  loading: loading.models.merchant,
}))
@Form.create()
export default class merchant extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    editModalConfirmLoading: false,
    pageNo: 1,
    keyword: '',
    channelId: '',
    modalData: {},
    logModalVisible: false,
    logModalLoading: false,
    logId: '',
    logModalPageNo: 1,
    modalType: true,
    channelLists: [],

    account: {},
    BaseDictLists: [],

    ActivityMsgModalVisible: false,
    editActivityMsgModalConfirmLoading: false,
    ActivityLists: [],

    activityIndex1: false,
    activityIndex2: false,
    activityIndex3: false,
    modalActivityData: {},
    activityId: '',
    merchantId: '',
    id: '',
  };
  componentDidMount() {
    this.getLists();
    this.getBaseDictLists();
    // this.getAccountMenus(getAccountMenus())
  }
  getAccountMenus = (setAccountMenusList) => {
    if (setAccountMenusList) {
      const pointSettingMenu = setAccountMenusList.filter((item) => item.path === 'project')[0]
        .children.filter((item) => item.path === 'merchant')
      var obj = {}
      if (pointSettingMenu[0].children) {
        pointSettingMenu[0].children.forEach((item, e) => {
          obj[item.path] = true;
        })
        this.setState({
          account: obj
        })
      }
    }
  }
  // 获取列表
  getLists = () => {
    this.props.dispatch({
      type: 'merchant/getMerchantList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          keyword: this.state.keyword,
          code: this.state.channelId,
        },
      },
    });
  }
  getBaseDictLists = () => {
    this.props.dispatch({
      type: 'merchant/getBaseDict',
      payload: {
        params: {
          type: '001',
        },
      },
    }).then((res) => {
      if (res && res.code === 0) {
        this.setState({
          BaseDictLists: res.data.industry,
        });
      }
    });
  }
  resetPwd = (item) => {
    this.props.dispatch({
      type: 'merchant/resetPwd',
      payload: {
        params: {
          id: item.id,
        },
      },
    }).then((res) => {
      if (res && res.code === 0) {
        message.success('重置成功')
      }
    })
  }
  // 分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
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
      keyword: '',
      channelId: '',
    });
  };


  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
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
        keyword: fieldsValue.keyword ? fieldsValue.keyword : '',
        channelId: fieldsValue.channelId ? fieldsValue.channelId : '',
      }, () => {
        this.getLists();
      });
    });
  };
  // 添加modal 添加事件
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
      modalData: {},
      modalType: true,
    });
    this.setModalData();
  };
  // 删除modal 删除事件
  handleDelClick = (item) => {
    this.setState({
      editModalConfirmLoading: true,
    });
    if (item) {
      const params = { id: item.id, status: item.loginStatus === '1' ? 0 : 1 };
      this.props.dispatch({
        type: 'merchant/alterStatus',
        payload: {
          params,
        },
      }).then((res) => {
        // message.success('Click on Yes');
        if (res && res.code === 0) {
          message.success(`${item.loginStatus === '0' ? '启用' : '停用'}成功`)
        }
        this.getLists();
        this.setState({
          editModalConfirmLoading: false,
        });
      });
    } else return false;
  }
  // 编辑modal 编辑事件
  handleEditClick = (item) => {
    this.setState({
      modalVisible: true,
      modalData: item,
      modalType: false,
    });
    this.props.dispatch({
      type: 'merchant/getMerchantDetail',
      payload: {
        restParams: {
          id: item.id,
        },
      },
    }).then((res) => {
      this.setModalData(res);
    });
  }
  // 设置modal 数据
  setModalData = (data) => {
    if (data) {
      this.form.setFieldsValue({
        industryCode: data.industryCode || undefined,
        merchantName: data.merchantName || undefined,
        loginStatus: data.loginStatus || undefined,
        loginName: data.loginName || undefined,
        phone: data.phone || undefined,
      });
    } else {
      this.form.setFieldsValue({
        industryCode: undefined,
        merchantName: undefined,
        loginStatus: undefined,
        loginName: undefined,
        phone: undefined,
      });
    }
  }
  // 新增modal确认事件 开始
  saveFormRef = (form) => {
    this.form = form;
  }
  // 编辑modal 确认事件
  handleAdd = () => {
    const { BaseDictLists } = this.state
    this.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        editModalConfirmLoading: true,
      });
      let url = 'merchant/saveMerchant';
      let params = {
        ...values,
        industry: BaseDictLists.filter(i => i.code === values.industryCode)[0].name
      };
      if (this.state.modalData.id) {
        params = {
          ...params,
          id: this.state.modalData.id };
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
          });
        }
        this.setState({
          editModalConfirmLoading: false,
        });
      });
    });
  }
  // 新增modal确认事件 结束
  renderAdvancedForm() {
    const { form } = this.props;
    const { channelLists } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={9} sm={24}>
            <FormItem>
              {getFieldDecorator('keyword')(<Input placeholder="请输入商户ID、商户名称、商户账号、手机号码" />)}
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
  saveActivityMsgFormRef = (form) => {
    this.ActivityMsgForm = form;
  }
  activityMsgHandler = (item) => {
    // activityLists
    this.ActivityMsgForm.setFieldsValue({
      activityId: undefined
    });
    this.setState({
      merchantId: item.merchantId,
    })
    this.props.dispatch({
      type: 'merchant/activityLists',
      payload: {
        restParams: {
          merchantId: item.merchantId,
        },
      },
    }).then((res) => {
      if (res && res.code === 0) {
        this.setState({
          ActivityLists: res.data
        })
      }
    });
    this.setState({
      ActivityMsgModalVisible: true,
    });
    this.ActivityMsgForm.setFieldsValue({
      activityIndex1: undefined,
      activityIndex2: undefined,
      activityIndex3: undefined,
    });
    this.setState({
      modalActivityData: {},
      activityIndex1: false,
      activityIndex2: false,
      activityIndex3: false,
    })
  }
  handleActivityMsgAdd = () => {
    const { merchantId, activityId, activityIndex1, activityIndex2, activityIndex3, id } = this.state
    this.ActivityMsgForm.validateFields((err, val) => {
      if (err) return;
      // addActivityInfo
      let arr = []
      if (activityIndex1) {
        arr = [{
          id,
          merchantId,
          activityId,
          activityIndexType: 1,
          activityIndex: val.activityIndex1
        }]
      }
      if (activityIndex2) {
        arr = [...arr, {
          id,
          merchantId,
          activityId,
          activityIndexType: 2,
          activityIndex: val.activityIndex2
        }]
      }
      if (activityIndex3) {
        arr = [...arr, {
          id,
          merchantId,
          activityId,
          activityIndexType: 3,
          activityIndex: val.activityIndex3
        }]
      }

      this.props.dispatch({
        type: 'merchant/saveIndex',
        payload: {
          params: arr,
        },
      }).then((res) => {
        if (res && res.code === 0) {
          this.setState({
            ActivityMsgModalVisible: false,
          });
        }
      });
      // deleteActivityInfo
    })
  }
  handleActivityMsgModalVisible = (flag) => {
    this.setState({
      ActivityMsgModalVisible: !!flag,
    });
  }
  activityInfo = (value) => {
    if (value) {
      this.setState({
        activityId: value,
      })
    }
    this.getDetail(1, value)
  }
  getDetail = (flag, value) => {
    const { merchantId, activityId } = this.state
    this.props.dispatch({
      type: 'merchant/activityInfo',
      payload: {
        restParams: {
          merchantId:  merchantId,
          activityId: value || activityId
        },
      },
    }).then((res) => {
      if (res && res.code === 0) {
        if (flag === 1) {
          let activityIndex1, activityIndex2, activityIndex3;
          res.data.indexList.forEach((item) => {
            if (parseInt(item.activityIndexType) === 1) {
              activityIndex1 = item.activityIndex
            }
            if (parseInt(item.activityIndexType) === 2) {
              activityIndex2 = item.activityIndex
            }
            if (parseInt(item.activityIndexType) === 3) {
              activityIndex3 = item.activityIndex
            }
          })
          this.ActivityMsgForm.setFieldsValue({
            activityIndex1: activityIndex1 || undefined,
            activityIndex2: activityIndex2 || undefined,
            activityIndex3: activityIndex3 || undefined,
          });
          this.setState({
            activityIndex1: activityIndex1 ? true : false,
            activityIndex2: activityIndex2 ? true : false,
            activityIndex3: activityIndex3 ? true : false,
          })
        }
        this.setState({
          modalActivityData: res.data,
          id: res.data.id
        })
      }
    });
  }
  saveMsgLogs = async (index) => {
    const { merchantId, activityId } = this.state
    let vals = {}
    await this.ActivityMsgForm.validateFields((err, val) => {
      if (err) return;
      vals = val
    })
    return await this.props.dispatch({
      type: 'merchant/addActivityInfo',
      payload: {
        params: {
          merchantId:  merchantId,
          activityId,
          infoType: vals.infoType[index],
          infoDate: vals.infoDate[index].format('YYYY-MM-DD'),
          infoDesc: vals.infoDesc[index]
        },
      },
    })
  }
  handleDeleteClick = (item) => {
    this.props.dispatch({
      type: 'merchant/deleteActivityInfo',
      payload: {
        params: {
          id:  item.id,
        },
      },
    }).then((res) => {
      this.getDetail(0);
    })
  }
  handleActivityIndexChange1 = (e) => {
    this.setState({
      activityIndex1: e.target.checked,
    }, () => {
      this.ActivityMsgForm.validateFields(['activityIndex1'], { force: true });
    });
  }
  handleActivityIndexChange2 = (e) => {
    this.setState({
      activityIndex2: e.target.checked,
    }, () => {
      this.ActivityMsgForm.validateFields(['activityIndex2'], { force: true });
    });
  }
  handleActivityIndexChange3 = (e) => {
    this.setState({
      activityIndex3: e.target.checked,
    }, () => {
      this.ActivityMsgForm.validateFields(['activityIndex3'], { force: true });
    });
  }
  render() {
    const {
      merchant: { list, page, unColumn },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, editModalConfirmLoading, modalType, channelLists, account } = this.state;
    let columns = [
      {
        title: '商户ID',
        width: '17%',
        dataIndex: 'merchantId',
        key: 'merchantId'
      },
      {
        title: '商户名称',
        width: '12%',
        dataIndex: 'merchantName',
        key: 'merchantName'
      },
      {
        title: '商户行业',
        width: '17%',
        dataIndex: 'industry',
        key: 'industry'
      },
      {
        title: '商户平台登录账号',
        width: '17%',
        dataIndex: 'loginName',
        key: 'loginName'
      },
      {
        title: '商户手机号码',
        dataIndex: 'phone',
        key: 'phone'
      },
      {
        fixed: 'right',
        width: 160,
        title: '操作',
        render: (text, item) => (
          <Fragment>
            <a onClick={() => this.handleEditClick(item)}>编辑</a>
            <Divider type="vertical" />
            {/*<a onClick={() => this.handleLogClick(item)}>日志</a>*/}
            {/*<Divider type="vertical" />*/}
            {/*<Popconfirm title="确定要停用吗" onConfirm={() => this.handleDelClick(item)} okText="Yes" cancelText="No">*/}
              <a className={styles.delete} onClick={() => this.handleDelClick(item)}>{parseInt(item.loginStatus) === 0 ? '启用账号' : '停用账号'}</a>
            {/*</Popconfirm>*/}
            <Divider type="vertical" />
            <a onClick={() => this.resetPwd(item)} style={{ display: 'inline-block' }}>重置密码</a>
            <Divider type="vertical" />
            <a onClick={() => this.activityMsgHandler(item)}>活动信息</a>
          </Fragment>
        ),
      },
    ];
    if (unColumn) {
      let leg = columns.length
      for (let i = leg - 1; i >= 0; i--) {
        for (let j = 0; j < unColumn.length; j++) {
          if (columns[i]) {
            if (columns[i].key === unColumn[j]) {
              columns.splice(i, 1)
              continue;
            }
          }
        }
      }
    }
    const width = 90/(columns.length - 1)
    for (let i = 0; i < columns.length; i++) {
      if (i < columns.length - 2) {
        columns[i].width = width + '%'
      }
      if (i === columns.length - 2) {
        columns[i].width = ''
      }
    }
    // this.state.options = this.props.common.list
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
          <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
            </div>
            <div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={list}
                page={page}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                scrollX={1000}
              />
            </div>
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          ref={this.saveFormRef}
          modalVisible={modalVisible}
          editModalConfirmLoading={editModalConfirmLoading}
          modalType={modalType}
          channelLists={channelLists}
          BaseDictLists={this.state.BaseDictLists}
        />
        <ActivityMsgForm
          ref={this.saveActivityMsgFormRef}
          modalVisible={this.state.ActivityMsgModalVisible}
          editModalConfirmLoading={this.state.editActivityMsgModalConfirmLoading}

          handleAdd={this.handleActivityMsgAdd}
          handleModalVisible={this.handleActivityMsgModalVisible}
          ActivityLists={this.state.ActivityLists}

          activityIndex1={this.state.activityIndex1}
          activityIndex2={this.state.activityIndex2}
          activityIndex3={this.state.activityIndex3}
          handleActivityIndexChange1={this.handleActivityIndexChange1}
          handleActivityIndexChange2={this.handleActivityIndexChange2}
          handleActivityIndexChange3={this.handleActivityIndexChange3}
          activityInfo={this.activityInfo}
          getDetail={this.getDetail}
          modalActivityData={this.state.modalActivityData}
          saveMsgLogs={this.saveMsgLogs}
          handleDeleteClick={this.handleDeleteClick}
        />
      </PageHeaderLayout>
    );
  }
}
