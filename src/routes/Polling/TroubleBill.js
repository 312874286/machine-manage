import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Button, Form, Row, Col, Input, Modal, DatePicker, Tree, message, Popconfirm, List, Select,Upload, Icon } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TroubleBill.less';
import moment from 'moment';
import 'moment/locale/zh-cn';

const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ troubleBill }) => ({ troubleBill }))
export default class troubleBill extends PureComponent {
  state = {
    seeVisible: false,
    replyVisible: false,
    textAreaVal: '',
    type: '1',
    startDateString: '',
    endDateString: '',
    userName: '',
    seeData: [],
    pageNo: 1,
    currentRecord: {
      "id": "",
      "machineId": "",
      "type": '',
      "submitUser": "",
      "finishUser": '',
      "submitTime": 0,
      "finishTime": 0,
      "status": 0,
      "finishRemark": '',
      "remindStatus": 0,
      "remark": "",
    },
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };
  constructor(props) {
    super(props);
    // console.log(1111,moment().subtract(30,'days').format('YYYY-MM-DD'));
    this.state.startDateString = moment().subtract(30,'days').format('YYYY-MM-DD');
    this.state.endDateString = moment().format('YYYY-MM-DD');
  }
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

    if (this.state.startDateString === '') {
      message.info('请选择开始时间');
      return;
    }
    if (this.state.endDateString === '') {
      message.info('请选择解决时间');
      return;
    }

    this.getLists();
  }
  onSeeHandle = (record) => {

    this.setState({
      currentRecord: record,
    });
    console.log('111', record.id);
    this.props.dispatch({
      type: 'troubleBill/getCheckFaultDetail',
      payload: {
        params: {
          id: record.id,
        },
      },
    }).then((res) => {
      const { code, data, msg } = res;
      // console.log(data.functions);
      this.setState({
        seeData: data,
      }, () => {
        // console.log(11111,this.state.seeData);
        var newImgList = [];
        for(var i = 0 ; i < this.state.seeData.imgList.length ; i++){
          newImgList.push({
            uid: i,
            name: this.state.seeData.imgList[i],
            status: 'done',
            url: this.state.seeData.imgList[i],
          });
        }
        this.setState({
          fileList: newImgList,
        });
      });
      console.log(data);
      this.setState({
        seeVisible: true,
      });
      // treeData = data;

    });


  }
  onReplyHandle = (record) => {
    this.setState({
      textAreaVal: '',
      currentRecord: record,
    });
    this.props.dispatch({
      type: 'troubleBill/getCheckFaultDetail',
      payload: {
        params: {
          id: record.id,
        },
      },
    }).then((res) => {
      const { code, data, msg } = res;
      // console.log(data.functions);


      this.setState({
        seeData: data,
      }, () => {
        // console.log(11111,this.state.seeData);
        var newImgList = [];
        for(var i = 0 ; i < this.state.seeData.imgList.length ; i++){
          newImgList.push({
            uid: i,
            name: this.state.seeData.imgList[i],
            status: 'done',
            url: this.state.seeData.imgList[i],
          });
        }
        this.setState({
          fileList: newImgList,
        });
      });
      console.log(data);
      this.setState({
        // textAreaVal: '',
        replyVisible: true,
      });
      // treeData = data;

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
          pageNo: this.state.pageNo,
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
    if (this.state.textAreaVal.replace(/\s+/g, '') === '') {
      message.info('请填写回复消息');
      return;
    }
    this.props.dispatch({
      type: 'troubleBill/getCheckFaultAnswer',
      payload: {
        params: {
          id: this.state.currentRecord.id,
          remark: this.state.textAreaVal,
        },
      },
    }).then((res) => {
      const { code, data, msg } = res;
      // console.log(data.functions);
      console.log(data);
      if (code === 0) {
        message.success(msg);
        this.setState({
          replyVisible: false,
        });
      } else {
        message.error(msg);
      }
      // treeData = data;

    });


  }
  replyHandleCancel = (e) => {
    this.setState({
      replyVisible: false,
    });
  }
  startDatePickerChange = (date, dateString) => {
    console.log('startDatePickerChange::', date, dateString);
    this.setState({
      // type: '1',
      startDateString: dateString[0],
      endDateString: dateString[1],
    });
  }
  endDatePickerChange = (date, dateString) => {
    this.setState({
      // type: '2',
      endDateString: new Date(dateString).getTime(),
    });
    console.log('endDatePickerChange::', date, dateString, new Date(dateString).getTime());
  }
  selectHandleChange = (value) => {
    this.setState({
      type: value,
    });
    // console.log(`selected ${value}`);
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
      type: '1',
      userName: '',
      startDateString: moment().subtract(30,'days').format('YYYY-MM-DD'),
      endDateString: moment().format('YYYY-MM-DD'),
    });
    console.log('handleReset::');
  }
  handleCancel = () => this.setState({ previewVisible: false })
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => this.setState({ fileList })
  render() {
    const { seeVisible, replyVisible, seeData, currentRecord, textAreaVal, type, userName, startDateString, endDateString, previewVisible, previewImage, fileList } = this.state;
    const { troubleBill: { list, page } } = this.props;

    var arr = ['未解决','已解决'];
    // console.log(11111, list, page);
    const columns = [{
      title: '故障单ID',
      dataIndex: 'id',
      key: 'id',
      width: '19%'
    }, {
      title: '机器ID',
      dataIndex: 'machineId',
      key: 'machineId',
      width: '8%'
    }, {
      title: '故障描述',
      dataIndex: 'remark',
      key: 'remark',
      width: '10%'
    }, {
      title: '上报时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: '12%'
    }, {
      title: '上报人',
      dataIndex: 'submitUser',
      key: 'submitUser',
      width: '8%'
    }, {
      title: '解决时间',
      dataIndex: 'finishTime',
      key: 'finishTime',
      width: '12%'
    }, {
      title: '解决人',
      dataIndex: 'finishUser',
      key: 'finishUser',
      width: '8%'
    }, {
      title: '解决方案',
      dataIndex: 'finishRemark',
      key: 'finishRemark',
      width: '10%'
    }, {
      title: '故障状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <span>
          { arr[record.status]  }
        </span>
      )
    }, {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (text, record) => (
        <span>
          <a href="javascript:;" onClick={this.onReplyHandle.bind(this, record)} style={{ display: record.status === 0 ? 'block' : 'none' }}>回复</a>
          <a href="javascript:;" onClick={this.onSeeHandle.bind(this, record)} style={{ display: record.status === 1 ? 'block' : 'none' }}>查看</a>
        </span>
      ),
    }];
    const paginationProps = {
      showTotal: (total) => {
        // console.log(total, page)
        return `第${page.current}页 / 共${Math.ceil(total/page.pageSize)}页`;
      },
      ...page,
      showQuickJumper: true,
    };
    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 10px'}}>
          {/*<div className={styles.tableList}>*/}
            {/*<div className={styles.tableListForm}>*/}
              {/*<Form onSubmit={this.onFindData.bind(this)} layout="inline">*/}
                {/*<Col md={3} sm={24}>*/}
                  {/*<Select value={type} onChange={this.selectHandleChange}>*/}
                    {/*<Option value="1">上报时间</Option>*/}
                    {/*<Option value="2">解决时间</Option>*/}
                  {/*</Select>*/}
                {/*</Col>*/}
                {/*<Col md={6} sm={24}>*/}
                  {/*<RangePicker*/}
                    {/*allowClear={false}*/}
                    {/*value={[moment(startDateString, 'YYYY-MM-DD'), moment(endDateString, 'YYYY-MM-DD')]}*/}
                    {/*onChange={this.startDatePickerChange}*/}
                  {/*/>*/}
                {/*</Col>*/}
                {/*<Col md={8} sm={24}>*/}
                  {/*<Input placeholder="请输入上报人，解决人，机器编号搜索" value={userName} onChange={this.onChange} />*/}
                {/*</Col>*/}
                {/*<Col md={7} sm={24}>*/}
                  {/*<FormItem>*/}
                    {/*<Button onClick={this.handleReset}>*/}
                      {/*重置*/}
                    {/*</Button>*/}
                    {/*<Button className={styles.serach} style={{ marginLeft: 8 }} type="primary" onClick={this.onFindData.bind(this)}>查询</Button>*/}
                  {/*</FormItem>*/}
                {/*</Col>*/}
              {/*</Form>*/}
            {/*</div>*/}
          {/*</div>*/}
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={3} sm={24}>
              <Select value={type} onChange={this.selectHandleChange}>
                <Option value="1">上报时间</Option>
                <Option value="2">解决时间</Option>
              </Select>
            </Col>
            <Col md={6} sm={24}>
              {/* <DatePicker placeholder="开始时间"
              selectedValue={this.state.startDateString}
              value={this.state.startDateString}
              showTime={{
                defaultValue: this.state.startDateString,
                value: this.state.startDateString,
              }}
              onChange={this.startDatePickerChange} /> */}
              <RangePicker
               allowClear={false}
               value={[moment(startDateString, 'YYYY-MM-DD'), moment(endDateString, 'YYYY-MM-DD')]}
               onChange={this.startDatePickerChange}
              />
            </Col>
            {/* <Col md={2} sm={24}>
              解决时间
            </Col>
            <Col md={4} sm={24}>
              <DatePicker onChange={this.endDatePickerChange} />
            </Col> */}
            <Col md={8} sm={24}>
              <Input placeholder="请输入上报人，解决人，机器编号搜索" value={userName} onChange={this.onChange} />
            </Col>
            <Col md={7} sm={24}>
              <Button onClick={this.handleReset}>
                重置
              </Button>
              <Button className={styles.serach} style={{ marginLeft: 8 }} type="primary" onClick={this.onFindData.bind(this)}>查询</Button>
            </Col>
          </Row>
        </Card>
        <Card bordered={false}>
          <Table
            columns={columns}
            dataSource={list}
            rowKey="id"
            onChange={this.handleTableChange}
            pagination={paginationProps}
            scroll={{ x: 1500, y: (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 100) }}
          />
        </Card>
        {/*<Modal*/}
          {/*title={*/}
            {/*<div class="modalBox">*/}
              {/*<span class="leftSpan"></span>*/}
              {/*<span class="modalTitle">查看</span>*/}
            {/*</div>*/}
          {/*}*/}
          {/*visible={seeVisible}*/}
          {/*onCancel={this.seeHandleCancel}*/}
          {/*footer={[*/}
            {/*<Button key="submit" type="primary" onClick={this.seeHandleCancel}>*/}
              {/*关闭*/}
            {/*</Button>,*/}
          {/*]}>*/}
          {/*<Row gutter={{ md: 24, lg: 24, xl: 48 }}>*/}
            {/*<Col md={6} sm={24}>*/}
              {/*故障ID*/}
            {/*</Col>*/}
            {/*<Col md={15} sm={24}>*/}
              {/*{seeData.id}*/}
            {/*</Col>*/}
          {/*</Row>*/}
          {/*<Row gutter={{ md: 24, lg: 24, xl: 48 }}>*/}
            {/*<Col md={6} sm={24}>*/}
              {/*机器ID*/}
            {/*</Col>*/}
            {/*<Col md={15} sm={24}>*/}
              {/*{seeData.machineCode}*/}
            {/*</Col>*/}
          {/*</Row>*/}
          {/*<Row gutter={{ md: 24, lg: 24, xl: 48 }}>*/}
            {/*<Col md={6} sm={24}>*/}
              {/*上报人*/}
            {/*</Col>*/}
            {/*<Col md={15} sm={24}>*/}
              {/*{seeData.submitUser}*/}
            {/*</Col>*/}
          {/*</Row>*/}
          {/*<Row gutter={{ md: 24, lg: 24, xl: 48 }}>*/}
            {/*<Col md={6} sm={24}>*/}
              {/*上报时间*/}
            {/*</Col>*/}
            {/*<Col md={15} sm={24}>*/}
              {/*{seeData.submitTime}*/}
            {/*</Col>*/}
          {/*</Row>*/}
          {/*<Row gutter={{ md: 24, lg: 24, xl: 48 }}>*/}
            {/*<Col md={6} sm={24}>*/}
              {/*解决人*/}
            {/*</Col>*/}
            {/*<Col md={15} sm={24}>*/}
              {/*{seeData.finishUser}*/}
            {/*</Col>*/}
          {/*</Row>*/}
          {/*<Row gutter={{ md: 24, lg: 24, xl: 48 }}>*/}
            {/*<Col md={6} sm={24}>*/}
              {/*解决时间*/}
            {/*</Col>*/}
            {/*<Col md={15} sm={24}>*/}
              {/*{seeData.finishTime}*/}
            {/*</Col>*/}
          {/*</Row>*/}
          {/*<Row gutter={{ md: 24, lg: 24, xl: 48 }}>*/}
            {/*<Col md={6} sm={24}>*/}
              {/*故障描述*/}
            {/*</Col>*/}
            {/*<Col md={15} sm={24}>*/}
              {/*{currentRecord.remark}*/}
            {/*</Col>*/}
          {/*</Row>*/}
          {/*<Row gutter={{ md: 24, lg: 24, xl: 48 }}>*/}
            {/*<Col md={6} sm={24}>*/}
              {/*图片*/}
            {/*</Col>*/}
            {/*<Col md={15} sm={24}>*/}
              {/*/!* <List*/}
                {/*dataSource={seeData.imgList}*/}
                {/*renderItem={item => (*/}
                  {/*<List.Item*/}
                    {/*extra={<img width={272} src={item} />}*/}
                  {/*></List.Item>*/}
                {/*)}*/}
              {/*/> *!/*/}
              {/*<Upload*/}
                {/*// action="//jsonplaceholder.typicode.com/posts/"*/}
                {/*listType="picture-card"*/}
                {/*fileList={fileList}*/}
                {/*onPreview={this.handlePreview}*/}
                {/*onChange={this.handleChange}*/}
              {/*>*/}
              {/*</Upload>*/}
              {/*<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>*/}
                {/*<img alt="example" style={{ width: '100%' }} src={previewImage} />*/}
              {/*</Modal>*/}
            {/*</Col>*/}
          {/*</Row>*/}
          {/*<Row gutter={{ md: 24, lg: 24, xl: 48 }}>*/}
            {/*<Col md={6} sm={24}>*/}
              {/*回复*/}
            {/*</Col>*/}
            {/*<Col md={15} sm={24}>*/}
              {/*<List*/}
                {/*dataSource={seeData.answerList}*/}
                {/*renderItem={item => (*/}
                  {/*<List.Item>{item}</List.Item>*/}
                {/*)}*/}
              {/*/>*/}
            {/*</Col>*/}
          {/*</Row>*/}
          {/*<Row gutter={{ md: 24, lg: 24, xl: 48 }}>*/}
            {/*<Col md={6} sm={24}>*/}
              {/*解决方案*/}
            {/*</Col>*/}
            {/*<Col md={15} sm={24}>*/}
              {/*{currentRecord.finishRemark}*/}
            {/*</Col>*/}
          {/*</Row>*/}
        {/*</Modal>*/}
        <Modal
          // title="回复"
          title={
            <div class="modalBox">
              <span class="leftSpan"></span>
              <span class="modalTitle">{currentRecord.remark}</span>
              {/*<span class="resolved" class={} style={{ display: currentRecord.finishTime ? '' : 'none'}}>已解决</span>*/}
              {/*<span class="willResolve">未解决</span>*/}
              <span class={ currentRecord.finishTime ? 'resolved' : 'willResolve' }>
                { currentRecord.finishTime ? '已解决' : '未解决' }
              </span>
            </div>
          }
          width={800}
          visible={seeVisible}
          onCancel={this.seeHandleCancel}
          footer={[
            <Button key="submit" type="primary" onClick={this.seeHandleCancel}>
              关闭
            </Button>,
          ]}>
          <div className="manageAppBox checkFaultBox">
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={3} sm={24}>
                <span className="left">故障编号</span>
              </Col>
              <Col md={8} sm={24}>
                {seeData.id}
              </Col>
              <Col md={3} sm={24}>
                <span className="left">机器编号</span>
              </Col>
              <Col md={8} sm={24}>
                {seeData.machineId}
              </Col>
            </Row>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={3} sm={24}>
                <span className="left">上报人员</span>
              </Col>
              <Col md={8} sm={24}>
                {seeData.submitUser}
              </Col>
              <Col md={3} sm={24}>
                <span className="left">解决人员</span>
              </Col>
              <Col md={8} sm={24}>
                {seeData.finishUser}
              </Col>
            </Row>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={3} sm={24} style={{ padding:  '0 0 0 0' }}>
                <span class="left">上报时间</span>
              </Col>
              <Col md={8} sm={24}>
                {seeData.submitTime}
              </Col>
              <Col md={3} sm={24}>
                <span className="left">解决时间</span>
              </Col>
              <Col md={8} sm={24}>
                {seeData.finishTime}
              </Col>
              {/*<Col md={12} sm={24}>*/}
              {/*<span className="left">上报时间</span>*/}
              {/*<span>{currentRecord.submitTime}</span>*/}
              {/*</Col>*/}
              {/*<Col md={12} sm={24}>*/}
              {/*<span class="left">解决时间</span>*/}
              {/*<span class="right">{currentRecord.finishTime}</span>*/}
              {/*</Col>*/}
            </Row>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={3} sm={24}>
                <span class="imgLeft">图片</span>
              </Col>
              <Col md={20} sm={24}>
                {/* <List
                dataSource={seeData.imgList}
                renderItem={item => (
                  <List.Item
                    extra={<img width={272} src={item} />}
                  ></List.Item>
                )}
              /> */}
                <div className="imgRight">
                  <Upload
                    // action="//jsonplaceholder.typicode.com/posts/"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                  >
                  </Upload>
                  <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </div>
              </Col>
            </Row>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={3} sm={24}>
                <span class="left">回复列表</span>
              </Col>
              <Col md={20} sm={24}>
                <List
                  dataSource={seeData.answerList}
                  renderItem={item => (
                    <List.Item>{item}</List.Item>
                  )}
                />
              </Col>
            </Row>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={3} sm={24}>
                <span class="left">解决方案</span>
              </Col>
              <Col md={20} sm={24}>
                {seeData.finishRemark}
              </Col>
            </Row>
          </div>
        </Modal>
        <Modal
          // title="回复"
          title={
            <div class="modalBox">
              <span class="leftSpan"></span>
              <span class="modalTitle">{currentRecord.remark}</span>
              {/*<span class="resolved" class={} style={{ display: currentRecord.finishTime ? '' : 'none'}}>已解决</span>*/}
              {/*<span class="willResolve">未解决</span>*/}
              <span class={ currentRecord.finishTime ? 'resolved' : 'willResolve' }>
                { currentRecord.finishTime ? '已解决' : '未解决' }
              </span>
            </div>
          }
          width={800}
          visible={replyVisible}
          onOk={this.replyOKHandle}
          onCancel={this.replyHandleCancel}>
          <div className="manageAppBox checkFaultBox">
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={3} sm={24}>
                <span className="left">故障编号</span>
              </Col>
              <Col md={8} sm={24}>
                {currentRecord.id}
              </Col>
              <Col md={3} sm={24}>
                <span className="left">机器编号</span>
              </Col>
              <Col md={8} sm={24}>
                {currentRecord.machineId}
              </Col>
            </Row>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={3} sm={24}>
                <span className="left">上报人员</span>
              </Col>
              <Col md={8} sm={24}>
                {currentRecord.submitUser}
              </Col>
              <Col md={3} sm={24}>
                <span className="left">解决人员</span>
              </Col>
              <Col md={8} sm={24}>
                {currentRecord.finishUser}
              </Col>
            </Row>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={3} sm={24} style={{ padding:  '0 0 0 0' }}>
                <span class="left">上报时间</span>
              </Col>
              <Col md={8} sm={24}>
                {currentRecord.submitTime}
              </Col>
              <Col md={3} sm={24}>
                <span className="left">解决时间</span>
              </Col>
              <Col md={8} sm={24}>
                {currentRecord.finishTime}
              </Col>
              {/*<Col md={12} sm={24}>*/}
                {/*<span className="left">上报时间</span>*/}
                {/*<span>{currentRecord.submitTime}</span>*/}
              {/*</Col>*/}
              {/*<Col md={12} sm={24}>*/}
                {/*<span class="left">解决时间</span>*/}
                {/*<span class="right">{currentRecord.finishTime}</span>*/}
              {/*</Col>*/}
            </Row>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={3} sm={24}>
                <span class="imgLeft">图片</span>
              </Col>
              <Col md={20} sm={24}>
                {/* <List
                dataSource={seeData.imgList}
                renderItem={item => (
                  <List.Item
                    extra={<img width={272} src={item} />}
                  ></List.Item>
                )}
              /> */}
                <div className="imgRight">
                  <Upload
                    // action="//jsonplaceholder.typicode.com/posts/"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                  >
                  </Upload>
                  <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </div>
              </Col>
            </Row>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={3} sm={24}>
                <span class="left">回复列表</span>
              </Col>
              <Col md={20} sm={24}>
                <List
                  dataSource={seeData.answerList}
                  renderItem={item => (
                    <List.Item>{item}</List.Item>
                  )}
                />
              </Col>
            </Row>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={3} sm={24}>
                <span class="left">回复内容</span>
              </Col>
              <Col md={20} sm={24}>
                <TextArea placeholder="请输入" value={textAreaVal} onChange={this.onTextAreaChange.bind(this)} autosize={{ minRows: 2, maxRows: 6 }} />
              </Col>
            </Row>
          </div>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
