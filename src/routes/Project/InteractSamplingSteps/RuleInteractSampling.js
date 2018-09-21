import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Select,
  Input,
  DatePicker,
  Steps,
  Checkbox
} from 'antd';
import StandardTable from '../../../components/StandardTable/index';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './BasicInteractSampling.less';
import {getAccountMenus} from "../../../utils/authority";

const Step = Steps.Step;
const FormItem = Form.Item;

@connect(({ common, loading, interactSamplingSetting }) => ({
  common,
  interactSamplingSetting,
  loading: loading.models.interactSamplingSetting,
}))
@Form.create()
export default class areaSettingList extends PureComponent {
  state = {
    current: 3,
    checkNick: false
  };
  componentDidMount() {
  }
  check = () => {
    this.props.form.validateFields(
      (err) => {
        if (!err) {
          console.info('success');
        }
      },
    );
  }

  handleChange = (e) => {
    this.setState({
      checkNick: e.target.checked,
    }, () => {
      this.props.form.validateFields(['name'], { force: true });
    });
  }
  render() {
    const {
      interactSamplingSetting: { list, page, unColumn },
      loading,
    } = this.props;
    const { current } = this.state
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const steps = [{
      title: '基本信息',
      content: '',
    }, {
      title: '商户商品信息',
      content: '',
    }, {
      title: '选择机器',
      content: '',
    }, {
      title: '规则设置',
      content: '',
    }];
    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
            <Steps current={current}>
              {steps.map(item => <Step key={item.title} title={item.title} />)}
            </Steps>
            <div className={styles.stepsContent}>
              <Form onSubmit={this.handleSearch}>
                <FormItem {...formItemLayout} label="活动规则">
                </FormItem>
                <FormItem {...formItemLayout} label="同一用户参与活动次数">
                  <Col span={14}>
                    <FormItem>
                      {getFieldDecorator('name', {
                        rules: [{ required: !this.state.checkNick, whitespace: true, message: '请输入同一用户参与活动次数' }],
                      })
                      (<Input
                        placeholder="请输入同一用户参与活动次数"
                        disabled={this.state.checkNick}
                      />)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem>
                      <Checkbox
                        value={this.state.checkNick}
                        onChange={this.handleChange}>
                      </Checkbox>
                    </FormItem>
                  </Col>
                </FormItem>
                <FormItem {...formItemLayout} label="同一用户每天参与活动次数">
                  {getFieldDecorator('code', {
                    rules: [{ required: true, whitespace: true, message: '请输入同一用户每天参与活动次数' }],
                  })(<Input placeholder="请输入同一用户每天参与活动次数" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="同一用户获得商品次数">
                  {getFieldDecorator('code', {
                    rules: [{ required: true, whitespace: true, message: '请输入同一用户获得商品次数' }],
                  })(<Input placeholder="请输入同一用户获得商品次数" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="同一用户每天得商品次数">
                  {getFieldDecorator('code', {
                    rules: [{ required: true, whitespace: true, message: '请输入同一用户每天得商品次数' }],
                  })(<Input placeholder="请输入同一用户每天得商品次数" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="商品信息">
                </FormItem>

                <FormItem {...formItemLayout} label="每天可派发数">
                  {getFieldDecorator('code', {
                    rules: [{ required: true, whitespace: true, message: '请输入每天可派发数' }],
                  })(<Input placeholder="请输入每天可派发数" />)}
                </FormItem>
              </Form>
            </div>
            <div className={styles.stepsAction}>
              {
                <Button onClick={() => this.next()}>取消</Button>
              }
              {
                <Button onClick={() => this.next()}>暂存</Button>
              }
              {
                current > 0
                && (
                  <Button type="primary" style={{ marginLeft: 8 }}
                          onClick={() => this.props.history.push({pathname: '/project/addMachineInteractSampling', query: {statusValue: 3}})}>
                    上一步
                  </Button>
                )
              }
              {
                 <Button type="primary" onClick={this.check}>提交</Button>
              }
            </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
