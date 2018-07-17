import { Card, Button } from 'antd';
import React, { PureComponent } from 'react';
import moment from 'moment';
import styles from './index.less';


const gridStyle = {
  width: '11%',
  textAlign: 'center',
};
const gridStyleMarginLeft = {
  width: '11%',
  textAlign: 'center',
  // marginLeft: '6%',
}
const gridLeftStyle = {
  width: '4%',
  // textAlign: 'center',
  // position: 'absolute',
  // top: '50%',
  height: '150px',
  marginTop: '175px',
  border: 0,
  boxShadow: 'none',
  cursor: 'pointer',
};

class ScheduleTable extends PureComponent {
  state = {
    dateTwoWeeksArr: [],
    currentDay: -1,
    activityArr: [],
    leftCount: 0,
    rightCount: 0,
  }
  componentDidMount() {
    const { dateList, } = this.props;
    this.initTable(dateList);
    window.addEventListener('scroll', this.orderScroll.bind(this));
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
    const weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const start = startDay.split('-')
    let w = parseInt(startDay.split('--')[1])
    const end = endDay.split('-')
    const sd = parseInt(start[2]);
    const sm = parseInt(start[1]); // 开始时间的月份
    const em = parseInt(end[1]); // 结束时间的月份
    const ed = parseInt(end[2]);
    let dateTwoWeek = []
    if (sm === em) {
      for (let i = 0; i < 15; i++) {
        if (this.state.currentDay === (sd + i)) {
          this.setState({
            currentDay: i,
          });
        }
        let newd = {id: (sd + i), value: sm + '.' + (sd + i) + '', week: w };
        w = w + 1
        if (w === 7) {
          w = 0;
        }
        dateTwoWeek.push(newd);
      }
    } else { // 存在跨月
      for (let i = 0; i < 15; i++) {
        if (i < (15 - ed)) {
          let newd = {id: (sd + i), value: sm + '.' + (sd + i) + '', week: w};
          w = w + 1
          if (w === 7) {
            w = 0;
          }
          dateTwoWeek.push(newd);
        } else {
          let newd = {id: (ed - (15 - i) + 1), value: em + '.' + (ed - (15 - i) + 1) + '', week: w};
          w = w + 1
          if (w === 7) {
            w = 0;
          }
          dateTwoWeek.push(newd);
        }
      }
    }
    return dateTwoWeek;
  }
  dateArr2 = (startDay, endDay) => {
    // const s = '12.31';
    // const e = '1.6';
    const weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const start = startDay.split('-')
    let w = parseInt(startDay.split('--')[1])
    const end = endDay.split('-')
    const sd = parseInt(start[2]);
    const sm = parseInt(start[1]); // 开始时间的月份
    const em = parseInt(end[1]); // 结束时间的月份
    const ed = parseInt(end[2]);
    let dateTwoWeek = []
    if (sm === em) {
      for (let i = 0; i < 7; i++) {
        if (this.state.currentDay === (sd + i)) {
          this.setState({
            currentDay: i,
          });
        }
        let newd = {id: (sd + i), value: sm + '.' + (sd + i) + '', week: w };
        w = w + 1
        if (w === 7) {
          w = 0;
        }
        dateTwoWeek.push(newd);
      }
    } else { // 存在跨月
      for (let i = 0; i < 7; i++) {
        if (i < (7 - ed)) {
          let newd = {id: (sd + i), value: sm + '.' + (sd + i) + '', week: w};
          w = w + 1
          if (w === 7) {
            w = 0;
          }
          dateTwoWeek.push(newd);
        } else {
          let newd = {id: (ed - (7 - i) + 1), value: em + '.' + (ed - (7 - i) + 1) + '', week: w};
          w = w + 1
          if (w === 7) {
            w = 0;
          }
          dateTwoWeek.push(newd);
        }
      }
    }
    return dateTwoWeek;
  }
  initTable = () => {
    let date = new Date(); // 获取当前时间
    let nowDate = this.format(date, 'yyyy-mm-dd')
    this.setState({
      currentDay: parseInt(nowDate.split('-')[1]) + '.' + parseInt(nowDate.split('-')[2]),
    }, () => {
      let startDay = this.format(new Date(date.setDate(date.getDate() - 7)), 'yyyy-mm-dd'); // 设置天数 -7 天
      let endDay = this.format(new Date(date.setDate(date.getDate() + 14)), 'yyyy-mm-dd'); // 设置今天天数 +7 天
      // console.log('nowDate', startDay, nowDate, endDay)
      this.props.handleDays({ startDay: startDay.split('--')[0], endDay: endDay.split('--')[0] });
      let dateTwoWeeksArr = this.dateArr(startDay, endDay);
      this.setState({
        dateTwoWeeksArr,
      }, () => {
        document.getElementById('dateWeek').scrollLeft = 600;
      });
    });
  }
  orderScroll() {
    // document.getElementById('dateWeek').scrollLeft = 600;
  }
  left = () => {
    console.log('左边')
    this.setState({
      leftCount: this.state.leftCount + 1,
    }, () => {
      let date = new Date();
      let endDay = this.format(new Date(date.setDate(new Date().getDate() - ((7 * this.state.leftCount) + 1))), 'yyyy-mm-dd'); // 设置天数 -7 天
      let startDay = this.format(new Date(date.setDate(new Date().getDate() - ((7 * this.state.leftCount) + 7))), 'yyyy-mm-dd'); // 设置今天天数 +7 天
      console.log(startDay, endDay, this.state.leftCount)
      let arr2 = this.dateArr2(startDay, endDay)
      console.log(arr2.concat(this.state.dateTwoWeeksArr))
      let dateTwoWeeksArr = arr2.concat(this.state.dateTwoWeeksArr)
      this.setState({
        dateTwoWeeksArr,
      })
    })
  }
  right = () => {
    console.log('右边')
  }
  filterWeek = (value) => {
    switch (value) {
      case 0:
        return '周日'
        break;
      case 1:
        return '周一'
        break;
      case 2:
        return '周二'
        break;
      case 3:
        return '周三'
        break;
      case 4:
        return '周四'
        break;
      case 5:
        return '周五'
        break;
      case 6:
        return '周六'
        break;
    }
  }
  render() {
    const { dateTwoWeeksArr, currentDay } = this.state;
    const { dateList } = this.props;
    // console.log('res', dateTwoWeeksArr, dateList);
    return (
      <Card title="活动排期一览表" style={{ overflowX: 'scroll'}}>
        <div style={{ display: 'flex' }}>
          <Card.Grid style={gridLeftStyle} onClick={() => this.left()}>
            <span>加载更多</span>
          </Card.Grid>
          <div style={{ overflowX: 'scroll', height: '600px', overflowY: 'hidden', display: 'flex', position: 'relative', zIndex: 3 }} id="dateWeek">
            {dateTwoWeeksArr.map((item) => {
              return (
                <Card.Grid value={item.id} key={item.id} className={currentDay === item.value ? styles.currentDay : ''}>
                  <p>{item.value}</p>
                  <p>{this.filterWeek(item.week)}</p>
                  <p style={{ height: '500px' }}></p>
                </Card.Grid>
              );
            })}
            {/*<div className={styles.dateList}>*/}
              {dateList.map((item) => {
                return (
                  <div className={styles.dateChildren} key={item.id}
                       style={{ background: item.background, width: item.width, top: item.top, left: item.left, position: 'absolute' }}
                  >{item.name}</div>
                );
              })}
            {/*</div>*/}
          </div>
          <Card.Grid style={gridLeftStyle} onClick={() => this.right()}>
            <span>加载更多</span>
          </Card.Grid>
         </div>
      </Card>
    );
  }
}
export default ScheduleTable;
