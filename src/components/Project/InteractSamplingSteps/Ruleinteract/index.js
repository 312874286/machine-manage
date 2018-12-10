import React, { Component } from "react";
import styles from './index.less'
import { Table, Input, Button, Popconfirm, Form, Select, message } from 'antd';

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
      // if (error) {
      //   return;
      // }
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
                          if (title === '规则描述') {
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

class RuleInteract extends Component {
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
    const {initData} = nextProps;
    // if (clist.length > 0) {
    this.updateRenderDatas(initData);
    // }
  }
  componentDidMount() {
    const { initData, clist } = this.props;
    console.log('initData', initData)
    this.updateRenderDatas(initData, clist,);
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
    record.ruleCode = value;
  }
  handleDelete = (key) => {
    this.props.goodsHandleDelete(key);
  }


  handleSave = (row) => {
    this.props.goodsHandleChange(row);
  }
  updateRenderDatas(initData) {
    let rlist = [];
    for (let i = 1; i <= 10; i++) {
      let newobj = {
        id: i,
        name: i.toString(),
      }
      rlist.push(newobj);
    }
    this.state.rlist = rlist;
    if (initData.length !== 0) {
      this.setState({
        initData,
      });
    } else {
      this.setState({
        initData: [],
      });
    }
  }
  render() {
    const { rlist, initData } = this.state
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    this.columns = [{
      title: '商品名称',
      dataIndex: 'goodName',
    }, {
      title: '规则',
      dataIndex: 'ruleCode',
      render: (text, record) => {
        return (
          <Select defaultValue={record.ruleCode} onChange={this.handleChangeRule.bind(this,record)} style={{ width: '200px'}}>
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
      dataIndex: 'ruleRemark',
      editable: true,
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
export default RuleInteract;
