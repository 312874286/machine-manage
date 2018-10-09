import React, { Component, Fragment } from "react";
import { Table, Divider, Popconfirm } from "antd";

export default class MachinePlanTable extends Component {
  state = {
    expandedRows: []
  };
  handleExpand = (indent, record) => {
    return this.props.onExpand(indent, record);
  };
  handleExpandedRowsChange = expandedRows => {
    this.setState({ expandedRows });
  };
  renderExpandedRow = (record, index, indent) => {
    return this.props.renderExpandedRow(
      record,
      this.state.expandedRows.some(id => id === record.id)
    );
  };
  renderMachineTable = () => {
    const columns = [
      {
        title: "机器编号",
        dataIndex: "machineCode"
      },
      {
        title: "机器点位",
        dataIndex: "localDesc"
      },
      {
        title: "操作",
        render: record => {
          return (
            <Fragment>
              <a
                onClick={() => {
                  this.props.onUpdateMachine(record);
                }}
              >
                修改
              </a>
              <Divider type="vertical" />
              <Popconfirm
                title="确定要删除吗"
                onConfirm={() => {
                  this.props.onDeleteMachine(record);
                }}
                okText="确定"
                cancelText="取消"
              >
                <a>删除</a>
              </Popconfirm>
            </Fragment>
          );
        }
      }
    ];
    return (
      <Table
        rowKey="id"
        columns={columns}
        dataSource={this.props.dataSource}
        expandedRowRender={this.renderExpandedRow}
        onExpand={this.handleExpand}
        onExpandedRowsChange={this.handleExpandedRowsChange}
        pagination={false}
      />
    );
  };
  render() {
    return this.renderMachineTable();
  }
}