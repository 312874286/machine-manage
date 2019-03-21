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
  Checkbox,
} from 'antd';
import StandardTable from '../../../components/StandardTable/index';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './BasicInteractSampling.less';
import {getAccountMenus} from "../../../utils/authority";

const CheckboxGroup = Checkbox.Group;
const Step = Steps.Step;
const FormItem = Form.Item;
const { Option } = Select;
const activityTypeOptions = [
  {id: 0, name: '派样'},
  {id: 1, name: '互派'},
  {id: 2, name: '互动'},
  {id: 3, name: '新零售'}
  ]
@connect(({ common, loading, interactSamplingSetting }) => ({
  common,
  interactSamplingSetting,
  loading: loading.models.interactSamplingSetting,
}))
@Form.create()
export default class areaSettingList extends PureComponent {
  state = {
    current: 0,
    GameList: [],
    type: true,
    id: '',
    channelLists: [],
    merchants: [],
    enter: [],
  };
  componentDidMount() {
    this.getGameList()
    if (this.props.match.params.id) {
      this.setState({
        id: this.props.match.params.id,
      }, () => {
        this.getInteractDetail()
        this.getInteractMerchantList(this.props.match.params.id)
      })
    } else {
      this.setModalData()
    }
    this.getChannelList()
  }
  getGameList = () => {
    // getGameList
    this.props.dispatch({
      type: 'interactSamplingSetting/getGameList',
      payload: {
      },
    }).then((res) => {
      if (res && res.code === 0) {
        this.setState({
          GameList: res.data
        })
      }
    });
  }
  getInteractMerchantList = (interactId) => {
    // getInteractMerchantList
    this.props.dispatch({
      type: 'interactSamplingSetting/getInteractMerchantList',
      payload: {
        params: {
          interactId,
        },
      },
    }).then((res) => {
      if (res && res.code == 0) {
        this.setState({
          merchants: res.data
        })
      }
    });
  }
  getChannelList = () => {
    this.props.dispatch({
      type: 'interactSamplingSetting/getBaseDict',
      payload: {
        params: {
          type: ''
        },
      },
    }).then((res) => {
      if (res && res.code === 0) {
        this.setState({
          channelLists: res.data.channel,
          enter: res.data.enter.map((i) => {
            return {
              label: i.name,
              value: i.code,
            }
          }),
        });
      } else {
        this.setState({
          channelLists: [
            {
              "code":"002001",
              "name":"天猫互动吧"
            },
            {
              "code":"002002",
              "name":"微信渠道"
            },
            {
              "code":"002003",
              "name":"点72渠道"
            }
          ],
        });
      }
    });
  }

  // interactDetail
  getInteractDetail = () => {
    this.props.dispatch({
      type: 'interactSamplingSetting/interactDetail',
      payload: {
        params: {
          id: this.state.id
        },
      },
    }).then((res) => {
      this.setModalData(res)
    });
  }
  setModalData = (data) => {
    if (data) {
      this.props.form.setFieldsValue({
        name: data.name || undefined,
        planCode: data.planCode || undefined,
        gameId: data.gameId || undefined,
        day: data.day || 'max',
        manager: data.manager || undefined,
        paiyangType: data.paiyangType,
        channel: data.channel || undefined,
        enterType: data.enterType && data.enterType.split(',').map(i => i) || undefined,
      });
    } else {
      this.props.form.setFieldsValue({
        name: undefined,
        planCode: undefined,
        gameId: undefined,
        day: 'max',
        manager: undefined,
        paiyangType: undefined,
        channel: undefined,
        enterType: undefined,
      });
    }
  }
  // interactAdd
  next = (type) => {
    let url = 'interactSamplingSetting/interactAdd'
    this.setState({
      type: (type === 0) ? false : true
    }, () => {
      this.props.form.validateFields(['planCode', 'gameId', 'paiyangType', 'manager'], { force: true });
      this.props.form.validateFields((err, fieldsValue) => {
        console.log('(err && type === 1)', (err && type === 1), fieldsValue.paiyangType, fieldsValue.gameId)
        if (err) {
          return false
        }
        console.log('fieldsValue.enterType', fieldsValue.enterType.filter(i => i !== 'false'))
        let params = {
          ...fieldsValue,
          type,
          enterType: fieldsValue.enterType && fieldsValue.enterType.length > 0 && fieldsValue.enterType.filter(i => i !== 'false').join(',') || ''
        };
        if (this.state.id) {
          url = 'interactSamplingSetting/interactUpdate',
          params = {
            ...params,
            id: this.state.id,
          };
        }
        this.props.dispatch({
          type: url,
          payload: {
            params,
          },
        }).then((res) => {
          if (res && res.code === 0) {
            if (this.state.id && type === 1) {
              if (type === 1) {
                this.props.history.push({pathname: `/project/addMerchantGoodsInteractSampling/${this.state.id}`})
                return false
              }
            } else {
              if (type === 1) {
                this.props.history.push({pathname: `/project/addMerchantGoodsInteractSampling/${res.data}`})
                return false
              }
            }
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
    const { current, GameList, type, channelLists, merchants, enter } = this.state
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
    const steps = [
      {
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
                  {getFieldDecorator('planCode', {
                    rules: [{ required: type, whitespace: true, message: '请输入游戏编号' }],
                  })(<Input placeholder="请输入游戏编号" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="互派游戏">
                  {getFieldDecorator('gameId', {
                    rules: [{ required: type, message: '请选择互派游戏' }],
                  })(
                    <Select placeholder="请选择">
                      {GameList.map((item) => {
                        return (
                          <Option value={item.id} key={item.id}>{item.name}</Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="活动类型">
                  {getFieldDecorator('paiyangType', {
                    rules: [{ required: type, message: '请选择活动类型' }],
                  })(
                    <Select placeholder="请选择" disabled={merchants.length > 0 ? true : false}>
                      {activityTypeOptions.map((item) => {
                        return (
                          <Option value={item.id} key={item.id}>{item.name}</Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="所属渠道">
                  {getFieldDecorator('channel', {
                    rules: [{ required: true, whitespace: true, message: '请选择渠道' }],
                  })(
                    <Select placeholder="请选择渠道" disabled={merchants.length > 0 ? true : false}>
                      {channelLists.map((item) => {
                        return (
                          <Option value={item.code} key={item.code}>{item.name}</Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="预计时长">
                  {getFieldDecorator('day', {
                    rules: [{ required: false, whitespace: true, message: '请输入预计的天数' }],
                  })(<Input placeholder="请输入预计的天数" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="选择入驻平台">
                  {getFieldDecorator('enterType', {
                    rules: [{ required: false, message: '请选择入驻平台' }],
                  })(
                    <CheckboxGroup options={enter} />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="负责人">
                  {getFieldDecorator('manager', {
                    rules: [{ required: type, whitespace: true, message: '请输入项目负责人' }],
                  })(<Input placeholder="请输入负责人" />)}
                </FormItem>
              </Form>
            </div>
            <div className={styles.stepsAction}>
              {
                <Button onClick={() => this.props.history.push({pathname: '/project/sampling-setting'})}>取消</Button>
              }
              {
                <Button onClick={() => this.next(0)}>暂存</Button>
              }
              {
                current > 0
                && (
                  <Button style={{ marginLeft: 8 }}
                          onClick={() => this.props.history.push({pathname: '/project/addBasicInteractSampling', query: {statusValue: 3}})}>
                    上一步
                  </Button>
                )
              }
              {
                current < steps.length - 1
                && <Button type="primary"
                           onClick={() => this.next(1)}>
                  下一步</Button>
              }
            </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
