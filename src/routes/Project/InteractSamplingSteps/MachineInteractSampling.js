import React, { PureComponent, Fragment } from "react";
import { connect } from "dva";
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
  Table,
  Modal
} from "antd";
import MachinePlanTable, {
  MachinePlanedGoodsTable
} from "../../../components/Project/InteractSamplingSteps/MachinePlan/MachinePlanTable";
import MachineConfigCard from "../../../components/Project/InteractSamplingSteps/MachinePlan/MachineConfigCard";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import styles from "./BasicInteractSampling.less";

const Step = Steps.Step;

@connect(({ common, loading, interactSamplingSetting }) => ({
  common,
  interactSamplingSetting,
  loading: loading.models.interactSamplingSetting
}))
@Form.create()
export default class areaSettingList extends PureComponent {
  state = {
    current: 2,
    interactSampling: "",
    modalVisible: false,
    machinesData: [
      {
        id: "b0a4f9c3d3564dde952213606a2ce1de",
        machineId: "681fd2a6f6c84d40870436fea1854dbd",
        machineCode: "18884154",
        localDesc: "北京市北京市东城区278797987989899景山公园歪脖树下",
        machineActivity: []
      },
      {
        id: "b0a4f9c3d3564dde952213606a2ce1da",
        machineId: "681fd2a6f6c84d40870436fea1854dba",
        machineCode: "18884155",
        localDesc: "北京市北京市东城区278797987989899景山公园歪脖树下",
        machineActivity: []
      }
    ],
    machineList: [
      {
        id: "6b4cd639883d42999254878b52b1cc20",
        machineCode: "18978050",
        localDesc: "北京市北京市西城区小西天灯市口",
        machineActivity: [
          {
            activityName: "测试别删",
            startTime: "2018-07-25 00:00:00",
            endTime: "2018-07-29 00:00:59"
          }
        ]
      },
      {
        id: "123",
        machineCode: "123",
        localDesc: "天津市天津市和平区鞍山道沿线大沽口",
        machineActivity: [
          {
            activityName: "测试别删",
            startTime: "2018-07-16 09:00:00",
            endTime: "2018-10-06 23:00:00"
          }
        ]
      },
      {
        id: "6893a2ada9dd4f7eb8dc33adfc6eda73",
        machineCode: "18022789",
        localDesc: "北京市北京市西城区小西天灯市口",
        machineActivity: [
          {
            activityName: "测试别删",
            startTime: "2018-07-31 00:00:00",
            endTime: "2018-08-03 23:59:59"
          }
        ]
      }
    ]
  };
  componentDidMount() {
    this.setState({
      interactSampling: this.props.match.params.id
    });
  }
  handleUpdateMachine = record => {
    console.log(record);
  };
  renderExpandedRow = (record, isExpanded) => {
    if (isExpanded) {
      return (
        <MachinePlanedGoodsTable
          dataSource={[
            {
              id: "def57309fb624f90a89ab1ba6e1550ae",
              interactMachineId: "b0a4f9c3d3564dde952213606a2ce1de",
              goodsId: "64747d97fe9a4095918619ce4a3d4b33",
              number: 1000,
              seq: 1,
              startTime: "2018-09-26 23:59:59",
              endTime: "2018-09-26 23:59:59",
              state: 0,
              type: 0,
              goodsName: "清风2层100抽",
              startTimeStr: null,
              endTimeStr: null
            }
          ]}
        />
      );
    }
  };
  render() {
    const {
      interactSamplingSetting: { list, page, unColumn },
      loading
    } = this.props;
    const { current } = this.state;
    const steps = [
      {
        title: "基本信息",
        content: ""
      },
      {
        title: "商户商品信息",
        content: ""
      },
      {
        title: "选择机器",
        content: ""
      },
      {
        title: "规则设置",
        content: ""
      }
    ];
    return (
      <PageHeaderLayout>
        <Card
          bordered={false}
          bodyStyle={{ marginBottom: "10px", padding: "15px 32px 0" }}
        >
          <Steps current={current}>
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>

          <div className={styles.stepsContent}>
            <MachinePlanTable
              dataSource={this.state.machinesData}
              renderExpandedRow={this.renderExpandedRow}
              onDeleteMachine={this.handleDeleteMachine}
              onUpdateMachine={this.handleUpdateMachine}
            />
          </div>
          <div className={styles.stepsAction}>
            {
              <Button
                onClick={() =>
                  this.props.history.push({
                    pathname: "/project/sampling-setting"
                  })
                }
              >
                取消
              </Button>
            }
            {
              <Button
                onClick={() =>
                  this.props.history.push({
                    pathname: "/project/sampling-setting"
                  })
                }
              >
                暂存
              </Button>
            }
            {current > 0 && (
              <Button
                type="primary"
                style={{ marginLeft: 8 }}
                onClick={() =>
                  this.props.history.push({
                    pathname: `/project/addMerchantGoodsInteractSampling/${
                      this.state.interactSampling
                    }`
                  })
                }
              >
                上一步
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button
                type="primary"
                onClick={() =>
                  this.props.history.push({
                    pathname: `/project/addRuleInteractSampling/${
                      this.state.interactSampling
                    }`
                  })
                }
              >
                下一步
              </Button>
            )}
          </div>
        </Card>
        <Modal title="选择机器" visible={false} width={1000}>
          <MachineConfigCard />
        </Modal>
      </PageHeaderLayout>
    );
  }
}
