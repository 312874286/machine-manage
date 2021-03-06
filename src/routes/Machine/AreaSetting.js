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
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Cascader,
  Popconfirm
} from 'antd';
import StandardTable from '../../components/StandardTable/index';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './AreaSetting.less';
import LogModal from '../../components/LogModal/index';
import {getAccountMenus} from "../../utils/authority";


const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['processing', 'default', 'success', 'error'];
const status = ['运行中', '关闭', '已上线', '异常'];

const CreateForm = Form.create()(
  (props) => {
    const {
      modalVisible, form, handleAdd, handleModalVisible,
      editModalConfirmLoading, modalType, verifyString,
      areaList, getArea, modalData,
    } = props;
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
            <span class="modalTitle">{modalType ? '编辑省市' : '新建省市'}</span>
          </div>
        }
        visible={modalVisible}
        onOk={handleAdd}
        onCancel={() => handleModalVisible()}
        confirmLoading={editModalConfirmLoading}>
        <div className="manageAppBox">
          <Form onSubmit={this.handleSearch}>
            <FormItem {...formItemLayout} label="选择省市" style={{ display: modalType ? 'none' : '' }}>
              {getFieldDecorator('parentCode', {
                rules: [{ required: true, message: '省市' }, {
                  validator: verifyString,
                }],
                // initialValue: { defaultValue },
              })(
                <Cascader
                  placeholder="请选择"
                  options={areaList}
                  loadData={getArea}
                  changeOnSelect
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="省市" style={{ display: modalType ? '' : 'none' }}>
              <span>{modalData.province}{modalData.city}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="区名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, whitespace: true, message: '请输入区名称' }, {
                  validator: (rule, value, callback) => {
                    if (value.length > 16) {
                      callback('区名称不能超过15个字符');
                    } else {
                      callback();
                    }
                  },
                }],
              })(<Input placeholder="请输入区名称" />)}
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  });
@connect(({ common, loading, areaSetting, log }) => ({
  common,
  areaSetting,
  loading: loading.models.areaSetting,
  log,
}))
@Form.create()
export default class areaSettingList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    id: '',
    editModalConfirmLoading: false,
    pageNo: 1,
    code: '',
    modalData: {},
    logModalVisible: false,
    logModalLoading: false,
    logId: '',
    logModalPageNo: 1,
    modalType: true,
    account: {},
    areaList: [],
    parentCode: '',
    options: []
  };
  componentDidMount() {
    this.getLists();
    this.getAreaSerach('')
    // this.getAccountMenus(getAccountMenus())
  }
  getAccountMenus = (setAccountMenusList) => {
    if (setAccountMenusList) {
      const pointSettingMenu = setAccountMenusList.filter((item) => item.path === 'machine')[0]
        .children.filter((item) => item.path === 'areaSetting')
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
      type: 'areaSetting/areaList',
      payload: {
        restParams: {
          code: this.state.code,
          pageNo: this.state.pageNo,
        },
      },
    });
  }
  // 四级联动开始
  // 获取商圈信息
  getArea = (selectedOptions) => {
    let code = '';
    let targetOption = null;
    if (selectedOptions) {
      targetOption = selectedOptions[selectedOptions.length - 1];
      code = targetOption.value;
      targetOption.loading = true;
    }
    this.props.dispatch({
      type: 'common/getProvinceCity',
      payload: {
        restParams: {
          code,
        },
      },
    }).then((data) => {
      if (selectedOptions) {
        targetOption.loading = false;
        targetOption.children = data;
        this.setState({
          areaList: [...this.state.areaList],
        });
      } else {
        this.setState({
          areaList: data,
        });
      }
    });
  }
  getAreaSerach = (selectedOptions) => {
    let code = '';
    let targetOption = null;
    if (selectedOptions) {
      targetOption = selectedOptions[selectedOptions.length - 1];
      code = targetOption.value;
      targetOption.loading = true;
    }
    this.props.dispatch({
      type: 'common/getProvinceCityAreaTradeArea',
      payload: {
        restParams: {
          code,
        },
      },
    }).then((data) => {
      if (selectedOptions) {
        targetOption.loading = false;
        targetOption.children = data;
        this.setState({
          options: [...this.state.options]
        });
      } else {
        this.setState({
          options: data,
        });
      }
    });
  }
  // 四级联动结束
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
      let localCode = ''
      if (fieldsValue.provinceCityAreaTrade) {
        if (fieldsValue.provinceCityAreaTrade.length > 0) {
          localCode = fieldsValue.provinceCityAreaTrade[fieldsValue.provinceCityAreaTrade.length - 1]
        }
      }
      this.setState({
        pageNo: 1,
        code: localCode,
        keyword: fieldsValue.keyword ? fieldsValue.keyword : '',
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
      modalType: false,
    });
    this.setModalData();
    this.getArea('')
  };
  // 编辑modal 编辑事件
  handleEditClick = async (item) => {
    this.setState({
      modalVisible: true,
      modalData: item,
      modalType: true,
    });
    const res = await this.getPointSettingDetail(item);
    if (!res) {
      return
    }
    const { parentCode, code } = res.data;
    const provinceRes = await this.getAreas('')
    let province = provinceRes;
    const cityRes = await this.getAreas(parentCode)
    await this.forIn(province, parentCode, cityRes)
    this.setState({
      areaList: province,
      parentCode: [parentCode, code],
    }, () => {
      this.setModalData(res.data);
    });
  }
  getPointSettingDetail = (item) => {
    return this.props.dispatch({
      type: 'areaSetting/areaDetail',
      payload: {
        restParams: {
          code: item.code,
        },
      },
    })
  }
  // 获取商圈信息
  getAreas = (code) => {
    return this.props.dispatch({
      type: 'common/getProvinceCity',
      payload: {
        restParams: {
          code,
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
  // 设置modal 数据
  setModalData = (data) => {
    if (data) {
      this.form.setFieldsValue({
        parentCode: this.state.parentCode,
        name: data.district || undefined,
      });
    } else {
      this.form.setFieldsValue({
        parentCode: undefined,
        name: undefined,
      });
    }
  }
  // 验证
  verifyString = (rule, value, callback) => {
    if (value.length < 2) {
      callback('请填写完整的省市');
    } else {
      callback();
    }
  }
  // 新增modal确认事件 开始
  saveFormRef = (form) => {
    this.form = form;
  }
  // 编辑modal 确认事件
  handleAdd = () => {
    this.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        editModalConfirmLoading: true,
      });
      const parentCode = values.parentCode
      let url = 'areaSetting/addArea';
      let params = {
        ...values,
        parentCode: parentCode[parentCode.length - 1],
      };
      if (this.state.modalData.code) {
        url = 'areaSetting/updateArea';
        params = { ...params, code: this.state.modalData.code };
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
            editModalConfirmLoading: false,
            modalVisible: false,
            modalData: {},
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
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={9} sm={24}>
            <FormItem label="省市区商圈">
              {getFieldDecorator('provinceCityAreaTrade')(
                <Cascader
                  placeholder="请选择"
                  options={this.state.options}
                  loadData={this.getAreaSerach}
                  changeOnSelect
                />
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
      areaSetting: { list, page, unColumn },
      loading,
      log: { logList, logPage },
    } = this.props;
    const { selectedRows, modalVisible, editModalConfirmLoading, modalData, modalType, account, areaList } = this.state;
    let columns = [
      {
        title: '省',
        width: '30%',
        dataIndex: 'province',
        key: 'province'
      },
      {
        title: '市',
        dataIndex: 'city',
        key: 'city'
      },
      {
        title: '区',
        dataIndex: 'district',
        key: 'district'
      },
      {
        fixed: 'right',
        width: 150,
        title: '操作',
        render: (text, item) => (
          <Fragment>
            <a onClick={() => this.handleEditClick(item)}>编辑</a>
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
                scrollX={500}
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
          modalData={modalData}

          areaList={areaList}
          getArea={this.getArea}
          verifyString={this.verifyString}
        />
      </PageHeaderLayout>
    );
  }
}
