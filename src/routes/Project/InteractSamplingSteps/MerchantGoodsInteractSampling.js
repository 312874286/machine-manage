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
  Table, Badge,
  Menu, Dropdown,
  Icon, Divider,
  Modal, Upload,
  InputNumber,
  Checkbox, Alert,
  Popconfirm,
} from 'antd';
import StandardTable from '../../../components/StandardTable/index';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './MerchantGoodsInteractSampling.less';
import {getAccountMenus} from "../../../utils/authority";
import {message, Radio} from "antd/lib/index";
import domain from "../../../common/config/domain";
import moment from "moment/moment";

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
const goodType = [{id: 0, name: '商品'}, {id: 1, name: '优惠券'}]
// 新建商户
const CreateMerchantForm = Form.create()(
  (props) => {
    const { modalVisible, form, handleAdd,
      handleModalVisible, editModalConfirmLoading, modalType,
      channelLists, saveAddShop,
      merchants, paiyangType, checkMerchantUserLists, handleChange,
      channelHandleChange,
      checkMerchantLists, checkSelectedMerchantLists, onLeftSelect, onLeftSelectAll, targetHandleDelete, toRightMerchantHandle
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
    const columns = [
      { title: '已添加的商家名称', dataIndex: 'merchantName', key: 'merchantName', width: '100%' },
    ];
    const rowSelection = {
      onSelect: onLeftSelect,
      onSelectAll: onLeftSelectAll,
    };
    const columnsLeft =  [{
      title: '公众号AppID',
      dataIndex: 'merchantCode',
      width: '40%',
      render: text => <a href="javascript:;">{text}</a>,
    }, {
      title: '公众号名称',
      width: '40%',
      dataIndex: 'merchantName',
      render: text => <a href="javascript:;">{text}</a>,
    }];
    const columnsRight = [{
      title: '公众号AppID',
      dataIndex: 'merchantCode',
      width: '30%',
      render: text => <a href="javascript:;">{text}</a>,
    }, {
      title: '公众号名称',
      width: '30%',
      dataIndex: 'merchantName',
      render: text => <a href="javascript:;">{text}</a>,
    }, {
      title: '操作',
      width: 70,
      dataIndex: 'operation',
      render: (text, record) => {
        return (
          checkSelectedMerchantLists.length > 0
            ? (
              <Popconfirm title="确认要删除吗?" onConfirm={() => targetHandleDelete(record.id)}>
                <a href="javascript:;">删除</a>
              </Popconfirm>
            ) : null
        );
      }
    }];
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
        width={1000}
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
            <FormItem {...formItemLayout} label="客户名称">
              {getFieldDecorator('merchant', {
                rules: [{ required: true, whitespace: true, message: '请选择客户名称' }],
              })(
                <Select
                  showSearch
                  placeholder="请输入客户名称或者客户编码"
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onChange={handleChange}
                >
                  {
                    checkMerchantUserLists.map((item) => {
                      return (
                        <Option value={`${item.merchantCode}-${item.id}`}>{`${item.merchantCode}-${item.merchantName}`}</Option>
                      )
                    })
                  }
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="客户编码">
            {getFieldDecorator('merchantCode', {
              rules: [{ required: true, whitespace: true, message: '请输入客户编码' }],
            })(<Input placeholder="" disabled />)}
            </FormItem>
            {/*<FormItem {...formItemLayout} label="所属渠道">*/}
              {/*{getFieldDecorator('channelCode', {*/}
                {/*rules: [{ required: true, whitespace: true, message: '请选择渠道' }],*/}
                {/*initialValue: paiyangType ? '002002' : undefined*/}
              {/*})(*/}
                {/*<Select placeholder="请选择渠道" disabled={paiyangType}  onChange={channelHandleChange}>*/}
                  {/*{channelLists.map((item) => {*/}
                    {/*return (*/}
                      {/*<Option value={item.channelListscode} key={item.code} disabled={paiyangType ? true : (item.code === '002002' ? true : false)}>{item.name}</Option>*/}
                    {/*);*/}
                  {/*})}*/}
                {/*</Select>*/}
              {/*)}*/}
            {/*</FormItem>*/}
            <FormItem>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ marginLeft: '20px' }}>
                  <Alert
                    message={(
                      <div>
                        已有 <a style={{ fontWeight: 600 }}>{checkMerchantLists.length}</a> 项
                      </div>
                    )}
                    type="success"
                    showIcon
                  />
                  <Table
                    rowKey={record => record.id}
                    rowSelection={rowSelection}
                    columns={columnsLeft}
                    dataSource={checkMerchantLists}
                    id="leftTable"
                    style={{ width: '400px', marginBottom: '20px', marginTop: '10px' }}
                    scroll={{ y: 200 }}
                    pagination={false}
                  />
                </div>
                <Button type="primary" onClick={() => toRightMerchantHandle()}> >> </Button>
                <div>
                  <Alert
                    message={(
                      <div>
                        已有 <a style={{ fontWeight: 600 }}>{checkSelectedMerchantLists.length}</a> 项
                      </div>
                    )}
                    type="success"
                    showIcon
                  />
                  <Table
                    rowKey={record => record.id}
                    columns={columnsRight}
                    dataSource={checkSelectedMerchantLists}
                    id="rightTable"
                    style={{ width: '460px', marginTop: '10px' }}
                    scroll={{ y: 200 }}
                    pagination={false} />
                </div>
              </div>
            </FormItem>
            <FormItem {...formItemLayout} style={{ display: modalType ? '' : 'none'}}>
              <Button style={{ width: '120px', marginRight: '10px' }}
                      onClick={() => handleAdd(0)}>继续添加商家</Button>
              <Button style={{ width: '120px' }} type="Default"  type="primary"
                      onClick={() => saveAddShop(1)}>保存并添加{paiyangType ? '商品' : '店铺'}</Button>
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
      handleChange, sessionKey, RadioChange, mustIsVip, currentShopsData,
      paiyangType, checkMerchantUserLists,
      checkShopLists, checkSelectedShopLists, onLeftSelect, onLeftSelectAll, targetHandleDelete, toRightShopHandle
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
    const columns = [
      { title: '已添加的商家名称', dataIndex: 'merchantName', key: 'merchantName', width: '50%' },
      { title: '店铺名称', dataIndex: 'shopName', key: 'shopName', width: '50%' },
    ];
    const rowSelection = {
      onSelect: onLeftSelect,
      onSelectAll: onLeftSelectAll,
    };
    const columnsLeft =  [{
      title: '店铺ID',
      dataIndex: 'shopCode',
      width: '40%',
      render: text => <a href="javascript:;">{text}</a>,
    }, {
      title: '店铺名称',
      width: '40%',
      dataIndex: 'shopName',
      render: text => <a href="javascript:;">{text}</a>,
    }];
    const columnsRight = [{
      title: '店铺ID',
      dataIndex: 'shopCode',
      width: '30%',
      render: text => <a href="javascript:;">{text}</a>,
    }, {
      title: '店铺名称',
      width: '30%',
      dataIndex: 'shopName',
      render: text => <a href="javascript:;">{text}</a>,
    }, {
      title: '操作',
      width: 70,
      dataIndex: 'operation',
      render: (text, record) => {
        return (
          checkSelectedShopLists.length > 0
            ? (
              <Popconfirm title="确认要删除吗?" onConfirm={() => targetHandleDelete(record.id)}>
                <a href="javascript:;">删除</a>
              </Popconfirm>
            ) : null
        );
      }
    }];
    {/*<Select placeholder="请选择">*/}
    {/*{merchantLists.map((item) => {*/}
    {/*return (*/}
    {/*<Option value={item.id} key={item.id}>{item.merchantName}</Option>*/}
    {/*);*/}
    {/*})}*/}
    {/*</Select>*/}
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
        width={1000}
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
                <Select
                showSearch
                placeholder="请输入客户名称或者客户编码"
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onChange={handleChange}
                >
              {
                checkMerchantUserLists.map((item) => {
                return (
                <Option value={`${item.merchantCode}-${item.id}`}>{`${item.merchantCode}-${item.merchantName}`}</Option>
                )
              })
              }
                </Select>
              )}
            </FormItem>
            <FormItem>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ marginLeft: '20px' }}>
                  <Alert
                    message={(
                      <div>
                        已有 <a style={{ fontWeight: 600 }}>{checkShopLists.length}</a> 项
                      </div>
                    )}
                    type="success"
                    showIcon
                  />
                  <Table
                    rowKey={record => record.id}
                    rowSelection={rowSelection}
                    columns={columnsLeft}
                    dataSource={checkShopLists}
                    id="leftTable"
                    style={{ width: '400px', marginBottom: '20px', marginTop: '10px' }}
                    scroll={{ y: 200 }}
                    pagination={false}
                  />
                </div>
                <Button type="primary" onClick={() => toRightShopHandle()}> >> </Button>
                <div>
                  <Alert
                    message={(
                      <div>
                        已有 <a style={{ fontWeight: 600 }}>{checkSelectedShopLists.length}</a> 项
                      </div>
                    )}
                    type="success"
                    showIcon
                  />
                  <Table
                    rowKey={record => record.id}
                    columns={columnsRight}
                    dataSource={checkSelectedShopLists}
                    id="rightTable"
                    style={{ width: '460px', marginTop: '10px' }}
                    scroll={{ y: 200 }}
                    pagination={false} />
                </div>
              </div>
            </FormItem>
            {/*<FormItem {...formItemLayout} label="Shop ID">*/}
              {/*{getFieldDecorator('shopCode', {*/}
                {/*rules: [{ required: true,whitespace: true,  message: '请输入Shop ID' }],*/}
              {/*})(<Input placeholder="请输入Shop ID" />)}*/}
            {/*</FormItem>*/}
            {/*<FormItem {...formItemLayout} label="店铺名称">*/}
              {/*{getFieldDecorator('shopName', {*/}
                {/*rules: [{ required: true, whitespace: true, message: '请输入店铺名称' }],*/}
              {/*})(<Input placeholder="请输入店铺名称" />)}*/}
            {/*</FormItem>*/}
            {/*<FormItem {...formItemLayout} label="是否入会">*/}
              {/*{getFieldDecorator('isVip', {*/}
                {/*rules: [{ required: true, message: '' }],*/}
                {/*initialValue: 0,*/}
              {/*})(*/}
                {/*<RadioGroup onChange={RadioChange}>*/}
                  {/*<Radio value={1}>是</Radio>*/}
                  {/*<Radio value={0}>否</Radio>*/}
                {/*</RadioGroup>*/}
              {/*)}*/}
            {/*</FormItem>*/}
            {/*<FormItem {...formItemLayout} label="入会码">*/}
              {/*/!*<Col span={14}>*!/*/}
                {/*/!*<FormItem>*!/*/}
                  {/*{getFieldDecorator('sessionKey', {*/}
                    {/*// rules: [{ whitespace: true, message: '请输入入会码' }],*/}
                  {/*})*/}
                  {/*(<Input*/}
                    {/*placeholder="请输入入会码"*/}
                    {/*disabled={!sessionKey}*/}
                  {/*/>)}*/}
                {/*/!*</FormItem>*!/*/}
              {/*/!*</Col>*!/*/}
              {/*/!*<Col span={8}>*!/*/}
                {/*/!*<FormItem>*!/*/}
                  {/*/!*<Checkbox*!/*/}
                    {/*/!*disabled={!sessionKey}*!/*/}
                    {/*/!*checked={mustIsVip}*!/*/}
                    {/*/!*onChange={handleChange}>*!/*/}
                    {/*/!*强制入会*!/*/}
                  {/*/!*</Checkbox>*!/*/}
                {/*/!*</FormItem>*!/*/}
              {/*/!*</Col>*!/*/}
            {/*</FormItem>*/}
            <FormItem {...formItemLayout} style={{ display: modalType ? 'none' : ''}}>
              <Button style={{ width: '120px', marginRight: '10px' }}
                      onClick={() => handleAdd(0)}>继续添加店铺</Button>
              <Button style={{ width: '120px' }} type="Default"  type="primary"
                      onClick={() => handleAdd('saveAddGoods')}>保存并添加商品</Button>
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
      currentGoodsData, onShopsTypeSelect, selectGoodsType, relevanceCommodityChange, relevanceCommodity,
      sourceData, handleSave, selectedRowKeys, onChangeRowSelection, onLeftSelect, onSelectAll, selectAll, couponId,
      paiyangType,
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
    this.goodsColumns = [
      {
        title: "商品名称",
        dataIndex: "name",
        width: '30%',
        render: text => <a href="javascript:;">{text}</a>
      },  {
        title: "关联优惠券状态",
        dataIndex: "couponId",
        width: '70%',
        render: text => <a href="javascript:;">{text ? '已关联' : '未关联'}</a>
      }
    ];
    const goodsColumns = this.goodsColumns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: handleSave
        })
      };
    });
    const rowSelection = {
      selectAll,
      selectedRowKeys,
      onChange: onChangeRowSelection,
      onSelect: onLeftSelect,
      onSelectAll: onSelectAll,
      getCheckboxProps: record => ({
        disabled: record.couponId && record.couponId !== couponId ? true : false,
      }),
    };
    // console.log('modalType || selectGoodsType', modalType, selectGoodsType)
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
        className={styles.goodDetail}
        width={800}
      >
        <div className="manageAppBox">
          <Table
            rowKey={record => record.id}
            columns={columns}
            dataSource={currentGoodsData}
            pagination={false}
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
            <FormItem {...formItemLayout} label="所属店铺" style={{ display: paiyangType ? 'none' : '' }}>
              {getFieldDecorator('shopId', {
                rules: [{ required: !paiyangType, message: '请选择店铺' }],
              })(
                <Select placeholder="请先选择店铺" onSelect={onShopsTypeSelect}>
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
                <Select placeholder="请选择" onSelect={onGoodTypeSelect} disabled={selectGoodsType ? true : false}>
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
            <div className={styles.require}>
              <FormItem {...formItemLayout} label="是否关联商品"
                        style={{ display: GoodTypePlaceHolder === 0 ? 'none' : '' }}
                        extra="注：选否则优惠券做为独立派发商品"
              >
                {getFieldDecorator('isAlone', {
                  rules: [{ required: false, message: '' }],
                  initialValue: 1,
                })(
                  <RadioGroup onChange={relevanceCommodityChange}>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </div>

            <div
              style={{
                padding: 0,
                border: "1px solid #ececec",
                paddingLeft: "10px",
                marginBottom: "20px",
                display: GoodTypePlaceHolder === 1 && relevanceCommodity && sourceData.length > 0  ? '' : 'none'
              }}
            >
              <FormItem {...formItemLayout}>
                {getFieldDecorator("machine")(
                  <div style={{ display: "flex" }}>
                    <div>
                      <Table
                        rowKey={record => record.id}
                        rowSelection={rowSelection}
                        columns={goodsColumns}
                        dataSource={sourceData}
                        id="leftTable"
                        style={{
                          marginBottom: "20px",
                          marginTop: "10px"
                        }}
                        scroll={{ y: 200 }}
                        pagination={false}
                      />
                    </div>
                  </div>
                )}
              </FormItem>
            </div>
            <div
              style={{
                padding: 0,
                paddingLeft: "10px",
                marginBottom: "20px",
                textAlign: 'center',
                display: GoodTypePlaceHolder === 1 && relevanceCommodity && sourceData.length === 0  ? '' : 'none'
              }}
            >该店铺中暂时无商品，请先添加商品。</div>
            <FormItem {...formItemLayout} label={GoodTypePlaceHolder === 0 ? '商品图片' : '优惠券图片'} style={{ display: GoodTypePlaceHolder === 0 || !relevanceCommodity ? '' : 'none' }}>
              {getFieldDecorator('img', {
                rules: [{ required: false, message: `请输入${GoodTypePlaceHolder === 0 ? '请上传商品图片' : '请上传优惠券图片'}` }],
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
            <FormItem {...formItemLayout} label="宣传介绍（支持图片和视频)" style={{ display: GoodTypePlaceHolder === 0 || !relevanceCommodity ? '' : 'none' }}>
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
            <FormItem {...formItemLayout} label="商品数量" style={{ display: GoodTypePlaceHolder === 0 ? '' : 'none' }}>
              {getFieldDecorator('number', {
                rules: [{ required: false, message: '请输入商品数量' }],
              })(<InputNumber placeholder="请输入商品数量" max={10000000} min={0}/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="商品价格" style={{ display: GoodTypePlaceHolder === 0 ? '' : 'none' }}>
              {getFieldDecorator('price', {
                rules: [{ required: false, message: '请输入商品价格' }],
              })(<InputNumber placeholder="请输入商品价格" min={0}/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="备注信息" style={{ display: GoodTypePlaceHolder === 0 || !relevanceCommodity ? '' : 'none' }}>
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
    checkMerchantUserLists: [],
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

    allShopsLists: [],
    allGoodsLists: [],
    saveAndAddModal: {},
    sessionKey: false,
    mustIsVip: false,

    paiyangType: false,
    selectGoodsType: true,
    relevanceCommodity: true,

    selectedRowKeys: [],
    sourceData: [],
    selectAll: true,
    shopId: '',
    selectedRows: [],
    couponId: [],

    checkMerchantLists: [],
    merchantAccountId: '',
    checkSelectedMerchantLists: [],
    selectedMerchantRows: [],
    checkShopsLists: [],

    checkShopUserLists: [],
    checkShopLists: [],
    checkSelectedShopLists: [],
  };
  componentDidMount() {
    // console.log('this.props.params.id', this.props.match.params.id)
    this.setState({
      interactSampling: this.props.match.params.id
    }, () => {
      this.getAllGoods()
      this.getInteractDetail()
      this.getcheckMerchantUserLists()
    })
    this.getInteractMerchantList(this.props.match.params.id)
  }
  create = () => {
    this.handleMerchantModalVisible(true)
  }
  // interactDetail
  getInteractDetail = () => {
    this.props.dispatch({
      type: 'interactSamplingSetting/interactDetail',
      payload: {
        params: {
          id: this.state.interactSampling
        },
      },
    }).then((res) => {
      if (res) {
        if (res.channel === '002002') {
          this.setState({
            paiyangType: true
          })
        }
      }
    });
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
      if (res && res.code == 0) {
        this.setState({
          merchants: res.data
        })
      }
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
  selectMerchantHandleChange = (value) => {
    const { paiyangType } = this.state
    this.merchantForm.setFieldsValue({
      merchantCode: value && value.split('-')[0],
    });
    this.setState({
      merchantCode: value && value.split('-')[1]
    })
    this.getCheckMerchantLists(value && value.split('-')[1])
  }
  channelHandleChange = (value) => {
    const { merchantCode } = this.state
    if (value) {
      this.getCheckMerchantLists(merchantCode, value)
    }
  }
  //
  getcheckMerchantUserLists = () => {
    //checkMerchantUserLists
    this.props.dispatch({
      type: 'interactSamplingSetting/checkMerchantUser',
      payload: {
        restParams: {},
      },
    }).then((res) => {
      this.setState({
        checkMerchantUserLists: res,
      });
    });
  }
  getCheckMerchantLists = (merchantAccountId, channel) => {
    const { merchants } = this.state
    this.props.dispatch({
      type: 'interactSamplingSetting/checkMerchant',
      payload: {
        params: {
          merchantAccountId,
          interactId: this.state.interactSampling,
        },
      },
    }).then((res) => {
      if (res && res.code === 0) {
        this.setState({
          checkMerchantLists: res.data.filter(a => false === merchants.some(b => b.id === a.id)),
        });
      }
    });
  }
  onLeftSelectAll = (selected, selectedRows, changeRows) => {
    console.log('111', selected, selectedRows, changeRows);
    this.setState({
      selectedMerchantRows: selectedRows,
      selectAll: selected
    })
  }
  onLeftMerchantSelect = (record, selected, selectedRows) => {
    console.log('222', record, selected, selectedRows);
    this.setState({
      selectedMerchantRows: selectedRows,
      selectAll: true
    })
  }
  toRightMerchantHandle = () => {
    const { selectedMerchantRows, checkSelectedMerchantLists, checkMerchantLists } = this.state
    let selectedMerchantRowsArr = checkMerchantLists, checkSelectedMerchantListsArr = checkSelectedMerchantLists
    let newArr = []
    // 遍历 左边选中的数组，检查 右边数组 filter，是否 和左边选中数组 有重复，放到新数组，提示重复信息，不重复的则 放到右边数组 移除左边数组，
    selectedMerchantRows.forEach((item, index) => {
     if (checkSelectedMerchantListsArr.filter(i => i.merchantCode === item.merchantCode).length > 0) {
       // message.error('已重复')
       newArr = [...newArr, ...checkSelectedMerchantListsArr.filter(i => i.merchantCode === item.merchantCode)]
       // return false
     } else {
       console.log('bbb', item, index, checkSelectedMerchantListsArr.filter(i => i.merchantCode === item.merchantCode))
       checkSelectedMerchantListsArr = [...checkSelectedMerchantListsArr, item]
     }
    })
    const operation = (list1, list2, isUnion = false) =>
      list1.filter( a => isUnion === list2.some(b => a.id === b.id));
    // console.log('总数组', selectedMerchantRowsArr)
    // console.log('左边剩余数组', operation(selectedMerchantRowsArr, checkSelectedMerchantListsArr))
    // console.log('右边新数组', checkSelectedMerchantListsArr)
    // console.log('重复数组', newArr)
    this.setState({
      checkMerchantLists: operation(selectedMerchantRowsArr, checkSelectedMerchantListsArr),
      checkSelectedMerchantLists: checkSelectedMerchantListsArr
    })
  }
  //
  selectShopHandleChange = (value) => {
    const { paiyangType } = this.state
    this.getCheckShopLists(value && value.split('-')[1])
  }
  getCheckShopLists = (sellerId, channel) => {
    this.props.dispatch({
      type: 'interactSamplingSetting/checkShop',
      payload: {
        params: {
          sellerId,
          interactId: this.state.interactSampling,
        },
      },
    }).then((res) => {
      if (res && res.code === 0) {
        this.setState({
          checkShopLists: res.data,
        });
      }
    });
  }
  onLeftShopSelect = (record, selected, selectedRows) => {
    this.setState({
      selectedShopRows: selectedRows,
    })
  }
  toRightShopHandle = () => {
    const { selectedShopRows, checkSelectedShopLists, checkShopLists } = this.state
    let selectedShopRowsArr = checkShopLists, checkSelectedShopListsArr = checkSelectedShopLists
    let newArr = []
    // 遍历 左边选中的数组，检查 右边数组 filter，是否 和左边选中数组 有重复，放到新数组，提示重复信息，不重复的则 放到右边数组 移除左边数组，
    selectedShopRows.forEach((item, index) => {
      if (checkSelectedShopListsArr.filter(i => i.id === item.id).length > 0) {
        // message.error('已重复')
        newArr = [...newArr, ...checkSelectedShopListsArr.filter(i => i.id === item.id)]
        // return false
      } else {
        checkSelectedShopListsArr = [...checkSelectedShopListsArr, item]
      }
    })
    const operation = (list1, list2, isUnion = false) =>
      list1.filter( a => isUnion === list2.some(b => a.id === b.id));
    this.setState({
      checkShopLists: operation(selectedShopRowsArr, checkSelectedShopListsArr),
      checkSelectedShopLists: checkSelectedShopListsArr
    })
  }
  onLeftShopSelectAll = (selected, selectedRows, changeRows) => {
    this.setState({
      selectedShopRows: selectedRows,
    })
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
  handleModalVisible = async (flag, item, flag1) => {
    console.log('item', item, !flag1 ? flag1 : true)
    const { saveAndAddModal } = this.state
    this.setState({
      modalVisible: !!flag,
      modalData: {},
      modalType: false,
      selectGoodsType: flag1
    });
    this.setModalData();
    this.getAllGoods()
    if (saveAndAddModal) {
      if (saveAndAddModal.sellerId) {
        await this.getInteractShopList(saveAndAddModal.sellerId)
        await this.form.setFieldsValue({
          sellerId: saveAndAddModal.sellerId,
          shopId: saveAndAddModal.shopId,
        });
      }
    }
    if (item) {
      if (item.sellerId) {
        await this.getInteractShopList(item.sellerId, item.id)
        console.log('item', item.id, item.sellerId, this.state.shops)
        await this.form.setFieldsValue({
          sellerId: item.sellerId,
          shopId: item.id,
        });
        this.setState({
          shopId: item.id
        })
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
      selectGoodsType: true,
      couponId: item.id
    });
    this.props.dispatch({
      type: 'interactSamplingSetting/getGoodsDetail',
      payload: {
        params: {
          id: item.id,
          type: item.type,
        },
      },
    }).then((res) => {
      this.getInteractShopList(res.sellerId)
      this.getGoods()
      this.setState({
        shopId: res.shopId
      });
      this.setModalData(res);
    });
  }
  // 设置modal 数据
  setModalData = (data) => {
    let selectedRowKey = [], selectedRow = []
    if (data) {
      let flist = [], videoUrl = {}
      if (data.type === 0 || data.isAlone === 0) {
        if (data.banner || data.img) {
          if (data.banner && this.imgFlag(data.banner)) {
            flist = [{
              uid: -2,
              name: 'xxx.png',
              status: 'done',
              url: data.banner,
            }]
            videoUrl = {}
          } else if (data.banner && this.videoFlag(data.banner)){
            videoUrl = {
              url: data.banner
            }
            flist = []
          } else {
            videoUrl = {}
            flist = []
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
        }
        if (data.type === 0) {
          this.form.setFieldsValue({
            price: data.price || undefined,
            remark: data.remark || undefined,
            img: data.img || undefined,
            specRemark: data.specRemark || undefined,
            number: data.number || undefined,
          });
        } else {
          this.form.setFieldsValue({
            remark: data.remark || undefined,
            img: data.img || undefined,
          });
        }
      }
      this.setState({
        GoodTypePlaceHolder: data.type,
        relevanceCommodity: data.isAlone === 1 ? true : false
      })
      this.getGoodsByShops(data.isAlone, 'edit')
      this.form.setFieldsValue({
        name: data.name || '',
        code: data.code || undefined,
        sellerId: data.sellerId || undefined,
        shopId: data.shopId || undefined,
        type: data.type,
        isAlone: data.isAlone,
      });
    } else {
      this.setState({
        fileList: [],
        bannerfileList: [],
        videoUrl: {},
        GoodTypePlaceHolder: 0
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
        type: 0,
        isAlone: undefined,
      });
    }
    this.setState({
      selectedRowKeys: selectedRowKey,
      selectedRows: selectedRow
    })
  }
  getGoodsByShops = (value, flag) => {
    const { interactSampling, shopId, couponId } = this.state
    let selectedRowKey = [], selectedRow = []
    if (value !== 0) {
      // 获取商品列表 couponGetList
      let restParams = {
        interactId: interactSampling,
        shopsId: shopId,
      }
      this.props.dispatch({
        type: 'interactSamplingSetting/couponGetList',
        payload: {
          restParams,
        },
      }).then((res) => {
        if (res && res.code === 0) {
          this.setState({
            sourceData: res.data
          })
          if (flag === 'add') {
            res.data.forEach((item) => {
              if (!item.couponId) {
                selectedRowKey.push(item.id)
                selectedRow.push({
                  id: item.id
                })
              }
            })
          } else {
            res.data.forEach((item) => {
              if (item.isCheck === 1 && item.couponId === couponId) {
                selectedRowKey.push(item.id)
                selectedRow.push({
                  id: item.id
                })
              }
            })
            console.log('selectedRowKey', selectedRowKey, selectedRow)
          }
          this.setState({
            selectedRowKeys: selectedRowKey,
            selectedRows: selectedRow
          })
        }
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
    message.config({
      top: 100,
      duration: 2,
      maxCount: 1,
    });
    const { GoodTypePlaceHolder, fileList, bannerfileList, selectedRows, relevanceCommodity, modalData, videoUrl } = this.state
    this.form.validateFields((err, fieldsValue) => {
      if (fileList.length > 0) {
        this.form.setFieldsValue({
          img: fileList,
        });
      }
      if (err) {
        return;
      }
      if (GoodTypePlaceHolder === 0 || !relevanceCommodity) {
        if (fileList.length === 0) {
          message.warn('请添加图片')
          return;
        }
        if (!relevanceCommodity) {
          if (bannerfileList.length === 0 && !videoUrl.url) {
            message.warn('请添加宣传介绍')
            return;
          }
        }
        // console.log('fieldsValue.number', fieldsValue.number)
        // if (fieldsValue.number.trim()) {
        //   message.warn('请填写商品数量')
        //   return;
        // }
        // if (fieldsValue.price.trim()) {
        //   message.warn('请填写商品价格')
        //   return;
        // }
      }
      let goodsList = []
      let params = {
        ...fieldsValue,
        interactId: this.state.interactSampling
      };
      if (relevanceCommodity && GoodTypePlaceHolder !== 0) {
        if (selectedRows.length === 0) {
          message.warn('请至少选择一件商品或添加新商品')
          return;
        }
        goodsList = selectedRows.map((item) => {
          return {
            goodsId: item.id
          }
        })
        params = {...params, goodsList,}
      }
      console.log('params', goodsList, selectedRows)
      this.setState({
        editModalConfirmLoading: true,
      });
      // console.log('this.state.bannerfileList', this.state.bannerfileList, this.state.videoUrl.data)
      let messageTxt = '添加'
      let url = 'interactSamplingSetting/goodsAdd';
      if (modalData.id) {
        url = 'interactSamplingSetting/updateGoods';
        messageTxt = '编辑'
        params = { ...params, id: modalData.id };
      }
      if (fileList.length > 0) {
        params = { ...params, img: fileList[0].data };
      }
      if (bannerfileList.length > 0) {
        params = { ...params, banner: bannerfileList[0].data };
      }
      if (videoUrl.data) {
        params = { ...params, banner: videoUrl.data };
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
            GoodTypePlaceHolder: 0,
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
    this.getGoodsByShops(value, 'add')
    this.setState({
      GoodTypePlaceHolder: value,
      relevanceCommodity: true
    })
    this.form.setFieldsValue({
      isAlone: 1,
      name: undefined,
      code: undefined,
    });
  }
  relevanceCommodityChange = (e) => {
    this.setState({
      relevanceCommodity: e.target.value === 1 ? true : false,
    }, () => {
      this.getGoodsByShops(e.target.value, 'add')
      // this.merchantForm.validateFields(['sessionKey'], { force: true });
    });
  }
  handleSave = row => {
    const newData = [...this.state.sourceData];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    console.log("newDatahandleSave", newData);
    this.setState({ sourceData: newData });
  };
  onChangeRowSelection = (selectedRowKeys, selectedRows) => {
    // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    this.setState({
      sourceKey: selectedRowKeys,
      selectedRowKeys
    });
  };
  onSelectAll = (selected, selectedRows, changeRows) => {
    this.setState({
      selectedRows,
      selectAll: selected
    });
    // console.log(selected, selectedRows, changeRows);
  };
  onLeftSelect = (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
    this.setState({
      selectedRows,
      selectAll: true
    });
  };
  onShopsTypeSelect = (value) => {
    this.setState({
      selectGoodsType: value ? false : true,
      shopId: value
    }, () => {
      this.getGoodsByShops(value, 'add')
    })
    //
  }
  // 商品结束
  // 店铺开始
  targetShopHandleDelete = (id) => {
    const dataSource = [...this.state.checkSelectedShopLists];
    this.setState({
      checkSelectedShopLists: dataSource.filter(item => item.id !== id),
      selectedShopRows: [],
    });
  }
  // 新增modal确认事件 开始
  saveShopsFormRef = (form) => {
    this.shopsForm = form;
  }
  // 编辑modal 确认事件
  handleShopsAdd = (flag) => {
    const { checkSelectedShopLists } = this.state
    this.shopsForm.validateFields((err, values) => {
        if (err) {
          return;
        }
        // if (values.isVip === 1) {
        //   if (!values.sessionKey.trim()) {
        //     message.info('请填写入会码')
        //     return
        //   }
        // }
        // sellSessionKey
        if (checkSelectedShopLists.length === 0) {
          message.info('请至少添加一个店铺')
          return
        }
        this.setState({
          editShopsModalConfirmLoading: true,
        });
        let url = 'interactSamplingSetting/shopsAdd';
        let params = {
          ...values,
          interactId: this.state.interactSampling,
          shops: checkSelectedShopLists,
        };
        // if (this.state.mustIsVip) {
        //   params = { ...params, isVip: 2};
        // }
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
            this.getShops(flag)
            // setTimeout(() => {
            //
            // }, 0)
            this.setState({
              editShopsModalConfirmLoading: false,
              modalShopsData: {},
              saveAndAddModal: {
                sellerId: params.sellerId,
                shopId: undefined
              }
            });
            if (flag === 0) {
              this.setShopsModalData()
            }
            if (flag === 1) {
              this.setState({
                modalShopsVisible: false,
                selectGoodsType: true
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
      this.getAllShops()
      if (item) {
        console.log('item', item)
        // this.shopsForm.setFieldsValue({
        //   sellerId: item.id,
        // });
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
    // this.getChannelList()
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
          sessionKey: data.sessionKey || undefined,
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
        sessionKey: undefined,
      });
    }
  }
  saveAddGoods = () => {
    // saveAndAddModal
    this.setState({
      selectGoodsType: true
    }, () => {
      this.handleShopsAdd('saveAddGoods')
    })
    // this.getShops()
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
  targetMerchantHandleDelete = (id) => {
    const dataSource = [...this.state.checkSelectedMerchantLists];
    this.setState({
      checkSelectedMerchantLists: dataSource.filter(item => item.id !== id),
      selectedMerchantRows: [],
    });
  }
  handleMerchantModalVisible = (flag) => {
    // this.getChannelList()
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
    // this.getChannelList()
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
    const { paiyangType } = this.state
    if (data) {
      this.merchantForm.setFieldsValue({
        merchantCode: data.merchantCode || undefined,
        merchant: data.merchant || undefined,
        channelCode: data.channelCode || undefined,
      });
    } else {
      this.merchantForm.setFieldsValue({
        merchantCode: undefined,
        merchant: undefined,
        channelCode: paiyangType ? '002002' : undefined,
      });
    }
  }
  // 新增modal确认事件 开始
  saveMerchantFormRef = (form) => {
    this.merchantForm = form;
  }
  // 编辑modal 确认事件
  handleMerchantAdd = (flag) => {
    const { paiyangType, checkSelectedMerchantLists } = this.state
    this.merchantForm.validateFields((err, values) => {
      if (err) {
        return;
      }
      // if (paiyangType) {
      //   if (!values.sellSessionKey.trim()) {
      //     message.info('请填写入零售入会码')
      //     return
      //   }
      // }
      if (checkSelectedMerchantLists.length === 0) {
        message.info('请至少添加一个商户')
        return
      }
      this.setState({
        editMerchantModalConfirmLoading: true,
      });
      let url = 'interactSamplingSetting/merchantAdd';
      let params = {
        ...values,
        interactId: this.props.match.params.id,
        merchants: checkSelectedMerchantLists
      };
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
            checkMerchantLists: [],
          });
        }
        this.setState({
          editMerchantModalConfirmLoading: false,
          selectedMerchantRows: [],
          checkSelectedMerchantLists: [],
        });
      });
    });
  }
  saveAddShop = async () => {
    const { paiyangType, checkSelectedMerchantLists } = this.state
    await this.handleMerchantAdd(1)
    await this.merchantForm.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (checkSelectedMerchantLists.length === 0) {
        return
      }
      if (paiyangType) {
        this.setState({
          modalShopsVisible: false,
        }, () => {
          this.handleModalVisible(true, '', true)
        });
      } else {
        this.handleShopsModalVisible(true)
      }
    })
  }
  handleSessionKeyChange = (e) => {
    this.setState({
      mustIsVip: e.target.checked,
    });
  }
  // 商户结束
  // 获取最新店铺开始
  getShops = (flag) => {
    console.log('this.state.expandedRowKeys[0]', this.state.expandedRowKeys[0])
    let params = { merchantId: this.state.expandedRowKeys[0] }
    this.props.dispatch({
      type: 'interactSamplingSetting/getInteractShopsList',
      payload: {
        params,
      },
    }).then((res) => {
      console.log('1111', res.data)
      if (res && res.code === 0) {
        this.setState({
          currentShopsData: res.data,
        }, () => {
          if (flag === 'saveAddGoods') {
            console.log('1111', flag === 'saveAddGoods')
            this.setState({
              modalShopsVisible: false,
            }, () => {
              this.handleModalVisible(true, '', true)
            });
          } else {
            this.getAllShops()
          }
        })
      }
    });
  }
  getAllShops = () => {
    console.log('this.state.expandedRowKeys[0]', this.state.expandedRowKeys[0])
    let params = { interactId: this.state.interactSampling }
    this.props.dispatch({
      type: 'interactSamplingSetting/getInteractShopsList',
      payload: {
        params,
      },
    }).then((res) => {
      if (res && res.code === 0) {
        this.setState({
          allShopsLists: res.data
        })
      }
    });
  }
  // 获取最新店铺结束
  // 获取最新商品开始
  getGoods = () => {
    let params = {
      shopsId: this.state.expandedShopsRowKeys[0],
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
          currentGoodsData: res.data,
        }, () => {
          this.getAllGoods()
        })
      }
    });
  }
  getAllGoods = () => {
    let params = {
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
          allGoodsLists: []
        }, () => {
          this.setState({
            allGoodsLists: res.data
          })
        })
      }
    });
  }
  next = (type) => {
    const { merchants, allGoodsLists } = this.state
    if (type === 1) {
      if (allGoodsLists.length === 0) {
        message.error('请至少添加一个商品')
        return false
      }
      this.props.history.push({pathname: `/project/addMachineInteractSampling/${this.state.interactSampling}`})
    } else {
      if (merchants.length === 0) {
        message.error('请至少添加一个商户')
        return false
      }
      this.props.history.push({pathname: '/project/sampling-setting'})
    }
  }
  render() {
    const {
      interactSamplingSetting: { list, page, unColumn },
      loading,
    } = this.props;
    const { current, expandedRowKeys, expandedShopsRowKeys, paiyangType } = this.state
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
              <a onClick={() => this.handleModalVisible(true, item, false)}>添加商品</a>
              {/*<Divider type="vertical"/>*/}
              {/*<a onClick={() => this.handleShopsEditClick(item)}>修改</a>*/}
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
          this.getShops(2)
        }
      })
    }
    const columns = [
      { title: 'merchantName', dataIndex: 'merchantName', key: 'name' },
      { title: '操作', key: 'operation',
        render: (text, item) => (
          <Fragment>
            <a onClick={() => paiyangType ? this.handleModalVisible(true, item, false) : this.handleShopsModalVisible(true, item)}>{paiyangType ? '添加商品' : '添加店铺'}</a>
            {/*<Divider type="vertical"/>*/}
            {/*<a onClick={() => this.handleMerchantEditClick(item)}>{paiyangType ? '修改入会信息' : '修改商户'}</a>*/}
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
                expandedRowRender={paiyangType ? expandedGoodsRowRender : expandedRowRender}
                dataSource={merchants}
                pagination={false}
                // expandRowByClick={true}
                onExpandedRowsChange={paiyangType ? onExpandedRowsShopsChange : onExpandedRowsChange}
                expandedRowKeys={paiyangType ? expandedShopsRowKeys : expandedRowKeys}
                scroll={{ y: (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 100 + 80)}}
              />
            </div>
            <div className={styles.stepsAction}>
              {
                <Button onClick={() => this.props.history.push({pathname: '/project/sampling-setting'})}>关闭</Button>
              }
              {
                <Button onClick={() => this.next(0)}>暂存</Button>
              }
              {
                current > 0
                && (
                  <Button type="primary" style={{ marginLeft: 8 }}
                          onClick={() => this.props.history.push({ pathname: `/project/addBasicInteractSampling/${this.state.interactSampling}` })}>
                    上一步
                  </Button>
                )
              }
              {
                current < steps.length - 1
                && <Button type="primary"
                           onClick={() => this.next(1)}>下一步</Button>
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
          paiyangType={this.state.paiyangType}

          checkMerchantUserLists={this.state.checkMerchantUserLists}
          handleChange={this.selectMerchantHandleChange}
          channelHandleChange={this.channelHandleChange}
          checkMerchantLists={this.state.checkMerchantLists}
          checkSelectedMerchantLists={this.state.checkSelectedMerchantLists}
          onLeftSelect={this.onLeftMerchantSelect}
          toRightMerchantHandle={this.toRightMerchantHandle}
          onLeftSelectAll={this.onLeftSelectAll}

          targetHandleDelete={this.targetMerchantHandleDelete}
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
          // handleChange={this.handleSessionKeyChange}
          sessionKey={this.state.sessionKey}
          RadioChange={this.RadioChange}
          mustIsVip={this.state.mustIsVip}
          currentShopsData={this.state.allShopsLists}

          checkMerchantUserLists={this.state.checkMerchantUserLists}
          handleChange={this.selectShopHandleChange}
          // channelHandleChange={this.channelHandleChange}
          checkShopLists={this.state.checkShopLists}
          checkSelectedShopLists={this.state.checkSelectedShopLists}
          onLeftSelect={this.onLeftShopSelect}
          toRightShopHandle={this.toRightShopHandle}
          onLeftSelectAll={this.onLeftShopSelectAll}

          targetHandleDelete={this.targetShopHandleDelete}
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
          currentGoodsData={this.state.allGoodsLists}
          onShopsTypeSelect={this.onShopsTypeSelect}
          selectGoodsType={this.state.selectGoodsType}
          relevanceCommodityChange={this.relevanceCommodityChange}
          relevanceCommodity={this.state.relevanceCommodity}

          onChangeRowSelection={this.onChangeRowSelection}
          onSelectAll={this.onSelectAll}
          selectedRowKeys={this.state.selectedRowKeys}
          sourceData={this.state.sourceData}
          handleSave={this.handleSave}
          selectAll={this.state.selectAll}
          onLeftSelect={this.onLeftSelect}
          couponId={this.state.couponId}

          paiyangType={this.state.paiyangType}
        />
      </PageHeaderLayout>
    );
  }
}
