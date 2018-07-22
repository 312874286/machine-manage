import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Button, Row, Col, Input, Modal, DatePicker, Form, Icon, Tree, message, Popconfirm, List } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';


@connect(({ faultType }) => ({ faultType }))
export default class FaultType extends PureComponent {
    state = {
      userName: '',
      visible: false,
      solutionsLists: [
        // { key:0, name: '1',},
      ],
      count: 0,
      typeName: '',
      type: '',
      currentRecord: {},
    };
    componentDidMount = () => {
      this.getLists();
    }
    onChange = (e) => {
      this.setState({ userName: e.target.value });
      // console.log(111,e.target.value,this);
    }
    onTypeNameChange = (e) => {
      this.setState({ typeName: e.target.value });
      console.log(e.target.value);
    }
    onSolutionsChange = (e, solutions) => {
        // solutions.name = e.target.value;
        const { solutionsLists } = this.state;
        // var n
        // console.log(e,111, solutionsLists);
        // this.setState({ 
        //     solutionsLists: solutionsLists, 
        // });

        var arrlist = [];
        for (var i = 0; i < solutionsLists.length; i++) {
            var newobj = {};
            if(solutionsLists[i].key === solutions.key){
                newobj = {
                    key: solutions.key,
                    name: e.target.value,
                };
            }else{
                newobj = {
                    key: solutionsLists[i].key,
                    name: solutionsLists[i].name,
                };
            }
            arrlist.push(newobj);
        }
        this.setState({
            solutionsLists: arrlist,
        });
        
    }
    onFindData = (e) => {
    this.getLists();
    }
    onEdit = (record) => {

        this.setState({
            // visible: true,
            type: 'edit',
            solutionsLists: [],
            count: 0,
            typeName: '',
            currentRecord: record,
          },() => {
            this.props.dispatch({
                type: 'faultType/getCheckFaultTypeDetail',
                payload: {
                  params: {
                    code: this.state.currentRecord.code,
                  },
                },
              }).then((res) => {
                const { code, data, msg } = res;
                // console.log(data.functions);
                console.log(111, data);
                var arrlist = [];
                for (var i = 0; i < data.solutions.length; i++) {
                    var newobj = {
                        key: i,
                        name: data.solutions[i].name,
                    };
                    arrlist.push(newobj);
                }
                this.setState({
                    count: data.solutions.length,
                    visible: true,
                    solutionsLists: arrlist,
                    typeName: data.name,
                });
    
              });
          });
      console.log(record);
    }
    onDelHandle = (val) => {
      const solutionsLists = [...this.state.solutionsLists];
      this.setState({ solutionsLists: solutionsLists.filter(item => item.key !== val.key) });
      console.log(val, this);
    }
    handleSolutionsAdd = () => {
      const { solutionsLists, count } = this.state;
      const newData = { 
        key:count, 
        name: '',
       };
      this.setState({
        solutionsLists: [...solutionsLists, newData],
        count: count+1,
      });
    }
    // 获取列表
    getLists = () => {
      this.props.dispatch({
        type: 'faultType/getCheckFaultTypeList',
        payload: {
          params: {
            keyword: this.state.userName,
          },
        },
      });
    }
    handleModalAdd = (e) => {
      this.setState({
        visible: true,
        type: 'add',
        solutionsLists: [],
        count: 0,
        typeName: '',
      });
    }
    startDatePickerChange = (date, dateString) => {
      // this.setState({
      //   type: '1',
      //   startDateString: dateString,
      // });
      console.log('startDatePickerChange::', date, dateString);
    }
    handleOK = (e) => {
    
      if (this.state.type === 'add') {
        if (this.state.typeName === ''){
            message.info('故障类型名称');
            return;
        }
        if (this.state.solutionsLists.length === 0) {
            message.info('没有故障解决方案');
            return;
        }
        
        for (var i = 0; i < this.state.solutionsLists.length; i++) {
            if ( this.state.solutionsLists[i].name === '') {
                console.log(this.state.solutionsLists[i].name, i);
                message.info('没有填写故障解决方案');
                return;
            }
        }
        var  newarr = [];
        for(var i = 0; i < this.state.solutionsLists.length; i++) {
            var newobj = {
                name: this.state.solutionsLists[i].name,
            };
            newarr.push(newobj);
        }
        // console.log(newarr);
        
        this.props.dispatch({
            type: 'faultType/getCheckFaultTypeAdd',
            payload: {
              params: {
                name: this.state.typeName,
                solutions: JSON.stringify(newarr),
              },
            },
          }).then((res) => {
            const { code, data, msg } = res;
            // console.log(data.functions);
            // console.log(data);
            if (code === 0) {
              message.success(msg);
              this.setState({
                visible: false,
              });
            } else {
              message.error(msg);
            }
            

          });

      } else if (this.state.type === 'edit'){
        if (this.state.typeName === ''){
            message.info('故障类型名称');
            return;
        }
        if (this.state.solutionsLists.length === 0) {
            message.info('没有故障解决方案');
            return;
        }
        
        for (var i = 0; i < this.state.solutionsLists.length; i++) {
            if ( this.state.solutionsLists[i].name === '') {
                console.log(this.state.solutionsLists[i].name, i);
                message.info('没有填写故障解决方案');
                return;
            }
        }
        console.log('edit::');
        var  newarr = [];
        for(var i = 0; i < this.state.solutionsLists.length; i++) {
            var newobj = {
                name: this.state.solutionsLists[i].name,
            };
            newarr.push(newobj);
        }
        this.props.dispatch({
            type: 'faultType/getCheckFaultTypeUpdate',
            payload: {
              params: {
                code: this.state.currentRecord.code,
                name: this.state.typeName,
                solutions: newarr,
              },
            },
          }).then((res) => {
            const { code, data, msg } = res;
            // console.log(data.functions);
            // console.log(data);
            if (code === 0) {
              message.success(msg);
              this.setState({
                visible: false,
              });
            } else {
              message.error(msg);
            }
            

          });
      }
    }
    handleCancel = (e) => {
      this.setState({
        visible: false,
      });
    }
    render() {
      const { visible, solutionsLists } = this.state;
      const { faultType: { list, page } } = this.props;
    //   console.log('list::', faultType);
      const columns = [
        { title: '故障类型名称', dataIndex: 'name', key: 'name' },
        { title: '故障解决方案', dataIndex: 'parentName', key: 'parentName' },
        { title: '添加时间', dataIndex: 'createTime', key: 'createTime' },
        { title: '添加人', dataIndex: 'createId', key: 'createId' },
        { title: '操作', dataIndex: '', key: 'action', render: (text, record) => <a href="javascript:;" onClick={this.onEdit.bind(this, record)}>编辑</a> },
      ];
    //   const data = [
    //     { code: 1, name: 'John Brown', parentName: 32, createId: 'New York No. 1 Lake Park', createTime: '11' },
    //   ];
    //   const books = [
    //     { key:0, bookname: '1', time: '一号',},
    //     { key:1,  bookname: '2', time: '二号'},
    //     { key:2,  bookname: '3', time: '三号'},
    //     { key:3, bookname: '4', time: '四号'},
    //   ];
      const paginationProps = {
        showTotal: (total) => {
          return `共${total}条数据  每页${page.pageSize}条`;
        },
        ...page,
      };
      return (
        <PageHeaderLayout>
          <Card>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={3} sm={24}>
                添加时间
              </Col>
              <Col md={4} sm={24}>
                <DatePicker onChange={this.startDatePickerChange} />
              </Col>
              <Col md={7} sm={24}>
                <Input placeholder="请输入角色名称" onChange={this.onChange} />
              </Col>
              <Col md={5} sm={24}>
                <Button style={{ marginLeft: 8 }} type="primary" onClick={this.onFindData.bind(this)}>查询</Button>
              </Col>
            </Row>
          </Card>
          <Card>
            <Button icon="plus" type="primary" onClick={() => this.handleModalAdd(true)}>新建</Button>
            <br /><br />
            <Table
              columns={columns}
              dataSource={list}
              rowKey="code"
              pagination={paginationProps}
            />
          </Card>
          <Modal
          title="创建故障类型"
          visible={visible}
          onOk={this.handleOK}
          onCancel={this.handleCancel}
          >
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={6} sm={24}>
                故障类型名称
              </Col>
              <Col md={15} sm={24}>
                <Input placeholder="输入名称" value={this.state.typeName} onChange={this.onTypeNameChange} />
              </Col>
            </Row>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={6} sm={24}>
                故障解决方案
              </Col>
              <Col md={15} sm={24}>
                {
                solutionsLists.map((solutions) => {
                  return (
                    <div key={solutions.key}>
                      <Input placeholder="输入方案" value={solutions.name} onChange={(e) => this.onSolutionsChange(e, solutions)} />
                      <span onClick={this.onDelHandle.bind(this, solutions)}>删除</span>
                    </div>
                )
                })
                }
              </Col>
            </Row>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={6} sm={24}></Col>
              <Col md={15} sm={24}>
                <Button type="primary" onClick={() => this.handleSolutionsAdd(this)}>添加</Button>
              </Col>
            </Row>
          </Modal>
        </PageHeaderLayout>
      );
    }
  }
  
