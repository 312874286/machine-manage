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
  Steps,
  Table, Badge, Menu, Dropdown, Icon, Divider
} from 'antd';
import StandardTable from '../../../components/StandardTable/index';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './MerchantGoodsInteractSampling.less';
import {getAccountMenus} from "../../../utils/authority";

const Step = Steps.Step;
const FormItem = Form.Item;
const menu = (
  <Menu>
    <Menu.Item>
      Action 1
    </Menu.Item>
    <Menu.Item>
      Action 2
    </Menu.Item>
  </Menu>
);


@connect(({ common, loading, interactSamplingSetting }) => ({
  common,
  interactSamplingSetting,
  loading: loading.models.interactSamplingSetting,
}))
@Form.create()
export default class areaSettingList extends PureComponent {
  state = {
    current: 1
  };
  componentDidMount() {
  }
  creat = () => {

  }
  render() {
    const {
      interactSamplingSetting: { list, page, unColumn },
      loading,
    } = this.props;
    const { current } = this.state
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 },
      },
    };
    const steps = [{
      title: '基本信息',
      content: '',
    }, {
      title: '商户商品信息',
      content: '',
    }, {
      title: '选择机器',
      content: '',
    }, {
      title: '规则设置',
      content: '',
    }];
    const expandedGoodsRowRender = () => {
      const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
          title: 'Action',
          dataIndex: 'operation',
          key: 'operation',
          render: (text, item) => (
            <Fragment>
              <a onClick={() => this.handleWatchClick(item)}>修改</a>
              <Divider type="vertical"/>
              <a onClick={() => this.handleWatchClick(item)}>删除</a>
            </Fragment>
          )
        },
      ];

      const data = [];
      for (let i = 0; i < 3; ++i) {
        data.push({
          key: i,
          name: `商品${i}`,
        });
      }
      return (
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      );
    };
    const expandedRowRender = () => {
      const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
          title: 'Action',
          dataIndex: 'operation',
          key: 'operation',
          render: (text, item) => (
            <Fragment>
              <a onClick={() => this.handleWatchClick(item)}>添加商品</a>
              <Divider type="vertical"/>
              <a onClick={() => this.handleWatchClick(item)}>修改</a>
              <Divider type="vertical"/>
              <a onClick={() => this.handleWatchClick(item)}>删除</a>
            </Fragment>
          )
        },
      ];

      const data = [];
      for (let i = 0; i < 3; ++i) {
        data.push({
          key: i,
          name: `店铺${i}`,
        });
      }
      return (
        <Table
          expandedRowRender={expandedGoodsRowRender}
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      );
    };

    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      // { title: 'Platform', dataIndex: 'platform', key: 'platform' },
      // { title: 'Version', dataIndex: 'version', key: 'version' },
      // { title: 'Upgraded', dataIndex: 'upgradeNum', key: 'upgradeNum' },
      // { title: 'Creator', dataIndex: 'creator', key: 'creator' },
      // { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' },
      { title: 'Action', key: 'operation',
        render: (text, item) => (
          <Fragment>
            <a onClick={() => this.handleWatchClick(item)}>添加店铺</a>
            <Divider type="vertical"/>
            <a onClick={() => this.handleWatchClick(item)}>修改</a>
            <Divider type="vertical"/>
            <a onClick={() => this.handleWatchClick(item)}>删除</a>
          </Fragment>
        )
      },
    ];

    const data = [];
    for (let i = 0; i < 3; ++i) {
      data.push({
        key: i,
        name: `商户${i}`,
        // platform: 'iOS',
        // version: '10.3.4.5654',
        // upgradeNum: 500,
        // creator: 'Jack',
        // createdAt: '2014-12-24 23:12:00',
      });
    }
    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
            <Steps current={current}>
              {steps.map(item => <Step key={item.title} title={item.title} />)}
            </Steps>
            <div className={styles.stepsContent}>
              {
                <Button onClick={() => this.creat()}>创建商户店铺商品</Button>
              }
              <Table
                className="components-table-demo-nested"
                columns={columns}
                expandedRowRender={expandedRowRender}
                dataSource={data}
                pagination={false}
                scroll={{ y: (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 100 + 80)}}

              />
            </div>
            <div className={styles.stepsAction}>
              {
                <Button onClick={() => this.next()}>取消</Button>
              }
              {
                <Button onClick={() => this.next()}>暂存</Button>
              }
              {
                current > 0
                && (
                  <Button type="primary" style={{ marginLeft: 8 }}
                          onClick={() => this.props.history.push({pathname: '/project/addBasicInteractSampling', query: {statusValue: 3}})}>
                    上一步
                  </Button>
                )
              }
              {
                current < steps.length - 1
                && <Button type="primary"
                           onClick={() => this.props.history.push({pathname: '/project/addMachineInteractSampling', query: {statusValue: 3}})}>下一步</Button>
              }
            </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
