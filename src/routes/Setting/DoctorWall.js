import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Modal,
  message,
  Spin,
  Icon,
} from 'antd';
import { routerRedux } from 'dva/router';
import DoctorWallTable from '../../components/Setting/doctorWall';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './DoctorWall.less';
import { getUser } from '../../utils/authority';
import DoctorWallEditModal from '../../components/Setting/doctorWallEditModal';

const FormItem = Form.Item;

@connect(({ doctorWall, loading }) => ({
  doctorWall,
  loading: loading.models.doctorWall,
}))
@Form.create()
export default class DoctorWall extends PureComponent {
  state = {
    pageNo: 1,
    keyWords: '',
    addInputValue: '',
    logModalVisible: false,
    doctorWallEditModalSelectOptionData: [],
    doctorWallEditModalSelectFetching: false,
    doctorWallEditModalTableDoctors: [],
    doctorWallEditModalType: '',
    subjectName: '',
  };

  componentDidMount() {
    this.getList();
  }

  // 主表格
  getList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'doctorWall/departmentList',
      payload: {
        restParams: {
          merchantId: getUser().merchantId,
          pageNo: this.state.pageNo,
          keyWords: this.state.keyWords,
        },
      },
    });
  }

  // 分页
  handleTableChange = (pagination) => {
    const { current } = pagination;
    this.setState({
      pageNo: current,
    }, () => {
      this.getList();
    });
  }

  // 查询
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        pageNo: 1,
        keyWords: fieldsValue.keyWords,
      }, () => {
        this.getList();
      });
    });
  }

  // 编辑modal 新建事件
  handleCreateClick = () => {
    this.setState({
      doctorWallEditModalType: 'create',
      doctorWallEditModalData: {},
      doctorWallEditModalTableDoctors: [],
      doctorWallEditModalVisible: true,
    });
  }

  // 表格删除
  handleDelete = (e) => {
    this.props.dispatch({
      type: 'doctorWall/deleteSubject',
      payload: {
        restParams: {
          subjectId: e.subjectId,
          merchantId: getUser().merchantId,
        },
      },
    }).then(() => {
      this.getList();
    });
  }

  // 移动科室
  moveSubject = ({ subjectId, type }) => {
    this.props.dispatch({
      type: 'doctorWall/moveSubject',
      payload: {
        restParams: {
          merchantId: getUser().merchantId,
          subjectId,
        },
        params: {
          type,
        },
      },
    }).then(() => {
      this.getList();
    });
  }

  // 上移
  tableHandleUpClick = (item) => {
    this.moveSubject({ ...item, type: 1 });
  }

  // 下移
  tableHandleDownClick = (item) => {
    this.moveSubject({ ...item, type: 2 });
  }

  // 编辑modal 编辑事件
  handleEditClick = (item) => {
    this.props.dispatch({
      type: 'doctorWall/getDepartment',
      payload: {
        restParams: {
          merchantId: getUser().merchantId,
          subjectId: item.subjectId,
        },
      },
    }).then((resp) => {
      if (resp.code !== 0) {
        return;
      }
      const { data } = resp;

      this.setState({
        subjectName: data.subjectName,
        doctorWallEditModalType: 'edit',
        doctorWallEditModalData: data,
        doctorWallEditModalTableDoctors: data.doctors || [],
        doctorWallEditModalVisible: true,
      });
    });
  }

  // 编辑modal 确定事件
  doctorWallEditModalHandleOk = (subjectName) => {
    const {
      doctorWallEditModalTableDoctors,
      doctorWallEditModalData: { subjectId },
    } = this.state;

    doctorWallEditModalTableDoctors.forEach((item, index) => {
      item.order = index + 1;
    });

    this.setState({
      doctorWallEditModalConfirmLoading: true,
    });

    this.props.dispatch({
      type: this.state.doctorWallEditModalType === 'edit' ? 'doctorWall/saveSubject' : 'doctorWall/createSubject',
      payload: {
        restParams: {
          merchantId: getUser().merchantId,
          subjectId,
        },
        params: {
          subjectName,
          doctors: doctorWallEditModalTableDoctors,
        },
      },
    }).then((resp) => {
      if (resp.code !== 0) {
        this.setState({
          doctorWallEditModalConfirmLoading: false,
        });
        return;
      }
      this.getList();
      this.setState({
        doctorWallEditModalConfirmLoading: false,
        doctorWallEditModalVisible: false,
        subjectName: '',
      });
    });
  }

  // 编辑modal 取消事件
  doctorWallEditModalHandleCancel = () => {
    this.setState({
      doctorWallEditModalVisible: false,
      subjectName: '',
    });
  }

  // 编辑modal 搜索医生事件
  doctorWallEditModalSelectHandleSerch = (value) => {
    this.setState({
      doctorWallEditModalSelectOptionData: [],
      doctorWallEditModalSelectFetching: true,
    });
    this.props.dispatch({
      type: 'doctorWall/doctorList',
      payload: {
        restParams: {
          merchantId: getUser().merchantId,
          keyWords: value,
        },
      },
    }).then((response) => {
      if (response.code !== 0) return;
      this.setState({
        doctorWallEditModalSelectOptionData: response.data,
        doctorWallEditModalSelectFetching: false,
      });
    });
  }

  // 编辑modal 选择医生事件
  doctorWallEditModalSelectHandleChange = (value) => {
    const doctor = this.state.doctorWallEditModalSelectOptionData.find(item => value[0] == item.doctorId);
    const doctors = [...this.state.doctorWallEditModalTableDoctors];
    const hasDoctor = doctors.find(item => item.doctorId == doctor.doctorId);
    if (hasDoctor) {
      this.setState({
        doctorWallEditModalSelectOptionData: [],
      });
      return;
    }

    doctors.push(doctor);
    this.setState({
      doctorWallEditModalTableDoctors: doctors,
      doctorWallEditModalSelectOptionData: [],
    });
  }

  // 编辑modal 下移
  doctorWallEditModalTableHandleDownClick = (item) => {
    const tableData = [...this.state.doctorWallEditModalTableDoctors];
    const index = tableData.indexOf(item);
    const doctor = tableData.splice(index, 1);
    tableData.splice(index + 1, 0, doctor[0]);

    this.setState({
      doctorWallEditModalTableDoctors: tableData,
    });
  }
  // 编辑modal 上移
  doctorWallEditModalTableHandleUpClick = (item) => {
    const tableData = [...this.state.doctorWallEditModalTableDoctors];
    const index = tableData.indexOf(item);
    const doctor = tableData.splice(index, 1);
    tableData.splice(index - 1, 0, doctor[0]);

    this.setState({
      doctorWallEditModalTableDoctors: tableData,
    });
  }

  // 编辑modal 删除
  doctorWallEditModalTableHandleDelClick = (item) => {
    const tableData = [...this.state.doctorWallEditModalTableDoctors];
    const index = tableData.indexOf(item);
    tableData.splice(index, 1);

    this.setState({
      doctorWallEditModalTableDoctors: tableData,
    });
  }

  // 设置subjectname
  doctorWallEditModalSubjectNameChange = (subjectName) => {
    this.setState({
      subjectName,
    });
  }

  render() {
    const { doctorWall: { list, page }, loading } = this.props;
    const { logModalVisible, addInputValue } = this.state;
    const {
      doctorWallEditModalData,
      doctorWallEditModalTableDoctors,
      doctorWallEditModalVisible,
      doctorWallEditModalConfirmLoading,
      doctorWallEditModalSelectOptionData,
      doctorWallEditModalSelectFetching,
      subjectName,
    } = this.state;

    const { getFieldDecorator } = this.props.form;

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={12}>
                    <FormItem label="关键字">
                      {getFieldDecorator('keyWords')(
                        <Input placeholder="请输入科室名称" />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={12}>
                    <span className={styles.submitButtons}>
                      <Button type="primary" htmlType="submit">查询</Button>
                    </span>
                  </Col>
                </Row>
              </Form>
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleCreateClick(true)}>新建</Button>
            </div>
          </div>

          <div className={styles.tableList}>
            <DoctorWallTable
              loading={loading}
              data={list}
              page={page}
              onDeleteClick={this.handleDelete}
              onEditClick={this.handleEditClick}
              onLogClick={this.handleLogClick}
              handleTableChange={this.handleTableChange}
              tableHandleUpClick={this.tableHandleUpClick}
              tableHandleDownClick={this.tableHandleDownClick}
            />
          </div>
        </Card>
        <Modal
          title="日志"
          visible={logModalVisible}
          onCancel={this.handleModalLogVisible}
          footer={null}
        >
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="描述"
          >
            <Input placeholder="请输入" onChange={this.handleAddInput} value={addInputValue} />
          </FormItem>
        </Modal>

        <DoctorWallEditModal
          data={doctorWallEditModalData}
          subjectName={subjectName}
          doctorWallEditModalTableDoctors={doctorWallEditModalTableDoctors}
          doctorWallEditModalVisible={doctorWallEditModalVisible}
          doctorWallEditModalHandleOk={this.doctorWallEditModalHandleOk}
          doctorWallEditModalConfirmLoading={doctorWallEditModalConfirmLoading}
          doctorWallEditModalHandleCancel={this.doctorWallEditModalHandleCancel}
          doctorWallEditModalSelectHandleSerch={this.doctorWallEditModalSelectHandleSerch}
          doctorWallEditModalSelectOptionData={doctorWallEditModalSelectOptionData}
          doctorWallEditModalSelectFetching={doctorWallEditModalSelectFetching}
          doctorWallEditModalSelectHandleChange={this.doctorWallEditModalSelectHandleChange}
          doctorWallEditModalTableHandleUpClick={this.doctorWallEditModalTableHandleUpClick}
          doctorWallEditModalTableHandleDownClick={this.doctorWallEditModalTableHandleDownClick}
          doctorWallEditModalTableHandleDelClick={this.doctorWallEditModalTableHandleDelClick}
          doctorWallEditModalSubjectNameChange={this.doctorWallEditModalSubjectNameChange}
        />

      </PageHeaderLayout>
    );
  }
}
