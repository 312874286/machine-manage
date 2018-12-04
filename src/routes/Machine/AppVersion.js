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
  Button,
  Table,
  Menu,
  Modal,
  Divider,
  Cascader,
  Popconfirm,
  message,
  Popover,
  TimePicker,
  Switch,
  Tag
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './PointSetting.less';
import { getAccountMenus } from '../../utils/authority';

const FormItem = Form.Item;
const Option = Select.Option;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ common, loading, appVersion, log }) => ({
  common,
  appVersion,
  loading: loading.models.appVersion,
  log,
}))
@Form.create()

export default class PointSettingList extends PureComponent {
  state = {
    formValues: {},
    options: '',
    pageNo: 1,
    keyword: '',
    appVersion: '',
    code: '',
    type: '',
    appList: [],
    appVersionList: [],
    tableLoading: true,
    appVersionListPage: {},
    AppOptions:[]
  };
  componentWillMount() {
    // 查询省
  }
  componentDidMount() {
    this.getAreaList();
    this.getLists();
    this.getAppList();
    this.searchAppVersion()
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
  // 获取点位管理列表
  getLists = () => {
    this.props.dispatch({
      type: 'appVersion/getPointSettingList',
      payload: {
        restParams: {
          pageNo: this.state.pageNo,
          keyword: this.state.keyword,
          code: this.state.code,
          type: this.state.type
        },
      },
    });
  }

  // 搜索
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let appVersion = ''
      console.log(fieldsValue)
      if (fieldsValue.appVersion) {
        appVersion = fieldsValue.appVersion
        console.log(appVersion)
      }
      this.setState({
        pageNo: 1,
        keyword: fieldsValue.keyword ? fieldsValue.keyword : '',
        appPackage: appVersion[0],
        versionCode: appVersion[1]
      }, () => {
        this.searchAppVersion()
      });
      // let localCode = ''
      // if (fieldsValue.provinceCityAreaTrade) {
      //   if (fieldsValue.provinceCityAreaTrade.length > 0) {
      //     localCode = fieldsValue.provinceCityAreaTrade[fieldsValue.provinceCityAreaTrade.length - 1]
      //   }
      // }
      // this.setState({
      //   pageNo: 1,
      //   keyword: fieldsValue.keyword ? fieldsValue.keyword : '',
      //   code: localCode,
      //   type: fieldsValue.type >= 0 ? fieldsValue.type : ''
      // }, () => {
      //   this.getLists();
      // });
    });
  };

  searchAppVersion = (params) => {
    const { dispatch } = this.props
    this.setState({
      tableLoading: true
    })
    dispatch({
      type: 'appVersion/getAppVersion',
      payload: {
        params: {
          pageNo: this.state.pageNo,
          keyword: this.state.keyword,
          appPackage: this.state.appPackage,
          versionCode: this.state.versionCode
        }
      }
    }).then(res => {
      this.setState({
        tableLoading: false
      })
      if (res.code == 0) {
        this.setState({
          appVersionList: res.data,
          appVersionListPage: res.page
        })
      }
    })
  }

  loadAppData = (selectedOptions) => {
    const { dispatch } = this.props

    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    dispatch({
      type: 'appVersion/getAppVersionList',
      payload: {
        restParams: {
          appPackageName: targetOption.value,
          keyword: ''
        }
      }
    }).then(res => {
      targetOption.loading = false;
      targetOption.children = res
      this.setState({
        AppOptions: [...this.state.AppOptions],
      });
    })
  }

  onChangeApp = (value, selectedOptions) => {
    console.log(value, selectedOptions)
  }
  
  // 四级联动开始
  onChange = (value, selectedOptions) => {
    // 当前选中的value[3]商圈
    console.log(value, selectedOptions);
  }

  loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    console.log('targetOption', targetOption)

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
  // 查询App列表
  getAppList = () => {
    this.props.dispatch({
      type: 'appVersion/getAppList',
      payload: {
        restParams: {
        },
      },
    }).then(res => {
      console.log(res)
      this.setState({
        // appList: res.data,
        AppOptions: res
      })
    })
    
  }

  onSelectAppPackageName = (value, options) => {

    console.log(value, options)
    console.log(this.state.appList[options.props.index])
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
      this.searchAppVersion();
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
      appVersion: ''
    });
  };

  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { appList } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          {/* <Col md={7} sm={24} lg={8}>
            <FormItem label="省市区">
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
          </Col> */}
          <Col md={8} sm={24} lg={6}>
            <FormItem label="App 版本">
              {getFieldDecorator('appVersion')(
                // <Select
                // placeholder="请选择"
                // allowClear={true}
                // onSelect={this.onSelectAppPackageName}
                // >
                //   {appList.map((item) => <Option key={item.id} value={item.appPackageName}>{item.appName}</Option>)}
                // </Select>
                <Cascader
                  placeholder="请选择"
                  options={this.state.AppOptions}
                  loadData={this.loadAppData}
                  onChange={this.onChangeApp}
                  changeOnSelect
                />

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24} lg={6}>
            <FormItem>
              {getFieldDecorator('keyword')(
                <Input placeholder="请输入机器编号搜索" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24} lg={4}>
            <FormItem>
              <Button onClick={this.handleFormReset}>
                重置
              </Button>
              <Button className={styles.serach} style={{ marginLeft: 8}} type="primary" htmlType="submit">
                搜索
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
  

  render() {
    const { appVersionListPage, appVersionList } = this.state
    const {appVersion: { page }} = this.props
    const scrollX = 700
    const scrollY = (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 100 + 120)
    const columns = [
      {title: '机器', dataIndex: 'machineCode', key: 'machineCode', width: 200},
      {title: <div style={{textAlign: 'center'}}>App版本</div>, dataIndex: 'appInfo',render(val) {
        return (val.map((item,index) => <span key={index} style={{marginLeft: 20}}>{item};</span>))
      }},
    ]
    const data = [
      {
        "machineCode": "19782745",
        "createTime": "2018-11-05 14:04:01",
        "appInfo": [
            "72APP 1.1.1 (最新版本)",
            "72监控APP 1.1.9 (最新版本)",
            "72安装器 1.0.4 (最新版本)",
            "72管理 1.1.0 (最新版本)",
            "72数据中心 1.1.4 (最新版本)",
            "壶中界 0.0.9",
            "72上传 1.0.4 (最新版本)",
            "72守护 1.0.4 (最新版本)"
        ]
      },{
        "machineCode": "19782742",
        "createTime": "2018-11-05 14:04:03",
        "appInfo": [
            "72APP 1.1.1 (最新版本)",
            "72监控APP 1.1.9 (最新版本)",
            "72安装器 1.0.4 (最新版本)",
            "72管理 1.1.0 (最新版本)",
            "72数据中心 1.1.4 (最新版本)",
            "壶中界 0.0.9",
            "72上传 1.0.4 (最新版本)",
            "72守护 1.0.4 (最新版本)",
            "72APP 1.1.1 (最新版本)",
            "72监控APP 1.1.9 (最新版本)",
            "72安装器 1.0.4 (最新版本)",
            "72管理 1.1.0 (最新版本)",
            "72数据中心 1.1.4 (最新版本)",
            "壶中界 0.0.9",
            "72上传 1.0.4 (最新版本)",
            "72守护 1.0.4 (最新版本)",
            "72APP 1.1.1 (最新版本)",
            "72监控APP 1.1.9 (最新版本)",
            "72安装器 1.0.4 (最新版本)",
            "72管理 1.1.0 (最新版本)",
            "72数据中心 1.1.4 (最新版本)",
            "壶中界 0.0.9",
            "72上传 1.0.4 (最新版本)",
            "72守护 1.0.4 (最新版本)"
        ]
      },{
        "machineCode": "19782744",
        "createTime": "2018-11-05 14:04:05",
        "appInfo": [
            "72APP 1.1.1 (最新版本)",
            "72监控APP 1.1.9 (最新版本)",
            "72安装器 1.0.4 (最新版本)",
            "72管理 1.1.0 (最新版本)",
            "72数据中心 1.1.4 (最新版本)",
            "壶中界 0.0.9",
            "72上传 1.0.4 (最新版本)",
            "72守护 1.0.4 (最新版本)"
        ]
      },{
        "machineCode": "19782741",
        "createTime": "2018-11-05 14:04:38",
        "appInfo": [
            "72APP 1.1.1 (最新版本)",
            "72监控APP 1.1.9 (最新版本)",
            "72安装器 1.0.4 (最新版本)",
            "72管理 1.1.0 (最新版本)",
            "72数据中心 1.1.4 (最新版本)",
            "壶中界 0.0.9",
            "72上传 1.0.4 (最新版本)",
            "72守护 1.0.4 (最新版本)"
        ]
      }
    ]
    const paginationProps = {
      showTotal: (total) => {
        return (
          <div className="paginationBox">
            <span>当前显示{appVersionListPage.pageSize}条/页，共{appVersionListPage.totalCount}条，第{appVersionListPage.pageNo}/{appVersionListPage.totalPage}页</span>
          </div>
        )
      },
      ...page,
      showQuickJumper: true,
    };
    
    return (
      <PageHeaderLayout>
        <Card bordered={false} bodyStyle={{ 'marginBottom': '10px', 'padding': '15px 32px 0'}}>
          <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
        </Card>
        <Card>
          <div>
            <Table 
              style={{padding: 10}} 
              rowKey={(item, index) => item.machineCode || index} 
              columns={columns} 
              dataSource={appVersionList || []} 
              loading={this.state.tableLoading} 
              pagination={paginationProps}
              onChange={this.handleStandardTableChange}
              scroll={{ x: scrollX ? scrollX : 1050, y: scrollY ? scrollY : (document.documentElement.clientHeight || document.body.clientHeight) - (68 + 62 + 24 + 53 + 100 + 100)}}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
