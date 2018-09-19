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
  Button,
  Menu,
  Modal,
  Divider,
  Cascader,
  Popconfirm,
  Spin,
  Popover,
  TimePicker,
  Switch,
  Tag
} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './PointSetting.less';
import LogModal from '../../components/LogModal';
import { getAccountMenus } from '../../utils/authority';
import {Radio} from "antd/lib/index";
import EditableTagGroup from '../../components/Tag';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['processing', 'default', 'success', 'error'];
const status = ['运行中', '关闭', '已上线', '异常'];

const pointTypeOptions = [{id: 0, name: '活动点位'}, {id: 1, name: '渠道点位'}]
const type = ['活动点位', '渠道点位']

const CreateForm = Form.create()(
  (props) => {
    const { modalVisible, form, handleAdd, handleModalVisible, insertOptions,
      loadData, onChange, editModalConfirmLoading, modalType, verifyPhone,
      verifyString, handleChange, getTagList, TagLists, handleTags, modalData, handleSupervisorySwitch, switchStatus, handTagLists
    } = props;
    // const okHandle = () => {
    //   form.validateFields((err, fieldsValue) => {
    //     if (err) return;
    //     form.resetFields();
    //     handleAdd(fieldsValue);
    //   });
    // };
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
            <span class="modalTitle">{!modalType ? '编辑点位' : '新建点位'}</span>
          </div>
        }
        visible={modalVisible}
        onOk={handleAdd}
        onCancel={() => handleModalVisible()}
        confirmLoading={editModalConfirmLoading}
        width={800}
      >
        <div className="manageAppBox">
          <Form onSubmit={this.handleSearch}>
            <FormItem {...formItemLayout} label="省市区">
              {getFieldDecorator('provinceCityAreaTrade', {
                rules: [{ required: true, message: '省市区' }, {
                  validator: verifyString,
                }],
                // initialValue: { defaultValue },
              })(
                <Cascader
                  placeholder="请选择"
                  options={insertOptions}
                  loadData={loadData}
                  onChange={onChange}
                  changeOnSelect
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="点位名称">
              {getFieldDecorator('mall', {
                rules: [{ required: true, whitespace: true, message: '请输入点位名称' }],
              })(<Input placeholder="请输入点位" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="具体位置">
              {getFieldDecorator('name', {
                rules: [{ required: true, whitespace: true, message: '请输入具体位置' }],
              })(<Input placeholder="请输入具体位置" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="点位类型">
              {getFieldDecorator('type', {
                rules: [{ required: true, message: '请选择点位类型' }],
                initialValue: '0',
              })(
                <RadioGroup>
                  <Radio value="0">活动点位</Radio>
                  <Radio value="1">渠道点位</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              label="监控设置"
              {...formItemLayout}>
              {getFieldDecorator('monitor', {
                rules: [{ required: false, }],
              })(
                <Switch checked={switchStatus} checkedChildren="开" unCheckedChildren="关" onChange={handleSupervisorySwitch}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="监控时间">
              {getFieldDecorator('monitorStart', {
                rules: [{ required: false, message: '' }],
                initialValue: moment('00:00:00', 'HH:mm:ss')
              })(
                <TimePicker disabled={!switchStatus}/>
              )}
              <span>-</span>
              {getFieldDecorator('monitorEnd', {
                rules: [{ required: false, message: '' }],
                initialValue: moment('23:59:59', 'HH:mm:ss')
              })(
                <TimePicker disabled={!switchStatus}/>
              )}
            </FormItem>
            {/*<FormItem {...formItemLayout} label="标签">*/}
            {/*{getFieldDecorator('tag', {*/}
            {/*initialValue: []*/}
            {/*})(*/}
            {/*<Select*/}
            {/*mode="multiple"*/}
            {/*style={{ width: '100%' }}*/}
            {/*placeholder="请选择标签"*/}
            {/*// defaultValue={['a10', 'c12']}*/}
            {/*onChange={handleChange}*/}
            {/*// onSearch={getTagList}*/}
            {/*>*/}
            {/*{TagLists.map((item) => {*/}
            {/*return (*/}
            {/*<Option value={item.id} key={item.name}>{item.name}</Option>*/}
            {/*);*/}
            {/*})}*/}
            {/*</Select>*/}
            {/*)}*/}
            {/*</FormItem>*/}
            <FormItem {...formItemLayout} label="标签">
              {getFieldDecorator('titles', {
                rules: [{ required: false }],
                initialValue: { tags: [] },
              })(
                <EditableTagGroup
                  handleTags={handleTags}
                  tags={modalData.tags}
                  search={true}
                  handTagLists={handTagLists}
                  data={TagLists}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="备注描述">
              {getFieldDecorator('remark')(<TextArea placeholder="请输入备注描述" autosize={{ minRows: 2, maxRows: 6 }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="运营人员">
              {getFieldDecorator('manager', {
                rules: [{ required: true, whitespace: true, message: '请输入运营人员' }],
              })(<Input placeholder="请输入运营人" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="手机号码">
              {getFieldDecorator('mobile', {
                rules: [{ required: true, message: '请输入手机号码' }, {
                  validator: verifyPhone,
                }],
              })(<Input placeholder="请输入手机" />)}
            </FormItem>

          </Form>
        </div>
      </Modal>
    );
  });
@connect(({ common, loading, pointSetting, log }) => ({
  common,
  pointSetting,
  loading: loading.models.pointSetting,
  log,
}))
@Form.create()
export default class PointSettingList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    defaultValue: {},
    options: '',
    editModalConfirmLoading: false,
    pageNo: 1,
    keyword: '',
    modalData: {},
    logModalVisible: false,
    logModalLoading: false,
    logId: '',
    logModalPageNo: 1,
    code: '',
    modalType: true,
    CreateFormLoading: false,

    account: {},
    supervisoryStartTime: '00:00:00',
    supervisoryEndTime: '23:59:59',
    TagLists: [],

    switchStatus: true,
    type: ''

  };
  componentWillMount() {
    // 查询省
  }
  componentDidMount() {
    this.getAreaList();
    this.getLists();
    this.getAccountMenus(getAccountMenus())
  }
  getAccountMenus = (setAccountMenusList) => {
    if (setAccountMenusList) {
      const pointSettingMenu = setAccountMenusList.filter((item) => item.path === 'machine')[0]
        .children.filter((item) => item.path === 'point-setting')
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
  // 获取城市列表
  getAreaList = () => {
    this.props.dispatch({
      type: 'common/getProvinceCityAreaTradeArea',
      payload: {
        restParams: {
          code: this.state.code,
        },
      },
    }).then( (res) => {
      this.setState({
        options: res,
      });
    });
  }
  // 获取点位管理列表
  getLists = () => {
    this.props.dispatch({
      type: 'pointSetting/getPointSettingList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          keyword: this.state.keyword,
          code: this.state.code,
          type: this.state.type
        },
      },
    });
  }
  // 验证
  verifyPhone = (rule, value, callback) => {
    const reg = /^[1][0-9][0-9]{9}$/;
    if (!reg.test(value)) {
      callback('请填写正确的手机号码');
    } else {
      callback();
    }
  }
  verifyString = (rule, value, callback) => {
    if (value.length < 3) {
      callback('请填写完整的省市区');
    } else {
      callback();
    }
  }
  verifyTrim = (rule, value, callback) => {
    let v = value.replace(/(^\s*)|(\s*$)/g, '')
    if (v === '') {
      callback('不可输入空格');
    } else {
      callback();
    }
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
      code: '',
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };
  // 批量
  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: '',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
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
      // const values = {
      //   ...fieldsValue,
      //   updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      // };
      // this.setState({
      //   formValues: values,
      // });
      let localCode = ''
      if (fieldsValue.provinceCityAreaTrade) {
        if (fieldsValue.provinceCityAreaTrade.length > 0) {
          localCode = fieldsValue.provinceCityAreaTrade[fieldsValue.provinceCityAreaTrade.length - 1]
        }
      }
      this.setState({
        pageNo: 1,
        keyword: fieldsValue.keyword ? fieldsValue.keyword : '',
        code: localCode,
        type: fieldsValue.type >= 0 ? fieldsValue.type : ''
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
      TagLists: []
    });
    this.setModalData();
    this.getTagList('')
  };
  // 删除modal 删除事件
  handleDelClick = (item) => {
    this.setState({
      editModalConfirmLoading: true,
    });
    if (item) {
      const params = { id: item.id };
      this.props.dispatch({
        type: 'pointSetting/delPointSetting',
        payload: {
          params,
        },
      }).then(() => {
        // message.success('Click on Yes');
        this.getLists();
        this.setState({
          editModalConfirmLoading: false,
        });
      });
    } else return false;
  }
  // 获取商圈信息
  getArea = (code) => {
    return this.props.dispatch({
      type: 'common/getProvinceCityAreaTradeArea',
      payload: {
        restParams: {
          code,
        },
      },
    });
  }
  // 获取点位详情
  getPointSettingDetail = (item) => {
    return this.props.dispatch({
      type: 'pointSetting/getPointSettingDetail',
      payload: {
        restParams: {
          id: item.id,
        },
      },
    });
  }
  // forIn
  forIn = (arr, value, res) => {
    for (let [i, v] of new Map(arr.map((item, i) => [i, item]))) {
      if (v.value === value) {
        v.children = res;
        return { index: i };
      }
    }
  }
  handleEditClick = async (item) => {
    this.setState({
      modalVisible: true,
      modalData: item,
      modalType: false,
      // CreateFormLoading: true,
    });
    const res = await this.getPointSettingDetail(item);
    if (!res) {
      return
    }
    const { city, district, circle } = res;
    const provinceRes = await this.getArea('')
    let province = provinceRes;
    const cityRes = await this.getArea(res.province)
    const forInCityRes = this.forIn(province, res.province, cityRes)
    const provinceIndex = forInCityRes.index
    const districtRes = await this.getArea(city)
    const arrCity = province[provinceIndex].children
    const forInDistrictRes = this.forIn(arrCity, city, districtRes)
    const cityIndex = forInDistrictRes.index
    const circleRes = await this.getArea(district)
    const arrDistrict = province[provinceIndex].children[cityIndex].children
    this.forIn(arrDistrict, district, circleRes)
    this.setState({
      options: province,
      defaultValue: [res.province, city, district, circle],
    }, () => {
      this.setModalData(res);
      // this.setState({
      //   CreateFormLoading: false
      // })
    });
    // 回显省市区商圈数据源
  }
  // 编辑modal 编辑事件 废弃
  handleEditClick2 = (item) => {
    this.setState({
      modalVisible: true,
      modalData: item,
      modalType: false,
    });
    this.props.dispatch({
      type: 'pointSetting/getPointSettingDetail',
      payload: {
        restParams: {
          id: item.id,
        },
      },
    }).then((res) => {
      // 回显省市区商圈数据源
      if (res.province) {
        let province, provinceIndex, cityIndex, { city, district, circle } = res;
        // all 省
        this.props.dispatch({
          type: 'common/getProvinceCityAreaTradeArea',
          payload: {
            restParams: {
              code: '',
            },
          },
        }).then((provinceRes) => {
          province = provinceRes; // 所有省
          // 市
          this.props.dispatch({
            type: 'common/getProvinceCityAreaTradeArea',
            payload: {
              restParams: {
                code: res.province,
              },
            },
          }).then((cityRes) => {
            for (let i = 0; i < province.length; i++) {
              // console.log(province[i].value === res.province, province[i].value, res.province, i)
              if (province[i].value === res.province) {
                provinceIndex = i
                province[i].children = cityRes;
              }
            }
            // 区
            this.props.dispatch({
              type: 'common/getProvinceCityAreaTradeArea',
              payload: {
                restParams: {
                  code: city,
                },
              },
            }).then((districtRes) => {
              let arr = province[provinceIndex].children
              for (let i = 0; i < arr.length; i++) {
                if (arr[i].value === city) {
                  cityIndex = i
                  arr[i].children = districtRes;
                }
              }
              // 区
              this.props.dispatch({
                type: 'common/getProvinceCityAreaTradeArea',
                payload: {
                  restParams: {
                    code: district,
                  },
                },
              }).then((circleRes) => {
                let arr = province[provinceIndex].children[cityIndex].children
                for (let i = 0; i < arr.length; i++) {
                  if (arr[i].value === district) {
                    arr[i].children = circleRes;
                  }
                }
                // 商圈
                this.setState({
                  options: province,
                  defaultValue: [res.province, city, district, circle],
                }, () => {
                  this.setModalData(res);
                });
              });
            });
          });
        });
      }
    });
  }
  // 设置modal 数据
  setModalData = (data) => {
    if (data) {
      this.setState({
        modalData: {
          tags: data.tags ? data.tags : []
        },
        switchStatus: parseInt(data.monitor) === 0 ? true : false
      }, () => {
        this.form.setFieldsValue({
          name: data.name || '',
          mall: data.mall || '',
          manager: data.manager || '',
          mobile: data.mobile || '',
          provinceCityAreaTrade: this.state.defaultValue,
          remark: data.remark || '',
          monitorStart: data.monitorStart ? moment(data.monitorStart, 'HH:mm:ss') : undefined,
          monitorEnd: data.monitorEnd ? moment(data.monitorEnd, 'HH:mm:ss') : undefined,
          type: data.type
        });
      })
    } else {
      this.setState({
        modalData:  { tags: [] },
        switchStatus: true,
      }, () => {
        this.form.setFieldsValue({
          name: '',
          mall: '',
          manager: '',
          mobile: '',
          provinceCityAreaTrade: '',
          remark: '',
          monitorStart: moment('00:00:00', 'HH:mm:ss'),
          monitorEnd: moment('23:59:59', 'HH:mm:ss'),
          type: '0',
        });
      })
    }
  }
  // 新增modal确认事件 开始
  saveFormRef = (form) => {
    this.form = form;
  }
  // 编辑modal 确认事件
  handleAdd = () => {
    this.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const provinceCityAreaTradeTmp = fieldsValue.provinceCityAreaTrade
      let params = {
        ...fieldsValue,
        provinceCityAreaTrade: undefined,
        areaCode: provinceCityAreaTradeTmp[provinceCityAreaTradeTmp.length - 1],
        monitorStart: this.state.switchStatus ? (fieldsValue.monitorStart ? fieldsValue.monitorStart.format('HH:mm:ss') : undefined) : '',
        monitorEnd: this.state.switchStatus ? (fieldsValue.monitorEnd ? fieldsValue.monitorEnd.format('HH:mm:ss') : undefined) : '',
        tag: this.state.modalData.tags ? JSON.stringify(this.state.modalData.tags) : '',
        monitor: this.state.switchStatus ? 0 : 1
      };
      this.setState({
        editModalConfirmLoading: true,
      });
      let url = 'pointSetting/savePointSetting';
      if (this.state.modalData.id) {
        url = 'pointSetting/editPointSetting';
        params = { ...params, id: this.state.modalData.id };
      }
      this.props.dispatch({
        type: url,
        payload: {
          params,
        },
      }).then((res) => {
        if (res && res.code === 0) {
          this.setState({
            code: '',
            modalVisible: false,
            modalData: {},
          }, () => {
            this.getLists();
          })
        }
        this.setState({
          editModalConfirmLoading: false,
        });
      });
    });
  }
  // 新增modal确认事件 结束
  // 四级联动开始
  onChange = (value, selectedOptions) => {
    // 当前选中的value[3]商圈
    // console.log(value, selectedOptions);
  }
  loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    this.setState({
      code: targetOption.value,
    }, () => {
      this.props.dispatch({
        type: 'common/getProvinceCityAreaTradeArea',
        payload: {
          restParams: {
            code: targetOption.value,
          },
        },
      }).then((res) => {
        targetOption.loading = false;
        targetOption.children = res
        this.setState({
          options: [...this.state.options],
        });
      });
    });
  }
  // 四级联动结束
  // handleChange
  getTagList = (value) => {
    this.props.dispatch({
      type: 'pointSetting/getTagList',
      payload: {
        restParams: {
          name: value,
        },
      },
    }).then((res) => {
      if (res && res.code === 0) {
        this.setState({
          TagLists: res.data
        })
      }
    });
  }
  handleTags = (val) => {
    // tags: ["445", "6789"]
    this.setState({
      modalData: { tags: val },
    });
  }
  handTagLists = (val) => {
    if (val) {
      this.getTagList(val)
    } else {
      this.setState({
        TagLists: []
      })
    }
  }
  handleChange = (value, option) => {
    console.log(`selected ${value}`, option);
    // this.setState({
    //   TagLists: []
    // }, () => {
    //   console.log('222222', this.state.TagLists)
    // })
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

  handleSupervisorySwitch = (value) => {
    if (value == true) {
      this.setState({
        switchStatus: value,
        supervisoryStartTime: '00:00:00',
        supervisoryEndTime: '23:59:59'
      });
    } else {
      this.setState({
        switchStatus: value,
        supervisoryStartTime: '',
        supervisoryEndTime: ''
      });
    }
  }

  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={7} sm={24} lg={8}>
            <FormItem label="省市区商圈">
              {getFieldDecorator('provinceCityAreaTrade')(
                <Cascader
                  placeholder="请选择"
                  options={this.state.options}
                  loadData={this.loadData}
                  onChange={this.onChange}
                  changeOnSelect
                />
              )}
            </FormItem>
          </Col>
          {/*label="关键字"*/}
          <Col md={7} sm={24} lg={8}>
            <FormItem >
              {getFieldDecorator('keyword')(<Input placeholder="请输入点位、具体位置、标签、运营人姓名搜索" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24} lg={8}>
            <FormItem label="选择点位类型">
              {getFieldDecorator('type')(
                <Select placeholder="选择点位类型">
                  {pointTypeOptions.map((item) => {
                    return (
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={9} sm={24} lg={8}>
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
  // 四级联动结束
  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
  render() {
    const {
      pointSetting: { list, page, unColumn },
      loading,
      log: { logList, logPage },
    } = this.props;
    const { selectedRows, modalVisible, editModalConfirmLoading, modalData, modalType, options, account } = this.state;
    let columns = [
      {
        title: '省市区',
        width: '10%',
        dataIndex: 'areaName',
        key: 'areaName'
      },
      {
        title: '点位',
        width: '10%',
        dataIndex: 'mail',
        key: 'mail'
      },
      {
        title: '具体位置',
        width: '10%',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '点位类型',
        width: '10%',
        dataIndex: 'type',
        key: 'type',
        render(val) {
          if (val !== null) {
            return <span>{type[val]}</span>;
          }
        },
      },
      {
        title: '监控时间',
        width: '10%',
        dataIndex: 'time',
        key: 'time',
        render: (text, item) => (
          <div>{`${item.monitorStart ? item.monitorStart : ''}-${item.monitorEnd ? item.monitorEnd : ''}`}</div>
        ),
      },
      {
        title: '标签',
        width: '10%',
        dataIndex: 'tags',
        key: 'tags',
        render: (text, item) => (
          (item.tags) ? (
            item.tags.map((res) => {
              return <Tag>{res}</Tag>
            })
          ) : (
            null
          )

        ),
      },
      {
        title: '备注描述',
        dataIndex: 'remark',
        key: 'remark'
      },
      {
        title: '运营人',
        width: '10%',
        dataIndex: 'manager',
        key: 'manager'
      },
      {
        title: '机器个数',
        width: '10%',
        dataIndex: 'userNum',
        key: 'userNum'
      },
      {
        title: '机器编号',
        width: '15%',
        dataIndex: 'machineCode',
        render: (text, item) => (
          (item.machineCode) ? (
            <Popover content={item.machineCode} title="机器编号">
              <div style={{ height: '45px', overflow: 'hidden' }}>
                {`${item.machineCode ? item.machineCode : ''}...`}
              </div>
            </Popover>
          ) : (
            null
          )

        ),
        key: 'machineCode'
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile'
      },
      {
        fixed: 'right',
        width: 150,
        title: '操作',
        render: (text, item) => (
          <Fragment>
            <a onClick={() => account.update ? this.handleEditClick(item) : null} style={{ display: !account.update ? 'none' : ''}}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="确定要删除吗" onConfirm={() => !account.delete ? null : this.handleDelClick(item)} okText="Yes" cancelText="No">
              <a className={styles.delete}
                 style={{ display: !account.delete ? 'none' : ''}}
              >删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
    // unColumn
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
              <Button icon="plus-circle-o" type="primary" onClick={() => this.handleModalVisible(true)} style={{ display: !account.add ? 'none' : ''}}>
                新建
              </Button>
            </div>
            <div style={{ display: !account.list ? 'none' : ''}}>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={list}
                page={page}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                scrollX={1400}
                scrollY={(document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 160)}
              />
            </div>
          </div>
        </Card>
        {/*<Spin tip="Loading...">*/}
        <CreateForm
          {...parentMethods}
          ref={this.saveFormRef}
          modalVisible={modalVisible}
          insertOptions={options}
          loadData={this.loadData}
          onChange={this.onChange}
          editModalConfirmLoading={editModalConfirmLoading}
          modalData={modalData}
          modalType={modalType}
          verifyPhone={this.verifyPhone}
          verifyString={this.verifyString}
          verifyTrim={this.verifyTrim}
          // handleChange={this.handleChange}
          // getTagList={this.getTagList}
          TagLists={this.state.TagLists}
          handleTags={this.handleTags}
          // modalData={this.state.modalData}
          handleSupervisorySwitch={this.handleSupervisorySwitch}
          switchStatus={this.state.switchStatus}
          handTagLists={this.handTagLists}
        />
        {/*</Spin>*/}
        {/*<Spin tip="Loading..." spinning={this.state.CreateFormLoading}></Spin>*/}
        <LogModal
          data={logList}
          page={logPage}
          loding={this.state.logModalLoading}
          logVisible={this.state.logModalVisible}
          logHandleCancel={this.logModalHandleCancel}
          logModalhandleTableChange={this.logModalhandleTableChange}
        />
      </PageHeaderLayout>
    );
  }
}
