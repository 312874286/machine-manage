import React from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Button, message } from 'antd';
import styles from './batchAisleSetting.less';
const columns = [
  {
    title: '货道号',
    dataIndex: 'code',
    width: '12%',
    editable: false,
    render: (text, item) => (
      <div>货道: {item.code}</div>
    )
  },
  {
    title: '数量',
    dataIndex: 'goodsCount',
    width: '12%',
    editable: true,
    render: (text, item) => (
      <div>数量: {item.volumeCount}</div>
    )
  },
];
const types = ['', '大弹簧货道', '小弹簧货道', '履带货道']
class BatchAisleSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editingKey: '', form: '' };
  }
  state = {
    selectedRowKeys: [],
    totalCallNo: 0,
  };
  componentWillReceiveProps(nextProps) {
  }
  componentDidMount() {
    const data = this.props.AisleList;
    this.setState({
      data,
    })
  }
  getAisleLists = (detailList) => {
    const { rowNo, count, volumeCount } = detailList
    let arr = []
    for (let i = 1; i <= count; i++) {
      let tmp = {
        code: parseInt((rowNo - 1).toString() + i.toString()),
        volumeCount,
      }
      arr.push(tmp)
    }
    return arr
  }
  render() {
    const { AisleList } = this.props
    return (
      <div className={styles.editTable}>
        {AisleList.map((item) => {
          return (
            <div>
              <span>{types[item.type]}</span>
              <Table
                rowKey={i => i.code}
                dataSource={this.getAisleLists(item)}
                columns={columns}
                rowClassName="editable-row"
                pagination={false}
              />
            </div>
          );
        })}
      </div>
    );
  }
}
export default BatchAisleSetting;

