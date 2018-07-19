import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Button, Row, Col, Input, Modal, DatePicker, Tree, message, Popconfirm } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TroubleBill.less';

const { TextArea } = Input;
// const { DatePicker } = DatePicker;

@connect(({ troubleBill }) => ({ troubleBill }))
export default class troubleBill extends PureComponent {
  state = {
    seeVisible: false,
    replyVisible: false,
    textAreaVal: '',
    type: '',
    startDateString: '',
    endDateString: '',
    userName: '',
  };
  componentDidMount = () => {
    this.getLists();
  }
  onChange = (e) => {
    this.setState({ userName: e.target.value });
    // console.log(111,e.target.value,this);
  }
  onTextAreaChange = (e) => {
    this.setState({
      textAreaVal: e.target.value,
    });
    console.log(this.state.textAreaVal, e.target.value);
  }
  onFindData = (e) => {
    this.getLists();
  }
  onSeeHandle = (record) => {
    this.setState({
      seeVisible: true,
    });
    console.log(record);
  }
  onReplyHandle = (record) => {
    this.setState({
      replyVisible: true,
    });
    console.log(record);
  }
  // 获取列表
  getLists = () => {
    this.props.dispatch({
      type: 'troubleBill/getCheckFaultList',
      payload: {
        params: {
          type: this.state.type,
          startTime: this.state.startDateString,
          endTime: this.state.endDateString,
          keyword: this.state.userName,
          status: '',
        },
      },
    });
  }
  seeHandleCancel = (e) => {
    this.setState({
      seeVisible: false,
    });
  }
  replyOKHandle = (e) => {
    this.setState({
      replyVisible: false,
    });
  }
  replyHandleCancel = (e) => {
    this.setState({
      replyVisible: false,
    });
  }
  startDatePickerChange = (date, dateString) => {
    this.setState({
      type: '1',
      startDateString: dateString,
    });
    console.log('startDatePickerChange::', date, dateString);
  }
  endDatePickerChange = (date, dateString) => {
    this.setState({
      type: '2',
      endDateString: dateString,
    });
    console.log('endDatePickerChange::', date, dateString);
  }
  render() {
    const { seeVisible, replyVisible } = this.state;
    const { troubleBill: { list, page } } = this.props;
    // console.log(11111, list, page);
    const columns = [{
      title: '故障单ID',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '机器ID',
      dataIndex: 'machineCode',
      key: 'machineCode',
    }, {
      title: '故障描述',
      dataIndex: 'type',
      key: 'type',
    }, {
      title: '上报时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
    }, {
      title: '上报人',
      dataIndex: 'submitUser',
      key: 'submitUser',
    }, {
      title: '解决时间',
      dataIndex: 'finishTime',
      key: 'finishTime',
    }, {
      title: '解决人',
      dataIndex: 'finishUser',
      key: 'finishUser',
    }, {
      title: '解决方案',
      dataIndex: 'finishRemark',
      key: 'finishRemark',
    }, {
      title: '故障状态',
      dataIndex: 'status',
      key: 'status',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="javascript:;" onClick={this.onReplyHandle.bind(this, record)} style={{ display: record.status === 0 ? 'none' : 'block' }}>回复</a>
          <a href="javascript:;" onClick={this.onSeeHandle.bind(this, record)} style={{ display: record.status === 1 ? 'none' : 'block' }}>查看</a>
        </span>
      ),
    }];
    // const paginationProps = {
    //   showTotal: (total) => {
    //     return `共${total}条数据  每页${page.pageSize}条`;
    //   },
    //   ...page,
    // };
    return (
      <PageHeaderLayout>
        <Card>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={2} sm={24}>
              开始时间
            </Col>
            <Col md={4} sm={24}>
              <DatePicker onChange={this.startDatePickerChange} />
            </Col>
            <Col md={2} sm={24}>
              解决时间
            </Col>
            <Col md={4} sm={24}>
              <DatePicker onChange={this.endDatePickerChange} />
            </Col>
            <Col md={7} sm={24}>
              <Input placeholder="请输入角色名称" onChange={this.onChange} />
            </Col>
            <Col md={5} sm={24}>
              <Button className={styles.serach} style={{ marginLeft: 8}} type="primary" onClick={this.onFindData.bind(this)}>查询</Button>
            </Col>
          </Row>
        </Card>
        <Card>
          <Table
            columns={columns}
            dataSource={list}
            rowKey="id"
            // pagination={paginationProps}
          />
        </Card>
        <Modal
          title="查看"
          visible={seeVisible}
          onCancel={this.seeHandleCancel}
          footer={[
            <Button key="submit" type="primary" onClick={this.seeHandleCancel}>
              关闭
            </Button>,
          ]}
        >
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              故障ID
            </Col>
            <Col md={15} sm={24}>
              1111
            </Col>
          </Row>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              机器ID
            </Col>
            <Col md={15} sm={24}>
              1111
            </Col>
          </Row>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              上报人
            </Col>
            <Col md={15} sm={24}>
              1111
            </Col>
          </Row>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              上报时间
            </Col>
            <Col md={15} sm={24}>
              1111
            </Col>
          </Row>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              解决人
            </Col>
            <Col md={15} sm={24}>
              1111
            </Col>
          </Row>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              解决时间
            </Col>
            <Col md={15} sm={24}>
              1111
            </Col>
          </Row>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              故障描述
            </Col>
            <Col md={15} sm={24}>
              1111
            </Col>
          </Row>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              解决方案
            </Col>
            <Col md={15} sm={24}>
              1111
            </Col>
          </Row>
        </Modal>
        <Modal
          title="回复"
          visible={replyVisible}
          onOk={this.replyOKHandle}
          onCancel={this.replyHandleCancel}
        >
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              故障ID
            </Col>
            <Col md={15} sm={24}>
              1111
            </Col>
          </Row>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              机器ID
            </Col>
            <Col md={15} sm={24}>
              1111
            </Col>
          </Row>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              上报人
            </Col>
            <Col md={15} sm={24}>
              1111
            </Col>
          </Row>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              上报时间
            </Col>
            <Col md={15} sm={24}>
              1111
            </Col>
          </Row>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              解决人
            </Col>
            <Col md={15} sm={24}>
              1111
            </Col>
          </Row>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              解决时间
            </Col>
            <Col md={15} sm={24}>
              1111
            </Col>
          </Row>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              故障描述
            </Col>
            <Col md={15} sm={24}>
              1111
            </Col>
          </Row>
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              回复
            </Col>
            <Col md={15} sm={24}>
              <TextArea placeholder="请输入" onChange={this.onTextAreaChange.bind(this)} autosize={{ minRows: 2, maxRows: 6 }} />
            </Col>
          </Row>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
