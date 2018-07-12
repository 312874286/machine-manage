import { Card, Button } from 'antd';
import React, { PureComponent } from 'react';
import moment from 'moment';

const gridStyle = {
  width: '11%',
  textAlign: 'center',
};
const gridStyleMarginLeft = {
  width: '11%',
  textAlign: 'center',
  marginLeft: '6%',
}
const gridLeftStyle = {
  width: '6%',
  textAlign: 'center',
  position: 'absolute',
  top: '50%',
  height: '150px',
  marginTop: '-75px',
  border: 0,
  boxShadow: 'none',
  cursor: 'pointer',
};
const gridRightStyle = {
  width: '6%',
  textAlign: 'center',
  position: 'absolute',
  top: '50%',
  height: '150px',
  marginTop: '-75px',
  left: '91%',
  border: 0,
  boxShadow: 'none',
  cursor: 'pointer',
}

class ScheduleTable extends PureComponent {
  state = {
    dateTwoWeeksArr: [],
    currentDay: -1,
  }
  componentDidMount() {
    this.initTable();
  }
  format = (date,str) => {
    let mat = {};
    mat.M = date.getMonth() + 1; // 月份记得加1
    mat.H = date.getHours();
    mat.s = date.getSeconds();
    mat.m = date.getMinutes();
    mat.Y = date.getFullYear();
    mat.D = date.getDate();
    mat.d = date.getDay(); // 星期几
    // mat.d = this.check(mat.d);
    mat.H = this.check(mat.H);
    mat.M = this.check(mat.M);
    mat.D = this.check(mat.D);
    mat.s = this.check(mat.s);
    mat.m = this.check(mat.m);
    if (str.indexOf('-') > -1) {
      return mat.Y + '-' + mat.M + '-' + mat.D + '--' + mat.d;
    }
  }
  check = (str) => {
    str = str.toString();
    if (str.length < 2) {
      str = '0' + str;
    }
    return str;
  }
  dateArr = (startDay, endDay) => {
    // const s = '12.31';
    // const e = '1.6';
    const start = startDay.split('-')
    const end = endDay.split('-')
    const sd = parseInt(start[2]);
    const sm = parseInt(start[1]); // 开始时间的月份
    const em = parseInt(end[1]); // 结束时间的月份
    const ed = parseInt(end[2]);
    let dateTwoWeek = []
    if (sm === em) {
      for (let i = 0; i < 15; i++) {
        let newd = {id: i, value: sm + '月' + (sd + i) + '日'};
        dateTwoWeek.push(newd);
      }
    } else { // 存在跨月
      for (let i = 0; i < 15; i++) {
        if (i < (15 - ed)) {
          let newd = {id: i, value: sm + '月' + (sd + i) + '日'};
          dateTwoWeek.push(newd);
        } else {
          let newd = {id: i, value: em + '月' + (ed - (15 - i) + 1) + '日'};
          dateTwoWeek.push(newd);
        }
      }
    }
    return dateTwoWeek;
  }
  initTable = () => {
    let date = new Date(); // 获取当前时间
    let nowDate = this.format(date, 'yyyy-mm-dd')
    let startDay = this.format(new Date(date.setDate(date.getDate() - 7)), 'yyyy-mm-dd'); // 设置天数 -7 天
    let endDay = this.format(new Date(date.setDate(date.getDate() + 14)), 'yyyy-mm-dd'); // 设置天数 +7 天
    console.log('nowDate', startDay, nowDate, endDay)
    let dateTwoWeeksArr = this.dateArr(startDay, endDay);
    this.setState({
      dateTwoWeeksArr,
    });
  }
  render() {
    const { dateTwoWeeksArr } = this.state;
    console.log(dateTwoWeeksArr)
    return (
      <Card title="活动排期一览表" style={{overflowX: 'scroll', width: '1200px'}}>
        <Card.Grid style={gridLeftStyle}>
          <span>加载更多</span>
        </Card.Grid>
        <div style={{overflowX: 'scroll', height: '600px', overflowY: 'hidden', width: '165%', display: 'flex'}} >
          {dateTwoWeeksArr.map((item) => {
            return (
              <Card.Grid value={item.id} key={item.id} style={item.id === 0 ? gridStyleMarginLeft : gridStyle}>
                <p>{item.value}</p>
                <p>周日</p>
                <p style={{height: '500px' }}></p>
              </Card.Grid>
            );
          })}
        </div>
        <Card.Grid style={gridRightStyle}>
          <span>加载更多</span>
        </Card.Grid>
      </Card>
    );
  }
}
export default ScheduleTable;
