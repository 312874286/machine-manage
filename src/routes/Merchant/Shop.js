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
import styles from './Shop.less';
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
    const { modalVisible, form, handleAdd, handleModalVisible, editModalConfirmLoading, modalType, merchantLists, channelLists, getMerchant } = props;
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
            <span class="modalTitle">{modalType ? '编辑店铺' : '新建店铺'}</span>
          </div>
        }
        visible={modalVisible}
        onOk={handleAdd}
        onCancel={() => handleModalVisible()}
        confirmLoading={editModalConfirmLoading}
      >
        <div className="manageAppBox">
          <Form onSubmit={this.handleSearch}>
            <FormItem {...formItemLayout} label="合作渠道">
              {getFieldDecorator('channelId', {
                rules: [{ required: true, whitespace: true, message: '请选择合作渠道' }],
              })(
                <Select placeholder="请选择" onSelect={getMerchant}>
                  {channelLists.map((item) => {
                    return (
                      <Option value={item.code} key={item.code}>{item.name}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="所属商户">
              {getFieldDecorator('sellerId', {
                rules: [{ required: true, message: '请选择商户' }],
              })(
                <Select placeholder="请选择">
                  {merchantLists.map((item) => {
                    return (
                      <Option value={item.id} key={item.id}>{item.merchantName}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Shop ID">
              {getFieldDecorator('shopCode', {
                rules: [{ required: true,whitespace: true,  message: '请输入Shop ID' }],
              })(<Input placeholder="请输入Shop ID" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="店铺名称">
              {getFieldDecorator('shopName', {
                rules: [{ required: true, whitespace: true, message: '请输入店铺名称' }],
              })(<Input placeholder="请输入店铺名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="入会码">
              {getFieldDecorator('focusSessionKey', {
                rules: [{ required: false, whitespace: true, message: '请输入入会码' }],
              })(<Input placeholder="请输入入会码" />)}
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  });
@connect(({ common, loading, shop }) => ({
  common,
  shop,
  loading: loading.models.shop,
}))
@Form.create()
export default class shop extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    editModalConfirmLoading: false,
    pageNo: 1,
    keyword: '',
    code: '',
    modalData: {},
    modalType: true,
    merchantLists: [],
    channelLists: [],
    account: {}
  };
  componentDidMount() {
    this.getLists();
    // this.getChannelList();
    this.getBaseDictLists()
    this.getAccountMenus(getAccountMenus())
  }
  getAccountMenus = (setAccountMenusList) => {
    if (setAccountMenusList) {
      const pointSettingMenu = setAccountMenusList.filter((item) => item.path === 'project')[0]
        .children.filter((item) => item.path === 'shop')
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
      type: 'shop/getShopSettingList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          keyword: this.state.keyword,
          code: this.state.code,
        },
      },
    });
  }
  getChannelList = () => {
    this.props.dispatch({
      type: 'shop/getChannelList',
      payload: {
        restParams: {
        },
      },
    }).then((res) => {
      this.setState({
        channelLists: res,
      });
    });
  }
  getBaseDictLists = () => {
    this.props.dispatch({
      type: 'shop/getBaseDict',
      payload: {
        params: {
          type: '002',
        },
      },
    }).then((res) => {
      if (res && res.code === 0) {
        this.setState({
          channelLists: res.data.channel,
        });
      }
    });
  }
  getMerchant = (value) => {
    console.log('value', value)
    this.getMerchantsList(value)
  }
  getMerchantsList = (channelId) => {
    this.props.dispatch({
      type: 'shop/getMerchantsList',
      payload: {
        restParams: {
          channelId,
        },
      },
    }).then((res) => {
      this.setState({
        merchantLists: res,
      });
    });
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
    const { form, dispatch } = this.props;
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
      this.setState({
        pageNo: 1,
        keyword: fieldsValue.keyword ? fieldsValue.keyword : '',
        code: fieldsValue.code ? fieldsValue.code : '',
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
  };
  // 删除modal 删除事件
  handleDelClick = (item) => {
    this.setState({
      editModalConfirmLoading: true,
    });
    if (item) {
      const params = { id: item.id, status: item.status === '1' ? 0 : 1  };
      this.props.dispatch({
        type: 'shop/alterStatus',
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
      modalType: true,
    });
    this.props.dispatch({
      type: 'shop/getShopSettingDetail',
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
        channelId: data.channelId || undefined,
        sellerId: data.sellerId || undefined,
        shopCode: data.shopCode || undefined,
        shopName: data.shopName || undefined,
        focusSessionKey: data.focusSessionKey || undefined,
      });
    } else {
      this.form.setFieldsValue({
        channelId: undefined,
        sellerId: undefined,
        shopCode: undefined,
        shopName: undefined,
        focusSessionKey: undefined,
      });
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
      let url = 'shop/saveShopSetting';
      let params = { ...values };
      if (this.state.modalData.id) {
        url = 'shop/editShopSetting';
        params = { ...values, id: this.state.modalData.id };
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
    const { getFieldDecorator } = form;
    const { merchantLists } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={9} sm={24}>
            <FormItem>
              {getFieldDecorator('keyword')(<Input placeholder="请输入shopID、店铺名称" />)}
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
    const { shop: { list, page, unColumn }, loading } = this.props;
    const { selectedRows, modalVisible, editModalConfirmLoading, modalType, merchantLists, account, channelLists } = this.state;
    let columns = [
      {
        title: 'Shop ID',
        width: '20%',
        dataIndex: 'shopCode',
        key: 'shopCode'
      },
      {
        title: '店铺名称',
        width: '20%',
        dataIndex: 'shopName',
        key: 'shopName'
      },
      {
        title: '所属商家',
        width: '20%',
        dataIndex: 'sellerId',
        key: 'sellerId'
      },
      {
        title: '合作渠道',
        dataIndex: 'channelName',
        key: 'channelName'
      },
      {
        fixed: 'right',
        width: 150,
        title: '操作',
        render: (text, item) => (
          <Fragment>
            <a onClick={() => this.handleEditClick(item)} style={{ display: !account.update ? 'none' : ''}}>编辑</a>
            <Divider type="vertical" />
            {/*<Popconfirm title="确定要删除吗" onConfirm={() => this.handleDelClick(item)} okText="Yes" cancelText="No">*/}
              <a className={styles.delete} onClick={() => this.handleDelClick(item)}>{parseInt(item.status) === 0 ? '启用' : '停用'}</a>
            {/*</Popconfirm>*/}
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
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)} style={{ display: !account.add ? 'none' : ''}}>
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
                scrollX={700}
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
          merchantLists={merchantLists}
          channelLists={channelLists}
          getMerchant={this.getMerchant}
        />
      </PageHeaderLayout>
    );
  }
}
