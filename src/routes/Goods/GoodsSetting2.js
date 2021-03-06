import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Menu,
  DatePicker,
  Modal,
  Divider,
  Popconfirm,
  Upload,
  Icon,
  InputNumber
} from 'antd';
import StandardTable from '../../components/StandardTable/index';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './GoodsSetting.less';
import LogModal from '../../components/LogModal/index';
import moment from "moment/moment";
import {message} from "antd/lib/index";
import domain from "../../common/config/domain"


const FormItem = Form.Item;
const { TextArea } = Input
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const RangePicker = DatePicker.RangePicker;

const CreateForm = Form.create()(
  (props) => {
    const { modalVisible, form, handleAdd, handleModalVisible, editModalConfirmLoading, modalType,
      merchantLists, previewImage, handleUpload, previewVisible, fileList, handlePreview,
      handleChange, handleCancel, normFile, onSelect, shopsLists } = props;
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
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <Modal
        title={modalType ? '编辑商品' : '新建商品'}
        visible={modalVisible}
        onOk={handleAdd}
        onCancel={() => handleModalVisible()}
        confirmLoading={editModalConfirmLoading}
      >
        <Form onSubmit={this.handleSearch}>
          <FormItem {...formItemLayout} label="淘宝商品ID">
            {getFieldDecorator('code', {
              rules: [{ required: true, whitespace: true, message: '请输入淘宝商品ID' }],
            })(modalType ? (<Input placeholder="请输入商品编码" disabled />) : (<Input placeholder="请输入淘宝商品ID" />))}
          </FormItem>
          <FormItem {...formItemLayout} label="商品名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, whitespace: true, message: '请输入商品名称' }],
            })(<Input placeholder="请输入商品名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="图片缩略图">
            {getFieldDecorator('img', {
              rules: [{ required: false, message: '请传照片' }],
              valuePropName: 'filelist',
            })(
              <div className="clearfix">
                <Upload
                  customRequest={(params) => { handleUpload(params, 2); }}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  accept="image/gif, image/jpeg, image/png"
                >
                  {fileList.length > 1 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </div>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="商品价格">
            {getFieldDecorator('price', {
              rules: [{ required: false, message: '请输入商品价格' }],
            })(<InputNumber placeholder="请输入商品价格" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="选择商户">
            {getFieldDecorator('sellerId', {
              rules: [{ required: true, message: '请选择商户' }],
            })(
              <Select placeholder="请选择" onSelect={onSelect}>
                {merchantLists.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>{item.merchantName}</Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="选择店铺">
            {getFieldDecorator('shopId', {
              rules: [{ required: true, message: '请选择店铺' }],
            })(
              <Select placeholder="请选择">
                {shopsLists.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>{item.shopName}</Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="备注描述">
            {getFieldDecorator('remark')(<TextArea placeholder="请输入备注描述" autosize={{ minRows: 2, maxRows: 6 }} />)}
          </FormItem>
        </Form>
      </Modal>
    );
});
@connect(({ common, loading, goodsSetting, log }) => ({
  common,
  goodsSetting,
  loading: loading.models.rule,
  log,
}))
@Form.create()
export default class goodsSettingList extends PureComponent {
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
    logModalVisible: false,
    logModalLoading: false,
    logId: '',
    logModalPageNo: 1,
    modalType: true,
    merchantLists: [],
    previewVisible: false,
    previewImage: '',
    fileList: [],
    shopsLists: [],
  };
  componentDidMount() {
    this.getLists();
  }
  // 获取列表
  getLists = () => {
    this.props.dispatch({
      type: 'goodsSetting/getGoodsSettingList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          keyword: this.state.keyword,
          code: this.state.code,
        },
      },
    });
    this.props.dispatch({
      type: 'goodsSetting/getMerchantsList',
      payload: {
        restParams: {},
      },
    }).then((res) => {
      this.setState({
        merchantLists: res,
      });
    });
  }
  onSelect = (value, option) => {
    this.getShopList(value)
  }
  getShopList = (value) => {
    this.props.dispatch({
      type: 'activitySetting/getShopsList',
      payload: {
        restParams: {
          sellerId: value,
        },
      },
    }).then((res) => {
      this.setState({
        shopsLists: res,
      });
    });
  }
  // 上传图片
  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = (info) => {
    console.log('222222')
    let fileList = info.fileList;
    fileList = fileList.slice(-1);
    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
  }
  handleUpload = ({ file, onError, onSuccess }, fileType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/upload',
      payload: {
        params: { file },
        restParams: { fileType },
      },
    }).then((resp) => {
      if (resp && resp.code === 0) {
        // console.log('resp', resp)
        this.setState({
          fileList: [{
            uid: -2,
            name: 'xxx.png',
            status: 'done',
            url: domain.url + resp.data,
            data: resp.data,
          }],
        });
        onSuccess(resp, file);
        message.success('上传成功');
      }
    }).catch((e) => {
      onError(e);
    }).finally(() => {
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
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
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
      const params = { id: item.id };
      this.props.dispatch({
        type: 'goodsSetting/delGoodsSetting',
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
  // 编辑modal 编辑事件
  handleEditClick = (item) => {
    this.setState({
      modalVisible: true,
      modalData: item,
      modalType: true,
    });
    this.props.dispatch({
      type: 'goodsSetting/getGoodsSettingDetail',
      payload: {
        restParams: {
          id: item.id,
        },
      },
    }).then((res) => {
      this.getShopList(res.sellerId)
      this.setModalData(res);
    });
  }
  // 设置modal 数据
  setModalData = (data) => {
    // if (data) {
    //   this.setState({
    //     fileList: [{
    //       uid: -1,
    //       name: 'xxx.png',
    //       status: 'done',
    //       url: data.img,
    //     }],
    //   });
    //   this.form.setFieldsValue({
    //     ...data,
    //   });
    // } else {
    //   this.form.resetFields();
    //   this.setState({
    //     fileList: [],
    //   });
    // }
    if (data) {
      this.setState({
        fileList: [{
          uid: -1,
          name: 'xxx.png',
          status: 'done',
          url: data.img,
        }],
      });
      this.form.setFieldsValue({
        name: data.name || '',
        code: data.code || undefined,
        sellerId: data.sellerId || undefined,
        price: data.price || undefined,
        remark: data.remark || undefined,
        img: data.img || undefined,
        shopId: data.shopId || undefined,
      });
    } else {
      this.setState({
        fileList: [],
      });
      this.form.setFieldsValue({
        name: undefined,
        code: undefined,
        price: undefined,
        sellerId: undefined,
        shopId: undefined,
        remark: undefined,
        img: undefined,
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
      let params = {
        ...fieldsValue,
      };
      this.setState({
        editModalConfirmLoading: true,
        modalData: {},
      });
      let messageTxt = '添加'
      let url = 'goodsSetting/saveGoodsSetting';
      if (this.state.modalData.id) {
        url = 'goodsSetting/editGoodsSetting';
        messageTxt = '编辑'
        params = { ...params, id: this.state.modalData.id };
      }
      console.log('this.state.fileList', this.state.fileList)
      if (this.state.fileList.length > 0) {
        params = { ...params, img: this.state.fileList[0].data };
      }
      this.props.dispatch({
        type: url,
        payload: {
          params,
        },
      }).then((res) => {
        if (res && res.code === 0) {
          // message.success( messageTxt + '成功');
          this.setState({
            code: '',
            getDataStartDay: this.state.startTime,
            getDataEndDay: this.state.endTime,
          }, () => {
            this.getLists();
          })
          this.setState({
            editModalConfirmLoading: false,
            modalVisible: false,
          });
        }
        // else {
        //   message.error(res ? res.msg : messageTxt + '失败');
        // }
        this.setState({
          editModalConfirmLoading: false,
          // modalVisible: false,
        });
      });
    });
  }
  // 新增modal确认事件 结束
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
    const { merchantLists } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="选择商户">
              {getFieldDecorator('code')(
                <Select placeholder="请选择">
                  {merchantLists.map((item) => {
                    return (
                      <Option value={item.id} key={item.id}>{item.merchantName}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={9} sm={24}>
            <FormItem>
              {getFieldDecorator('keyword')(<Input placeholder="请输入商品编码、商品名称" />)}
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
    const { goodsSetting: { list, page }, loading, log: { logList, logPage }, } = this.props;
    const { selectedRows, modalVisible, editModalConfirmLoading, modalType, merchantLists, shopsLists } = this.state;
    const columns = [
      {
        title: '淘宝商品ID',
        width: 150,
        dataIndex: 'code',
      },
      {
        title: '商品名称',
        width: 150,
        dataIndex: 'name',
      },
      {
        title: '所属商户',
        width: 150,
        dataIndex: 'sellerId',
      },
      {
        title: '所属店铺',
        width: 150,
        dataIndex: 'shopId',
      },
      {
        title: '图片缩略图',
        width: 150,
        dataIndex: 'img',
        render(val) {
          return (
            <a target="_blank" href={val}>
              <img src={val}  style={{ width: '80px' }} />
            </a>
          );
        },
      },
      {
        title: '商品价格',
        width: 100,
        dataIndex: 'price',
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
      {
        fixed: 'right',
        width: 150,
        title: '操作',
        render: (text, item) => (
          <Fragment>
            <a onClick={() => this.handleEditClick(item)}>编辑</a>
            <Divider type="vertical" />
            {/*<a onClick={() => this.handleLogClick(item)}>日志</a>*/}
            {/*<Divider type="vertical" />*/}
            <Popconfirm title="确定要删除吗" onConfirm={() => this.handleDelClick(item)} okText="Yes" cancelText="No">
              <a className={styles.delete}>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
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
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={list}
              page={page}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              scrollX={1100}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          ref={this.saveFormRef}
          modalVisible={modalVisible}
          editModalConfirmLoading={editModalConfirmLoading}
          modalType={modalType}
          merchantLists={merchantLists}
          shopsLists={shopsLists}
          previewVisible={this.state.previewVisible}
          previewImage={this.state.previewImage}
          fileList={this.state.fileList}
          handlePreview={this.handlePreview}
          handleChange={this.handleChange}
          handleCancel={this.handleCancel}
          handleUpload={this.handleUpload}
          normFile={this.normFile}
          onSelect={this.onSelect}
        />
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
