import React, { PureComponent } from "react";
import { Table } from "antd";
import styles from "./GoodsStatistics.less";

export default class GoodsStatistics extends PureComponent {
  state = {
    data: [
      {
        goods: 3,
        machineCode: "18605087",
        pos: "1层东门",
        activityId: "f6623e3246244f9e81e0335f04aea7bd",
        time: "2018-09-26",
        goodsCode: "1",
        goodsName: "1"
      },
      {
        goods: 4,
        machineCode: "18605087",
        pos: "1层东门",
        activityId: "f6623e3246244f9e81e0335f04aea7bd",
        time: "2018-09-26",
        goodsCode: "2",
        goodsName: "2"
      },
      {
        goods: 5,
        machineCode: "18605087",
        pos: "1层东门",
        activityId: "f6623e3246244f9e81e0335f04aea7bd",
        time: "2018-09-27",
        goodsCode: "2",
        goodsName: "2"
      }
    ],
  };

  render() {
    return <Table  />;
  }
}
