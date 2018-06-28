import React, { PureComponent } from 'react';
import { Table, Modal, Card, Row, Col, Divider, Form, Button, Input, Alert } from 'antd';
import DianInfo from './inspectionReportDian';
import ManualInfo from './inspectionReportManual';
import styles from './inspectionReport.less';

const getKey = () => {
  return `key${(new Date()).valueOf()}`;
};
export default class inspectionReport extends PureComponent {
  state = {
    footer: [],
  }

  renderInfo = () => {
    const { data } = this.props;
    const columns = [
      {
        title: '合约ID',
        dataIndex: 'orderNum',
      },
      {
        title: '宝宝姓名',
        dataIndex: 'babyName',
      },
      {
        title: '宝宝性别',
        render: (text, record) => {
          return record.babySex === '0' ? '女' : record.babySex === '1' ? '男' : '';
        },
      },
      {
        title: '宝宝生日',
        dataIndex: 'babyBirthday',
      },
    ];
    return (
      <Card title="合约信息">
        <Table
          rowKey={record => record.id}
          size="small"
          columns={columns}
          dataSource={[data]}
          pagination={false}
          className="no-border"
        />
      </Card>
    );
  }

  renderOperatInfo = ({ data }) => {
    const { onReportRemarkChange, onReportApprove, onReportRetrieve, onReportPreview } = this.props;
    return (
      <div>
        <Divider className="left" dashed>操作项：{data.operationName}</Divider>
        {
          data.operationType !== '3' && data.operationType !== '4' ?
            (
              <ManualInfo
                data={data}
                onReportPreview={onReportPreview}
              />
            ) : (
              <DianInfo
                data={data}
                onReportRemarkChange={onReportRemarkChange}
                onReportApprove={onReportApprove}
                onReportRetrieve={onReportRetrieve}
              />
            )
        }
      </div>
    );
  }
  renderServiceInfo = ({ data }) => {
    return (
      <Card key={getKey()} title={`服务项${data.goodsName}`} type="inner">
        {
          data.contractGoodsResp.map((good, index) => {
            const key = `${good.goodsId}-${index}`;
            const OperatInfo = this.renderOperatInfo;
            return <OperatInfo key={key} data={good} />;
          })
        }
      </Card>
    );
  }
  renderReport = () => {
    const { data } = this.props;
    return (
      <Card title="检验报告信息">
        {
          data.goodRest.map((good, index) => {
            const key = `${good.goodsId}-${index}`;
            const ServiceInfo = this.renderServiceInfo;
            return <ServiceInfo key={key} data={good} />;
          })
        }
      </Card>
    );
  }
  render() {
    const { title, visible, width, onClose } = this.props;
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
        {this.renderReport()}
      </Modal>
    );
  }
}

