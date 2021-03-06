import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Button, Row, Col, Input } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {getAccountMenus} from "../../utils/authority";

@connect(({ jurisdiction }) => ({ jurisdiction }))
export default class Jurisdiction extends PureComponent {
  state = {
    userName: '',
    pageNo: 1,
    account: {},
  }
  componentDidMount = () => {
    this.getSystemFunctionList();
    this.getAccountMenus(getAccountMenus())
  }
  getAccountMenus = (setAccountMenusList) => {
    if (setAccountMenusList) {
      const pointSettingMenu = setAccountMenusList.filter((item) => item.path === 'authorityManage')[0]
        .children.filter((item) => item.path === 'jurisdiction')
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
  }
  onToAuthorization = (record) => {
    console.log(record, this);
  }
  onFindData = (e) => {
    this.getSystemFunctionList();
    console.log(this, e, this.state.userName);
  }
  onChange = (e) => {
    this.setState({ userName: e.target.value });
    // console.log(111,e.target.value,this);
  }
  getSystemFunctionList = () => {
    this.props.dispatch({
      type: 'jurisdiction/getSystemFunctionList',
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
      this.getSystemFunctionList();
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
    const { jurisdiction: { list, page, totalNo, unColumn } } = this.props;
    // console.log(111,list,page);
    let columns = [
      {
        title: '权限名称',
        dataIndex: 'functionDepict',
        key: 'functionDepict',
        width: '15%'
      }, {
        title: '归属权限',
        dataIndex: 'parentName',
        key: 'parentName',
        width: '15%'
      }, {
        title: '权限地址',
        dataIndex: 'functionPath',
        key: 'functionPath',
        width: '25%'
      }, {
        title: '权限等级',
        dataIndex: 'functionLevel',
        key: 'functionLevel',
        width: '15%'
      }, {
        title: '图标',
        dataIndex: 'functionIcon',
        key: 'functionIcon',
        width: '15%'
      }, {
        title: '颜色',
        dataIndex: 'color',
        key: 'color',
        width: '15%'
      },
    ];
    if (unColumn) {
      let leg = columns.length
      for (let i = leg - 1; i >= 0; i--) {
        for (let j = 0; j < unColumn.length; j++) {
          if (columns[i]) {
            if (columns[i].key === unColumn[j]) {
              columns.splice(i, 1)
              continue;
            }
          }
        }
      }
    }
    const width = 90/(columns.length - 1)
    for (let i = 0; i < columns.length; i++) {
      if (i < columns.length - 2) {
        columns[i].width = width + '%'
      }
      if (i === columns.length - 2) {
        columns[i].width = ''
      }
    }
    // const { userName } = this.state;
    const paginationProps = {
      showTotal: (total) => {
        // console.log(total, page)
        // return `第${page.current}页 / 共${Math.ceil(total/page.pageSize)}页`;
        return (
          <div className="paginationBox">
            <span>当前显示{page.pageSize}条/页，共{page.total}条</span>
            {/*<div>*/}
              {/*<span>第{page.current}页 / 共{Math.ceil(total/page.pageSize)}页</span>*/}
              {/*<span>*/}
                 {/*<span>跳至 <Input value={No} onChange={this.inputValue}/>页</span>*/}
                 {/*<Button type="primary" onClick={() => this.go(totalNo)}>Go</Button>*/}
               {/*</span>*/}
            {/*</div>*/}
          </div>
        );
      },
      ...page,
      showQuickJumper: true,
    };
    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 10px'}}>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={9} sm={24}>
              <Input placeholder="请输入权限名称、权限归属名称" value={userName} onChange={this.onChange} />
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
