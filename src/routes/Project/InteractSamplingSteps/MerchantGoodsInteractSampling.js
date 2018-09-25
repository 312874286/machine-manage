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
  Table, Badge, Menu, Dropdown, Icon, Divider, Modal, Upload, InputNumber
} from 'antd';
import StandardTable from '../../../components/StandardTable/index';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './MerchantGoodsInteractSampling.less';
import {getAccountMenus} from "../../../utils/authority";
import {message} from "antd/lib/index";
import domain from "../../../common/config/domain";

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
// 新建商户
const CreateMerchantForm = Form.create()(
  (props) => {
    const { modalVisible, form, handleAdd, handleModalVisible, editModalConfirmLoading, modalType, channelLists } = props;
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
                rules: [{ required: true, whitespace: true, message: '请输入品牌名称' }],
              })(<Input placeholder="请输入品牌名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="原始标识">
              {getFieldDecorator('originFlag', {
                rules: [{ required: false, whitespace: true, message: '请输入原始标识' }],
              })(<Input placeholder="请输入原始标识" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="选择渠道">
              {getFieldDecorator('channelId', {
                rules: [{ required: true, whitespace: true, message: '请选择渠道' }],
              })(
                <Select placeholder="请选择">
                  {channelLists.map((item) => {
                    return (
                      <Option value={item.id} key={item.id}>{item.channelName}</Option>
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
// 新建店铺
const CreateShopsForm = Form.create()(
  (props) => {
    const { modalVisible, form, handleAdd, handleModalVisible, editModalConfirmLoading, modalType, merchantLists } = props;
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
            <FormItem {...formItemLayout} label="商品ID">
              {getFieldDecorator('code', {
                rules: [{ required: true, whitespace: true, message: '请输入商品ID' }],
              })(modalType ? (<Input placeholder="请输入商品ID" disabled />) : (<Input placeholder="请输入商品ID" />))}
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
    // 商户
    // 店铺

  };
  componentDidMount() {
  }
  creat = () => {
    this.handleModalVisible(true)
  }
  // 新建商品开始
  // 新增modal确认事件 开始
  saveFormRef = (form) => {
    this.form = form;
  }
  // 添加modal 添加事件
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
      modalData: {},
      modalType: false,
    });
    this.setModalData();
  };
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
        number: undefined,
      });
    }
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
  // 商品结束
  render() {
    const {
      interactSamplingSetting: { list, page, unColumn },
      loading,
    } = this.props;
    const { current, expandedRowKeys, expandedShopsRowKeys } = this.state
    const { modalVisible, editModalConfirmLoading, modalType, merchantLists, shopsLists, previewVisible,
      previewImage, fileList,bannerfileList, videoUrl } = this.state;
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
    const steps = [{
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
              <a onClick={() => this.handleWatchClick(item)}>修改</a>
              <Divider type="vertical"/>
              <a onClick={() => this.handleWatchClick(item)}>删除</a>
            </Fragment>
          )
        },
      ];
      const data = [];
      for (let i = 0; i < 3; ++i) {
        data.push({
          key: i,
          name: `商品${i}`,
        });
      }
      return (
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      );
    };
    const onExpandedRowsShopsChange = (expandedRows) => {
      console.log('expandedShopsRows', expandedRows)
      this.setState({
        expandedShopsRowKeys: expandedRows.splice(expandedRows.length - 1, 1)
      }, () => {
        console.log('expandedShopsRowKeys', this.state.expandedShopsRowKeys)
      })
    }
    const expandedRowRender = () => {
      const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
          title: 'Action',
          dataIndex: 'operation',
          key: 'operation',
          render: (text, item) => (
            <Fragment>
              <a onClick={() => this.handleWatchClick(item)}>添加商品</a>
              <Divider type="vertical"/>
              <a onClick={() => this.handleWatchClick(item)}>修改</a>
              <Divider type="vertical"/>
              <a onClick={() => this.handleWatchClick(item)}>删除</a>
            </Fragment>
          )
        },
      ];
      const data = [];
      for (let i = 0; i < 3; ++i) {
        data.push({
          key: i,
          name: `店铺${i}`,
        });
      }
      return (
        <Table
          expandedRowRender={expandedGoodsRowRender}
          onExpandedRowsChange={onExpandedRowsShopsChange}
          columns={columns}
          dataSource={data}
          pagination={false}
          expandedRowKeys={expandedShopsRowKeys}
        />
      );
    };
    const onExpandedRowsChange = (expandedRows) => {
      console.log('expandedRows', expandedRows)
      this.setState({
        expandedRowKeys: expandedRows.splice(expandedRows.length - 1, 1),
        expandedShopsRowKeys: [],
      }, () => {
        console.log('expandedRowKeys', this.state.expandedRowKeys)
      })
    }
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Action', key: 'operation',
        render: (text, item) => (
          <Fragment>
            <a onClick={() => this.handleWatchClick(item)}>添加店铺</a>
            <Divider type="vertical"/>
            <a onClick={() => this.handleWatchClick(item)}>修改</a>
            <Divider type="vertical"/>
            <a onClick={() => this.handleWatchClick(item)}>删除</a>
          </Fragment>
        )
      },
    ];

    const data = [];
    for (let i = 0; i < 3; ++i) {
      data.push({
        key: i,
        name: `商户${i}`,
      });
    }
    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
            <Steps current={current}>
              {steps.map(item => <Step key={item.title} title={item.title} />)}
            </Steps>
            <div className={styles.stepsContent}>
              {
                <Button type="primary" style={{ marginBottom: 8 }}  onClick={() => this.creat()}>创建商户店铺商品</Button>
              }
              <Table
                className="components-table-demo-nested"
                columns={columns}
                expandedRowRender={expandedRowRender}
                dataSource={data}
                pagination={false}
                expandRowByClick={true}
                onExpandedRowsChange={onExpandedRowsChange}
                expandedRowKeys={expandedRowKeys}
                scroll={{ y: (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 100 + 80)}}
              />
            </div>
            <div className={styles.stepsAction}>
              {
                <Button onClick={() => this.next()}>取消</Button>
              }
              {
                <Button onClick={() => this.next()}>暂存</Button>
              }
              {
                current > 0
                && (
                  <Button type="primary" style={{ marginLeft: 8 }}
                          onClick={() => this.props.history.push({pathname: '/project/addBasicInteractSampling', query: {statusValue: 3}})}>
                    上一步
                  </Button>
                )
              }
              {
                current < steps.length - 1
                && <Button type="primary"
                           onClick={() => this.props.history.push({pathname: '/project/addMachineInteractSampling', query: {statusValue: 3}})}>下一步</Button>
              }
            </div>
        </Card>

        <CreateGoodsForm
          handleAdd={this.handleAdd}
          handleModalVisible={this.handleModalVisible}
          ref={this.saveFormRef}
          modalVisible={modalVisible}
          editModalConfirmLoading={editModalConfirmLoading}
          modalType={modalType}
          merchantLists={merchantLists}
          shopsLists={shopsLists}
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
        />
      </PageHeaderLayout>
    );
  }
}
