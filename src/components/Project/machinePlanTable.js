import 'fullcalendar'
import 'fullcalendar-scheduler'
import {PureComponent} from "react";
import styles from './machinePlanTable.less'
import moment from 'moment'
import { Card } from 'antd';
import $ from 'jquery'

class MachinePlanTable extends PureComponent {
  constructor(props) {
    super(props);
  }
  componentWillReceiveProps(nextProps) {
    const { resource, events } = nextProps;
    console.log('resource, events', resource, events)
    if (resource.length > 0) {
      this.updateRenderDatas( resource, events );
    }
  }
  componentDidMount() {
    // const { initData, clist } = this.props;
  }
  updateRenderDatas = (resource, events) => {
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
          field: 'code'
        }
      ],
      resources: resource,
      events: events
    });
  }
  // style={{height: height, maxHeight: height, overflowY: 'hidden'}}
  render() {
    const height = (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 50)
    const {
      resource,
      events
    } = this.props;
    return (
      <div className={styles.fullCalendar} >
        <div id="calendar"></div>
      </div>
    )
  }
}
export default MachinePlanTable;
