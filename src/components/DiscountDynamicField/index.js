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

class DiscountDynamicField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: [],
      count:0,
      rlist: [
      ],
    };
  }
  componentWillReceiveProps(nextProps) {
    const { initData, count } = nextProps;
    console.log('componentWillReceiveProps', nextProps);
    this.updateRenderDatas(initData, count);
  }
  componentDidMount() {
    const { initData, clist } = this.props;
    console.log('componentDidMount', this.props);
  }
  handleChangeRule = (record, value) => {
    record.resultCode = value;
    // console.log('rule::', this.state.dataSource);
    this.props.discountHandle(this.state.dataSource);
  }
  handleDelete = (key) => {
    // const dataSource = [...this.state.dataSource];
    // this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
    this.props.discountHandleDelete(key);
  }
  handleAdd = () => {
    // const { count, dataSource } = this.state;
    // const newData = {
    //   key: count,
    //   name: `Edward King ${count}`,
    //   age: 32,
    //   address: `London, Park Lane no. ${count}`,
    // };
    // const newData = {
    //   key: count,
    //   code: '优惠券编号',
    //   name: '优惠券名称',
    //   resultCode: '1',
    //   resultRemark: '当游戏得分超过90，掉落此商品',
    //   prizeType: '2',
    // };
    // this.setState({
    //   dataSource: [...dataSource, newData],
    //   count: count + 1,
    // });

    this.props.discountHandleAdd(this.state.dataSource, this.state.currentValue, this.props.count);
  }

  handleSave = (row) => {
    this.props.discountHandleChange(row);
  }
  updateRenderDatas = (initData, count) => {
    let rlist = [];
    for (let i = 1; i <= 10; i++) {
      let newobj = {
        id: i.toString(),
        name: i.toString(),
      }
      rlist.push(newobj);
    }
    // this.state.rlist = rlist;
    this.setState({
      rlist: rlist,
    });

    const children2 = [];
    let defaultValue2 = '';
    // console.log('discountthis.props.initData', this.props.initData)
    if (this.props.initData) {
      // this.state.dataSource = this.props.initData;
      this.setState({
        dataSource: initData,
      });      
      // for (var i = 0; i < this.state.dataSource.length; i++) {
      //   this.state.dataSource[i].key = i;
      // }

      // for (let i = 0; i < this.state.rlist.length; i++) {
      //   children2.push(<Option key={this.state.rlist[i].id}>{this.state.rlist[i].name}</Option>);
      // }
    } else {
      // for (let i = 0; i < this.state.rlist.length; i++) {
      //   if (i == 0) {
      //     defaultValue2 = this.state.rlist[i].id;
      //   }
      //   children2.push(<Option key={this.state.rlist[i].id}>{this.state.rlist[i].name}</Option>);
      // }
    }

    // this.state.count = this.state.dataSource.length;
    this.setState({
      count: count,
    });

  }
  render() {
    // const { dataSource } = this.state;
    // this.updateRenderDatas();
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const children2 = [];
    let defaultValue2 = '';

    for (let i = 0; i < this.state.rlist.length; i++) {
      children2.push(<Option key={this.state.rlist[i].id}>{this.state.rlist[i].name}</Option>);
    }
    this.columns = [{
      title: '*优惠券编号',
      dataIndex: 'code',
      editable: true,
    },{
      title: '*优惠券名称',
      dataIndex: 'name',
      editable: true,
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
          this.state.dataSource.length > 0
            ? (
              <Popconfirm title="是否删除?" onConfirm={() => this.handleDelete(record.key)}>
                <a>删除</a>
              </Popconfirm>
            ) : null
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
          dataSource={this.state.dataSource}
          columns={columns}
          pagination={false}
          rowKey={record => record.key}
        />
      </div>
    );
  }
}
export default DiscountDynamicField;
