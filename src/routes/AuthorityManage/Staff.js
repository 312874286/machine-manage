import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Table, Col, Row, Button, Input, Modal, message, Tree, Divider, Alert, Popconfirm } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Form} from "antd/lib/index";
import {getAccountMenus} from "../../utils/authority";

const FormItem = Form.Item;
const { TreeNode } = Tree;
const confirm = Modal.confirm;
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
      // dataIndex: 'tableName',
      width: '90%',
      render: (text, record) => {
        return (
          <div>
            {record.province ? record.province : ''}-{record.city ? record.city : ''}-{record.district ? record.district : ''}
          </div>
        );
      }
    }, {
      title: '操作',
      width: 70,
      dataIndex: 'operation',
      render: (text, record) => {
        return (
          targetData.length > 0
            ? (
              <Popconfirm title="确认要删除吗?" onConfirm={() => targetHandleDelete(record.code)}>
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
            <span class="modalTitle">区域设置</span>
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
                    rowKey={record => record.code}
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

const SelectDataForm = Form.create()(
  (props) => {
    const { editDataModalVisible, form,
      onEditDataHandleAddClick, onEditDataHandleModalVisibleClick,
      editDataEditModalConfirmLoading,
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
      title: '名称',
      dataIndex: 'functionDepict',
      width: '90%',
    }, {
      title: '操作',
      width: 70,
      dataIndex: 'operation',
      render: (text, record) => {
        return (
          targetData.length > 0
            ? (
              <Popconfirm title="确认要删除吗?" onConfirm={() => targetHandleDelete(record.functionId)}>
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
            <span class="modalTitle">数据设置</span>
          </div>
        }
        visible={editDataModalVisible}
        onOk={onEditDataHandleAddClick}
        onCancel={() => onEditDataHandleModalVisibleClick()}
        confirmLoading={editDataEditModalConfirmLoading}
        width={800}>
        <div className="manageAppBox">
          <Form onSubmit={this.handleSearch}>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={4} sm={24} style={{ paddingLeft: '3px' }}>
                <Tree
                  // loadData={onLoadData}
                  // checkable
                  // onExpand={onExpand}
                  // expandedKeys={expandedKeys}
                  // autoExpandParent={autoExpandParent}
                  // onCheck={onCheck}
                  // checkedKeys={checkedKeys}
                  onSelect={onSelect}
                  // selectedKeys={selectedKeys}
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
                    rowKey={record => record.functionId}
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

const DetailDataForm = Form.create()(
  (props) => {
    const { DetailDataVisible, modelData, handleDetailDataVisible, } = props;
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
    const Columns = [{
      title: '名称',
      align: 'center',
      dataIndex: 'name',
    }];
    const ColumnsArea = [{
      title: '名称',
      align: 'center',
      render: (text, record) => {
        return (
          <div>
            {record.province ? record.province : ''}-{record.city ? record.city : ''}-{record.district ? record.district : ''}
          </div>
        );
      }
    }];
    const ColumnsData = [{
      title: '名称',
      dataIndex: 'functionDepict',
      align: 'center',
    }];
    return (
      <Modal
        title={
          <div class="modalBox">
            <span class="leftSpan"></span>
            <span class="modalTitle">查看权限</span>
          </div>
        }
        visible={DetailDataVisible}
        onCancel={() => handleDetailDataVisible()}
        footer={null}
        width={900}
      >
        <div className="manageAppBox">
          <Form>
            <FormItem {...formItemLayout} label="授权明细">
              <Table
                scroll={{ y: 400 }}
                columns={Columns}
                dataSource={modelData ? modelData.function : []}
                rowKey={record => record.name}
                pagination={false} />
            </FormItem>
            <FormItem {...formItemLayout} label="区域明细">
              <Table
                scroll={{ y: 300 }}
                columns={ColumnsArea}
                dataSource={modelData? modelData.functionArea : []}
                rowKey={record => record.code}
                pagination={false} />
            </FormItem>
            <FormItem {...formItemLayout} label="数据明细">
              <Table
                scroll={{ y: 300 }}
                columns={ColumnsData}
                dataSource={modelData ? modelData.functionData : []}
                rowKey={record => record.functionId}
                pagination={false} />
            </FormItem>
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
    treeData: [],
    expandedKeys: [],
    autoExpandParent: true,
    checkedKeys: [],
    selectedKeys: [],
    editMachineEditModalConfirmLoading: false,
    selectStatus: '0',
    insertOptions: [],
    targetData: [],
    targetKey: [],
    selectedRows: [],
    code: '',
    repeat: [],
    level: 1,
    selectedRowKeys: [],
    options: [],
    defaultValue: [],
    modelData: [],

    //
    editDataModalVisible: false,
    editDataEditModalConfirmLoading: false,
    dataTreeData: [],
    dataTargetData: [],
    account: {},
    areaList: [],

    DetailDataVisible: false

  }
  componentDidMount = () => {
    this.getSystemUserList();
    this.getAccountMenus(getAccountMenus())
  }
  getAccountMenus = (setAccountMenusList) => {
    const pointSettingMenu = setAccountMenusList.filter((item) => item.path === 'authorityManage')[0]
      .children.filter((item) => item.path === 'staff')
    var obj = {}
    if (pointSettingMenu[0].children) {
      pointSettingMenu[0].children.forEach((item, e) => {
        obj[item.path] = true;
      })
      this.setState({
        account: obj
      })
    }
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
  // onSelect = (selectedKeys, info) => {
  //   console.log('onSelect', info);
  //   this.setState({ selectedKeys });
  // }
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
  getDetail = (item) => {
    //查看权限
    this.props.dispatch({
      type: 'staff/queryUserAuth',
      payload: {
        restParams: {
          userId: item.id,
        },
      },
    }).then((res) => {
      this.setState({
        modelData: res,
        DetailDataVisible: true
      })
    });
  }
  handleAreaClick = (item) => {
   // 区域设置
   //  id: item.id
    this.props.dispatch({
      type: 'staff/getFunctionArea',
      payload: {
        restParams: {
          userId: item.id,
        },
      },
    }).then((res) => {
      this.setState({
        expandedKeys: [],
        autoExpandParent: true,
        modelData: item,
        targetData: res.data,
      })
    });
    if (this.state.areaList.length > 0) {
      this.setState({
        treeData: this.state.areaList,
      }, () => {
        this.setState({
          editMachineModalVisible: true,
        });
      });
      return
    }
    this.props.dispatch({
      type: 'common/getStaffArea',
      payload: {
        restParams: {
          code: '',
          level: 1,
          startTime: this.state.machineStartTime,
          endTime: this.state.machineEndTime,
        },
      },
    }).then((res) => {
      console.log('key', res)
      this.setState({
        treeData: res,
        areaList: res,
      }, () => {
        this.setState({
          editMachineModalVisible: true,
        });
      });
    });
  }
  handleDataClick = (item) => {
   // 数据
    this.props.dispatch({
      type: 'staff/getFunctionData',
      payload: {
        restParams: {
          userId: item.id,
        },
      },
    }).then((res) => {
      this.setState({
        modelData: item,
        dataTargetData: res.data,
      })
    });

    this.props.dispatch({
      type: 'staff/functionTree',
      payload: {

      },
    }).then((res) => {
      const otherData = res.children;
      for (const i in otherData) {
        if (otherData[i].children) {
          this.bianlijson(otherData[i].children, otherData[i].title);
        }
        otherData[i].key = otherData[i].id;
        otherData[i].functionDepict = otherData[i].title;
      }
      // console.log('tree', otherData)
      this.setState({
        dataTreeData: otherData,
      }, () => {
        this.setState({
          editDataModalVisible: true,
        });
      });
    });
  }
  bianlijson = (data, title) => {
    for (const i in data) {
      // console.log('key', i, data[i])
      if (data[i].children) {
        this.bianlijson(data[i].children, `${title}-${data[i].title}`);
      }
      data[i].key = data[i].id;
      data[i].functionDepict = `${title}-${data[i].title}`;
    }
  }
  handleStopClick = (item, status) => {
   // 停用 updateStatus
    this.props.dispatch({
      type: 'staff/updateStatus',
      payload: {
        params: {
          id: item.id,
          status,
        },
      },
    }).then((res) => {
      this.getSystemUserList()
    });
  }
  targetHandleDelete = (code) => {
    this.setState({
      targetData: this.state.targetData.filter((item) => item.code !== code)
    })
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
          targetOption.loading = false;
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
  onSelect = (selectedKeys, info) => {
    // console.log('onSelect点击树节点触发', selectedKeys, info, [...this.state.targetData, info.selectedNodes[0].props.dataRef]);
    let targetData = [info.node.props.dataRef].map((item) => {
      return {
        isLeaf: item.isLeaf,
        key: item.key,
        label: item.label,
        level: item.level,
        code: item.key,
        province: item.province,
        title: item.title,
        value: item.value,
        name: item.name,
        city: item.city,
        district: item.district,
        tableName: item.tableName,
      }
    })
    for (const item of this.state.targetData) {
      if (item.code === targetData[0].code) {
        message.config({
          top: 100,
          duration: 2,
          maxCount: 1,
        });
        message.warn(`${item.name}已存在，请重新选择`)
        return
      }
    }
    this.setState({
      targetData: [...this.state.targetData, ...targetData]
    }, () => {
      console.log('targetData', this.state.targetData)
    })
  }
  onEditMachineHandleAddClick = () => {
    let self = this
    if (this.state.targetData.length >0) {
      this.props.dispatch({
        type: 'staff/updateFunctionArea',
        payload: {
          params: {
            userId: this.state.modelData.id,
            areaList: this.state.targetData
          },
        },
      }).then((res) => {
        if (res.msg.indexOf('重复') > -1) {
          confirm({
            content: '经检测有重复区域，是否需要进行合并',
            onOk() {
              return new Promise((resolve, reject) => {
                setTimeout(
                  self.setState({
                      targetData: res.data.map((item) => {
                        return {
                          key: item.code,
                          level: item.level,
                          code: item.code,
                          province: item.province,
                          name: item.name,
                          city: item.city,
                          district: item.district,
                          parentCode: item.parentCode,
                        }
                      })
                    }) ? resolve : reject, 1000);
              }).catch(() => console.log('Oops errors!'));
            },
            onCancel() {},
          });
        } else if (res.msg === '成功') {
          this.setState({
            editMachineModalVisible: false,
          })
        }
      });
    } else {
      message.config({
        top: 100,
        duration: 2,
        maxCount: 1,
      });
      message.warn('请先选择');
      return false
    }
  }
  timeFormRef = (form) => {
    this.timeFormRef = form;
  }
  onEditMachineHandleModalVisibleClick = () => {
    this.setState({
      editMachineModalVisible: false,
      treeData: []
    });
  }
  selectMachineFormRef = (form) => {
    this.selectMachineform = form;
  }
  // tree结束
  selectDataFormRef = () => {

  }
  onEditDataHandleAddClick = () => {
    let self = this
    if (this.state.dataTargetData.length >0) {
      this.props.dispatch({
        type: 'staff/updateFunctionData',
        payload: {
          params: {
            userId: this.state.modelData.id,
            columnList: this.state.dataTargetData
          },
        },
      }).then((res) => {
        if (res.msg.indexOf('重复') > -1) {
          confirm({
            content: '经检测有重复，是否需要进行合并',
            onOk() {
              return new Promise((resolve, reject) => {
                setTimeout(
                  self.setState({
                    dataTargetData: res.data.map((item) => {
                      return {
                        key: item.code,
                        title: item.title,
                        functionId: item.functionId,
                        voName: item.voName,
                        voColumn: item.voColumn,
                        functionDepict: item.functionDepict,
                        functionLevel: item.functionLevel,
                      }
                    })
                  }) ? resolve : reject, 1000);
              }).catch(() => console.log('Oops errors!'));
            },
            onCancel() {},
          });
        } else if (res.msg === '成功') {
          this.setState({
            editDataModalVisible: false,
          })
        }
      });
    } else {
      message.config({
        top: 100,
        duration: 2,
        maxCount: 1,
      });
      message.warn('请先选择');
      return false
    }
  }
  onEditDataHandleModalVisibleClick = () => {
    this.setState({
      editDataModalVisible: false,
    });
  }
  handleDetailDataVisible = () => {
    this.setState({
      DetailDataVisible: false,
      modelData: {}
    });
  }
  renderDataTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderDataTreeNodes(item.children)}
          </TreeNode>
        );
      }
      // parseInt(item.canUseNum) === 0
      return <TreeNode {...item} dataRef={item} />;
    });
  }
  onDataSelect = (selectedKeys, info) => {
    // console.log(info)
    let dataTargetData = [info.node.props.dataRef].map((item) => {
      return {
        key: item.key,
        title: item.title,
        functionId: item.id,
        voName: item.voName,
        voColumn: item.voColumn,
        id: item.id,
        functionDepict: item.functionDepict,
        functionLevel: item.level,
      }
    })
    for (const item of this.state.dataTargetData) {
      if (item.functionId === dataTargetData[0].functionId) {
        message.config({
          top: 100,
          duration: 2,
          maxCount: 1,
        });
        message.warn(`${item.title}已存在，请重新选择`)
        return
      }
    }
    this.setState({
      dataTargetData: [...this.state.dataTargetData, ...dataTargetData]
    })
  }
  DataTargetHandleDelete = (key) => {
    this.setState({
      dataTargetData: this.state.dataTargetData.filter((item) => item.functionId !== key)
    })
  }
  render() {
    const { allList, checkedKeys, isJiaoLeft, userName, No, account } = this.state;
    const { staff: { list, page, totalNo, unColumn } } = this.props;
    // console.log(111, list, page, allList, 222);
    let columns = [
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
               onClick={() => this.getDetail(item)} >查看</div>
        ),
        key: 'detail'
      }, {
        title: '状态',
        dataIndex: 'isDelete',
        key: 'isDelete',
        width: '15%',
        render(val) {
          if (val === 0) {
            return '有效'
          } else if (val === 2) {
            return '停用'
          }
        },
      }, {
        title: '操作',
        dataIndex: '',
        width: '15%',
        key: '',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.onToAuthorization(record)} style={{ display: !account.update ? 'none' : ''}}>授权</a>
            <Divider type="vertical" style={{ display: !account.update ? 'none' : ''}}/>
            <a onClick={() => this.handleAreaClick(record)} style={{ display: !account.areaSet ? 'none' : ''}}>区域设置</a>
            <Divider type="vertical" style={{ display: !account.areaSet ? 'none' : ''}}/>
            <a onClick={() => this.handleDataClick(record)} style={{ display: !account.data ? 'none' : ''}}>数据</a>
            <Divider type="vertical" style={{ display: !account.data ? 'none' : ''}}/>
            <a onClick={() => this.handleStopClick(record, record.isDelete === 0 ? 2 : 0)}
               style={{ display: !account.btn ? 'none' : ''}}>
              {record.isDelete === 0 ? '停用' : '启用'}
            </a>
          </Fragment>
        ),
      },
    ]
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
          <div style={{ display: !account.list ? 'none' : ''}}>
            <Table
              columns={columns}
              dataSource={list}
              rowKey="id"
              pagination={paginationProps}
              onChange={this.handleTableChange}
              scroll={{ y: (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 100) }}
            />
          </div>
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

        <SelectDataForm
          ref={this.selectDataFormRef}
          editDataModalVisible={this.state.editDataModalVisible}
          onEditDataHandleAddClick={this.onEditDataHandleAddClick}
          onEditDataHandleModalVisibleClick={this.onEditDataHandleModalVisibleClick}
          editDataEditModalConfirmLoading={this.state.editDataEditModalConfirmLoading}
          renderTreeNodes={this.renderDataTreeNodes}
          treeData={this.state.dataTreeData}
          onSelect={this.onDataSelect}

          targetData={this.state.dataTargetData}
          targetHandleDelete={this.DataTargetHandleDelete}
        />
        <DetailDataForm
          DetailDataVisible={this.state.DetailDataVisible}
          modelData={this.state.modelData}
          handleDetailDataVisible={this.handleDetailDataVisible}
        />
      </PageHeaderLayout>
    );
  }
}
