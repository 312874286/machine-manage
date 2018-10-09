import React, { Component, Fragment } from "react";
import {
  Table,
  DatePicker,
  Button,
  Modal,
  Input,
  Checkbox,
  Row,
  Col
} from "antd";
import moment from "moment";
import $ from "jquery";
import { cloneByJSON } from "../../../../utils/utils";

import "./MachineConfigCard.less";

const { RangePicker } = DatePicker;
const width = 150;
const height = 60;
export default class MachineConfigCard extends Component {
  state = {
    dates: [],
    addedMachineList: [],
    machineEdit: null,
    machineList: [],
    goodsMachineList: [],
    searchDate: [],
    searchDateStr: [],
    searchDateStart: null,
    searchDateEnd: null,
    searchText: null,
    interactInfo: null
  };
  componentDidMount() {
    this.setState({ machineEdit: this.props.data });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      machineList: nextProps.datas,
      addedMachineList: nextProps.postDatas,
      interactInfo: nextProps.interactInfo
    });
  }
  getDayAll = (begin, end) => {
    var dateAllArr = new Array();
    var unixDb = begin.valueOf();
    var unixDe = end.valueOf();

    for (var k = unixDb; k <= unixDe; ) {
      dateAllArr.push(moment(parseInt(k)).format("YYYY-MM-DD"));
      k = k + 24 * 60 * 60 * 1000;
    }
    return dateAllArr;
  };
  handleSearchDateChange(date, dateString) {
    this.setState({
      dates: this.getDayAll(date[0], date[1]),
      searchDate: date,
      searchDateStr: dateString
    });
  }
  handleSearchTextChange(e) {
    this.setState({ searchText: e.target.value });
  }
  handleScheduleDayClick(date, machine) {
    const machines = [...this.state.machineList];
    machines.filter(m => m.machineId === machine.machineId).forEach(machine => {
      if (!machine.machineActivity) {
        machine.machineActivity = [];
      }
      machine.machineActivity.push({
        activityId: this.state.interactInfo.id,
        activityName: this.state.interactInfo.name,
        startTime: `${date} 00:00:00`,
        endTime: `${date} 23:59:59`,
        isNew: true
      });
    });
    this.setState({ machineList: machines });
  }
  handleScheduleClick(machine, schedule) {
    const machines = [...this.state.machineList];
    machines.filter(m => m.machineId === machine.machineId).forEach(machine => {
      machine.machineActivity.splice(
        machine.machineActivity.indexOf(schedule),
        1
      );
    });
    this.setState({ machineList: machines });
  }
  handleSelectedMachineChange(e) {
    const machines = [...this.state.machineList];
    machines.filter(m => m.machineId === e.target.value).forEach(machine => {
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
  handleAddedMachineChange(e) {
    const machines = [...this.state.addedMachineList];
    machines.filter(m => m.machineId === e.target.value).forEach(machine => {
      machine.checked = e.target.checked;
    });
    this.setState({ addedMachineList: machines });
  }
  handleAddedMachineGoods() {
    this.props.onAddGoods(
      cloneByJSON([...this.state.addedMachineList.filter(m => m.checked)])
    );
  }
  handleAddedMachineGood(good) {
    this.props.onAddGoods(cloneByJSON([good]));
  }

  handleSearchClick() {
    this.props.onSearch(this.state.searchDateStr, this.state.searchText);
  }
  renderSchedule(dates, machines, editabel) {
    const result = [];
    const maxWidth = dates.length * width;
    machines.forEach((machine, index) => {
      if (machine.machineActivity && machine.machineActivity.length > 0) {
        machine.machineActivity.forEach(activity => {
          const start = moment(activity.startTime);
          const end = moment(activity.endTime);
          const allDay = this.getDayAll(start, end);
          const startStr = start.format("YYYY-MM-DD");
          const endStr = end.format("YYYY-MM-DD");
          const startIndex = dates.indexOf(startStr);
          const endIndex = dates.indexOf(endStr);
          if (startIndex > -1 || endIndex > -1) {
            const top = index * height;
            let left = 0;
            if (startIndex > -1) {
              left = startIndex * width;
            } else if (endIndex > -1) {
              left = 0;
            }
            //TODO need to fix out of range bug
            let elWidth = allDay.length * width;
            if (elWidth + left > maxWidth) {
              elWidth = maxWidth - left;
            }
            const props = {
              className: `schedule-item ${
                activity.isNew ? "activity" : "activited"
              }`,
              style: { width: elWidth, maxWidth: maxWidth, left, top }
            };
            if (editabel && activity.isNew) {
              props.onClick = () => {
                this.handleScheduleClick(machine, activity);
              };
            }
            result.push(<div {...props}>{activity.activityName}</div>);
          }
        });
      }
    });
    return result;
  }
  render() {
    return (
      <div style={{ padding: 10 }}>
        <div className="search-box">
          <div className="option-box">
            {(!this.state.machineEdit && (
              <Row gutter={5}>
                <Col span={9}>
                  <RangePicker
                    value={this.state.searchDate}
                    format="YYYY-MM-DD"
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
            )) || (
              <Row gutter={5}>
                <Col span={9}>
                  <DatePicker
                    value={this.state.searchDateStart}
                    format="YYYY-MM-DD"
                    onChange={(date, dateString) => {
                      this.handleSearchDateChange(date, dateString);
                    }}
                  />
                </Col>
                <Col span={9}>
                  <DatePicker
                    value={this.state.searchDateEnd}
                    format="YYYY-MM-DD"
                    onChange={(date, dateString) => {
                      this.handleSearchDateChange(date, dateString);
                    }}
                  />
                </Col>
                <Col span={6}>
                  <Button onClick={this.handleSearchClick.bind(this)}>
                    查询
                  </Button>
                </Col>
              </Row>
            )}
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
                        <label>
                          <input
                            type="checkbox"
                            value={machine.machineId}
                            checked={machine.checked}
                            onChange={this.handleSelectedMachineChange.bind(
                              this
                            )}
                          />
                          {machine.machineCode}
                        </label>
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
                                {this.state.machineList.map(
                                  (machine, index) => {
                                    return (
                                      <div
                                        key={machine.machineId}
                                        onClick={() => {
                                          this.handleScheduleDayClick(
                                            date,
                                            machine
                                          );
                                        }}
                                      />
                                    );
                                  }
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className="schedule">
                          {this.renderSchedule(
                            this.state.dates,
                            this.state.machineList,
                            true
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
                        <label>
                          <input
                            type="checkbox"
                            value={machine.machineId}
                            checked={machine.secular}
                            onChange={this.handleMachineExpireChange.bind(this)}
                          />
                          长期
                        </label>
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
        </div>
        {this.state.addedMachineList.length > 0 && (
          <div>
            <div className="machine-table">
              <div className="machine-table-left">
                <div>机器编号</div>
                {this.state.addedMachineList.map((machine, i) => {
                  return (
                    <div key={machine.machineId} style={{ textAlign: "left" }}>
                      <label>
                        <input
                          type="checkbox"
                          value={machine.machineId}
                          checked={machine.checked}
                          onChange={this.handleAddedMachineChange.bind(this)}
                        />
                        {machine.machineCode}
                      </label>
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
                          false
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
                          this.handleAddedMachineGood(machine);
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
              <Button onClick={this.handleAddedMachineGoods.bind(this)}>
                关联商品
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
