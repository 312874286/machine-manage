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
  Cascader
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
    resource: [],
    events: [],
    options: [],
  };
  componentDidMount() {
    this.getLists();
    this.getAreaList('')
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
      let resource = res.map((item) => {
        return {id: item.machineCode, title: item.localDesc, code: item.machineCode}
      })
      let events = []
      for (let i = 0; i < res.length; i++) {
        if (res[i].planTime.length > 0) {
          for (let j = 0; j < res[i].planTime.length; j++) {
            let a = {resourceId: res[i].machineCode, start : `${res[i].planTime[j].startTime.split(' ')[0]}T${res[i].planTime[j].startTime.split(' ')[1]}`, end: `${res[i].planTime[j].endTime.split(' ')[0]}T${res[i].planTime[j].endTime.split(' ')[1]}`, rendering: 'background', color: 'red'}
            events.push(a)
          }
        }
      }
      this.setState({
        resource,
        events,
      })
    });
  }
  getAreaList = (selectedOptions) => {
    let code = '';
    let targetOption = null;
    let params = { code: code }
    if (selectedOptions) {
      targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;
      params = { code: targetOption.value }
    }
    this.props.dispatch({
      type: 'common/getProvinceCityAreaTradeArea',
      payload: {
        restParams: {
          params,
        }
      },
    }).then((res) => {
      if (!selectedOptions) {
        this.setState({
          options: res,
        });
      } else {
        targetOption.loading = false;
        targetOption.children = res
        this.setState({
          options: [...this.state.options],
        });
      }
    });
  }
  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="省市区商圈">
              {getFieldDecorator('code')(
                <Cascader
                  placeholder="请选择"
                  options={this.state.options}
                  loadData={this.loadData}
                  changeOnSelect
                />
              )}
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
          <MachinePlanTable resource={this.state.resource} events={this.state.events} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
