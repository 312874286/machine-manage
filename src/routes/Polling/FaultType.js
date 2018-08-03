import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Button, Row, Col, Input, Modal, DatePicker, Form, Icon, Tree, message, Popconfirm, List } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './FaultType.less';

const FormItem = Form.Item;
@connect(({ faultType }) => ({ faultType }))
export default class FaultType extends PureComponent {
    state = {
      userName: '',
      visible: false,
      solutionsLists: [
        // { key: 0, name: '',},
      ],
      count: 1,
      typeName: '',
      type: '',
      currentRecord: {},
      pageNo: 1,
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
            pageNo: this.state.pageNo,
          },
        },
      });
    }
    handleModalAdd = (e) => {
      this.setState({
        visible: true,
        type: 'add',
        solutionsLists: [{
          key: 0, name: '',
        }],
        count: 1,
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
        if (this.state.typeName.replace(/\s+/g, '') === ''){
            message.info('故障类型名称');
            return;
        }
        if (this.state.solutionsLists.length === 0) {
            message.info('没有故障解决方案');
            return;
        }

        for (var i = 0; i < this.state.solutionsLists.length; i++) {
            if ( this.state.solutionsLists[i].name.replace(/\s+/g, '') === '') {
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
              this.getLists();
            } else {
              message.error(msg);
            }


          });

      } else if (this.state.type === 'edit'){
        if (this.state.typeName.replace(/\s+/g, '') === ''){
            message.info('故障类型名称');
            return;
        }
        if (this.state.solutionsLists.length === 0) {
            message.info('没有故障解决方案');
            return;
        }

        for (var i = 0; i < this.state.solutionsLists.length; i++) {
            if ( this.state.solutionsLists[i].name.replace(/\s+/g, '') === '') {
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
              this.getLists();
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
    handleTableChange = (pagination, filters, sorter) => {
      this.setState({
        pageNo: pagination.current,
      }, () => {
        this.getLists();
      });

      console.log(pagination, filters, sorter);
    }
    handleReset = () => {
      this.setState({
        userName: '',
      });
    }
    render() {
      const { visible, solutionsLists, userName } = this.state;
      const { faultType: { list, page } } = this.props;
    //   console.log('list::', faultType);
      const columns = [
        { title: '故障类型名称', dataIndex: 'name', key: 'name', width: '22%' },
        { title: '故障解决方案', dataIndex: 'parentName', key: 'parentName', width: '22%' },
        { title: '添加时间', dataIndex: 'createTime', key: 'createTime', width: '22%' },
        { title: '添加人', dataIndex: 'createId', key: 'createId', width: '22%' },
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
          // console.log(total, page)
          return `第${page.current}页 / 共${Math.ceil(total/page.pageSize)}页`;
        },
        ...page,
        showQuickJumper: true,
      };
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
        <PageHeaderLayout>
          <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 10px'}}>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <Input placeholder="请输入类型，解决方案 ，添加人搜索" value={userName} onChange={this.onChange} />
              </Col>
              <Col md={7} sm={24}>
                <Button onClick={this.handleReset}>
                  重置
                </Button>
                <Button style={{ marginLeft: 8 }} type="primary" onClick={this.onFindData.bind(this)}>查询</Button>
              </Col>
            </Row>
          </Card>
          <Card bordered={false}>
            <div className="tableList">
              <div className="tableListOperator">
                <Button icon="plus" type="primary" onClick={() => this.handleModalAdd(true)}>新建</Button>
              </div>
              <Table
                columns={columns}
                dataSource={list}
                rowKey="code"
                pagination={paginationProps}
                onChange={this.handleTableChange}
                scroll={{ y: (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 100) }}
              />
            </div>
            {/*<Button icon="plus" type="primary" onClick={() => this.handleModalAdd(true)}>新建</Button>*/}
            {/*<br /><br />*/}

          </Card>
          <Modal
          title="创建故障类型"
          visible={visible}
          onOk={this.handleOK}
          onCancel={this.handleCancel}
          >
            <Form onSubmit={this.handleSearch}>
              <FormItem {...formItemLayout} label="类型名称">
                <Input placeholder="输入名称" value={this.state.typeName} onChange={this.onTypeNameChange} />
              </FormItem>
              <FormItem {...formItemLayout} label="解决方案">
                {
                  <div className={styles.solutionBox}>
                    {
                    solutionsLists.map((solutions) => {
                    return (
                    <div key={solutions.key} className={styles.faultTypeinput}>
                    <Input placeholder="输入方案" value={solutions.name} onChange={(e) => this.onSolutionsChange(e, solutions)} style={{ width: solutionsLists.length === 1 ? '88%' : '77%', marginRight: '10px' }} />
                    <span onClick={this.onDelHandle.bind(this, solutions)} style={{ marginRight: '10px', display: solutionsLists.length === 1 ? 'none' : ''}}>删除</span>
                    </div>
                    )})
                   }
                    <span onClick={() => this.handleSolutionsAdd(this)} style={{ position: 'absolute', right: '-40px' }}>添加</span>
                  </div>
                }
              </FormItem>
             </Form>
             {/*<div    id="checkType">*/}
               {/*<Row gutter={{ md: 24, lg: 24, xl: 48 }}>*/}
                 {/*<Col md={6} sm={24}>*/}
                   {/*类型名称*/}
                 {/*</Col>*/}
                 {/*<Col md={16} sm={24}>*/}
                   {/*<Input placeholder="输入名称" value={this.state.typeName} onChange={this.onTypeNameChange} />*/}
                 {/*</Col>*/}
               {/*</Row>*/}
               {/*<Row gutter={{ md: 24, lg: 24, xl: 48 }}>*/}
                 {/*<Col md={6} sm={24}>*/}
                   {/*解决方案*/}
                 {/*</Col>*/}
                 {/*<Col md={16} sm={24}>*/}
                   {/*{*/}
                     {/*solutionsLists.map((solutions) => {*/}
                       {/*return (*/}
                         {/*<div key={solutions.key} className={styles.faultTypeinput}>*/}
                           {/*<Input placeholder="输入方案" value={solutions.name} onChange={(e) => this.onSolutionsChange(e, solutions)} style={{ width: '85%', marginRight: '10px' }}/>*/}
                           {/*<span onClick={this.onDelHandle.bind(this, solutions)} style={{ display: solutionsLists.length === 1 ? 'none' : ''}}>删除</span>*/}
                         {/*</div>)})*/}
                   {/*}*/}
                 {/*</Col>*/}
                 {/*<Col md={2} sm={24} onClick={() => this.handleSolutionsAdd(this)}>*/}
                   {/*<div style={{ marginLeft: '10px', width: '48px', cursor: 'pointer', }}>*/}
                     {/*添加*/}
                   {/*</div>*/}
                 {/*</Col>*/}
               {/*</Row>*/}
             {/*</div>*/}

            {/*<Row gutter={{ md: 24, lg: 24, xl: 48 }} className={styles.mT20}>*/}
              {/*<Col md={6} sm={24}></Col>*/}
              {/*<Col md={15} sm={24}>*/}
                {/*<Button type="primary" onClick={() => this.handleSolutionsAdd(this)}>添加</Button>*/}
              {/*</Col>*/}
            {/*</Row>*/}
          </Modal>
        </PageHeaderLayout>
      );
    }
  }

