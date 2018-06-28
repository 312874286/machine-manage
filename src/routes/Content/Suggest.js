import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Modal,
  message,
  DatePicker,
  Select,
  Table,
  Spin,
  Upload,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Suggest.less';
import SuggestTable from '../../components/Content/suggestTable';
import { auditStatusData } from '../../common/config/order';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ suggest, loading }) => ({
  suggest,
  loading: loading.models.suggest,
}))
@Form.create()
export default class Suggest extends PureComponent {
  state = {
    pageNo: 1,
    status: '',
    keyword: '',
    detailModalVisible: false,
    detail: {
      histories: [],
      imgs: [],
    },
    modalLoading: false,
    previewVisible: false,
    previewImage: '',
    textareaValue: '',
  };

  componentDidMount = () => {
    this.getList();
  }

  // 获取列表
  getList = () => {
    this.props.dispatch({
      type: 'suggest/getSuggestList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          status: this.state.status,
          keyword: this.state.keyword,
        },
      },
    });
  }

  // 分页
  handleTableChange = (pagination) => {
    const { current } = pagination;
    this.setState({
      pageNo: current,
    }, () => {
      this.getList();
    });
  }

  // 搜索
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.setState({
        status: fieldsValue.status,
        keyword: fieldsValue.keyword,
      }, () => {
        this.getList();
      });
    });
  }

  // 详情
  handleDetailClick = (item) => {
    this.setState({
      detailModalVisible: true,
      modalLoading: true,
    });

    this.props.dispatch({
      type: 'suggest/getSuggestDetail',
      payload: {
        restParams: {
          orderId: item.id,
        },
      },
    }).then((resp) => {
      const detail = resp.data;
      this.setState({
        detail,
        modalLoading: false,
      });
    });
  }

  saveFormRef = (form) => {
    this.form = form;
  }

  // 图片放大展示
  imgHandleCancel = () => this.setState({ previewVisible: false })
  imgHandlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  textareaChange = (e) => {
    this.setState({
      textareaValue: e.target.value,
    });
  }

  // 详情modal 取消
  detailModalHandleCancel = () => {
    this.setState({
      detailModalVisible: false,
    });
  }


  // 详情modal 审核通过
  detailModalHandleOk = (status) => {
    if (!this.state.textareaValue && status === 0) {
      message.error('请填写审核建议');
      return;
    }

    this.props.dispatch({
      type: 'suggest/audit',
      payload: {
        params: {
          orderId: this.state.detail.orderId,
          status,
          auditInfo: this.state.textareaValue,
        },
      },
    }).then((resp) => {
      if (resp.code !== 0) {
        message.error(resp.msg);
        return;
      }
      message.success('提交成功');
      this.setState({
        textareaValue: '',
        detailModalVisible: false,
      });
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { suggest: { list, page }, loading } = this.props;
    const {
      keyword,
      status,
      detailModalVisible,
      detail,
      previewVisible,
      previewImage,
      textareaValue,
    } = this.state;

    const { histories } = detail;

    const fileList = [];
    if (detail.imgs) {
      detail.imgs.forEach((item, index) => {
        fileList.push({
          uid: -index,
          name: item,
          status: 'done',
          url: `http://static.pinwheelmedical.com/${item}`,
        });
      });
    }

    const historiesColumns = [
      {
        title: '医生姓名',
        width: 120,
        dataIndex: 'a',
        render: (value, row) => {
          return JSON.parse(row.info).doctorName;
        },
      },
      {
        title: '医嘱内容',
        width: 240,
        dataIndex: 'b',
        render: (value, row) => {
          return JSON.parse(row.info).doctorAdvice;
        },
      },
      {
        title: '医嘱提交时间',
        width: 140,
        dataIndex: 'c',
        render: (value, row) => {
          return JSON.parse(row.info).doctorAdviceTime;
        },
      },
      {
        title: '审核建议',
        width: 240,
        dataIndex: 'd',
        render: (value, row) => {
          return JSON.parse(row.info).a;
        },
      },
      {
        title: '审核人',
        width: 150,
        dataIndex: 'e',
        render: (value, row) => {
          return JSON.parse(row.info).auditor;
        },
      },
      {
        title: '审核时间',
        width: 140,
        dataIndex: 'f',
        render: (value, row) => {
          return JSON.parse(row.info).time;
        },
      },
      {
        title: '审核结果',
        width: 120,
        dataIndex: 'g',
        render: (value, row) => {
          return JSON.parse(row.info).status;
        },
      },
    ];


    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={12}>
                    <FormItem label="审核状态">
                      {getFieldDecorator('status', {
                        initialValue: status,
                      })(
                        <Select placeholder="请选择" >
                          {auditStatusData.map((item, index) => {
                            return <Option key={index} value={item.id}>{item.name}</Option>
                          })}
                          <Option value="">全部</Option>
                        </Select>
                        )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={12}>
                    <FormItem label="关键字">
                      {getFieldDecorator('keyword', {
                        initialValue: keyword,
                      })(
                        <Input placeholder="订单ID/宝宝姓名/医生姓名关键字" />
                        )}
                    </FormItem>
                  </Col>
                </Row>
                <Row className={styles.submitButtons} gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={12}>
                    <Button type="primary" htmlType="submit">查询</Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>

          <SuggestTable
            loading={loading}
            data={list}
            page={page}
            handleTableChange={this.handleTableChange}
            onDetailClick={this.handleDetailClick}
          />
        </Card>

        <Modal
          title="详情"
          width={1100}
          style={{ top: 20 }}
          visible={detailModalVisible}
          onCancel={this.detailModalHandleCancel}
          footer={null}
        >
          <Spin spinning={this.state.modalLoading} >
            <div className={styles.modalBody}>
              <Row gutter={12}>
                <Col span={10}>
                  <Card title="订单基本信息" >
                    <Row>
                      <Col span={7} className="label">订单号</Col>
                      <Col span={17}>
                        <p>{detail.orderNum}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={7} className="label">医生ID</Col>
                      <Col span={17}>
                        <p>{detail.doctorId}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={7} className="label">医生姓名</Col>
                      <Col span={17}>
                        <p>{detail.doctorName}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={7} className="label">医嘱提交时间</Col>
                      <Col span={17}>
                        <p>{detail.submitTime}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={7} className="label">宝宝ID</Col>
                      <Col span={17}>
                        <p>{detail.fromId}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={7} className="label">宝宝姓名</Col>
                      <Col span={17}>
                        <p>{detail.babyName}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={7} className="label">宝宝性别</Col>
                      <Col span={17}>
                        <p>{detail.babySex === '1' ? '男' : '女'}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={7} className="label">宝宝生日</Col>
                      <Col span={17}>
                        <p>{detail.babyBirthday}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={7} className="label">宝宝身高</Col>
                      <Col span={17}>
                        <p>{detail.patientHeight}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={7} className="label">宝宝体重</Col>
                      <Col span={17}>
                        <p>{detail.patientWeight}</p>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col span={14}>
                  <Card title="家长描述">
                    <Row>
                      <Col span={6} className="label">用户自述</Col>
                      <Col span={18}>
                        <p>{detail.illness}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6} className="label">症状图片</Col>
                      <Col span={18}>
                        <Upload
                          disabled
                          action="//example.com"
                          listType="picture-card"
                          fileList={fileList}
                          onPreview={this.imgHandlePreview}
                        />
                        <Modal visible={previewVisible} footer={null} onCancel={this.imgHandleCancel}>
                          <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <Row gutter={12} style={{ marginTop: '20px' }}>
                <Col span={10}>
                  <Card title="诊断建议">
                    <p dangerouslySetInnerHTML={{ __html: detail.doctorAdvice ? JSON.parse(detail.doctorAdvice) : '' }} style={{ whiteSpace: 'pre-wrap' }} />
                  </Card>
                </Col>
                <Col span={14}>
                  <Card title="审核记录">
                    <Table
                      rowKey={item => item.id}
                      columns={historiesColumns}
                      dataSource={histories}
                      size="small"
                      scroll={{ x: '140%' }}
                      pagination={false}
                    />
                  </Card>
                </Col>
              </Row>
              {detail.auditStatus === 0 && (
                <Row gutter={12} style={{ marginTop: '20px' }}>
                  <Col span={24}>
                    <Card title="审核建议（驳回必填）">
                      <TextArea rows={4} value={textareaValue} onChange={this.textareaChange} />
                      <p style={{ marginTop: '20px', textAlign: 'right' }}>
                        <Button type="danger" style={{ marginRight: '10px' }} onClick={() => { this.detailModalHandleOk(0); }}>驳回</Button>
                        <Button type="primary" onClick={() => { this.detailModalHandleOk(1); }}>审核通过</Button>
                      </p>
                    </Card>
                  </Col>
                </Row>
              )}
            </div>
          </Spin>
        </Modal>
      </PageHeaderLayout>
    )
  }
}
