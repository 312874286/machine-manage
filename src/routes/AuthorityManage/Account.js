import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
import { Table } from 'antd';
// import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Account.less';
// import { getTestList } from '../../services/authorityManage/account';
// import LogModal from '../../components/LogModal';
// import EditableTagGroup from '../../components/Tag';
// import {area} from "../../common/config/area";


// const FormItem = Form.Item;
// const { Option } = Select;
// const RadioGroup = Radio.Group;
// const getValue = obj =>
//   Object.keys(obj)
//     .map(key => obj[key])
//     .join(',');
// const statusMap = ['default', 'processing', 'success', 'error'];
// const status = ['关闭', '运行中', '已上线', '异常'];

// const CreateForm = Form.create()(
//   (props) => {
//     const { modalVisible, form, handleAdd, handleModalVisible, editModalConfirmLoading, handleTags, modalData } = props;
//     // const okHandle = () => {
//     //   form.validateFields((err, fieldsValue) => {
//     //     if (err) return;
//     //     form.resetFields();
//     //     handleAdd(fieldsValue);
//     //   });
//     // };
//     const { getFieldDecorator } = form;
//     const formItemLayout = {
//       labelCol: {
//         xs: { span: 24 },
//         sm: { span: 4 },
//       },
//       wrapperCol: {
//         xs: { span: 24 },
//         sm: { span: 16 },
//       },
//     };
//     return (
//       <Modal
//         title={getFieldDecorator('machine_id') ? '编辑机器' : '新建机器'}
//         visible={modalVisible}
//         onOk={handleAdd}
//         onCancel={() => handleModalVisible()}
//         confirmLoading={editModalConfirmLoading}
//       >
//         <Form onSubmit={this.handleSearch}>
//           <FormItem {...formItemLayout} label="机器ID">
//             {getFieldDecorator('machine_id', {
//               rules: [{ required: true, message: '请输入机器ID' }],
//             })(<Input placeholder="请输入机器ID" />)}
//           </FormItem>
//           <FormItem {...formItemLayout} label="机器名称">
//             {getFieldDecorator('machine_name', {
//               rules: [{ required: true, message: '请输入机器名称' }],
//             })(<Input placeholder="请输入机器名称" />)}
//           </FormItem>
//           <FormItem {...formItemLayout} label="选择点位">
//             {getFieldDecorator('locale_id', {
//               rules: [{ required: true, message: '请选择点位' }],
//             })(<Input placeholder="请选择点位" />)}
//           </FormItem>
//           <FormItem {...formItemLayout} label="机器状态">
//             {getFieldDecorator('status', {
//               rules: [{ required: true, message: '请选择机器状态' }],
//               initialValue: '1',
//             })(
//               <RadioGroup>
//                 <Radio value="0">不可用</Radio>
//                 <Radio value="1">可用</Radio>
//               </RadioGroup>
//             )}
//           </FormItem>
//           <FormItem {...formItemLayout} label="机器标签">
//             {getFieldDecorator('tags', {
//               rules: [{ required: true, message: '请填写机器标签' }],
//               initialValue: { tags: modalData.tags, },
//             })(
//               <EditableTagGroup
//                 handleTags={handleTags}
//               />
//             )}
//           </FormItem>
//         </Form>
//       </Modal>
//     );
// });
// @Form.create()
@connect(({ account }) => ({ account }))
export default class Account extends PureComponent {
  componentDidMount = () => {
    this.getTestList();
  }
  getTestList = () => {
    this.props.dispatch({
      type: 'account/getTestList',
      payload: {
        restParams: {
          pageNo: 'pageno',
          keyword: 222,
        },
      },
    });
  }
  render() {
      const { account: { dataSource } } = this.props;
      const columns = [{
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
      }, {
        title: '住址',
        dataIndex: 'address',
        key: 'address',
    }];
    
    return (
      <PageHeaderLayout>
        <Table dataSource={dataSource} columns={columns} />
      </PageHeaderLayout>
    );
  }
}

// export default class machineSettingList extends PureComponent {
//   state = {
//     modalVisible: false,
//     expandForm: false,
//     selectedRows: [],
//     formValues: {},
//     id: '',
//     options: '',
//     editModalConfirmLoading: false,
//     pageNo: 1,
//     keyword: '',
//     modalData: {},
//     logModalVisible: false,
//     logModalLoading: false,
//     logId: '',
//     logModalPageNo: 1,
//   };
//   componentDidMount() {
//     this.getLists();
//   }
//   // 获取点位管理列表
//   getLists = () => {
//     this.props.dispatch({
//       type: 'machineSetting/getMachineSettingList',
//       payload: {
//         restParams: {
//           pageNo: this.state.pageNo,
//           keyword: this.state.keyword,
//         },
//       },
//     });
//   }
//   // 分页
//   handleStandardTableChange = (pagination, filtersArg, sorter) => {
//     const { dispatch } = this.props;
//     const { formValues } = this.state;

//     const filters = Object.keys(filtersArg).reduce((obj, key) => {
//       const newObj = { ...obj };
//       newObj[key] = getValue(filtersArg[key]);
//       return newObj;
//     }, {});

//     const params = {
//       currentPage: pagination.current,
//       pageSize: pagination.pageSize,
//       ...formValues,
//       ...filters,
//     };
//     if (sorter.field) {
//       params.sorter = `${sorter.field}_${sorter.order}`;
//     }
//     const { current } = pagination;
//     // console.log('params', params)
//     this.setState({
//       pageNo: current,
//     }, () => {
//       this.getLists();
//     });
//   };
//   // 重置
//   handleFormReset = () => {
//     const { form, dispatch } = this.props;
//     form.resetFields();
//     this.setState({
//       formValues: {},
//     });
//     dispatch({
//       type: '',
//       payload: {},
//     });
//   };

//   toggleForm = () => {
//     const { expandForm } = this.state;
//     this.setState({
//       expandForm: !expandForm,
//     });
//   };
//   // 批量
//   handleMenuClick = e => {
//     const { dispatch } = this.props;
//     const { selectedRows } = this.state;

//     if (!selectedRows) return;

//     switch (e.key) {
//       case 'remove':
//         dispatch({
//           type: '',
//           payload: {
//             no: selectedRows.map(row => row.no).join(','),
//           },
//           callback: () => {
//             this.setState({
//               selectedRows: [],
//             });
//           },
//         });
//         break;
//       default:
//         break;
//     }
//   };

//   handleSelectRows = rows => {
//     this.setState({
//       selectedRows: rows,
//     });
//   };
//   // 搜索
//   handleSearch = e => {
//     e.preventDefault();
//     const { form } = this.props;
//     form.validateFields((err, fieldsValue) => {
//       if (err) return;
//       // const values = {
//       //   ...fieldsValue,
//       //   updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
//       // };
//       // this.setState({
//       //   formValues: values,
//       // });
//       this.setState({
//         pageNo: 1,
//         keyword: fieldsValue.keyword,
//       }, () => {
//         this.getLists();
//       });
//     });
//   };
//   // 添加modal 添加事件
//   handleModalVisible = (flag) => {
//     this.setState({
//       modalVisible: !!flag,
//       modalData: {},
//     });
//     this.setModalData();
//   };
//   // 删除modal 删除事件
//   handleDelClick = (item) => {
//     this.setState({
//       editModalConfirmLoading: true,
//     });
//     if (item) {
//       const params = { id: item.id };
//       this.props.dispatch({
//         type: 'machineSetting/delMachineSetting',
//         payload: {
//           params,
//         },
//       }).then(() => {
//         message.success('Click on Yes');
//         this.getLists();
//         this.setState({
//           editModalConfirmLoading: false,
//         });
//       });
//     } else return false;
//   }
//   // 编辑modal 编辑事件
//   handleEditClick = (item) => {
//     item.tags = item.tag.split('，');
//     console.log('handleEditClick', item)
//     this.setState({
//       modalVisible: true,
//       modalData: item,
//     });
//     this.setModalData(item);
//   }
//   // 设置modal 数据
//   setModalData = (data) => {
//     if (data) {
//       this.form.setFieldsValue({
//         machine_id: data.machine_id || '',
//         machine_name: data.machine_name || '',
//         locale_id: data.locale_id || '',
//         tag: data.tag,
//         status: data.status,
//       });
//     } else {
//       this.form.setFieldsValue({
//         machine_id: '',
//         machine_name: '',
//         locale_id: '',
//         tag: '',
//         status: '',
//       });
//     }
//   }
//   // 新增modal确认事件 开始
//   saveFormRef = (form) => {
//     this.form = form;
//   }
//   // 编辑modal 确认事件
//   handleAdd = () => {
//     this.form.validateFields((err, values) => {
//       if (err) {
//         return;
//       }
//       this.setState({
//         editModalConfirmLoading: true,
//         modalData: {},
//       });
//       let url = 'machineSetting/saveMachineSetting';
//       let params = { ...values };
//       if (this.state.modalData.id) {
//         url = 'machineSetting/editMachineSetting';
//         params = { ...values, id: this.state.modalData.id };
//       }
//       this.props.dispatch({
//         type: url,
//         payload: {
//           params,
//         },
//       }).then(() => {
//         this.getLists();
//         this.setState({
//           editModalConfirmLoading: false,
//           modalVisible: false,
//         });
//       });
//     });
//   }
//   // 新增modal确认事件 结束
//   // tag设置开始
//   handleTags = (val) => {
//     this.setState({
//       modalData: { tags: val },
//     });
//   }
//   // tag设置结束
//   // 日志相关
//   getLogList = () => {
//     this.props.dispatch({
//       type: 'log/getLogList',
//       payload: {
//         restParams: {
//           code: this.state.logId,
//           pageNo: this.state.logModalPageNo,
//           type: 1020403,
//         },
//       },
//     }).then(() => {
//       this.setState({
//         logModalLoading: false,
//       });
//     });
//   }

//   handleLogClick = (data) => {
//     this.setState({
//       logModalVisible: !!data,
//       logModalLoading: true,
//       logId: data.id,
//     }, () => {
//       this.getLogList();
//     });
//   }

//   logModalHandleCancel = () => {
//     this.setState({
//       logModalVisible: false,
//     });
//   }

//   logModalhandleTableChange = (pagination) => {
//     const { current } = pagination;
//     this.setState({
//       logModalPageNo: current,
//     }, () => {
//       this.getLogList();
//     });
//   }
//   renderAdvancedForm() {
//     const { form } = this.props;
//     const { getFieldDecorator } = form;
//     return (
//       <Form onSubmit={this.handleSearch} layout="inline">
//         <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
//           <Col md={9} sm={24}>
//             <FormItem label="关键字">
//               {getFieldDecorator('keyword')(<Input placeholder="请输入机器ID、机器名称、标签" />)}
//             </FormItem>
//           </Col>
//           <Col md={6} sm={24}>
//             <span style={{ float: 'right' }}>
//                <FormItem>
//                   <Button onClick={this.handleFormReset}>
//                     重置
//                   </Button>
//                   <Button className={styles.serach} style={{ marginLeft: 8, background: 'rgba(245, 75, 48, 1)' }} type="primary" htmlType="submit">
//                     查询
//                   </Button>
//                </FormItem>
//             </span>
//           </Col>
//         </Row>
//       </Form>
//     );
//   }
//   // 四级联动结束
//   renderForm() {
//     const { expandForm } = this.state;
//     return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
//   }
//   render() {
//     const {
//       machineSetting: { list, page },
//       loading,
//       log: { logList, logPage },
//     } = this.props;
//     const { selectedRows, modalVisible, editModalConfirmLoading, modalData } = this.state;
//     const columns = [
//       {
//         title: '机器ID',
//         dataIndex: 'machine_id',
//       },
//       {
//         title: '机器名称',
//         dataIndex: 'machine_name',
//       },
//       {
//         title: '所属点位',
//         dataIndex: 'locale_id',
//       },
//       {
//         title: '标签名称',
//         dataIndex: 'tag',
//         // render(val) {
//         //   let tags = val.split('，')
//         //   tags.map((item) => {
//         //     return (
//         //       <Tag>{item}</Tag>
//         //     );
//         //   });
//         // },
//       },
//       {
//         title: '状态',
//         dataIndex: 'status',
//         filters: [
//           {
//             text: status[0],
//             value: 0,
//           },
//           {
//             text: status[1],
//             value: 1,
//           },
//           {
//             text: status[2],
//             value: 2,
//           },
//           {
//             text: status[3],
//             value: 3,
//           },
//         ],
//         onFilter: (value, record) => record.status.toString() === value,
//         render(val) {
//           return <Badge status={statusMap[val]} text={status[val]} />;
//         },
//       },
//       {
//         title: '创建人员',
//         dataIndex: 'create_id',
//       },
//       {
//         title: '创建时间',
//         dataIndex: 'create_time',
//         sorter: true,
//         render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
//       },
//       {
//         title: '更新人员',
//         dataIndex: 'update_id',
//       },
//       {
//         title: '更新时间',
//         dataIndex: 'update_time',
//         sorter: true,
//         render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
//       },
//       {
//         fixed: 'right',
//         title: '操作',
//         render: (text, item) => (
//           <Fragment>
//             <a onClick={() => this.handleEditClick(item)}>编辑</a>
//             <Divider type="vertical" />
//             <a onClick={() => this.handleLogClick(item)}>日志</a>
//             <Divider type="vertical" />
//             <Popconfirm title="确定要删除吗" onConfirm={() => this.handleDelClick(item)} okText="Yes" cancelText="No">
//               <a>删除</a>
//             </Popconfirm>
//           </Fragment>
//         ),
//       },
//     ];
//     // this.state.options = this.props.common.list
//     const menu = (
//       <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
//         <Menu.Item key="remove">删除</Menu.Item>
//         <Menu.Item key="approval">批量审批</Menu.Item>
//       </Menu>
//     );
//     const parentMethods = {
//       handleAdd: this.handleAdd,
//       handleModalVisible: this.handleModalVisible,
//     };

//     return (
//       <PageHeaderLayout>
//         <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
//           <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
//         </Card>
//         <Card bordered={false}>
//           <div className={styles.tableList}>
//             <div className={styles.tableListOperator}>
//               <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
//                 新建
//               </Button>
//               {selectedRows.length > 0 && (
//                 <span>
//                   <Button>批量操作</Button>
//                   <Dropdown overlay={menu}>
//                     <Button>
//                       更多操作 <Icon type="down" />
//                     </Button>
//                   </Dropdown>
//                 </span>
//               )}
//             </div>
//             <StandardTable
//               selectedRows={selectedRows}
//               loading={loading}
//               data={list}
//               page={page}
//               columns={columns}
//               onSelectRow={this.handleSelectRows}
//               onChange={this.handleStandardTableChange}
//               scrollX={1250}
//             />
//           </div>
//         </Card>
//         <CreateForm
//           {...parentMethods}
//           ref={this.saveFormRef}
//           modalVisible={modalVisible}
//           handleTags={this.handleTags}
//           editModalConfirmLoading={editModalConfirmLoading}
//           modalData={modalData}
//         />
//         <LogModal
//           data={logList}
//           page={logPage}
//           loding={this.state.logModalLoading}
//           logVisible={this.state.logModalVisible}
//           logHandleCancel={this.logModalHandleCancel}
//           logModalhandleTableChange={this.logModalhandleTableChange}
//         />
//       </PageHeaderLayout>
//     );
//   }
// }
