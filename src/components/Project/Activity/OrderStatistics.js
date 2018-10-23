import React, { PureComponent } from "react";
import { Table, Modal, Divider, Tag } from "antd";
import styles from "./OrderStatistics.less";

export default class OrderStatistics extends PureComponent {
  state = {
    list: [],
    columnsList: [],
    data: []
  };

  renderColums = () => {
    const dateList = [];
    let columnsList = [];
    this.props.datas.forEach(item => {
      item.data.forEach(date => {
        if (dateList.indexOf(date.date) === -1) {
          dateList.push(date.date);
          columnsList.push({
            title: date.date,
            width: 400,
            render: (text, record, index) => {
              return (
                <div>
                  pv:
                  {record[`pv${date.date}`] || 0}
                  <br /> uv:
                  {record[`uv${date.date}`] || 0} <br /> order:
                  {record[`order${date.date}`] || 0} <br /> shipment:
                  {record[`shipment${date.date}`] || 0} <br /> fans:
                  {record[`fans${date.date}`] || 0}
                </div>
              );
            }
          });
        }
      });
    });
    console.log(columnsList);
    columnsList = columnsList.sort((a, b) => {
      const ad = new Date(a.title);
      const bd = new Date(b.title);
      if (ad < bd) {
        return 1;
      } else if (ad === bd) {
        return 0;
      } else {
        return -1;
      }
    });
    console.log(JSON.stringify(columnsList));
    return columnsList;
  };

  renderData = () => {
    const list = this.props.datas;
    const data = [];

    list.forEach((item, i) => {
      const obj = {
        machineCode: item.machineCode,
        point: item.point,
        id: `${i}${parseInt(Math.random() * 100000)}`,
        total: {
          pv: 0,
          uv: 0,
          order: 0,
          shipment: 0,
          fans: 0
        }
      };
      item.data.forEach((date, k) => {
        // obj['date'] = date.date,
        obj[`pv${date.date}`] = date.pv;
        obj[`uv${date.date}`] = date.uv;
        obj[`order${date.date}`] = date.order;
        obj[`shipment${date.date}`] = date.shipment;
        obj[`fans${date.date}`] = date.fans;
        // debugger
        obj.total.pv += date.pv || 0;
        obj.total.uv += date.uv || 0;
        obj.total.order += date.order || 0;
        obj.total.shipment += date.shipment || 0;
        obj.total.fans += date.fans || 0;
      });
      data.push(obj);
    });
    return data;
  };

  render() {
    const columnsList = this.renderColums();
    const data = this.renderData();

    const columns = [
      {
        title: "点位",
        dataIndex: "machineCode",
        width: 300,
        render: (text, record, index) => {
          return (
            <div>
              {record.point}({record.machineCode})
            </div>
          );
        }
      },
      ...columnsList,
      {
        title: "合计",
        dataIndex: "total",
        width: 150,
        render: (text, record) => {
          return (
            <div>
              pv:
              {record.total.pv} <br /> uv:
              {record.total.uv} <br /> order:
              {record.total.order} <br /> shipment:
              {record.total.shipment} <br /> fans:
              {record.total.fans}
            </div>
          );
        }
      }
    ];
    return (
      <div>
        <Table
          columns={columns}
          rowKey={record => record.id}
          dataSource={data}
          pagination={false}
          scroll={{ x: columnsList.length * 150 + 300 + 150 }}
          loading={this.props.loading}
          bordered
        />
      </div>
    );
  }
}
