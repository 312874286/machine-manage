import React, { PureComponent } from 'react';
import { Table, Modal, Card, Alert, Row, Col } from 'antd';
import { MathTool } from '../../utils/utils';
import styles from './detail.less';

const config = {
  contractStatus: {
    0: '取消',
    1: '报告已上传完成',
    2: '待排班',
    3: '待履约',
    4: '待用户上车',
    5: '开始履约',
    6: '待上传报告',
    8: '待第三方上传报告',
  },
  orderStatus: [
    { id: 0, name: '取消' },
    { id: 1, name: '已支付' },
    { id: 2, name: '预定' },
    { id: 3, name: '待履约' },
    { id: 4, name: '待支付' },
  ],
  orderType: [
    { id: 31, name: '儿保-风车医生' },
    { id: 32, name: '儿保-解读订单' },
    { id: 33, name: '儿保-车费订单' },
    { id: 34, name: '儿保-微信商城' },
    { id: 35, name: '[临]儿保-风车医生' },
    { id: 36, name: '儿疾订单' },
    { id: 60, name: '康复训练卡' },
    { id: 70, name: '门诊' },
    { id: 71, name: '门诊-立即' },
    { id: 72, name: '儿疾门诊订单' },
  ],
};
export default class detail extends PureComponent {
  state = {
    footer: [],
  }

  logModalhandleTableChange = (pagination, filters, sorter) => {
    this.props.logModalhandleTableChange(pagination, filters, sorter);
  }
  renderInfo = () => {
    const { data } = this.props;
    const columns = [
      {
        title: '合约单号',
        dataIndex: 'order.orderNum',
      },
      {
        title: '合约状态',
        dataIndex: 'id',
        render: (text, record) => {
          return config.contractStatus[record.order.status];
        },
      },
      {
        title: '最近更新时间',
        dataIndex: 'order.updateTime',
      },
      {
        title: '家长ID',
        dataIndex: 'patient.id',
      },
      {
        title: '电话号码',
        dataIndex: 'patient.phone',
      },
      {
        title: '合约生成时间',
        dataIndex: 'order.createTime',
      },
    ];
    return (
      <Card title="合约基本信息">
        <Table
          size="small"
          columns={columns}
          dataSource={[data]}
          pagination={false}
        />
      </Card>
    );
  }
  renderShift = () => {
    const { data } = this.props;
    const columns = [
      {
        title: '出车时间',
        width: 240,
        render: (text, record) => {
          const shift = record.carClassesAppointment;
          return `${shift.classesDate} ${shift.startTime}~${shift.endTime}`;
        },
      },
      {
        title: '出车地址',
        dataIndex: 'id',
        render: (text, record) => {
          const a = record.carClassesAppointment || {};
          return `${a.provinceName}${a.cityName}${a.areaName}${a.address}${a.mapAddress}`;
        },
      },
    ];
    return (
      <Card title="班次信息">
        <Table
          size="small"
          columns={columns}
          dataSource={[data]}
          pagination={false}
        />
      </Card>
    );
  }
  renderBaby = () => {
    const { data } = this.props;
    const columns = [
      {
        title: '宝宝ID',
        dataIndex: 'baby.fromId',
      },
      {
        title: '宝宝姓名',
        dataIndex: 'baby.name',
      },
      {
        title: '拼音',
        dataIndex: 'baby.py',
      },
      {
        title: '性别',
        render: (text, record) => {
          const { baby } = record;
          return baby.sex === '0' ? '女' : baby.sex === '1' ? '男' : '';
        },
      },
      {
        title: '生日',
        dataIndex: 'baby.birthday',
      },
    ];
    return (
      <Card title="宝宝信息">
        <Table
          size="small"
          columns={columns}
          dataSource={[data]}
          pagination={false}
        />
      </Card>
    );
  }
  renderUser = () => {
    const { data } = this.props;
    const columns = [
      {
        title: '陪护人姓名',
        dataIndex: 'order.escortName',
        render: (text, record) => {
          return record.order.escortName || '暂无';
        },
      },
      {
        title: '陪护人身份',
        render: (text, record) => {
          return record.order.escortIdentity || '暂无';
        },
      },
      {
        title: '联系电话',
        render: (text, record) => {
          return record.order.escortMobile || '暂无';
        },
      },
    ];
    return (
      <Card title="陪护人信息">
        <Table
          size="small"
          columns={columns}
          dataSource={[data]}
          pagination={false}
        />
      </Card>
    );
  }
  renderOrders = () => {
    const { data } = this.props;
    const getOrderInfo = (orderId) => {
      let result;
      if (orderId && data.ordersInfos && data.ordersInfos.length > 0) {
        result = data.ordersInfos.find(i => i.orderId === orderId);
      }
      return result;
    };
    const columns = [
      {
        title: '订单ID',
        dataIndex: 'orderNum',
      },
      {
        title: '订单类型',
        render: (text, record) => {
          const status = config.orderType.find(i => i.id === record.orderType);
          return (status && status.name) || '';
        },
      },
      {
        title: '服务项ID',
        render: (text, record) => {
          return getOrderInfo(record.id).goodsId;
        },
      },
      {
        title: '服务项名称',
        render: (text, record) => {
          return getOrderInfo(record.id).goodsDesc;
        },
      },
      {
        title: '售价(元)',
        dataIndex: 'orderPrice',
      },
      {
        title: '服务时长(分钟)',
        render: (text, record) => {
          return getOrderInfo(record.id).serviceTime;
        },
      },
      {
        title: '订单状态',
        render: (text, record) => {
          const status = config.orderStatus.find(i => i.id === record.orderStatus);
          return (status && status.name) || '';
        },
      },
      {
        title: '下单时间',
        dataIndex: 'orderTime',
      },
      {
        title: '订单状态更新时间',
        dataIndex: 'statusUpdateTime',
      },
      {
        title: '报告更新时间',
        dataIndex: 'reportUpdateTime',
      },
    ];
    return (
      <Card title="订单信息">
        <Table
          size="small"
          columns={columns}
          dataSource={data.orders}
          pagination={false}
        />
      </Card>
    );
  }
  renderRemark = () => {
    const { data } = this.props;
    return (
      <Card title="备注" >
        <div className="remark">
          {data.order.remark}
        </div>
      </Card>
    );
  }
  renderAlert = () => {
    const { data } = this.props;
    const totalCount = data.orders.length;
    const serviceTime = data.ordersInfos.reduce((sum, value) => {
      return MathTool.sum(sum, value.serviceTime || 0);
    }, 0);
    const totalPay = data.orders.reduce((sum, value) => {
      return MathTool.sum(sum, value.orderPrice || 0);
    }, 0);
    return (
      <Alert
        message={(
          <div>
            <Row>
              <Col>
                共{totalCount}项服务，服务时长{serviceTime}分钟，应支付金额{totalPay}元
              </Col>
            </Row>
          </div >
        )}
        type="info"
        showIcon
      />
    );
  }
  render() {
    const { title, visible, width, onClose, data } = this.props;
    const { footer } = this.state;

    return (
      <Modal
        title={title}
        width={width}
        visible={visible}
        footer={footer}
        className={styles.modal}
        onCancel={onClose}
      >
        {this.renderInfo()}
        {this.renderShift()}
        {data.baby && this.renderBaby()}
        {this.renderUser()}
        {this.renderOrders()}
        {this.renderAlert()}
        {this.renderRemark()}
      </Modal>
    );
  }
}

