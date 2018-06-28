import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  message,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './DoctorOnline.less';
import DoctorOnlineTable from '../../components/Doctor/doctorOnlineTable';

const FormItem = Form.Item;

@connect(({ doctorOnline, loading }) => ({
  doctorOnline,
  loading: loading.models.doctorOnline,
}))
@Form.create()
export default class DoctorOnline extends PureComponent {
  state = {
    pageNo: 1,
    keyword: '',
  };

  componentDidMount = () => {
    this.getList();
  }

  // 获取列表
  getList = () => {
    this.props.dispatch({
      type: 'doctorOnline/getOnlineDoctorList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
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
        pageNo: 1,
        keyword: fieldsValue.keyword,
      }, () => {
        this.getList();
      });
    });
  }

  // 下线事件
  handleDelClick = (record) => {
    this.props.dispatch({
      type: 'doctorOnline/setDoctorOffline',
      payload: {
        params: {
          doctorId: record.doctorId,
        },
      },
    }).then((resp) => {
      if (resp.code !== 0) {
        return;
      }
      message.success('操作成功');
      this.getList();
    });
  }

  handleUnlock = (record) => {
    this.props.dispatch({
      type: 'doctorOnline/setDoctorUnlock',
      payload: {
        params: {
          doctorId: record.doctorId,
        },
      },
    }).then((resp) => {
      if (!resp || resp.code !== 0) {
        return;
      }
      message.success('操作成功');
      this.getList();
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { doctorOnline: { list, page }, loading } = this.props;
    const {
      keyword,
    } = this.state;

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={12}>
                    <FormItem label="关键字">
                      {getFieldDecorator('keyword', {
                        initialValue: keyword,
                      })(
                        <Input placeholder="请输入医生姓名" />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={12}>
                    <span className={styles.submitButtons}>
                      <Button type="primary" htmlType="submit">查询</Button>
                    </span>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>

          <DoctorOnlineTable
            loading={loading}
            data={list}
            page={page}
            handleTableChange={this.handleTableChange}
            onDelClick={this.handleDelClick}
            onUnlock={this.handleUnlock}
          />
        </Card>
      </PageHeaderLayout>
    )
  }
}
