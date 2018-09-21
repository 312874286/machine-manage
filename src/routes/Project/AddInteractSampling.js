import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Select,
  Input,
  DatePicker,
  Steps
} from 'antd';
import StandardTable from '../../components/StandardTable/index';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './InteractSamplingSetting.less';
import {getAccountMenus} from "../../utils/authority";

const Step = Steps.Step;
const FormItem = Form.Item;

@connect(({ common, loading, interactSamplingSetting }) => ({
  common,
  interactSamplingSetting,
  loading: loading.models.interactSamplingSetting,
}))
@Form.create()
export default class areaSettingList extends PureComponent {
  state = {
  };
  componentDidMount() {
  }
  saveFormRef = (form) => {
    this.form = form;
  }
  render() {
    const {
      interactSamplingSetting: { list, page, unColumn },
      loading,
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const { getFieldDecorator } = this.form;
    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
          <Steps current={0}>
            <Step title="基本信息" description="" >
              <Form onSubmit={this.handleSearch} ref={this.saveFormRef}>
                <FormItem {...formItemLayout} label="活动名称">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, whitespace: true, message: '请输入活动名称' }],
                  })(<Input placeholder="请输入活动名称" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="活动编码">
                  {getFieldDecorator('code', {
                    rules: [{ required: true, whitespace: true, message: '请输入活动编码' }],
                  })(<Input placeholder="请输入活动编码" />)}
                </FormItem>
                {/*<FormItem {...formItemLayout} label="活动类型">*/}
                  {/*{getFieldDecorator('type', {*/}
                    {/*rules: [{ required: true, message: '请选择活动类型' }],*/}
                  {/*})(*/}
                    {/*<Select placeholder="请选择">*/}
                      {/*{activityType.map((item) => {*/}
                        {/*return (*/}
                          {/*<Option value={item.id} key={item.id}>{item.name}</Option>*/}
                        {/*);*/}
                      {/*})}*/}
                    {/*</Select>*/}
                  {/*)}*/}
                {/*</FormItem>*/}
                {/*<FormItem {...formItemLayout} label="是否入会" style={{ display: selectTypeValue === 0 ? 'none' : ''}}>*/}
                {/*{getFieldDecorator('isVip', {*/}
                {/*rules: [{ required: false, message: '请选择是否入会' }],*/}
                {/*})(*/}
                {/*<Select placeholder="请选择是否入会">*/}
                {/*{isVip.map((item) => {*/}
                {/*return (*/}
                {/*<Option value={item.id} key={item.id}>{item.name}</Option>*/}
                {/*);*/}
                {/*})}*/}
                {/*</Select>*/}
                {/*)}*/}
                {/*</FormItem>*/}
                <div style={{ padding: 0, border: '1px solid #ececec', paddingLeft: '10px', marginBottom: '20px' }}>
                  <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
                    <Col md={10} sm={24}>
                      <FormItem label="选择商户">
                        {getFieldDecorator('sellerId')(
                          <Select placeholder="请选择商户" onSelect={onSelect}>
                            {merchantLists.map((item) => {
                              return (
                                <Option value={item.id} key={item.id}>{item.merchantName}</Option>
                              );
                            })}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col md={2} sm={24} style={{ paddingLeft: '3px' }}>
                    </Col>
                  </Row>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('machine')(
                      <div style={{ display: 'flex' }}>
                        <div>
                          <Alert
                            message={(
                              <div>
                                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys ? selectedRowKeys.length : 0}/{sourceData ? sourceData.length : 0} </a> 项
                              </div>
                            )}
                            type="info"
                            showIcon
                          />
                          <Table
                            rowKey={record => record.id}
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={sourceData}
                            id="leftTable"
                            style={{ width: '350px', marginBottom: '20px', marginTop: '10px' }}
                            scroll={{ y: 200 }}
                            pagination={false}
                          />
                          <Button onClick={() => addData()} style={{ display: selectAll ? 'block' : 'none' }}>
                            添加
                          </Button>
                        </div>
                        <div style={{ marginLeft: '20px' }}>
                          <Alert
                            message={(
                              <div>
                                已有 <a style={{ fontWeight: 600 }}>{targetData.length}</a> 项
                              </div>
                            )}
                            type="success"
                            showIcon
                          />
                          <Table
                            rowKey={record => record.id}
                            columns={columnsRight}
                            dataSource={targetData}
                            id="rightTable"
                            style={{ width: '350px', marginTop: '10px' }}
                            scroll={{ y: 200 }}
                            pagination={false}/>
                        </div>
                      </div>
                    )}
                  </FormItem>
                </div>
                <FormItem {...formItemLayout} label="备注描述">
                  {getFieldDecorator('remark')(<TextArea placeholder="请输入备注描述" autosize={{ minRows: 2, maxRows: 6 }} />)}
                </FormItem>
                <FormItem>
                  <div className={styles.VipModalBox} style={{ display: selectTypeValue === 0 ? 'none' : ''}}>
                    {/*<FormItem label="不入会无需填写访问码">*/}
                    <VipModal
                      initData={goodsInitData}
                      count={goodsCount}
                      clist={goodsLists}
                      shopClist={shopClist}
                      shopHandle={shopHandle}
                      goodsHandle={goodsHandle}
                      goodsHandleAdd={goodsHandleAdd}
                      goodsHandleDelete={goodsHandleDelete}
                      goodsHandleChange={goodsHandleChange}
                      couponsShow={!couponsShow}
                      maxNumber={maxNumber}
                    />
                    {/*</FormItem>*/}
                  </div>
                </FormItem>
              </Form>
            </Step>
            <Step title="商户商品信息" description="" />
            <Step title="选择机器" description="" />
            <Step title="规则设置" description="" />
          </Steps>
        </Card>
      </PageHeaderLayout>
    );
  }
}
