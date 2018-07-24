import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Button, Row, Col, Input } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ jurisdiction }) => ({ jurisdiction }))
export default class Jurisdiction extends PureComponent {
  state = {
    userName: '',
    pageNo: 1,
  }
  componentDidMount = () => {
    this.getSystemFunctionList();
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
  render() {
    const { userName } = this.state;
    const { jurisdiction: { list, page } } = this.props;
    // console.log(111,list,page);
    const columns = [
      {
        title: '权限名称',
        dataIndex: 'functionDepict',
        key: 'functionDepict',
      }, {
        title: '归属权限',
        dataIndex: 'parentName',
        key: 'parentName',
      }, {
        title: '权限地址',
        dataIndex: 'functionPath',
        key: 'functionPath',
      }, {
        title: '权限等级',
        dataIndex: 'functionLevel',
        key: 'functionLevel',
      }, {
        title: '图标',
        dataIndex: 'functionIcon',
        key: 'functionIcon',
      }, {
        title: '颜色',
        dataIndex: 'color',
        key: 'color',
      },
    ];
    // const { userName } = this.state;
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
            <Col md={9} sm={24}>
              <Input placeholder="权限名称、权限归属名称" value={userName} onChange={this.onChange} />
            </Col>
            <Col md={6} sm={24}>
              <Button onClick={this.handleReset}>
                  重置
              </Button>
              <Button style={{ marginLeft: 8 }} type="primary" onClick={this.onFindData.bind(this)}>查询</Button>
            </Col>
          </Row>
        </Card>
        <Card>
          <Table
            dataSource={list}
            columns={columns}
            pagination={paginationProps}
            onChange={this.handleTableChange}
            rowKey="id"
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
