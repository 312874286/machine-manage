import React, { PureComponent } from 'react';
import { Table, Form, Button, Input, Alert } from 'antd';

const FormItem = Form.Item;
const dianReportFieldMap = {
  // partyInspectionId: '检验单id',
  project: '项目名称',
  projectEn: '项目简称',
  result: '结果',
  prompt: '提示',
  unit: '单位',
  range: '参考区间',
  remark: '备注',
  concentration: '浓度',
  level: '等级',
  func: '方法学',
};
const renderOperatDianResultTable = ({ data }) => {
  const columns = [];
  if (data && data.length > 0) {
    data.forEach((item) => {
      for (const k in item) {
        if (
          k !== 'partyInspectionId'
          && k !== 'id'
          && !columns.find(i => i.dataIndex === k)
        ) {
          columns.push({
            title: dianReportFieldMap[k],
            dataIndex: k,
            render: (text, record) => {
              return record[k] || '-';
            },
          });
        }
      }
    });
  }

  return (
    <Table
      size="small"
      rowKey={record => record.id}
      dataSource={data}
      columns={columns}
      pagination={false}
    />
  );
};
export default class inspectionReportDianInfo extends PureComponent {
  state = {
    remark: '',
  }
  componentDidMount = () => {
    const { data: { partyInspection } } = this.props;
    this.setState({ remark: (partyInspection && partyInspection.remark) || '' });
  }
  onReportRemarkChange = () => {
    const { remark } = this.state;
    const { data: { orderOperationId } } = this.props;
    this.props.onReportRemarkChange({ productNum: orderOperationId, remark });
  }
  onReportApprove = () => {
    const { data: { partyInspection: { id } } } = this.props;
    this.props.onReportApprove({ id });
  }
  onReportRetrieve = () => {
    const { data: { partyInspection: { id } } } = this.props;
    this.props.onReportRetrieve({ id });
  }
  render() {
    const { remark } = this.state;
    const { data } = this.props;
    const partyInspection = data.partyInspection || {};
    const DianResultTable = renderOperatDianResultTable;
    return (
      <div>
        <div className="ant-form ant-form-inline">
          <FormItem label="条码号">{partyInspection.refId || '-/-'}</FormItem>
          <FormItem label="送检项目">{partyInspection.itemName || '-/-'}</FormItem>
          <FormItem label="样本类型">{partyInspection.sampleType || '-/-'}</FormItem>
          <FormItem label="样本状态">{partyInspection.sampleStatus || '-/-'}</FormItem>
          {partyInspection.status === 3 && <FormItem label="审核人">{partyInspection.checkNameErp || '-/-'}</FormItem>}
          {partyInspection.status === 3 && <FormItem label="审核时间">{partyInspection.reportTimeErp || '-/-'}</FormItem>}
          {partyInspection.status !== 3 && <FormItem><Button type="primary" onClick={this.onReportApprove}>审核通过</Button></FormItem>}
          <FormItem><Button onClick={this.onReportRetrieve}>重新获取报告</Button></FormItem>
        </div>
        <div style={{ marginTop: 16 }}>
          <DianResultTable data={data.partyInspectionReports} />
        </div>
        <div style={{ marginTop: 16 }}>
          <Alert
            message={(
              <div>
                备注：本结果只对此条码来样负责，如有疑问，请在报告日期一周内提出。
              </div >
            )}
            type="info"
            showIcon
          />
        </div>
        <div className="ant-form ant-form-inline" style={{ marginTop: 16 }}>
          <FormItem label="检验人员">{partyInspection.examiner}</FormItem>
          <FormItem label="审核人员">{partyInspection.checkName}</FormItem>
          <FormItem label="采样时间">{partyInspection.gatherTime}</FormItem>
          <FormItem label="检验时间">{partyInspection.receiveTime}</FormItem>
          <FormItem label="报告时间">{partyInspection.reportTime}</FormItem>
        </div>
        <div style={{ marginTop: 16 }}>
          <Input.TextArea rows={3} placeholder="可再此处输入指标说明（选填）" value={remark} onChange={(e) => { this.setState({ remark: e.target.value }); }} />
        </div>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Button onClick={this.onReportRemarkChange}>保存指标说明</Button>
        </div>
      </div>
    );
  }
}

