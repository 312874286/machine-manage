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

function beforeUpload(file) {
  // const isJPG = file.type === 'image/*' || file.type === 'video/*';
  // if (!isJPG) {
  //   message.error('仅支持JPG/PNG格式图片!');
  // }
  const isLt2M = file.size / 1024 < 10000;
  if (!isLt2M) {
    message.error('图片大小必须小于10MB');
  }
  return isLt2M;
}

const CreateForm = Form.create()(
  (props) => {
    const { modalVisible, form, handleAdd, handleModalVisible, editModalConfirmLoading, modalType,
      merchantLists, previewImage, handleUpload, previewVisible, fileList, handlePreview,
      handleChange, handleCancel, normFile, onSelect, shopsLists, bannerfileList, videoUrl, bannerHandleChange, handleUploadBanner } = props;
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
          <div class="modalBox">
            <span class="leftSpan"></span>
            <span class="modalTitle">{modalType ? '编辑商品' : '新建商品'}</span>
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
          <FormItem {...formItemLayout} label="shop ID">
            {getFieldDecorator('code', {
              rules: [{ required: true, whitespace: true, message: '请输入shop ID' }],
            })(modalType ? (<Input placeholder="请输入淘宝商品ID" disabled />) : (<Input placeholder="请输入shop ID" />))}
          </FormItem>
          <FormItem {...formItemLayout} label="商品名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, whitespace: true, message: '请输入商品名称' }],
            })(<Input placeholder="请输入商品名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="规格描述">
            {getFieldDecorator('specRemark', {
              rules: [{ required: false, whitespace: true, message: '请输入规格描述' }],
            })(<Input placeholder="请输入规格描述" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="商品图片">
            {getFieldDecorator('img', {
              rules: [{ required: false, message: '请传照片' }],
              valuePropName: 'filelist',
            })(
              <div className="clearfix">
                <Upload
                  customRequest={(params) => { handleUpload(params, 2, 'fileList'); }}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  accept="image/*">
                  {fileList.length > 1 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </div>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="商品banner">
            {getFieldDecorator('banner', {
              rules: [{ required: false, message: '请传照片' }],
              valuePropName: 'filelist',
            })(
              <div className="clearfix">
                  <Upload
                    customRequest={(params) => { handleUploadBanner(params, 2, 'bannerfileList'); }}
                    listType="picture-card"
                    fileList={bannerfileList}
                    onPreview={handlePreview}
                    beforeUpload={beforeUpload}
                    onChange={bannerHandleChange}
                    accept="image/*, video/*"
                  >
                    {bannerfileList.length > 1 ? null : uploadButton}
                  </Upload>
                  <video id="videos" controls="controls"
                         style={{ objectFit: 'fill', display:  videoUrl.url ? '' : 'none', maxWidth: '600px', maxHeight: '500px'}}
                         playsInline=""
                         webkit-playsinline=""
                         x5-video-player-fullscreen="true"
                         x5-video-player-type="h5"
                         x5-video-orientation="portraint"
                         src={videoUrl.url}>
                    Your browser does not support the Video tag.
                  </video>
                  <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%', display:  bannerfileList.length > 0 ? '' : 'none'}} src={previewImage} />
                  </Modal>
                </div>
                )}
          </FormItem>
          <FormItem {...formItemLayout} label="商品价格">
            {getFieldDecorator('price', {
              rules: [{ required: false, message: '请输入商品价格' }],
            })(<InputNumber placeholder="请输入商品价格" />)}
          </FormItem>
            <FormItem {...formItemLayout} label="商品数量">
              {getFieldDecorator('number', {
                rules: [{ required: true, message: '请输入商品数量' }],
              })(<InputNumber placeholder="请输入商品数量" />)}
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
        </div>
      </Modal>
    );
});
const WatchForm = Form.create()(
  (props) => {
    const { watchModalVisible, modalData, handleWatchModalVisible,
      previewImage, previewVisible, fileList, handlePreview,
      handleChange, handleCancel, bannerfileList, videoUrl, bannerHandleChange, previewBannerVisible, previewBannerImage
    } = props;
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
            <span class="modalTitle">查看商品</span>
          </div>
        }
        visible={watchModalVisible}
        onCancel={() => handleWatchModalVisible()}
        footer={null}
        width={800}>
        <div className="manageAppBox">
          <Form onSubmit={this.handleSearch}>
            <FormItem {...formItemLayout} label="shop ID">
              <span>{modalData.code}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="商品名称">
              <span>{modalData.name}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="规格描述">
              <span>{modalData.specRemark}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="商品图片">
              <div>
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                >
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </div>
            </FormItem>
            <FormItem {...formItemLayout} label="商品banner">
              <div className="clearfix">
                <Upload
                  listType="picture-card"
                  fileList={bannerfileList}
                  onPreview={handlePreview}
                  onChange={bannerHandleChange}>
                </Upload>
                <Modal visible={previewBannerVisible} footer={null} onCancel={handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewBannerImage} />
                </Modal>
                <video id="videos" controls="controls"
                       style={{ objectFit: 'fill', display:  videoUrl.url ? '' : 'none', maxWidth: '600px', maxHeight: '500px' }}
                       playsInline=""
                       webkit-playsinline=""
                       x5-video-player-fullscreen="true"
                       x5-video-player-type="h5"
                       x5-video-orientation="portraint"
                       src={videoUrl.url}>
                  Your browser does not support the Video tag.
                </video>
              </div>
            </FormItem>
            <FormItem {...formItemLayout} label="所属商户">
              <span>{modalData.sellerName}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="所属店铺">
              <span>{modalData.shop}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="商品价格">
              <span>{modalData.price}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="商品数量">
              <span>{modalData.number}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="商品详情">
              <span>{modalData.remark}</span>
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  });
@connect(({ common, loading, goodsSetting, log }) => ({
  common,
  goodsSetting,
  loading: loading.models.goodsSetting,
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
    shopsLists: [],

    previewVisible: false,
    previewImage: '',
    fileList: [],
    bannerfileList: [],
    videoUrl: {}
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
  handleBannerPreview = (file) => {
    this.setState({
      previewBannerImage: file.url || file.thumbUrl,
      previewBannerVisible: true,
    });
  }
  // handleChange = (info) => {
  //   console.log('222222')
  //   let fileList = info.fileList;
  //   fileList = fileList.slice(-1);
  //   fileList = fileList.map((file) => {
  //     if (file.response) {
  //       file.url = file.response.url;
  //     }
  //     return file;
  //   });
  // }
  handleUpload = ({ file, onError, onSuccess }, fileType, flag) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/upload',
      payload: {
        params: { file },
        restParams: { fileType, type: 'goods'  },
      },
    }).then((resp) => {
      if (resp && resp.code === 0) {
        // console.log('resp', resp)
        if (this.imgFlag(resp.data)) {
          let fList = [{
            uid: -2,
            name: 'xxx.png',
            status: 'done',
            url: domain.url + resp.data,
            data: resp.data,
          }]
          if (flag === 'fileList') {
            this.setState({
              fileList: fList,
            });
          }
          if (flag === 'bannerfileList') {
            console.log('flag', flag)
            this.setState({
              bannerfileList: fList,
            });
          }
        } else {
          this.setState({
            videoUrl: {
              url: domain.url + resp.data,
              data: resp.data
            },
          })
        }
        onSuccess(resp, file);
        message.success('上传成功');
      }
    }).catch((e) => {
      onError(e);
    }).finally(() => {
    });
  }
  handleUploadBanner = ({ file, onError, onSuccess }, fileType, flag) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/upload',
      payload: {
        params: { file },
        restParams: { fileType, type: 'goods'  },
      },
    }).then((resp) => {
      if (resp && resp.code === 0) {
        // console.log('resp', resp)
        if (resp.data.indexOf('png') > 0 || resp.data.indexOf('jpg') > 0 || resp.data.indexOf('jpeg') > 0 || resp.data.indexOf('png') > 0) {
          let fList = [{
            uid: -2,
            name: 'xxx.png',
            status: 'done',
            url: domain.url + resp.data,
            data: resp.data,
          }]
          this.setState({
            bannerfileList: fList,
            videoUrl: {}
          });
        } else {
          this.setState({
            videoUrl: {
              url: domain.url + resp.data,
              data: resp.data
            },
            bannerfileList: []
          })
        }
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
      let flist, videoUrl
      // if (data.banner) {
      //   if (this.imgFlag(data.banner)) {
      //     flist = [{
      //       uid: -3,
      //       name: 'xxx.png',
      //       status: 'done',
      //       url: data.banner,
      //     }]
      //   } else {
      //     flist = []
      //     videoUrl = {
      //       url: data.banner
      //     }
      //   }
      // }
      if (data.banner) {
        if (this.imgFlag(data.banner)) {
          flist = [{
            uid: -2,
            name: 'xxx.png',
            status: 'done',
            url: data.banner,
          }]
          videoUrl = {}
        } else if (this.videoFlag(data.banner)){
          videoUrl = {
            url: data.banner
          }
          flist = []
        } else {
          videoUrl = {}
          flist = []
        }
      }
      this.setState({
        fileList: [{
          uid: -1,
          name: 'xxx.png',
          status: 'done',
          url: data.img,
        }],
        bannerfileList: flist,
        videoUrl,
      });
      this.form.setFieldsValue({
        name: data.name || '',
        code: data.code || undefined,
        sellerId: data.sellerId || undefined,
        price: data.price || undefined,
        remark: data.remark || undefined,
        img: data.img || undefined,
        shopId: data.shopId || undefined,
        specRemark: data.specRemark || undefined,
      });
    } else {
      this.setState({
        fileList: [],
        bannerfileList: [],
        videoUrl: {}
      });
      this.form.setFieldsValue({
        name: undefined,
        code: undefined,
        price: undefined,
        sellerId: undefined,
        shopId: undefined,
        remark: undefined,
        img: undefined,
        specRemark: undefined,
      });
    }
  }
  // 新增modal确认事件 开始
  saveFormRef = (form) => {
    this.form = form;
  }
  // 判断是否为图片
  imgFlag = (resp) => {
    if (resp.indexOf('png') > 0 || resp.indexOf('jpg') > 0 || resp.indexOf('jpeg') > 0 || resp.indexOf('png') > 0) {
      return true
    } else {
      return false
    }
  }
  // 判断是否为视频
  videoFlag = (resp) => {
    if (resp.indexOf('mp4') > 0 || resp.indexOf('rmvb') > 0 || resp.indexOf('avi') > 0 || resp.indexOf('ts') > 0) {
      return true
    } else {
      return false
    }
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
      });
      let messageTxt = '添加'
      let url = 'goodsSetting/saveGoodsSetting';
      if (this.state.modalData.id) {
        url = 'goodsSetting/editGoodsSetting';
        messageTxt = '编辑'
        params = { ...params, id: this.state.modalData.id };
      }
      if (this.state.fileList.length > 0) {
        params = { ...params, img: this.state.fileList[0].data };
      }
      if (this.state.bannerfileList.length > 0) {
        params = { ...params, banner: this.state.bannerfileList[0].data };
      }
      if (this.state.videoUrl.data) {
        params = { ...params, banner: this.state.videoUrl.data };
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
            modalData: {},
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
  handleWatchClick = (item) => {
    this.setState({
      modalVisible: false,
      watchModalVisible: true,
      modalType: 'watch',
    });
    this.props.dispatch({
      type: 'goodsSetting/getGoodsSettingDetail',
      payload: {
        restParams: {
          id: item.id,
        },
      },
    }).then((resp) => {
      let fList
      if (resp.img) {
        fList = [{
          uid: -2,
          name: 'xxx.png',
          status: 'done',
          url: resp.img,
        }]
        this.setState({
          fileList: fList,
        });
      }
      if (resp.banner) {
        if (this.imgFlag(resp.banner)) {
          fList = [{
            uid: -2,
            name: 'xxx.png',
            status: 'done',
            url: resp.banner,
          }]
          this.setState({
            bannerfileList: fList,
            videoUrl: {}
          });
        } else if (this.videoFlag(resp.banner)) {
          this.setState({
            videoUrl: {
              url: resp.banner
            },
            bannerfileList: []
          });
        } else {
          this.setState({
            videoUrl: {},
            bannerfileList: []
          });
        }
      }
      this.setState({
        modalData: resp,
      });
    });
  }
  // 查看
  handleWatchModalVisible = (flag) => {
    this.setState({
      watchModalVisible: !!flag,
      modalData: {},
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
  handleCancel = () => this.setState({ previewVisible: false })
  handlePreview = (file) => {
    console.log('file', file)
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => this.setState({ fileList })
  bannerHandleChange = ({ fileList }) => this.setState({ bannerfileList: fileList })
  render() {
    const { goodsSetting: { list, page }, loading, log: { logList, logPage }, } = this.props;
    const { selectedRows, modalVisible, editModalConfirmLoading, modalType, merchantLists, shopsLists } = this.state;
    const { previewVisible, previewImage, fileList } = this.state
    const columns = [
      {
        title: 'shop ID',
        width: '10%',
        dataIndex: 'code',
      },
      {
        title: '商品名称',
        width: '8%',
        dataIndex: 'name',
      },
      {
        title: '规格描述',
        width: '8%',
        dataIndex: 'specRemark',
      },
      {
        title: '所属商户',
        width: '8%',
        dataIndex: 'sellerId',
      },
      {
        title: '所属店铺',
        width: '15%',
        dataIndex: 'shopId',
      },
      {
        title: '图片缩略图',
        width: 150,
        dataIndex: 'img',
        render: (text, item) => (
          (item.img.length > 0) ? (
            <div style={{ height: '68px', display: 'flex', alignItems: 'center', overflow: 'hidden' }} id="look">
              <Upload
                // action="//jsonplaceholder.typicode.com/posts/"
                listType="picture-card"
                fileList={[{
                  uid: item.code,
                  name: item.name,
                  status: 'done',
                  url: item.img}]}
                onPreview={this.handlePreview}
                onChange={this.handleChange}
              >
              </Upload>
              <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </div>
          ) : (
            null
          )

        )
      },
      {
        title: '商品价格',
        width: '10%',
        dataIndex: 'price',
      },
      {
        title: '商品数量',
        width: '10%',
        dataIndex: 'number',
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
            <a onClick={() => this.handleWatchClick(item)}>查看</a>
            <Divider type="vertical" />
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
        <div>
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
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={list}
                page={page}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                scrollX={1200}
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
            bannerfileList={this.state.bannerfileList}
            videoUrl={this.state.videoUrl}
            bannerHandleChange={this.bannerHandleChange}
            handleUploadBanner={this.handleUploadBanner}
          />
          <WatchForm
            modalData={this.state.modalData}
            watchModalVisible={this.state.watchModalVisible}
            handleWatchModalVisible={this.handleWatchModalVisible}
            bannerfileList={this.state.bannerfileList}
            videoUrl={this.state.videoUrl}
            bannerHandleChange={this.bannerHandleChange}
            // handleUploadBanner={this.handleUploadBanner}
            previewBannerVisible={this.state.previewBannerVisible}
            previewBannerImage={this.state.previewBannerImage}
            previewVisible={this.state.previewVisible}
            previewImage={this.state.previewImage}
            fileList={this.state.fileList}
            handlePreview={this.handlePreview}
            handleBannerPreview={this.handleBannerPreview}
            handleChange={this.handleChange}
            handleCancel={this.handleCancel}
          />
          <LogModal
            data={logList}
            page={logPage}
            loding={this.state.logModalLoading}
            logVisible={this.state.logModalVisible}
            logHandleCancel={this.logModalHandleCancel}
            logModalhandleTableChange={this.logModalhandleTableChange}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
