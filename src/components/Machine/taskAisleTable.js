import React from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Button, message } from 'antd';
import styles from './taskAisleTable.less';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = (volumeCount, goodsCount) => {
    console.log('volumeCount', volumeCount)
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return (
      <Input/>
    )

  };

  render() {
    const {
      editing,
      save,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <div style={{ display: 'flex', padding: '0px 0 0 8px', background: record.isDelete === 0 ? '#e5f7d8' : '#ffe8e4', flexDirection: 'row', flexWrap: 'wrap' }}>
                  <FormItem style={{ margin: 0, padding: '0' }} label="数量">
                    {getFieldDecorator(dataIndex, {
                      rules: [{
                        required: true,
                        message: `必填!`,
                      }],
                      initialValue: record[dataIndex],
                    })(
                      this.getInput(record.volumeCount, record.goodsCount)
                    )}
                  </FormItem>
                  <FormItem style={{ margin: 0, padding: '0' }}>
                    {getFieldDecorator('volumeCount')(
                      <span>/{record.volumeCount}</span>
                    )}
                  </FormItem>
                  <FormItem style={{ margin: '0px 10px 0 0', padding: '0', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', width: '100%' }}>
                    <Button type="primary" style={{ marginLeft: '10px'}} onClick={() => save(record.key)}>确定</Button>
                  </FormItem>
                </div>

              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

class TaskAisleTable extends React.Component {
  // rgb(229, 247, 216)
  constructor(props) {
    super(props);
    this.state = { editingKey: '', form: '' };
    this.columns = [
      {
        title: '货道号',
        dataIndex: 'code',
        width: '12%',
        editable: false,
        render: (text, item) => (
          (item.code) ? ((item.isSelected === 1 &&  item.code <= 28) ? (
            <div style={{ background: '#ffe8e4', height: '122px', cursor: 'pointer' }} onClick={() => this.selectCode(item, 'cancel')}>货道: {item.code}</div>
          ) : (
            (item.code > this.state.selectedNo) ? (
              (
                item.code > 46 &&  item.code <= 48
              ) ? (
                 null
              ) : (
                <div style={{ background: 'rgb(229, 247, 216, 0.4)', height: '122px' }}>货道: {item.code}</div>
              )
            ) : (
              <div style={{ background: '#e5f7d8', height: '122px', cursor: 'pointer' }}  onClick={() => this.selectCode(item, 'confirm')}>货道: {item.code}</div>
            )
          )) : (<span />)
        )
      },
    ];
  }
  state = {
    selectedRowKeys: [],
    totalCallNo: 0,
    AisleList: [],
    selectedNo: 28,
  };
  isEditing = (record) => {
    return record.key === this.state.editingKey;
  };

  componentWillReceiveProps(nextProps) {
    const { AisleList, selectedNo } = nextProps;
    this.setState({
      AisleList,
      selectedNo
    })
  }
  selectCode = (item, flag) => {
    const { AisleList } = this.props
    if (item.value % 2 !== 0) {
      if (flag === 'cancel') {
        item.isSelected = 0
        AisleList[item.key + 1].isSelected = 0
      } else {
        item.isSelected = 1
        AisleList[item.key + 1].isSelected = 1
      }
    } else {
      message.config({
        top: 100,
        duration: 2,
        maxCount: 1,
      });
      message.error('请点击奇数货道号')
    }
    this.props.HandleAisle(AisleList)
  }
  componentDidMount() {
    const data = this.props.AisleList;
    this.setState({
      data,
    })
  }
  edit(form, key) {
    this.setState({ form, editingKey: key });
  }

  save(key) {
    // console.log('form', key)
    const { form } = this.state
    // console.log('form', form)
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.props.AisleList];
      const index = newData.findIndex(item => key === item.key);
      // console.log('index', index,newData[index])
      if (index > -1) {
        const item = newData[index];
        // newData.splice(index, 1, {
        //   ...item,
        //   ...row,
        // });
        // console.log('newData', newData)
        this.setState({ data: newData, editingKey: '' });
        if (row.goodsCount > newData[index].volumeCount) {
          message.error('补货数量超出货道容量，请修改');
          return false
        } else {
          this.props.updateGoodsCount([{ channelId: key, count: row.goodsCount }]);
        }
        // console.log('nu', item, key, row)
      } else {
        newData.push(data);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const totalCallNo = selectedRows.reduce((sum, val) => {
      return sum + parseFloat(val.callNo, 10);
    }, 0);

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, totalCallNo });
  }

  render() {
    const { editingKey, selectedRowKeys } = this.state;
    const { AisleList } = this.props
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
          save: () => this.save(record.key)
        }),
      };
    });
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    // console.log('selectedRowKeys',selectedRowKeys)
    return (
      <div className={styles.taskAsileTable}>
        {/*<div>*/}
          {/*<div>弹簧货道： 货道1~8 11~18 21~28 皮带货道： 31~38 41~47</div>*/}
          {/*<div><i className={styles.startStatus}></i>启动状态 <i className={styles.stopStatus}></i>停用状态</div>*/}
        {/*</div>*/}
        { selectedRowKeys ? ( selectedRowKeys.length > 0 ? (
          <div className={styles.BtnDiv}>
            <Button type="primary" onClick={() => {this.stopAisle()}}>停用货道</Button>
            <Button type="primary" className={styles.rightBtn} onClick={() => {this.startAisle()}}>启用货道</Button>
          </div>) : (<div/>)) : ( <div/>)}
        <Table
          components={components}
          // bordered
          dataSource={AisleList}
          columns={columns}
          rowClassName="editable-row"
          // rowSelection={rowSelection}
          pagination={false}
        />
      </div>
    );
  }
}
export default TaskAisleTable;

