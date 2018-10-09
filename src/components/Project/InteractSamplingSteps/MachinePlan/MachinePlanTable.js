import React, { PureComponent, Fragment } from "react";
import { Table, Divider, Popconfirm } from "antd";
import { identity } from "gl-matrix/src/gl-matrix/mat2";

export default class MachinePlanTable extends PureComponent {
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

export class MachinePlanedGoodsTable extends PureComponent {
  renderTable = () => {
    const columns = [
      { title: "商品名称", dataIndex: "goodsName" },
      { title: "商品数量", dataIndex: "number" },
      {
        title: "操作",
        dataIndex: "operation",
        render: record => {
          return (
            <Fragment>
              <Popconfirm
                title="确定要删除吗"
                onConfirm={this.props.onDeleteGoods}
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
        rowKey="goodsId"
        columns={columns}
        dataSource={this.props.dataSource}
        pagination={false}
      />
    );
  };
  render() {
    return this.renderTable();
  }
}
