import React from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Button, message, Popover } from 'antd';
import styles from './index.less';

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

class MachineAisleTable extends React.Component {
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
          (item.code) ? ((item.isDelete === 0) ? (
            <div style={{background: '#e5f7d8'}}>货道: {item.code}</div>
            ) : (
              <div style={{background: '#ffe8e4'}}>货道: {item.code}</div>
            )) : (<span />)
        )
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        width: '15%',
        editable: false,
        className: 'textOverflow',
        render: (text, item) => (
          (item.code) ? ((item.isDelete === 0) ? (
            <div style={{background: '#e5f7d8'}}>商品:
              <Popover
                placement="topLeft"
                content={item.goodsName}
                trigger="hover">
                {item.goodsName}
              </Popover>
            </div>
          ) : (
            <div style={{background: '#ffe8e4'}}>商品:
              <Popover
                placement="topLeft"
                content={item.goodsName}
                trigger="hover">
                {item.goodsName}
              </Popover>
            </div>
          )) : (<span />)
        )
      },
      {
        title: '价格',
        dataIndex: 'goodsPrice',
        width: '10%',
        editable: false,
        render: (text, item) => (
          (item.code) ? ((item.isDelete === 0) ? (
            <div style={{background: '#e5f7d8'}}>价格: {item.goodsPrice}</div>
          ) : (
            <div style={{background: '#ffe8e4'}}>价格: {item.goodsPrice}</div>
          )) : (<span />)
        )
      },
      {
        title: '数量',
        dataIndex: 'goodsCount',
        width: '12%',
        editable: true,
        // render: (text, item) => (
        //   (item.volumeCount) ? (
        //     <span>{item.goodsCount}/{item.volumeCount}</span>
        //   ) : (<span />)
        // )
        render: (text, item) => (
          (item.code) ? ((item.isDelete === 0) ? (
            <div style={{background: '#e5f7d8'}}>数量: {item.goodsCount}/{item.volumeCount}</div>
          ) : (
            <div style={{background: '#ffe8e4'}}>数量: {item.goodsCount}/{item.volumeCount}</div>
          )) : (<span />)
        )
      },
      // {
      //   title: '货道容量',
      //   dataIndex: 'volumeCount',
      //   width: '12%',
      //   editable: false,
      // },
      // {
      //   title: '货道状态',
      //   dataIndex: 'isDelete',
      //   width: '15%',
      //   editable: false,
      //   render(val) {
      //     if (val === 0) {
      //       return <span>启用</span>
      //     } else {
      //       return <span>停用</span>
      //     }
      //   }
      // },
      {
        title: '操作',
        dataIndex: 'operation',
        className: 'operation',
        width: '12%',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return ((record.code) ? ( <div style={{ padding: 0}}>
              {record.isDelete === 0 ? (
                <div className={styles.isDelete0}>
                    <EditableContext.Consumer>
                      {form => (
                        <a
                          href="javascript:;"
                          onClick={() => this.edit(form, record.key)}
                          style={{ marginRight: 8 }}
                          className={styles.start}
                        >
                          补货
                        </a>
                      )}
                    </EditableContext.Consumer>
                    <Popconfirm title="是否确认停用?" onConfirm={() => this.stopAisle(record.key)}>
                      <a className={styles.stop} >停用</a>
                    </Popconfirm>
                  </div>
              ) : (
                <div className={styles.isDelete1}>
                     <EditableContext.Consumer>
                      {form => (
                        <a
                          href="javascript:;"
                          onClick={() => this.edit(form, record.key)}
                          style={{ marginRight: 8 }}
                          className={styles.start}
                        >
                          补货
                        </a>
                      )}
                    </EditableContext.Consumer>
                    <Popconfirm title="是否确认启用?" onConfirm={() => this.startAisle(record.key)}>
                      <a className={styles.start}>启用</a>
                    </Popconfirm>
                  </div>
              )}
            </div>) : (
             <div/>
          )

          );
        },
      },
    ];
  }
  state = {
    selectedRowKeys: [],
    totalCallNo: 0,
  };
  isEditing = (record) => {
    return record.key === this.state.editingKey;
  };

  componentWillReceiveProps(nextProps) {
    // const { message } = nextProps;
    // if (message) {
    //   console.log('componentWillReceiveProps', message)
    // }
    // const message1 = this.props.message;
    // if (message1) {
    //   console.log('componentWillReceiveProps1', message1)
    // }
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

  closeAisleForm = () => {
    this.props.handleClose('close');
  }

  stopAisle = (key) => {
    const self = this
    let arr = []
    if (key) {
      arr = [{ channelId: key, status: 1 }]
    } else {
      arr = self.state.selectedRowKeys.map((item) => {
        return { channelId: item, status: 1 }
      });
    }
    console.log(arr)
    this.props.handleStop(arr);
    this.setState({
      selectedRowKeys: [],
    });
  }

  startAisle = (key) => {
    const self = this
    let arr = []
    if (key) {
      arr = [{ channelId: key, status: 0 }]
    } else {
      // console.log('启用', this.state.selectedRowKeys);
      arr = self.state.selectedRowKeys.map((item) => {
        return { channelId: item, status: 0 }
      });
    }
    this.props.handleStart(arr);
    this.setState({
      selectedRowKeys: [],
    });
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
      <div id="editTable" className={styles.editTable}>
        <div>
          <div>弹簧货道： 货道1~8 11~18 21~28 皮带货道： 31~38 41~47</div>
          <div><i className={styles.startStatus}></i>启动状态 <i className={styles.stopStatus}></i>停用状态</div>
        </div>
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
        {/*{editingKey ? (*/}
          {/*<div style={{ display: 'flex', justifyContent: 'center', width: '100%', flexDirection: 'row' }}>*/}
            {/*<Button type="Default" onClick={this.closeAisleForm}>取消</Button>*/}
            {/*<Button type="primary" style={{ marginLeft: '10px'}} onClick={() => this.save(AisleList, editingKey)}>确定</Button>*/}
          {/*</div>*/}
        {/*) : ( <div /> )}*/}
      </div>
    );
  }
}
export default MachineAisleTable;

