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
      dataSource: [],
      count:0,
      clist: [],
      rlist: [],
      currentValue: '',
    };

    // this.updateRenderDatas();
  }
  handleChangeName = (record, value) => {
    record.prizeId = value;
    // console.log('name::', this.state.dataSource);
    this.props.goodsHandle(this.state.dataSource);
  }
  handleChangeRule = (record, value) => {
    record.resultCode = value;
    // console.log('rule::', this.state.dataSource);
  }
  handleDelete = (key) => {
    // const dataSource = [...this.state.dataSource];
    // this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
    this.props.goodsHandleDelete(key);
  }

  handleAdd = () => {
    // const { count, dataSource } = this.state;
    // console.log('11::',count, dataSource);
    // const newData = {
    //   key: count,
    //   prizeId: this.state.currentValue,
    //   resultCode: '1',
    //   resultRemark: '当游戏得分超过90，掉落此商品',
    //   prizeType: '1',
    // };
    // this.setState({
    //   dataSource: [...dataSource, newData],
    //   count: count + 1,
    // },() => {
    //   console.log(this.state.dataSource, this.state.count);
    // });

    this.props.goodsHandleAdd(this.state.dataSource, this.state.currentValue, this.props.count);

  }

  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  }
  updateRenderDatas() {
    this.state.clist = this.props.clist;
    // console.log(111, this.props.count);
    // console.log('this.state.clist', this.state.clist)
    if(this.state.clist.length === 0 ) {
      this.state.currentValue = '';
    } else {
      this.state.currentValue = this.props.clist[0].id;
    }

    // console.log( this.state.currentValue );
    let rlist = [];
    for (let i = 1; i <= 10; i++) {
      let newobj = {
        id: i.toString(),
        name: i.toString(),
      }
      rlist.push(newobj);
    }
    this.state.rlist = rlist;

    const children = [];
    let defaultValue = '';

    const children2 = [];
    let defaultValue2 = '';

    // console.log('this.props.initData', this.props.initData)
    if (this.props.initData.length !== 0) {
      // this.state.dataSource = [];
      this.state.dataSource = this.props.initData;

      // console.log(222,this.state.dataSource);
      // for (var i = 0; i < this.state.dataSource.length; i++) {
      //   this.state.dataSource[i].key = i;
      // }
      for (let i = 0; i < this.state.clist.length; i++) {
        children.push(<Option key={this.state.clist[i].id}>{this.state.clist[i].name}</Option>);
      }

      for (let i = 0; i < this.state.rlist.length; i++) {
        children2.push(<Option key={this.state.rlist[i].id}>{this.state.rlist[i].name}</Option>);
      }

    } else {
      for (let i = 0; i < this.state.clist.length; i++) {
        if (i == 0) {
          defaultValue = this.state.clist[i].id;
        }
        children.push(<Option key={this.state.clist[i].id}>{this.state.clist[i].name}</Option>);
      }

      for (let i = 0; i < this.state.rlist.length; i++) {
        if (i == 0) {
          defaultValue2 = this.state.rlist[i].id;
        }
        children2.push(<Option key={this.state.rlist[i].id}>{this.state.rlist[i].name}</Option>);
      }
    }
    this.state.count = this.props.count;
    // this.setState({
    //   dataSource: this.props.initData,
    // });
    
    this.columns = [{
      title: '*商品名称',
      dataIndex: 'prizeId',
      render: (text, record) => {
        return (
          <Select defaultValue={record.prizeId} onChange={this.handleChangeName.bind(this,record)}>
            {children}
          </Select>
        );
      },
    }, {
      title: '*规则',
      dataIndex: 'resultCode',
      render: (text, record) => {
        return (
          <Select defaultValue={record.resultCode} onChange={this.handleChangeRule.bind(this,record)}>
            {children2}
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
          this.state.dataSource.length > 1
            ? (
              <Popconfirm title="是否删除?" onConfirm={() => this.handleDelete(record.key)}>
                <a>删除</a>
              </Popconfirm>
            ) : null
        );
      },
    }];
  }
  render() {
    // const { dataSource } = this.state;
    // const { count } = this.props;
    // console.log(222, count);
    this.updateRenderDatas();
    // console.log('dataSource::', dataSource);
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
          dataSource={this.props.initData}
          columns={columns}
          pagination={false}
        />
      </div>
    );
  }
}
export default GoodsTableField;
