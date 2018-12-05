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
  Checkbox, Table, message, InputNumber, Tabs
} from 'antd';
import StandardTable from '../../../components/StandardTable/index';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './BasicInteractSampling.less';
import {getAccountMenus} from "../../../utils/authority";
import RuleInteractSampling from '../../../components/Project/RuleInteractSampling'
import RuleInteract from '../../../components/Project/InteractSamplingSteps/Ruleinteract/index'
const Step = Steps.Step;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

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
    allGoods: [],
    goodsInitData: [],
    goodsLists: [],
    paiyangType: 0,
  };
  componentDidMount() {
    this.setState({
      interactSampling: this.props.match.params.id
    }, () => {
      this.getGoods()
      this.getInteractDropDetail()
      this.getInteractDetail()
    })
  }
  // interactDetail
  getInteractDetail = () => {
    const { goodsLists } = this.state
    console.log('goodsLists', goodsLists)
    this.props.dispatch({
      type: 'interactSamplingSetting/interactDetail',
      payload: {
        params: {
          id: this.state.interactSampling
        },
      },
    }).then((res) => {
      console.log('!res.goodsRule', !res.goodsRule)
      // paiyangType 2
      this.setState({
        paiyangType: res.paiyangType
      })

      if (!res.goodsRule) {
        this.getGoods()
        // allGoods: goodsLists.map((item, index) => {
        //   return {
        //     key: index,
        //     goodsId: item.id,
        //     userDayNumber: item.userDayNumber === -1 ? ' ' : item.userDayNumber,
        //     name: item.name,
        //     check: item.userDayNumber === -1 ? true : false
        //   }
        // })
      } else {
        this.setState({
          allGoods: res.goodsRule,
        })
      }
      this.setModalData(res)
    });
  }
  getInteractDropDetail = () => {
    const { goodsLists } = this.state
    this.props.dispatch({
      type: 'interactSamplingSetting/getGameRuleList',
      payload: {
        params: {
          interactId: this.state.interactSampling
        },
      },
    }).then((res) => {
      if (res && res.code === 0) {
        if (res.data.length > 0) {
          this.setState({
            goodsInitData: res.data.map((item, index) => {
              return {
                key: index,
                goodsId: item.id,
                goodName: item.name,
                ruleCode: '',
                ruleRemark: item.ruleRemark ? item.ruleRemark : '描述',
              }
            }),
          })
        } else {
          this.setState({
            goodsInitData: goodsLists.map((item, index) => {
              return {
                key: index,
                goodsId: item.id,
                goodName: item.name,
                ruleCode: '',
                ruleRemark: '描述',
              }
            }),
          })
        }
      }
      // this.setModalData(res)
    });
  }
  setModalData = (data) => {
    console.log('allGoods222', data, this.state.allGoods)
    if (data) {
      this.setState({
        times: data.times === -1 ? true : false,
        dayTimes: data.dayTimes === -1 ? true : false,
        number: data.number === -1 ? true : false,
        dayNumber: data.dayNumber === -1 ? true : false
      })
      this.props.form.setFieldsValue({
        times: data.times === -1 ? '' :  data.times || undefined,
        dayTimes: data.dayTimes === -1 ? '' :  data.dayTimes || undefined,
        number: data.number === -1 ? '' :  data.number || undefined,
        dayNumber: data.dayNumber === -1 ? '' :  data.dayNumber || undefined,
      });
    } else {
      this.setState({
        allGoods: [],
      })
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
      if (e.target.checked) {
        this.props.form.setFieldsValue({
          times: '',
        });
      }
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
            return {
              key: index,
              goodsId: item.id,
              userDayNumber: item.userDayNumber === -1 ? ' ' : item.userDayNumber,
              name: item.name,
              check: item.userDayNumber === -1 ? true : false
            }
          }),
          goodsLists: res.data,
        })
      }
    });
  }
  goodsHandleChange = (row) => {
    const newData = [...this.state.goodsInitData];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });

    this.setState({ goodsInitData: newData });
    // console.log('goodsHandleChange::', row);
  }
  handleChecked = (val) => {
    console.log('val', val)
    const { allGoods } = this.state
    if (val.checked) {
      console.log('allGoods', allGoods)
      allGoods[val.key].userDayNumber = ' '
      allGoods[val.key].check = true
    } else {
      allGoods[val.key].userDayNumber = val.userDayNumber
      allGoods[val.key].check = false
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
    message.config({
      top: 100,
      duration: 2,
      maxCount: 3,
    });
    let url = 'interactSamplingSetting/interactAdd'
    const { times, dayTimes, number, dayNumber, allGoods, goodsInitData } = this.state
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
        if (type === 1) {
          if (!times) {
            if (!fieldsValue.times) {
              message.info('如没有选择不限，请填写同一用户参与活动次数')
              return false
            }
          }
          if (!dayTimes) {
            if (!fieldsValue.dayTimes) {
              message.info('如没有选择不限，请填写同一用户每天参与活动次数')
              return false
            }
          }
          if (!number) {
            if (!fieldsValue.number) {
              message.info('如没有选择不限，请填写同一用户获得商品次数')
              return false
            }
          }
          if (!dayNumber) {
            if (!fieldsValue.dayNumber) {
              message.info('如没有选择不限，请填写同一用户获得商品次数')
              return false
            }
          }
        }
        if (allGoods.length > 0) {
          for (let i = 0; i < allGoods.length; i++) {
            if (!allGoods[i].check) {
              if (allGoods[i].userDayNumber === 0 || !allGoods[i].userDayNumber) {
                message.info('如没有选择不限，请填写可派发数量')
                return false
              }
            }
          }
          for (let i = 0; i < allGoods.length; i++) {
            if (allGoods[i].check) {
              allGoods[i].userDayNumber = -1
            }
          }
        }
        if (goodsInitData.length >0) {
          for (let i = 0; i < goodsInitData.length; i++) {
            if (!goodsInitData[i].ruleCode || goodsInitData[i].ruleRemark === '描述' || !goodsInitData[i].ruleRemark) {
              message.info('请填写完整规则编号或者规则描述')
              return false
            }
          }
        }
        params = {
          ...params,
          id: this.state.interactSampling,
          goodsRule: allGoods,
          gameRule: goodsInitData,
        };
        this.props.dispatch({
          type: url,
          payload: {
            params,
          },
        }).then((res) => {
          if (res && res.code === 0) {
            this.props.history.push({pathname: '/project/sampling-setting'})
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
    const { current, allGoods, goodsInitData, goodsLists, paiyangType } = this.state
    console.log('allGoods', allGoods, goodsLists)
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
            <Tabs defaultActiveKey="1">
              <TabPane tab="用户参与规则" key="1">
                <div className={styles.stepsContent}>
                  <Form onSubmit={this.handleSearch}>
                    <FormItem {...formItemLayout} label={<span><span style={{ color: 'red' }}>*</span>同一用户参与活动次数</span>}>
                      <Col span={14}>
                        <FormItem>
                          {getFieldDecorator('times', {
                            // rules: [{ required: !this.state.times, whitespace: false, message: '请输入同一用户参与活动次数' }],
                          })
                          (<InputNumber
                            placeholder="请输入同一用户参与活动次数"
                            disabled={this.state.times}
                          />)}
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        <FormItem>
                          <Checkbox
                            checked={this.state.times}
                            // value={this.state.times}
                            onChange={this.handleTimesChange}>
                            不限
                          </Checkbox>
                        </FormItem>
                      </Col>
                    </FormItem>
                    <FormItem {...formItemLayout} label={<span><span style={{ color: 'red' }}>*</span>同一用户每天参与活动次数</span>}>
                      <Col span={14}>
                        <FormItem>
                          {getFieldDecorator('dayTimes', {
                            // rules: [{ required: false, whitespace: false, message: '请输入同一用户每天参与活动次数' }],
                          })
                          (<InputNumber
                            placeholder="请输入同一用户每天参与活动次数"
                            disabled={this.state.dayTimes}
                          />)}
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        <FormItem>
                          <Checkbox
                            checked={this.state.dayTimes}
                            // value={this.state.dayTimes}
                            onChange={this.handleDayTimesChange}>
                            不限
                          </Checkbox>
                        </FormItem>
                      </Col>
                    </FormItem>
                    <FormItem {...formItemLayout} label={<span><span style={{ color: 'red' }}>*</span>同一用户获得商品次数</span>}>
                      <Col span={14}>
                        <FormItem>
                          {getFieldDecorator('number', {
                            // rules: [{ required: false, whitespace: false, message: '请输入同一用户获得商品次数' }],
                          })
                          (<InputNumber
                            placeholder="请输入同一用户获得商品次数"
                            disabled={this.state.number}
                          />)}
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        <FormItem>
                          <Checkbox
                            checked={this.state.number}
                            // value={this.state.number}
                            onChange={this.handleNumberChange}>
                            不限
                          </Checkbox>
                        </FormItem>
                      </Col>
                    </FormItem>
                    <FormItem {...formItemLayout} label={<span><span style={{ color: 'red' }}>*</span>同一用户每天获取商品次数</span>}>
                      <Col span={14}>
                        <FormItem>
                          {getFieldDecorator('dayNumber', {
                            // rules: [{ required: false, whitespace: false, message: '请输入同一用户每天参与活动次数' }],
                          })
                          (<InputNumber
                            placeholder="请输入同一用户每天获取商品次数"
                            disabled={this.state.dayNumber}
                          />)}
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        <FormItem>
                          <Checkbox
                            checked={this.state.dayNumber}
                            // value={this.state.dayNumber}
                            onChange={this.handleDayNumberChange}>
                            不限
                          </Checkbox>
                        </FormItem>
                      </Col>
                    </FormItem>
                  </Form>
                </div>
              </TabPane>
              <TabPane tab="商品派发规则" key="2">
                <RuleInteractSampling
                  data={allGoods}
                  handleChecked={this.handleChecked}
                />
              </TabPane>
              <TabPane tab="掉货规则" key="3" disabled={paiyangType === 2}>
                <RuleInteract
                  initData={goodsInitData}
                  goodsHandle={this.goodsHandle}
                  goodsHandleChange={this.goodsHandleChange}
                />
              </TabPane>
            </Tabs>
            <div className={styles.stepsAction}>
              {
                <Button onClick={() => this.props.history.push({pathname: '/project/sampling-setting'})}>取消</Button>
              }
              {
                <Button onClick={() => this.check(0)}>暂存</Button>
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
