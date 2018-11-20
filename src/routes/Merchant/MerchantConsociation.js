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
  Popconfirm,
  Upload
} from 'antd';
import StandardTable from '../../components/StandardTable/index';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './MerchantConsociation.less';
import LogModal from '../../components/LogModal/index';
import {getAccountMenus} from "../../utils/authority";


const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(
  (props) => {
    const { sellerList, channelType, modalVisible, form, handleAdd, handleModalVisible, editModalConfirmLoading, modalType, handleUploadChange, handleUpload, selectChannel, handlePreview, handleCancel, fileList, previewImage, previewVisible, handleSellerName } = props;
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
        title={
          <div className="modalBox">
            <span className="leftSpan"></span>
            <span className="modalTitle">{!modalType ? '编辑合作商户' : '新建合作商户'}</span>
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
              {getFieldDecorator('merchantAccountName', {
                rules: [{ required: true, whitespace: true, message: '请选择商户' }],
              })(
                <Select
                  // labelInValue
                  showSearch
                  placeholder="请选择"
                  optionFilterProp="children"
                  onSelect={handleSellerName}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {sellerList.map(item => <Option key={item.id} value={item.merchantAccountId}>{item.merchantAccountName}</Option>)}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="选择渠道">
              {getFieldDecorator('channelName', {
                rules: [{ required: true, whitespace: true, message: '请选择渠道' }],
              })(
                <Select 
                  // labelInValue 
                  onChange={selectChannel} 
                  placeholder="选择渠道"
                >
                  <Option value="002001">淘宝</Option>
                  <Option value="002002">微信</Option>
                </Select>
              )}
            </FormItem>
            {
              channelType == '002001' ? (
                <div>
                  <FormItem {...formItemLayout} label="sellerId">
                    {getFieldDecorator('sellerId', {
                      rules: [{ required: true, whitespace: true, message: '请输入sellerId' }],
                    })(<Input placeholder="请输入sellerId" />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="商家名称">
                    {getFieldDecorator('merchantName', {
                      rules: [{ required: true, whitespace: true, message: '请输入商家名称' }],
                    })(<Input placeholder="请输入商家名称" />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="品牌名称">
                    {getFieldDecorator('brandName', {
                      rules: [{ required: true, whitespace: true, message: '请输入品牌名称' }],
                    })(<Input placeholder="请输入品牌名称" />)}
                  </FormItem>
                </div> 
              ) : ''
            }
            {
              channelType == '002002' ? (
                <div>
                  <FormItem {...formItemLayout} label="appId">
                    {getFieldDecorator('appId', {
                      rules: [{ required: true, whitespace: true, message: '请输入appId' }],
                    })(<Input placeholder="请输入appId" />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="商家名称">
                    {getFieldDecorator('merchantName', {
                      rules: [{ required: true, whitespace: true, message: '请输入商家名称' }],
                    })(<Input placeholder="请输入商家名称" />)}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="上传二维码"
                  >
                    {getFieldDecorator('upload', {
                      valuePropName: 'filelist',
                      rules: [{ required: true, whitespace: true, message: '请上传二维码' }],
                    })(
                      <div>
                        <Upload
                          customRequest={(params) => { handleUpload(params); }}
                          listType="picture-card"
                          fileList={fileList}
                          onPreview={handlePreview}
                          onChange={handleUploadChange}
                          accept="image/*">
                          {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                        <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                          <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                      </div>
                    )}
                  </FormItem>
                </div> 
              ) : ''
            }
            
        </Form>
        </div>
      </Modal>
    );
});
@connect(({ common, loading, merchantConsociation, log }) => ({
  common,
  merchantConsociation,
  loading: loading.models.merchantConsociation,
  log,
}))
@Form.create()

export default class MerchantConsociation extends PureComponent {
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
    sellerList: [],
    account: {},
    channelType: '',
    fileList: [],
    previewVisible: false,
    previewImage: '',
    addParams: {}
  };
  componentDidMount() {
    this.getLists();
    this.getAccountMenus(getAccountMenus())
    this.getMerchantsList()
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
      type: 'merchantConsociation/getMerchantSettingList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          keyword: this.state.keyword,
          code: this.state.channelId,
        },
      },
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
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      pageNo: 1,
      keyword: '',
      channelId: '',
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
  handleIsStopClick = (item) => {
    console.log('handleIsStopClick',item)
  }
  // 编辑modal 编辑事件
  handleEditClick = (item) => {
    this.setState({
      modalVisible: true,
      modalData: item,
      modalType: false,
    });
    this.props.dispatch({
      type: 'merchantConsociation/getMerchantSettingDetail',
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
        merchantCode: data.merchantCode || undefined,
        merchantName: data.merchantName || undefined,
        brandName: data.brandName || undefined,
        originFlag: data.originFlag || undefined,
        channelId: data.channelId || undefined,
        merchantAccountId: data.merchantAccountId || undefined,
        merchantAccountName: data.merchantAccountName || undefined,
        fileList: data.fileList || undefined,
        upload: data.wechatQrcodeUrl || undefined
      });
    } else {
      this.form.setFieldsValue({
        merchantCode: undefined,
        merchantName: undefined,
        brandName: undefined,
        originFlag: undefined,
        channelId: undefined,
        merchantAccountId: undefined,
        merchantAccountName: undefined,
        fileList: undefined,
        upload: data.wechatQrcodeUrl || undefined
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
      let url = 'merchantConsociation/saveMerchantSetting';
      let params = { ...values };
      if (this.state.modalData.id) {
        url = 'merchantConsociation/editMerchantSetting';
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
  // 商家列表（不分页）
  getMerchantsList = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'merchantConsociation/getMerchantsList',
      payload: {
        restParams: {
          channelId: ''
        }
      }
    }).then(res => {
      this.setState({
        sellerList: res
      })
    })
  }
  handleSellerName = (val) => {
    console.log(val)
    // this.setState({
    //   addParams: {
    //     merchantAccountName: val.key,
    //     merchantAccountId: val,label
    //   }
    // })
  }
  // 选泽渠道
  selectChannel = (val) => {
    console.log(val)
    this.setState({
      channelType: val
    })
  }


  // 上传图片
  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleUpload = ({ file, onError, onSuccess }) => {
    console.log(file)
    const { dispatch } = this.props;
    dispatch({
      type: 'merchantConsociation/upload',
      payload: {
        params: { file },
      },
    }).then((resp) => {
      if (resp && resp.code === 0) {
        if (resp.data.indexOf('png') > 0 || resp.data.indexOf('jpg') > 0 || resp.data.indexOf('jpeg') > 0 || resp.data.indexOf('png') > 0) {
          let fList = [{
            uid: -2,
            name: 'xxx.png',
            status: 'done',
            url: domain.url + resp.data,
            data: resp.data,
          }]
          this.setState({
            fileList: fList,
          });
        }
        console.log('resp', resp)
        onSuccess(resp, file);
        message.success('上传成功');
      }
    }).catch((e) => {
      onError(e);
    }).finally(() => {

    });
  }

  handleUploadChange = ({ fileList }) => this.setState({ fileList })


  renderAdvancedForm() {
    const { form } = this.props;
    const { sellerList } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={9} sm={24}>
            <FormItem>
              {getFieldDecorator('keyword')(<Input placeholder="请输入商户ID，商户名称，合作渠道，品牌名称，合作ID" />)}
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
      merchantConsociation: { list, page, unColumn },
      loading,
      log: { logList, logPage },
    } = this.props;
    const { channelType, sellerList, selectedRows, modalVisible, editModalConfirmLoading, modalType, account, fileList } = this.state;
    let columns = [
      
      {
        title: '商户ID',
        width: '17%',
        dataIndex: 'merchantAccountId',
        key: 'merchantAccountId'
      },
      {
        title: '商户名称',
        width: '17%',
        dataIndex: 'merchantAccountName',
        key: 'merchantAccountName'
      },
      {
        title: '商家名称',
        width: 200,
        dataIndex: 'merchantName',
        key: 'merchantName'
      },
      {
        title: '合作渠道',
        width: '17%',
        dataIndex: 'channelName',
        key: 'channelName'
      },
      {
        title: '合作ID',
        width: '17%',
        dataIndex: 'channelId',
        key: 'channelId'
      },
      {
        title: '品牌名称',
        dataIndex: 'brandName',
        key: 'brandName'
      },
      {
        fixed: 'right',
        width: 150,
        title: '操作',
        render: (text, item) => (
          <Fragment>
            <a onClick={() => this.handleEditClick(item)} style={{ display: !account.update ? 'none' : '' }}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="确定要暂停合作吗" onConfirm={() => this.handleIsStopClick(item)} okText="Yes" cancelText="No">
              <a >暂停合作</a>
            </Popconfirm>
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
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)} style={{ display: !account.add ? 'none' : '' }}>
                新建
              </Button>
            </div>
            <div style={{ display: !account.list ? 'none' : '' }}>
              <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={list}
              page={page}
              columns={columns}
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
          sellerList={sellerList}
          channelType={channelType}
          handleSellerName={this.handleSellerName}
          handleUploadChange={this.handleUploadChange}
          handleUpload={this.handleUpload}
          selectChannel={this.selectChannel}
          handleCancel={this.handleCancel}
          fileList={fileList}
          previewVisible={this.state.previewVisible}
          previewImage={this.state.previewImage}
          handlePreview={this.handlePreview}

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
