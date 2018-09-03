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
  Button,
  Menu,
  Modal,
  message,
  Tree,
  Table,
  Transfer,
  Cascader,
  Popconfirm,
  Icon,
  Alert,
  Divider,
} from 'antd';
import StandardTable from '../../components/StandardTable/index';
import styles from './User.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {RegexTool} from "../../utils/utils";

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const TreeNode = Tree.TreeNode;
const CreateForm = Form.create()(
  (props) => {
    const { modalVisible, form, handleAdd, handleModalVisible, editModalConfirmLoading, modalType, modalData, selectCityName, openSelectMachineModal, machineNum, options, loadData, verifyString } = props;
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
            <span class="modalTitle">{!modalType ? '编辑人员信息' : '新建人员'}</span>
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
          <FormItem {...formItemLayout} label="姓名">
            {getFieldDecorator('name', {
              rules: [{ required: true, whitespace: true, message: '请输入姓名' }],
            })(<Input placeholder="请输入姓名" />)}
          </FormItem>
          <Form.Item {...formItemLayout} label="手机号码">
            {getFieldDecorator('phone', {
              validateFirst: true,
              rules: [
                { type: 'string', required: true, message: '请输入手机号' },
                {
                  validator(rule, value, callback) {
                    if (!(RegexTool.mobile.test(value))) {
                      callback('请输入正确的手机号');
                    }
                    callback();
                  },
                }],
            })(<Input placeholder="请输入手机号码"  />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="身份证号">
            {getFieldDecorator('cardNo', {
              validateFirst: true,
              rules: [
                { type: 'string', required: true, message: '请输入身份证号' },
                {
                  validator(rule, value, callback) {
                    if (!(RegexTool.idCard.test(value))) {
                      callback('请输入正确的身份证号');
                    }
                    callback();
                  },
                },
              ],
            })(<Input placeholder="请输入身份证号"  />)}
          </Form.Item>
          <FormItem {...formItemLayout} label="公司">
            {getFieldDecorator('enterprise', {
              rules: [{ required: true, whitespace: true, message: '请输入公司' }],
            })(<Input placeholder="请输入公司" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="选择机器">
            {getFieldDecorator('remark', {
              rule: [{ validator: '' }],
            }) ((modalData.id) ? (
              <div>
                <div>
                  { selectCityName.length > 0
                    ? '已选择' + machineNum + '台机器，分别位于' + selectCityName.join('、')
                    :
                    (modalData ? modalData.remark : '暂无')
                  }
                </div>
                <Button type="primary" onClick={openSelectMachineModal}>+ 选择</Button>
              </div>
             ) : (
              <div>
                { selectCityName.length > 0 ? '已选择' + machineNum + '台机器，分别位于' + selectCityName.join('、') : '' }
                <Button type="primary" onClick={openSelectMachineModal}>+ 选择</Button>
              </div>
            ))}
          </FormItem>
          <FormItem {...formItemLayout} label="负责区域">
            {getFieldDecorator('area', {
              // rules: [{ required: false, message: '请选择负责区域' }, {
              //   validator: verifyString, type: 'array'
              // }],
            })(
              <Cascader
                placeholder="请选择"
                options={options}
                loadData={loadData}
                changeOnSelect
              />
            )}
          </FormItem>
        </Form>
        </div>
      </Modal>
    );
  });
const WatchMachine = Form.create()(
  (props) => {
    const { WatchMachineModalVisible, WatchMachineHandleModalVisibleClick, machineList } = props;
    const machineColumns = [{
      title: '机器点位',
      dataIndex: 'machineLocale',
      align: 'left',
      width: '80%'
    }, {
      title: '机器编码',
      dataIndex: 'machineCode',
      align: 'left',
      width: '20%'
    }];
    return (
      <Modal
        title={
          <div class="modalBox">
            <span class="leftSpan"></span>
            <span class="modalTitle">查看机器</span>
          </div>
        }
        width={800}
        visible={WatchMachineModalVisible}
        onCancel={() => WatchMachineHandleModalVisibleClick()}
        footer={null}
      >
          <div style={{ paddingBottom: '30px' }} className={styles.watchMachineBox}>
            <Table columns={machineColumns} dataSource={machineList} rowKey={record => record.machineCode} pagination={false} />
         </div>
      </Modal>
    );
  });
const SelectMachineForm = Form.create()(
  (props) => {
    const { editMachineModalVisible, form,
      onEditMachineHandleAddClick, onEditMachineHandleModalVisibleClick, editMachineEditModalConfirmLoading, insertOptions,
      loadData, addData, targetData, onChangeRowSelection, selectedRowKeys, onSelectAll, sourceData, handleSave, selectAll,
      onLeftSelect, targetHandleSave, targetHandleDelete, findSourceData
    } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    };
    this.columns = [{
      title: '名称',
      dataIndex: 'machineCode',
      render: text => <a href="javascript:;">{text}</a>,
    }];
    const columns = this.columns.map((col) => {
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
          handleSave: handleSave,
        }),
      };
    });

    const rowSelection = {
      selectedRowKeys,
      onChange: onChangeRowSelection,
      onSelect: onLeftSelect,
      onSelectAll: onSelectAll,
    };
    this.columnsRight = [{
      title: '名称',
      dataIndex: 'machineCode',
      render: text => <a href="javascript:;">{text}</a>,
    }, {
      title: '操作',
      width: 70,
      dataIndex: 'operation',
      render: (text, record) => {
        return (
          targetData.length > 0
            ? (
              <Popconfirm title="确认要删除吗?" onConfirm={() => targetHandleDelete(record.machineCode)}>
                <a href="javascript:;">删除</a>
              </Popconfirm>
            ) : null
        );
      }
    }];
    const columnsRight = this.columnsRight.map((col) => {
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
          handleSave: targetHandleSave,
        }),
      };
    });

    return (
      <Modal
        title="选择机器"
        visible={editMachineModalVisible}
        onOk={onEditMachineHandleAddClick}
        onCancel={() => onEditMachineHandleModalVisibleClick()}
        confirmLoading={editMachineEditModalConfirmLoading}
        width={1000}>
        <div className="manageAppBox">
          <Form onSubmit={this.handleSearch}>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={10} sm={24}>
              <FormItem>
                {getFieldDecorator('provinceCityAreaTrade')(
                  <Cascader
                  placeholder="请选择"
                  options={insertOptions}
                  loadData={loadData}
                  changeOnSelect
                  />
                )}
              </FormItem>
            </Col>
            <Col md={2} sm={24} style={{ paddingLeft: '3px' }}>
             <FormItem>
               <Button onClick={() => findSourceData()} style={{ width: '70px', borderRadius: '4px' }}>
               搜索
               </Button>
             </FormItem>
            </Col>
          </Row>
          <FormItem {...formItemLayout}>
            {getFieldDecorator('machine')(
              <div style={{ display: 'flex' }}>
                <div>
                  <Alert
                  message={(
                  <div>
                    已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}/{sourceData.length} </a> 项
                  </div>
                  )}
                  type="info"
                  showIcon
                  />
                  <Table
                    rowKey={record => record.machineCode}
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={sourceData}
                    id="leftTable"
                    style={{ width: '460px', marginBottom: '20px', marginTop: '10px' }}
                    scroll={{ y: 200 }}
                    pagination={false}
                  />
                  <Button onClick={() => addData()} style={{ display: selectAll ? 'block' : 'none' }}>
                    添加
                  </Button>
                </div>
                <div style={{ marginLeft: '20px' }}>
                  <Alert
                    message={(
                      <div>
                        已有 <a style={{ fontWeight: 600 }}>{targetData.length}</a> 项
                      </div>
                    )}
                    type="success"
                    showIcon
                  />
                  <Table
                    rowKey={record => record.machineCode}
                    columns={columnsRight}
                    dataSource={targetData}
                    id="rightTable"
                    style={{ width: '460px', marginTop: '10px' }}
                    scroll={{ y: 200 }}
                    pagination={false}/>
                </div>
              </div>
            )}
          </FormItem>
        </Form>
        </div>
      </Modal>
    );
  });
const userStatus = ['启用', '停用']
@connect(({ common, loading, user }) => ({
  common,
  user,
  loading: loading.models.user,
}))
@Form.create()
export default class user extends PureComponent {
  state = {
    modalVisible: false,
    formValues: {},
    editModalConfirmLoading: false,
    pageNo: 1,
    keyword: '',
    modalData: {},
    modalType: true,
    channelLists: [],

    WatchMachineModalVisible: false,
    machineList: [],

    machines: [],

    machineNum: 0,
    selectCity: [],
    selectCityName: [],

    // treeData: [],
    // expandedKeys: [],
    // autoExpandParent: true,
    // checkedKeys: [],
    // selectedKeys: [],
    editMachineEditModalConfirmLoading: false,

    insertOptions: [],
    targetData: [],
    sourceData: [],
    sourceKey: [],
    targetKey: [],
    selectAll: false,
    selectedRows: [],
    // code: '',
    repeat: [],
    // level: 1,
    selectedRowKeys: [],
    options: [],
    defaultValue: []
  };
  componentDidMount() {
    this.getLists();
  }
  // 获取列表
  getLists = () => {
    this.props.dispatch({
      type: 'user/getUserList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          keyword: this.state.keyword,
        },
      },
    });
  }
  // 获取城市列表
  areaList = (selectedOptions) => {
    let targetOption = null;
    let code = ''
    if (selectedOptions) {
      targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;
      code = targetOption.value
    }
    this.props.dispatch({
      type: 'common/getUserArea',
      payload: {
        restParams: {
          code,
        }
      },
    }).then((res) => {
      if (!selectedOptions) {
        this.setState({
          options: res,
        });
      } else {
        targetOption.loading = false;
        targetOption.children = res
        this.setState({
          options: [...this.state.options],
        });
      }
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
        pageNo: 1,
        keyword: fieldsValue.keyword ? fieldsValue.keyword : '',
      }, () => {
        this.getLists();
      });
    });
  };
  verifyString = (rule, value, callback) => {
    if (value.length < 2) {
      callback('请填写完整的省市');
    } else {
      callback();
    }
  }
  // 新增modal确认事件 开始
  saveFormRef = (form) => {
    this.form = form;
  }
  // 添加modal 添加事件
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
      modalData: {},
      modalType: true,
    });
    this.areaList('')
    this.setModalData();
  };
  // 编辑modal 编辑事件
  handleEditClick = (item) => {
    this.props.dispatch({
      type: 'user/getUserDetail',
      payload: {
        restParams: {
          id: item.id,
        },
      },
    }).then((res) => {
      this.setState({
        modalVisible: true,
        modalData: res,
        modalType: false,
      }, () => {
        this.getModalData(res);
      });
    });
  }
  // 获取点位详情
  getArea = (code) => {
    return this.props.dispatch({
      type: 'common/getUserArea',
      payload: {
        restParams: {
          code,
        },
      },
    });
  }
  // forIn
  forIn = (arr, value, res) => {
    for (let [i, v] of new Map(arr.map((item, i) => [i, item]))) {
      if (v.value === value) {
        v.children = res;
        return { index: i };
      }
    }
  }
  getModalData = async (item) => {
    this.setState({
      modalVisible: true,
      modalData: item,
      modalType: false,
      // CreateFormLoading: true,
    });
    const res = await this.getPointSettingDetail(item);
    if (!res) {
      return
    }
    const { area } = res;
    if (area) {
      const provinceRes = await this.getArea('')
      let province = provinceRes;
      const cityRes = await this.getArea(res.province)
      this.forIn(province, res.province, cityRes)
      this.setState({
        options: province,
        defaultValue: [res.province, area],
      }, () => {
        this.setModalData(res);
      });
    } else {
      this.areaList('')
      this.setState({
        defaultValue: [],
      }, () => {
        this.setModalData(res);
      });
    }

    // 回显省市区商圈数据源
  }
  // 设置modal 数据
  setModalData = (data) => {
    if (data) {
      this.setState({
        targetData: data.machines,
        sourceData: [],
      })
      if (data.machines.length >0) {
        let arr = data.machines
        let selectCityName = []
        for (var i = 0; i < arr.length; i++) {
          var item = arr[i]
          if (!(item['province'] in selectCityName)) {
            selectCityName[item['province']] = item.province;
          }
        }
        selectCityName = Object.values(selectCityName)
        this.setState({
          machineNum: data.machines.length,
          selectCityName,
        });
      }
      this.form.setFieldsValue({
        name: data.name || undefined,
        phone: data.phone || undefined,
        cardNo: data.cardNo || undefined,
        enterprise: data.enterprise || undefined,
        area: this.state.defaultValue || undefined,
      });
    } else {
      this.form.setFieldsValue({
        name: undefined,
        phone: undefined,
        cardNo: undefined,
        enterprise: undefined,
        area: undefined,
      });
      this.setState({
        machineNum: '',
        selectCityName: '',
        sourceData: [],
        targetData: [],
      });
    }
  }
  // 编辑modal 确认事件
  handleAdd = () => {
    this.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let remark = ''
      let messageTxt = '添加'
      if (this.state.machineNum) {
        remark = '已选择' + this.state.machineNum + '台机器，分别位于' + this.state.selectCityName.join('、');
      }
      console.log('values.area', values.area)
      if (values.area) {
        if (values.area.length < 2 && values.area.length > 0 ) {
          message.config({
            top: 100,
            duration: 2,
            maxCount: 1,
          });
          message.success('请选择完整的省市');
          this.setState({
            editModalConfirmLoading: false,
          });
          return false
        }
      }
      this.setState({
        editModalConfirmLoading: true,
        modalData: {},
      });
      let url = 'user/saveUser';
      let params = {
        ...values,
        remark: remark,
        machines: this.state.machines,
        area: values.area ? values.area[values.area.length - 1] : ''
      };
      if (this.state.modalData.id) {
        url = 'user/updateUser';
        messageTxt = '编辑'
        params = {
          ...values,
          id: this.state.modalData.id,
          remark: remark ? remark : this.state.modalData.remark,
          machines: this.state.machines,
          area: values.area.length > 0 ? values.area[values.area.length - 1] : ''
        };
      }
      this.props.dispatch({
        type: url,
        payload: {
          params,
        },
      }).then((res) => {
        if (res && res.code === 0) {
          // message.success(messageTxt + '成功');
          this.setState({
            keyword: '',
          }, () => {
            this.getLists();
          })
          this.setState({
            modalVisible: false,
          });
          // this.getLists();
        }
        this.setState({
          editModalConfirmLoading: false,
        });
      });
    });
  }
  // 新增modal确认事件 结束
  // 查看
  getMachineStatus = (item) => {
    this.setState({
      modalData: item,
    }, () => {
      // 获取数据
      this.props.dispatch({
        type: 'user/getUserMachineDetailList',
        payload: {
          restParams: {
            id: item.id,
          },
        },
      }).then((result) => {
        // console.log(result)
        this.setState({
          machineList: result,
        }, () => {
          this.setState({
            WatchMachineModalVisible: true,
          });
        });
      });
    })
  }
  WatchMachineHandleModalVisibleClick = () => {
    this.setState({
      WatchMachineModalVisible: false,
    });
  }
  // tree开始
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (parseInt(item.canUseNum) === 0) ? (<TreeNode {...item} dataRef={item} disabled />) : (<TreeNode {...item} dataRef={item} />)
    });
  }
  onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      // console.log('treeNode.props.dataRef', treeNode.props.dataRef.value, treeNode.props.children)
      const targetOption = treeNode.props.dataRef;
      // targetOption.loading = true;
      this.setState({
        code: targetOption.value,
      }, () => {
        this.props.dispatch({
          type: 'user/selectMachine',
          payload: {
            restParams: {
              code: targetOption.value,
              level: targetOption.level + 1,
            },
          },
        }).then((res) => {
          // targetOption.loading = false;
          targetOption.children = res
          console.log('res', res)
          this.setState({
            treeData: [...this.state.treeData],
          });
          resolve();
        });
      });
    });
  }
  onExpand = (expandedKeys, node) => {
    console.log('onExpand展开/收起节点时触发', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  onCheck = (checkedKeys, node) => {
    // .checkedNodes[0].props.dataRef.value
    console.log('onCheck点击复选框触发', checkedKeys);

    // let node =
    this.setState({ checkedKeys, selectCity: node.checkedNodes });
  }
  onSelect = (selectedKeys, info) => {
    // console.log('onSelect点击树节点触发', info);
    // this.setState({ selectedKeys });
  }
  onEditMachineHandleAddClick = () => {
    // console.log('选择机器确认');
    // let selectCity = this.state.selectCity
    // if (selectCity.length > 0) {
    //   this.uniq(selectCity);
    //   // console.log('selectCity', this.state.machines)
    // } else {
    //   message.config({
    //     top: 100,
    //     duration: 2,
    //     maxCount: 1,
    //   });
    //   message.error('请先选择机器');
    // }
    console.log('this.state.targetData.machines', this.state.targetData)
    if (this.state.targetData.length >0) {
      let arr = this.state.targetData
      let selectCityName = []
      for (var i = 0; i < arr.length; i++) {
        var item = arr[i]
        if (!(item['province'] in selectCityName)) {
          selectCityName[item['province']] = item.province;
        }
      }
      selectCityName = Object.values(selectCityName)
      this.setState({
        machineNum: this.state.targetData.length,
        selectCityName,
        machines: this.state.targetData,
      }, () => {
        // console.log(this.state.machines)
        this.setState({
          editMachineModalVisible: false,
        });
      });
    } else {
      this.setState({
        selectCityName: []
      })
      // message.config({
      //   top: 100,
      //   duration: 2,
      //   maxCount: 1,
      // });
      // message.warn('请先选择机器');
    }
    this.setState({
      editMachineModalVisible: false,
    });
  }
  uniq = (arr) => {
    let max = [];
    let selectCityName = []
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i].props.dataRef
      if (!item.children) {
        item.machines.forEach((MItem) => {
          max.push(MItem);
        });
        if (!(item['province'] in selectCityName)) {
          selectCityName[item['province']] = item.province;
        }
        // selectCityName.push(item.province)
      }
    }
    selectCityName = Object.values(selectCityName)
    this.setState({
      machineNum: max.length,
      selectCityName,
      machines: max,
    }, () => {
      console.log(this.state.machines)
      this.setState({
        editMachineModalVisible: false,
      });
    });
  }
  getPointSettingDetail = (item) => {
    return this.props.dispatch({
      type: 'user/getUserDetail',
      payload: {
        restParams: {
          id: item.id,
        },
      },
    });
  }
  // 回显省市区商圈数据源开始
  getAreaList = (selectedOptions) => {
    let code = '';
    let targetOption = null;
    let params = { code: code }
    if (selectedOptions) {
      if (selectedOptions.level) {
        params = { ...params, level: 1 }
      } else if (selectedOptions.code) {
        params = { code: selectedOptions.code }
      } else {
        targetOption = selectedOptions[selectedOptions.length - 1];
        code = targetOption.value;
        targetOption.loading = true;
        params = { code: code, level: targetOption.level + 1}
      }
    }
    this.props.dispatch({
      type: 'user/selectMachine',
      payload: {
        params,
      },
    }).then((res) => {
      if (selectedOptions.level) {
        this.setState({
          insertOptions: res,
        });
      } else if (selectedOptions.code) {
        this.setState({
          sourceData: res,
        });
      } else {
        targetOption.loading = false;
        targetOption.children = res
        this.setState({
          insertOptions: [...this.state.insertOptions],
        });
      }
    });
  }
  addData = async () => {
    const selectedRows = this.state.selectedRows
    for (let a of selectedRows) {
      let selectedRowKeys = this.state.selectedRowKeys.indexOf(a.machineCode)
      this.state.selectedRowKeys.splice(selectedRowKeys, 1)
      await this.handleDelete(a.machineCode)
    }
    // console.log(this.state.repeat)
    if (this.state.repeat.length > 0) {
      Modal.warning({
        title: '以下机器和已选机器重复',
        content: this.state.repeat.join('\n') + '',
      });
    }
    this.setState({
      selectAll: false
    })
  }
  unique = (arr) => {
    let targetData = []
    let repeat = []
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i]
      if (!(item['machineCode'] in targetData)) {
        targetData[item['machineCode']] = item;
      } else {
        repeat = [...this.state.repeat, item.machineCode]
      }
    }
    this.setState({
      repeat,
    })
    return Object.values(targetData)
  }
  handleSave = (row) => {
    const newData = [...this.state.sourceData];
    const index = newData.findIndex(item => row.machineCode === item.machineCode);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    console.log('newDatahandleSave', newData)
    this.setState({ sourceData: newData });
  }
  handleDelete = (key) => {
    // console.log('key', key, this.state.targetData)
    const dataSource = [...this.state.sourceData];
    this.setState({ sourceData: dataSource.filter(item => item.machineCode !== key) });
    let targetData = [...this.state.targetData, ...dataSource.filter(item => item.machineCode === key)]
    // console.log('targetData', targetData)
    targetData = this.unique(targetData)
    this.setState({ targetData });
  }
  targetHandleSave = (row) => {
    const newData = [...this.state.targetData];
    const index = newData.findIndex(item => row.machineCode === item.machineCode);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    console.log('newDatahandleSave', newData)
    this.setState({ targetData: newData });
  }
  targetHandleDelete = (key) => {
    // console.log('key', key)
    const dataSource = [...this.state.targetData];
    this.setState({ targetData: dataSource.filter(item => item.machineCode !== key) });
  }
  onChangeRowSelection = (selectedRowKeys, selectedRows) => {
    // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    this.setState({
      sourceKey: selectedRowKeys,
      selectedRowKeys,
    })
  }
  onSelectAll = (selected, selectedRows, changeRows) => {
    this.setState({
      selectedRows,
      selectAll: selected
    })
    console.log(selected, selectedRows, changeRows);
  }
  onLeftSelect = (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
    this.setState({
      selectedRows,
      selectAll: true
    })
  }
  // 回显省市区商圈数据源结束
  // 选择机器控件
  findSourceData = () => {
    this.selectMachineform.validateFields((err, fieldsValue) => {
      if (err) return;
      let localCode = ''
      if (fieldsValue.provinceCityAreaTrade) {
        if (fieldsValue.provinceCityAreaTrade.length > 0) {
          localCode = fieldsValue.provinceCityAreaTrade[fieldsValue.provinceCityAreaTrade.length - 1]
        }
      }
      // console.log('localCode', localCode, fieldsValue, fieldsValue.provinceCityAreaTrade)
      if (!localCode) {
        message.config({
          top: 100,
          duration: 2,
          maxCount: 1,
        });
        message.error('请选择一个地区')
        return;
      }
      this.getAreaList({code: localCode})
    });
  }
  openSelectMachineModal = () => {
    this.setState({
      editMachineModalVisible: true,
    }, () => {
      this.getAreaList({level: 1});
    });
    this.selectMachineform.setFieldsValue({
      provinceCityAreaTrade: undefined
    })
  }
  onEditMachineHandleModalVisibleClick = () => {
    this.setState({
      editMachineModalVisible: false,
    });
  }
  selectMachineFormRef = (form) => {
    this.selectMachineform = form;
  }
  // 人员管理停用
  updateStatus = (params, keyWord, postName) => {
    this.props.dispatch({
      type: 'user/' + postName,
      payload: {
        params,
      },
    }).then((resp) => {
      message.config({
        top: 100,
        duration: 2,
        maxCount: 1,
      });
      if (resp && resp.code === 0) {
        message.success(keyWord + '成功');
        this.getLists()
      }
    });
  }
  stopClick = (item) => {
    let params = {id: item.id, status: 1}
    this.updateStatus(params, '停用', 'updateStatus')
  }
  // 人员管用启用
  startClick = (item) => {
    let params = {id: item.id, status: 0}
    this.updateStatus(params, '启用', 'updateStatus')
  }
  // 删除
  deleteClick = (item) => {
    let params = {id: item.id}
    this.updateStatus(params, '删除', 'deleteUser')
  }
  // tree结束
  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={9} sm={24}>
            <FormItem>
              {getFieldDecorator('keyword')(<Input placeholder="请输入姓名、手机号、公司搜索" />)}
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
      user: { list, page },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, editModalConfirmLoading, modalType, channelLists } = this.state;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        width: '100px',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        width: '150px',
      },
      {
        title: '身份证号',
        dataIndex: 'cardNo',
        width: '200px',
      },
      {
        title: '公司',
        dataIndex: 'enterprise',
        width: '100px',
      },
      {
        title: '负责区域',
        dataIndex: 'area',
        width: '100px',
      },
      {
        title: '负责的机器',
        render: (text, item) => (
          <div style={{ color: '#5076FF', border: 0, background: 'transparent', cursor: 'pointer' }} onClick={() => this.getMachineStatus(item)} >查看</div>
        ),
        width: '200px',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render(val) {
          return <span>{userStatus[val]}</span>
        }
      },
      {
        fixed: 'right',
        width: '150px',
        title: '操作',
        render: (text, item) => (
          <Fragment>
            <a onClick={() => this.handleEditClick(item)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.stopClick(item)} style={{display: item.status === 1 ? 'none' : ''}}>停用</a>
            <a onClick={() => this.startClick(item)} style={{display: item.status === 0 ? 'none' : ''}}>启用</a>
            <Divider type="vertical" style={{display: item.status === 0 ? 'none' : ''}} />
            <Popconfirm title="确定要删除吗" onConfirm={() => this.deleteClick(item)} okText="Yes" cancelText="No">
              <a style={{display: item.status === 0 ? 'none' : ''}}>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
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
          <div className="tableList">
            <div className="tableListOperator">
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>新建</Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={list}
              page={page}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              scrollX={1100}
              scrollY={(document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 100 + 50)}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          ref={this.saveFormRef}
          modalVisible={modalVisible}
          editModalConfirmLoading={editModalConfirmLoading}
          modalType={modalType}
          channelLists={channelLists}
          modalData={this.state.modalData}
          machineNum={this.state.machineNum}
          selectCity={this.state.selectCity}
          selectCityName={this.state.selectCityName}
          openSelectMachineModal={this.openSelectMachineModal}
          options={this.state.options}
          loadData={this.areaList}
          verifyString={this.verifyString}
        />
        <WatchMachine
          WatchMachineModalVisible={this.state.WatchMachineModalVisible}
          WatchMachineHandleModalVisibleClick={this.WatchMachineHandleModalVisibleClick}
          machineList={this.state.machineList}
        />
        <SelectMachineForm
          ref={this.selectMachineFormRef}
          editMachineModalVisible={this.state.editMachineModalVisible}
          onEditMachineHandleAddClick={this.onEditMachineHandleAddClick}
          onEditMachineHandleModalVisibleClick={this.onEditMachineHandleModalVisibleClick}
          editMachineEditModalConfirmLoading={this.state.editMachineEditModalConfirmLoading}
          insertOptions={this.state.insertOptions}
          loadData={this.getAreaList}
          addData={this.addData}
          targetData={this.state.targetData}
          onChangeRowSelection={this.onChangeRowSelection}
          onSelectAll={this.onSelectAll}
          selectedRowKeys={this.state.selectedRowKeys}
          sourceData={this.state.sourceData}
          handleSave={this.handleSave}
          // handleDelete={this.handleDelete}
          selectAll={this.state.selectAll}
          targetHandleSave={this.targetHandleSave}
          targetHandleDelete={this.targetHandleDelete}
          onLeftSelect={this.onLeftSelect}
          findSourceData={this.findSourceData}
        />
      </PageHeaderLayout>
    );
  }
}
