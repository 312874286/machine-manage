import React, { PureComponent } from "react";
import { Table } from "antd";
import styles from "./GoodsStatistics.less";

const columns = [
  {
    title: "时间",
    width: 100,
    key: "time + i.machineCode",
    render: (data, datas, index) => {
      const result = {
        children: data.time,
        props: {}
      };
      if (data.count > 1) {
        if (data.start) {
          result.props.rowSpan = data.count;
        } else {
          result.props.rowSpan = 0;
        }
      }
      return result;
    }
  },
  {
    title: "机器",
    width: 100,
    dataIndex: "machineCode"
  },
  {
    title: "商品",
    children: []
  }
];
export default class GoodsStatistics extends PureComponent {
  state = {
    datas: []
  };

  parseData(datas) {
    let data = [...datas];
    let result = [];
    const times = {};
    columns[2].children = [];
    data.forEach(item => {
      let curData = result.find(
        i => i.time === item.time && i.machineCode === item.machineCode
      );
      if (!times[item.time]) {
        times[item.time] = {};
      }
      if (!curData) {
        curData = {
          time: item.time,
          start: !result.some(i => i.time === item.time),
          machineCode: item.machineCode
        };
        result.push(curData);
      }
      curData[item.goodsCode] = item;
      if (!columns[2].children.some(i => i.dataIndex === item.goodsCode)) {
        columns[2].children.push({
          title: item.goodsName,
          dataIndex: item.goodsCode,
          width: 120,
          render: record => {
            return (
              (record && record.goods) ||
              (record && record.isSummary && "0") ||
              "-"
            );
          }
        });
      }
    });
    result = result.map((item, index, array) => {
      return {
        ...item,
        count: array.filter(i => i.time === item.time).length + 1
      };
    });
    let sortResult = [];
    Object.keys(times)
      .sort((a, b) => {
        const ad = new Date(a);
        const bd = new Date(b);
        if (ad < bd) {
          return 1;
        } else if (ad === bd) {
          return 0;
        } else {
          return -1;
        }
      })
      .forEach(time => {
        const items = result.filter(i => i.time === time);
        const summary = { time, machineCode: "合计", count: items[0].count };
        columns[2].children.forEach(i => {
          const goodsCode = i.dataIndex;
          let goodsCount = 0;
          if (items.length > 0) {
            if (items.length > 1) {
              goodsCount = items.reduce((pv, cv) => {
                const pGoods =
                  typeof pv === "object"
                    ? (pv[goodsCode] && pv[goodsCode].goods) || 0
                    : pv;
                const cGoods = (cv[goodsCode] && cv[goodsCode].goods) || 0;
                return pGoods + cGoods;
              });
            } else {
              goodsCount =
                (items[0][goodsCode] && items[0][goodsCode].goods) || 0;
            }
          }
          summary[goodsCode] = {
            goods: goodsCount,
            isSummary: true
          };
        });
        sortResult = sortResult.concat(items);
        sortResult.splice(
          sortResult.lastIndexOf(items[items.length - 1]) + 1,
          0,
          summary
        );
      });
    return sortResult;
  }

  render() {
    const data = this.parseData(this.props.datas);
    console.log(data);
    return (
      <Table
        columns={columns}
        rowKey={i => i.time + i.machineCode}
        dataSource={data}
        pagination={false}
        loading={this.props.loading}
        bordered
      />
    );
  }
}
