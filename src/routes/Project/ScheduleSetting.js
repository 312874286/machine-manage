import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Cascader,
  Popconfirm,
  Tree,
  Radio,
  Table,
} from 'antd';
import GoodsTableField from '../../components/GoodsTableField';
import DiscountDynamicField from '../../components/DiscountDynamicField';
import ScheduleTable from '../../components/ScheduleTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ScheduleSetting.less';
import LogModal from '../../components/LogModal';
import { setTimeout } from 'timers';


const FormItem = Form.Item;
const { TextArea } = Input
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['processing', 'default', 'success', 'error'];
const status = ['运行中', '关闭', '已上线', '异常'];
const RangePicker = DatePicker.RangePicker;
const TreeNode = Tree.TreeNode;
const couponsInitData = [{
  resultRemark: '当游戏得分超过90，掉落此商品',
  code: '123455',
  prizeType: '优惠券01 ',
  resultCode: 1,
  name: '优惠券01',
}]


const CreateForm = Form.create()(
  (props) => {
    const { modalVisible, form, handleAdd, handleModalVisible, editModalConfirmLoading, modalType,
      verifyTimeRequire, gameLists, activityLists, openSelectMachineModal, selectCityName, machineNum,
      goodsInitData, couponsInitData, goodsHandle, goodsHandleAdd, discountHandle, modalData, onSelectShop, goodsLists
    } = props;
    // const okHandle = () => {
    //   form.validateFields((err, fieldsValue) => {
    //     if (err) return;
    //     form.resetFields();
    //     handleAdd(fieldsValue);
    //   });
    // };
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    return (
      <Modal
        title={!modalType ? '编辑排期' : '新增排期'}
        visible={modalVisible}
        onOk={handleAdd}
        onCancel={() => handleModalVisible()}
        confirmLoading={editModalConfirmLoading}
        width={800}
      >
        <Form onSubmit={this.handleSearch}>
          <FormItem {...formItemLayout} label="选择活动">
            {getFieldDecorator('activityId', {
              rules: [{ required: true, message: '请选择活动' }],
            })(
              <Select placeholder="请选择" onSelect={onSelectShop}>
                {activityLists.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>{item.name}</Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="选择时间">
            {getFieldDecorator('rangeTime', {
              rules: [{ type: 'array', required: true, message: '请选择时间' }],
            })(
              <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="选择机器">
            {getFieldDecorator('remark', {
              rule: [{ validator: verifyTimeRequire }],
            }) ((modalData.id) ? (
              <div>{modalData.remark ? modalData.remark : '测试暂无'}</div>) : (
              <div>
                { selectCityName.length > 0 ? '已选择' + machineNum + '台机器，分别位于' + selectCityName.join('、') : '' }
                <Button type="primary" onClick={openSelectMachineModal}>+ 选择</Button>
              </div>
              ))
            }
          </FormItem>
          <FormItem {...formItemLayout} label="选择游戏">
            {getFieldDecorator('gameId', {
              rules: [{ required: true, message: '请选择游戏' }],
            })(
              <Select placeholder="请选择">
                {gameLists.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>{item.name}</Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="同一用户获得商品次数">
            {getFieldDecorator('userMaxTimes', {
              rules: [{ required: true, whitespace: true, message: '请填写同一用户获得商品次数' }],
            })(<Input placeholder="请填写同一用户获得商品次数" />)}
          </FormItem>
          <FormItem label="填写商品信息">
            <GoodsTableField initData={goodsInitData} clist={goodsLists} goodsHandle={goodsHandle} goodsHandleAdd={goodsHandleAdd} />
          </FormItem>
          <FormItem label="填写优惠券信息">
            <DiscountDynamicField initData={couponsInitData} discountHandle={discountHandle} />
          </FormItem>
        </Form>
      </Modal>
    );
});
const SelectMachineForm = Form.create()(
  (props) => {
    const { editMachineModalVisible, form, onEditMachineHandleAddClick, onEditMachineHandleModalVisibleClick, editMachineEditModalConfirmLoading,
    renderTreeNodes, treeData, onLoadData, onExpand, expandedKeys, autoExpandParent, checkedKeys, selectedKeys, onCheck, onSelect, } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <Modal
        title="选择机器"
        visible={editMachineModalVisible}
        onOk={onEditMachineHandleAddClick}
        onCancel={() => onEditMachineHandleModalVisibleClick()}
        confirmLoading={editMachineEditModalConfirmLoading}
        width={800}
      >
        <Form onSubmit={this.handleSearch}>
          <FormItem {...formItemLayout} label="选择机器">
            {getFieldDecorator('machine', {
              rules: [{ type: 'array', required: true, message: '请选择机器' }],
            })(
              <Tree
                loadData={onLoadData}
                checkable
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onCheck={onCheck}
                checkedKeys={checkedKeys}
                onSelect={onSelect}
                selectedKeys={selectedKeys}
              >
                {renderTreeNodes(treeData)}
              </Tree>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
});
const WatchForm = Form.create()(
  (props) => {
    const { watchModalVisible, modalData, handleWatchModalVisible, goodsList, couponsList, watchDetailClick } = props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const goodsColumns = [{
      title: '商品名称',
      dataIndex: 'prizeId',
      align: 'center',
    }, {
      title: '规则',
      dataIndex: 'resultCode',
      align: 'center',
    }, {
      title: '规则描述',
      dataIndex: 'resultRemark',
      align: 'center',
    }];
    const couponsColumns = [{
      title: '优惠券编号',
      dataIndex: 'code',
      align: 'center',
    }, {
      title: '优惠券名称',
      dataIndex: 'name',
      align: 'center',
    }, {
      title: '规则',
      dataIndex: 'resultCode',
      align: 'center',
    }, {
      title: '规则描述',
      dataIndex: 'resultRemark',
      align: 'center',
    }];
    return (
      <Modal
        title="查看排期"
        visible={watchModalVisible}
        onCancel={() => handleWatchModalVisible()}
        footer={null}
        width={900}
      >
        <Form>
          <FormItem {...formItemLayout} label="活动名称">
            <span>{modalData.activityName}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="所属商户">
            <span>{modalData.merchantName}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="所属店铺">
            <span>{modalData.shopName}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="活动时间">
            <span>{modalData.startTime} - {modalData.endTime}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="机器">
            <span>{modalData.remark}</span>
            <a onClick={() => watchDetailClick(modalData.id)}>查看详情</a>
          </FormItem>
          <FormItem {...formItemLayout} label="游戏">
            <span>{modalData.gameName}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="同一用户获得商品次数">
            <span>{modalData.userMaxTimes}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="商品信息">
            <Table columns={goodsColumns} dataSource={goodsList} rowKey={record => record.prizeId} pagination={false} />
          </FormItem>
          <FormItem {...formItemLayout} label="优惠券信息">
            <Table columns={couponsColumns} dataSource={couponsList} rowKey={record => record.code} pagination={false} />
          </FormItem>
        </Form>
      </Modal>
    );
  });
const WatchMachine = Form.create()(
  (props) => {
    const { WatchMachineModalVisible, WatchMachineHandleModalVisibleClick, machineList } = props;
    const machineColumns = [{
      title: '机器点位',
      dataIndex: 'machineLocale',
      align: 'center',
    }, {
      title: '机器编码',
      dataIndex: 'machineCode',
      align: 'center',
    }];
    return (
      <Modal
        title="查看机器"
        width={400}
        visible={WatchMachineModalVisible}
        onCancel={() => WatchMachineHandleModalVisibleClick()}
        footer={null}
      >
        <div style={{ background: '#ECECEC', padding: '30px' }}>
          <Table columns={machineColumns} dataSource={machineList} rowKey={record => record.prizeId} pagination={false} />
        </div>
      </Modal>
    );
  });
@connect(({ common, loading, scheduleSetting }) => ({
  common,
  scheduleSetting,
  loading: loading.models.rule,
}))
@Form.create()
export default class ScheduleSettingList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    options: '',
    editModalConfirmLoading: false,
    pageNo: 1,
    keyword: '',
    modalData: {},
    code: '',
    modalType: true,
    activityLists: [],
    gameLists: [],

    editMachineModalVisible: false,
    confirmLoading: false,
    treeData: [
      // { title: 'Expand to load', key: '0' },
      // { title: 'Expand to load', key: '1' },
      // { title: 'Tree Node', key: '2', isLeaf: true },
    ],
    selectCity: [],
    selectCityName: [],
    expandedKeys: [],
    autoExpandParent: true,
    checkedKeys: [],
    selectedKeys: [],
    editMachineEditModalConfirmLoading: false,
    selectStatus: '0',

    dateList: [],
    resList: [],
    goodsLists: [],
    handleDays: {},
    startTime: '',
    getDataStartDay: '',
    endTime: '',
    getDataEndDay: '',
    machineNum: 0,

    goodsInitData: [],
    couponsInitData: [],
    machines: [],
    machineStartTime: '',
    machineEndTime: '',

    WatchMachineModalVisible: false,
    machineList: [],
  };
  componentDidMount() {
    this.getAreaList();
    // this.getLists();
  }
  // 获取城市列表
  getAreaList = () => {
    this.props.dispatch({
      type: 'common/getProvinceCityAreaTradeArea',
      payload: {
        restParams: {
          code: this.state.code,
        },
      },
    }).then( (res) => {
      this.setState({
        options: res,
      });
    });
  }
  onSelectShop = (value, option) => {
    this.getGoodsLists(value);
  }
  getActivityLists = () => {
    this.props.dispatch({
      type: 'scheduleSetting/activityList',
      payload: {
        restParams: {},
      },
    }).then((res) => {
      this.setState({
        activityLists: res,
      });
    });
  }
  getGamesLists = (shopId) => {
    this.props.dispatch({
      type: 'scheduleSetting/gameList',
      payload: {
        restParams: {
          shopId: shopId ? shopId : ''
        },
      },
    }).then((res) => {
      this.setState({
        gameLists: res,
      });
    });
  }
  getGoodsLists = (shopId) => {
    this.props.dispatch({
      type: 'scheduleSetting/getGoodsList',
      payload: {
        restParams: {
          shopId: shopId ? shopId : ''
        },
      },
    }).then((res) => {
      this.setState({
        goodsLists: res,
      }, () => {
        this.setState({
          goodsInitData: [{
            resultCode: 1,
            resultRemark: '当游戏得分超过90，掉落此商品',
            prizeType: 1,
            prizeId: this.state.goodsLists[0].id,
          }],
        }, () => {

        })
      });
    });
  }
  // 获取列表
  getLists = () => {
    this.props.dispatch({
      type: 'scheduleSetting/getScheduleSettingList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          endTime: this.state.getDataEndDay,
          startTime: this.state.getDataStartDay,
          code: this.state.code,
        },
      },
    }).then((res) => {
      console.log('time', this.state.startTime, this.state.endTime)
      console.log('startTime', this.state.getDataStartDay, this.state.getDataEndDay)
      if (this.state.startTime === this.state.getDataStartDay && this.state.endTime === this.state.getDataEndDay) {
        this.setState({
          resList: []
        });
      }
      let activityArr = []
      if (res) {
        let activityArrs = res.length > 0 ? res : this.state.resList
        if (this.state.resList.length > 0) {
          if (res.length > 0) {
            activityArrs = [...res, ...this.state.resList]
            let temp = []
            for (var i = 0; i < activityArrs.length; i++) {
              var item = activityArrs[i]
              if (!(item['id'] in temp)) {
                temp[item['id']] = item;
              }
            }
            activityArrs = Object.values(temp);
          }
        }
        console.log('activityArrs', activityArrs)
        let dateList = this.drawLine(activityArrs)
        // console.log('activityArrs', activityArrs)
        // console.log('dateList', dateList)
        this.setState({
          resList: activityArrs,
          dateList,
        }, () => {
          // console.log('activityArr', this.state.dateList);
        });
      }
      // this.setState({
      //   dateList: res,
      // });
    });
  }
  drawLine = (arr) => {
    console.log('time', this.state.startTime, this.state.endTime)
    console.log('startTime', this.state.handleDays.getDataStartDay, this.state.handleDays.getDataEndDay)
    let activityArr =[]
    let leftTmp = 0, leftNo = 0, widthTmp = 0
    console.log((this.state.startTime !== this.state.getDataStartDay) || (this.state.endTime !== this.state.getDataEndDay))
    // if ((this.state.startTime !== this.state.getDataStartDay) || (this.state.endTime !== this.state.getDataEndDay)) {
    //   leftTmp = 2.95
    //   leftNo = 1
    // }
    arr.forEach((item, index) => {
      let time = '开始时间：' + item.startTime + '--' + '结束时间: ' + item.endTime
      if (moment(item.startTime) >= moment(this.state.startTime)) {
        // 开始日期>范围的开始日期
        if (moment(item.endTime) <= moment(this.state.endTime)) {
          // 开始时间及结束日期在15天的范围
          let left = Math.floor((moment(item.startTime) - moment(this.state.startTime)) / (24 * 60 * 60 * 1000))
          let width = Math.floor((moment(item.endTime) - moment(item.startTime)) / (24 * 60 * 60 * 1000))
          // console.log('开始时间及结束日期在15天的范围', left, width, Math.round((moment(item.endTime) - moment(item.startTime)) / (24 * 60 * 60 * 1000)))
          let tmp = { left: (leftTmp + (6.5 * left)) + '%', top: (25 + (index * 4)) + '%', width: (widthTmp + (6.5 * (width + 1))) + '%', background: 'rgba(193, 229, 158, 1 )', height: '20px', Time: time, name: item.activityName, id: item.id }
          activityArr.push(tmp);
        } else {
          // 结束日期>范围的结束日期
          let left = Math.floor((moment(item.startTime) - moment(this.state.startTime)) / (24 * 60 * 60 * 1000))
          let width = Math.ceil((moment(this.state.endTime) - moment(item.startTime)) / (24 * 60 * 60 * 1000))
          // console.log('结束日期>范围的结束日期', left, width)
          let tmp = { left: (leftTmp + (6.5 * (left - leftNo))) + '%', top: (25 + (index * 4)) + '%', width: (6.5 * (width + 1)) + '%', background: 'rgba(193, 229, 158, 1 )', height: '20px', Time: time, name: item.activityName, id: item.id }
          activityArr.push(tmp);
        }
      } else {
        // 开始日期<范围的开始日期
        let left = 0, width = '';
        if (moment(item.endTime) >= moment(this.state.handleDays.endDay)) {
          // console.log('jieshu日期<范围的开始日期', left, width)
          width = Math.floor((moment(this.state.endTime) - moment(this.state.startTime)) / (24 * 60 * 60 * 1000))
          let tmp = { left: (6.5 * left) + '%', top: (25 + (index * 4)) + '%', width: (6.5 * (width + 1)) + '%', background: 'rgba(193, 229, 158, 1 )', height: '20px', Time: time, name: item.activityName, id: item.id }
          activityArr.push(tmp);
        } else {
          width = Math.floor((moment(item.endTime) - moment(this.state.startTime)) / (24 * 60 * 60 * 1000))
          // console.log('开始日期<范围的开始日期', left, width)
          let tmp = { left: (leftTmp + (6.5 * (left - leftNo))) + '%', top: (25 + (index * 4)) + '%', width: (6.5 * (width + 1)) + '%', background: 'rgba(193, 229, 158, 1 )', height: '20px', Time: time, name: item.activityName, id: item.id }
          activityArr.push(tmp);
        }
      }
    })
    return activityArr;
  }
  handleDays = (val) => {
    console.log('val', val)
    this.setState({
      handleDays: val,
      startTime: val.startDay,
      endTime: val.endDay,
      getDataStartDay: val.getDataStartDay,
      getDataEndDay: val.getDataEndDay,
    }, () => {
      this.getLists();
    });
  }
  // 验证
  verifyPhone = (rule, value, callback) => {
    const reg = /^[1][0-9][0-9]{9}$/;
    if (!reg.test(value)) {
      callback('请填写正确的手机号码');
    } else {
      callback();
    }
  }
  verifyString = (rule, value, callback) => {
    if (value.length < 4) {
      callback('请填写完整的省市区商圈');
    } else {
      callback();
    }
  }
  verifyTrim = (rule, value, callback) => {
    let v = value.replace(/(^\s*)|(\s*$)/g, '')
    if (v === '') {
      callback('不可输入空格');
    } else {
      callback();
    }
  }
  verifyTimeRequire = (rule, value, callback) => {

  }
  // 分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    const { current } = pagination;
    // console.log('params', params)
    this.setState({
      pageNo: current,
    }, () => {
      this.getLists();
    });
  };
  // 重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      pageNo: 1,
      keyword: '',
      code: '',
    });
  };

  // 搜索
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // const values = {
      //   ...fieldsValue,
      //   updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      // };
      // this.setState({
      //   formValues: values,
      // });
      this.setState({
        pageNo: 1,
        keyword: fieldsValue.keyword ? fieldsValue.keyword : '',
        code: fieldsValue.provinceCityAreaTrade ? fieldsValue.provinceCityAreaTrade[fieldsValue.provinceCityAreaTrade.length - 1] : '',
      }, () => {
        this.getLists();
      });
    });
  };
  // 添加modal 添加事件
  handleModalVisible = (flag) => {
    // activityList
    this.getActivityLists()
    // gameList
    this.getGamesLists()
    this.setState({
      goodsInitData: [{
        resultCode: 1,
        resultRemark: '当游戏得分超过90，掉落此商品',
        prizeType: 1,
        prizeId: '',
      }],
      couponsInitData: [{
        resultRemark: '当游戏得分超过90，掉落此商品',
        code: '123455',
        prizeType: '优惠券01 ',
        resultCode: 1,
        name: '优惠券01',
      }],
    }, () => {
      this.setState({
        modalVisible: !!flag,
        modalData: {},
        modalType: true,
      });
      this.setModalData();
    })
  };
  // 删除modal 删除事件
  handleDelClick = (item) => {

  }
  // 编辑modal 编辑事件
  handleEditClick = (item) => {
    this.setState({
      modalVisible: true,
      modalData: item,
      modalType: false,
    });
    this.props.dispatch({
      type: 'scheduleSetting/getScheduleSettingDetail',
      payload: {
        restParams: {
          id: item.id,
        },
      },
    }).then((res) => {
    });
  }
  // 设置modal 数据
  setModalData = (data) => {
    if (data) {
      this.form.setFieldsValue({
        rangeTime: [moment(data.createTime),moment(data.endTime)] || undefined,
        activityId: data.activityId,
        gameId: data.gameId,
        userMaxTimes: data.userMaxTimes,
      });
    } else {
      this.form.setFieldsValue({
        rangeTime: undefined,
        activityId: undefined,
        gameId: undefined,
        userMaxTimes: undefined,
      });
      this.setState({
        machineNum: '',
        selectCityName: '',
      });
    }
  }
  goodsHandle = (val) => {
    this.setState({
      goodsInitData: val,
    });
  }
  goodsHandleAdd = (val, currentValue, count) => {
    // console.log(v);
    const { goodsInitData } = this.state;
    const newData = {
      key: count,
      prizeId: currentValue,
      resultCode: '1',
      resultRemark: '当游戏得分超过90，掉落此商品',
      prizeType: '1',
    };
    this.setState({
      goodsInitData: [...goodsInitData, newData]
    });
  }
  discountHandle = (val) => {
    this.setState({
      couponsInitData: val,
    });
  }
  // 新增modal确认事件 开始
  saveFormRef = (form) => {
    this.form = form;
  }
  // 编辑modal 确认事件
  handleAdd = () => {
    this.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const rangeTimeValue = fieldsValue.rangeTime
      let params = {
        ...fieldsValue,
        rangeTime: undefined,
        startTimeStr: rangeTimeValue[0].format('YYYY-MM-DD HH:mm'),
        endTimeStr: rangeTimeValue[1].format('YYYY-MM-DD HH:mm'),
        goods: this.state.goodsInitData,
        coupons: this.state.couponsInitData,
        machines: this.state.machines,
      };
      this.setState({
        editModalConfirmLoading: true,
        modalData: {},
      });
      let url = 'scheduleSetting/saveScheduleSetting';
      if (this.state.modalData.id) {
        url = 'scheduleSetting/editScheduleSetting';
        params = { ...params, id: this.state.modalData.id };
      } else {
        params = { ...params, remark: '已选择' + this.state.machineNum + '台机器，分别位于' + this.state.selectCityName.join('、')}
      }
      this.props.dispatch({
        type: url,
        payload: {
          params,
        },
      }).then(() => {
        this.setState({
          code: '',
          getDataStartDay: this.state.startTime,
          getDataEndDay: this.state.endTime,
        }, () => {
          this.getLists();
        })
        this.setState({
          editModalConfirmLoading: false,
          modalVisible: false,
        });
      });
    });
  }
  // 新增modal确认事件 结束
  // 四级联动开始
  loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    this.setState({
      code: targetOption.value,
    }, () => {
      this.props.dispatch({
        type: 'common/getProvinceCityAreaTradeArea',
        payload: {
          restParams: {
            code: targetOption.value,
          },
        },
      }).then((res) => {
        targetOption.loading = false;
        targetOption.children = res
        this.setState({
          options: [...this.state.options],
        });
      });
    });
  }
  // 四级联动结束
  // 日历开始
  range = (start, end) =>  {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }
  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  }
  disabledDateTime = () => {
    return {
      disabledHours: () => range(0, 24).splice(4, 20),
      disabledMinutes: () => range(30, 60),
      disabledSeconds: () => [55, 56],
    };
  }
  // 日历结束
  // tree开始
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (parseInt(item.canUseNum) === 0) ? (<TreeNode {...item} dataRef={item} disabled />) : (<TreeNode {...item} dataRef={item} />);
    });
  }
  onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      // console.log('treeNode.props.dataRef', treeNode.props.dataRef.value, treeNode.props.children)
      const targetOption = treeNode.props.dataRef;
      // targetOption.loading = true;
      this.setState({
        code: targetOption.value,
      }, () => {
        this.props.dispatch({
          type: 'scheduleSetting/selectAreaMachines',
          payload: {
            restParams: {
              code: targetOption.value,
              level: targetOption.level + 1,
              startTime: this.state.machineStartTime,
              endTime: this.state.machineEndTime,
            },
          },
        }).then((res) => {
          // targetOption.loading = false;
          targetOption.children = res
          console.log('res', res)
          this.setState({
            treeData: [...this.state.treeData],
          });
          resolve();
        });
      });
    });
  }
  onExpand = (expandedKeys, node) => {
    // console.log('onExpand展开/收起节点时触发', expandedKeys, node);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  onCheck = (checkedKeys, node) => {
    // .checkedNodes[0].props.dataRef.value
    console.log('onCheck点击复选框触发', checkedKeys, node);

    // let node =
    this.setState({ checkedKeys, selectCity: node.checkedNodes });
  }
  onSelect = (selectedKeys, info) => {
    // console.log('onSelect点击树节点触发', info);
    // this.setState({ selectedKeys });
  }
  onEditMachineHandleAddClick = () => {
    console.log('选择机器确认');
    let selectCity = this.state.selectCity
    if (selectCity.length > 0) {
      this.uniq(selectCity)
      // console.log('selectCity', this.state.machines)
    } else {
      message.error('请先选择机器')
    }
  }
  uniq = (arr) => {
    let max = [];
    let selectCityName = []
    // for(var i=0;i<arr.length;i++) {
    //   var item = arr[i].props.dataRef;
    //   if(!(item['province'] in max) || (item['level'] > max[item['province']]['level'])){
    //     // init compare
    //     max[item['province']] = item;
    //   }
    // }
    // Object.values(max)
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i].props.dataRef
      if (!item.children) {
        item.machines.forEach((MItem) => {
          max.push(MItem);
        });
        if (!(item['province'] in selectCityName)) {
          selectCityName[item['province']] = item.province;
        }
        // selectCityName.push(item.province)
      }
    }
    selectCityName = Object.values(selectCityName)
    this.setState({
      machineNum: max.length,
      selectCityName,
      machines: max,
    }, () => {
      console.log(this.state.machines)
      this.setState({
        editMachineModalVisible: false,
      });
    });
  }
  openSelectMachineModal = () => {
    this.form.validateFields((err, fieldsValue) => {
      if (err) return;
      const rangeTimeValue = fieldsValue.rangeTime
      let params = {
        ...fieldsValue,
        rangeTime: undefined,
        startTime: rangeTimeValue[0].format('YYYY-MM-DD HH:mm'),
        endTime: rangeTimeValue[1].format('YYYY-MM-DD HH:mm'),
        code: this.state.code,
        level: 1,
      };
      this.setState({
        machineStartTime: params.startTime,
        machineEndTime: params.endTime,
        code: '',
      }, () => {
        this.props.dispatch({
          type: 'scheduleSetting/selectAreaMachines',
          payload: {
            restParams: {
              code: this.state.code,
              level: 1,
              startTime: this.state.machineStartTime,
              endTime: this.state.machineEndTime,
            },
          },
        }).then((res) => {
          this.setState({
            treeData: res,
          }, () => {
            this.setState({
              editMachineModalVisible: true,
            });
          });
        });
      })
    })
  }
  onEditMachineHandleModalVisibleClick = () => {
    this.setState({
      editMachineModalVisible: false,
    });
  }
  selectMachineFormRef = (form) => {
    this.selectMachineform = form;
  }
  // tree结束
  // 动态添加开始
  onRadioChange = (e) => {
    this.setState({
      selectStatus: e.target.value,
    });
  }
  // 动态添加结束
  // 日历排期表格的编辑，查看，删除
  getDetail = (item) => {

  }
  handleWatchModalVisible = () => {
    this.setState({
      watchModalVisible: false,
    });
  }
  onEditClick = (item) => {
    console.log('item编辑', item)
    this.props.dispatch({
      type: 'scheduleSetting/getScheduleSettingDetail',
      payload: {
        restParams: {
          id: item.id,
        },
      },
    }).then((res) => {
      console.log('res', res)
      const goodsInitData = [{
        resultCode: 1,
        resultRemark: '当游戏得分超过90，掉落此商品',
        prizeType: 1,
        prizeId: '',
      }]
      this.setState({
        goodsInitData: res.goods.length > 0 ? res.goods : goodsInitData,
        couponsInitData: res.coupons.length > 0 ? res.coupons : couponsInitData,
      }, () => {
        this.setState({
          modalVisible: true,
          modalData: res,
          modalType: true,
        });
        this.setModalData(res);
      });
    });
  }
  onWatchClick = (item) => {
    console.log('item查看', item)
    this.props.dispatch({
      type: 'scheduleSetting/getScheduleSettingDetail',
      payload: {
        restParams: {
          id: item.id,
        },
      },
    }).then((res) => {
      this.setState({
        goodsInitData: res.goods.length > 0 ? res.goods : [],
        couponsInitData: res.coupons.length > 0 ? res.coupons : [],
      }, () => {
        this.setState({
          modalVisible: false,
          modalData: res,
          watchModalVisible: true,
        });
      });
    });
  }
  onDeleteClick = (item) => {
    console.log('item删除', item)
    this.setState({
      editModalConfirmLoading: true,
    });
    if (item) {
      const params = { id: item.id };
      this.props.dispatch({
        type: 'scheduleSetting/delScheduleSetting',
        payload: {
          params,
        },
      }).then(() => {
        // message.success('Click on Yes');
        this.getLists();
        this.setState({
          editModalConfirmLoading: false,
        });
      });
    } else return false;
  }
  watchDetailClick = () => {
    console.log('查看机器详情', this.state.modalData)
    this.props.dispatch({
      type: 'scheduleSetting/getPlanMachineDetailList',
      payload: {
        restParams: {
          id: this.state.modalData.id,
        },
      },
    }).then((res) => {
      this.setState({
        machineList: res,
        WatchMachineModalVisible: true,
      });
    });
  }
  WatchMachineHandleModalVisibleClick = () => {
    this.setState({
      WatchMachineModalVisible: false,
    });
  }
  // 日历table操作开始
  // 日历table操作结束
  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={9} sm={24}>
            <FormItem label="省市区商圈">
              {getFieldDecorator('provinceCityAreaTrade')(
                <Cascader
                  placeholder="请选择"
                  options={this.state.options}
                  loadData={this.loadData}
                  onChange={this.onChange}
                  changeOnSelect
                />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span style={{ float: 'right' }}>
               <FormItem>
                  <Button onClick={this.handleFormReset}>
                    重置
                  </Button>
                  <Button className={styles.serach} style={{ marginLeft: 8, background: 'rgba(245, 75, 48, 1)' }} type="primary" htmlType="submit">
                    查询
                  </Button>
               </FormItem>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  // 四级联动结束
  render() {
    const {
      scheduleSetting: { list, page },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, editModalConfirmLoading, modalData, modalType, options, gameLists, activityLists, goodsLists } = this.state;
    const columns = [
      {
        title: '所属省市区商圈',
        // width: 200,
        dataIndex: 'areaName',
      },
      {
        title: '商场',
        // width: 200,
        dataIndex: 'mall',
      },
      {
        title: '运营人',
        width: 100,
        dataIndex: 'manager',
      },
      {
        title: '手机号',
        width: 150,
        dataIndex: 'mobile',
      },
      {
        title: '机器个数',
        width: 150,
        dataIndex: 'userNum',
      },
      {
        title: '备注描述',
        dataIndex: 'remark',
      },
      {
        fixed: 'right',
        width: 200,
        title: '操作',
        render: (text, item) => (
          <Fragment>
            <a onClick={() => this.handleEditClick(item)}>编辑</a>
            {/*<Divider type="vertical" />*/}
            {/*<a onClick={() => this.handleLogClick(item)}>日志</a>*/}
            <Divider type="vertical" />
            <Popconfirm title="确定要删除吗" onConfirm={() => this.handleDelClick(item)} okText="Yes" cancelText="No">
              <a className={styles.delete}>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
    // this.state.options = this.props.common.list
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    // setTimeout(() => {
    //   this.handleModalVisible(true);
    // }, 1000);
    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
          <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {/*{selectedRows.length > 0 && (*/}
              {/*<span>*/}
              {/*<Button>批量操作</Button>*/}
              {/*<Dropdown overlay={menu}>*/}
              {/*<Button>*/}
              {/*更多操作 <Icon type="down" />*/}
              {/*</Button>*/}
              {/*</Dropdown>*/}
              {/*</span>*/}
              {/*)}*/}
            </div>
            <ScheduleTable
              dateList={this.state.dateList}
              handleDays={this.handleDays}
              onEditClick={this.onEditClick}
              onWatchClick={this.onWatchClick}
              onDeleteClick={this.onDeleteClick}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          ref={this.saveFormRef}
          modalVisible={modalVisible}
          onChange={this.onRadioChange}
          selectStatus={this.state.selectStatus}
          editModalConfirmLoading={editModalConfirmLoading}
          modalData={modalData}
          modalType={modalType}
          verifyTimeRequire={this.verifyTimeRequire}
          gameLists={gameLists}
          goodsLists={goodsLists}
          activityLists={activityLists}
          disabledDate={this.disabledDate}
          disabledDateTime={this.disabledDateTime}
          openSelectMachineModal={this.openSelectMachineModal}
          selectCityName={this.state.selectCityName}
          machineNum={this.state.machineNum}
          goodsInitData={this.state.goodsInitData}
          couponsInitData={this.state.couponsInitData}
          goodsHandle={this.goodsHandle}
          goodsHandleAdd={this.goodsHandleAdd}
          discountHandle={this.discountHandle}
          onSelectShop={this.onSelectShop}
        />
        <SelectMachineForm
          ref={this.selectMachineFormRef}
          editMachineModalVisible={this.state.editMachineModalVisible}
          onEditMachineHandleAddClick={this.onEditMachineHandleAddClick}
          onEditMachineHandleModalVisibleClick={this.onEditMachineHandleModalVisibleClick}
          editMachineEditModalConfirmLoading={this.state.editMachineEditModalConfirmLoading}
          renderTreeNodes={this.renderTreeNodes}
          treeData={this.state.treeData}
          onLoadData={this.onLoadData}
          expandedKeys={this.state.expandedKeys}
          autoExpandParent={this.state.autoExpandParent}
          checkedKeys={this.state.checkedKeys}
          selectedKeys={this.state.selectedKeys}
          onExpand={this.onExpand}
          onCheck={this.onCheck}
          onSelect={this.onSelect}
        />
        <WatchForm
          watchModalVisible={this.state.watchModalVisible}
          modalData={this.state.modalData}
          handleWatchModalVisible={this.handleWatchModalVisible}
          goodsList={this.state.goodsInitData}
          couponsList={this.state.couponsInitData}
          watchDetailClick={this.watchDetailClick}
        />
        <WatchMachine
          WatchMachineModalVisible={this.state.WatchMachineModalVisible}
          WatchMachineHandleModalVisibleClick={this.WatchMachineHandleModalVisibleClick}
          machineList={this.state.machineList}
        />

        {/*<Modal*/}
          {/*title={!this.state.modalType ? '编辑排期' : '新增排期'}*/}
          {/*visible={modalVisible}*/}
          {/*onOk={handleAdd}*/}
          {/*onCancel={() => handleModalVisible()}*/}
          {/*confirmLoading={editModalConfirmLoading}*/}
          {/*width={800}*/}
        {/*>*/}
          {/*<Form onSubmit={this.handleSearch}>*/}
            {/*<FormItem {...formItemLayout} label="选择活动">*/}
              {/*{getFieldDecorator('activityId', {*/}
                {/*rules: [{ required: true, message: '请选择活动' }],*/}
              {/*})(*/}
                {/*<Select placeholder="请选择" onSelect={onSelectShop}>*/}
                  {/*{activityLists.map((item) => {*/}
                    {/*return (*/}
                      {/*<Option value={item.id} key={item.id}>{item.name}</Option>*/}
                    {/*);*/}
                  {/*})}*/}
                {/*</Select>*/}
              {/*)}*/}
            {/*</FormItem>*/}
            {/*<FormItem {...formItemLayout} label="选择时间">*/}
              {/*{getFieldDecorator('rangeTime', {*/}
                {/*rules: [{ type: 'array', required: true, message: '请选择时间' }],*/}
              {/*})(*/}
                {/*<RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />*/}
              {/*)}*/}
            {/*</FormItem>*/}
            {/*<FormItem {...formItemLayout} label="选择机器">*/}
              {/*{getFieldDecorator('remark') ((modalData.id) ? (*/}
                {/*<div>{modalData.remark ? modalData.remark : '测试暂无'}</div>) : (*/}
                {/*<div>*/}
                  {/*{ selectCityName.length > 0 ? '已选择' + machineNum + '台机器，分别位于' + selectCityName.join('、') : '' }*/}
                  {/*<Button type="primary" onClick={openSelectMachineModal}>+ 选择</Button>*/}
                {/*</div>*/}
              {/*))*/}
              {/*}*/}
            {/*</FormItem>*/}
            {/*<FormItem {...formItemLayout} label="选择游戏">*/}
              {/*{getFieldDecorator('gameId', {*/}
                {/*rules: [{ required: true, message: '请选择游戏' }],*/}
              {/*})(*/}
                {/*<Select placeholder="请选择">*/}
                  {/*{gameLists.map((item) => {*/}
                    {/*return (*/}
                      {/*<Option value={item.id} key={item.id}>{item.name}</Option>*/}
                    {/*);*/}
                  {/*})}*/}
                {/*</Select>*/}
              {/*)}*/}
            {/*</FormItem>*/}
            {/*<FormItem {...formItemLayout} label="同一用户获得商品次数">*/}
              {/*{getFieldDecorator('userMaxTimes', {*/}
                {/*rules: [{ required: true, whitespace: true, message: '请填写同一用户获得商品次数' }],*/}
              {/*})(<Input placeholder="请填写同一用户获得商品次数" />)}*/}
            {/*</FormItem>*/}
            {/*<FormItem label="填写商品信息">*/}
              {/*<GoodsTableField initData={goodsInitData} clist={goodsLists} goodsHandle={goodsHandle} />*/}
            {/*</FormItem>*/}
            {/*<FormItem label="填写优惠券信息">*/}
              {/*<DiscountDynamicField initData={couponsInitData} discountHandle={discountHandle} />*/}
            {/*</FormItem>*/}
          {/*</Form>*/}
        {/*</Modal>*/}
      </PageHeaderLayout>
    );
  }
}
