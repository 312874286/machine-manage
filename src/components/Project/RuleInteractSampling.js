import { Table, Input, Button, Popconfirm, Form, Checkbox, InputNumber } from 'antd';
import React, { PureComponent } from 'react';
import './RuleInteractSampling.less'

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
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
    // console.log('record333', record)
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
                      <InputNumber
                        ref={node => (this.input = node)}
                        disabled={record['userDayNumber'] === ' ' ? true : false}
                        // onBlur={this.save}
                      />
                    )}
                  </FormItem>
                ) : (
                  <div
                  className="editable-cell-value-wrap"
                  style={{ paddingRight: 24 }}
                  onClick={this.toggleEdit}>
                  {restProps.children === -1 ? ' ' : restProps.children}
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
{/*<FormItem style={{ margin: 0 }}>*/}
  {/*{form.getFieldDecorator(dataIndex, {*/}
    {/*rules: [{*/}
      {/*required: true,*/}
      {/*message: `${title} is required.`,*/}
    {/*}],*/}
    {/*initialValue: record[dataIndex],*/}
  {/*})(*/}
    {/*<Input*/}
      {/*ref={node => (this.input = node)}*/}
      {/*disabled={record['userDayNumber'] === ' ' ? true : false}*/}
      {/*// onBlur={this.save}*/}
    {/*/>*/}
  {/*)}*/}
{/*</FormItem>*/}
export default class RuleInteractSampling extends PureComponent {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '商品名称',
      dataIndex: 'name',
      width: '30%',
    }, {
      title: '每天可派发数',
      dataIndex: 'userDayNumber',
      editable: true,
    }, {
      title: '',
      dataIndex: 'key',
      render: (text, record) => {
        return (
          <Checkbox
            onChange={this.onChange}
            onClick={() => this.changeData(record)}
            checked={record.check}
            >不限</Checkbox>
        );
      },
    }];

    this.state = {
      currentModalKey: '',
      checked: false
    };
  }
  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    this.setState({
      dataSource: data,
    });
  }
  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  }
  onChange = (e) => {
    console.log('row', e.target.checked, e)
    // const { allGoods } = this.props
    setTimeout(() => {
      this.props.handleChecked({ key: this.state.currentModalKey, checked: e.target.checked, userDayNumber: 0 })
    }, 0)
  }
  changeData = (record) => {
    console.log('row', record)
    this.setState({
      currentModalKey: record.key
    })
  }
  handleSave = (row) => {
    const newData = [...this.props.data];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    console.log('newData6666', newData, item, row)
    this.props.handleChecked({ key: row.key, checked: row.check, userDayNumber: row.userDayNumber })
    this.setState({ dataSource: newData });
    console.log('newData6666', this.state.dataSource)
  }

  render() {
    const { dataSource } = this.state;
    const { data } = this.props
    // console.log('data', data)
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
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.props.handleChecked({ key: selectedRows[0].key, checked: selectedRows.length > 0 ? true : false })
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    return (
      <div>
        {/*<Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>*/}
          {/*Add a row*/}
        {/*</Button>*/}
        <Table
          pagination={false}
          rowKey={record => record.key}
          components={components}
          rowClassName={() => 'editable-row'}
          bordered={null}
          dataSource={data}
          columns={columns}
        />
      </div>
    );
  }
}
