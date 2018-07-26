import React, { Component } from "react";

import { Table, Input, Button, Popconfirm, Form, Select } from 'antd';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const { Option } = Select;

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component {
  state = {
    editing: false,
  }

  componentDidMount() {
    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        // console.log('editing::', editing);
        this.input.focus();
      }
    });
  }

  handleClickOutside = (e) => {
    const { editing } = this.state;
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
  }

  save = () => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  }

  render() {
    const { editing } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      ...restProps
    } = this.props;
    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return (
                editing ? (
                  <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                      rules: [{
                        required: true,
                        message: `${title} is required.`,
                      }],
                      initialValue: record[dataIndex],
                    })(
                      <Input
                        ref={node => (this.input = node)}
                        onPressEnter={this.save}
                      />
                    )}
                  </FormItem>
                ) : (
                  <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    onClick={this.toggleEdit}
                  >
                    {restProps.children}
                  </div>
                )
              );
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    );
  }
}

class GoodsTableField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count:0,
      clist: [],
      rlist: [],
      currentValue: '',
      initData: [],
    };
  }
  componentWillReceiveProps(nextProps) {
    const {initData, clist, count} = nextProps;
    console.log('initData, clist, count', initData, clist, count)
    // if (clist.length > 0) {
    this.updateRenderDatas(initData, clist, count);
    // }
  }
  componentDidMount() {
    const { initData, clist } = this.props;
  }
  handleChangeName = (record, value) => {
    console.log('record', record)
    record.prizeId = value;
    // record.name = record.name
    this.props.goodsHandle(this.props.initData);
  }
  handleChangeRule = (record, value) => {
    record.resultCode = value;
  }
  handleDelete = (key) => {
    this.props.goodsHandleDelete(key);
  }

  handleAdd = () => {
    this.props.goodsHandleAdd(this.state.initData, this.state.currentValue, this.props.count);
  }

  handleSave = (row) => {
    console.log('row', row)
    this.props.goodsHandleChange(row);
  }
  updateRenderDatas(initData, clist, count) {
    this.setState({
      clist,
    }, () => {
      console.log('clist', this.state.clist)
      if(this.state.clist.length === 0 ) {
        this.setState({
          currentValue: '',
        });
      } else {
        this.setState({
          currentValue: clist[0].id,
        });
      }
    });
    let rlist = [];
    for (let i = 1; i <= 10; i++) {
      let newobj = {
        id: i.toString(),
        name: i.toString(),
      }
      rlist.push(newobj);
    }
    this.state.rlist = rlist;

    // if (this.props.initData.length !== 0) {
    //   this.setState({
    //     initData,
    //   });
    // }
    if (initData.length !== 0) {
      this.setState({
        initData,
      });
    } else {
      this.setState({
        initData: [],
      });
    }
    this.setState({
      count: count,
    });
  }
  render() {
    const { count } = this.props;
    const { clist, rlist, initData } = this.state
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    console.log('initData', initData)
    this.columns = [{
      title: '*商品名称',
      // dataIndex: 'name',
      render: (text, record) => {
        return (
          <Select onChange={this.handleChangeName.bind(this, record)} defaultValue={record.name}>
            {/*{children}*/}
            {clist.map((item) => {
              return (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              );
            })}
          </Select>
        );
      },
    }, {
      title: '*规则',
      dataIndex: 'resultCode',
      render: (text, record) => {
        return (
          <Select defaultValue={record.resultCode} onChange={this.handleChangeRule.bind(this,record)}>
            {/*{children2}*/}
            {rlist.map((item) => {
              return (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              );
            })}
          </Select>

        );
      },
    }, {
      title: '*规则描述',
      dataIndex: 'resultRemark',
      editable: true,
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        return (
          <Popconfirm title="是否删除?" onConfirm={() => this.handleDelete(record.key)}>
            <a>删除</a>
          </Popconfirm>
        );
      },
    }];
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });

    return (
      <div>
        <Button icon="plus" onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          添加
        </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          dataSource={initData}
          columns={columns}
          pagination={false}
          rowKey={record => record.key}
        />
      </div>
    );
  }
}
export default GoodsTableField;
