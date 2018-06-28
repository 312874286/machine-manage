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
  Select,
  Table,
  Popconfirm,
  InputNumber,
  DatePicker,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './PriceManage.less';
import { getUser } from '../../utils/authority';
import CommissionTable from '../../components/Doctor/CommissionTable';
import LogModal from '../../components/LogModal';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

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
      createModalDateChange,
      createModalHandleAbolishClick,
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
        dataIndex: 'doctorName',
        width: 80,
      },
      {
        title: '医生ID',
        dataIndex: 'id',
        width: 100,
      },
    ];
    const priceTable = {
      title: '价格',
      dataIndex: 'visitTypeCn',
      width: 100,
    };

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
      columns.push(priceTable);
      columns.push(operating);
    }

    function disabledDate(current) {
      return current && current < moment().endOf('day');
    }

    const rightColumns = [
      {
        title: '门诊类型',
        dataIndex: 'priceType',
        width: 100,
        render: (value, row, index) => {
          if (value === 1) {
            return '立即单';
          } else if (value === 2) {
            return '预约单';
          }
          return '';
        },
      },
      {
        title: '分成比例',
        width: 110,
        dataIndex: 'proportion',
        render: (value, row, index) => (
          <Input maxLength="3" value={value || 0} key={index} onChange={(e) => { createModalInputChange(row, e.target.value); }} />
        ),
      },
      {
        title: '分成比例期限',
        width: 230,
        render: (value, row, index) => {
          const obj = {
            children: (
              <p>{row.startDate}---{row.endDate}</p>
            ),
            props: {},
          };

          if (row.status === 1 || row.status === 999) {
            if (modalType === 'create') {
              obj.children = <RangePicker disabledDate={disabledDate} size="small" key={index} value={[row.startDate ? moment(row.startDate, 'YYYY-MM-DD') : '', row.endDate ? moment(row.endDate, 'YYYY-MM-DD') : '']} onChange={(e, date) => { createModalDateChange(row, e, date); }} />;
            } else if (modalType === 'edit') {
              if (row.status === 1) {
                obj.children = <RangePicker size="small" key={index} value={[row.startDate ? moment(row.startDate, 'YYYY-MM-DD') : '', row.endDate ? moment(row.endDate, 'YYYY-MM-DD') : '']} onChange={(e, date) => { createModalDateChange(row, e, date); }} />;
              } else {
                obj.children = <RangePicker disabledDate={disabledDate} size="small" key={index} value={[row.startDate ? moment(row.startDate, 'YYYY-MM-DD') : '', row.endDate ? moment(row.endDate, 'YYYY-MM-DD') : '']} onChange={(e, date) => { createModalDateChange(row, e, date); }} />;
              }
            }
          }


          if (index % 2 === 0) {
            obj.props.rowSpan = 2;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
    ];

    const rightAbolitionDate = {
      title: '废止日期',
      dataIndex: 'abolishTime',
      width: 100,
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };

        if (index % 2 === 0) {
          obj.props.rowSpan = 2;
        } else {
          obj.props.rowSpan = 0;
        }
        return obj;
      },
    };
    const rightOperating = {
      title: '操作',
      dataIndex: 'status',
      render: (value, row, index) => {
        const obj = {
          children: (
            <Fragment>
              <Popconfirm title="确认废止当前的分成比例？确认废止后，该分成比例当天0点结束。" onConfirm={() => createModalHandleAbolishClick(row)}>
                <a style={{ color: '#FF0000' }}>废止</a>
              </Popconfirm>
            </Fragment >
          ),
          props: {},
        };

        if (value === -1 || value === 999) {
          obj.children = '';
        }

        if (index % 2 === 0) {
          obj.props.rowSpan = 2;
        } else {
          obj.props.rowSpan = 0;
        }
        return obj;
      },
    };

    if (modalType === 'edit') {
      rightColumns.push(rightAbolitionDate);
      rightColumns.push(rightOperating);
    }


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
          <Col span={10} style={{ paddingRight: '10px' }}>
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
                    return <Option key={item.id} disabled={!parseInt(item.disabled)}>{item.doctorName}</Option>
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
          <Col span={14} style={{ paddingLeft: '10px' }}>
            <Table
              rowKey="id"
              bordered
              loading={createModalPriceTalbeLoading}
              dataSource={createModalPriceTalbeSource}
              columns={rightColumns}
              pagination={false}
              scroll={{ y: 300, x: '130%' }}
              size="small"
            />
          </Col>
        </Row>
      </Modal>
    );
  }
);

@connect(({ commission, loading, log }) => ({
  commission,
  log,
  loading: loading.models.commission,
}))
@Form.create()
export default class Commission extends PureComponent {
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
    logModalVisible: false,
    logModalLoading: false,
    logId: '',
    logModalPageNo: 1,

  };

  componentDidMount = () => {
    this.getList();
  }

  // 获取列表
  getList = () => {
    this.props.dispatch({
      type: 'commission/getCommissionList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          keyword: this.state.keyword,
          merchantId: getUser().merchantId,
        },
      },
    });
  }

  // 设置提交json
  setCreateSubmitData = (doctors, commission) => {
    const submitObj = {
      startDate: '',
      endDate: '',
      paasDoctorProportions: [],
    };

    const priceType1 = {};
    const priceType2 = {};

    const arr = [];
    commission.forEach((item) => {
      if (item.status === 1 || item.status === 999) {
        arr.push(item);
        if (item.priceType === 1) {
          priceType1.priceType = 1;
          priceType1.proportion = item.proportion;
        } else if (item.priceType === 2) {
          priceType2.priceType = 2;
          priceType2.proportion = item.proportion;
        }
      }
    });

    const doctorIds = doctors.map((item) => {
      return item.id;
    });

    submitObj.startDate = arr[0].startDate;
    submitObj.endDate = arr[0].endDate;
    submitObj.paasDoctorProportions.push(priceType1);
    submitObj.paasDoctorProportions.push(priceType2);
    submitObj.doctorIds = doctorIds;
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
    const tableSource = this.addEmptyTable([]);
    this.setState({
      createModalVisible: true,
      modalType: 'create',
      createModalPriceTalbeSource: tableSource,
    });
  }

  // 编辑modal 分成数据格式化
  addEmptyTable = (data) => {
    // if (!(data instanceof Array)) return;
    const emptyTable = [
      {
        id: 99999,
        priceType: 1,
        proportion: 0,
        newTable: true,
        abolishTime: '',
        status: 999,
      },
      {
        id: 99998,
        priceType: 2,
        proportion: 0,
        newTable: true,
        abolishTime: '',
        status: 999,
      },
    ];

    if (data.length === 0) {
      return emptyTable;
    }

    const status = data.find(item => item.status !== -1);
    if (!status) {
      return data.concat(emptyTable);
    }
    return data;
  }

  // 编辑modal 医生数据格式化
  parseTableData = (data) => {
    const tableData = [];
    data.forEach((item) => {
      const status = tableData.find(item2 => item2.id === item.doctorId);
      if (!status) {
        tableData.push({ id: item.doctorId, doctorName: item.doctorName });
      }
    });
    return tableData;
  }

  // 编辑modal 编辑事件
  handleEditClick = (item) => {
    this.setState({
      doctorDetail: item,
    });
    this.props.dispatch({
      type: 'commission/getCommissionDetail',
      payload: {
        restParams: {
          merchantId: getUser().merchantId,
          doctorId: item.doctorId,
        },
      },
    }).then((resp) => {
      if (resp.code !== 0) return;
      const PriceTalbeSource = this.addEmptyTable(resp.data.paasDoctorProportions);
      const tableData = this.parseTableData(resp.data.paasDoctorProportions);
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
        type: 'commission/getCommissionDoctor',
        payload: {
          restParams: {
            keyword: currentValue,
          },
        },
      }).then((resp) => {
        if (resp.code !== 0) return;
        this.setState({
          createModalSelectOptionData: resp.data,
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
    const doctor = this.state.createModalSelectOptionData.find(item => value[0] == item.id);
    const doctors = [...this.state.createModalTableData];
    const hasDoctor = doctors.find(item => item.id === doctor.id);
    // if (hasDoctor) return;
    if (hasDoctor) {
      message.error('该医生已被经添');
      return;
    }
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
        item.proportion = e;
      }
    });
    this.setState({
      createModalPriceTalbeSource: arr,
    });
  }

  // 创建modal 修改时间
  createModalDateChange = (row, e, date) => {
    const arr = [...this.state.createModalPriceTalbeSource];
    arr.forEach((item) => {
      if (item.id === row.id) {
        item.startDate = date[0];
        item.endDate = date[1];
      }
    });
    this.setState({
      createModalPriceTalbeSource: arr,
    });
  }

  // 创建modal 废止事件
  createModalHandleAbolishClick = () => {
    this.props.dispatch({
      type: 'commission/abolish',
      payload: {
        params: {
          doctorId: this.state.doctorDetail.doctorId,
        },
      },
    }).then((resp) => {
      if (resp.code !== 0) return;
      this.handleEditClick(this.state.doctorDetail);
    });
  }

  // 创建modal 确认事件
  createModalHandleOk = () => {
    this.form.validateFields((err, values) => {
      if (err) {
        return;
      }

      if (this.state.createModalTableData.length < 1) {
        message.error('请选择医生');
        return;
      }
      const params = this.setCreateSubmitData(this.state.createModalTableData, this.state.createModalPriceTalbeSource);
      if (!params.startDate) {
        message.error('请选择分成比例期限');
        return;
      }

      if (!params.startDate) {
        message.error('请选择分成比例期限');
        return;
      }
      for (const item of params.paasDoctorProportions) {
        if (isNaN(item.proportion) || item.proportion < 0 || item.proportion > 100) {
          message.error(`${item.priceType === 1 ? '立即单' : '预约单'}分成比例必须是0-100的整数`);
          return;
        }
      }
      this.setState({
        createModalConfirmLoading: true,
      });
      this.props.dispatch({
        type: 'commission/saveCommissionDoctor',
        payload: {
          params,
          restParams: {
            merchantId: getUser().merchantId,
          },
        },
      }).then((resp) => {
        if (resp.code !== 0) {
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const { commission: { list, page }, log: { logList, logPage }, loading } = this.props;
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

          <CommissionTable
            loading={loading}
            data={list}
            page={page}
            onLogClick={this.handleLogClick}
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
          createModalDateChange={this.createModalDateChange}
          createModalHandleAbolishClick={this.createModalHandleAbolishClick}
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
    )
  }
}
