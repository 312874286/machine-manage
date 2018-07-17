import React from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Button } from 'antd';
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
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  render() {
    const {
      editing,
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
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `Please Input ${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editingKey: '', form: '' };
    this.columns = [
      {
        title: '货道号',
        dataIndex: 'code',
        width: '12%',
        editable: false,
      },
      {
        title: '商品名称',
        dataIndex: 'goodName',
        width: '12%',
        editable: false,
      },
      {
        title: '价格',
        dataIndex: 'goodsPrice',
        width: '7%',
        editable: false,
      },
      {
        title: '现存数量',
        dataIndex: 'goodsCount',
        width: '12%',
        editable: true,
      },
      {
        title: '货道容量',
        dataIndex: 'volumeCount',
        width: '12%',
        editable: false,
      },
      {
        title: '货道故障',
        dataIndex: 'workStatus',
        width: '12%',
        editable: false,
      },
      {
        title: '故障原因',
        dataIndex: 'reason',
        width: '12%',
        editable: false,
      },
      {
        title: '货道状态',
        dataIndex: 'isDelete',
        width: '12%',
        editable: false,
        render(val) {
          if (val === 0) {
            return <span>启用</span>
          } else {
            return <span>停用</span>
          }
        }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div>
                {record.isDelete === 0 ? (
                  <span>
                    <EditableContext.Consumer>
                      {form => (
                        <a
                         href="javascript:;"
                         onClick={() => this.edit(form, record.key)}
                         style={{ marginRight: 8 }}
                       >
                         补货
                       </a>
                    )}
                    </EditableContext.Consumer>
                    <Popconfirm title="是否确认停用?" onConfirm={() => this.stopAisle(record.key)}>
                      <a>停用</a>
                    </Popconfirm>
                  </span>
                ) : (
                  <span>
                     <EditableContext.Consumer>
                      {form => (
                        <a
                          href="javascript:;"
                          onClick={() => this.edit(form, record.key)}
                          style={{ marginRight: 8 }}
                        >
                          补货
                        </a>
                      )}
                    </EditableContext.Consumer>
                    <Popconfirm title="是否确认启用?" onConfirm={() => this.startAisle(record.key)}>
                      <a>启用</a>
                    </Popconfirm>
                  </span>
                )}
            </div>
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

  save(AisleList, key) {
    const { form } = this.state
    console.log('form', form)
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...AisleList];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        // newData.splice(index, 1, {
        //   ...item,
        //   ...row,
        // });
        // console.log('newData', newData)
        this.setState({ data: newData, editingKey: '' });
        // console.log('nu', item, key, row)
        this.props.updateGoodsCount([{ channelId: key, count: row.goodsCount }]);
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
    return (
      <div id="editTable">
        <Table
          components={components}
          bordered
          dataSource={AisleList}
          columns={columns}
          rowClassName="editable-row"
          rowSelection={rowSelection}
        />
        <div className={styles.BtnDiv}>
          <Button type="primary" onClick={() => {this.stopAisle()}}>停用货道</Button>
          <Button type="primary" onClick={() => {this.startAisle()}}>启用货道</Button>
        </div>
        {editingKey ? (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', flexDirection: 'row' }}>
            <Button type="Default" onClick={this.closeAisleForm}>取消</Button>
            <Button type="primary" style={{ marginLeft: '10px'}} onClick={() => this.save(AisleList, editingKey)}>确定</Button>
          </div>
        ) : ( <div /> )}
      </div>
    );
  }
}
export default EditableTable;

