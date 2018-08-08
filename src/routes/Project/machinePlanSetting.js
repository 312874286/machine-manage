import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Row,
  Col,
  Input,
  Select,
  Button,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './machinePlanSetting.less'
import MachinePlanTable  from '../../components/Project/machinePlanTable'
const FormItem = Form.Item;

@connect(({ common, loading, machinePlanSetting }) => ({
  common,
  machinePlanSetting,
  loading: loading.models.machinePlanSetting,
}))
@Form.create()
export default class machinePlanSettingList extends PureComponent {
  state = {
    machineCode: '',
    startTime: '',
    localCode: '',
    endTime: '',
    data: [],
  };
  componentDidMount() {
    this.getLists();
  }
  // 获取列表
  getLists = () => {
    this.props.dispatch({
      type: 'machinePlanSetting/getMachinePLanSetting',
      payload: {
        restParams: {
          machineCode: '',
          startTime: '',
          localCode: '',
          endTime: '',
        },
      },
    }).then((res) => {
      // resource = { id: 'a', title: '王府井A', occupancy: 40 },
      let resource = res.map((item) => {
        return {id: item.machineCode, title: item.localDesc, code: item.machineCode}
      })
      console.log('resource', resource)
      // events: [
      //   {"resourceId":"a","title":"","start":"2018-08-01","end":"2018-08-04",rendering: 'background',color: 'red'},
      // return res.map((item) => {
      //   let i = {}
      // })
      this.setState({
        data: res
      })
    });
  }
  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { merchantLists } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="省市区商圈">
              {/*{getFieldDecorator('code')(*/}
              {/*)}*/}
            </FormItem>
          </Col>
          <Col md={9} sm={24}>
            <FormItem>
              {getFieldDecorator('keyword')(<Input placeholder="请输入机器编码搜索" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <span>
              <FormItem>
                <Button onClick={this.handleFormReset}>
                 重置
                </Button>
                <Button className={styles.serach} style={{ marginLeft: 8 }} type="primary" htmlType="submit">
                 查询
                </Button>
              </FormItem>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
          <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
        </Card>
        <Card bordered={false}>
          <MachinePlanTable />
        </Card>
      </PageHeaderLayout>
    );
  }
}
