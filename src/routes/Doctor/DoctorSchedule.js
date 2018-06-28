import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Icon, List, Button, message, Modal, Radio, Table, Checkbox } from 'antd';
import $ from 'jquery';
import 'fullcalendar';
import 'fullcalendar/dist/fullcalendar.min.css';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getUser } from '../../utils/authority';
import styles from './DoctorSchedule.less';

let searchTimer;
@connect(({ doctorSchedule, loading }) => ({
  doctorSchedule,
  loading: loading.models.doctorSchedule,
}))
@Form.create()
export default class DoctorSchedule extends PureComponent {
  state = {
    doctors: [],
    searchDoctors: [],
    repeat: [
      { id: 1, name: '不重复' },
      { id: 2, name: '两周' },
      { id: 3, name: '三周' },
      { id: 4, name: '四周' },
    ],
    calendar: null,
    startDate: null,
    endDate: null,
    doctorSchedules: [],
    scheduleTimespans: [],
    modalVisible: false,
    currentDoctor: null,
    currentDate: null,
    currentUser: getUser(),
    currentDoctorSchedules: [],
  }

  componentDidMount() {
    this.getDoctors();
    this.getScheduleTimespans();
    this.initCalendar();
  }

  setDoctorSchedule(params) {
    const { dispatch } = this.props;
    const { scheduleTimespans } = this.state;
    dispatch({
      type: 'doctorSchedule/schedulesByDate',
      payload: {
        restParams: {
          merchantId: this.state.currentUser.merchantId,
          ...params,
        },
      },
    }).then((resp) => {
      if (resp && resp.code === 0) {
        const { data } = resp;
        const currentDoctorSchedules = JSON.parse(JSON.stringify(scheduleTimespans));
        currentDoctorSchedules.map((i) => {
          const schedule = i;
          if (data && data.some(item => item.outpatientTimeId === schedule.id)) {
            schedule.checked = true;
          } else {
            schedule.checked = false;
          }
          schedule.repeat = 1;
          return schedule;
        });
        this.setState({
          currentDoctorSchedules,
          doctorSchedules: data,
          modalVisible: true,
        });
      }
    });
  }

  getDoctors() {
    const { dispatch } = this.props;
    // keyword:
    dispatch({
      type: 'doctorSchedule/doctors',
      payload: {
        restParams: {
          merchantId: this.state.currentUser.merchantId,
          keyword: '',
        },
      },
    }).then((resp) => {
      if (resp && resp.code === 0) {
        this.setState({
          doctors: resp.data,
          searchDoctors: resp.data,
        });
      }
    });
  }

  getSchedules(params, callback) {
    const { dispatch } = this.props;
    dispatch({
      type: 'doctorSchedule/schedules',
      payload: {
        restParams: {
          merchantId: this.state.currentUser.merchantId,
          ...params,
        },
      },
    }).then((resp) => {
      if (resp && resp.code === 0) {
        callback(resp.data);
      }
    });
  }

  getScheduleTimespans() {
    const { dispatch } = this.props;
    dispatch({
      type: 'doctorSchedule/scheduleTimespans',
      payload: {
        restParams: {
          merchantId: this.state.currentUser.merchantId,
        },
      },
    })
      .then((resp) => {
        if (resp && resp.code === 0) {
          this.setState({
            scheduleTimespans: resp.data,
          });
        }
      });
  }

  reloadCalendar() {
    this.state.calendar.fullCalendar('refetchEvents');
  }

  handleDoctorClick(currentDoctor) {
    this.setState({ currentDoctor }, this.reloadCalendar);
  }

  handleScheduleRepeatChange(e, data) {
    const { currentDoctorSchedules } = this.state;
    const schedules = JSON.parse(JSON.stringify(currentDoctorSchedules));
    const schedule = schedules.find(item => item.id === data.id);
    schedule.repeat = e.target.value;
    this.setState({
      currentDoctorSchedules: schedules,
    });
  }

  handleScheduleStatusChange(e, data) {
    const { currentDoctorSchedules } = this.state;
    const schedules = JSON.parse(JSON.stringify(currentDoctorSchedules));
    const schedule = schedules.find(item => item.id === data.id);
    schedule.checked = e.target.checked;
    this.setState({
      currentDoctorSchedules: schedules,
    });
  }

  handleSearch(e) {
    const value = e.target.value;
    if (searchTimer) {
      clearTimeout(searchTimer);
    }
    searchTimer = setTimeout(() => {
      const { doctors } = this.state;
      const searchDoctors = [...doctors].filter((item) => {
        if (value) {
          return item.name.indexOf(value) >= 0 || item.id.indexOf(value) >= 0;
        } else {
          return item;
        }
      });
      this.setState({
        searchDoctors,
      });
    }, 300);
  }

  initCalendar() {
    const calendar = $('#calendar').fullCalendar({
      header: {
        left: '',
        center: 'title',
        right: 'prev,next today',
      },
      defaultDate: new Date(),
      locale: 'zh-cn',
      droppable: false,
      selectable: false,
      editable: false,
      eventLimit: true,
      events: (start, end, timezone, callback) => {
        const { currentDoctor } = this.state;
        const params = {
          startTime: start.format('YYYY-MM-DD'),
          endTime: end.format('YYYY-MM-DD'),
          doctorId: '',
        };
        if (currentDoctor) {
          params.doctorId = currentDoctor.id;
        }
        this.setState({
          startDate: start,
          endDate: end,
        }, () => {
          this.getSchedules(params, callback);
        });
      },
      dayClick: (date, allDate, jsEvent, view) => {
        const { currentDoctor } = this.state;
        if (currentDoctor) {
          const params = {
            date: date.format('YYYY-MM-DD'),
            doctorId: currentDoctor.id,
          };
          this.setState({
            currentDate: date,
          }, () => {
            this.setDoctorSchedule(params);
          });
        } else {
          message.info('选择医生后可安排排班计划');
        }
      },
    });
    this.setState({
      calendar,
    });
  }

  handleSchedulesSave() {
    const { dispatch } = this.props;
    const { currentDoctor, currentDoctorSchedules, currentDate } = this.state;
    const params = {
      doctorId: currentDoctor.id,
      date: currentDate.format('YYYY-MM-DD'),
      items: currentDoctorSchedules.filter(item => item.checked).map((item) => {
        return {
          outPatientId: item.id,
          count: item.repeat,
        };
      }),
    };
    dispatch({
      type: 'doctorSchedule/saveSchedule',
      payload: {
        restParams: {
          merchantId: this.state.currentUser.merchantId,
        },
        params,
      },
    }).then((resp) => {
      if (resp && resp.code === 0) {
        message.success('保存成功');
        this.setState({ modalVisible: false }, this.reloadCalendar);
      }
    });
  }

  handleSchedulesCancel() {
    this.setState({
      modalVisible: false,
    });
  }

  handleShowAllSchedules() {
    this.setState({ currentDoctor: null, currentDate: null }, this.reloadCalendar);
  }

  renderDoctorList = (data) => {
    const { currentDoctor } = this.state;
    return (
      <List.Item className={currentDoctor && currentDoctor.id === data.id ? 'selected' : ''} onClick={() => { this.handleDoctorClick(data); }} style={{ paddingLeft: 10, paddingRight: 10, cursor: 'pointer' }}>
        <Col span={16}>
          <a style={{ color: 'rgba(0, 0, 0, 0.65)' }}> {data.name}</a>
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          <span>ID：{data.id}</span>
        </Col>
      </List.Item >
    );
  }

  render() {
    const { modalVisible, repeat, currentDoctorSchedules, searchDoctors, currentDate, currentDoctor } = this.state;
    const { loading } = this.props;
    const detailColumns = [
      {
        title: '时间段',
        dataIndex: 'time',
      },
      {
        title: '排班',
        dataIndex: 'reciveMobile',
        render: (text, record) => {
          return (
            <Checkbox
              checked={record.checked}
              onChange={(e) => { this.handleScheduleStatusChange(e, record); }}
            />
          );
        },
      },
      {
        title: '重复',
        render: (text, record) => {
          return (
            <Radio.Group
              defaultValue={1}
              onChange={(e) => { this.handleScheduleRepeatChange(e, record); }}
              value={record.repeat}
              disabled={!record.checked}
            >
              {
                repeat.map((item) => {
                  return <Radio.Button key={item.id} value={item.id}>{item.name}</Radio.Button>;
                })
              }
            </Radio.Group>
          );
        },
      }];
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Row gutter={24}>
            <Col span={8} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
              <Row gutter={16} style={{ height: 40, zIndex: 10 }}>
                <Col span={16}>
                  <Input
                    placeholder="输入医生姓名/ID快速检索"
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    size="large"
                    onChange={(e) => { this.handleSearch(e); }}
                  />
                </Col>
                <Col span={8}>
                  <Button size="large" style={{ width: '100%' }} onClick={() => { this.handleShowAllSchedules(); }}>查看全部</Button>
                </Col>
              </Row>
              <Row style={{ height: '100%', overflow: 'hidden', paddingTop: 50, top: -40, zIndex: 9 }}>
                <Col
                  span={24}
                  style={{
                    height: '100%',
                    paddingTop: 0,
                    paddingBottom: 15,
                    borderWidth: 1,
                    borderColor: '#e8e8e8',
                    borderStyle: 'solid',
                    borderRadius: 4,
                    overflowY: 'auto',
                  }}
                >
                  <List
                    dataSource={searchDoctors}
                    renderItem={this.renderDoctorList}
                  />
                </Col>
              </Row>
            </Col>
            <Col span={16} offset={8} >
              <div id="calendar" className={styles.calendar} />
            </Col>
          </Row>
        </Card>
        <Modal
          title={currentDate ? `${currentDate.format('YYYY年MM月DD日')} ${currentDate.format('dddd')} ${currentDoctor ? `${currentDoctor.name} ID:${currentDoctor.id}` : ''}` : '排班详情'}
          visible={modalVisible}
          onCancel={() => { this.handleSchedulesCancel(); }}
          footer={[
            // <Button key="back" onClick={this.handleCancel}>Return</Button>,
            <Button type="primary" loading={loading} onClick={() => { this.handleSchedulesSave(); }}>
              保存
            </Button>,
          ]}
        >
          <Table
            rowKey={record => record.id}
            dataSource={currentDoctorSchedules}
            columns={detailColumns}
            pagination={false}
            size="small"
          // onChange={this.handleTableChange}
          />
        </Modal>
      </PageHeaderLayout >
    );
  }
}
