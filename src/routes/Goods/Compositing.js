import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Select,
  Modal,
  message,
  Table,
  Divider,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import CompositingTable from '../../components/Goods/compositingTable';
import { area } from '../../common/config/area';
import { padLeft, bitParse } from '../../utils/utils';
import LogModal from '../../components/LogModal';
import styles, { cardStyle, cardConnectStyle } from './Compositing.less';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea, Search } = Input;


const CreateModal = Form.create()(
  (props) => {
    const {
      modalType,
      createModalVisible,
      createModalHandleCancel,
      createModalHandleOk,
      createModalConfirmLoading,
      form,
      doctorGroupList,
      detail,
      onSellState,

      contentLeftTableLoading,
      serviceItemList,
      serviceItemPage,
      handleContentTableChange,
      existingServiceItemList,
      connectHandleAdd,
      connectHandleChange,
      tags,
      discountPrice,
      price,
      discountChange,
      searchServiceItem,
      createmodalSellLoading,
    } = props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };

    const contentLeftTableColumns = [
      {
        title: '服务项ID',
        dataIndex: 'code',
        width: 165,
      },
      {
        title: '服务项名称',
        dataIndex: 'name',
        width: 130,
      },
      {
        title: '基础价格',
        dataIndex: 'price',
        width: 80,
      },
      {
        title: '操作',
        render: (text, item) => (
          <Fragment>
            <a onClick={() => connectHandleAdd(item)}>添加</a>
          </Fragment>
        ),
      },
    ];

    const contentRightTableColumns = [
      {
        title: '服务项ID',
        dataIndex: 'code',
        width: 165,
      },
      {
        title: '服务项名称',
        dataIndex: 'name',
        width: 130,
      },
      {
        title: '基础价格',
        dataIndex: 'price',
        width: 80,
      },
      {
        title: '操作',
        render: (text, item, index) => {
          return (
            <Fragment>
              {index !== 0 &&
                (
                  <span>
                    <a className="operating-btn" onClick={() => connectHandleChange(item, 'up', index)}>↑</a>
                    <Divider type="vertical" />
                  </span>
                )
              }
              {index !== existingServiceItemList.length - 1 &&
                (
                  <span>
                    <a className="operating-btn" onClick={() => connectHandleChange(item, 'down', index)}>↓</a>
                    <Divider type="vertical" />
                  </span>
                )
              }
              <a className="operating-btn" onClick={() => connectHandleChange(item, 'delete', index)}>×</a>
            </Fragment>
          );
        },
      },
    ];

    return (
      <Modal
        title="组合规则设置"
        width="1000px"
        visible={createModalVisible}
        onOk={createModalHandleOk}
        confirmLoading={createModalConfirmLoading}
        onCancel={createModalHandleCancel}
        maskClosable="true"
        style={{ top: 20 }}
        footer={
          <div>
            {modalType === 'edit' && detail.sellState === 1 ? <Button type="danger" loading={createmodalSellLoading} onClick={() => { onSellState(detail.id, 0, 1); }}>停止售卖</Button> : ''}
            {modalType === 'edit' && detail.sellState === 0 ? <Button type="primary" loading={createmodalSellLoading} onClick={() => { onSellState(detail.id, 1, 1); }}>开始售卖</Button> : ''}
            <Button onClick={createModalHandleCancel}>取消</Button>
            <Button type="primary" onClick={createModalHandleOk} loading={createModalConfirmLoading}>确定</Button>
          </div>
        }
      >
        <Form>

          <Card title="订单基本信息" className={cardStyle}>

            {modalType === 'edit' &&
              (
                <FormItem {...formItemLayout} label="组合ID">
                  {getFieldDecorator('code')(
                    <Input disabled placeholder="请输入" />
                  )}
                </FormItem>
              )
            }

            <FormItem {...formItemLayout} label="组合名称" >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入组合名称' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="简介" >
              {getFieldDecorator('info')(
                <TextArea placeholder="请输入内容" autosize={{ minRows: 2, maxRows: 6 }} />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="区域" >
              {getFieldDecorator('areaId', {
                rules: [{ required: true, message: '请选择' }],
              })(
                <Select placeholder="请选择">
                  {area.map((item) => {
                    return (
                      <Option value={item.id} key={item.id}>{item.name}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>

            {/* <FormItem {...formItemLayout} label="可售卖医生组" >
              {getFieldDecorator('doctorGroupId', {
                rules: [{ required: true, message: '请选择' }],
              })(
                <Select placeholder="请选择">
                  <Option value={0}>全部</Option>
                  {doctorGroupList.map((item) => {
                    return (
                      <Option value={item.id} key={item.id}>{item.groupName}</Option>
                    );
                  })}
                </Select>
              )}
            </FormItem> */}

            <FormItem {...formItemLayout} label="组合折扣(七五折，填写75)" >
              {getFieldDecorator('discount', {
                valuePropName: 'value',
                getValueFromEvent: discountChange,
                rules: [{ required: true, message: '请输入组合折扣' }],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Card>
          <Card title="关联操作项信息" className={cardConnectStyle}>
            <Row>
              <Col span={12} className="left">
                <Search
                  placeholder="请输入检验项ID/名称等关键字"
                  onSearch={(value) => { searchServiceItem(value); }}
                  enterButton
                />
                <Table
                  bordered
                  loading={contentLeftTableLoading}
                  rowKey={record => record.id}
                  dataSource={serviceItemList}
                  columns={contentLeftTableColumns}
                  pagination={serviceItemPage}
                  onChange={handleContentTableChange}
                  scroll={{ x: 630, y: 300 }}
                  size="small"
                  style={{ marginTop: '10px' }}
                />
              </Col>
              <Col span={12} className="right">
                <div style={{ padding: '5px 10px', border: '1px solid #ddd', background: '#f5f5f5' }}>已添加</div>
                <Table
                  bordered
                  pagination={false}
                  loading={contentLeftTableLoading}
                  rowKey={record => record.id}
                  dataSource={existingServiceItemList}
                  columns={contentRightTableColumns}
                  scroll={{ x: 700, y: 300 }}
                  size="small"
                  style={{ marginTop: '10px' }}
                />
              </Col>
            </Row>
            <Row>
              <Col span={3} className="label"><span className="label-content">分类标签</span></Col>
              <Col span={17}><p>{tags}</p></Col>
            </Row>
            <Row>
              <Col span={3} className="label"><span className="label-content red">组合价格</span></Col>
              <Col span={17}><p>{price}</p></Col>
            </Row>
            <Row>
              <Col span={3} className="label"><span className="label-content red">折后总价</span></Col>
              <Col span={17}><p>{discountPrice}</p></Col>
            </Row>
            <Row>
              <Col span={3} className="label"><span className="label-content">备注</span></Col>
              <Col span={21}>
                {getFieldDecorator('remarks')(
                  <TextArea
                    autosize={{ minRows: 2, maxRows: 6 }}
                  />
                )}
              </Col>
            </Row>
          </Card>
        </Form>

        {detail && detail.sellState === 1 && <p style={{ color: 'red', margin: '30px 0 0' }}>请先停止售卖，再编辑内容</p>}
      </Modal>
    );
  }
);

@connect(({ compositing, loading, log, serviceItem }) => ({
  compositing,
  log,
  serviceItem,
  loading: loading.models.compositing,
}))
@Form.create()
export default class Compositing extends PureComponent {
  state = {
    pageNo: 1,
    logModalVisible: false,
    logModalLoading: false,
    logId: '',
    logModalPageNo: 1,
    createModalVisible: false,
    modalType: 'create',
    createModalConfirmLoading: false,

    detailData: null,
    doctorGroupList: [],
    queryString: {
      sellState: '',
      areaId: '',
      selectParams: '',
    },
    existingServiceItemList: [],
    tags: '',
    tagList: [],
    price: 0,
    discountPrice: 0,
    discount: 100,
    servicePageNo: 1,
  };

  componentDidMount = () => {
    this.getList();
    this.getDoctorGroup();
    this.getServiceItemTags();
    // this.getDoctorReportDept();
  }

  // 获取列表
  getList = () => {
    this.props.dispatch({
      type: 'compositing/getCompositList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          ...this.state.queryString,
        },
      },
    });
  }

  // 分页
  handleTableChange = (pagination) => {
    const { current } = pagination;
    this.setState({
      pageNo: current,
    }, () => {
      this.getList();
    });
  }

  // 获取分类标签列表
  getServiceItemTags = () => {
    this.props.dispatch({
      type: 'serviceItem/getServiceItemTags',
      payload: {},
    }).then((res) => {
      const { code, data } = res;
      if (code !== 0) return;
      this.setState({
        tagList: data,
      });
    });
  }

  // 搜索
  handleSearch = () => {
    // e.preventDefault();
    this.props.form.validateFields((err, value) => {
      console.log(err);
      if (err) return;
      this.setState({
        queryString: {
          sellState: value.sellState || '',
          selectParams: value.selectParams || '',
          areaId: value.areaId || '',
        },
        pageNo: 1,
      }, () => {
        this.getList();
      });
    });
  }

  // 清空
  clearSearch = () => {
    this.props.form.setFieldsValue({
      arrangeState: '',
      tag: '',
      sellState: '',
      searchKey: '',
      doctorGroup: '',
      area: '',
      useType: '',
    });
    this.getList();
  }

  // 获取解读医生
  getDoctorReportDept = () => {
    this.props.dispatch({
      type: 'serviceItem/getDoctorReportDept',
      payload: {},
    }).then((res) => {
      const { code, data } = res;
      if (code !== 0) return;
      this.setState({
        doctorDeptList: data,
      });
    })
  }

  // 获取医生组
  getDoctorGroup = () => {
    this.props.dispatch({
      type: 'serviceItem/getDoctorGroup',
      payload: {},
    }).then((res) => {
      const { code, data } = res;
      if (code !== 0) return;
      this.setState({
        doctorGroupList: data,
      });
    })
  }

  // 日志相关
  getLogList = () => {
    this.props.dispatch({
      type: 'log/getLogList',
      payload: {
        restParams: {
          code: this.state.logId,
          pageNo: this.state.logModalPageNo,
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

  // 新建
  createOperationItem = () => {
    this.getServiceList();

    this.setState({
      createModalVisible: true,
      modalType: 'create',
      price: 0,
      discountPrice: 0,
      tags: '',
      existingServiceItemList: [],
    });
    this.form.setFieldsValue({
      discount: undefined,
      // doctorGroupId: undefined,
      info: undefined,
      name: undefined,
      remarks: undefined,
      areaId: undefined,
      code: undefined,
    });
  }

  // 详情事件
  handleDetailClick = (data) => {
    this.getServiceItemDetail(data);
    this.getServiceList();
  }

  // 详情请求数据
  getServiceItemDetail = ({ id }) => {
    this.props.dispatch({
      type: 'compositing/getCompositDetail',
      payload: {
        restParams: {
          id,
        },
      },
    }).then((res) => {
      const { code, data } = res;
      if (code !== 0) return;

      const obj = { tags: data.tags };

      this.setState({
        createModalVisible: true,
        modalType: 'edit',
        detailData: data,
        price: data.price,
        discountPrice: data.totalPrice,
        tags: this.getTags(obj),
        existingServiceItemList: data.list,
      });

      this.form.setFieldsValue({
        discount: data.discount,
        // doctorGroupId: data.doctorGroupId,
        info: data.info,
        name: data.name,
        remarks: data.remarks,
        areaId: data.areaId,
        code: data.code,
      });
    });
  }

  // 删除
  handleDelClick = (data) => {
    this.props.dispatch({
      type: 'compositing/delComposit',
      payload: {
        params: { id: data.id },
      },
    }).then((res) => {
      const { code, msg } = res;
      if (code === 0) {
        message.success('操作成功');
        this.getList();
      } else {
        message.error(msg);
      }
    });
  }

  saveFormRef = (form) => {
    this.form = form;
  }

  // 创建操作项确定事件
  createModalHandleOk = () => {
    this.form.validateFields((err, value) => {
      if (err) {
        return;
      }
      const { existingServiceItemList } = this.state;

      const serviceIds = existingServiceItemList.map((item) => {
        return item.id;
      });

      const submitData = {
        discount: value.discount,
        // doctorGroupId: value.doctorGroupId,
        info: value.info,
        name: value.name,
        remarks: value.remarks,
        areaId: value.areaId,
        totalPrice: this.state.discountPrice,
        price: this.state.price,
        tags: padLeft(this.bitOperation(existingServiceItemList), 20),
        serviceIds: serviceIds.join(','),
      };
      if (this.state.modalType === 'edit') {
        submitData.id = this.state.detailData.id;
      }
      this.submitServiceItem(submitData);
    });
  }

  // 创建事件
  submitServiceItem = (submitData) => {
    this.setState({
      createModalConfirmLoading: true,
    });
    this.props.dispatch({
      type: 'compositing/addOrEditRule',
      payload: {
        params: { ...submitData },
      },
    }).then((res) => {
      const { code } = res;
      if (!res || code !== 0) return;
      message.success('操作成功');
      this.setState({
        createModalVisible: false,
        createModalConfirmLoading: false,
      });
      this.getList();
    });
  }

  // 创建modal 取消事件
  createModalHandleCancel = () => {
    this.setState({
      createModalVisible: false,
    });
  }

  // 开始停止售卖
  handleSellState = (id, sellState, type) => {
    this.setState({
      createmodalSellLoading: true,
    });
    this.props.dispatch({
      type: 'compositing/updateCompositSellState',
      payload: {
        params: {
          id,
          sellState,
        },
      },
    }).then((res) => {
      if (!res || res.code !== 0) return;
      this.getList();
      message.success('操作成功');
      this.setState({
        createmodalSellLoading: false,
        createModalVisible: false,
      });
    });
  }

  // 关联操作项 获取操作项
  getServiceList = () => {
    this.props.dispatch({
      type: 'serviceItem/getServiceList',
      payload: {
        restParams: {
          pageNo: this.state.servicePageNo,
          searchKey: this.state.servicePageNoSearchKey || '',
          useType: '',
          arrangeState: '',
          tag: '',
          sellState: '',
          doctorGroup: '',
          area: '',
        },
      },
    });
  }

  // 关联操作项 操作项搜索
  searchServiceItem = (value) => {
    this.setState({
      servicePageNoSearchKey: value || '',
      servicePageNo: 1,
    }, () => {
      this.getServiceList();
    });
  }

  // 关联操作项 操作项分页
  handleContentTableChange = (pagination) => {
    const { current } = pagination;
    this.setState({
      servicePageNo: current,
    }, () => {
      this.getServiceList();
    });
  }

  // 关联操作项 操作项添加
  connectHandleAdd = (data) => {
    const { existingServiceItemList } = this.state;
    existingServiceItemList.push(data);

    const obj = { tags: this.bitOperation(existingServiceItemList) };
    this.setState({
      existingServiceItemList: JSON.parse(JSON.stringify(existingServiceItemList)),
      tags: this.getTags(obj),
    }, () => {
      this.calcTimes();
    });
  }

  // 关联操作项 操作项移动删除
  connectHandleChange = (data, type, index) => {
    const { existingServiceItemList } = this.state;

    if (type === 'delete') {
      existingServiceItemList.splice(index, 1);
    } else if (type === 'up') {
      existingServiceItemList[index - 1] = existingServiceItemList.splice(index, 1, existingServiceItemList[index - 1])[0];
    } else if (type === 'down') {
      existingServiceItemList[index + 1] = existingServiceItemList.splice(index, 1, existingServiceItemList[index + 1])[0];
    }

    const obj = { tags: this.bitOperation(existingServiceItemList) };

    this.setState({
      existingServiceItemList: JSON.parse(JSON.stringify(existingServiceItemList)),
      tags: this.getTags(obj),
    }, () => {
      this.calcTimes();
    });
  }
  // 计算组合价格、折后价格
  calcTimes = () => {
    const { existingServiceItemList, discount } = this.state;
    let price = 0;
    let discountPrice = 0;
    existingServiceItemList.forEach((item) => {
      price += item.price;
    });
    discountPrice = (price * discount) / 100;

    this.setState({
      price,
      discountPrice,
    });
  }
  // 分类标签
  getTags = (value) => {
    if (!value || !value.tags) return;
    const result = [];
    const tagvalue = bitParse(value.tags);
    tagvalue.forEach((tag) => {
      const tmp = this.state.tagList.find((item) => {
        return item.val === tag.toString();
      });
      if (tmp) {
        result.push(tmp.name);
      }
    });
    return result.join(' | ');
  }

  // 位运算
  bitOperation = (list) => {
    let tags = '';
    list.forEach((item) => {
      let tmp = '';
      tmp = parseInt(item.tags, 2) | parseInt(tags, 2);
      tags = tmp.toString(2);
    });
    return tags.toString();
  }

  // 折扣
  discountChange = (value) => {
    if (value.target.value) {
      this.setState({
        discount: value.target.value,
      }, () => {
        this.calcTimes();
      });
      return value.target.value;
    }
    return '';
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { compositing: { list, page }, log: { logList, logPage }, loading, serviceItem } = this.props;
    const serviceItemList = serviceItem.list;
    const serviceItemPage = serviceItem.page;
    const {
      createModalConfirmLoading,
      createModalVisible,
      modalType,
      doctorGroupList,
      detailData,
      contentLeftTableLoading,
      existingServiceItemList,
      tags,
      price,
      discountPrice,
      createmodalSellLoading,
    } = this.state;


    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={12}>
                    <FormItem label="可售卖状态">
                      {getFieldDecorator('sellState')(
                        <Select placeholder="请选择">
                          <Option value="">全部</Option>
                          <Option value="1">是</Option>
                          <Option value="0">否</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={12}>
                    <FormItem label="区域">
                      {getFieldDecorator('areaId')(
                        <Select placeholder="请选择">
                          <Option value="">全部</Option>
                          {area.map((item) => {
                            return <Option key={item.id} value={item.id}>{item.name}</Option>;
                          })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={12}>
                    <FormItem label="关键字">
                      {getFieldDecorator('selectParams')(
                        <Search
                          placeholder="操作项名称/ID关键字"
                          onSearch={this.handleSearch}
                          enterButton
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row className={styles.submitButtons} gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={12}>
                    <Button type="primary" onClick={this.clearSearch}>清空</Button>
                  </Col>
                  <Col md={8} sm={12}>
                    <Button type="primary" onClick={this.createOperationItem}>创建规则</Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>

          <CompositingTable
            loading={loading}
            data={list}
            page={page}
            handleTableChange={this.handleTableChange}
            onLogClick={this.handleLogClick}
            onDetailClick={this.handleDetailClick}
            onDelClick={this.handleDelClick}
          />
        </Card>
        <LogModal
          data={logList}
          page={logPage}
          loding={this.state.logModalLoading}
          logVisible={this.state.logModalVisible}
          logHandleCancel={this.logModalHandleCancel}
          logModalhandleTableChange={this.logModalhandleTableChange}
        />
        <CreateModal
          modalType={modalType}
          createModalVisible={createModalVisible}
          createModalHandleOk={this.createModalHandleOk}
          createModalHandleCancel={this.createModalHandleCancel}
          createModalConfirmLoading={createModalConfirmLoading}
          doctorGroupList={doctorGroupList}
          detail={detailData}
          onSellState={this.handleSellState}
          contentLeftTableLoading={contentLeftTableLoading}
          serviceItemList={serviceItemList}
          serviceItemPage={serviceItemPage}
          handleContentTableChange={this.handleContentTableChange}
          existingServiceItemList={existingServiceItemList}
          connectHandleAdd={this.connectHandleAdd}
          connectHandleChange={this.connectHandleChange}
          price={price}
          discountPrice={discountPrice}
          tags={tags}
          discountChange={this.discountChange}
          searchServiceItem={this.searchServiceItem}
          createmodalSellLoading={createmodalSellLoading}
          ref={this.saveFormRef}
        />

      </PageHeaderLayout>
    );
  }
}
