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
} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './PointSetting.less';
import LogModal from '../../components/LogModal';
import { getAccountMenus } from '../../utils/authority';

const FormItem = Form.Item;
const { TextArea } = Input
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['processing', 'default', 'success', 'error'];
const status = ['运行中', '关闭', '已上线', '异常'];

const CreateForm = Form.create()(
  (props) => {
    const { modalVisible, form, handleAdd, handleModalVisible, insertOptions, loadData, onChange, editModalConfirmLoading, modalType, verifyPhone, verifyString, verifyTrim } = props;
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
      >
        <div className="manageAppBox">
          <Form onSubmit={this.handleSearch}>
            <FormItem {...formItemLayout} label="省市区商圈">
              {getFieldDecorator('provinceCityAreaTrade', {
                rules: [{ required: true, message: '省市区商圈' }, {
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
            <FormItem {...formItemLayout} label="商场名称">
              {getFieldDecorator('mall', {
                rules: [{ required: false,whitespace: true, message: '请输入商场名称' }],
              })(<Input placeholder="请输入商场" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="点位名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, whitespace: true, message: '请输入点位名称' }],
              })(<Input placeholder="请输入点位名称" />)}
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
            <FormItem {...formItemLayout} label="备注描述">
              {getFieldDecorator('remark')(<TextArea placeholder="请输入备注描述" autosize={{ minRows: 2, maxRows: 6 }} />)}
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
    account: {}
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
    console.log('setAccountMenusList', setAccountMenusList)
    if (setAccountMenusList) {
      const pointSettingMenu = setAccountMenusList.filter((item) => item.path === 'machine')[0]
        .children.filter((item) => item.path === 'point-setting')
      var obj = {}
      pointSettingMenu[0].children.forEach((item, e) => {
        obj[item.path] = true;
      })
      this.setState({
        account: obj
      })
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
    if (value.length < 4) {
      callback('请填写完整的省市区商圈');
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
      this.form.setFieldsValue({
        name: data.name || '',
        mall: data.mall || '',
        manager: data.manager || '',
        mobile: data.mobile || '',
        provinceCityAreaTrade: this.state.defaultValue,
        remark: data.remark || '',
      });
    } else {
      this.form.setFieldsValue({
        name: '',
        mall: '',
        manager: '',
        mobile: '',
        provinceCityAreaTrade: '',
        remark: '',
      });
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
      };
      this.setState({
        editModalConfirmLoading: true,
        modalData: {},
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
      }).then(() => {
        this.setState({
          code: '',
        }, () => {
          this.getLists();
        })
        this.setState({
          editModalConfirmLoading: false,
          modalVisible: false,
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
              {getFieldDecorator('keyword')(<Input placeholder="请输入商场、运营人、手机号搜索" />)}
            </FormItem>
          </Col>
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
        title: '所属省市区商圈',
        width: '10%',
        dataIndex: 'areaName',
        key: 'areaName'
      },
      {
        title: '商场',
        width: '10%',
        dataIndex: 'mall',
        key: 'mall'
      },
      {
        title: '点位名称',
        width: '10%',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '运营人',
        width: '10%',
        dataIndex: 'manager',
        key: 'manager'
      },
      {
        title: '手机号',
        width: '10%',
        dataIndex: 'mobile',
        key: 'mobile'
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
        title: '备注描述',
        dataIndex: 'remark',
        key: 'remark'
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
              {/*{selectedRows.length > 0 && (*/}
              {/*<span>*/}
              {/*<Button>批量操作</Button>*/}
              {/*<Dropdown overlay={menu}>*/}
              {/*<Button>*/}
              {/*更多操作 <Icon type="down" />*/}
              {/*</Button>*/}
              {/*</Dropdown>*/}
              {/*</span>*/}
              {/*)}*/}
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
                scrollX={1300}
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
