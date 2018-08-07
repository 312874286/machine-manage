import 'fullcalendar'
import {PureComponent} from "react";
import styles from './machinePlanTable.less'
import moment from 'moment'
import $ from 'jquery'

class MachinePlanTable extends PureComponent {
  componentDidMount () {
    $('#calendar').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek'
      },
      defaultDate: '2018-07-12',
      events: [
        {
          start: '2018-07-11T10:00:00',
          end: '2018-07-11T16:00:00',
          rendering: 'background'
        },
        {
          start: '2018-07-13T10:00:00',
          end: '2018-07-13T16:00:00',
          rendering: 'background'
        },
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
