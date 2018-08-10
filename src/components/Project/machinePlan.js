import { Card, Button, Icon, Popover, Popconfirm, Table } from 'antd';
import React, { PureComponent } from 'react';
import moment from 'moment';
import styles from './machinePlan.less';

const gridLeftStyle = {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: 0
};
const gridStyleRight = {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: 0
}
const gridMiddleStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0
}
class MachinePlan extends PureComponent {
  state = {
    dateTwoWeeksArr: [],
    currentDay: -1,
    currentDayAfter: -1,
    activityArr: [],
    leftCount: 0,
    rightCount: 0,
    startDay: '',
    endDay: '',
    days: 0,
    showTitleYear: '',
    showTitleMonth: ''
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
        let newd = {id: (sm + '.' + (sd + i)), value: sm + '.' + (sd + i) + '', week: w };
        w = w + 1
        if (w === 7) {
          w = 0;
        }
        dateTwoWeek.push(newd);
      }
    } else { // 存在跨月
      for (let i = 0; i < 15; i++) {
        if (i < (15 - ed)) {
          let newd = {id: (sm + '.' + (sd + i)), value: sm + '.' + (sd + i) + '', week: w};
          w = w + 1
          if (w === 7) {
            w = 0;
          }
          dateTwoWeek.push(newd);
        } else {
          let newd = {id: (em + '.' + (ed - (15 - i) + 1)), value: em + '.' + (ed - (15 - i) + 1) + '', week: w};
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
  dateMonth = (currentYear, currentMonth, monthdays) => {
    let dateTwoWeek = []
    for (let i = 1; i <= monthdays; i++) {
      let newd = {dataId: `${currentYear}.${currentMonth}.${i}`, value: i, id: `${currentYear}.${currentMonth}.${i}` };
      dateTwoWeek.push(newd);
    }
    return dateTwoWeek
  }
  initTable = () => {
    // let date = new Date(); // 获取当前时间
    // let nowDate = this.format(date, 'yyyy-mm-dd')
    // let currentYear = date.getFullYear()
    // let currentMonth = date.getMonth() + 1
    // let currentDay = date.getDate()
    // this.setState({
    //   currentDay: `${currentYear}.${currentMonth}.${currentDay}`,
    // }, () => {
    //   console.log('getDaysInOneMonth', this.getDaysInOneMonth(currentYear, currentMonth))
    //   let days = this.getDaysInOneMonth(currentYear, currentMonth)
    //   let dateTwoWeeksArr = this.dateMonth(currentYear, currentMonth, days)
    //   console.log('dateTwoWeeksArr2', dateTwoWeeksArr)
    //   this.setState({
    //     showTitleYear: currentYear,
    //     showTitleMonth: currentMonth,
    //     days,
    //     dateTwoWeeksArr,
    //   }, () => {
    //     this.props.handleDays({
    //       startDay: `${currentYear}-${currentMonth}-01`,
    //       endDay: `${currentYear}-${currentMonth}-${days}`,
    //       getDataStartDay: `${currentYear}-${currentMonth}-01`,
    //       getDataEndDay: `${currentYear}-${currentMonth}-${days}`,
    //     });
    //   });
    // });
    this.setValue('')
  }
  orderScroll() {
    // document.getElementById('dateWeek').scrollLeft = 600;
  }
  getDaysInOneMonth = (year, month) => {
    month = parseInt(month, 10);
    var d= new Date(year, month, 0);
    return d.getDate();
  }
  left = () => {
    this.setValue('left')
  }
  right = () => {
    this.setValue('right')
  }
  setValue = (flag) => {
    const { showTitleYear, showTitleMonth } = this.state;
    let currentYear = ''
    let currentMonth = ''
    let date = new Date();
    let currentDay = ''
    if (flag === 'right') {
      currentYear = showTitleMonth === 12 ? (showTitleYear + 1) : showTitleYear
      currentMonth = showTitleMonth === 12 ? 1 : (showTitleMonth + 1)
    } else if ( flag === 'left'){
      currentYear = showTitleMonth === 1 ? (showTitleYear - 1) : showTitleYear
      currentMonth = showTitleMonth === 1 ? 12 : (showTitleMonth - 1)
    } else {
      currentYear = date.getFullYear()
      currentMonth = date.getMonth() + 1
      currentDay = date.getDate()
      this.setState({
        currentDay: `${currentYear}.${currentMonth}.${currentDay}`,
      })
    }
    let days = this.getDaysInOneMonth(currentYear, currentMonth)
    let dateTwoWeeksArr = this.dateMonth(currentYear, currentMonth, days)
    this.setState({
      days,
      dateTwoWeeksArr,
      showTitleYear: currentYear,
      showTitleMonth: currentMonth,
      currentDay: currentDay ? `${currentYear}.${currentMonth}.${currentDay}` : '',
    }, () => {
      this.props.handleDays({
        startDay: `${currentYear}-${currentMonth}-01`,
        endDay: `${currentYear}-${currentMonth}-${days}`,
        getDataStartDay: `${currentYear}-${currentMonth}-01`,
        getDataEndDay: `${currentYear}-${currentMonth}-${days}`,
      });
    });
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
  backToday = () => {
    this.setValue('')
  }
  timeLineBox = (items, width) => {
    // console.log('items', items) activityName state
    return (
      <div className={styles.timeLineBox} style={{ width: width }}>
        {items.map((item, i) => {
          return (
            <Popover key={i} placement="top" title={`活动名称：${item.activityName}`} content={
              <div>
                <span style={{ marginRight: 10 }}>开始时间：{item.startTime}</span>
                <span>结束时间：{item.endTime}</span>
              </div>
            } trigger="hover">
              <span style={{
                background: item.state === 2 ? 'rgba(235,242,255,1)' : 'rgba(229,247,216,1)',
                color: moment(item.endTime) < new Date().getTime()  ? '#666666' : (moment(item.startTime) > new Date().getTime() ? '#5076FF' : '#48AB00'),
                width: item.width, top: 0, left: item.left, position: 'absolute', display: 'flex',
                justifyContent: 'space-between', zIndex: 999, height: '30px',alignItems: 'center', borderRadius: '0px 34px 34px 0px' }}>
                {item.activityName}
              </span>
            </Popover>
            )
        })}
      </div>
    )
  }
  render() {
    const { dateTwoWeeksArr, currentDay, days, showTitleYear, showTitleMonth } = this.state;
    const { minHeight, resource } = this.props;
    // console.log('res', dateTwoWeeksArr, dateList);
    console.log('resource', resource)
    return (
      <div id="scheduleBox" className={styles.machinePlanBox}>
        <Card title={
          <div className={styles.titleBox}>
            <div className={styles.iBox}>
              <i className={styles.ingStatus}></i>活动进行中
              <i className={styles.preStatus}></i>活动未开始
              <Button type="primary" style={{ marginLeft: '10px' }} onClick={() => this.backToday(true)}>
                返回本月
              </Button>
            </div>
          </div>
        } style={{ overflow: 'hidden'}} id="scheduleBox"
              bordered={false}>
          <div className={styles.machineBox} style={{ maxWidth: (27 * (days)) + 'px', minWidth: (27 * (days) + 200) + 'px', position: 'relative', margin: '0 auto' }}>
            <div style={{ display: 'flex', maxWidth: (27 * (days)  + 200 ) + 'px', minWidth: (27 * (days) + 200) + 'px', margin: '0 auto' }}
                 className={styles.cardDiv}>
              <div className={styles.machineCodeBox}>
                <div>
                  <span className={styles.title}>商圈</span>
                </div>
                <div>
                  <span className={styles.title}>机器编号</span>
                </div>
              </div>
              <div className={styles.dateWeekBox} style={{ height: minHeight }}>
                <div className={styles.month}>
                  <Card.Grid style={gridLeftStyle} onClick={() => this.left()}>
                    <span className={styles.monthBtn} style={{ marginLeft: '3px' }}>上一月</span>
                  </Card.Grid>
                  <Card.Grid style={gridMiddleStyle}>
                    <span className={styles.gridMiddleStyle}>{showTitleYear}-{ showTitleMonth > 9 ? showTitleMonth : `0${showTitleMonth}` }</span>
                  </Card.Grid>
                  <Card.Grid style={gridStyleRight} onClick={() => this.right()}>
                    <span className={styles.monthBtn} style={{ marginRight: '3px' }}>下一月</span>
                  </Card.Grid>
                </div>
                <div style={{ overflowX: 'hidden', display: 'flex', position: 'relative', zIndex: 3, height: minHeight }}
                     id="dateWeek" className={styles.dateWeek}>
                  {dateTwoWeeksArr.map((item) => {
                    return (
                      <Card.Grid value={item.id} key={item.id} className={currentDay === item.id ? styles.currentDay : styles.tableDiv}>
                        <a id={currentDay === item.id ? 'today': ''}>
                          <p>{item.value}</p>
                          <p className="pHeight"></p>
                        </a>
                        <div style={{ width: '100%', height: minHeight - 29, borderRight: '1px solid #f2f2f2' }}></div>
                      </Card.Grid>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className={styles.machineLeft}>
              <div className={styles.dateList} style={{ maxWidth: (27 * (days) + 200) + 'px', minWidth: (27 * (days) + 200) + 'px' , height: minHeight - 60}}>
                {resource.map((item) => {
                  return (
                    <div className={styles.machineMsg} value={item.machineCode} key={item.machineCode}>
                      <Popover placement="top" content={item.localDesc} trigger="hover">
                        <span className={styles.title}>{item.localDesc}</span>
                      </Popover>
                      <span className={styles.title}>{item.machineCode}</span>
                      {/*<span>{item.planTime.length > 0 ? item.planTime[0].startTime : ''}</span>*/}
                      {this.timeLineBox(item.planTime, 27 * days)}

                      {/*<div className={styles.timeLineBox} style={{ width: 27 * days }}>*/}
                      {/*</div>*/}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }
}
export default MachinePlan;

