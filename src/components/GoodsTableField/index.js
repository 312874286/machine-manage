import React, { Component } from "react";
import styles from './index.less'
import { Table, Input, Button, Popconfirm, Form, Select, message } from 'antd';
import {RegexTool} from "../../utils/utils";

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
        console.log('editing::', editing, this.input.input);
        if(this.input.input.value == '描述'){
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

  save = (toggleEdit) => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      // toggleEdit();
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
    // console.log('v', record)
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
                        whitespace: true,
                        message: `请输入${title}`,
                      }, {
                        validator(rule, value, callback) {
                          if (title === '商品数量') {
                            if (value.length > 8) {
                              callback(`${title}输入过大`);
                            }
                          }
                          callback();
                        },
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
      shopClist: [],
      shopClistCurrentValue: '',
      couponsShow: ''
    };
  }
  componentWillReceiveProps(nextProps) {
    const {initData, clist, count, shopClist} = nextProps;
    console.log('initData, clist, count', initData, clist, count, shopClist)
    // if (clist.length > 0) {
    this.updateRenderDatas(initData, clist, count, shopClist);
    // }
  }
  componentDidMount() {
    const { initData, clist } = this.props;
  }
  handleChangeName = (record, value) => {
    record.prizeId = value;
    // let number = 0
    // for (var i = 0; i < this.state.clist.length; i++ ) {
    //   if (this.state.clist[i].id === value) {
    //     // record.name = this.state.clist[i].name;
    //     // number = this.state.clist[i].number
    //   }
    // }
    // console.log('record', record, this.state.clist, this.props.initData, this.state.initData);
    this.props.goodsHandle(this.state.initData, value, record, record.key);
  }
  handleShopChangeName = (value) => {
    this.props.shopHandle(value);
  }
  handleChangeRule = (record, value) => {
    record.resultCode = value;
  }
  handleDelete = (key) => {
    this.props.goodsHandleDelete(key);
  }

  handleAdd = (maxNumber) => {
    if (this.state.initData.length >= maxNumber) {
      if (maxNumber !== 0) {
        message.config({
          top: 100,
          duration: 2,
          maxCount: 1,
        });
        message.warning(`最多只可添加${maxNumber}个商品`)
        this.setState({
          initData: this.state.initData.slice(0, maxNumber)
        })
      } else {
        message.config({
          top: 100,
          duration: 2,
          maxCount: 1,
        });
        message.warning(`请先添加游戏`)
      }
      return false
    }
    this.props.goodsHandleAdd(this.state.initData, this.state.currentValue, this.props.count);

  }

  handleSave = (row) => {
    // console.log('row', row)
    this.props.goodsHandleChange(row);
  }
  updateRenderDatas(initData, clist, count, shopClist) {
    let goodslist = clist
    if (shopClist.length === 0 ) {
      goodslist = []
    }
    this.setState({
      clist: goodslist,
    }, () => {
      this.setState({
        currentValue: this.state.clist.length === 0 ? '' : clist[0].name,
      })
    });
    this.setState({
      shopClist,
    }, () => {
      this.setState({
        shopClistCurrentValue: this.state.shopClist.length === 0 ? '' : shopClist[0].id,
      })
    });
    // console.log('shopClistCurrentValue', this.state.shopClistCurrentValue)
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
    const { count, couponsShow, maxNumber } = this.props;
    const { clist, rlist, initData, shopClist, shopClistCurrentValue, currentValue } = this.state
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    // console.log('initData', initData)
    if (couponsShow) {
      this.columns = [{
        title: '选择店铺',
        dataIndex: 'shopName',
        render: (text, record) => {
          return (
            <Select onChange={this.handleShopChangeName} defaultValue={ record.shopName } placeholder="请选择店铺">
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
        title: '商品名称',
        dataIndex: 'name',
        render: (text, record) => {
          return (
            <Select onChange={this.handleChangeName.bind(this, record)} defaultValue={ record.name } placeholder="请选择商品">
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
        title: '商品数量',
        dataIndex: 'number',
        editable: true,
        // render: (text, record) => {
        //   return (
        //     <Input value={record.number}/>
        //   );
        // },
      },{
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
            <Select onChange={this.handleShopChangeName} defaultValue={ record.shopName } placeholder="请选择店铺">
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
        title: '商品名称',
        dataIndex: 'name',
        render: (text, record) => {
          return (
            <Select onChange={this.handleChangeName.bind(this, record)} defaultValue={ record.name } placeholder="请选择商品">
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
        title: '规则',
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
      // console.log('col', col)
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
      <div className={styles.antButtons}>
        <Button icon="plus" onClick={() => this.handleAdd(maxNumber)} type="primary" style={{ marginBottom: 16 }}>
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
