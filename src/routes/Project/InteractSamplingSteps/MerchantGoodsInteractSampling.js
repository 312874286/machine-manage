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
  Steps
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
    current: 1
  };
  componentDidMount() {
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
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 },
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
                <FormItem {...formItemLayout} label="互派活动">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, whitespace: true, message: '请输入互派活动' }],
                  })(<Input placeholder="请输入互派活动" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="游戏编号">
                  {getFieldDecorator('code', {
                    rules: [{ required: true, whitespace: true, message: '请输入游戏编号' }],
                  })(<Input placeholder="请输入游戏编号" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="互派游戏">
                  {getFieldDecorator('remark')(
                    <Input placeholder="请输入备注描述"/>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="预计时长">
                  {getFieldDecorator('code', {
                    rules: [{ required: true, whitespace: true, message: '请输入预计的天数' }],
                  })(<Input placeholder="请输入预计时长" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="负责人">
                  {getFieldDecorator('code', {
                    rules: [{ required: true, whitespace: true, message: '请输入项目负责人' }],
                  })(<Input placeholder="请输入负责人" />)}
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
                          onClick={() => this.props.history.push({pathname: '/project/addBasicInteractSampling', query: {statusValue: 3}})}>
                    上一步
                  </Button>
                )
              }
              {
                current < steps.length - 1
                && <Button type="primary"
                           onClick={() => this.props.history.push({pathname: '/project/addMachineInteractSampling', query: {statusValue: 3}})}>下一步</Button>
              }
            </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
