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
    const columnsList = [];
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
                  {record[`pv${date.date}`]} | uv:
                  {record[`uv${date.date}`]} | order:
                  {record[`order${date.date}`]} | shipment:
                  {record[`shipment${date.date}`]} | fans:
                  {record[`fans${date.date}`]}
                </div>
              );
            }
          });
        }
      });
    });
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
        obj.total.pv += date.pv;
        obj.total.uv += date.uv;
        obj.total.order += date.order;
        obj.total.shipment += date.shipment;
        obj.total.fans += date.fans;
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
        width: 200,
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
        width: 400,
        fixed: "right",
        render: (text, record) => {
          return (
            <div>
              pv:
              {record.total.pv} | uv:
              {record.total.uv} | order:
              {record.total.order} | shipment:
              {record.total.shipment} | fans:
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
          scroll={{ x: data.length * 400 + 600 }}
          loading={this.props.loading}
          bordered
        />
      </div>
    );
  }
}
