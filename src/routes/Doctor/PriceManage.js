import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Modal,
  message,
  Spin,
  Icon,
  Radio,
  Select,
  Table,
  Popconfirm,
  Checkbox,
  InputNumber,
} from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './PriceManage.less';
import { getUser } from '../../utils/authority';
import PriceManageTable from '../../components/Doctor/priceManageTable';

const FormItem = Form.Item;
const { Option } = Select;

let timeout;
let currentValue;

const CreateModal = Form.create()(
  (props) => {
    const {
      modalType,
      createModalVisible,
      createModalHandleCancel,
      createModalHandleOk,
      createModalConfirmLoading,
      createModalSelectFetching,
      createModalSelectHandleSerch,
      createModalSelectHandleChange,
      createModalSelectOptionData,
      createModalTableData,
      createModalHandleDelClick,
      createModalCheckboxChange,
      createModalInputChange,
      createModalPriceTalbeSource,
      createModalPriceTalbeLoading,
      form } = props;

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
      {
        title: '医生姓名',
        dataIndex: 'name',
        width: 150,
      },
      {
        title: '医生ID',
        dataIndex: 'id',
        width: 150,
      },
    ];

    const operating = {
      title: '操作',
      render: (text, item) => (
        <Fragment>
          <Popconfirm title="确认删除？" onConfirm={() => createModalHandleDelClick(item)}>
            <a style={{ color: '#FF0000' }}>删除</a>
          </Popconfirm>
        </Fragment>
      ),
    };

    if (modalType === 'create') {
      columns.push(operating);
    }

    const rightColumns = [
      {
        title: '接诊类型',
        dataIndex: 'id',
        className: 'price-checkbox',
        width: 100,
        render: (value, row, index) => {
          const obj = {
            children: <Checkbox checked={!!row.checked} key={index} onChange={(e) => { createModalCheckboxChange(e, row, index); }} />,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = createModalPriceTalbeSource.length - 1;
          } else if (index !== createModalPriceTalbeSource.length - 1) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: '时间',
        dataIndex: 'time',
        width: 100,
        render: (value, row, index) => {
          if (row.type === 1) {
            return row.time;
          } else {
            return '特需';
          }
        },
      },
      {
        title: '价格',
        render: (value, row, index) => (
          <InputNumber disabled={!row.checked} value={row.price || 0} min={0} key={index} onChange={(e) => { createModalInputChange(row, e); }} />
        ),
      },
    ];

    return (
      <Modal
        title={modalType === 'create' ? '添加医生' : '编辑医生'}
        width="900px"
        visible={createModalVisible}
        onOk={createModalHandleOk}
        confirmLoading={createModalConfirmLoading}
        onCancel={createModalHandleCancel}
      >
        <Row>
          <Col span={12} style={{ paddingRight: '10px' }}>
            {modalType === 'create' && (
              <FormItem {...formItemLayout} label="搜索医生">
                <Select
                  mode="multiple"
                  value={[]}
                  placeholder="输入医生姓名、医生ID点击添加"
                  notFoundContent={createModalSelectFetching ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={createModalSelectHandleSerch}
                  onChange={createModalSelectHandleChange}
                  style={{ width: '100%' }}
                >
                  {createModalSelectOptionData.map((item) => {
                    return <Option key={item.id} disabled={!!item.isAdd}>{item.name}</Option>
                  })}
                </Select>
              </FormItem>
            )}
            <Table
              bordered
              rowKey={record => record.id}
              dataSource={createModalTableData}
              columns={columns}
              pagination={false}
              scroll={{ y: 300 }}
              size="small"
            />
          </Col>
          <Col span={12} style={{ paddingLeft: '10px' }}>
            <Table
              bordered
              rowKey="id"
              loading={createModalPriceTalbeLoading}
              dataSource={createModalPriceTalbeSource}
              columns={rightColumns}
              pagination={false}
              scroll={{ y: 300 }}
              size="small"
            />
          </Col>
        </Row>
      </Modal>
    );
  }
);

@connect(({ priceManage, loading }) => ({
  priceManage,
  loading: loading.models.priceManage,
}))
@Form.create()
export default class PriceManage extends PureComponent {
  state = {
    pageNo: 1,
    keyword: '',
    createModalVisible: false,
    createModalConfirmLoading: false,
    createModalSelectOptionData: [],
    createModalSelectFetching: false,
    createModalTableData: [],
    createModalPriceTalbeSource: [],
    createModalPriceTalbeLoading: false,
    modalType: '',
    outpatientTimes: [],
  };

  componentDidMount = () => {
    this.getList();
    this.getOutpatientTimes();
  }

  // 获取列表
  getList = () => {
    this.props.dispatch({
      type: 'priceManage/getPriceManageList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          keyword: this.state.keyword,
          merchantId: getUser().merchantId,
        },
      },
    });
  }

  // 获取医生出诊时间基础信息
  getOutpatientTimes = () => {
    this.props.dispatch({
      type: 'priceManage/getOutpatientTimes',
      payload: {
        restParams: {
          merchantId: getUser().merchantId,
        },
      },
    }).then((resp) => {
      if (resp.code !== 0) {
        return;
      }
      this.setState({
        outpatientTimes: resp.data,
      });
    });
  }

  // 设置提交json
  setCreateSubmitData = (doctors, prices) => {
    const submitObj = {
      detail: [],
      doctorIds: '',
    };
    const obj1 = {
      times: [],
      type: 1,
    };
    const obj2 = {
      times: [],
      type: 2,
    };
    prices.forEach((item) => {
      if (item.type === 1) {
        if (item.checked) {
          obj1.times.push({ outPatientTimeId: item.id, price: item.price });
        }
      }
      if (item.type === 2) {
        if (item.checked) {
          obj2.times.push({ outPatientTimeId: item.id, price: item.price });
        }
      }
    });
    const doctorIds = doctors.map((item) => {
      return item.id;
    });
    if (obj1.times.length > 0) {
      submitObj.detail.push(obj1);
    }

    if (obj2.times.length > 0) {
      submitObj.detail.push(obj2);
    }
    submitObj.doctorIds = doctorIds.join(',');
    return submitObj;
  }

  // 设置modal 数据
  setModalData = (data) => {
    this.form.setFieldsValue({
      userName: data.userName || '',
      userEmail: data.userEmail || '',
      userMoblie: data.userMoblie || '',
      userTitle: data.userTitle || '',
      userOfficeAddress: data.userOfficeAddress || '',
      userDepartment: data.userDepartment || '',
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

  // 搜索
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        pageNo: 1,
        keyword: fieldsValue.keyword,
      }, () => {
        this.getList();
      });
    });
  }

  // 新建事件
  handleCreateClick = () => {
    const tableSource = JSON.parse(JSON.stringify(this.state.outpatientTimes));
    this.setState({
      createModalVisible: true,
      modalType: 'create',
      createModalPriceTalbeSource: tableSource,
    });
  }

  // 编辑modal 数据格式化
  parsePriceTalbeSource = (data) => {
    const tableSource = JSON.parse(JSON.stringify(this.state.outpatientTimes));
    tableSource.forEach((item) => {
      data.forEach((item2) => {
        if (item.id === item2.outpatientTimeId) {
          item.price = item2.price;
          item.checked = true;
        }
      });
    });
    return tableSource;
  }

  // 编辑modal 数据格式化
  parseTableData = (data) => {
    const tableData = [];
    data.forEach((item) => {
      const status = tableData.find(item2 => item2.id === item.merchantDoctorId);
      if (!status) {
        tableData.push({ id: item.merchantDoctorId, name: item.merchantDoctorName });
      }
    });
    return tableData;
  }

  // 编辑modal 编辑事件
  handleEditClick = (item) => {
    this.props.dispatch({
      type: 'priceManage/getDoctorPrice',
      payload: {
        restParams: {
          merchantId: getUser().merchantId,
          doctorId: item.merchantDoctorId,
        },
      },
    }).then((resp) => {
      if (resp.code !== 0) return;
      const PriceTalbeSource = this.parsePriceTalbeSource(resp.data);
      const tableData = this.parseTableData(resp.data);
      this.setState({
        createModalPriceTalbeSource: PriceTalbeSource,
        createModalTableData: tableData,
        createModalVisible: true,
        modalType: 'edit',
      });
    });
  }

  // 创建modal 取消事件
  createModalHandleCancel = () => {
    this.setState({
      createModalVisible: false,
      createModalPriceTalbeSource: [],
      createModalTableData: [],
    });
  }

  createFormRef = (form) => {
    this.form = form;
  }


  // 创建modal 搜索医生
  createModalSelectHandleSerch = (value) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = value;
    const fake = () => {
      this.setState({
        createModalSelectOptionData: [],
        createModalSelectFetching: true,
      });
      this.props.dispatch({
        type: 'priceManage/getDoctors',
        payload: {
          restParams: {
            merchantId: getUser().merchantId,
            keyword: currentValue,
          },
        },
      }).then((response) => {
        if (response.code !== 0) return;
        this.setState({
          createModalSelectOptionData: response.data,
          createModalSelectFetching: false,
        });
      });
    };
    timeout = setTimeout(fake, 500);
  }

  // 创建modal 表格删除项
  createModalHandleDelClick = (item) => {
    const tableData = [...this.state.createModalTableData];
    const index = tableData.indexOf(item);
    tableData.splice(index, 1);

    this.setState({
      createModalTableData: tableData,
    });
  }

  // 创建modal 选择医生
  createModalSelectHandleChange = (value) => {
    const doctor = this.state.createModalSelectOptionData.find(item => value[0] === item.id);
    const doctors = [...this.state.createModalTableData];
    const hasDoctor = doctors.find(item => item.id === doctor.id);

    if (hasDoctor) return;
    doctors.push(doctor);
    this.setState({
      createModalTableData: doctors,
      createModalSelectOptionData: [],
    });
  }

  // 创建modal 选择时间段
  createModalCheckboxChange = (e, row, index) => {
    const arr = [...this.state.createModalPriceTalbeSource];
    arr.forEach((item) => {
      if (item.type === row.type) {
        item.checked = e.target.checked;
      }
    });

    this.setState({
      createModalPriceTalbeSource: arr,
    });
  }

  // 创建modal 修改价格
  createModalInputChange = (row, e) => {
    const arr = [...this.state.createModalPriceTalbeSource];
    arr.forEach((item) => {
      if (item.id === row.id) {
        item.price = e;
      }
    });
    this.setState({
      createModalPriceTalbeSource: arr,
    });
  }

  // 创建modal 确认事件
  createModalHandleOk = () => {
    this.form.validateFields((err, values) => {
      if (err) {
        return;
      }

      if (this.state.createModalTableData.length < 1) {
        message.error('请添加医生');
        return;
      }
      const params = this.setCreateSubmitData(this.state.createModalTableData, this.state.createModalPriceTalbeSource);

      // 判断是否设置接诊类型，和价格
      // const times1 = params.detail[0].times;
      // const times2 = params.detail[1].times;
      // if (times1.length < 1 && times2.length < 1) {
      //   message.error('设置接诊类型和价格');
      //   return;
      // }
      // const times1Status = times1.find(item => item.price);
      // const times2Status = times2.find(item => item.price);
      // if (!times1Status && !times2Status) {
      //   message.error('设置接诊类型和价格');
      //   return;
      // }

      this.setState({
        createModalConfirmLoading: true,
      });
      this.props.dispatch({
        type: 'priceManage/postDoctorPrice',
        payload: {
          params,
          restParams: {
            merchantId: getUser().merchantId,
          },
        },
      }).then((resp) => {
        if (resp.code !== 0) {
          // message.error(resp.msg);
          this.setState({
            createModalConfirmLoading: false,
          });
          return;
        }
        this.getList();
        this.setState({
          createModalConfirmLoading: false,
          createModalVisible: false,
          createModalTableData: [],
        });
      });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { priceManage: { list, page }, loading } = this.props;
    const {
      keyword,
      createModalVisible,
      createModalConfirmLoading,
      createModalSelectFetching,
      createModalSelectOptionData,
      createModalTableData,
      createModalPriceTalbeSource,
      createModalPriceTalbeLoading,
      modalType,
    } = this.state;

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={12}>
                    <FormItem label="关键字">
                      {getFieldDecorator('keyword', {
                        initialValue: keyword,
                      })(
                        <Input placeholder="请输入医生姓名、医生ID" />
                        )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={12}>
                    <span className={styles.submitButtons}>
                      <Button type="primary" htmlType="submit">查询</Button>
                    </span>
                  </Col>
                </Row>
              </Form>
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleCreateClick(true)}>新建</Button>
            </div>
          </div>

          <PriceManageTable
            loading={loading}
            data={list}
            page={page}
            handleTableChange={this.handleTableChange}
            onEditClick={this.handleEditClick}
          />
        </Card>

        <CreateModal
          className={styles.createModal}
          ref={this.createFormRef}
          modalType={modalType}
          createModalVisible={createModalVisible}
          createModalHandleCancel={this.createModalHandleCancel}
          createModalHandleOk={this.createModalHandleOk}
          createModalConfirmLoading={createModalConfirmLoading}
          createModalSelectFetching={createModalSelectFetching}
          createModalSelectHandleSerch={this.createModalSelectHandleSerch}
          createModalSelectHandleChange={this.createModalSelectHandleChange}
          createModalSelectOptionData={createModalSelectOptionData}
          createModalTableData={createModalTableData}
          createModalHandleDelClick={this.createModalHandleDelClick}
          createModalCheckboxChange={this.createModalCheckboxChange}
          createModalInputChange={this.createModalInputChange}
          createModalPriceTalbeSource={createModalPriceTalbeSource}
          createModalPriceTalbeLoading={createModalPriceTalbeLoading}
        />
      </PageHeaderLayout>
    )
  }
}
