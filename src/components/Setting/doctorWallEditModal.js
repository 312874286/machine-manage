import React, { PureComponent, Fragment } from 'react';
import { Table, Alert, Divider, Popconfirm, Select, Input, Spin, Modal, Form } from 'antd';
import styles from './doctorWallEditModal.less';
import { getUser } from '../../utils/authority';

const { Option } = Select;
const FormItem = Form.Item;


class doctorWallEditModal extends PureComponent {
  state = {
    subjectName: '',
  };

  // 父组件传入的值
  componentWillReceiveProps = (nextProps) => {
    this.setState({
      subjectName: nextProps.subjectName || '',
    });
  }

  subjectChange = (e) => {
    this.props.doctorWallEditModalSubjectNameChange(e.target.value);
  }

  render() {
    const {
      doctorWallEditModalTableDoctors,
      doctorWallEditModalVisible,
      doctorWallEditModalHandleOk,
      doctorWallEditModalConfirmLoading,
      doctorWallEditModalHandleCancel,
      doctorWallEditModalSelectOptionData,
      doctorWallEditModalSelectFetching,
      doctorWallEditModalTableHandleUpClick,
      doctorWallEditModalTableHandleDownClick,
      doctorWallEditModalTableHandleDelClick,
      doctorWallEditModalSelectHandleSerch,
      doctorWallEditModalSelectHandleChange,
    } = this.props;


    const { subjectName } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
    };

    const columns = [
      {
        title: '医生姓名',
        dataIndex: 'doctorName',
        width: 200,
      },
      {
        title: '医生ID',
        dataIndex: 'doctorId',
        width: 200,
      },
      {
        title: '出诊类型',
        dataIndex: 'outpatientType',
        width: 200,
      },
      {
        title: '操作',
        render: (text, data, index) => (
          <Fragment>
            <Popconfirm title="确认删除？" onConfirm={() => doctorWallEditModalTableHandleDelClick(data)}>
              <a style={{ color: '#FF0000' }}>删除</a>
            </Popconfirm>
            {index !== 0 && (
              <span>
                <Divider type="vertical" />
                <a onClick={() => doctorWallEditModalTableHandleUpClick(data)}>上移</a>
              </span>
            )}
            {index < doctorWallEditModalTableDoctors.length - 1 && (
              <span>
                <Divider type="vertical" />
                <a onClick={() => doctorWallEditModalTableHandleDownClick(data)}>下移</a>
              </span>
            )}
          </Fragment>
        ),
      },
    ];


    return (
      <div>
        <Modal
          className={styles.departmentModal}
          title="编辑科室"
          width="900px"
          visible={doctorWallEditModalVisible}
          onOk={() => { doctorWallEditModalHandleOk(subjectName) }}
          confirmLoading={doctorWallEditModalConfirmLoading}
          onCancel={doctorWallEditModalHandleCancel}
        >
          <FormItem
            {...formItemLayout}
            label="科室名称"
          >
            <Input value={subjectName} placeholder="请输入科室名称" onChange={this.subjectChange} />
          </FormItem>
          <FormItem {...formItemLayout} label="添加医生" >
            <Select
              placeholder="请输入关键字搜索医生"
              mode="multiple"
              value={[]}
              notFoundContent={doctorWallEditModalSelectFetching ? <Spin size="small" /> : null}
              filterOption={false}
              onSearch={doctorWallEditModalSelectHandleSerch}
              onChange={doctorWallEditModalSelectHandleChange}
              style={{ width: '100%' }}
            >
              {doctorWallEditModalSelectOptionData.map((item) => {
                return <Option key={item.doctorId}>{item.doctorName}</Option>
              })}
            </Select>
          </FormItem>
          <Table
            rowKey={record => record.doctorId}
            dataSource={doctorWallEditModalTableDoctors}
            columns={columns}
            pagination={false}
            scroll={{ y: 300 }}
            size="small"
          />
        </Modal>

      </div>
    );
  }
}

export default doctorWallEditModal;
