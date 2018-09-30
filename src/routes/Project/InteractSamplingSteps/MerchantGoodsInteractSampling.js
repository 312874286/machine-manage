import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Select,
  Input,
  DatePicker,
  Steps,
  Table, Badge, Menu, Dropdown, Icon, Divider, Modal, Upload, InputNumber, Checkbox
} from 'antd';
import StandardTable from '../../../components/StandardTable/index';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './MerchantGoodsInteractSampling.less';
import {getAccountMenus} from "../../../utils/authority";
import {message, Radio} from "antd/lib/index";
import domain from "../../../common/config/domain";

const { Option } = Select;
const RadioGroup = Radio.Group;
const Step = Steps.Step;
const FormItem = Form.Item;
const { TextArea } = Input
const menu = (
  <Menu>
    <Menu.Item>
      Action 1
    </Menu.Item>
    <Menu.Item>
      Action 2
    </Menu.Item>
  </Menu>
);
// , {id: 1, name: '优惠券'}
const goodType = [{id: 0, name: '商品'}]
// 新建商户
const CreateMerchantForm = Form.create()(
  (props) => {
    const { modalVisible, form, handleAdd,
      handleModalVisible, editModalConfirmLoading, modalType,
      channelLists, saveAddShop, merchants } = props;
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
    const columns = [
      { title: '已添加的商家名称', dataIndex: 'merchantName', key: 'merchantName', width: '100%' },
    ];
    return (
      <Modal
        title={
          <div class="modalBox">
            <span class="leftSpan"></span>
            <span class="modalTitle">{!modalType ? '编辑商户' : '新建商户'}</span>
          </div>
        }
        visible={modalVisible}
        // onOk={handleAdd}
        onCancel={() => handleModalVisible()}
        confirmLoading={editModalConfirmLoading}
        footer={null}>
        <div className="manageAppBox">
          <Table
            rowKey={record => record.id}
            columns={columns}
            dataSource={merchants}
            pagination={false}
            scroll={{ y: 100}}
          />
          <Form onSubmit={this.handleSearch}>
            <FormItem {...formItemLayout} label="所属渠道">
              {getFieldDecorator('channelId', {
                rules: [{ required: true, whitespace: true, message: '请选择渠道' }],
              })(
                <Select placeholder="请选择渠道">
                  {channelLists.map((item) => {
                    return (
                      <Option value={item.id} key={item.id}>{item.channelName}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="sellerID">
              {getFieldDecorator('merchantCode', {
                rules: [{ required: true, whitespace: true, message: '请输入sellerID' }],
              })(<Input placeholder="请输入商户编码" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="商户名称">
              {getFieldDecorator('merchantName', {
                rules: [{ required: true, whitespace: true, message: '请输入商户名称' }],
              })(<Input placeholder="请输入商户名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="品牌名称">
              {getFieldDecorator('brandName', {
                rules: [{ required: false, whitespace: true, message: '请输入品牌名称' }],
              })(<Input placeholder="请输入品牌名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} style={{ display: modalType ? '' : 'none'}}>
              <Button style={{ width: '120px', marginRight: '10px' }}
                      onClick={() => handleAdd(0)}>继续添加商家</Button>
              <Button style={{ width: '120px' }} type="Default"  type="primary"
                      onClick={() => saveAddShop(1)}>保存并添加店铺</Button>
            </FormItem>
            <FormItem {...formItemLayout} style={{ display: modalType ? 'none' : ''}}>
              <Button style={{ width: '120px', marginRight: '10px' }}
                      onClick={() => handleModalVisible()}>取消</Button>
              <Button style={{ width: '120px' }} type="Default"  type="primary"
                      onClick={() => handleAdd(1)}>保存</Button>
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  });
// 新建店铺
const CreateShopsForm = Form.create()(
  (props) => {
    const { modalVisible, form, handleAdd,
      handleModalVisible, editModalConfirmLoading,
      modalType, merchantLists, saveAddGoods,
      handleChange, sessionKey, RadioChange, mustIsVip, currentShopsData} = props;
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
    const columns = [
      { title: '已添加的商家名称', dataIndex: 'merchantName', key: 'merchantName', width: '50%' },
      { title: '店铺名称', dataIndex: 'shopName', key: 'shopName', width: '50%' },
    ];
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
        footer={null}>
        <div className="manageAppBox">
          <Table
            rowKey={record => record.id}
            columns={columns}
            dataSource={currentShopsData}
            pagination={false}
            scroll={{ y: 100}}
          />
          <Form onSubmit={this.handleSearch}>
            <FormItem {...formItemLayout} label="选择商户">
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
            <FormItem {...formItemLayout} label="是否入会">
              {getFieldDecorator('isVip', {
                rules: [{ required: true, message: '' }],
                initialValue: 0,
              })(
                <RadioGroup onChange={RadioChange}>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="入会码">
              <Col span={14}>
                <FormItem>
                  {getFieldDecorator('sessionKey', {
                    // rules: [{ required: sessionKey, whitespace: true, message: '请输入入会码' }],
                  })
                  (<Input
                    placeholder="请输入入会码"
                    disabled={!sessionKey}
                  />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <Checkbox
                    disabled={!sessionKey}
                    checked={mustIsVip}
                    onChange={handleChange}>
                    强制入会
                  </Checkbox>
                </FormItem>
              </Col>
            </FormItem>
            <FormItem {...formItemLayout} style={{ display: modalType ? 'none' : ''}}>
              <Button style={{ width: '120px', marginRight: '10px' }}
                      onClick={() => handleAdd(0)}>继续添加店铺</Button>
              <Button style={{ width: '120px' }} type="Default"  type="primary"
                      onClick={() => saveAddGoods()}>保存并添加商品</Button>
            </FormItem>
            <FormItem {...formItemLayout} style={{ display: modalType ? '' : 'none'}}>
              <Button style={{ width: '120px', marginRight: '10px' }}
                      onClick={() => handleModalVisible()}>取消</Button>
              <Button style={{ width: '120px' }} type="Default"  type="primary"
                      onClick={() => handleAdd(1)}>保存</Button>
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  });
// 新建商品
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

const CreateGoodsForm = Form.create()(
  (props) => {
    const { modalVisible, form, handleAdd, handleModalVisible, editModalConfirmLoading, modalType,
      merchantLists, previewImage, handleUpload, previewVisible, fileList, handlePreview,
      handleChange, handleCancel, normFile, onSelect, shopsLists, bannerfileList,
      videoUrl, bannerHandleChange, handleUploadBanner, onGoodTypeSelect, GoodTypePlaceHolder,
      currentGoodsData} = props;
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
    const columns = [
      { title: '已添加的商家名称', dataIndex: 'merchantName', key: 'merchantName', width: '33%' },
      { title: '店铺名称', dataIndex: 'shopName', key: 'shopName', width: '33%' },
      { title: '商品名称', dataIndex: 'name', key: 'name', width: '33%' }
    ];
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
        footer={null}
        width={800}>
        <div className="manageAppBox">
          <Table
            rowKey={record => record.id}
            columns={columns}
            dataSource={currentGoodsData}
            pagination={false}
            scroll={{ y: 100}}
          />
          <Form onSubmit={this.handleSearch}>
            <FormItem {...formItemLayout} label="所属商户">
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
            <FormItem {...formItemLayout} label="所属店铺">
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
            <FormItem {...formItemLayout} label="商品类型">
              {getFieldDecorator('type', {
                rules: [{ required: true, message: '请选择商品类型' }],
              })(
                <Select placeholder="请选择" onSelect={onGoodTypeSelect} disabled={modalType ? true : false}>
                  {goodType.map((item) => {
                    return (
                      <Option value={item.id} key={item.id}>{item.name}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={GoodTypePlaceHolder === 0 ? '商品ID' : '优惠券ID'}>
              {getFieldDecorator('code', {
                rules: [{ required: true, whitespace: true, message: `请输入${GoodTypePlaceHolder === 0 ? '商品ID' : '优惠券ID'}` }],
              })(modalType ? (
                <Input placeholder={`请输入${GoodTypePlaceHolder === 0 ? '商品ID' : '优惠券ID'}`} />
                ) : (
                  <Input placeholder={`请输入${GoodTypePlaceHolder === 0 ? '商品ID' : '优惠券ID'}`}/>
                ))}
            </FormItem>
            <FormItem {...formItemLayout} label={GoodTypePlaceHolder === 0 ? '商品名称' : '优惠券名称'}>
              {getFieldDecorator('name', {
                rules: [{ required: true, whitespace: true, message: `请输入${GoodTypePlaceHolder === 0 ? '商品名称' : '优惠券名称'}` }],
              })(<Input placeholder={`请输入${GoodTypePlaceHolder === 0 ? '商品名称' : '优惠券名称'}`} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="商品图片">
              {getFieldDecorator('img', {
                rules: [{ required: true, message: '请上传商品图片' }],
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
            <FormItem {...formItemLayout} label="宣传介绍（支持图片和视频）">
              {getFieldDecorator('banner', {
                rules: [{ required: false, message: '' }],
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
                         style={{ objectFit: 'fill', display:  videoUrl ? (videoUrl.url ? '' : 'none') : 'none', maxWidth: '600px', maxHeight: '500px'}}
                         playsInline=""
                         webkit-playsinline=""
                         x5-video-player-fullscreen="true"
                         x5-video-player-type="h5"
                         x5-video-orientation="portraint"
                         src={videoUrl ? videoUrl.url : ''}>
                    Your browser does not support the Video tag.
                  </video>
                  <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%', display:  bannerfileList.length > 0 ? '' : 'none'}} src={previewImage} />
                  </Modal>
                </div>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="商品数量">
              {getFieldDecorator('number', {
                rules: [{ required: true, message: '请输入商品数量' }],
              })(<InputNumber placeholder="请输入商品数量" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="商品价格">
              {getFieldDecorator('price', {
                rules: [{ required: true, message: '请输入商品价格' }],
              })(<InputNumber placeholder="请输入商品价格" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="备注信息">
              {getFieldDecorator('remark')(<TextArea placeholder="请输入备注信息" autosize={{ minRows: 2, maxRows: 6 }} />)}
            </FormItem>
            <FormItem {...formItemLayout} style={{ display: modalType ? 'none' : ''}}>
              <Button style={{ width: '120px', marginRight: '10px' }}
                      onClick={() => handleAdd(0)}>继续添加商品</Button>
              <Button style={{ width: '120px' }} type="Default"  type="primary"
                      onClick={() => handleAdd(1)}>完成</Button>
            </FormItem>
            <FormItem {...formItemLayout} style={{ display: modalType ? '' : 'none'}}>
              <Button style={{ width: '120px', marginRight: '10px' }}
                      onClick={() => handleModalVisible()}>取消</Button>
              <Button style={{ width: '120px' }} type="Default"  type="primary"
                      onClick={() => handleAdd(1)}>保存</Button>
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  });

@connect(({ common, loading, interactSamplingSetting }) => ({
  common,
  interactSamplingSetting,
  loading: loading.models.interactSamplingSetting,
}))
@Form.create()
export default class areaSettingList extends PureComponent {
  state = {
    current: 1,
    expandedRowKeys: [],
    expandedShopsRowKeys: [],
    // 商品
    modalVisible: false,
    editModalConfirmLoading: false,
    modalType: true,
    merchantLists: [],
    shopsLists: [],
    previewVisible: false,
    previewImage: '',
    fileList: [],
    bannerfileList: [],
    videoUrl: {},
    GoodTypePlaceHolder: 0,
    // 商户
    modalMerchantVisible: false,
    editMerchantModalConfirmLoading: false,
    modalMerchantType: true,
    channelLists: [],
    modalMerchantData: {},
    // 店铺
    modalShopsVisible: false,
    editShopsModalConfirmLoading: false,
    modalShopsType: true,
    modalShopsData: {},

    interactSampling: null,
    merchants: [],
    shops: [],
    goods: [],
    currentShopsData: [],
    currentGoodsData: [],

    saveAndAddModal: {},
    sessionKey: false,
    mustIsVip: false,
  };
  componentDidMount() {
    console.log('this.props.params.id', this.props.match.params.id)
    this.setState({
      interactSampling: this.props.match.params.id
    })
    this.getInteractMerchantList(this.props.match.params.id)
  }
  create = () => {
    this.handleMerchantModalVisible(true)
  }
  getInteractMerchantList = (interactId) => {
    // getInteractMerchantList
    this.props.dispatch({
      type: 'interactSamplingSetting/getInteractMerchantList',
      payload: {
        params: {
          interactId,
        },
      },
    }).then((res) => {
      this.setState({
        merchants: res.data
      })
    });
  }
  getInteractShopList = (merchantId) => {
    // getInteractMerchantList
    console.log('item.sellerId', merchantId)
    this.props.dispatch({
      type: 'interactSamplingSetting/getInteractShopsList',
      payload: {
        params: {
          merchantId,
        },
      },
    }).then((res) => {
      this.setState({
        shops: res.data,
      })
    });
  }
  getChannelList = () => {
    this.props.dispatch({
      type: 'merchantSetting/getChannelsList',
      payload: {
        restParams: {},
      },
    }).then((res) => {
      this.setState({
        channelLists: res,
      });
    });
  }
  // 新建商品开始
  // 新增modal确认事件 开始
  saveFormRef = (form) => {
    this.form = form;
  }
  onSelect = (value) => {
    this.getInteractShopList(value)
    this.form.setFieldsValue({
      shopId: undefined,
    });
  }
  // 添加modal 添加事件
  handleModalVisible = async (flag, item) => {
    console.log('item', item)
    const { saveAndAddModal } = this.state
    this.setState({
      modalVisible: !!flag,
      modalData: {},
      modalType: false,
    });
    this.setModalData();
    if (item) {
      this.getGoods(item.id)
      if (item.sellerId) {
        await this.getInteractShopList(item.sellerId)
        await this.form.setFieldsValue({
          sellerId: item.sellerId,
          shopId: item.id,
        });
      }
    }
    if (saveAndAddModal) {
      if (saveAndAddModal.sellerId) {
        await this.getInteractShopList(saveAndAddModal.sellerId)
        await this.form.setFieldsValue({
          sellerId: saveAndAddModal.sellerId,
        });
      }
    }
  };
  // 删除modal 删除事件
  handleDelClick = (item) => {
    this.setState({
      editModalConfirmLoading: true,
    });
    if (item) {
      const params = { goodsId: item.id, interactId: this.props.match.params.id };
      this.props.dispatch({
        type: 'interactSamplingSetting/deleteGoods',
        payload: {
          params,
        },
      }).then(() => {
        this.getGoods()
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
      type: 'interactSamplingSetting/getGoodsDetail',
      payload: {
        params: {
          id: item.id,
        },
      },
    }).then((res) => {
      this.getInteractShopList(res.sellerId)
      this.getGoods()
      this.setModalData(res);
    });
  }
  // 设置modal 数据
  setModalData = (data) => {
    if (data) {
      let flist = [], videoUrl = {}
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
        fileList: data.img ? [{
          uid: -1,
          name: 'xxx.png',
          status: 'done',
          url: data.img,
        }] : [],
        bannerfileList: flist,
        videoUrl,
        GoodTypePlaceHolder: data.type || 0,
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
        number: data.number || undefined,
        type: data.type || 0
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
       // sellerId: undefined,
       // shopId: undefined,
        remark: undefined,
        img: undefined,
        specRemark: undefined,
        number: undefined,
        type: 0
      });
    }
  }
  // 判断是否为图片
  imgFlag = (resp) => {
    if (resp.indexOf('png') > 0 || resp.indexOf('jpg') > 0 || resp.indexOf('jpeg') > 0 || resp.indexOf('png') > 0 || resp.indexOf('gif') > 0) {
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
  handleAdd = (flag) => {
    this.form.validateFields((err, fieldsValue) => {
      if (this.state.fileList.length > 0) {
        this.form.setFieldsValue({
          img: this.state.fileList,
        });
      }
      if (err) {
        return;
      }
      let params = {
        ...fieldsValue,
        interactId: this.state.interactSampling
      };
      this.setState({
        editModalConfirmLoading: true,
      });
      // console.log('this.state.bannerfileList', this.state.bannerfileList, this.state.videoUrl.data)
      let messageTxt = '添加'
      let url = 'interactSamplingSetting/goodsAdd';
      if (this.state.modalData.id) {
        url = 'interactSamplingSetting/updateGoods';
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
          message.success( messageTxt + '成功');
          this.getGoods()
          this.setState({
            modalData: {},
            editModalConfirmLoading: false,
          });
          if (flag === 0) {
            this.setModalData()
          } else {
            this.setState({
              modalVisible: false,
            });
          }
        }
        this.setState({
          editModalConfirmLoading: false,
        });
      });
    });
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
        console.log('this.imgFlag(resp.data)', this.imgFlag(resp.data))
        if (this.imgFlag(resp.data)) {
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
  onGoodTypeSelect = (value) => {
    this.setState({
      GoodTypePlaceHolder: value
    })
  }
  // 商品结束
  // 店铺开始
  // 新增modal确认事件 开始
  saveShopsFormRef = (form) => {
    this.shopsForm = form;
  }
  // 编辑modal 确认事件
  handleShopsAdd = (flag) => {
    this.shopsForm.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (values.isVip === 1) {
        if (!values.sessionKey.trim()) {
          message.info('请填写入会码')
          return
        }
      }
      this.setState({
        editShopsModalConfirmLoading: true,
      });
      let url = 'interactSamplingSetting/shopsAdd';
      let params = { ...values, interactId: this.state.interactSampling };
      if (this.state.mustIsVip) {
        params = { ...params, isVip: 2};
      }
      if (this.state.modalShopsData.id) {
        url = 'interactSamplingSetting/updateShops';
        params = { ...params, id: this.state.modalShopsData.id };
      }
      this.props.dispatch({
        type: url,
        payload: {
          params,
        },
      }).then((res) => {
        if (res && res.code === 0) {
          this.getShops()
          this.setState({
            editShopsModalConfirmLoading: false,
            modalShopsData: {},
            saveAndAddModal: {
              sellerId: params.sellerId
            }
          });
          if (flag === 'saveAddGoods') {
            this.handleModalVisible(true)
          }
          if (flag === 0) {
            this.setShopsModalData()
          }
          if (flag === 1) {
            this.setState({
              modalShopsVisible: false,
            });
          }
        }
      });
    });
  }
  // 添加modal 添加事件
  handleShopsModalVisible = async (flag, item) => {
    // this.handleMerchantModalVisible(false)
    // await this.handleMerchantAdd()
    await this.setState({
      modalShopsVisible: !!flag,
      modalShopsData: {},
      modalShopsType: false,
    }, () => {
      this.setShopsModalData();
      if (item) {
        console.log('item', item)
        this.getShops(item.id)
        this.shopsForm.setFieldsValue({
          sellerId: item.id,
        });
      }
    });
  };
  // 删除modal 删除事件
  handleShopsDelClick = (item) => {
    this.setState({
      editShopsModalConfirmLoading: true,
    });
    if (item) {
      const params = { shopsId: item.id, interactId: this.props.match.params.id };
      this.props.dispatch({
        type: 'interactSamplingSetting/deleteShops',
        payload: {
          params,
        },
      }).then(() => {
        this.getShops()
        this.setState({
          editShopsModalConfirmLoading: false,
        });
      });
    } else return false;
  }
  // 编辑modal 编辑事件
  handleShopsEditClick = (item) => {
    this.setState({
      modalShopsVisible: true,
      modalShopsData: item,
      modalShopsType: true,
    });
    this.getChannelList()
    this.props.dispatch({
      type: 'interactSamplingSetting/getShopsDetail',
      payload: {
        params: {
          id: item.id,
        },
      },
    }).then((res) => {
      this.setShopsModalData(res);
    });
  }
  // 设置modal 数据
  setShopsModalData = (data) => {
    if (data) {
      this.setState({
        mustIsVip: data.isVip === 2 ? true : false,
        sessionKey: data.isVip === 0 ? false : true,
      }, () => {
        this.merchantForm.validateFields(['sessionKey'], { force: true });
        this.shopsForm.setFieldsValue({
          shopCode: data.shopCode || '',
          shopName: data.shopName || '',
          sellerId: data.sellerId || '',
          isVip: data.isVip === 0 ? 0 : 1,
          sessionKey: data.sessionKey || undefined
        });
      })
    } else {
      this.setState({
        mustIsVip: false,
        sessionKey: false,
      })
      this.shopsForm.setFieldsValue({
        shopCode: undefined,
        shopName: undefined,
        sellerId: undefined,
        isVip: 0,
        sessionKey: undefined
      });
    }
  }
  saveAddGoods = () => {
    // saveAndAddModal
    this.handleShopsAdd('saveAddGoods')
    this.getShops()
  }
  RadioChange = (e) => {
    console.log('value', e)
    this.setState({
      sessionKey: e.target.value === 1 ? true : false,
    }, () => {
      this.merchantForm.validateFields(['sessionKey'], { force: true });
    });
    if (e.target.value === 0) {
      this.shopsForm.setFieldsValue({
        sessionKey: undefined
      });
      this.setState({
        mustIsVip: false
      });
    }
  }
  // 店铺结束
  // 商户开始
  // 添加modal 添加事件
  handleMerchantModalVisible = (flag) => {
    this.getChannelList()
    this.setState({
      modalMerchantVisible: !!flag,
      modalMerchantData: {},
      modalMerchantType: true,
    });
    this.setMerchantModalData();
  };
  // 删除modal 删除事件
  handleMerchantDelClick = (item) => {
    this.setState({
      editMerchantModalConfirmLoading: true,
    });
    if (item) {
      const params = { merchantId: item.id, interactId: this.props.match.params.id };
      this.props.dispatch({
        type: 'interactSamplingSetting/deleteMerchant',
        payload: {
          params,
        },
      }).then(() => {
        this.getInteractMerchantList(this.state.interactSampling)
        this.setState({
          editMerchantModalConfirmLoading: false,
        });
      });
    } else return false;
  }
  // 编辑modal 编辑事件
  handleMerchantEditClick = (item) => {
    this.setState({
      modalMerchantVisible: true,
      modalMerchantData: item,
      modalMerchantType: false,
    });
    this.getChannelList()
    this.props.dispatch({
      type: 'interactSamplingSetting/getMerchantDetail',
      payload: {
        params: {
          id: item.id,
        },
      },
    }).then((res) => {
      this.setMerchantModalData(res);
    });
  }
  // 设置modal 数据
  setMerchantModalData = (data) => {
    if (data) {
      this.merchantForm.setFieldsValue({
        merchantCode: data.merchantCode || undefined,
        merchantName: data.merchantName || undefined,
        brandName: data.brandName || undefined,
        originFlag: data.originFlag || undefined,
        channelId: data.channelId || undefined,
      });
    } else {
      this.merchantForm.setFieldsValue({
        merchantCode: undefined,
        merchantName: undefined,
        brandName: undefined,
        originFlag: undefined,
        channelId: undefined,
      });
    }
  }
  // 新增modal确认事件 开始
  saveMerchantFormRef = (form) => {
    this.merchantForm = form;
  }
  // 编辑modal 确认事件
  handleMerchantAdd = (flag) => {
    this.merchantForm.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        editMerchantModalConfirmLoading: true,
      });
      let url = 'interactSamplingSetting/merchantAdd';
      let params = { ...values, interactId: this.props.match.params.id };
      if (this.state.modalMerchantData.id) {
        url = 'interactSamplingSetting/updateMerchant';
        params = { ...params, id: this.state.modalMerchantData.id };
      }
      this.props.dispatch({
        type: url,
        payload: {
          params,
        },
      }).then((res) => {
        if (res && res.code === 0) {
          this.getInteractMerchantList(this.props.match.params.id)
          if (flag === 0) {
            this.setMerchantModalData()
          } else {
            this.setState({
              modalMerchantVisible: false,
            });
          }
          this.setState({
            modalMerchantData: {},
          });
        }
        this.setState({
          editMerchantModalConfirmLoading: false,
        });
      });
    });
  }
  saveAddShop = async () => {
    await this.handleMerchantAdd(1)
    await this.merchantForm.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.handleShopsModalVisible(true)
    })
  }
  handleSessionKeyChange = (e) => {
    this.setState({
      mustIsVip: e.target.checked,
    });
  }
  // 商户结束
  // 获取最新店铺开始
  getShops = (merchantId) => {
    console.log('this.state.expandedRowKeys[0]', this.state.expandedRowKeys[0])
    let params = { merchantId: this.state.expandedRowKeys[0] || merchantId }
    this.props.dispatch({
      type: 'interactSamplingSetting/getInteractShopsList',
      payload: {
        params,
      },
    }).then((res) => {
      if (res && res.code === 0) {
        this.setState({
          currentShopsData: res.data
        })
      }
    });
  }
  // 获取最新店铺结束
  // 获取最新商品开始
  getGoods = (shopsId) => {
    let params = {
      shopsId: this.state.expandedShopsRowKeys[0] || shopsId,
      interactId: this.state.interactSampling
    }
    this.props.dispatch({
      type: 'interactSamplingSetting/getInteractGoodsList',
      payload: {
        params,
      },
    }).then((res) => {
      if (res && res.code === 0) {
        this.setState({
          currentGoodsData: res.data
        })
      }
    });
  }
  next = (type) => {
    this.props.history.push({pathname: '/project/sampling-setting'})
  }
  render() {
    const {
      interactSamplingSetting: { list, page, unColumn },
      loading,
    } = this.props;
    const { current, expandedRowKeys, expandedShopsRowKeys } = this.state
    const { modalVisible, editModalConfirmLoading, modalType, merchantLists, shopsLists, previewVisible,
      previewImage, fileList,bannerfileList, videoUrl } = this.state;
    const { modalShopsVisible, editShopsModalConfirmLoading, modalShopsType } = this.state;
    const { modalMerchantVisible, editMerchantModalConfirmLoading, modalMerchantType, channelLists} = this.state;
    const { merchants, shops, goods, currentShopsData, currentGoodsData } = this.state
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 },
      },
    };
    const steps = [
    {
      title: '基本信息',
      content: '',
    }, {
      title: '商户商品信息',
      content: '',
    }, {
      title: '选择机器',
      content: '',
    }, {
      title: '规则设置',
      content: '',
    }];
    const expandedGoodsRowRender = () => {
      const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
          title: 'Action',
          dataIndex: 'operation',
          key: 'operation',
          render: (text, item) => (
            <Fragment>
              <a onClick={() => this.handleEditClick(item)}>修改</a>
              <Divider type="vertical"/>
              <a onClick={() => this.handleDelClick(item)}>删除</a>
            </Fragment>
          )
        },
      ];
      return (
        <Table
          rowKey={record => record.id}
          columns={columns}
          dataSource={currentGoodsData}
          pagination={false}
        />
      );
    };
    const onExpandedRowsShopsChange = (expandedRows) => {
      console.log('expandedShopsRows', expandedRows)
      this.setState({
        expandedShopsRowKeys: expandedRows.splice(expandedRows.length - 1, 1)
      }, () => {
        if (this.state.expandedShopsRowKeys.length > 0) {
          this.getGoods()
        }
      })
    }
    const expandedRowRender = () => {
      const columns = [
        { title: '店铺名称', dataIndex: 'shopName', key: 'shopName' },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          render: (text, item) => (
            <Fragment>
              <a onClick={() => this.handleModalVisible(true, item)}>添加商品</a>
              <Divider type="vertical"/>
              <a onClick={() => this.handleShopsEditClick(item)}>修改</a>
              <Divider type="vertical"/>
              <a onClick={() => this.handleShopsDelClick(item)}>删除</a>
            </Fragment>
          )
        },
      ];
      return (
        <Table
          rowKey={record => record.id}
          expandedRowRender={expandedGoodsRowRender}
          onExpandedRowsChange={onExpandedRowsShopsChange}
          columns={columns}
          dataSource={currentShopsData}
          pagination={false}
          expandedRowKeys={expandedShopsRowKeys}
          // expandRowByClick={true}
        />
      );
    };
    const onExpandedRowsChange = (expandedRows) => {
      // console.log('expandedRows', expandedRows)
      this.setState({
        expandedRowKeys: expandedRows.splice(expandedRows.length - 1, 1),
        expandedShopsRowKeys: [],
      }, () => {
        if (this.state.expandedRowKeys.length > 0) {
          this.getShops()
        }
      })
    }
    const columns = [
      { title: 'merchantName', dataIndex: 'merchantName', key: 'name' },
      { title: '操作', key: 'operation',
        render: (text, item) => (
          <Fragment>
            <a onClick={() => this.handleShopsModalVisible(true, item)}>添加店铺</a>
            <Divider type="vertical"/>
            <a onClick={() => this.handleMerchantEditClick(item)}>修改</a>
            <Divider type="vertical"/>
            <a onClick={() => this.handleMerchantDelClick(item)}>删除</a>
          </Fragment>
        )
      },
    ];
    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
            <Steps current={current}>
              {steps.map(item => <Step key={item.title} title={item.title} />)}
            </Steps>
            <div className={styles.stepsContent}>
              {
                <Button type="primary" style={{ marginBottom: 8 }}  onClick={() => this.create()}>创建商户店铺商品</Button>
              }
              <Table
                rowKey={record => record.id || record.code}
                className="components-table-demo-nested"
                columns={columns}
                expandedRowRender={expandedRowRender}
                dataSource={merchants}
                pagination={false}
                // expandRowByClick={true}
                onExpandedRowsChange={onExpandedRowsChange}
                expandedRowKeys={expandedRowKeys}
                scroll={{ y: (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 100 + 80)}}
              />
            </div>
            <div className={styles.stepsAction}>
              {
                <Button onClick={() => this.props.history.push({pathname: '/project/sampling-setting'})}>关闭</Button>
              }
              {
                <Button onClick={() => this.next(1)}>暂存</Button>
              }
              {
                current > 0
                && (
                  <Button type="primary" style={{ marginLeft: 8 }}
                          onClick={() => this.props.history.push({pathname: '/project/addBasicInteractSampling', query: {id: this.state.interactSampling}})}>
                    上一步
                  </Button>
                )
              }
              {
                current < steps.length - 1
                && <Button type="primary"
                           onClick={() => this.props.history.push({pathname: `/project/addMachineInteractSampling/${this.state.interactSampling}`})}>下一步</Button>
              }
            </div>
        </Card>
        <CreateMerchantForm
          handleAdd={this.handleMerchantAdd}
          handleModalVisible={this.handleMerchantModalVisible}
          ref={this.saveMerchantFormRef}
          modalVisible={modalMerchantVisible}
          editModalConfirmLoading={editMerchantModalConfirmLoading}
          modalType={modalMerchantType}
          channelLists={channelLists}
          saveAddShop={this.saveAddShop}
          merchants={this.state.merchants}
        />
        <CreateShopsForm
          handleAdd={this.handleShopsAdd}
          handleModalVisible={this.handleShopsModalVisible}
          ref={this.saveShopsFormRef}
          modalVisible={modalShopsVisible}
          editModalConfirmLoading={editShopsModalConfirmLoading}
          modalType={modalShopsType}
          merchantLists={merchants}
          saveAddGoods={this.saveAddGoods}
          handleChange={this.handleSessionKeyChange}
          sessionKey={this.state.sessionKey}
          RadioChange={this.RadioChange}
          mustIsVip={this.state.mustIsVip}
          currentShopsData={this.state.currentShopsData}
        />
        <CreateGoodsForm
          handleAdd={this.handleAdd}
          handleModalVisible={this.handleModalVisible}
          ref={this.saveFormRef}
          modalVisible={modalVisible}
          editModalConfirmLoading={editModalConfirmLoading}
          modalType={modalType}
          merchantLists={merchants}
          shopsLists={shops}
          previewVisible={previewVisible}
          previewImage={previewImage}
          fileList={fileList}
          handlePreview={this.handlePreview}
          handleChange={this.handleChange}
          handleCancel={this.handleCancel}
          handleUpload={this.handleUpload}
          normFile={this.normFile}
          onSelect={this.onSelect}
          bannerfileList={bannerfileList}
          videoUrl={videoUrl}
          bannerHandleChange={this.bannerHandleChange}
          handleUploadBanner={this.handleUploadBanner}
          onGoodTypeSelect={this.onGoodTypeSelect}
          GoodTypePlaceHolder={this.state.GoodTypePlaceHolder}
          currentGoodsData={this.state.currentGoodsData}
        />
      </PageHeaderLayout>
    );
  }
}
