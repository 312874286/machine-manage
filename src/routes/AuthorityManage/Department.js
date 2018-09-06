import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Button, Row, Col, Input } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {getAccountMenus} from "../../utils/authority";

@connect(({ department }) => ({ department }))
export default class Department extends PureComponent {
  state = {
    userName: '',
    pageNo: 1,
    account: {}
  }
  componentDidMount = () => {
    this.getSystemDeptList();
    this.getAccountMenus(getAccountMenus())
  }
  getAccountMenus = (setAccountMenusList) => {
    const pointSettingMenu = setAccountMenusList.filter((item) => item.path === 'authorityManage')[0]
      .children.filter((item) => item.path === 'department')
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
  onToAuthorization = (record) => {
    console.log(record, this);
  }
  onFindData = (e) => {
    this.getSystemDeptList();
    console.log(this, e, this.state.userName);
  }
  onChange = (e) => {
    this.setState({ userName: e.target.value });
    // console.log(111,e.target.value,this);
  }
  getSystemDeptList = () => {
    this.props.dispatch({
      type: 'department/getSystemDeptList',
      payload: {
        restParams: {
          keyword: this.state.userName,
          pageNo: this.state.pageNo,
        },
      },
    });
  }
  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      pageNo: pagination.current,
    }, () => {
      this.getSystemDeptList();
    });

    console.log(pagination, filters, sorter);
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
  render() {
    const { userName, No, account } = this.state;
    const { department: { list, page, totalNo } } = this.props;
    // console.log(111,list,page);
    const columns = [
      {
        title: '部门名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '上级部门',
        dataIndex: 'mobile',
        key: 'mobile',
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
    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 10px'}}>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={9} sm={24}>
              <Input placeholder="请输入部门名称、上级部门" value={userName} onChange={this.onChange} />
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
      </PageHeaderLayout>
    );
  }
}
