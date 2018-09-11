import { Card, Button, Icon, Popover, Popconfirm } from 'antd';
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
  width: '30px',
  // textAlign: 'center',
  // position: 'absolute',
  // top: '50%',
  height: '150px',
  marginTop: '175px',
  border: 0,
  boxShadow: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  marginRight: '10px'
  // background: 'aliceblue',
  // color: '#174a79',
  // position: 'fixed',
  // marginLeft: '-49px',
};
const gridStyleRight = {
  width: '30px',
  // textAlign: 'center',
  // position: 'absolute',
  // top: '50%',
  height: '150px',
  marginTop: '175px',
  border: 0,
  boxShadow: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  marginLeft: '10px'
  // background: 'aliceblue',
  // color: '#174a79',
  // position: 'fixed',
  // marginLeft: '1040px',
}
class ScheduleTable extends PureComponent {
  state = {
    dateTwoWeeksArr: [],
    currentDay: -1,
    currentDayAfter: -1,
    activityArr: [],
    leftCount: 0,
    rightCount: 0,
    startDay: '',
    endDay: '',
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
        // if (this.state.currentDay === (sd + i)) {
        //   this.setState({
        //     currentDay: i,
        //   });
        // }
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
        // if (this.state.currentDay === (sd + i)) {
        //   this.setState({
        //     currentDay: i,
        //   });
        // }
        let newd = {id: (sm + '.' + (sd + i)), value: sm + '.' + (sd + i) + '', week: w };
        w = w + 1
        if (w === 7) {
          w = 0;
        }
        dateTwoWeek.push(newd);
      }
    } else { // 存在跨月
      for (let i = 0; i < 7; i++) {
        if (i < (7 - ed)) {
          let newd = {id: (sm + '.' + (sd + i)), value: sm + '.' + (sd + i) + '', week: w};
          w = w + 1
          if (w === 7) {
            w = 0;
          }
          dateTwoWeek.push(newd);
        } else {
          let newd = {id: (em + '.' + (ed - (7 - i) + 1)), value: em + '.' + (ed - (7 - i) + 1) + '', week: w};
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
      this.props.handleDays({
        startDay: startDay.split('--')[0],
        endDay: endDay.split('--')[0],
        getDataStartDay: startDay.split('--')[0],
        getDataEndDay: endDay.split('--')[0],
      });
      let dateTwoWeeksArr = this.dateArr(startDay, endDay);
      this.setState({
        dateTwoWeeksArr,
        startDay: startDay.split('--')[0],
        endDay: endDay.split('--')[0],
        currentDayAfter: parseInt(endDay.split('-')[1]) + '.' + parseInt(endDay.split('-')[2])
      }, () => {
        document.getElementById('dateWeek').scrollLeft = 600;
      });
    });
  }
  orderScroll() {
    // document.getElementById('dateWeek').scrollLeft = 600;
  }
  left = () => {
    // console.log('左边')
    this.setState({
      leftCount: this.state.leftCount + 1,
    }, () => {
      console.log('this.state.leftCount', this.state.leftCount)
      let date = new Date();
      let endDay = this.format(new Date(new Date().setDate(new Date().getDate() - ((7 * this.state.leftCount) + 1))), 'yyyy-mm-dd'); // 设置天数 -7 天
      let startDay = this.format(new Date(new Date().setDate(new Date().getDate() - ((7 * this.state.leftCount) + 7))), 'yyyy-mm-dd'); // 设置今天天数 +7 天
      console.log('leftCount', startDay, endDay, this.state.leftCount)
      let arr2 = this.dateArr2(startDay, endDay)
      console.log(arr2.concat(this.state.dateTwoWeeksArr))
      let dateTwoWeeksArr = arr2.concat(this.state.dateTwoWeeksArr)
      this.setState({
        dateTwoWeeksArr,
        startDay: startDay.split('--')[0],
      }, () => {
        this.props.handleDays({
          startDay: this.state.startDay,
          endDay: this.state.endDay,
          getDataStartDay: startDay.split('--')[0],
          getDataEndDay: endDay.split('--')[0],
        });
        document.getElementById('dateWeek').scrollLeft = 0;
      });
    });
  }
  right = () => {
    // console.log('右边')
    this.setState({
      rightCount: this.state.rightCount + 1,
    }, () => {
      let date = new Date();
      let startDay = this.format(new Date(new Date().setDate(new Date().getDate() + ((7 * this.state.rightCount) + 1))), 'yyyy-mm-dd'); // 设置天数 -7 天
      let endDay = this.format(new Date(new Date().setDate(new Date().getDate() + ((7 * this.state.rightCount) + 7))), 'yyyy-mm-dd'); // 设置今天天数 +7 天
      console.log('rightCount', startDay, endDay, this.state.rightCount)
      let arr2 = this.dateArr2(startDay, endDay)
      console.log(this.state.dateTwoWeeksArr.concat(arr2))
      let dateTwoWeeksArr = this.state.dateTwoWeeksArr.concat(arr2)
      this.setState({
        dateTwoWeeksArr,
        endDay: endDay.split('--')[0],
      }, () => {
        this.props.handleDays({
          startDay: this.state.startDay,
          endDay: this.state.endDay,
          getDataStartDay: startDay.split('--')[0],
          getDataEndDay: endDay.split('--')[0],
        });
        document.getElementById('dateWeek').scrollLeft += 500;
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
    document.querySelector("#currentDayAfter").scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'end',
    });
  }
  render() {
    const { dateTwoWeeksArr, currentDay, currentDayAfter } = this.state;
    const { minHeight, dateList, onEditClick, onWatchClick, onDeleteClick, handleModalVisible, account } = this.props;
    // console.log('res', dateTwoWeeksArr, dateList);
    return (
      <div id="scheduleBox">
        <Card title={
          <div className={styles.titleBox}>
            <div style={{ display: 'flex' }}>
              <div class="modalBox" style={{ marginRight: '29px' }}>
                <span class="leftSpan"></span>
                <span class="modalTitle">活动排期一览表</span>
              </div>
              <Button icon="plus" type="primary" style={{ width: '120px', display: !account.add ? 'none' : '' }}
                      onClick={() => handleModalVisible(true)}
              >
                新建
              </Button>
            </div>
            <div className={styles.iBox}>
              <i className={styles.endStatus}></i>活动已结束
              <i className={styles.ingStatus}></i>活动进行中
              <i className={styles.preStatus}></i>活动未开始
              <Button type="primary" style={{ marginLeft: '10px' }} onClick={() => this.backToday(true)}>
                返回今天
              </Button>
            </div>
          </div>
        } style={{ overflow: 'hidden'}} id="scheduleBox"
              bordered={false}
        >
          <div style={{ display: 'flex', maxWidth: '1160px',minWidth: '1160px', margin: '0 auto' }} className={styles.cardDiv}>
            <Card.Grid style={gridLeftStyle} onClick={() => this.left()}>
              {/*<span>加载更多</span>*/}
              <Icon type="left-circle-o" style={{ fontSize: '44px', color: '#849FFF' }}/>
            </Card.Grid>
            <div className={styles.dateWeekBox} style={{ height: minHeight }}>
              <div style={{ overflowX: 'scroll', display: 'flex', position: 'relative', zIndex: 3, maxWidth: '1040px', minWidth: '1040px', minHeight: minHeight, height: (50 * dateList.length + 90) + 'px' }}
                   id="dateWeek" className={styles.dateWeek}>
                {dateTwoWeeksArr.map((item) => {
                  return (
                    <Card.Grid value={item.id} key={item.id} className={currentDay === item.value ? styles.currentDay : styles.tableDiv}>
                      <a id={currentDayAfter === item.value ? 'currentDayAfter' : (currentDay === item.value ? 'today': '')}>
                        <p>{item.value}</p>
                        <p>{this.filterWeek(item.week)}</p>
                        <p className="pHeight"></p>
                      </a>
                    </Card.Grid>
                  );
                })}
                <div className={styles.dateList}>
                  {dateList.map((item) => {
                    return (
                      <div key={item.id}>
                        <Popover placement="top" content=
                          {
                            <div className={styles.iconBox}>
                              {/*{item.Time + '  '}*/}
                              <div className={styles.timeBox}>
                                <span>开始时间：{item.startTime}</span>
                                <span>结束时间：{item.endTime}</span>
                              </div>
                              <div className={styles.editBox}>
                                <div  onClick={() => onEditClick(item)}
                                      style={{ display: (moment(item.endTime) > new Date().getTime() && account.update)  ? '' : 'none' }} >
                                <div  onClick={() => onEditClick(item)} style={{ display: ((moment(item.endTime) < new Date().getTime()) || item.isDelete === 2) ? 'none' : '' }} >
                                  编辑
                                </div>
                                <div  onClick={() => onWatchClick(item)} style={{ display: !account.detail ? 'none' : ''}}>查看</div>
                              </div>
                            </div>
                          }
                                 title={
                                   <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                                     <span>活动名称: {item.name}</span>
                                     <div>
                                       <Popconfirm title="确定要删除吗" onConfirm={() => onDeleteClick(item)} okText="Yes" cancelText="No">
                                         <div className={styles.anticonDelete}
                                              style={{ display:
                                                  (moment(item.endTime) <= new Date().getTime() && account.delete) ? '' : ((moment(item.startTime) >= new Date().getTime() && account.delete) ? '' : 'none') }}>
                                           清除
                                         </div>
                                       </Popconfirm>
                                     </div>
                                   </div>
                                 } trigger="hover">
                            {/*<div style={{*/}

                            <div style={{
                                 // background: moment(item.endTime) < new Date().getTime()  ? 'rgba(242,242,242,1)' : (moment(item.startTime) > new Date().getTime() ? 'rgba(235,242,255,1)' : 'rgba(229,247,216,1)'),
                                 // color: moment(item.endTime) < new Date().getTime()  ? '#666666' : (moment(item.startTime) > new Date().getTime() ? '#5076FF' : '#48AB00'),
                                background: ((moment(item.endTime) < new Date().getTime()) || item.isDelete === 2 )  ? 'rgba(242,242,242,1)' : (moment(item.startTime) > new Date().getTime() ? 'rgba(235,242,255,1)' : 'rgba(229,247,216,1)'),
                                color: ((moment(item.endTime) < new Date().getTime()) || item.isDelete === 2 )  ? '#666666' : (moment(item.startTime) > new Date().getTime() ? '#5076FF' : '#48AB00'),
                                width: item.width, top: item.top, left: item.left, position: 'absolute', display: 'flex',
                                 justifyContent: 'space-between', zIndex: 999, height: '40px',alignItems: 'center', borderRadius: '0px 34px 34px 0px' }}>

                              <div style={{ paddingLeft: '10px' }}>{item.name}</div>
                            </div>
                        </Popover>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <Card.Grid style={gridStyleRight} onClick={() => this.right()}>
              {/*<span>加载更多</span>*/}
              <Icon type="right-circle-o" style={{ fontSize: '44px', color: '#849FFF' }}/>
            </Card.Grid>
          </div>
        </Card>
      </div>

    );
  }
}
export default ScheduleTable;
