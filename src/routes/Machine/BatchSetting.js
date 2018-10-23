import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Table,
  Button,
  Divider,
  message,
  Row,
  Col,
  Input,
  Modal,
  InputNumber
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './BatchSetting.less';
import BatchTableField from '../../components/Machine/batchTableSetting';
import BatchAisleSetting from '../../components/Machine/batchAisleSetting';
import {getAccountMenus} from "../../utils/authority";
import moment from "moment/moment";
import {RegexTool} from "../../utils/utils";

// const No = /^[+]{0,1}(\d){2}$/
const No = /^\d{2}$/
const FormItem = Form.Item;
const CreateForm = Form.create()(
  (props) => {
    const {
      modalVisible, form, handleAdd, handleModalVisible,
      editModalConfirmLoading, modalType, goodsInitData,
      goodsHandle, goodsHandleAdd, goodsHandleDelete,
      goodsHandleChange, shopHandle, getByteLen
    } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    return (
      <Modal
        title={
          <div class="modalBox">
            <span class="leftSpan"></span>
            <span class="modalTitle">{!modalType ? '编辑批次' : '新增批次'}</span>
          </div>
        }
        visible={modalVisible}
        onOk={handleAdd}
        onCancel={() => handleModalVisible(false)}
        confirmLoading={editModalConfirmLoading}
        width={800} >
        <div className="manageAppBox">
          <Form>
            <FormItem {...formItemLayout} label="批次名称">
              {getFieldDecorator('batchName', {
                rules: [{ required: true, whitespace: true, message: '请填写批次名称' },
                  {
                   validator: getByteLen
                  }],
              })(<Input placeholder="请填写批次名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="批次编号">
              {getFieldDecorator('id', {
                rules: [{ required: true, message: '请填写批次编号' },
                  {
                    validator(rule, value, callback) {
                      if (!No.test(value)) {
                        callback('批次编号只能是两位整数');
                      }
                      callback();
                    },
                  }],
              })(<InputNumber  placeholder="请填写两位整数" disabled={!modalType}/>)}
            </FormItem>
            {/*<FormItem {...formItemLayout} label="批次编号" style={{ display: !modalType ? '' : 'none'}}>*/}
              {/*{getFieldDecorator('id', {*/}
                {/*rules: [{ required: true, message: '请填写批次编号' }],*/}
              {/*})(<InputNumber  placeholder="请填写两位整数" disabled/>)}*/}
            {/*</FormItem>*/}
            <FormItem label="货道信息">
              <div className={styles.goodsNoteBox}>
                <FormItem>
                  <BatchTableField
                    initData={goodsInitData}
                    shopHandle={shopHandle}
                    goodsHandle={goodsHandle}
                    goodsHandleAdd={goodsHandleAdd}
                    goodsHandleDelete={goodsHandleDelete}
                    goodsHandleChange={goodsHandleChange}
                    shopClist={[]}
                    modalType={modalType}
                  />
                </FormItem>
              </div>
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  });
const ManageAisleForm = Form.create()(
  (props) => {
    const {
      ManageAislemodalVisible, ManageAisleEditModalConfirmLoading, ManageAisleHandleAddClick,
      ManageAisleHandleModalVisibleClick, modalData, AisleList,
    } = props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    return (
      <Modal
        title={
          <div class="modalBox">
            <span class="leftSpan"></span>
            <span class="modalTitle">查看批次</span>
          </div>
        }
        visible={ManageAislemodalVisible}
        onOk={ManageAisleHandleAddClick}
        onCancel={() => ManageAisleHandleModalVisibleClick(false)}
        confirmLoading={ManageAisleEditModalConfirmLoading}
        footer={null}
        width={1250}>
        <div className="manageAppBox">
          <Form>
            <FormItem {...formItemLayout} label="批次名称">
              <span>{modalData.batchName}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="批次编号">
              <span>{modalData.id}</span>
            </FormItem>
            <FormItem label="货道信息">
              <BatchAisleSetting
                AisleList={AisleList}
              />
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  });
@connect(({ common, loading, batchSetting }) => ({
  common,
  batchSetting,
  loading: loading.models.batchSetting,
}))
@Form.create()
export default class versionSetting extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    id: '',
    pageNo: 1,
    keyword: '',
    account: {},

    modalVisible: false,
    editModalConfirmLoading: false,
    modalType: true,
    goodsInitData: [],
    goodsCount: 0,

    ManageAislemodalVisible: false,
    ManageAisleEditModalConfirmLoading: false,
    AisleList: [],
    modalData: {},
  };
  componentDidMount() {
    this.getLists();
    // this.getAccountMenus(getAccountMenus())
  }
  getAccountMenus = (setAccountMenusList) => {
    let account = setAccountMenusList.filter((item) => item.path === 'check')
    var obj = {}
    if (account[0]) {
      account = account[0].children.filter((item) => item.path === 'fault')
      if (account[0].children) {
        account[0].children.forEach((item, e) => {
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
      type: 'batchSetting/batchList',
      payload: {
        params: {
          pageNo: this.state.pageNo,
          keyword: this.state.keyword
        },
      },
    });
  }
  getByteLen = (rule, value, callback) => {
    let len = 0;
    for (let i = 0; i < value.length; i++) {
      let length = value.charCodeAt(i);
      if(length >= 0 && length <= 128)
      {
        len += 1;
      }
      else
      {
        len += 2;
      }
    }
    if(len > 40){
      callback('批次名称长度为最大40位，其中中文算两个字符！')
    }
    callback()
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
    });
  };
  // 搜索
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        keyword: fieldsValue.keyword ? fieldsValue.keyword : '',
      }, () => {
        this.getLists();
      });
    });
  };
  // 新增modal确认事件 结束
  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={9} sm={24}>
            <FormItem>
              {getFieldDecorator('keyword')(<Input placeholder="输入批次名称，批次编号搜索" />)}
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
  saveFormRef = (form) => {
    this.form = form;
  }
  add = () => {
    this.setState({
      modalVisible: true
    })
    this.setModalData()
  }
  // 添加modal 添加事件
  handleModalVisible = (flag) => {
    this.setState({
      goodsInitData: [],
      goodsCount: 0,
    }, () => {
      this.setState({
        modalVisible: !!flag,
        modalData: {},
        modalType: true,
      });
      this.setModalData();
    })
  };
  // 设置modal 数据
  setModalData = (data) => {
    if (data) {
      this.form.setFieldsValue({
        id: data.id,
        batchName: data.batchName,
      });
    } else {
      // this.goodsHandleAdd()
      this.form.setFieldsValue({
        id: undefined,
        batchName: undefined,
      });
    }
  }
  // 商品信息及优惠券的操作开始
  goodsHandle = (initData, value, record, key) => {
    console.log('initData', initData)
    record = this.getGoodsNumber(value, record, initData, key)
    console.log('record', record)
    this.setState({
      goodsTables: [...this.state.goodsTables, record]
    }, () => {
      this.setState({
        goodsInitData: record,
        goodsLists: []
      });
    })
  }
  getGoodsNumber = (value, record, initData, key) => {
    const { goodsLists } = this.state
    for (let j = 0; j < initData.length; j++) {
      if (initData[j].key === key) {
        for (var i = 0; i < goodsLists.length; i++ ) {
          if (goodsLists[i].id === value) {
            record.number = goodsLists[i].number
          }
        }
      }
    }
    return initData;
  }
  shopHandle = (shopId) => {
    this.getGoodsLists(shopId)
  }
  goodsHandleAdd = (val, currentValue) => {
    const { goodsInitData, goodsCount } = this.state;
    const newData = {
      key: goodsCount,
      rowNo: goodsCount + 1,
      count: undefined,
      type: undefined,
      volumeCount: 0,
    };
    this.setState({
      goodsInitData: [...goodsInitData, newData],
      goodsCount: goodsCount+1,
    });
  }
  goodsHandleDelete = (key) => {
    const goodsInitData = [...this.state.goodsInitData];
    this.setState({ goodsInitData: goodsInitData.filter(item => item.key !== key) });
  }
  goodsHandleChange = (row) => {
    const newData = [...this.state.goodsInitData];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ goodsInitData: newData });
  }
  edit = (item) => {
    this.props.dispatch({
      type: 'batchSetting/batchDetail',
      payload: {
        restParams: {
          id: item.id
        },
      },
    }).then((res) => {
      if (res && res.code === 0) {
        console.log('res', res)
        this.setModalData(res.data)
        this.setState({
          goodsInitData: [],
          goodsCount: 0,
        }, () => {
          this.setState({
            modalData: item,
            goodsInitData: res.data.detailList.map((item, index) => {
              return {
                key: index,
                rowNo: item.rowNo,
                count: item.count,
                type: item.type,
                volumeCount: item.volumeCount,
              }
            }),
            goodsCount: res.data.detailList.length
          }, () => {
            this.setState({
              modalVisible: true,
              modalType: false,
            })
          })
        })
      }
    });
  }
  handleAdd = () => {
    this.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      if (this.state.goodsInitData.length === 0) {
        message.warn('请添加货道信息')
        return;
      }
      let params = {
        ...fieldsValue,
        detailList: this.state.goodsInitData
      };
      this.setState({
        editModalConfirmLoading: true,
      });
      let url = 'batchSetting/addBatch';
      let messageTxt = '新增';
      if (this.state.modalData.id) {
        url = 'batchSetting/updateBatch';
        params = { ...params, id: this.state.modalData.id };
        messageTxt = '编辑';
      }
      this.props.dispatch({
        type: url,
        payload: {
          params,
        },
      }).then((resp) => {
        if (resp && resp.code === 0) {
          this.setState({
            goodsCount: 0,
            goodsInitData: [],
          }, () => {
            this.getLists();
          });
        } else {
          this.setState({
            editModalConfirmLoading: false,
          });
          return;
        }
        this.setState({
          editModalConfirmLoading: false,
          modalVisible: false,
          modalType: true
        });
      });
    })
  }

  // 管理货道开始
  handleManageAisleClick = (item) => {
    this.setState({
      modalVisible: false,
      modalData: item,
      editPointmodalVisible: false,
      ManageAppmodalVisible: false,
    }, () => {
      this.getAisleList();
    });
  }
  getAisleList = () => {
    this.props.dispatch({
      type: 'batchSetting/batchDetail',
      payload: {
        restParams: {
          id: this.state.modalData.id,
        },
      },
    }).then((result) => {
      if (result && result.code === 0) {
        this.setState({
          ManageAislemodalVisible: true,
        }, () => {
          if (result.data.detailList.length > 0) {
            const res = result.data.detailList
            console.log('res[res.length - 1]', res[res.length - 1].rowNo)
            this.setState({
              AisleList: res,
            });
          }
        });
      }
    });
  }
  ManageAisleHandleModalVisibleClick = (flag) => {
    this.setState({
      ManageAislemodalVisible: !!flag,
    });
  };
  // 管理货道结束
  render() {
    const {
      batchSetting: { list },
      loading,
    } = this.props;
    const { account } = this.state
    const columns = [
      {
        title: '批次名称',
        dataIndex: 'batchName',
        width: '20%',
      },
      {
        title: '批次编号',
        width: '20%',
        dataIndex: 'id',
      },
      {
        title: '创建人',
        dataIndex: 'createUser',
        width: '20%',
      },
      {
        title: '创建时间',
        dataIndex: 'updateTime',
      },
      {
        fixed: 'right',
        width: 150,
        title: '操作',
        render: (text, item) => (
          <Fragment>
            <a
              onClick={() => this.handleManageAisleClick(item)}>
              查看
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => this.edit(item)}>
              编辑
            </a>
          </Fragment>
        ),
      },
    ];
    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
          <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
        </Card>
        <Card bordered={false}>
          <Button icon="plus" type="primary" onClick={() => this.add()}>
            新增
          </Button>
          <div className={styles.tableList}>
            <Table
              loading={loading}
              rowKey={record => record.id}
              dataSource={list}
              columns={columns}
              pagination={false}
              onChange={this.handleTableChange}
              scroll={{ x: scrollX ? scrollX : 1050, y: scrollY ? scrollY : (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 34)}}
            />
          </div>
        </Card>
        <CreateForm
          ref={this.saveFormRef}
          modalVisible={this.state.modalVisible}
          handleAdd={this.handleAdd}
          handleModalVisible={this.handleModalVisible}
          editModalConfirmLoading={this.state.editModalConfirmLoading}
          modalType={this.state.modalType}
          goodsInitData={this.state.goodsInitData}
          goodsHandle={this.goodsHandle}
          goodsHandleAdd={this.goodsHandleAdd}
          goodsHandleDelete={this.goodsHandleDelete}
          goodsHandleChange={this.goodsHandleChange}
          shopHandle={this.shopHandle}
          getByteLen={this.getByteLen}
        />
        <ManageAisleForm
          ref={this.saveManageAisleFormRef}
          ManageAislemodalVisible={this.state.ManageAislemodalVisible}
          ManageAisleEditModalConfirmLoading={this.state.ManageAisleEditModalConfirmLoading}
          ManageAisleHandleAddClick={this.ManageAisleHandleAddClick}
          ManageAisleHandleModalVisibleClick={this.ManageAisleHandleModalVisibleClick}
          AisleList={this.state.AisleList}
          modalData={this.state.modalData}
        />
      </PageHeaderLayout>
    );
  }
}
