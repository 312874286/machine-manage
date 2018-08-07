import { Calendar, Badge } from 'antd';
import {PureComponent} from "react";
import styles from './machinePlanTable.less'


class MachinePlanTable extends PureComponent {
  getListData = (value) => {
    let listData;
    console.log('value.date()', value.format('YYYY-MM-DD'))
    switch (value.format('YYYY-MM-DD')) {
      case '2018-08-03':
        listData = [
          { type: 'warning', content: 'This is warning event.' },
        ]; break;
      case '2018-08-06':
        listData = [
          { type: 'warning', content: 'This is warning event.' },
        ]; break;
      case '2018-08-05':
        listData = [
          { type: 'warning', content: 'This is warning event' },
        ]; break;
      default:
    }
    return listData || [];
  }

  dateCellRender = (value) => {
    const listData = this.getListData(value);
    return (
      <ul className="events">
        {
          listData.map(item => (
            <li key={item.content}>
              <Badge status={item.type} text={item.content} />
            </li>
          ))
        }
      </ul>
    );
  }

  getMonthData = (value) => {
    if (value.month() === 8) {
      return 1394;
    }
  }

  monthCellRender = (value) => {
    const num = this.getMonthData(value);
    return num ? (
      <div className={styles.notesMonth}>
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  }
  render() {
    return (
      <div className={styles.fullCalendar}>
        <Calendar dateCellRender={this.dateCellRender} monthCellRender={this.monthCellRender} />
      </div>
    )
  }
}
export default MachinePlanTable;
