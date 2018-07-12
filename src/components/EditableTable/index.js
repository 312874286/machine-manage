import React from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Button } from 'antd';

const data = [];
for (let i = 0; i < 5; i++) {
  data.push({
    key: i.toString(),
    // name: `Edrward ${i}`,
    // age: 32,
    // address: `London Park no. ${i}`,
    code: i.toString(),
    goodName: `Edrward ${i}`,
    price: 32,
    goodsCount: 8,
    volumeCount: 10,
    address1: '无',
    address2: '-',
    volumeStatus: '已启用',
  });
}
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
    this.state = { data, editingKey: '', form: '' };
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
        dataIndex: 'price',
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
        dataIndex: 'address1',
        width: '12%',
        editable: false,
      },
      {
        title: '故障原因',
        dataIndex: 'address2',
        width: '12%',
        editable: false,
      },
      {
        title: '货道状态',
        dataIndex: 'volumeStatus',
        width: '12%',
        editable: false,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div>
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
                  <Popconfirm
                    title="是否确认停用?"
                    onConfirm={() => this.cancel(record.key)}>
                    <a>停用</a>
                  </Popconfirm>
                </span>
            </div>
          );
        },
      },
    ];
  }

  isEditing = (record) => {
    return record.key === this.state.editingKey;
  };

  edit(form, key) {
    this.setState({ form, editingKey: key });
  }

  save(key) {
    const { form } = this.state
    console.log('form', form)
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        console.log('newData', newData)
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(data);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  render() {
    const { editingKey } = this.state;
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

    return (
      <div>
        <Table
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
        />
        {editingKey ? (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', flexDirection: 'row' }}>
            <Button type="Default">取消</Button>
            <Button type="primary" style={{ marginLeft: '10px'}} onClick={() => this.save(editingKey)}>确定</Button>
          </div>
        ) : ( <div></div> )}
      </div>
    );
  }
}
export default EditableTable;
