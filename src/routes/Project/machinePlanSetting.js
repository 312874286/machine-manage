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
  Cascader,
  DatePicker,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './machinePlanSetting.less'
// import MachinePlanTable  from '../../components/Project/machinePlanTable'
import MachinePlan  from '../../components/Project/machinePlan'
import moment from "moment/moment";

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

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
    handleDays: {},
    getDataStartDay: '',
    getDataEndDay: '',
  };
  componentDidMount() {
    // this.getLists();
    this.getAreaList('')
  }
  // 获取列表
  getLists = () => {
    this.props.dispatch({
      type: 'machinePlanSetting/getMachinePLanSetting',
      payload: {
        restParams: {
          machineCode: this.state.machineCode,
          startTime: this.state.startTime,
          localCode: this.state.localCode,
          endTime: this.state.endTime,
        },
      },
    }).then((res) => {
      if (res.length > 0) {
        // let resource = res.map((item) => {
        //   return {id: item.machineCode, title: item.localDesc, code: item.machineCode}
        // })
        for (let i = 0; i < res.length; i++) {
          if (res[i].planTime.length > 0) {
            let events = []
            // for (let j = 0; j < res[i].planTime.length; j++) {
            //   let a = {resourceId: res[i].machineCode, start : `${res[i].planTime[j].startTime.split(' ')[0]}T${res[i].planTime[j].startTime.split(' ')[1]}`, end: `${res[i].planTime[j].endTime.split(' ')[0]}T${res[i].planTime[j].endTime.split(' ')[1]}`, rendering: 'background', color: 'red'}
            //   events.push(a)
            // }
            let a = this.drawLine(res[i].planTime)
            events.push(...a)
            res[i].planTime = events
          } else {
            res[i].planTime = []
          }
        }
        this.setState({
          resource: res,
        })
      } else {
        this.setState({
          resource: [],
        })
      }
    });
  }
  drawLine = (arr) => {
    console.log('time', this.state.startTime, this.state.endTime)
    console.log('startTime', this.state.handleDays.getDataStartDay, this.state.handleDays.getDataEndDay)
    let activityArr =[]
    let left;
    let width;
    let background = 'Green'
    arr.forEach((item, index) => {
      let time = '开始时间：' + item.startTime + '--' + '结束时间: ' + item.endTime
      const DateNo = 24 * 60 * 60 * 1000
      if (moment(item.startTime) >= moment(this.state.startTime)) {
        // 开始日期>范围的开始日期
        if (moment(item.endTime) <= moment(this.state.endTime)) {
          // 开始时间及结束日期在15天的范围
          left = Math.floor((moment(item.startTime) - moment(this.state.startTime)) / DateNo)
          width = Math.floor((moment(item.endTime) - moment(item.startTime)) / DateNo)
        } else {
          // 结束日期>范围的结束日期
          left = Math.floor((moment(item.startTime) - moment(this.state.startTime)) / DateNo)
          width = Math.ceil((moment(this.state.endTime) - moment(item.startTime)) / DateNo)
        }
        width += 1
      } else {
        // 开始日期<范围的开始日期
        left = 0, width = '';
        if (moment(item.endTime) >= moment(this.state.handleDays.endDay)) {
          // console.log('jieshu日期<范围的开始日期', left, width)
          width = Math.floor((moment(this.state.endTime) - moment(this.state.startTime)) / DateNo)
        } else {
          width = Math.floor((moment(item.endTime) - moment(this.state.startTime)) / DateNo)
        }
        width += 1
      }
      let tmp = {
        left: ((27 * left)) + 'px',
        width: ((27 * width)) + 'px',
        background: background,
        height: '20px',
        startTime: item.startTime,
        endTime: item.endTime,
        activityName: item.activityName,
        state: item.state
      }
      activityArr.push(tmp);
    })
    return activityArr;
  }
  handleDays = (val) => {
    console.log('val', val)
    this.setState({
      handleDays: val,
      startTime: val.startDay,
      endTime: val.endDay,
      getDataStartDay: val.getDataStartDay,
      getDataEndDay: val.getDataEndDay,
    }, () => {
      this.getLists();
    });
  }
  getAreaList = (selectedOptions) => {
    let targetOption = null;
    let code = ''
    if (selectedOptions) {
      targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;
      code = targetOption.value
    }
    this.props.dispatch({
      type: 'common/getProvinceCityAreaTradeArea',
      payload: {
        restParams: {
          code,
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
  // 搜索
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let localCode = ''
      let startTime = ''
      let endTime = ''
      if (fieldsValue.localCode) {
        if (fieldsValue.localCode.length > 0) {
          localCode = fieldsValue.localCode[fieldsValue.localCode.length - 1];
        }
      }
      if (fieldsValue.time) {
        startTime = fieldsValue.time[0].format('YYYY-MM-DD HH:mm')
        endTime = fieldsValue.time[1].format('YYYY-MM-DD HH:mm')
      }

      this.setState({
        machineCode: fieldsValue.machineCode ? fieldsValue.machineCode : '',
        localCode,
      }, () => {
        this.getLists();
      });
    });
  };
  // 重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      pageNo: 1,
      keyword: '',
      code: ''
    });
  };
  handleTime = (val) => {
    console.log('val', val)
    this.setState({
      handleDays: val,
      startTime: val.startTime,
      endTime: val.endTime,
      getDataStartDay: val.getDataStartDay,
      getDataEndDay: val.getDataEndDay,
    }, () => {
      this.getLists()
    })
  }
  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="省市区商圈">
              {getFieldDecorator('localCode')(
                <Cascader
                  placeholder="请选择"
                  options={this.state.options}
                  loadData={this.getAreaList}
                  changeOnSelect
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem>
              {getFieldDecorator('machineCode')(<Input placeholder="请输入机器编码搜索" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span>
               <FormItem>
                  {/*{getFieldDecorator('time')(<RangePicker onChange={this.onChange}/>)}*/}
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
        {/*<Row gutter={{ md: 24, lg: 24, xl: 48 }}>*/}
          {/*<Col md={8} sm={24}>*/}
            {/*<FormItem></FormItem>*/}
          {/*</Col>*/}
          {/*<Col md={8} sm={24}>*/}
            {/*<FormItem></FormItem>*/}
          {/*</Col>*/}
          {/*<Col md={8} sm={24}>*/}
            {/*<span>*/}
               {/*<FormItem>*/}
                 {/*<Button onClick={this.handleFormReset}>*/}
                    {/*重置*/}
                  {/*</Button>*/}
                  {/*<Button className={styles.serach} style={{ marginLeft: 8 }} type="primary" htmlType="submit">*/}
                    {/*查询*/}
                  {/*</Button>*/}
               {/*</FormItem>*/}
            {/*</span>*/}
          {/*</Col>*/}
        {/*</Row>*/}
      </Form>
    );
  }
  // resource={this.state.resource} events={this.state.events} handleTime={this.handleTime} slotLabelFormat={this.state.slotLabelFormat}
  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
          <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
          <MachinePlan
            // dateList={this.state.dateList}
            handleDays={this.handleDays}
            // onEditClick={this.onEditClick}
            // onWatchClick={this.onWatchClick}
            // onDeleteClick={this.onDeleteClick}
            // handleModalVisible={this.handleModalVisible}
            resource={this.state.resource}
            minHeight={(document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 50)}
          />
        </Card>
        <Card bordered={false}>


          {/*<MachinePlanTable*/}
            {/*resource={this.state.resource} events={this.state.events} handleTime={this.handleTime} slotLabelFormat={this.state.slotLabelFormat}*/}
          {/*/>*/}
        </Card>
      </PageHeaderLayout>
    );
  }
}
