import 'fullcalendar'
import 'fullcalendar-scheduler'
import {PureComponent} from "react";
import styles from './machinePlanTable.less'
import moment from 'moment'
import { Card } from 'antd';
import $ from 'jquery'

class MachinePlanTable extends PureComponent {
  componentDidMount () {
     $('#calendar').fullCalendar({
       resourceAreaWidth: 230,
       aspectRatio: 1.5,
       buttonText: {
         today: '今天',
       },
       defaultView: 'timelineMonth',
       titleFormat: 'YYYY年MMMM月',
       slotLabelFormat: [
         'YYYY.MMMM',
         'D'
       ],
       scrollTime: '00:00',
       monthNames: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
       dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
       header: {
          left: 'prev,next',
          center: 'title',
          right: 'today'
        },
       resourceColumns: [
         {
           labelText: '商圈',
           field: 'title'
         },
         {
           labelText: '机器编号',
           field: 'occupancy'
         }
       ],
       resources: [
         { id: 'a', title: '王府井A', occupancy: 40 },
         { id: 'b', title: '王府井B', occupancy: 60 },
         { id: 'c', title: 'Auditorium C', occupancy: 40 },
         { id: 'd', title: 'Auditorium D', occupancy: 40 },
         { id: 'e', title: 'Auditorium E', occupancy: 60 },
         { id: 'f', title: 'Auditorium F', occupancy: 60 },
         { id: 'g', title: 'Auditorium G', occupancy: 60 },
         { id: 'h', title: 'Auditorium H', occupancy: 40 },
         { id: 'i', title: 'Auditorium I', occupancy: 70 },
         { id: 'j', title: 'Auditorium J', occupancy: 70 },
         { id: 'k', title: 'Auditorium K', occupancy: 70 },
         { id: 'l', title: 'Auditorium L', occupancy: 75 },
         { id: 'm', title: 'Auditorium M', occupancy: 40 },
         { id: 'n', title: 'Auditorium N', occupancy: 40 },
         { id: 'o', title: 'Auditorium O', occupancy: 40 },
         { id: 'p', title: 'Auditorium P', occupancy: 40 },
         { id: 'q', title: 'Auditorium Q', occupancy: 40 },
         { id: 'r', title: 'Auditorium R', occupancy: 40 },
         { id: 's', title: 'Auditorium S', occupancy: 40 },
         { id: 't', title: 'Auditorium T', occupancy: 40 },
         { id: 'u', title: 'Auditorium U', occupancy: 40 },
         { id: 'v', title: 'Auditorium V', occupancy: 40 },
         { id: 'w', title: 'Auditorium W', occupancy: 40 },
         { id: 'x', title: 'Auditorium X', occupancy: 40 },
         { id: 'y', title: 'Auditorium Y', occupancy: 40 },
         { id: 'z', title: 'Auditorium Z', occupancy: 40 }
       ],
        events: [
          {"resourceId":"a","title":"","start":"2018-08-01","end":"2018-08-04",rendering: 'background',color: 'red'},
          {"resourceId":"b","title":"","start":"2018-08-08","end":"2018-08-10",rendering: 'background',color: 'Green'},
          {"resourceId":"c","title":"","start":"2018-08-09",rendering: 'background',color: 'Grey'},
          {"resourceId":"a","title":"","start":"2018-08-16",rendering: 'background',color: 'red'},
          {"resourceId":"b","title":"","start":"2018-08-06","end":"2018-08-08",rendering: 'background',color: 'Green'},
          {"resourceId":"c","title":"","start":"2018-08-07","end":"2018-08-07",rendering: 'background',color: 'Grey'},
          {"resourceId":"a","title":"","start":"2018-08-07",rendering: 'background',color: 'red'},
          {"resourceId":"b","title":"","start":"2018-08-10",rendering: 'background',color: 'Green'}]
     });
  }
  // style={{height: height, maxHeight: height, overflowY: 'hidden'}}
  render() {
    const height = (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 50)
    return (
      <div className={styles.fullCalendar} >
        <div id="calendar"></div>
      </div>
    )
  }
}
export default MachinePlanTable;
