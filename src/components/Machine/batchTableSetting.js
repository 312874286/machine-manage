import React, { Component } from "react";
import styles from './batchTableSetting.less'
import { Table, Input, Button, Popconfirm, Form, Select, message } from 'antd';
import {RegexTool} from "../../utils/utils";
const No = /^[1-9]+/
const FormItem = Form.Item;
const EditableContext = React.createContext();

const { Option } = Select;
const typeList = [{id: 1, name: '大弹簧货道'}, {id: 2, name: '小弹簧货道'}, {id: 3, name: '履带货道'}]
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
                          if (!No.test(value)) {
                            callback('必须输入正整数')
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

class BatchTableField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count:0,
      clist: [],
      aisleCount: [],
      currentValue: '',
      initData: [],
      shopClist: [],
      shopClistCurrentValue: '',
      couponsShow: ''
    };
  }
  componentWillReceiveProps(nextProps) {
    const {initData, count } = nextProps;
    // if (clist.length > 0) {
    this.updateRenderDatas(initData, count);
    // }
  }
  componentDidMount() {
    const { initData } = this.props;
    this.updateRenderDatas(initData);
  }
  // handleChangeName = (record, value) => {
  //   record.prizeId = value;
  //   this.props.goodsHandle(this.state.initData, value, record, record.key);
  // }
  // handleShopChangeName = (value) => {
  //   this.props.shopHandle(value);
  // }
  handleChangeType = (record, value) => {
    record.type = value;
  }
  handleChangeCount = (record, value) => {
    record.count = value;
  }
  handleDelete = (key) => {
    this.props.goodsHandleDelete(key);
  }

  handleAdd = () => {
    this.props.goodsHandleAdd(this.state.initData, this.state.currentValue, this.props.count);
  }

  handleSave = (row) => {
    // console.log('row', row)
    this.props.goodsHandleChange(row);
  }
  updateRenderDatas(initData, count) {
    let aisleCount = [];
    for (let i = 1; i <= 9; i++) {
      let newobj = {
        id: i,
        name: i.toString(),
      }
      aisleCount.push(newobj);
    }
    this.setState({
      aisleCount,
      initData,
    })

    this.setState({
      count: count,
    });
  }
  render() {
    const { aisleCount, initData } = this.state
    const { modalType } = this.props
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    // console.log('initData', this.props.initData)
    this.columns = [
      {
        title: '行',
        dataIndex: 'key',
        render: (text, record) => {
          return (
            <span>第{record.key + 1}行货道</span>
          );
        },
      }, {
        title: '每行共几列',
        dataIndex: 'count',
        render: (text, record) => {
          return (
            <Select defaultValue={record.count}  onChange={this.handleChangeCount.bind(this,record)}
                    placeholder="请选择" disabled={!modalType}>
              {aisleCount.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>{item.name}</Option>
                );
              })}
            </Select>

          );
        },
      }, {
        title: '货道类型',
        dataIndex: 'type',
        render: (text, record) => {
          return (
            <Select defaultValue={record.type} onChange={this.handleChangeType.bind(this,record)}
                    placeholder="请选择" disabled={!modalType}>
              {typeList.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>{item.name}</Option>
                );
              })}
            </Select>

          );
        },
      }, {
        title: '货道容量',
        dataIndex: 'volumeCount',
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
        <Button icon="plus" onClick={() => this.handleAdd()} type="primary" style={{ marginBottom: 16 }}>
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
export default BatchTableField;
