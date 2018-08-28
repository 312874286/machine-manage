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
        if(this.input.input.value == '描述' || this.input.input.value == '优惠券编号' || this.input.input.value == '优惠券名称'){
          this.input.input.value = '';
        }
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
      shopClist: [],
    };
  }
  componentWillReceiveProps(nextProps) {
    const { initData, count, shopClist } = nextProps;
    // console.log('discount::componentWillReceiveProps', nextProps);
    this.updateRenderDatas(initData, count, shopClist);
  }
  componentDidMount() {
    const { initData } = this.props;
    // console.log('discount::componentDidMount', this.props);
  }
  handleChangeRule = (record, value) => {
    record.resultCode = value;
    this.props.discountHandle(this.state.dataSource);
  }
  handleDelete = (key) => {
    this.props.discountHandleDelete(key);
  }
  handleAdd = () => {
    this.props.discountHandleAdd(this.state.dataSource, this.state.currentValue, this.props.count);
  }
  handleChangeName = (record, value) => {
    console.log('val', value)
    record.shopsId = value;
    // let number = 0
    // for (var i = 0; i < this.state.clist.length; i++ ) {
    //   if (this.state.clist[i].id === value) {
    //     // record.name = this.state.clist[i].name;
    //     // number = this.state.clist[i].number
    //   }
    // }
    console.log('val', record, this.state.dataSource, this.props.initData);
    this.props.discountHandle(this.props.initData);
  }
  handleSave = (row) => {
    this.props.discountHandleChange(row);
  }
  updateRenderDatas = (initData, count, shopClist) => {
    this.setState({
      shopClist,
    }, () => {
      this.setState({
        shopClistCurrentValue: this.state.shopClist.length === 0 ? '' : shopClist[0].id,
      })
    });
    let rlist = [];
    for (let i = 1; i <= 10; i++) {
      let newobj = {
        id: i,
        name: i.toString(),
      }
      rlist.push(newobj);
    }
    this.setState({
      rlist,
    });
    if (this.props.initData.length !== 0) {
      this.setState({
        dataSource: initData,
      });
    } else {
    }
    this.setState({
      count: count,
    });

  }
  render() {
    const { dataSource, rlist } = this.state;
    const { count, couponsShow, shopClist } = this.props;
    // console.log('discount::', count);
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    console.log('couponsInitDatas', dataSource)
    const children2 = [];
    let defaultValue2 = '';

    for (let i = 0; i < this.state.rlist.length; i++) {
      children2.push(<Option key={this.state.rlist[i].id}>{this.state.rlist[i].name}</Option>);
    }
    // console.log('initData2', this.props.initData)
    if (couponsShow) {
      this.columns = [{
        title: '选择店铺',
        dataIndex: 'shopName',
        render: (text, record) => {
          return (
            <Select onChange={this.handleChangeName.bind(this, record)} onSelect={this.handleChangeName.bind(this, record)} defaultValue={ record.shopName } placeholder="请选择店铺">
              {/*{children}*/}
              {shopClist.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>{item.shopName}</Option>
                );
              })}
            </Select>
          );
        },
      },{
        title: 'InteractID',
        dataIndex: 'code',
        editable: true,
      },{
        title: '优惠券名称',
        dataIndex: 'name',
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
    } else {
      this.columns = [{
        title: '选择店铺',
        dataIndex: 'shopName',
        render: (text, record) => {
          return (
            <Select defaultValue={ record.shopName } placeholder="请选择店铺">
              {/*{children}*/}
              {shopClist.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>{item.shopName}</Option>
                );
              })}
            </Select>
          );
        },
      },{
        title: 'InteractID',
        dataIndex: 'code',
        editable: true,
      },{
        title: '优惠券名称',
        dataIndex: 'name',
        editable: true,
      }, {
        title: '规则',
        dataIndex: 'resultCode',
        render: (text, record) => {
          return (
            <Select defaultValue={record.resultCode} onChange={this.handleChangeRule.bind(this,record)}>
              {rlist.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>{item.id}</Option>
                );
              })}
            </Select>

          );
        },
      }, {
        title: '规则描述',
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
    }

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
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          rowKey={record => record.key}
        />
      </div>
    );
  }
}
export default DiscountDynamicField;
