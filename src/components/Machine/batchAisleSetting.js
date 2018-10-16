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
      (item.code) ? ((item.isDelete === 0) ? (
        <div style={{background: '#e5f7d8'}}>货道: {item.code}</div>
      ) : (
        <div style={{background: '#ffe8e4'}}>货道: {item.code}</div>
      )) : (<span />)
    )
  },
  {
    title: '数量',
    dataIndex: 'goodsCount',
    width: '12%',
    editable: true,
    render: (text, item) => (
      (item.code) ? ((item.isDelete === 0) ? (
        <div style={{background: '#e5f7d8'}}>数量: {item.goodsCount}/{item.volumeCount}</div>
      ) : (
        <div style={{background: '#ffe8e4'}}>数量: {item.goodsCount}/{item.volumeCount}</div>
      )) : (<span />)
    )
  },
];
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
    const { editingKey, selectedRowKeys } = this.state;
    const { AisleList } = this.props
    const r = AisleList[AisleList.length - 1].rowNo - 1
    console.log('r', r)
    let trLists = []
    for (let i = 0; i < AisleList.length; i++) {
      trLists = [...trLists, ...this.getAisleLists(AisleList[i])]
    }
    console.log('trLists', trLists)
    return (
      <div className={styles.editTable}>
        <Table
          // bordered
          rowKey={i => i.code}
          dataSource={trLists}
          columns={columns}
          rowClassName="editable-row"
          pagination={false}
        />
      </div>
    );
  }
}
export default BatchAisleSetting;

