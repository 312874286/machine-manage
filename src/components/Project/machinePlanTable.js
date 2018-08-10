import 'fullcalendar'
import 'fullcalendar-scheduler'
import {PureComponent} from "react";
import styles from './machinePlanTable.less'
import moment from 'moment'
import { Card } from 'antd';
import $ from 'jquery'
import {connect} from "dva";

class MachinePlanTable extends PureComponent {
  constructor(props) {
    super(props);
  }
  componentWillReceiveProps(nextProps) {
    const { resource, events, slotLabelFormat } = nextProps;
    console.log('resource, events', resource, events)
    if (resource.length > 0) {
      this.updateRenderDatas( resource, events, this, '', 'calendar' );
      console.log('resource', resource)
      // $('#calendar').fullCalendar(
      //   'removeResource',
      //   {title: '天津市天津市和平区鞍山道沿线大沽口', code: '123'}
      //   // scroll to the new resource?
      // );
      // removeResource
    }
    // $('#calendar').fullCalendar('render')
    // $('#calendar').remove()

    // $('#calendar').fullCalendar('gotoDate', '2018', '04')
    // $('#calendar').fullCalendar('incrementDate', -3, 2, -5)
  }
  componentDidMount() {
    // const { initData, clist } = this.props;
    const { resource, events, slotLabelFormat } = this.props;
    // console.log('resource, events2', resource, events)
    if (resource.length > 0) {

    }
  }
  updateRenderDatas = ( resource, events, self, slotLabelFormat, id) => {
    console.log('id', id, resource, events, self, slotLabelFormat)
    // const { resource, events } = self.props;
    $('#' + id).fullCalendar({
      resourceAreaWidth: 258,
      aspectRatio: 1.5,
      buttonText: {
        today: '今天',
      },
      // defaultDate: '2018-04-20',
      defaultView: 'timelineMonth',
      titleFormat: 'YYYY年MMMM月',
      // locale: 'zh-cn', // 语言
      eventLimit: true,
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
      // views: {
      //   timelineFourDays: {
      //     type: 'timeline',
      //     duration: { days: 4 }
      //   }
      // },
      views: {
        timelineTenDay: {
          type: 'timeline',
          start: '2018-08-06',
          end: '2018-08-09'
        }
      },
      resourceColumns: [
        {
          labelText: '商圈',
          field: 'title',
        },
        {
          labelText: '机器编号',
          field: 'code',
        }
      ],
      resourceRender: function(resource, cellEls) {
        console.log('resourceRender', resource, cellEls)
        cellEls.on('click', function() {
          if (confirm('Are you sure you want to delete ' + resource.title + '?')) {
            // $('#calendar').fullCalendar('removeResource', resource);
          }
        });
      },
      resources: [{code:"1809510071149", id:"1809510071149", title:"天津市天津市和平区鞍山道沿线大沽口"}],
      contentHeight: (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 100),
      events: function(start, end, timezone, callback) {
        var date = this.getDate().format('YYYY-MM-DD');
        console.log(start.format('YYYY-MM-DD'),end.format('YYYY-MM-DD'),timezone, callback, date)
        let startTime = start.format('YYYY-MM-DD')
        let endTime = end.format('YYYY-MM-DD')
        callback(events)
        self.props.handleTime({startTime, endTime});
      }
    });
  }
  test = () => {
    var moment1 = moment('2013-09-02');
    var moment2 = moment('2013-09-09');
    $('#calendar').fullCalendar.formatRange(moment1, moment2, 'MMMM D YYYY');
  }
  // style={{height: height, maxHeight: height, overflowY: 'hidden'}}
  render() {
    let height = (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 50)
    console.log('height', height)
    const {
      resource,
      events
    } = this.props;
    console.log(resource, events)
    // $('#calendarBox').append($('<div id="calendar"></div>'))


    // if (resource.length === 8) {
    //   this.updateRenderDatas(resource, events, this, '', 'calendar1' );
    // }
    // $('#calendar').fullCalendar('render')
    return (
      <div className={styles.fullCalendar} id="calendarBox">
        <div id="calendar"></div>
        {/*<div id="calendar1"></div>*/}
      </div>
    )
  }
}
export default MachinePlanTable;
