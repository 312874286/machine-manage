import 'fullcalendar'
import {PureComponent} from "react";
import styles from './machinePlanTable.less'
import moment from 'moment'
import $ from 'jquery'

class MachinePlanTable extends PureComponent {
  componentDidMount () {
    $('#calendar').fullCalendar({
      buttonText: {
        today: '今天',
      },
      allDayText: "全天",
      timeFormat: {
        '': 'H:mm{-H:mm}'
      },
      // weekMode: "variable",
      titleFormat: {
        month: 'yyyy',                             // September 2009
      },
      monthNames: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      dayNames: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
      dayNamesShort: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
      header: {
        left: 'prev,next',
        center: 'title',
        right: 'today'
      },
      defaultDate: '2018-07-12',
      events: [
        {
          start: '2018-07-24',
          end: '2018-07-28',
          overlap: false,
          rendering: 'background',
          color: '#ff9f89'
        },
        {
          start: '2018-07-06',
          end: '2018-07-08',
          overlap: false,
          rendering: 'background',
          color: '#ff9f89'
        }
      ]
    });
  }
  render() {
    return (
      <div className={styles.fullCalendar}>
        <div id="calendar"></div>
      </div>
    )
  }
}
export default MachinePlanTable;
