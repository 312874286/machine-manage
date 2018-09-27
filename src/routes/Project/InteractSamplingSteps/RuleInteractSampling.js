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
  Checkbox, Table
} from 'antd';
import StandardTable from '../../../components/StandardTable/index';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './BasicInteractSampling.less';
import {getAccountMenus} from "../../../utils/authority";
import RuleInteractSampling from '../../../components/Project/RuleInteractSampling'

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
    times: false,
    dayTimes: false,
    number: false,
    dayNumber: false,
    interactSampling: '',
    allGoods: []
  };
  componentDidMount() {
    this.setState({
      interactSampling: this.props.match.params.id
    }, () => {
      this.getGoods()
      this.getInteractDetail()
    })
  }
  // interactDetail
  getInteractDetail = () => {
    this.props.dispatch({
      type: 'interactSamplingSetting/interactDetail',
      payload: {
        params: {
          id: this.state.interactSampling
        },
      },
    }).then((res) => {
      this.setModalData(res)
    });
  }
  setModalData = (data) => {
    if (data) {
      if (data.times === -1) {
        this.setState({
          times: data.times
        })
      }
      if (data.dayTimes === -1) {
        this.setState({
          dayTimes: data.dayTimes
        })
      }
      if (data.number === -1) {
        this.setState({
          number: data.number
        })
      }
      if (data.dayNumber === -1) {
        this.setState({
          dayNumber: data.dayNumber
        })
      }
      this.props.form.setFieldsValue({
        times: data.times || undefined,
        dayTimes: data.dayTimes || undefined,
        number: data.number || undefined,
        dayNumber: data.dayNumber || undefined,
      });
    } else {
      this.props.form.setFieldsValue({
        times: undefined,
        dayTimes: undefined,
        number: undefined,
        dayNumber: undefined,
      });
    }
  }
  handleTimesChange = (e) => {
    this.setState({
      times: e.target.checked,
    }, () => {
      this.props.form.validateFields(['times'], { force: true });
    });
  }
  handleDayTimesChange = (e) => {
    this.setState({
      dayTimes: e.target.checked,
    }, () => {
      this.props.form.validateFields(['dayTimes'], { force: true });
    });
  }
  handleNumberChange = (e) => {
    this.setState({
      number: e.target.checked,
    }, () => {
      this.props.form.validateFields(['number'], { force: true });
    });
  }
  handleDayNumberChange = (e) => {
    this.setState({
      dayNumber: e.target.checked,
    }, () => {
      this.props.form.validateFields(['dayNumber'], { force: true });
    });
  }
  // 获取所有商品开始
  getGoods = () => {
    let params = { interactId: this.state.interactSampling }
    this.props.dispatch({
      type: 'interactSamplingSetting/getInteractGoodsList',
      payload: {
        params,
      },
    }).then((res) => {
      if (res && res.code === 0) {
        this.setState({
          allGoods: res.data.map((item, index) => {
            return { key: index, id: item.id, userDayNumber: item.userDayNumber || 0, name: item.name }
          })
        })
      }
    });
  }
  handleChecked = (val) => {
    console.log('val', val)
    const { allGoods } = this.state
    if (val.checked) {
      console.log('allGoods', allGoods)
      allGoods[val.key].userDayNumber = -1
    } else {
      allGoods[val.key].userDayNumber = 0
    }
    this.setState({
      allGoods: [],
    }, () => {
      this.setState({
        allGoods,
      })
    })
  }
  check = (type) => {
    let url = 'interactSamplingSetting/interactAdd'
    const { times, dayTimes, number, dayNumber } = this.state
    this.setState({
      type: (type === 0) ? false : true
    }, () => {
      this.props.form.validateFields((err, fieldsValue) => {
        console.log('(err && type === 1)', (err && type === 1))
        if (type === 1 && err) {
          return false
        }
        let params = {
          ...fieldsValue,
          type,
          times: times ? -1 : fieldsValue.times,
          dayTimes: dayTimes ? -1 : fieldsValue.dayTimes,
          number: number ? -1 : fieldsValue.number,
          dayNumber: dayNumber ? -1 : fieldsValue.dayNumber,
        };
        if (this.state.interactSampling) {
          url = 'interactSamplingSetting/ruleInteract'
          params = {
            ...params,
            id: this.state.interactSampling,
          };
        }
        this.props.dispatch({
          type: url,
          payload: {
            params,
          },
        }).then((res) => {
          if (res && res.code === 0) {
            if (type === 0) {
              this.props.history.push({pathname: `/project/addMachineInteractSampling/${this.state.interactSampling}`})
            } else {
              // this.props.history.push({pathname: '/project/sampling-setting'})
            }
          }
        });
      })
    })
  }
  render() {
    const {
      interactSamplingSetting: { list, page, unColumn },
      loading,
    } = this.props;
    const { current, allGoods } = this.state
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
    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      render: text => <a href="javascript:;">{text}</a>,
    }, {
      title: 'Age',
      dataIndex: 'age',
    }, {
      title: 'Address',
      dataIndex: 'address',
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
                <FormItem {...formItemLayout} label={<span><span style={{ color: 'red' }}>*</span>同一用户参与活动次数</span>}>
                  <Col span={14}>
                    <FormItem>
                      {getFieldDecorator('times', {
                        rules: [{ required: !this.state.times, whitespace: true, message: '请输入同一用户参与活动次数' }],
                      })
                      (<Input
                        placeholder="请输入同一用户参与活动次数"
                        disabled={this.state.times}
                      />)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem>
                      <Checkbox
                        value={this.state.times}
                        onChange={this.handleTimesChange}>
                      </Checkbox>
                    </FormItem>
                  </Col>
                </FormItem>
                <FormItem {...formItemLayout} label={<span><span style={{ color: 'red' }}>*</span>同一用户参与活动次数</span>}>
                  <Col span={14}>
                    <FormItem>
                      {getFieldDecorator('dayTimes', {
                        rules: [{ required: !this.state.dayTimes, whitespace: true, message: '请输入同一用户每天参与活动次数' }],
                      })
                      (<Input
                        placeholder="请输入同一用户每天参与活动次数"
                        disabled={this.state.dayTimes}
                      />)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem>
                      <Checkbox
                        value={this.state.dayTimes}
                        onChange={this.handleDayTimesChange}>
                      </Checkbox>
                    </FormItem>
                  </Col>
                </FormItem>
                <FormItem {...formItemLayout} label={<span><span style={{ color: 'red' }}>*</span>请输入同一用户获得商品次数</span>}>
                  <Col span={14}>
                    <FormItem>
                      {getFieldDecorator('number', {
                        rules: [{ required: !this.state.number, whitespace: true, message: '请输入同一用户获得商品次数' }],
                      })
                      (<Input
                        placeholder="请输入同一用户获得商品次数"
                        disabled={this.state.number}
                      />)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem>
                      <Checkbox
                        value={this.state.number}
                        onChange={this.handleNumberChange}>
                      </Checkbox>
                    </FormItem>
                  </Col>
                </FormItem>
                <FormItem {...formItemLayout} label={<span><span style={{ color: 'red' }}>*</span>同一用户每天参与活动次数</span>}>
                  <Col span={14}>
                    <FormItem>
                      {getFieldDecorator('dayNumber', {
                        rules: [{ required: !this.state.dayNumber, whitespace: true, message: '请输入同一用户每天参与活动次数' }],
                      })
                      (<Input
                        placeholder="请输入同一用户每天参与活动次数"
                        disabled={this.state.dayNumber}
                      />)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem>
                      <Checkbox
                        value={this.state.dayNumber}
                        onChange={this.handleDayNumberChange}>
                      </Checkbox>
                    </FormItem>
                  </Col>
                </FormItem>

                <FormItem {...formItemLayout} label="商品信息">
                </FormItem>
                <RuleInteractSampling
                  data={allGoods}
                  handleChecked={this.handleChecked}
                />
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
                          onClick={() => this.props.history.push({pathname: `/project/addMachineInteractSampling/${this.state.interactSampling}`})}>
                    上一步
                  </Button>
                )
              }
              {
                 <Button type="primary" onClick={() => this.check(1)}>提交</Button>
              }
            </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
