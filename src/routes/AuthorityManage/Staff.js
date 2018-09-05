import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Table, Col, Row, Button, Input, Modal, message, Tree, Divider, Alert, Popconfirm } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Form} from "antd/lib/index";

const FormItem = Form.Item;
const { TreeNode } = Tree;

// var treeData = [{
//   title: '0-0',
//   key: '0-0',
//   children: [{
//     title: '0-0-0',
//     key: '0-0-0',
//     children: [
//       { title: '0-0-0-0', key: '0-0-0-0' },
//       { title: '0-0-0-1', key: '0-0-0-1' },
//       { title: '0-0-0-2', key: '0-0-0-2' },
//     ],
//   }, {
//     title: '0-0-1',
//     key: '0-0-1',
//     children: [
//       { title: '0-0-1-0', key: '0-0-1-0' },
//       { title: '0-0-1-1', key: '0-0-1-1' },
//       { title: '0-0-1-2', key: '0-0-1-2' },
//     ],
//   }, {
//     title: '0-0-2',
//     key: '0-0-2',
//   }],
// }, {
//   title: '0-1',
//   key: '0-1',
//   children: [
//     { title: '0-1-0-0', key: '0-1-0-0' },
//     { title: '0-1-0-1', key: '0-1-0-1' },
//     { title: '0-1-0-2', key: '0-1-0-2' },
//   ],
// }, {
//   title: '0-2',
//   key: '0-2',
// }];

const SelectAreaForm = Form.create()(
  (props) => {
    const { editMachineModalVisible, form,
      onEditMachineHandleAddClick, onEditMachineHandleModalVisibleClick,
      editMachineEditModalConfirmLoading,
    renderTreeNodes, treeData, onLoadData,
      onExpand, expandedKeys, autoExpandParent,
      checkedKeys, selectedKeys, onCheck, onSelect,
      targetData,targetHandleDelete,  } = props;
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
    this.columnsRight = [{
      title: '区域名称',
      dataIndex: 'name',
      width: '90%'
    }, {
      title: '操作',
      width: 70,
      dataIndex: 'operation',
      render: (text, record) => {
        return (
          targetData.length > 0
            ? (
              <Popconfirm title="确认要删除吗?" onConfirm={() => targetHandleDelete(record.key)}>
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
        }),
      };
    });
    return (
      <Modal
        title={
          <div class="modalBox">
            <span class="leftSpan"></span>
            <span class="modalTitle">选择区域</span>
          </div>
        }
        visible={editMachineModalVisible}
        onOk={onEditMachineHandleAddClick}
        onCancel={() => onEditMachineHandleModalVisibleClick()}
        confirmLoading={editMachineEditModalConfirmLoading}
        width={800}>
        <div className="manageAppBox">
          <Form onSubmit={this.handleSearch}>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={4} sm={24} style={{ paddingLeft: '3px' }}>
                <Tree
                  loadData={onLoadData}
                  // checkable
                  onExpand={onExpand}
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                  // onCheck={onCheck}
                  checkedKeys={checkedKeys}
                  onSelect={onSelect}
                  selectedKeys={selectedKeys}
                >
                  {renderTreeNodes(treeData)}
                </Tree>
              </Col>
              <Col md={20} sm={24} style={{ paddingLeft: '3px' }}>
                <div style={{ marginLeft: '20px', marginTop: '10px' }}>
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
                    rowKey={record => record.value}
                    columns={columnsRight}
                    dataSource={targetData}
                    id="rightTable"
                    style={{ marginTop: '10px' }}
                    scroll={{ y: 1000 }}
                    pagination={false}/>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    );
});

@connect(({ staff, common }) => ({ staff, common }))
export default class Staff extends PureComponent {
  state = {
    userName: '',
    visible: false,
    allList: [],
    currentUserId: '',
    // selectedRows: [],
    // expandedKeys: [],
    // autoExpandParent: true,
    // checkedKeys: [],
    // selectedKeys: [],
    isJiaoLeft: 'none',
    pageNo: 1,

    editMachineModalVisible: false,
    confirmLoading: false,
    treeData: [
      // { title: 'Expand to load', key: '0' },
      // { title: 'Expand to load', key: '1' },
      // { title: 'Tree Node', key: '2', isLeaf: true },
    ],
    selectCity: [],
    selectCityName: [],
    expandedKeys: [],
    autoExpandParent: true,
    checkedKeys: [],
    selectedKeys: [],
    editMachineEditModalConfirmLoading: false,
    selectStatus: '0',
    insertOptions: [],
    targetData: [],
    sourceData: [],
    sourceKey: [],
    targetKey: [],
    selectAll: false,
    selectedRows: [],
    code: '',
    repeat: [],
    level: 1,
    selectedRowKeys: [],
    options: [],
    defaultValue: [],
  }
  componentDidMount = () => {
    this.getSystemUserList();
  }
  onChange = (e) => {
    this.setState({ userName: e.target.value });
    // console.log(111,e.target.value,this);
  }
  onFindData = (e) => {
    this.getSystemUserList();
    console.log(this, e, this.state.userName);
  }
  onToAuthorization = (record) => {
    this.setState({
      allList: [],
    });
    // treeData = [];
    // this.state.selectedRows;
    this.getSystemRoleAlls();
    this.setState({
      visible: true,
      currentUserId: record.id,
    });
    // this.state.currentUserId = record.id;
    console.log(record.id);
  }
  onExpand = (expandedKeys) => {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  onCheck = (checkedKeys) => {
    // this.setState({
    //   selectedRows: checkedKeys,
    // });
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  }
  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
  }
  getSystemUserList = () => {
    this.props.dispatch({
      type: 'staff/getSystemUserList',
      payload: {
        restParams: {
          keyword: this.state.userName,
          pageNo: this.state.pageNo,
        },
      },
    });
  }
  getSystemUserQueryUserRoles = (data_) => {
    if (data_.length === 0) {
      this.setState({
        isJiaoLeft: 'block',
      });
    } else {
      this.setState({
        isJiaoLeft: 'none',
      });
    }
    var arr = [];
    for (var i = 0; i < data_.length; i++) {
      let obj = {};
      obj.title = data_[i].name;
      obj.key = data_[i].id;
      obj.id = data_[i].id;
      arr.push(obj);
    }

    this.props.dispatch({
      type: 'staff/getSystemUserQueryUserRoles',
      payload: {
        restParams: {
          userId: this.state.currentUserId,
        },
      },
    }).then((res) => {
      const { code, data, msg} = res;
      let checkedKeysarr = [];
      for (let i = 0; i < data.length; i++) {
        checkedKeysarr.push(data[i].roleId);
      }

      this.setState({
        allList: arr,
      }, () => {
        this.setState({
          checkedKeys: checkedKeysarr,
        });
      });
    });
  }
  getSystemRoleAlls = () => {
    this.props.dispatch({
      type: 'staff/getSystemRoleAll',
      payload: {
        restParams: {
          keyword: this.state.userName,
        },
      },
    }).then((res) => {
      const { code, data } = res;
      // if(!code) return;
      // console.log(data);
      this.getSystemUserQueryUserRoles(data);

    });
  }
  hideOKModal = () => {

    if (this.state.checkedKeys.length === 0) {
      // console.log('请授权::');
      message.info('请授权');
      return;
    }

    let arr = [];
    for (let i = 0; i < this.state.checkedKeys.length; i++) {
      arr.push(this.state.checkedKeys[i]);
    }
    // JSON.stringify({a:1,b:2})
    // console.log(arr);
    // return;
    this.props.dispatch({
      type: 'staff/getSystemUserAuth',
      payload: {
        restParams: {
          userId: this.state.currentUserId,
          roleIds: JSON.stringify(arr),
        },
      },
    }).then((res) => {
      const { code, msg } = res;
      if (code !== 0) {
        // message.error(msg);
        const modal = Modal.error({
          title: '提示',
          content: msg,
        });
        setTimeout(() => modal.destroy(), 2000);
        return;
      }
      // message.success(msg);
      const modal = Modal.success({
        title: '提示',
        content: msg,
      });
      setTimeout(() => modal.destroy(), 2000);
      this.setState({
        visible: false,
      });
      this.getSystemUserList();
    });
    // console.log('hideOKModal::');
  }
  hideCancelModal = () => {
    this.setState({
      visible: false,
    });
    // console.log('hideCancelModal::');
  }
  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      pageNo: pagination.current,
    }, () => {
      this.getSystemUserList();
    });

    // console.log(pagination, filters, sorter);
  }
  handleReset = () => {
    this.setState({
      userName: '',
    });
  }
  go = (totalNo) => {
    const { No } = this.state
    if (No) {
      if (No <= totalNo && No > 0) {
        this.handleTableChange({current: No, pageSize: 20 }, {}, {});
      } else {
        this.setState({
          No: ''
        })
      }
    } else {
      return false
    }
  }
  inputValue = (e) => {
    this.setState({
      No: e.target.value
    })
  }
  // 操作
  getMachineStatus = () => {
    //查看权限
  }
  handleAreaClick = () => {
   // 区域设置
    this.props.dispatch({
      type: 'common/getStaffArea',
      payload: {
        restParams: {
          code: this.state.code,
          level: 1,
          startTime: this.state.machineStartTime,
          endTime: this.state.machineEndTime,
        },
      },
    }).then((res) => {
      this.setState({
        treeData: res,
      }, () => {
        this.setState({
          editMachineModalVisible: true,
        });
      });
    });
  }
  handleDataClick = () => {
   // 数据
  }
  handleStopClick = () => {
   // 停用
  }
  targetHandleDelete = () => {

  }
  // tree开始
  getAreaList = (selectedOptions) => {
    let code = '';
    let targetOption = null;
    let params = { code: code }
    if (selectedOptions) {
      if (selectedOptions.level) {
        params = { ...params, level: 1, startTime: this.state.machineStartTime, endTime: this.state.machineEndTime }
      } else if (selectedOptions.code) {
        params = { code: selectedOptions.code, startTime: this.state.machineStartTime, endTime: this.state.machineEndTime }
      } else {
        targetOption = selectedOptions[selectedOptions.length - 1];
        code = targetOption.value;
        targetOption.loading = true;
        params = { code: code, level: targetOption.level + 1, startTime: this.state.machineStartTime, endTime: this.state.machineEndTime}
      }
    }
    this.props.dispatch({
      type: 'common/getProvinceCityAreaTradeArea',
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
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      // parseInt(item.canUseNum) === 0
      return (item.disabledFlag) ? (<TreeNode {...item} dataRef={item} disabled />) : (<TreeNode {...item} dataRef={item} />);
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
          type: 'common/getStaffArea',
          payload: {
            restParams: {
              code: targetOption.value,
              level: targetOption.level + 1,
              startTime: this.state.machineStartTime,
              endTime: this.state.machineEndTime,
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
    // console.log('onExpand展开/收起节点时触发', expandedKeys, node);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  onCheck = (checkedKeys, node) => {
    // .checkedNodes[0].props.dataRef.value
    console.log('onCheck点击复选框触发', checkedKeys, node);

    // let node =
    this.setState({ checkedKeys, selectCity: node.checkedNodes });
  }
  onSelect = (selectedKeys, info) => {
    console.log('onSelect点击树节点触发', selectedKeys, info, [...this.state.targetData, info.selectedNodes[0].props.dataRef]);
    // this.setState({ selectedKeys });
    // if (info.props.dataRef.level !== 3) {
    //   message.warn('')
    // }
    let targetData = [info.selectedNodes[0].props.dataRef].map((item) => {
      return {
        isLeaf: item.isLeaf,
        key: item.isLeaf,
        label: item.isLeaf,
        level: item.isLeaf,
        name: item.isLeaf,
        province: item.isLeaf,
        title: item.isLeaf,
        value: item.isLeaf,
      }
    })
    this.setState({
      targetData: [...this.state.targetData, targetData]
    })
  }
  onEditMachineHandleAddClick = () => {
    // console.log('选择机器确认');
    // let selectCity = this.state.selectCity
    // if (selectCity.length > 0) {
    //   this.uniq(selectCity);
    //   // console.log('selectCity', this.state.machines)
    // } else {
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
        remark: '',
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
      message.config({
        top: 100,
        duration: 2,
        maxCount: 1,
      });
      message.warn('请先选择机器');
      return false
    }
  }
  uniq = (arr) => {
    let max = [];
    let selectCityName = []
    // for(var i=0;i<arr.length;i++) {
    //   var item = arr[i].props.dataRef;
    //   if(!(item['province'] in max) || (item['level'] > max[item['province']]['level'])){
    //     // init compare
    //     max[item['province']] = item;
    //   }
    // }
    // Object.values(max)
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
  timeFormRef = (form) => {
    this.timeFormRef = form;
  }
  openSelectMachineModal = () => {
    this.setState({
      sourceData: [],
      selectMachineFlag: true,
      checkedKeys: [],
      expandedKeys: [],
      autoExpandParent: true,
    }, () => {
      this.form.validateFields((err, fieldsValue) => {
        //     console.log('224', err, fieldsValue)
        if (err) return;
        // if (fieldsValue.gameId)
        // if (fieldsValue.remark)
        // if (fieldsValue.userMaxTimes)
        console.log('fieldsValue', fieldsValue)
        let params = {
          ...fieldsValue,
          code: this.state.code,
          level: 1,
          startTimeStr: fieldsValue.startTimeStr.format('YYYY-MM-DD HH:mm'),
          endTimeStr: fieldsValue.endTimeStr.format('YYYY-MM-DD HH:mm'),
        };
        this.setState({
          machineStartTime: params.startTimeStr,
          machineEndTime: params.endTimeStr,
        }, () => {
          // this.props.dispatch({
          //   type: 'scheduleSetting/selectAreaMachines',
          //   payload: {
          //     restParams: {
          //       code: this.state.code,
          //       level: 1,
          //       startTime: this.state.machineStartTime,
          //       endTime: this.state.machineEndTime,
          //     },
          //   },
          // }).then((res) => {
          //   this.setState({
          //     treeData: res,
          //   }, () => {
          //     this.setState({
          //       editMachineModalVisible: true,
          //     });
          //   });
          // });
          this.setState({
            editMachineModalVisible: true,
          }, () => {
            this.getAreaList({level: 1});
          });
          this.selectMachineform.setFieldsValue({
            provinceCityAreaTrade: undefined
          })
        });
      });
    });
  }
  // onEditMachineHandleModalVisibleClick = () => {
  //   this.setState({
  //     editMachineModalVisible: false,
  //   });
  // }
  // selectMachineFormRef = (form) => {
  //   this.selectMachineform = form;
  // }
  // tree结束
  render() {
    const { allList, checkedKeys, isJiaoLeft, userName, No } = this.state;
    const { staff: { list, page, totalNo } } = this.props;
    // console.log(111, list, page, allList, 222);
    const columns = [
      {
        title: '用户名',
        dataIndex: 'name',
        key: 'name',
        width: '15%'
      }, {
        title: '手机号码',
        dataIndex: 'mobile',
        key: 'mobile',
        width: '15%'
      },{
        title: '角色',
        dataIndex: 'roles',
        key: 'roles',
        width: '10%'
      }, {
        title: '所属部门',
        dataIndex: 'deptName',
        key: 'deptName',
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: '10%'
      }, {
        title: '权限',
        width: '10%',
        render: (text, item) => (
          <div style={{ color: '#5076FF', border: 0, background: 'transparent', cursor: 'pointer' }}
               onClick={() => this.getMachineStatus(item)} >查看</div>
        ),
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: '15%'
      }, {
        title: '操作',
        dataIndex: '',
        width: '15%',
        key: '',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.onToAuthorization(record)}>授权</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleAreaClick(record)}>区域设置</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleDataClick(record)}>数据</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleStopClick(record)}>停用</a>
          </Fragment>
        ),
      },
    ];
    // const { userName } = this.state;
    const paginationProps = {
      showTotal: (total) => {
        // console.log(total, page)
        // return `第${page.current}页 / 共${Math.ceil(total/page.pageSize)}页`;
        return (
          <div className="paginationBox">
            <span>当前显示{page.pageSize}条/页，共{page.total}条</span>
            <div>
              <span>第{page.current}页 / 共{Math.ceil(total/page.pageSize)}页</span>
              <span>
                 <span>跳至 <Input value={No} onChange={this.inputValue}/>页</span>
                 <Button type="primary" onClick={() => this.go(totalNo)}>Go</Button>
               </span>
            </div>
          </div>
        );
      },
      ...page,
      showQuickJumper: false,
    };
    // const columnsPop = [
    //   {
    //     title: '角色名称',
    //     dataIndex: 'name',
    //     key: 'name',
    //   },
    // ];
    // // console.log(111, this.state.selectedRows);
    // const rowSelection = {
    //   onChange: (selectedRowKeys, selectedRows) => {
    //     this.state.selectedRows = selectedRows;
    //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    //   },
    // };
    // console.log(111, checkedKeys);
    return (
      <PageHeaderLayout>
        <Modal
          title="角色集合"
          visible={this.state.visible}
          onOk={this.hideOKModal}
          onCancel={this.hideCancelModal}
          okText="确认"
          cancelText="取消"
        >
          <div style={{display:isJiaoLeft}}>角色管理未添加角色</div>
          <Tree
            checkable
            onExpand={this.onExpand}
            expandedKeys={this.state.expandedKeys}
            autoExpandParent={this.state.autoExpandParent}
            onCheck={this.onCheck}
            checkedKeys={checkedKeys}
            onSelect={this.onSelect}
            selectedKeys={this.state.selectedKeys}
          >
            {this.renderTreeNodes(allList)}
          </Tree>
        </Modal>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 10px'}}>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={9} sm={24}>
              <Input placeholder="请输入员工姓名、员工手机、邮箱、角色、部门名称" value={userName} onChange={this.onChange} />
            </Col>
            <Col md={6} sm={24}>
              <Button onClick={this.handleReset}>
                  重置
              </Button>
              <Button style={{ marginLeft: 8 }} type="primary" onClick={this.onFindData.bind(this)}>查询</Button>
            </Col>
          </Row>
        </Card>
        <Card bordered={false}>
          {/*<Table*/}
            {/*dataSource={list}*/}
            {/*columns={columns}*/}
            {/*pagination={paginationProps}*/}
            {/*onChange={this.handleTableChange}*/}
            {/*rowKey="id"*/}
          {/*/>*/}
          <Table
            columns={columns}
            dataSource={list}
            rowKey="id"
            pagination={paginationProps}
            onChange={this.handleTableChange}
            scroll={{ y: (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 100) }}
          />
        </Card>
        <SelectAreaForm
          ref={this.selectMachineFormRef}
          editMachineModalVisible={this.state.editMachineModalVisible}
          onEditMachineHandleAddClick={this.onEditMachineHandleAddClick}
          onEditMachineHandleModalVisibleClick={this.onEditMachineHandleModalVisibleClick}
          editMachineEditModalConfirmLoading={this.state.editMachineEditModalConfirmLoading}
          renderTreeNodes={this.renderTreeNodes}
          treeData={this.state.treeData}
          onLoadData={this.onLoadData}
          expandedKeys={this.state.expandedKeys}
          autoExpandParent={this.state.autoExpandParent}
          checkedKeys={this.state.checkedKeys}
          selectedKeys={this.state.selectedKeys}
          onExpand={this.onExpand}
          onCheck={this.onCheck}
          onSelect={this.onSelect}

          targetData={this.state.targetData}
          targetHandleDelete={this.targetHandleDelete}
        />
      </PageHeaderLayout>
    );
  }
}
