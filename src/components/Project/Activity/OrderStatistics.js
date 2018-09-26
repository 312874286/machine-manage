import React, { PureComponent } from 'react';
import { Table, Modal, Divider, Tag  } from 'antd';
import styles from './OrderStatistics.less';

export default class OrderStatistics extends PureComponent {
  state = {
    list: [],
    columnsList: [],
    data: []
  };

  componentDidMount = () => {
    this.setState({
      list: JSON.parse('[{"machineCode":"18342471","point":"点位","data":[{"date":"2018-09-25","pv":10,"uv":9,"order":9,"shipment":9,"fans":20},{"date":"2018-09-26","pv":100,"uv":99,"order":99,"shipment":99,"fans":200}]},{"machineCode":"18342472","point":"点位","data":[{"date":"2018-09-25","pv":10,"uv":9,"order":9,"shipment":9,"fans":20},{"date":"2018-09-26","pv":100,"uv":99,"order":99,"shipment":99,"fans":200}]}]')
    },() => {
      this.renderColums()
      this.renderData()
    })
  }

  componentWillUpdate = (next) => {
    console.log(next);
  }

  renderColums = () => {
    const dateList = [];
    const columnsList = [];
    this.state.list.forEach((item) => {
      item.data.forEach((date) => {
        if(dateList.indexOf(date.date) === -1){
          dateList.push(date.date);
          columnsList.push({
            title: date.date,
            width: 400,
            render: (text, record, index) => {
              return <div>
                pv:{record[`pv${date.date}`]} |
                uv:{record[`uv${date.date}`]} |
                order:{record[`order${date.date}`]} |
                shipment:{record[`shipment${date.date}`]} |
                fans:{record[`fans${date.date}`]}
                </div>
            }
          })
        }
      })
    })
    this.setState({
      columnsList
    })
  }

  renderData = () => {
    const { list } = this.state;
    const data = [];

    list.forEach((item, i) => {
      const obj = {
        machineCode: item.machineCode,
        point: item.point,
        id: `${i}${parseInt(Math.random() * 100000)}`,
        total: {
          pv: 0,
          uv: 0,
          order: 0,
          shipment: 0,
          fans: 0,
        },
      }
      item.data.forEach((date, k) => {
        // obj['date'] = date.date,
        obj[`pv${date.date}`] = date.pv;
        obj[`uv${date.date}`] = date.uv;
        obj[`order${date.date}`] = date.order;
        obj[`shipment${date.date}`] = date.shipment;
        obj[`fans${date.date}`] = date.fans;
        obj.total.pv += date.pv;
        obj.total.uv += date.uv;
        obj.total.order += date.order;
        obj.total.shipment += date.shipment;
        obj.total.fans += date.fans;
      })
      data.push(obj);
    })

    console.log('data', data);
    this.setState({
      data
    })
  }



  render() {

    const { columnsList, data } = this.state;

    const columns = [{
      title: '点位',
      dataIndex: 'machineCode',
      width: 200,
      render: (text, record, index) => {
        return <div>{record.point}({record.machineCode})</div>
      },
    },
    ...columnsList,
    {
      title: '合计',
      dataIndex: 'total',
      width: 400,
      fixed: 'right',
      render: (text, record) => {
        return <div>
                pv:{record.total.pv} |
                uv:{record.total.uv} |
                order:{record.total.order} |
                shipment:{record.total.shipment} |
                fans:{record.total.fans}
                </div>
      }
    }];

    return (
      <div>
        <Table
          columns={columns}
          rowKey={record => record.id}
          dataSource={data}
          pagination={false}
          scroll={{x: data.length * 400 + 600}}
        />
      </div>
    );
  }
}

