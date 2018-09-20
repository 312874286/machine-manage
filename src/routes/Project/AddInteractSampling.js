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
  render() {
    const {
      interactSamplingSetting: { list, page, unColumn },
      loading,
    } = this.props;
    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
          <Steps current={1}>
            <Step title="Finished" description="This is a description." />
            <Step title="In Progress" description="This is a description." />
            <Step title="Waiting" description="This is a description." />
          </Steps>
        </Card>
      </PageHeaderLayout>
    );
  }
}
