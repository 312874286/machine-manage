import React, { Component } from "react";
import styles from './VipModal.less'
import { Table, Input, Button, Popconfirm, Form, Select, message } from 'antd';
import {RegexTool} from "../../utils/utils";

const FormItem = Form.Item;
const EditableContext = React.createContext();

const { Option } = Select;
const isVip = [{id: 0, name: '不加入'}, {id: 1, name: '加入'}]


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
    // const editing = !this.state.editing;
    // this.setState({ editing }, () => {
    //   if (editing) {
    //     console.log('editing::', editing, this);
    //     if(this.input.input.value == '请填写访问码'){
    //       this.input.input.value = '';
    //     }
    //     this.input.focus();
    //   }
    // });
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
      // console.log('value', record, values )
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
                !editing ? (
                  <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                      rules: [{
                        required: false,
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
                        // onPressEnter={this.save}
                        onBlur={this.save}
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

class VipModal extends Component {
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
  handleIsVip = (record, value) => {
    record.isVip = value
    // if (value === 1) {
    //   record.sessionKey = '请填写访问码'
    // } else {
    //   record.sessionKey = ''
    // }
    // let initData = this.state.initData
    // initData[record.key - 1] = record
    // this.setState({
    //   initData,
    // })
    // record.prizeId = value;
    // console.log('record', record, this.state.clist, this.props.initData, this.state.initData);
    this.props.goodsHandle(this.props.initData, value, record);
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
  handleSave = (row) => {
    // console.log('row', row)
    this.props.goodsHandleChange(row);
  }
  updateRenderDatas(initData, clist, count, shopClist) {
    console.log('initData', initData)
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
    const { count, couponsShow } = this.props;
    const { clist, rlist, initData, shopClist, shopClistCurrentValue, currentValue } = this.state
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    console.log('initData2', initData)
    // console.log('initData', initData)

    this.columns = [{
      title: '店铺名称',
      dataIndex: 'shopName',
    },{
      title: '是否入会',
      dataIndex: 'isVip',
      render: (text, record) => {
        return (
          <Select onChange={this.handleIsVip.bind(this, record)} onSelect={this.handleIsVip.bind(this, record)} defaultValue={ record.isVip } placeholder="请选择是否入会">
            {/*{children}*/}
            {isVip.map((item) => {
              return (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              );
            })}
          </Select>
        );
      },
    }, {
      title: '访问码',
      dataIndex: 'sessionKey',
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
          rowKey={record => record.id}
        />
      </div>
    );
  }
}
export default VipModal;
