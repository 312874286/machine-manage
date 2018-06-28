import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Card, Form, Input, Modal, Divider, Table, Popconfirm, notification } from 'antd';
import AlertManageTable from '../../components/Setting/alertManageTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getUser } from '../../utils/authority';
import { RegexTool } from '../../utils/utils';
import styles from './AlertManage.less';
import LogModal from '../../components/LogModal';


const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0', width: 240 }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);
const DetailInfoTable = ({ detail }) => (
  <table className={styles.detailTable}>
    <tbody>
      <tr>
        <td>报警名称</td>
        <td>{detail ? detail.alarmName : ''}</td>
      </tr>
      <tr>
        <td>报警内容</td>
        <td>{detail ? detail.alarmContent : ''}</td>
      </tr>
      <tr>
        <td>报警规则</td>
        <td>{detail ? detail.alarmRule : ''}</td>
      </tr>
    </tbody>
  </table>
);
@connect(({ alertManage, loading, log }) => ({
  alertManage,
  log,
  loading: loading.models.alertManage,
}))
@Form.create()
export default class AlertManage extends PureComponent {
  state = {
    modalVisible: false,
    detail: {
      data: null,
      datas: [],
      page: null,
    },
    logModalVisible: false,
    logModalLoading: false,
    logId: '',
    logModalPageNo: 1,
  };

  componentDidMount() {
    this.refreshList({
      pageNo: 1,
    });
  }

  refreshList = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'alertManage/getAlertManageList',
      payload: {
        restParams: {
          merchantId: getUser().merchantId,
          ...params,
        },
      },
    });
  }

  handleTableChange = (pagination) => {
    this.refreshList({
      pageNo: pagination.current,
    });
  }

  handleDetailClick = (item) => {
    this.props.dispatch({
      type: 'alertManage/getAlertPersions',
      payload: {
        restParams: {
          merchantId: getUser().merchantId,
          alarmId: item.id,
        },
      },
    }).then(({ data, page }) => {
      this.setState({
        detail: {
          page,
          data: item,
          datas: data,
        },
        modalVisible: true,
      });
    });
  }

  checkModalStatus() {
    const { detail } = this.state;
    const datas = [...detail.datas];
    if (datas.some(item => item.editable)) {
      notification.warning({
        message: '编辑锁定',
        description: '报警接收人信息编辑中',
      });
      return false;
    }
    return true;
  }

  handleModalVisible = () => {
    if (this.checkModalStatus()) {
      const { alertManage: { list: { pagination: { current } } } } = this.props;
      this.refreshList({
        pageNo: current,
      });
      this.setState({
        modalVisible: false,
      });
    }
  }

  handleDisableClick = (data) => {
    this.props.dispatch(
      {
        type: 'alertManage/updateAlertManageStatus',
        payload: {
          restParams: {
            merchantId: getUser().merchantId,
            configId: data.id,
            operation: data.status === 1 ? 'DISABLE' : 'ENABLE',
          },
        },
      }
    ).then((resp) => {
      if (resp && resp.code === 0) {
        notification.success({
          message: '操作成功',
        });
        const { alertManage: { list: { pagination: { current } } } } = this.props;
        this.refreshList({
          pageNo: current,
        });
      }
    });
  }

  handleLogClick = (data) => {
    this.setState({
      modalVisible: !!data,
    });
  }

  handleDetailPersionEdit = (data) => {
    if (this.checkModalStatus()) {
      const { detail } = this.state;
      const datas = [...detail.datas];
      const target = datas.find(item => item.id === data.id);
      if (target) {
        target.editable = true;
        detail.datas = datas;
        this.setState({ ...detail });
      }
    }
  }

  handleDetailPersionAdd() {
    if (this.checkModalStatus()) {
      const { detail } = this.state;
      const datas = [...detail.datas];
      datas.push({
        id: '',
        reciveName: null,
        reciveMobile: null,
        editable: true,
      });
      detail.datas = datas;
      this.setState({ ...detail });
    }
  }

  handleDetailPersionEditCancel() {
    const { detail: { data } } = this.state;
    this.handleDetailClick(data);
  }
  handleDetailPersionEditSave(item) {
    const { reciveName, reciveMobile } = item;
    if (!reciveName) {
      notification.warning({
        message: '报警接收人姓名不能为空',
      });
      return;
    } else if (!RegexTool.mobile.test(reciveMobile)) {
      notification.warning({
        message: '报警接收人手机号输入有误',
      });
      return;
    }
    const { detail: { data, data: { id } } } = this.state;
    const pid = item.id;
    const type = `alertManage/${pid ? 'updateAlertPersion' : 'addAlertPersion'}`;
    const restParams = {
      merchantId: getUser().merchantId,
      alarmId: id,
    };
    if (pid) {
      restParams.personId = pid;
    }
    this.props.dispatch(
      {
        type,
        payload: {
          params: {
            reciveName,
            reciveMobile,
          },
          restParams,
        },
      }
    ).then((resp) => {
      if (resp && resp.code === 0) {
        notification.success({
          message: '操作成功',
        });
        this.handleDetailClick(data);
      }
    });
  }

  handleDetailPersionDelete(item) {
    if (this.checkModalStatus()) {
      const { detail: { data, data: { id } } } = this.state;
      const pid = item.id;
      this.props.dispatch(
        {
          type: 'alertManage/updateAlertPersionStatus',
          payload: {
            restParams: {
              merchantId: getUser().merchantId,
              alarmId: id,
              personId: pid,
              operation: 'DISABLE',
            },
          },
        }
      ).then((resp) => {
        if (resp && resp.code === 0) {
          notification.success({
            message: '操作成功',
          });
          this.handleDetailClick(data);
        }
      });
    }
  }

  handleDateilPersionEditChange(value, data, column) {
    const { detail } = this.state;
    const datas = [...detail.datas];
    const target = datas.find(item => item.id === data.id);
    if (target) {
      target[column] = value;
      detail.datas = datas;
      this.setState({ ...detail });
    }
  }

  renderDetail() {
    const { detail: { data, datas } } = this.state;
    const detailColumns = [
      {
        title: '姓名',
        dataIndex: 'reciveName',
        width: 240,
        render: (text, record) => this.renderColumns(text, record, 'reciveName'),
      },
      {
        title: '手机号',
        dataIndex: 'reciveMobile',
        render: (text, record) => this.renderColumns(text, record, 'reciveMobile'),
      },
      {
        title: '操作',
        width: 120,
        render: (text, record) => {
          const { editable } = record;
          return (
            <Fragment>
              {
                editable ?
                  (
                    <span>
                      <a onClick={() => this.handleDetailPersionEditSave(record)}>保存</a>
                      <Divider type="vertical" />
                      <Popconfirm title="确认取消?" onConfirm={() => this.handleDetailPersionEditCancel(record)}>
                        <a>取消</a>
                      </Popconfirm>
                    </span>
                  )
                  : (
                    <span>
                      <a onClick={() => this.handleDetailPersionEdit(record)}>编辑</a>
                      <Divider type="vertical" />
                      <Popconfirm title="确认删除?" onConfirm={() => this.handleDetailPersionDelete(record)}>
                        <a>删除</a>
                      </Popconfirm>
                    </span>
                  )
              }
            </Fragment >
          );
        },
      }];
    const { modalVisible } = this.state;
    const title = () => {
      return (
        <Row className={styles.detailTableTitle}>
          <span>报警接收人</span><a onClick={() => this.handleDetailPersionAdd()}>添加</a>
        </Row>
      );
    };
    return (
      <Modal
        title="详情"
        visible={modalVisible}
        onCancel={() => this.handleModalVisible()}
        footer={null}
        width={720}
      >
        <DetailInfoTable detail={data} />

        <Table
          rowKey={record => record.id}
          dataSource={datas}
          columns={detailColumns}
          pagination={false}
          title={title}
          size="small"
        // onChange={this.handleTableChange}
        />
      </Modal>);
  }

  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleDateilPersionEditChange(value, record, column)}
      />
    );
  }

  // 日志相关
  getLogList = () => {
    this.props.dispatch({
      type: 'log/getLogList',
      payload: {
        restParams: {
          code: this.state.logId,
          pageNo: this.state.logModalPageNo,
        },
      },
    }).then(() => {
      this.setState({
        logModalLoading: false,
      });
    });
  }

  handleLogClick = (data) => {
    this.setState({
      logModalVisible: !!data,
      logModalLoading: true,
      logId: data.id,
    }, () => {
      this.getLogList();
    });
  }

  logModalHandleCancel = () => {
    this.setState({
      logModalVisible: false,
    });
  }

  logModalhandleTableChange = (pagination) => {
    const { current } = pagination;
    this.setState({
      logModalPageNo: current,
    }, () => {
      this.getLogList();
    });
  }

  render() {
    const { alertManage: { list }, log: { logList, logPage }, loading } = this.props;
    // const {modalVisible} = this.state;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <AlertManageTable
              loading={loading}
              data={list}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleTableChange}
              onDetailClick={this.handleDetailClick}
              onDisableClick={this.handleDisableClick}
              onLogClick={this.handleLogClick}
            />
          </div>
        </Card>
        {this.renderDetail()}
        <LogModal
          data={logList}
          page={logPage}
          loding={this.state.logModalLoading}
          logVisible={this.state.logModalVisible}
          logHandleCancel={this.logModalHandleCancel}
          logModalhandleTableChange={this.logModalhandleTableChange}
        />
      </PageHeaderLayout >
    );
  }
}
