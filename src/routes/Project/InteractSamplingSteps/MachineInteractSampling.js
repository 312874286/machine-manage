import React, { PureComponent, Fragment } from "react";
import { connect } from "dva";
import moment from "moment";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Popconfirm,
  Input,
  DatePicker,
  Steps,
  Table,
  Modal
} from "antd";
import MachinePlanTable from "../../../components/Project/InteractSamplingSteps/MachinePlan/MachinePlanTable";
import MachineConfigCard from "../../../components/Project/InteractSamplingSteps/MachinePlan/MachineConfigCard";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import styles from "./BasicInteractSampling.less";
import { cloneByJSON } from "../../../utils/utils.js";

const Step = Steps.Step;

@connect(({ common, loading, interactSamplingSetting }) => ({
  common,
  interactSamplingSetting,
  loading: loading.models.interactSamplingSetting
}))
@Form.create()
export default class MachineInteractSampling extends PureComponent {
  state = {
    current: 2,
    interactSampling: null,
    interactInfo: null,
    goodsList: [],
    keyword: null,
    machinesData: [],
    machineModalVisible: false,
    machineModalDatas: [],
    machineModalData: null,
    machineModalAddedData: [],
    machineModalType: 0,
    goodsModalVisible: false,
    goodsModalMachineData: []
  };
  componentDidMount() {
    this.setState(
      {
        interactSampling: this.props.match.params.id
      },
      () => {
        this.getMachineList();
        this.getInteractInfo();
      }
    );
  }
  handleUpdateMachine = record => {
    this.setState({
      machineModalVisible: true,
      machineModalData: record
    });
  };
  handleDeleteMachine = record => {
    this.props
      .dispatch({
        type: "interactSamplingSetting/deleteInteractMachine",
        payload: {
          params: {
            interactId: this.state.interactSampling,
            machineId: record.machineId
          }
        }
      })
      .then(res => {
        if (res && res.code === 0) {
          this.getMachineList();
        }
      });
  };
  handleDeleteGoods = record => {
    this.props
      .dispatch({
        type: "interactSamplingSetting/deleteInteractMachineGoods",
        payload: {
          params: {
            interactId: this.state.interactSampling,
            machineId: record.machineId,
            goodsId: record.goodsId
          }
        }
      })
      .then(res => {
        if (res && res.code === 0) {
          this.getMachineList();
        }
      });
  };
  handleExpand = (indent, record) => {
    if (indent) {
      this.props
        .dispatch({
          type: "interactSamplingSetting/getInteractMachineGoods",
          payload: {
            params: {
              interactId: this.state.interactSampling,
              machineId: record.machineId
            }
          }
        })
        .then(res => {
          if (res && res.code === 0) {
            const machinesData = [...this.state.machinesData];
            machinesData
              .filter(m => m.machineId === record.machineId)
              .forEach(m => {
                m.goodsList = (res.data || []).map(d => {
                  return { machineId: record.machineId, ...d };
                });
              });
            this.setState({ machinesData });
          }
        });
    }
  };
  handelChoiceMachineClick() {
    this.setState({
      machineModalVisible: true,
      machineModalData: null
    });
  }
  handelMachineSearchClick() {
    this.props
      .dispatch({
        type: "interactSamplingSetting/getInteractMachineList",
        payload: {
          params: {
            interactId: this.state.interactSampling,
            keyword: this.state.keyword
          }
        }
      })
      .then(res => {
        if (res && res.code === 0) {
          this.setState({
            machinesData: res.data
          });
        }
      });
  }
  handleMachineSearch(dates, keyword) {
    this.props
      .dispatch({
        type: "interactSamplingSetting/getInteractMachineList",
        payload: {
          params: {
            interactId: this.state.interactSampling,
            keyword: keyword,
            queryStartTime: dates[0],
            queryEndTime: dates[1]
          }
        }
      })
      .then(res => {
        if (res && res.code === 0) {
          this.setState({
            machineModalDatas: res.data
          });
        }
      });
  }
  handleMachineAdd(times, machines) {
    const datas = [...machines].map(m => {
      const planTime = m.machineActivity.filter(ma => ma.isNew).map(ma => {
        return {
          startTime: ma.startTime,
          endTime: ma.endTime
        };
      });
      return {
        machineId: m.machineId,
        machineCode: m.machineCode,
        state: m.secular ? 1 : 0,
        planTime
      };
    });
    this.props
      .dispatch({
        type: "interactSamplingSetting/addInteractMachine",
        payload: {
          params: {
            interactId: this.state.interactSampling,
            machines: datas,
            ...times
          }
        }
      })
      .then(res => {
        if (res && res.code === 0) {
          this.setState({
            machineModalAddedData: machines
          });
        }
      });
  }
  handleMachineModalVisible() {
    this.setState(
      {
        machineModalVisible: false,
        machineModalDatas: [],
        machineModalAddedData: []
      },
      () => {
        this.getMachineList();
      }
    );
  }
  handleSelectedGoodsChange(e) {
    const goods = [...this.state.goodsList];
    goods.filter(g => g.id === e.target.value).forEach(good => {
      good.checked = e.target.checked;
    });
    this.setState({ goodsList: goods });
  }
  handleGoodsExpireChange(e) {
    const goods = [...this.state.goodsList];
    goods.filter(g => g.id === e.target.value).forEach(good => {
      good.secular = e.target.checked;
      if (good.secular) {
        good.startTime = moment();
        good.startTimeStr = moment().format("YYYY-MM-DD 00:00:00");
        good.endTime = null;
        good.endTimeStr = null;
      }
    });
    this.setState({ goodsList: goods });
  }
  handleGoodsExpireDateChange(date, dateStr, good, typeCode) {
    const goods = [...this.state.goodsList];
    const type = typeCode === 0 ? "startTime" : "endTime";
    const time = typeCode === 0 ? "00:00:00" : "23:59:59";
    goods.filter(g => g.id === good.id).forEach(good => {
      good[type] = date;
      good[`${type}Str`] = `${dateStr} ${time}`;
    });
    this.setState({ goodsList: goods });
  }
  handleGoodsInputChange(value, type, good) {
    const goods = [...this.state.goodsList];
    goods.filter(g => g.id === good.id).forEach(good => {
      good[type] = value;
    });
    this.setState({ goodsList: goods });
  }
  handleGoodsModalVisible() {
    this.setState({ goodsModalVisible: false, goodsModalMachineData: [] });
  }
  handleGoodAdd(machines) {
    this.setState({ goodsModalMachineData: machines }, () => {
      this.props
        .dispatch({
          type: "interactSamplingSetting/getInteractGoodsList",
          payload: {
            params: {
              interactId: this.state.interactSampling
            }
          }
        })
        .then(res => {
          if (res && res.code === 0) {
            this.setState({
              goodsList: res.data,
              goodsModalVisible: true
            });
          }
        });
    });
  }
  handleGoodsModalSave() {
    const goods = this.state.goodsList.map(g => {
      return {
        goodsId: g.id,
        number: g.setCount,
        seq: g.setOrder,
        state: g.secular ? 1 : 0,
        startTimeStr: g.startTimeStr,
        endTimeStr: g.endTimeStr
      };
    });
    const machines = this.state.goodsModalMachineData.map(m => m.machineId);
    const params = {
      interactId: this.state.interactSampling,
      machines,
      goods
    };
    this.props
      .dispatch({
        type: "interactSamplingSetting/addInteractMachineGoods",
        payload: {
          params
        }
      })
      .then(res => {
        if (res && res.code === 0) {
          this.setState({
            goodsModalVisible: false
          });
        }
      });
  }
  getMachineList() {
    this.props
      .dispatch({
        type: "interactSamplingSetting/getInteractHavingMachineList",
        payload: {
          params: {
            interactId: this.state.interactSampling,
            keyword: this.state.keyword
          }
        }
      })
      .then(res => {
        if (res && res.code === 0) {
          this.setState({
            machinesData: res.data
          });
        }
      });
  }
  getInteractInfo() {
    this.props
      .dispatch({
        type: "interactSamplingSetting/interactDetail",
        payload: {
          params: {
            id: this.state.interactSampling
          }
        }
      })
      .then(data => {
        this.setState({
          interactInfo: data
        });
      });
  }
  renderExpandedRow(machine, isExpanded) {
    if (isExpanded) {
      const columns = [
        { title: "商品名称", dataIndex: "goodsName" },
        { title: "商品数量", dataIndex: "number" },
        {
          title: "操作",
          render: record => {
            return (
              <Fragment>
                <Popconfirm
                  title="确定要删除吗"
                  onConfirm={() => {
                    this.handleDeleteGoods(record);
                  }}
                  okText="确定"
                  cancelText="取消"
                >
                  <a>删除</a>
                </Popconfirm>
              </Fragment>
            );
          }
        }
      ];
      return (
        <Table
          rowKey="goodsId"
          columns={columns}
          dataSource={machine.goodsList}
          pagination={false}
        />
      );
    } else {
      return null;
    }
  }
  renderGoods() {
    return (
      <div>
        {this.state.goodsList.map(g => {
          return (
            <div>
              <Row gutter={5} style={{ marginBottom: 10 }}>
                <Col span={6}>
                  <label>
                    <input
                      type="checkbox"
                      checked={g.checked}
                      value={g.id}
                      onChange={this.handleSelectedGoodsChange.bind(this)}
                    />
                    {g.name}
                  </label>
                </Col>
                <Col span={9}>
                  <Input
                    value={g.setCount}
                    onChange={e => {
                      this.handleGoodsInputChange(
                        e.target.value,
                        "setCount",
                        g
                      );
                    }}
                    placeholder="每个机器的商品数量"
                  />
                </Col>
                <Col span={9}>
                  <Input
                    value={g.setOrder}
                    onChange={e => {
                      this.handleGoodsInputChange(
                        e.target.value,
                        "setOrder",
                        g
                      );
                    }}
                    placeholder="商品排序"
                  />
                </Col>
              </Row>
              {g.checked && (
                <Row gutter={5} style={{ marginBottom: 10 }}>
                  <Col span={4} offset={2}>
                    <label>
                      <input
                        type="checkbox"
                        checked={g.secular}
                        value={g.id}
                        onChange={this.handleGoodsExpireChange.bind(this)}
                      />
                      长期
                    </label>
                  </Col>
                  <Col span={9}>
                    <DatePicker
                      placeholder="开始时间"
                      format="YYYY-MM-DD"
                      style={{ width: "100%" }}
                      value={g.startTime}
                      disabled={g.secular}
                      onChange={(date, dateStr) => {
                        this.handleGoodsExpireDateChange(date, dateStr, g, 0);
                      }}
                    />
                  </Col>
                  <Col span={9}>
                    <DatePicker
                      placeholder="结束时间"
                      format="YYYY-MM-DD"
                      style={{ width: "100%" }}
                      value={g.endTime}
                      disabled={g.secular}
                      onChange={(date, dateStr) => {
                        this.handleGoodsExpireDateChange(date, dateStr, g, 1);
                      }}
                    />
                  </Col>
                </Row>
              )}
            </div>
          );
        })}
      </div>
    );
  }
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
            <Row gutter={5} style={{ marginBottom: 15 }}>
              <Col span={6}>
                <Input
                  value={this.state.keyword}
                  onChange={e => {
                    this.setState({ keyword: e.target.value });
                  }}
                  placeholder="搜索机器点位/编号"
                />
              </Col>
              <Col span={6}>
                <Button type="primary" onClick={this.getMachineList.bind(this)}>
                  查询
                </Button>
                &nbsp;
                <Button onClick={this.handelChoiceMachineClick.bind(this)}>
                  选择机器
                </Button>
              </Col>
            </Row>
            <MachinePlanTable
              loading={loading}
              dataSource={this.state.machinesData}
              onExpand={this.handleExpand.bind(this)}
              renderExpandedRow={this.renderExpandedRow.bind(this)}
              onDeleteMachine={this.handleDeleteMachine.bind(this)}
              onUpdateMachine={this.handleUpdateMachine.bind(this)}
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
        <Modal
          title="选择机器"
          visible={this.state.machineModalVisible}
          onCancel={this.handleMachineModalVisible.bind(this)}
          width={800}
          destroyOnClose={true}
          maskClosable={false}
          footer={false}
        >
          <MachineConfigCard
            data={this.state.machineModalData}
            datas={this.state.machineModalDatas}
            postDatas={this.state.machineModalAddedData}
            onAddMachine={this.handleMachineAdd.bind(this)}
            onAddGoods={this.handleGoodAdd.bind(this)}
            onSearch={this.handleMachineSearch.bind(this)}
            interactInfo={this.state.interactInfo}
          />
        </Modal>
        <Modal
          title="关联商品"
          visible={this.state.goodsModalVisible}
          onCancel={this.handleGoodsModalVisible.bind(this)}
          onOk={this.handleGoodsModalSave.bind(this)}
          destroyOnClose={true}
          maskClosable={false}
          width={500}
          className="center-footer"
        >
          <div style={{ margin: 10 }}>
            <div style={{ margin: "0 0 15px" }}>
              机器编号：
              {this.state.goodsModalMachineData.map(m => (
                <span style={{ margin: "0 5px" }}>{m.machineCode}</span>
              ))}
            </div>
            {this.renderGoods()}
          </div>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
