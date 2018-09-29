import React, { PureComponent, Fragment } from "react";
import { Table, Divider, Popconfirm } from "antd";

const columns = [
  { title: "机器", dataIndex: "machineCode" },
  { title: "09-15", dataIndex: "date" },
  { title: "09-16", dataIndex: "date" },
  { title: "09-17", dataIndex: "date" }
];

const data = [
  { machineCode: "1号机器", date: "123" },
  { machineCode: "2号机器", date: "123" },
  { machineCode: "3号机器", date: "123" }
];

export default class MachineConfigCard extends PureComponent {
  renderSearchTable() {
    return <Table columns={columns} dataSource={data} pagination={false} />;
  }
  renderConfigTable() {
    return <Table columns={columns} dataSource={data} pagination={false}/>;
  }
  render() {
    return (
      <div>
        <div>{this.renderSearchTable()}</div>
        <div> {this.renderConfigTable()}</div>
      </div>
    );
  }
}
