import React, { Component, Fragment } from "react";
import {
  Table,
  DatePicker,
  Button,
  Modal,
  Input,
  Checkbox,
  Row,
  Col,
  notification
} from "antd";
import moment from "moment";
import { cloneByJSON } from "../../../../utils/utils";

import "./MachineConfigCard.less";

const { RangePicker } = DatePicker;
const width = 150;
const height = 60;
const dateFormat = "YYYY-MM-DD";
export default class MachineConfigCard extends Component {
  state = {
    dates: [],
    addedMachineList: [],
    machineEdit: null,
    machineList: [],
    goodsMachineList: [],
    searchDate: [],
    searchDateStr: [],
    editDateStart: null,
    editDateEnd: null,
    searchText: null,
    interactInfo: null,
    disabledMachines: []
  };
  componentDidMount() {
    let state = {
      interactInfo: this.props.interactInfo,
      disabledMachines: this.props.diasbleData
    };
    if (this.props.data) {
      const data = this.props.data;
      data.secular = data.state === 1;
      const start = moment(data.queryStartTime);
      const end = moment(data.queryEndTime);
      state.machineEdit = data;
      state.editDateStart = start;
      state.editDateEnd = end;
      state.dates = this.getDayAll(start, end);
    }
    this.setState(state);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      machineList: nextProps.datas,
      addedMachineList: nextProps.postDatas
    });
  }
  getDayAll = (begin, end) => {
    var dateAllArr = new Array();
    var unixDb = begin.valueOf();
    var unixDe = end.valueOf();

    for (var k = unixDb; k <= unixDe; ) {
      dateAllArr.push(moment(parseInt(k)).format(dateFormat));
      k = k + 24 * 60 * 60 * 1000;
    }
    return dateAllArr;
  };
  handleSearchDateChange(date, dateString) {
    this.setState(
      {
        dates: this.getDayAll(date[0], date[1]),
        searchDate: date,
        searchDateStr: dateString
      },
      () => {
        this.handleSearchClick();
      }
    );
  }
  handleEditDateChange(date, type) {
    let startDate = this.state.editDateStart;
    let endDate = this.state.editDateEnd;
    if (type === 0) {
      startDate = date;
    } else {
      endDate = date;
    }
    this.setState({
      dates: this.getDayAll(startDate, endDate),
      editDateStart: startDate,
      editDateEnd: endDate
    });
  }
  handleSearchTextChange(e) {
    this.setState({ searchText: e.target.value });
  }
  handleScheduleDayClick(date, machine, type) {
    const interactId = this.state.interactInfo.id;
    const interactName = this.state.interactInfo.name;
    const addMachineActivity = (m, d) => {
      if (!m.machineActivity) {
        m.machineActivity = [];
      }
      m.machineActivity.push({
        activityId: interactId,
        activityName: interactName,
        startTime: `${d} 00:00:00`,
        endTime: `${d} 23:59:59`,
        isNew: true
      });
      return m;
    };
    if (type === 0) {
      const machines = [...this.state.machineList];
      machines.filter(m => m.machineId === machine.machineId).forEach(m => {
        addMachineActivity(m, date);
        if (m.machineActivity.some(mm => mm.isNew)) {
          m.checked = true;
        } else {
          m.checked = false;
        }
      });
      this.setState({
        machineList: machines
      });
    } else {
      const machineEdit = this.state.machineEdit;
      addMachineActivity(machineEdit, date);
      if (machineEdit.machineActivity.some(mm => mm.isNew)) {
        machineEdit.checked = true;
      } else {
        machineEdit.checked = false;
      }
      this.setState({
        machineEdit
      });
    }
  }
  handleScheduleClick(machine, schedule, type) {
    const removeMachineActivity = (m, s) => {
      m.machineActivity.splice(m.machineActivity.indexOf(s), 1);
      return m;
    };
    if (type === 0) {
      const machines = [...this.state.machineList];
      machines.filter(m => m.machineId === machine.machineId).forEach(m => {
        removeMachineActivity(m, schedule);
        if (m.machineActivity.some(mm => mm.isNew)) {
          m.checked = true;
        } else {
          m.checked = false;
        }
      });
      this.setState({ machineList: machines });
    } else {
      const machineEdit = this.state.machineEdit;
      removeMachineActivity(machineEdit, schedule);
      if (machineEdit.machineActivity.some(mm => mm.isNew)) {
        machineEdit.checked = true;
      } else {
        machineEdit.checked = false;
      }
      this.setState({
        machineEdit
      });
    }
  }
  handleSelectedMachineChange(e) {
    const machines = [...this.state.machineList];
    const interactId = this.state.interactInfo.id;
    const interactName = this.state.interactInfo.name;
    machines.filter(m => m.machineId === e.target.value).forEach(machine => {
      if (e.target.checked) {
        this.state.dates.forEach(d => {
          if (!machine.machineActivity) {
            machine.machineActivity = [];
          }
          if (!moment(d).isBefore(moment().format(dateFormat))) {
            if (
              !machine.machineActivity.some(
                ma =>
                  moment(d).isBetween(
                    moment(ma.startTime),
                    moment(ma.endTime)
                  ) ||
                  moment(d).isSame(ma.startTime) ||
                  moment(d).isSame(ma.endTime)
              )
            ) {
              machine.machineActivity.push({
                activityId: interactId,
                activityName: interactName,
                startTime: `${d} 00:00:00`,
                endTime: `${d} 23:59:59`,
                isNew: true
              });
            }
          }
        });
      } else {
        if (!machine.machineActivity) {
          machine.machineActivity = [];
        }
        machine.machineActivity = machine.machineActivity.filter(
          ma => !ma.isNew
        );
      }
      machine.checked = e.target.checked;
    });
    this.setState({ machineList: machines });
  }
  handleMachineExpireChange(e) {
    const machines = [...this.state.machineList];
    machines.filter(m => m.machineId === e.target.value).forEach(machine => {
      machine.secular = e.target.checked;
    });
    this.setState({ machineList: machines });
  }
  handleEditMachineExpireChange(e) {
    const machine = this.state.machineEdit;
    machine.secular = e.target.checked;
    this.setState({ machineList: machine });
  }
  handleEditMachineSelectedChange(e) {
    const machine = this.state.machineEdit;
    machine.checked = e.target.checked;
    if (e.target.checked) {
      const interactId = this.state.interactInfo.id;
      const interactName = this.state.interactInfo.name;
      this.state.dates.forEach(d => {
        if (!machine.machineActivity) {
          machine.machineActivity = [];
        }
        if (!moment(d).isBefore(moment().format(dateFormat))) {
          if (
            !machine.machineActivity.some(
              ma =>
                moment(d).isBetween(moment(ma.startTime), moment(ma.endTime)) ||
                moment(d).isSame(ma.startTime) ||
                moment(d).isSame(ma.endTime)
            )
          ) {
            machine.machineActivity.push({
              activityId: interactId,
              activityName: interactName,
              startTime: `${d} 00:00:00`,
              endTime: `${d} 23:59:59`,
              isNew: true
            });
          }
        }
      });
    } else {
      if (!machine.machineActivity) {
        machine.machineActivity = [];
      }
      machine.machineActivity = machine.machineActivity.filter(ma => !ma.isNew);
    }
    this.setState({ machineEdit: machine });
  }
  handleAddMachine() {
    const params = {
      queryStartTime: this.state.searchDateStr[0] + " 00:00:00",
      queryEndTime: this.state.searchDateStr[1] + " 23:59:59"
    };
    const machines = [
      ...cloneByJSON(this.state.machineList.filter(m => m.checked)).map(m => {
        delete m.checked;
        return m;
      })
    ];
    this.props.onAddMachine(params, machines);
  }
  handleUpdateMachine() {
    const params = {
      queryStartTime: this.state.editDateStart.format("YYYY-MM-DD 00:00:00"),
      queryEndTime: this.state.editDateEnd.format("YYYY-MM-DD 23:59:59")
    };
    const machines = [this.state.machineEdit];
    this.props.onUpdateMachine(params, machines);
  }
  handleAddedMachineChange(e) {
    const machines = [...this.state.addedMachineList];
    machines.filter(m => m.machineId === e.target.value).forEach(machine => {
      machine.checked = e.target.checked;
    });
    this.setState({ addedMachineList: machines });
  }
  handleAddedMachinesGoods() {
    this.props.onAddGoods(
      cloneByJSON([...this.state.addedMachineList.filter(m => m.checked)])
    );
  }
  handleAddedMachineGoods(machine) {
    this.props.onAddGoods(cloneByJSON([machine]));
  }
  handleUpdateMachineGoods(machine) {
    this.props.onUpdateGoods(cloneByJSON([machine]));
  }
  handleSearchClick() {
    const dateStr = this.state.searchDateStr;
    if (dateStr && dateStr.length > 1 && dateStr[0] && dateStr[1]) {
      this.props.onSearch(this.state.searchDateStr, this.state.searchText);
    } else {
      notification.error({
        message: "请选择筛选日期"
      });
    }
  }
  renderSchedule(dates, machines, editabel, type) {
    const result = [];
    const searchDate =
      type === 0
        ? this.state.searchDate
        : [this.state.editDateStart, this.state.editDateEnd];
    if (searchDate.length > 0) {
      const maxWidth = dates.length * width;
      let searchStartDate = searchDate[0];
      let searchEndDate = searchDate[1];
      machines.forEach((machine, index) => {
        if (machine.machineActivity && machine.machineActivity.length > 0) {
          machine.machineActivity.forEach(activity => {
            const start = moment(activity.startTime);
            const end = moment(activity.endTime);
            const allDay = this.getDayAll(start, end);
            const startStr = start.format(dateFormat);
            const endStr = end.format(dateFormat);
            const startIndex = dates.indexOf(startStr);
            const endIndex = dates.indexOf(endStr);
            if (
              searchStartDate.isBetween(start, end) ||
              searchStartDate.isSame(start) ||
              searchStartDate.isSame(end) ||
              searchEndDate.isBetween(start, end) ||
              searchEndDate.isSame(start) ||
              searchEndDate.isSame(end) ||
              start.isBetween(searchStartDate, searchEndDate) ||
              end.isBetween(searchStartDate, searchEndDate)
            ) {
              const top = index * height;
              let elWidth = allDay.length * width;
              let left = 0;
              if (
                start.isBefore(searchStartDate) ||
                start.isSame(searchStartDate)
              ) {
                left = 0;
              } else {
                left = startIndex * width;
              }
              if (end.isBefore(searchEndDate) || end.isSame(searchEndDate)) {
                elWidth = (endIndex + 1) * width - left;
              }
              if (elWidth + left > maxWidth) {
                elWidth = maxWidth - left;
              }
              const props = {
                className: `schedule-item ${
                  activity.isNew ? "activity" : "activited"
                }`,
                style: { width: elWidth, maxWidth: maxWidth, left, top }
              };
              if (
                editabel &&
                (activity.isNew ||
                  (type === 1 &&
                    activity.activityId === this.state.interactInfo.id))
              ) {
                props.onClick = () => {
                  this.handleScheduleClick(machine, activity, type);
                };
              }
              result.push(<div {...props}>{activity.activityName}</div>);
            }
          });
        }
      });
    }
    return result;
  }
  renderAdd() {
    return (
      <div style={{ padding: 10 }}>
        <div className="search-box">
          <div className="option-box">
            <Row gutter={5}>
              <Col span={9}>
                <RangePicker
                  value={this.state.searchDate}
                  format={dateFormat}
                  placeholder="日期筛选"
                  onChange={(date, dateString) => {
                    this.handleSearchDateChange(date, dateString);
                  }}
                />
              </Col>
              <Col span={9}>
                <Input
                  value={this.state.searchText}
                  onChange={this.handleSearchTextChange.bind(this)}
                  placeholder="省 市 区 点位筛选"
                />
              </Col>
              <Col span={6}>
                <Button onClick={this.handleSearchClick.bind(this)}>
                  查询
                </Button>
              </Col>
            </Row>
          </div>
          {(this.state.machineList.length > 0 && (
            <div className="content-box">
              <div className="machine-table">
                <div className="machine-table-left">
                  <div>机器编号</div>
                  {this.state.machineList.map((machine, i) => {
                    return (
                      <div
                        key={machine.machineId}
                        style={{ textAlign: "left" }}
                      >
                        <Checkbox
                          value={machine.machineId}
                          checked={machine.checked}
                          onChange={this.handleSelectedMachineChange.bind(this)}
                          disabled={machine.disabled}
                        >
                          {machine.machineCode}
                        </Checkbox>
                      </div>
                    );
                  })}
                </div>
                <div className="machine-table-calendar">
                  <div className="scroll-box">
                    <div
                      className="scroll-content"
                      style={{ width: this.state.dates.length * width }}
                    >
                      <div className="scroll-content-title">
                        <div className="content">
                          {this.state.dates.map((date, i) => {
                            return (
                              <div key={date} className="scroll-item">
                                <div>{date}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="scroll-content-main">
                        <div className="content">
                          {this.state.dates.map(date => {
                            return (
                              <div key={date} className="scroll-item">
                                {this.state.machineList.map(machine => {
                                  const props = { key: machine.machineId };
                                  if (
                                    !machine.disabled &&
                                    !moment(date).isBefore(moment().format(dateFormat))
                                  ) {
                                    props.onClick = () => {
                                      this.handleScheduleDayClick(
                                        date,
                                        machine,
                                        0
                                      );
                                    };
                                  }
                                  return <div {...props}>{date}</div>;
                                })}
                              </div>
                            );
                          })}
                        </div>
                        <div className="schedule">
                          {this.renderSchedule(
                            this.state.dates,
                            this.state.machineList,
                            true,
                            0
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="machine-table-right">
                  <div>期限</div>
                  {this.state.machineList.map((machine, i) => {
                    return (
                      <div key={machine.machineId}>
                        <Checkbox
                          value={machine.machineId}
                          checked={machine.secular}
                          onChange={this.handleMachineExpireChange.bind(this)}
                          disabled={machine.disabled || machine.state === 1}
                        >
                          长期
                        </Checkbox>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ textAlign: "center", margin: "5px 0" }}>
                <Button onClick={this.handleAddMachine.bind(this)}>添加</Button>
              </div>
            </div>
          )) || (
            <div style={{ padding: 20, textAlign: "center" }}>暂无数据</div>
          )}
          {this.state.addedMachineList.length > 0 && (
            <div>
              <div className="machine-table">
                <div className="machine-table-left">
                  <div>机器编号</div>
                  {this.state.addedMachineList.map((machine, i) => {
                    return (
                      <div
                        key={machine.machineId}
                        style={{ textAlign: "left" }}
                      >
                        <Checkbox
                          value={machine.machineId}
                          checked={machine.checked}
                          onChange={this.handleAddedMachineChange.bind(this)}
                        >
                          {machine.machineCode}
                        </Checkbox>
                      </div>
                    );
                  })}
                </div>
                <div className="machine-table-calendar">
                  <div className="scroll-box">
                    <div
                      className="scroll-content"
                      style={{ width: this.state.dates.length * width }}
                    >
                      <div className="scroll-content-title">
                        <div className="content">
                          {this.state.dates.map((date, i) => {
                            return (
                              <div key={date} className="scroll-item">
                                <div>{date}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="scroll-content-main">
                        <div className="content">
                          {this.state.dates.map(date => {
                            return (
                              <div key={date} className="scroll-item">
                                {this.state.addedMachineList.map(machine => {
                                  return (
                                    <div key={machine.machineId}>{date}</div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                        <div className="schedule">
                          {this.renderSchedule(
                            this.state.dates,
                            this.state.addedMachineList,
                            false,
                            0
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="machine-table-right">
                  <div>操作</div>
                  {this.state.addedMachineList.map((machine, i) => {
                    return (
                      <div key={machine.machineId}>
                        <a
                          onClick={() => {
                            this.handleAddedMachineGoods(machine);
                          }}
                        >
                          关联商品
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ textAlign: "center", margin: "5px 0" }}>
                <Button onClick={this.handleAddedMachinesGoods.bind(this)}>
                  关联商品
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  renderEdit() {
    const machine = this.state.machineEdit;
    return (
      <div style={{ padding: 10 }}>
        <div className="search-box">
          <div className="option-box">
            <Row gutter={5}>
              <Col span={9}>
                <DatePicker
                  value={this.state.editDateStart}
                  format={dateFormat}
                  onChange={date => {
                    this.handleEditDateChange(date, 0);
                  }}
                  disabledDate={startValue => {
                    const endValue = this.state.editDateEnd;
                    if (!startValue || !endValue) {
                      return false;
                    }
                    return startValue.valueOf() > endValue.valueOf();
                  }}
                  style={{ width: "100%" }}
                />
              </Col>
              <Col span={9}>
                <DatePicker
                  value={this.state.editDateEnd}
                  format={dateFormat}
                  onChange={date => {
                    this.handleEditDateChange(date, 1);
                  }}
                  disabledDate={endValue => {
                    const startValue = this.state.editDateStart;
                    if (!startValue || !endValue) {
                      return false;
                    }
                    return startValue.valueOf() >= endValue.valueOf();
                  }}
                  style={{ width: "100%" }}
                />
              </Col>
            </Row>
          </div>
          <div className="content-box">
            <div className="machine-table">
              <div className="machine-table-left">
                <div>机器编号</div>
                <div style={{ textAlign: "left" }}>
                  <Checkbox
                    type="checkbox"
                    value={machine.machineId}
                    checked={machine.checked}
                    onChange={this.handleEditMachineSelectedChange.bind(this)}
                  >
                    {machine.machineCode}
                  </Checkbox>
                </div>
              </div>
              <div className="machine-table-calendar">
                <div className="scroll-box">
                  <div
                    className="scroll-content"
                    style={{ width: this.state.dates.length * width }}
                  >
                    <div className="scroll-content-title">
                      <div className="content">
                        {this.state.dates.map((date, i) => {
                          return (
                            <div key={date} className="scroll-item">
                              <div>{date}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="scroll-content-main">
                      <div className="content">
                        {this.state.dates.map(date => {
                          const props = {};
                          if (!moment(date).isBefore(moment().format(dateFormat))) {
                            props.onClick = () => {
                              this.handleScheduleDayClick(date, machine, 1);
                            };
                          }
                          return (
                            <div key={date} className="scroll-item">
                              {<div {...props}>{date}</div>}
                            </div>
                          );
                        })}
                      </div>
                      <div className="schedule">
                        {this.renderSchedule(
                          this.state.dates,
                          [machine],
                          true,
                          1
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="machine-table-right">
                <div>操作</div>
                <div key={machine.machineId}>
                  <Checkbox
                    type="checkbox"
                    value={machine.machineId}
                    checked={machine.secular}
                    onChange={this.handleEditMachineExpireChange.bind(this)}
                    disabled={machine.state === -1}
                  >
                    长期
                  </Checkbox>
                </div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "center", margin: 20 }}>
            <Button
              type="primary"
              onClick={this.handleUpdateMachine.bind(this)}
            >
              保存
            </Button>
            &nbsp;
            <Button
              onClick={() => {
                this.handleUpdateMachineGoods(machine);
              }}
            >
              关联商品
            </Button>
          </div>
        </div>
      </div>
    );
  }
  render() {
    return this.state.machineEdit === null
      ? this.renderAdd()
      : this.renderEdit();
  }
}
