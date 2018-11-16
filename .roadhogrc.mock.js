import mockjs from 'mockjs';
import {
  getRule,
  postRule
} from './mock/rule';
import {
  getActivities,
  getNotice,
  getFakeList
} from './mock/api';
import {
  getFakeChartData
} from './mock/chart';
import {
  imgMap
} from './mock/utils';
import {
  getProfileBasicData
} from './mock/profile';
import {
  getProfileAdvancedData
} from './mock/profile';
import {
  getNotices
} from './mock/notices';
import {
  format,
  delay
} from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

const antProxy = {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    $desc: "获取当前用户接口",
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      notifyCount: 12,
    },
  },
  // GET POST 可省略
  'GET /api/users': [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  }, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  }, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  }],
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'GET /api/rule': getRule,
  'POST /api/rule': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  },
  'POST /api/forms': (req, res) => {
    res.send({
      message: 'Ok'
    });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{
      name: '@city',
      'value|1-100': 150,
      'type|0-2': 1
    }]
  }),
  'GET /api/fake_list': getFakeList,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  'POST /api/login/account': (req, res) => {
    const {
      password,
      userName,
      type
    } = req.body;
    if (password === '888888' && userName === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin'
      });
      return;
    }
    if (password === '123456' && userName === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user'
      });
      return;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest'
    });
  },
  'POST /api/register': (req, res) => {
    res.send({
      status: 'ok',
      currentAuthority: 'user'
    });
  },
  'GET /api/notices': getNotices,
  'GET /api/500': (req, res) => {
    res.status(500).send({
      "timestamp": 1513932555104,
      "status": 500,
      "error": "error",
      "message": "error",
      "path": "/base/category/list"
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      "timestamp": 1513932643431,
      "status": 404,
      "error": "Not Found",
      "message": "No message available",
      "path": "/base/category/list/2121212"
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      "timestamp": 1513932555104,
      "status": 403,
      "error": "Unauthorized",
      "message": "Unauthorized",
      "path": "/base/category/list"
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      "timestamp": 1513932555104,
      "status": 401,
      "error": "Unauthorized",
      "message": "Unauthorized",
      "path": "/base/category/list"
    });
  },
};

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // GET POST 可省略

  'POST /dd/login': (req, res) => {
    const {
      name,
      password,
      auto,
      type,
      code
    } = req.body;
    // if (password === 'admin' && name === 'admin') {
    console.log('code==== ', code);
    if (code) {
      const data = {
        token: 'sasdnjaoisdjoiasdjaoisd',
        user: {
          userId: 'asdasdasd',
          name: 'admin',
          userMobile: '15811174709',
          userEmail: 'zhanglonglong@pinwheelmedical.com',
          userType: 0,
          systemAdmin: 1,
          merchantAdmin: 1,
          merchantId: 'asdnoasndasjd',
        },
        // functions: [
        //   {
        //     id: 'a33',
        //     functionDepict: '首页',
        //     functionPath: 'homePage',
        //     parentId: null,
        //     functionLevel: 1,
        //     functionIcon: 'homePage',
        //   },
        //   {
        //     id: 'a1',
        //     functionDepict: '货机管理',
        //     functionPath: 'machine',
        //     parentId: null,
        //     functionLevel: 1,
        //     functionIcon: 'machine',
        //     color: '#ffd322'
        //   },
        //   {
        //     id: 'a2',
        //     functionDepict: '机器管理',
        //     functionPath: 'machine-setting',
        //     parentId: 'a1',
        //     functionLevel: 2,
        //   },
        //   {
        //     id: 'a4',
        //     functionDepict: '点位管理',
        //     functionPath: 'point-setting',
        //     parentId: 'a1',
        //     functionLevel: 2,
        //   },
        //   {
        //     id: 'a33',
        //     functionDepict: '任务管理',
        //     functionPath: 'task-setting',
        //     parentId: 'a1',
        //     functionLevel: 2,
        //   },
        //   {
        //     id: 'a6',
        //     functionDepict: '项目管理',
        //     functionPath: 'project',
        //     parentId: null,
        //     functionLevel: 1,
        //     functionIcon: 'project',
        //   },
        //   {
        //     id: 'a7',
        //     functionDepict: '渠道管理',
        //     functionPath: 'channel',
        //     parentId: 'a6',
        //     functionLevel: 2,
        //   },
        //   {
        //     id: 'a8',
        //     functionDepict: '商户管理',
        //     functionPath: 'merchant',
        //     parentId: 'a6',
        //     functionLevel: 2,
        //   },
        //   {
        //     id: 'a9',
        //     functionDepict: '活动管理',
        //     functionPath: 'activity',
        //     parentId: 'a6',
        //     functionLevel: 2,
        //   },
        //   {
        //     id: 'a20',
        //     functionDepict: '活动排期',
        //     functionPath: 'schedule',
        //     parentId: 'a6',
        //     functionLevel: 2,
        //   },
        //   {
        //     id: 'a10',
        //     functionDepict: '店铺管理',
        //     functionPath: 'shop',
        //     parentId: 'a6',
        //     functionLevel: 2,
        //   },
        //   {
        //     id: 'a19',
        //     functionDepict: '游戏管理',
        //     functionPath: 'game',
        //     parentId: 'a6',
        //     functionLevel: 2,
        //   },
        //   {
        //     id: 'a25',
        //     functionDepict: '商品管理',
        //     functionPath: 'goods',
        //     parentId: 'a6',
        //     functionLevel: 2,
        //   },
        //   {
        //     id: 'a34',
        //     functionDepict: '机器排期',
        //     functionPath: 'machinePlan',
        //     parentId: 'a6',
        //     functionLevel: 2,
        //   },
        //   {
        //     id: 'a14',
        //     functionDepict: '系统管理',
        //     functionPath: 'authorityManage',
        //     parentId: null,
        //     functionLevel: 1,
        //     functionIcon: 'system',
        //     color: '#ff4c72'
        //   },
        //   {
        //     id: 'a15',
        //     functionDepict: '角色管理',
        //     functionPath: 'account',
        //     parentId: 'a14',
        //     functionLevel: 2,
        //   },
        //   {
        //     id: 'a16',
        //     functionDepict: '权限管理',
        //     functionPath: 'jurisdiction',
        //     parentId: 'a14',
        //     functionLevel: 2,
        //   },
        //   {
        //     id: 'a17',
        //     functionDepict: '部门管理',
        //     functionPath: 'department',
        //     parentId: 'a14',
        //     functionLevel: 2,
        //   },
        //   {
        //     id: 'a18',
        //     functionDepict: '员工管理',
        //     functionPath: 'staff',
        //     parentId: 'a14',
        //     functionLevel: 2,
        //   },
        //   {
        //     id: 'a21',
        //     functionDepict: '订单管理',
        //     functionPath: 'order',
        //     parentId: null,
        //     functionLevel: 1,
        //     functionIcon: 'order',
        //     color: 'green'
        //   },
        //   {
        //     id: 'a22',
        //     functionDepict: '订单管理',
        //     functionPath: 'order',
        //     parentId: 'a21',
        //     functionLevel: 2,
        //   },
        //   {
        //     id: 'a23',
        //     functionDepict: '用户管理',
        //     functionPath: 'player',
        //     parentId: null,
        //     functionLevel: 1,
        //     functionIcon: 'player',
        //     color: 'yellow'
        //   },
        //   {
        //     id: 'a24',
        //     functionDepict: '用户管理',
        //     functionPath: 'user',
        //     parentId: 'a23',
        //     functionLevel: 2,
        //   },
        //   {
        //     id: 'a26',
        //     functionDepict: '巡检管理',
        //     functionPath: 'check',
        //     parentId: null,
        //     functionLevel: 1,
        //     functionIcon: 'check',
        //     color: '#174a79'
        //   },
        //   {
        //     id: 'a27',
        //     functionDepict: '故障单管理',
        //     functionPath: 'fault',
        //     parentId: 'a26',
        //     functionLevel: 2,
        //   },
        //   {
        //     id: 'a28',
        //     functionDepict: '人员管理',
        //     functionPath: 'user',
        //     parentId: 'a26',
        //     functionLevel: 2,
        //   },
        //   {
        //     id: 'a29',
        //     functionDepict: '打卡记录',
        //     functionPath: 'signIn',
        //     parentId: 'a26',
        //     functionLevel: 2,
        //   },
        //   {
        //     id: 'a30',
        //     functionDepict: '故障类型',
        //     functionPath: 'faultType',
        //     parentId: 'a26',
        //     functionLevel: 2,
        //   },
        //   {
        //     id: 'a31',
        //     functionDepict: '工单管理',
        //     functionPath: 'workOrder',
        //     parentId: 'a26',
        //     functionLevel: 2,
        //   },
        //   {
        //     id: 'a32',
        //     functionDepict: '补货记录',
        //     functionPath: 'replenish',
        //     parentId: 'a26',
        //     functionLevel: 2,
        //   },
        // ],
        functions: [
          {
            "id": "29",
            "functionDepict": "首页",
            "functionPath": "homePage",
            "parentId": null,
            "functionLevel": 1,
            "functionIcon": "homePage",
            "color": null,
            "seq": 0,
            "parentName": null
          },
          {
            "id": "1",
            "functionDepict": "货机管理",
            "functionPath": "machine",
            "parentId": null,
            "functionLevel": 1,
            "functionIcon": "machine",
            "color": "",
            "seq": 1,
            "parentName": null
          },
          {
            "id": "4",
            "functionDepict": "项目管理",
            "functionPath": "project",
            "parentId": null,
            "functionLevel": 1,
            "functionIcon": "project",
            "color": "",
            "seq": 2,
            "parentName": null
          },
          {
            "id": "12",
            "functionDepict": "订单管理",
            "functionPath": "order",
            "parentId": null,
            "functionLevel": 1,
            "functionIcon": "order",
            "color": "",
            "seq": 3,
            "parentName": null
          },
          {
            "id": "21",
            "functionDepict": "用户管理",
            "functionPath": "player",
            "parentId": null,
            "functionLevel": 1,
            "functionIcon": "player",
            "color": "",
            "seq": 4,
            "parentName": null
          },
          {
            "id": "15",
            "functionDepict": "系统管理",
            "functionPath": "authorityManage",
            "parentId": "",
            "functionLevel": 1,
            "functionIcon": "system",
            "color": "",
            "seq": 5,
            "parentName": null
          },
          {
            "id": "23",
            "functionDepict": "巡检管理",
            "functionPath": "check",
            "parentId": null,
            "functionLevel": 1,
            "functionIcon": "check",
            "color": "",
            "seq": 6,
            "parentName": null
          },
          {
            "id": "24",
            "functionDepict": "人员管理",
            "functionPath": "user",
            "parentId": "23",
            "functionLevel": 2,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "13",
            "functionDepict": "订单管理",
            "functionPath": "order",
            "parentId": "12",
            "functionLevel": 2,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            id: 'a40',
            functionDepict: '商品统计',
            functionPath: 'commodityStatistics',
            parentId: '12',
            functionLevel: 2,
          },
          {
            "id": "5",
            "functionDepict": "渠道管理",
            "functionPath": "channel",
            "parentId": "4",
            "functionLevel": 2,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "19",
            "functionDepict": "角色管理",
            "functionPath": "account",
            "parentId": "15",
            "functionLevel": 2,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "2",
            "functionDepict": "机器管理",
            "functionPath": "machine-setting",
            "parentId": "1",
            "functionLevel": 2,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            id: 'a36',
            functionDepict: '标签管理',
            functionPath: 'label-setting',
            parentId: '1',
            functionLevel: 2,
            color: null
          },
          {
            id: 'a37',
            functionDepict: 'App版本管理',
            functionPath: 'version-setting',
            parentId: '1',
            functionLevel: 2,
          },
          {
            id: 'a38',
            functionDepict: '批次管理',
            functionPath: 'batch-setting',
            parentId: '1',
            functionLevel: 2,
            color: null
          },
          {
            id: 'a39',
            functionDepict: '省市区管理',
            functionPath: 'area-setting',
            parentId: '1',
            functionLevel: 2,
          },
          {
            id: 'a41',
            functionDepict: '机器数据统计',
            functionPath: 'machineDataStatistics',
            parentId: '1',
            functionLevel: 2,
          },
          {
            id: 'a45',
            functionDepict: '入场时间明细',
            functionPath: 'enterTime-detail',
            parentId: '1',
            functionLevel: 2,
          },
          {
            id: 'a46',
            functionDepict: '机器App版本 ',
            functionPath: 'app-version',
            parentId: '1',
            functionLevel: 2,
          },
          {
            "id": "22",
            "functionDepict": "用户管理",
            "functionPath": "user",
            "parentId": "21",
            "functionLevel": 2,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "6",
            "functionDepict": "商户管理",
            "functionPath": "merchant",
            "parentId": "4",
            "functionLevel": 2,
            "functionIcon": null,
            "color": null,
            "seq": 2,
            "parentName": null
          },
          {
            "id": "3",
            "functionDepict": "点位管理",
            "functionPath": "point-setting",
            "parentId": "1",
            "functionLevel": 2,
            "functionIcon": null,
            "color": null,
            "seq": 2,
            "parentName": null
          },
          {
            "id": "18",
            "functionDepict": "权限管理",
            "functionPath": "jurisdiction",
            "parentId": "15",
            "functionLevel": 2,
            "functionIcon": null,
            "color": null,
            "seq": 2,
            "parentName": null
          },
          {
            "id": "26",
            "functionDepict": "打卡记录",
            "functionPath": "signIn",
            "parentId": "23",
            "functionLevel": 2,
            "functionIcon": null,
            "color": null,
            "seq": 2,
            "parentName": null
          },
          {
            "id": "17",
            "functionDepict": "部门管理",
            "functionPath": "department",
            "parentId": "15",
            "functionLevel": 2,
            "functionIcon": null,
            "color": null,
            "seq": 3,
            "parentName": null
          },
          {
            "id": "7",
            "functionDepict": "店铺管理",
            "functionPath": "shop",
            "parentId": "4",
            "functionLevel": 2,
            "functionIcon": null,
            "color": null,
            "seq": 3,
            "parentName": null
          },
          {
            "id": "31",
            "functionDepict": "机器任务",
            "functionPath": "task-setting",
            "parentId": "1",
            "functionLevel": 2,
            "functionIcon": null,
            "color": null,
            "seq": 3,
            "parentName": null
          },
          {
            "id": "25",
            "functionDepict": "工单管理",
            "functionPath": "fault",
            "parentId": "23",
            "functionLevel": 2,
            "functionIcon": null,
            "color": null,
            "seq": 3,
            "parentName": null
          },
          {
            "id": "27",
            "functionDepict": "故障类型管理",
            "functionPath": "faultType",
            "parentId": "23",
            "functionLevel": 2,
            "functionIcon": null,
            "color": null,
            "seq": 4,
            "parentName": null
          },
          {
            "id": "16",
            "functionDepict": "员工管理",
            "functionPath": "staff",
            "parentId": "15",
            "functionLevel": 2,
            "functionIcon": null,
            "color": null,
            "seq": 4,
            "parentName": null
          },
          {
            "id": "8",
            "functionDepict": "活动管理",
            "functionPath": "activity",
            "parentId": "4",
            "functionLevel": 2,
            "functionIcon": null,
            "color": null,
            "seq": 4,
            "parentName": null
          },
          {
            "id": "30",
            "functionDepict": "补货记录",
            "functionPath": "replenish",
            "parentId": "23",
            "functionLevel": 2,
            "functionIcon": null,
            "color": null,
            "seq": 5,
            "parentName": null
          },
          {
            "id": "28",
            "functionDepict": "机器排期",
            "functionPath": "machinePlan",
            "parentId": "4",
            "functionLevel": 2,
            "functionIcon": null,
            "color": null,
            "seq": 5,
            "parentName": null
          },
          {
            "id": "11",
            "functionDepict": "商品管理",
            "functionPath": "goods",
            "parentId": "4",
            "functionLevel": 2,
            "functionIcon": null,
            "color": null,
            "seq": 5,
            "parentName": null
          },
          {
            "id": "10",
            "functionDepict": "游戏管理",
            "functionPath": "game",
            "parentId": "4",
            "functionLevel": 2,
            "functionIcon": null,
            "color": null,
            "seq": 6,
            "parentName": null
          },
          {
            "id": "20",
            "functionDepict": "活动排期",
            "functionPath": "schedule",
            "parentId": "4",
            "functionLevel": 2,
            "functionIcon": null,
            "color": null,
            "seq": 7,
            "parentName": null
          },
          {
            "id": "38",
            "functionDepict": "互派管理",
            "functionPath": "sampling-setting",
            "parentId": "4",
            "functionLevel": 2,
            "functionIcon": null,
            "color": null,
            "seq": 7,
            "parentName": null
          },
          {
            "id": "c0db2c98-b17e-11e8-9cb0-00163e08",
            "functionDepict": "删除",
            "functionPath": "delete",
            "parentId": "24",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45e4c60c-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "导出",
            "functionPath": "excell",
            "parentId": "26",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "4598bc05-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "查询",
            "functionPath": "list",
            "parentId": "5",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45ad5426-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "查看",
            "functionPath": "detail",
            "parentId": "8",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "c0dddfcf-b17e-11e8-9cb0-00163e08",
            "functionDepict": "清除",
            "functionPath": "delete",
            "parentId": "20",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45bd757b-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "查询",
            "functionPath": "list",
            "parentId": "10",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45ca0a77-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "查询",
            "functionPath": "list",
            "parentId": "28",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45dacea6-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "数据",
            "functionPath": "data",
            "parentId": "16",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45a9b497-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "查询",
            "functionPath": "list",
            "parentId": "8",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45dc28ec-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "停用开启",
            "functionPath": "btn",
            "parentId": "16",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45d7ec17-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "授权",
            "functionPath": "update",
            "parentId": "16",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45ed25ff-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "查询",
            "functionPath": "list",
            "parentId": "27",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "c0dc9998-b17e-11e8-9cb0-00163e08",
            "functionDepict": "查看",
            "functionPath": "detail",
            "parentId": "25",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45b62e7a-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "查询",
            "functionPath": "list",
            "parentId": "11",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45ebba0e-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "关闭",
            "functionPath": "close",
            "parentId": "25",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45f16ece-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "查询",
            "functionPath": "list",
            "parentId": "30",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45d50d33-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "查询",
            "functionPath": "list",
            "parentId": "17",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "459100db-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "查询",
            "functionPath": "list",
            "parentId": "31",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45ea656d-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "确认",
            "functionPath": "confirm",
            "parentId": "25",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "457fdf26-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "重置点位",
            "functionPath": "setPoint",
            "parentId": "2",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45d39c98-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "查询",
            "functionPath": "list",
            "parentId": "18",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "d498e22b-b00c-11e8-9cb0-00163e08",
            "functionDepict": "查看",
            "functionPath": "list",
            "parentId": "3",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45ce34c4-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "查询",
            "functionPath": "list",
            "parentId": "19",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45dd9917-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "查询",
            "functionPath": "list",
            "parentId": "24",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45cb72d4-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "查询",
            "functionPath": "list",
            "parentId": "13",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45e1a825-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "停用开启",
            "functionPath": "btn",
            "parentId": "24",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45d94962-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "区域设置",
            "functionPath": "areaSet",
            "parentId": "16",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45cccbf0-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "查询",
            "functionPath": "list",
            "parentId": "22",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45b7a0bf-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "查看",
            "functionPath": "detail",
            "parentId": "11",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45e3187e-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "查询",
            "functionPath": "list",
            "parentId": "26",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "458146f6-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "管理APP",
            "functionPath": "manageApp",
            "parentId": "2",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45883573-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "管理货道",
            "functionPath": "manageAisle",
            "parentId": "2",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "c0d86fa8-b17e-11e8-9cb0-00163e08",
            "functionDepict": "查看",
            "functionPath": "detail",
            "parentId": "20",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45e8e77d-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "编辑",
            "functionPath": "update",
            "parentId": "25",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "459e36ac-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "查询",
            "functionPath": "list",
            "parentId": "6",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45e76ea2-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "派单",
            "functionPath": "add",
            "parentId": "25",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "4589abcf-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "修改编号",
            "functionPath": "editCode",
            "parentId": "2",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45a3b3cc-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "查询",
            "functionPath": "list",
            "parentId": "7",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45d69674-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "查询",
            "functionPath": "list",
            "parentId": "16",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45e6196d-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "查询",
            "functionPath": "list",
            "parentId": "25",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45931782-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "查看",
            "functionPath": "detail",
            "parentId": "31",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45aebee8-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "设置默认活动",
            "functionPath": "setDefault",
            "parentId": "8",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45c3fe28-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "查询",
            "functionPath": "list",
            "parentId": "20",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "457e6666-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "查询",
            "functionPath": "list",
            "parentId": "2",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 1,
            "parentName": null
          },
          {
            "id": "45c5af78-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "新建",
            "functionPath": "add",
            "parentId": "20",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 2,
            "parentName": null
          },
          {
            "id": "45ee8943-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "新建",
            "functionPath": "add",
            "parentId": "27",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 2,
            "parentName": null
          },
          {
            "id": "d49a86d1-b00c-11e8-9cb0-00163e08",
            "functionDepict": "新建",
            "functionPath": "add",
            "parentId": "3",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 2,
            "parentName": null
          },
          {
            "id": "45bf3550-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "新建",
            "functionPath": "add",
            "parentId": "10",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 2,
            "parentName": null
          },
          {
            "id": "45b01023-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "新建",
            "functionPath": "add",
            "parentId": "8",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 2,
            "parentName": null
          },
          {
            "id": "459a12d4-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "新建",
            "functionPath": "add",
            "parentId": "5",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 2,
            "parentName": null
          },
          {
            "id": "45cf7f21-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "新建",
            "functionPath": "add",
            "parentId": "19",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 2,
            "parentName": null
          },
          {
            "id": "459fa55f-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "新建",
            "functionPath": "add",
            "parentId": "6",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 2,
            "parentName": null
          },
          {
            "id": "45def762-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "新建",
            "functionPath": "add",
            "parentId": "24",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 2,
            "parentName": null
          },
          {
            "id": "45a54724-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "新建",
            "functionPath": "add",
            "parentId": "7",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 2,
            "parentName": null
          },
          {
            "id": "45b9121b-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "新建",
            "functionPath": "add",
            "parentId": "11",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 2,
            "parentName": null
          },
          {
            "id": "45947723-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "新建",
            "functionPath": "add",
            "parentId": "31",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 2,
            "parentName": null
          },
          {
            "id": "45e05853-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "编辑",
            "functionPath": "update",
            "parentId": "24",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 3,
            "parentName": null
          },
          {
            "id": "459600ac-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "编辑",
            "functionPath": "update",
            "parentId": "31",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 3,
            "parentName": null
          },
          {
            "id": "45c72abd-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "编辑",
            "functionPath": "update",
            "parentId": "20",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 3,
            "parentName": null
          },
          {
            "id": "d49c0a3d-b00c-11e8-9cb0-00163e08",
            "functionDepict": "编辑",
            "functionPath": "update",
            "parentId": "3",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 3,
            "parentName": null
          },
          {
            "id": "45f00b14-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "编辑",
            "functionPath": "update",
            "parentId": "27",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 3,
            "parentName": null
          },
          {
            "id": "45c0979e-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "编辑",
            "functionPath": "update",
            "parentId": "10",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 3,
            "parentName": null
          },
          {
            "id": "45b17cbb-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "编辑",
            "functionPath": "update",
            "parentId": "8",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 3,
            "parentName": null
          },
          {
            "id": "45a10d9d-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "编辑",
            "functionPath": "update",
            "parentId": "6",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 3,
            "parentName": null
          },
          {
            "id": "45d0f31d-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "修改",
            "functionPath": "update",
            "parentId": "19",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 3,
            "parentName": null
          },
          {
            "id": "459b7361-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "编辑",
            "functionPath": "update",
            "parentId": "5",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 3,
            "parentName": null
          },
          {
            "id": "45ba7363-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "编辑",
            "functionPath": "update",
            "parentId": "11",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 3,
            "parentName": null
          },
          {
            "id": "45a6afaf-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "编辑",
            "functionPath": "update",
            "parentId": "7",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 3,
            "parentName": null
          },
          {
            "id": "45975dc2-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "删除",
            "functionPath": "delete",
            "parentId": "31",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 4,
            "parentName": null
          },
          {
            "id": "45b34b8d-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "删除",
            "functionPath": "delete",
            "parentId": "8",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 4,
            "parentName": null
          },
          {
            "id": "45c8a1fd-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "删除",
            "functionPath": "delete",
            "parentId": "20",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 4,
            "parentName": null
          },
          {
            "id": "45a27d2a-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "删除",
            "functionPath": "delete",
            "parentId": "6",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 4,
            "parentName": null
          },
          {
            "id": "45a80d94-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "删除",
            "functionPath": "delete",
            "parentId": "7",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 4,
            "parentName": null
          },
          {
            "id": "45d24b1e-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "删除",
            "functionPath": "delete",
            "parentId": "19",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 4,
            "parentName": null
          },
          {
            "id": "459cda40-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "删除",
            "functionPath": "delete",
            "parentId": "5",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 4,
            "parentName": null
          },
          {
            "id": "45c1f9b1-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "删除",
            "functionPath": "delete",
            "parentId": "10",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 4,
            "parentName": null
          },
          {
            "id": "45b4cb48-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "统计",
            "functionPath": "statistics",
            "parentId": "8",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 4,
            "parentName": null
          },
          {
            "id": "d49d8ccd-b00c-11e8-9cb0-00163e08",
            "functionDepict": "删除",
            "functionPath": "delete",
            "parentId": "3",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 4,
            "parentName": null
          },
          {
            "id": "45bbd137-b0e6-11e8-9cb0-00163e08",
            "functionDepict": "删除",
            "functionPath": "delete",
            "parentId": "11",
            "functionLevel": 3,
            "functionIcon": null,
            "color": null,
            "seq": 4,
            "parentName": null
          },
          {
            id: 'a34',
            functionDepict: '数据统计',
            functionPath: 'data',
            parentId: null,
            functionLevel: 1,
            functionIcon: 'player',
            color: 'yellow'
          },
          {
            id: 'a35',
            functionDepict: '数据统计',
            functionPath: 'dataStatistics',
            parentId: 'a34',
            functionLevel: 2,
          },
        ],
        "functionArea": [
          {
            "id": "2c3110e948af4502b0d00df48bc7e032",
            "userId": "936451df9a7443c3a59102b193e3b7ff",
            "code": "110000000",
            "name": "天津",
            "province": "天津",
            "city": "",
            "district": null,
            "level": 2,
            "createId": "936451df9a7443c3a59102b193e3b7ff",
            "createTime": "2018-09-06 18:35:16"
          },
          {
            "id": "9129e8f19af94decb8995c9c99aab61f",
            "userId": "936451df9a7443c3a59102b193e3b7ff",
            "code": "100101000",
            "name": "东城区",
            "province": "北京",
            "city": "北京市",
            "district": "东城区",
            "level": 6,
            "createId": "936451df9a7443c3a59102b193e3b7ff",
            "createTime": "2018-09-06 18:35:16"
          }
          ]
      };
      res.send({
        code: 0,
        data,
        msg: '成功',
      });
      return;
    }
    res.send({
      type,
      code: 10,
      msg: '账号或密码错误',
      data: null,
    });
  },

  'GET /api/rule': getRule,
  'POST /api/rule': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  },
  'GET /admin/area/list': (req, res) => {
    res.send({
      "code": 0,
      "data": [{
        "code": "100000000",
        "parentCode": null,
        "name": "北京市",
        "provice": "北京市",
        "city": null,
        "district": null,
        "circle": null,
        "level": 2
      }, {
        "code": "100100000",
        "parentCode": "100000000",
        "name": "北京市",
        "provice": "北京市",
        "city": "北京市",
        "district": null,
        "circle": null,
        "level": 2
      }, {
        "code": "100101000",
        "parentCode": "100100000",
        "name": "东城区",
        "provice": "北京市",
        "city": "北京市",
        "district": "东城区",
        "circle": null,
        "level": 2
      }, {
        "code": "100101001",
        "parentCode": "100101000",
        "name": "王府井",
        "provice": "北京市",
        "city": "北京市",
        "district": "东城区",
        "circle": "王府井",
        "level": 2
      }]
    })
  },
  'POST /machine/locale/add': (req, res) => {
    res.send({
      "code": 0,
      "data": '',
      "msg": '成功',
    });
  },
  'GET /machine/locale/list': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 25,
        "list": null,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
      },
      "data": [{
        areaCode: "120202001",
        areaName: "河北省唐山市路北区1",
        circle: null,
        city: null,
        createId: "",
        createTime: "2018-07-05 11:20:48",
        district: null,
        id: "0be2a58e4e9845f8b4dd55acabaad3f31",
        isDelete: 0,
        mall: "汉光百货45557888",
        manager: "王小二",
        mobile: "15688886666",
        province: null,
        userNum: 120,
        remark: "欢迎光临",
        updateId: "",
        updateTime: "2018-07-05 11:20:48",
      }, {
        areaCode: "120202001",
        areaName: "河北省唐山市路北区2",
        circle: null,
        city: null,
        createId: "",
        createTime: "2018-07-05 11:20:48",
        district: null,
        id: "0be2a58e4e9845f8b4dd55acabaad3f32",
        isDelete: 0,
        mall: "汉光百货45557888",
        manager: "王小二",
        mobile: "15688886666",
        province: null,
        userNum: 120,
        remark: "欢迎光临",
        updateId: "",
        updateTime: "2018-07-05 11:20:48",
      }, {
        areaCode: "120202001",
        areaName: "河北省唐山市路北区3",
        circle: null,
        city: null,
        createId: "",
        createTime: "2018-07-05 11:20:48",
        district: null,
        id: "0be2a58e4e9845f8b4dd55acabaad3f33",
        isDelete: 0,
        mall: "汉光百货45557888",
        manager: "王小二",
        mobile: "15688886666",
        province: null,
        userNum: 120,
        remark: "欢迎光临",
        updateId: "",
        updateTime: "2018-07-05 11:20:48",
      }, {
        areaCode: "120202001",
        areaName: "河北省唐山市路北区4",
        circle: null,
        city: null,
        createId: "",
        createTime: "2018-07-05 11:20:48",
        district: null,
        id: "0be2a58e4e9845f8b4dd55acabaad3f34",
        isDelete: 0,
        mall: "汉光百货45557888",
        manager: "王小二",
        mobile: "15688886666",
        province: null,
        userNum: 120,
        remark: "欢迎光临",
        updateId: "",
        updateTime: "2018-07-05 11:20:48",
      }, {
        areaCode: "120202001",
        areaName: "河北省唐山市路北区5",
        circle: null,
        city: null,
        createId: "",
        createTime: "2018-07-05 11:20:48",
        district: null,
        id: "0be2a58e4e9845f8b4dd55acabaad3f35",
        isDelete: 0,
        mall: "汉光百货45557888",
        manager: "王小二",
        mobile: "15688886666",
        province: null,
        userNum: 120,
        remark: "欢迎光临",
        updateId: "",
        updateTime: "2018-07-05 11:20:48",
      }, {
        areaCode: "120202001",
        areaName: "河北省唐山市路北区6",
        circle: null,
        city: null,
        createId: "",
        createTime: "2018-07-05 11:20:48",
        district: null,
        id: "0be2a58e4e9845f8b4dd55acabaad3f36",
        isDelete: 0,
        mall: "汉光百货45557888",
        manager: "王小二",
        mobile: "15688886666",
        province: null,
        userNum: 120,
        remark: "欢迎光临",
        updateId: "",
        updateTime: "2018-07-05 11:20:48",
      }, {
        areaCode: "120202001",
        areaName: "河北省唐山市路北区7",
        circle: null,
        city: null,
        createId: "",
        createTime: "2018-07-05 11:20:48",
        district: null,
        id: "0be2a58e4e9845f8b4dd55acabaad3f37",
        isDelete: 0,
        mall: "汉光百货45557888",
        manager: "王小二",
        mobile: "15688886666",
        province: null,
        userNum: 120,
        remark: "欢迎光临",
        updateId: "",
        updateTime: "2018-07-05 11:20:48",
      }, {
        areaCode: "120202001",
        areaName: "河北省唐山市路北区8",
        circle: null,
        city: null,
        createId: "",
        createTime: "2018-07-05 11:20:48",
        district: null,
        id: "0be2a58e4e9845f8b4dd55acabaad3f38",
        isDelete: 0,
        mall: "汉光百货45557888",
        manager: "王小二",
        mobile: "15688886666",
        province: null,
        userNum: 120,
        remark: "欢迎光临",
        updateId: "",
        updateTime: "2018-07-05 11:20:48",
      }, {
        areaCode: "120202001",
        areaName: "河北省唐山市路北区9",
        circle: null,
        city: null,
        createId: "",
        createTime: "2018-07-05 11:20:48",
        district: null,
        id: "0be2a58e4e9845f8b4dd55acabaad3f39",
        isDelete: 0,
        mall: "汉光百货45557888",
        manager: "王小二",
        mobile: "15688886666",
        province: null,
        userNum: 120,
        remark: "欢迎光临",
        updateId: "",
        updateTime: "2018-07-05 11:20:48",
      }, {
        areaCode: "120202001",
        areaName: "河北省唐山市路北区10",
        circle: null,
        city: null,
        createId: "",
        createTime: "2018-07-05 11:20:48",
        district: null,
        id: "0be2a58e4e9845f8b4dd55acabaad3f310",
        isDelete: 0,
        mall: "汉光百货45557888",
        manager: "王小二",
        mobile: "15688886666",
        province: null,
        userNum: 120,
        remark: "欢迎光临",
        updateId: "",
        updateTime: "2018-07-05 11:20:48",
      }, {
        areaCode: "120202001",
        areaName: "河北省唐山市路北区11",
        circle: null,
        city: null,
        createId: "",
        createTime: "2018-07-05 11:20:48",
        district: null,
        id: "0be2a58e4e9845f8b4dd55acabaad3f311",
        isDelete: 0,
        mall: "汉光百货45557888",
        manager: "王小二",
        mobile: "15688886666",
        province: null,
        userNum: 120,
        remark: "欢迎光临",
        updateId: "",
        updateTime: "2018-07-05 11:20:48",
      }, {
        areaCode: "120202001",
        areaName: "河北省唐山市路北区12",
        circle: null,
        city: null,
        createId: "",
        createTime: "2018-07-05 11:20:48",
        district: null,
        id: "0be2a58e4e9845f8b4dd55acabaad3f312",
        isDelete: 0,
        mall: "汉光百货45557888",
        manager: "王小二",
        mobile: "15688886666",
        province: null,
        userNum: 120,
        remark: "欢迎光临",
        updateId: "",
        updateTime: "2018-07-05 11:20:48",
      }, {
        areaCode: "120202001",
        areaName: "河北省唐山市路北区13",
        circle: null,
        city: null,
        createId: "",
        createTime: "2018-07-05 11:20:48",
        district: null,
        id: "0be2a58e4e9845f8b4dd55acabaad3f313",
        isDelete: 0,
        mall: "汉光百货45557888",
        manager: "王小二",
        mobile: "15688886666",
        province: null,
        userNum: 120,
        remark: "欢迎光临",
        updateId: "",
        updateTime: "2018-07-05 11:20:48",
      }]
    });
  },
  'GET /machine/locale/detail': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "data": {
        areaCode: "100101001",
        areaName: null,
        circle: "100101001",
        city: "100100000",
        createId: "",
        createTime: "2018-07-05 18:14:41",
        district: "100101000",
        id: "169e57b0c274400d8f7b066d92189eed",
        isDelete: 0,
        mall: "434534545",
        manager: "4355555555",
        mobile: "16619757554",
        province: "100000000",
        remark: "第三方的观点是",
        updateId: "",
        updateTime: "2018-07-05 18:14:41"
      }
    });
  },
  'POST /machine/locale/update': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "data": ""
    });
  },
  'POST /machine/locale/delete': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "data": ""
    });
  },
  'POST /machine/machine/updateGoodsCount': (req, res) => {
    res.send({
      "code": 0,
      "data": '',
      "msg": '成功',
    });
  },
  'GET /machine/machine/list': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 9,
        "list": null,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
      },
      "data": [
        {
          "id": "b0050d8f8839481682161f42317c2565",
          "machineCode": "1816603071182",
          "localDesc": "",
          "netStatus": 0,
          "activityName": null,
          "channelStatus": null,
          "goodsStatus": null
        },
        {
          "id": "123",
          "machineCode": "1823951070679",
          "localDesc": "北京市-东城区-王府井-西单商场-1层西侧",
          "netStatus": 0,
          "activityName": "618大促销",
          "channelStatus": "货道3错误2",
          "goodsStatus": "牛肉面剩余5"
        },
        {
          "id": "947639777c874724a954b1ca47f987f0",
          "machineCode": "1834003071023",
          "localDesc": "",
          "netStatus": 0,
          "activityName": null,
          "channelStatus": null,
          "goodsStatus": null
        },
        {
          "id": "a6064917a4d7489f9b00d96d88d46489",
          "machineCode": "1834024071079",
          "localDesc": "",
          "netStatus": 1,
          "activityName": null,
          "channelStatus": null,
          "goodsStatus": null
        },
        {
          "id": "18f05c0c234749c7bf6c60dda9f5092e",
          "machineCode": "1846698071048",
          "localDesc": "天津市-南开区--大沽口-2层西侧",
          "netStatus": 0,
          "activityName": "7夕欢乐秀",
          "channelStatus": "货道2错误1,货道1错误2",
          "goodsStatus": "怡宝款泉水剩余3"
        },
        {
          "id": "85e9773bf4614a18a0038fb55decac0b",
          "machineCode": "1863398071031",
          "localDesc": "",
          "netStatus": 0,
          "activityName": null,
          "channelStatus": null,
          "goodsStatus": null
        },
        {
          "id": "8389fc95a5324a02a45aabfc6823436d",
          "machineCode": "1863398071038",
          "localDesc": "",
          "netStatus": 1,
          "activityName": null,
          "channelStatus": null,
          "goodsStatus": null
        },
        {
          "id": "cd449e64307042a09448769f3a21fdc3",
          "machineCode": "1863398071039",
          "localDesc": "",
          "netStatus": 0,
          "activityName": null,
          "channelStatus": null,
          "goodsStatus": null
        },
        {
          "id": "abddd26aa2d74ddfa207920074c29ddf",
          "machineCode": "1889824071145",
          "localDesc": "",
          "netStatus": 0,
          "activityName": null,
          "channelStatus": null,
          "goodsStatus": null
        }
      ]
    });
  },
  'GET /machine/machine/channelInfo': (req, res) => {
    res.send({
        "code": 0,
        "data": [
          {
            "id": "20285f30f99e4532ac0090c96b0de737",
            "code": "5",
            "goodsName": "““",
            "goodsPrice": 1,
            "volumeCount": 250,
            "goodsCount": 2,
            "workStatus": 0,
            "reason": null,
            "isDelete": 0
          },
          {
            "id": "6b1cd14cb3d345e6a24e70eb99f1696c",
            "code": "2",
            "goodsName": "““",
            "goodsPrice": 1,
            "volumeCount": 100,
            "goodsCount": 1,
            "workStatus": 1,
            "reason": "错误1",
            "isDelete": 0
          },
          {
            "id": "6fdd19bdb40b4184a287e73c23c82561",
            "code": "1",
            "goodsName": "来一杯",
            "goodsPrice": 0.99,
            "volumeCount": 50,
            "goodsCount": 2,
            "workStatus": 2,
            "reason": "错误2",
            "isDelete": 0
          },
          {
            "id": "779f0777671147bda863ebcb94fd9399",
            "code": "3",
            "goodsName": "来一杯",
            "goodsPrice": 0.99,
            "volumeCount": 150,
            "goodsCount": 3,
            "workStatus": 0,
            "reason": null,
            "isDelete": 0
          },
          {
            "id": "ccf5672ea2fb474d9a3b90a9c75346c3",
            "code": "4",
            "goodsName": "来一杯",
            "goodsPrice": 0.99,
            "volumeCount": 200,
            "goodsCount": 5,
            "workStatus": 0,
            "reason": null,
            "isDelete": 0
          }
        ],
        "msg": "成功"
      });
  },
  'GET /machine/machine/appStatus': (req, res) => {
    res.send({
      "code": 0,
      "data": {
        "machineId": "1823951070679",
        "status": [
          {
            "machineId": null,
            "appPackageName": "com.muwood.chainapp",
            "versionName": "1.2",
            "versionCode": 9,
            "appName": "海链",
            "appStatus": 0,
            "appType": 1
          },
          {
            "machineId": null,
            "appPackageName": "com.detection.inno72.test",
            "versionName": "1.0",
            "versionCode": 1,
            "appName": "测试程序",
            "appStatus": 0,
            "appType": 2
          },
          {
            "machineId": null,
            "appPackageName": "com.detection.inno72.installer",
            "versionName": null,
            "versionCode": -1,
            "appName": "安装器",
            "appStatus": 0,
            "appType": 2
          }
        ],
        "createTime": "2018-07-09 16:19:11"
      },
      "msg": "成功"
    });
  },
  'GET 	/machine/machine/cutApp': (req, res) => {
    res.send({
      "code": 1,
      "data": null,
      "msg": "发送失败"
    })
  },
  'GET /machine/machine/installApp': (req, res) => {
    res.send({
      "code": 1,
      "data": null,
      "msg": "发送失败"
    })
  },
    'GET /machine/machine/machineStatus': (req, res) => {
    res.send({
      "code": 0,
      "data": {
        "machineStatus": {
          "machineId": "1823951070671111111111",
          "machineDoorStatus": 0,
          "dropGoodsSwitch": 1,
          "goodsChannelStatus": "[]",
          // "temperature": null,
          "temperatureSwitchStatus": 0,
          "createTime": "2018-07-09 15:44:16"
        },
        "systemStatus": {
          "machineId": "1823951070679",
          "networkType": "Wi-Fi",
          "networkOperateName": "未知",
          "accid": "89860617040040920938",
          "memoryFree": 4329,
          "memoryTotle": 5502,
          "cpu": "0.0%",
          "sdFree": 4329,
          "sdTotle": 5502,
          "ping": "23ms",
          "createTime": "2018-07-13 14:34:13"
        },
        "imgs": [
          {
            "id": "0022f24a0aef4fb9aca61d19c4a31bf5",
            "machineCode": "18527298",
            "imgUrl": "app/img/54e7f349ae5d49b592166c2f670b60a1.png",
            "createTime": "2018-08-19 13:07:22"
          }
        ],
      },
      "msg": "成功"
    });
  },
  'POST /machine/machine/updateInfo': (req, res) => {
    res.send({"msg":"成功","code":0, "data": ""});
  },
  'POST /machine/machine/update': (req, res) => {
    res.send({"msg":"成功","code":0, "data": ""});
  },
  'POST /machine/machine/delete': (req, res) => {
    res.send({"msg":"成功","code":0, "data": ""});
  },
  'POST /project/channel/add': (req, res) => {
    res.send({
      "code": 0,
      "data": '',
      "msg": '成功',
    });
  },
  'GET /machine/machine/channelInfo': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {
          "id": "20285f30f99e4532ac0090c96b0de737",
          "code": "5",
          "goodsName": "““",
          "goodsPrice": 1,
          "volumeCount": 250,
          "goodsCount": 2,
          "workStatus": 0,
          "reason": null,
          "isDelete": 0
        },
        {
          "id": "6b1cd14cb3d345e6a24e70eb99f1696c",
          "code": "2",
          "goodsName": "““",
          "goodsPrice": 1,
          "volumeCount": 100,
          "goodsCount": 1,
          "workStatus": 1,
          "reason": "错误1",
          "isDelete": 0
        },
        {
          "id": "6fdd19bdb40b4184a287e73c23c82561",
          "code": "1",
          "goodsName": "来一杯",
          "goodsPrice": 0.99,
          "volumeCount": 50,
          "goodsCount": 2,
          "workStatus": 2,
          "reason": "错误2",
          "isDelete": 0
        },
        {
          "id": "779f0777671147bda863ebcb94fd9399",
          "code": "3",
          "goodsName": "来一杯",
          "goodsPrice": 0.99,
          "volumeCount": 150,
          "goodsCount": 3,
          "workStatus": 0,
          "reason": null,
          "isDelete": 0
        },
        {
          "id": "ccf5672ea2fb474d9a3b90a9c75346c3",
          "code": "4",
          "goodsName": "来一杯",
          "goodsPrice": 0.99,
          "volumeCount": 200,
          "goodsCount": 5,
          "workStatus": 0,
          "reason": null,
          "isDelete": 0
        }
      ],
      "msg": "成功"
    })
  },
  'POST /machine/machine/updateMachineCode': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'POST /machine/machine/updateLocale':  (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'POST /machine/machine/findMachineInfoById': (req, res) => {
    res.send({
      "code": 0,
      "data": {
        "id": "6628a821f2e44a538e0e0801e494a2be",
        "openStatus": 0,
        "monitorStart": null,
        "monitorEnd": null,
        "localStr": "北京市-北京市-西城区-小西天-灯市口-YPY"
      },
      "msg": "成功"
    })
  },
  'POST /machine/machine/deleteChannel':  (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'GET /project/channel/list': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 25,
        "list": null,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
      },
      "data": [{
        channelCode: "108980980980809089",
        channelName: "自供应566789",
        createId: "",
        createTime: "2018-07-05 14:47:09",
        id: "1",
        isDelete: 0,
        updateId: "",
        updateTime: "2018-07-05 14:47:09",
      }]
    });
  },
  'GET /project/channel/getList': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 25,
        "list": null,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
      },
      "data": [{
        areCode: null,
        createId: "",
        createTime: "2018-07-04 16:55:27",
        id: "0be2a58e4e9845f8b4dd55acabaad3f3",
        isDelete: 0,
        mall: "汉光百货",
        manager: "王小二",
        mobile: "15688886666",
        remark: "欢迎光临",
        updateId: "",
        updateTime: "2018-07-04 16:55:27",
      }]
    });
  },
  'GET /project/merchant/getList': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 25,
        "list": null,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
      },
      "data": [{
        "id": "3",
        "merchantCode": "2",
        "merchantName": "天猫",
        "createId": "12",
        "updateId": null,
        "createTime": 1530499549000,
        "updateTime": 1530499549000,
        "isDelete": 0
      }]
    });
  },
  'GET /project/shops/selectActivityShops': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "data": [{
        "id": "1",
        "shopName": "天猫小米旗舰店",
        "shopCode": "10000@XXXAXX",
        "sellerId": "1",
        "isDelete": 0,
        "remark": null,
        "createId": "1",
        "createTime": "2018-07-05 10:37:23",
        "updateId": null,
        "updateTime": "2018-07-05 10:37:23"
      }]
    });
  },
  'GET /project/shops/getList': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "data": [{
        createId: "1",
        createTime: "2018-07-05 18:43:09",
        id: "1",
        isDelete: 0,
        remark: null,
        sellerId: "1",
        shopCode: "10000@XXXAXX",
        shopName: "天猫小米旗舰店",
        updateId: "",
        updateTime: "2018-07-05 18:43:09",
      }]
    });
  },
  'GET /project/shops/selectMerchantShops': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "data": [{
        createId: "1",
        createTime: "2018-07-05 18:43:09",
        id: "1",
        isDelete: 0,
        remark: null,
        sellerId: "1",
        shopCode: "10000@XXXAXX",
        shopName: "商户1-天猫小米旗舰店",
        updateId: "",
        updateTime: "2018-07-05 18:43:09",
      }]
    });
  },
  'GET /project/activity/getList': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "data": [{
        createId: "1",
        createTime: "2018-07-05 18:43:09",
        id: "1",
        isDelete: 0,
        remark: null,
        sellerId: "1",
        shopCode: "10000@XXXAXX",
        shopName: "天猫小米旗舰店",
        updateId: "",
        updateTime: "2018-07-05 18:43:09",
      }]
    });
  },
  'GET /project/game/getList': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "data": [{
        createId: "1",
        createTime: "2018-07-05 18:43:09",
        id: "1",
        isDelete: 0,
        remark: null,
        sellerId: "1",
        shopCode: "10000@XXXAXX",
        shopName: "天猫小米旗舰店",
        updateId: "",
        updateTime: "2018-07-05 18:43:09",
      }]
    });
  },
  'POST /project/game/getList': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "data": [{
        createId: "1",
        createTime: "2018-07-05 18:43:09",
        id: "1",
        isDelete: 0,
        remark: null,
        sellerId: "1",
        shopCode: "10000@XXXAXX",
        shopName: "天猫小米旗舰店",
        updateId: "",
        updateTime: "2018-07-05 18:43:09",
      }]
    });
  },
  'GET /project/channel/detail': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 25,
        "list": null,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
      },
      "data": {
        areCode: null,
        createId: "",
        createTime: "2018-07-04 16:55:27",
        id: "0be2a58e4e9845f8b4dd55acabaad3f3",
        isDelete: 0,
        mall: "汉光百货",
        manager: "王小二",
        mobile: "15688886666",
        remark: "欢迎光临",
        updateId: "",
        updateTime: "2018-07-04 16:55:27",
        province: 100000,
        city: 100000,
        district: 100000,
        circle: '其他'
      }
    });
  },
  'POST /project/channel/update': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "data": ""
    });
  },
  'POST /project/channel/delete': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "data": ""
    });
  },
  'POST /project/merchant/add': (req, res) => {
    res.send({
      "code": 0,
      "data": '',
      "msg": '成功',
    });
  },
  'GET /project/merchant/list': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 25,
        "list": null,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
      },
      "data": [{
        brandName: "时代的",
        channelId: "哇哈哈哇哈哈哈哈",
        createId: null,
        createTime: "2018-07-05 17:54:12",
        id: "1",
        isDelete: 0,
        merchantCode: "1000010000000",
        merchantName: "伊利",
        originFlag: "钱钱钱",
        updateId: null,
        updateTime: "2018-07-05 17:54:12",
      }]
    });
  },
  'GET /project/merchant/detail': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 25,
        "list": null,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
      },
      "data": {
        areCode: null,
        createId: "",
        createTime: "2018-07-04 16:55:27",
        id: "0be2a58e4e9845f8b4dd55acabaad3f3",
        isDelete: 0,
        mall: "汉光百货",
        manager: "王小二",
        mobile: "15688886666",
        remark: "欢迎光临",
        updateId: "",
        updateTime: "2018-07-04 16:55:27",
        province: 100000,
        city: 100000,
        district: 100000,
        circle: '其他'
      }
    });
  },
  'POST /project/merchant/update': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "data": ""
    });
  },
  'POST /project/merchant/delete': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "data": ""
    });
  },
  'POST /project/shops/add': (req, res) => {
    res.send({
      "code": 0,
      "data": '',
      "msg": '成功',
    });
  },
  'GET /project/shops/list': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 25,
        "list": null,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
      },
      "data": [{
        createId: "1",
        createTime: "2018-07-05 18:43:09",
        id: "1",
        isDelete: 0,
        remark: null,
        sellerId: "伊利",
        shopCode: "10000@XXXAXX",
        shopName: "天猫小米旗舰店",
        updateId: "",
        updateTime: "2018-07-05 18:43:09",
      }]
    });
  },
  'GET /project/shops/detail': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 25,
        "list": null,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
      },
      "data": {
        areCode: null,
        createId: "",
        createTime: "2018-07-04 16:55:27",
        id: "0be2a58e4e9845f8b4dd55acabaad3f3",
        isDelete: 0,
        mall: "汉光百货",
        manager: "王小二",
        mobile: "15688886666",
        remark: "欢迎光临",
        updateId: "",
        updateTime: "2018-07-04 16:55:27",
        province: 100000,
        city: 100000,
        district: 100000,
        circle: '其他'
      }
    });
  },
  'POST /project/shops/update': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "data": ""
    });
  },
  'POST /project/shops/delete': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "data": ""
    });
  },
  'POST /project/activity/add': (req, res) => {
    res.send({
      "code": 0,
      "data": '',
      "msg": '成功',
    });
  },
  'GET /project/activity/list': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 25,
        "list": null,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
      },
      "data": [{
        createId: null,
        createTime: "2018-07-06 12:08:12",
        endTime: "2018-08-02 11:50:50",
        id: "b61980f55b284fdb99d41346123a605f",
        isDelete: 0,
        name: "erret",
        remark: "wuwuwuuwuwuwu",
        sellerId: "伊利",
        shopId: "wefewfwef",
        startTime: null,
        updateId: null,
        updateTime: "2018-07-06 12:11:09",
        prizeType: 100300,
        state: '未排期',
      }]
    });
  },
  'GET /project/activity/detail': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 25,
        "list": null,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
      },
      "data": {
        areCode: null,
        createId: "",
        createTime: "2018-07-04 16:55:27",
        id: "0be2a58e4e9845f8b4dd55acabaad3f3",
        isDelete: 0,
        mall: "汉光百货",
        manager: "王小二",
        mobile: "15688886666",
        remark: "欢迎光临",
        updateId: "",
        updateTime: "2018-07-04 16:55:27",
        province: 100000,
        city: 100000,
        district: 100000,
        circle: '其他',
        sellerId: 400,
      }
    });
  },
  'POST /project/activity/update': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "data": ""
    });
  },
  'POST /project/activity/delete': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "data": ""
    });
  },
  'POST /project/game/add': (req, res) => {
    res.send({
      "code": 0,
      "data": '',
      "msg": '成功',
    });
  },
  'GET /project/game/list': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 25,
        "list": null,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
      },
      "data": [{
        activityId: "618大促销",
        createId: "",
        createTime: "2018-07-06 14:26:40",
        id: "fbdafe1eb2e94179ba0b57eae0cc3e26",
        interactId: "324",
        isDelete: 0,
        maxParticipancePerDay: 23,
        maxParticipanceTotal: 345,
        maxPrizePerDay: 43578,
        maxPrizeTotal: 3456789,
        name: "324234",
        remark: "wer",
        sellerId: "名称1",
        shopId: "324234",
        updateId: "",
        updateTime: "2018-07-06 14:26:40",
        version: "23432",
        versionInno72: "234",
      }]
    });
  },
  'GET /project/game/detail': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 25,
        "list": null,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
      },
      "data": {
        areCode: null,
        createId: "",
        createTime: "2018-07-04 16:55:27",
        id: "0be2a58e4e9845f8b4dd55acabaad3f3",
        isDelete: 0,
        mall: "汉光百货",
        manager: "王小二",
        mobile: "15688886666",
        remark: "欢迎光临",
        updateId: "",
        updateTime: "2018-07-04 16:55:27",
        province: 100000,
        city: 100000,
        district: 100000,
        circle: '其他'
      }
    });
  },
  'POST /project/game/update': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "data": ""
    });
  },
  'POST /project/game/delete': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "data": ""
    });
  },
  'POST /project/goods/add': (req, res) => {
    res.send({
      "code": 0,
      "data": '',
      "msg": '成功',
    });
  },
  'GET /project/goods/list': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 25,
        "list": null,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
      },
      "data": [{
        code: "10000222XXX",
        createId: "",
        createTime: "2018-07-06 16:26:46",
        id: "2a7e460b7d8149ffb110d947446597e9",
        img: "1",
        isDelete: null,
        name: null,
        price: 0.99,
        remark: "0.99",
        sellerId: "伊利",
        updateId: "",
        updateTime: "2018-07-06 16:26:46"
      }]
    });
  },
  'GET /project/goods/detail': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 25,
        "list": null,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
      },
      "data": {
        areCode: null,
        createId: "",
        createTime: "2018-07-04 16:55:27",
        id: "0be2a58e4e9845f8b4dd55acabaad3f3",
        isDelete: 0,
        mall: "汉光百货",
        manager: "王小二",
        mobile: "15688886666",
        remark: "欢迎光临",
        updateId: "",
        updateTime: "2018-07-04 16:55:27",
        province: 100000,
        city: 100000,
        district: 100000,
        circle: '其他'
      }
    });
  },
  'POST /project/goods/update': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "data": ""
    });
  },
  'POST /project/goods/delete': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "data": ""
    });
  },
  'GET /project/activityPlan/list': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 4,
        "list": null,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
      },
      "data": [
        {
          "id": "4",
          "activityId": null,
          "gameId": null,
          "startTime": "2018-07-01 13:00:29",
          "endTime": "2018-07-10 13:00:41",
          "prizeType": null,
          "isDelete": 0,
          "remark": null,
          "createId": null,
          "createTime": 1531294673000,
          "updateId": null,
          "updateTime": 1531294673000,
          "activityName": "大股东"
        },
        {
          "id": "2",
          "activityId": null,
          "gameId": null,
          "startTime": "2018-07-11 11:56:19",
          "endTime": "2018-07-13 11:56:22",
          "prizeType": null,
          "isDelete": 0,
          "remark": null,
          "createId": null,
          "createTime": 1531294662000,
          "updateId": null,
          "updateTime": 1531294662000,
          "activityName": "618大促销"
        },
        {
          "id": "1",
          "activityId": null,
          "gameId": null,
          "startTime": "2018-07-11 11:55:49",
          "endTime": "2018-07-13 11:55:52",
          "prizeType": null,
          "isDelete": 0,
          "remark": null,
          "createId": null,
          "createTime": 1531294655000,
          "updateId": null,
          "updateTime": 1531294655000,
          "activityName": "7夕欢乐秀"
        },
        {
          "id": "3",
          "activityId": null,
          "gameId": null,
          "startTime": "2018-07-14 12:56:15",
          "endTime": "2018-07-31 12:56:23",
          "prizeType": null,
          "isDelete": 0,
          "remark": null,
          "createId": null,
          "createTime": 1531294670000,
          "updateId": null,
          "updateTime": 1531294670000,
          "activityName": "reterte"
        }
      ]
    })
  },
  'GET /order/list': (req, res) => {
    res.send({"msg":"成功","code":0,"page":{"pageSize":20,"currentResult":0,"totalPage":3,"pageNo":1,"totalCount":52,"list":null,"firstPage":true,"lastPage":false,"nextPage":2,"prePage":1,"firstResult":0},"data":[{"id":"3ac834d4-8328-11e8-80ec-00163e0879d9","orderNum":'32128493',"userId":"9b8c0514-8050-11e8-80ec-00163e0879d9","channelId":null,"machineId":"123","nickName":"张三","shopsName":"哈尔滨啤酒","merPointAddress":"北京市朝阳区朝阳公园","activityName":"哈啤","goodsCount":1,"gameId":null,"orderTime":"2018-07-09 11:29:04","orderPrice":0.1,"orderType":"1000","payStatus":"0","payTime":null,"goodsStatus":0,"activityId":'3ac834d4-832',"channelCode":null,"channelName":null,"machineCode":"23829323","machineName":null,"gameName":"答题","gameRemark":null,"keyword":null,"orderGoodsList":[{"id":"sjjjjjjjjj","orderId":"3ac834d4-8328-11e8-80ec-00163e0879d9","orderNum":null,"goodsType":1,"goodsId":"1111","goodsName":"伊利酸牛奶","goodsCode":"433333333","goodsPrice":1.2,"status":1}],"pageNo":0},{"id":"029f1999-836a-11e8-80ec-00163e0879d9","orderNum":null,"userId":"9b8c0514-8050-11e8-80ec-00163e0879d9","channelId":null,"machineId":"123","gameId":null,"orderTime":"2018-07-09 11:19:57","orderPrice":null,"orderType":"1000","payStatus":"1","payTime":"2018-07-09 11:20:26","goodsStatus":0,"activityId":null,"channelCode":null,"channelName":null,"machineCode":null,"machineName":null,"gameName":null,"gameRemark":null,"keyword":null,"orderGoodsList":null,"pageNo":0}]});
  },
  'GET /accountsystem/user/list': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 2,
        "list": null,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
      },
      "data": [{
          "id": "2f8e7c92cccb46aba2f86646dcba0565",
          "userId": "1553444821337801",
          "name": "叶勤康",
          "mobile": "18910628406",
          "email": "",
          "orgEmail": null,
          "position": "",
          "avatar": "",
          "createTime": "2018-07-03 18:15:13",
          "isDelete": 0,
          "deptName": "北京点七二创意互动传媒文化有限公司|"
        },
        {
          "id": "da267e278b2b4f6c934351b956d1f3f0",
          "userId": "09672669152299397",
          "name": "KARA",
          "mobile": "18610567983",
          "email": "",
          "orgEmail": null,
          "position": "",
          "avatar": "https://static.dingtalk.com/media/lADPACOG83LQT67NBNrNBNo_1242_1242.jpg",
          "createTime": "2018-07-03 18:15:13",
          "isDelete": 0,
          "deptName": "北京点七二创意互动传媒文化有限公司|"
        }
      ]
    })
  },
  'GET /system/user/list': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 2,
        "list": null,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
      },
      "data": [{
          "id": "2f8e7c92cccb46aba2f86646dcba0565",
          "userId": "1553444821337801",
          "name": "叶勤康",
          "mobile": "18910628406",
          "email": "",
          "orgEmail": null,
          "position": "",
          "avatar": "",
          "createTime": "2018-07-03 18:15:13",
          "isDelete": 0,
          "deptName": "北京点七二创意互动传媒文化有限公司|",
          "roles": "管理员",
        },
        {
          "id": "da267e278b2b4f6c934351b956d1f3f0",
          "userId": "09672669152299397",
          "name": "KARA",
          "mobile": "18610567983",
          "email": "",
          "orgEmail": null,
          "position": "",
          "avatar": "https://static.dingtalk.com/media/lADPACOG83LQT67NBNrNBNo_1242_1242.jpg",
          "createTime": "2018-07-03 18:15:13",
          "isDelete": 0,
          "deptName": "北京点七二创意互动传媒文化有限公司|",
          "roles": "管理员2",
        }
      ]
    })
  },
  'GET /system/role/list': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 2,
        "list": null,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
      },
      "data": [{
          "id": "1019616312fd408c800f6bed5020b474",
          "name": "超级管理员",
          "auths": "机器管理,商户管理,渠道管理,点位管理,货机管理,店铺管理,项目管理,活动管理"
        },
        {
          "id": "2787ec11def64f489db14ef246db265a",
          "name": "超级管理员",
          "auths": "活动管理"
        }
      ]
    })
  },
  'GET /system/dept/list': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 4,
        "list": null,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
      },
      "data": [{
          "id": "1",
          "name": "北京点七二创意互动传媒文化有限公司",
          "seq": 0,
          "parentId": null,
          "parentName": null
        },
        {
          "id": "69571888",
          "name": "渠道运营部",
          "seq": 0,
          "parentId": "1",
          "parentName": "北京点七二创意互动传媒文化有限公司"
        },
        {
          "id": "69554954",
          "name": "业务创意部",
          "seq": 1,
          "parentId": "1",
          "parentName": "北京点七二创意互动传媒文化有限公司"
        },
        {
          "id": "69711248",
          "name": "研发部",
          "seq": 3,
          "parentId": "1",
          "parentName": "北京点七二创意互动传媒文化有限公司"
        }
      ]
    })
  },
  'GET /system/function/list': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 4,
        "list": null,
        "firstPage": true,
        "lastPage": true,
        "firstResult": 0,
        "nextPage": 1,
        "prePage": 1
      },
      "data": [{
          "id": "4",
          "functionDepict": "项目管理",
          "functionPath": "project",
          "parentId": null,
          "functionLevel": 1,
          "functionIcon": "project",
          "color": "#ffd322",
          "parentName": null
        },
        {
          "id": "5",
          "functionDepict": "渠道管理",
          "functionPath": "channel",
          "parentId": "4",
          "functionLevel": 2,
          "functionIcon": null,
          "color": null,
          "parentName": "项目管理"
        },
        {
          "id": "6",
          "functionDepict": "商户管理",
          "functionPath": "merchant",
          "parentId": "4",
          "functionLevel": 2,
          "functionIcon": null,
          "color": null,
          "parentName": "项目管理"
        },
        {
          "id": "7",
          "functionDepict": "店铺管理",
          "functionPath": "shop",
          "parentId": "4",
          "functionLevel": 2,
          "functionIcon": null,
          "color": null,
          "parentName": "项目管理"
        }
      ]
    })
  },
  'GET /system/role/all': (req, res) => {
    res.send({
      "code": 0,
      "data": [{
          "id": "1019616312fd408c800f6bed5020b474",
          "name": "超级管理员",
          "auths": null
        },
        {
          "id": "2787ec11def64f489db14ef246db265a",
          "name": "超级管理员",
          "auths": null
        }
      ],
      "msg": "成功"
    })
  },
  'GET /system/user/auth': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'GET /system/function/all': (req, res) => {
    res.send({
      "code": 0,
      "data": {
        "functions": [
          "11",
          "13",
          "3",
          "14",
          "1",
          "2",
          "12"
        ],
        "tree": {
          "title": "机器管理系统",
          "id": "XX",
          "children": [{
              "title": "货机管理",
              "id": "1",
              "children": [{
                  "title": "机器管理",
                  "id": "2",
                  "children": null
                },
                {
                  "title": "点位管理",
                  "id": "3",
                  "children": null
                }
              ]
            },
            {
              "title": "订单管理",
              "id": "12",
              "children": [{
                "title": "订单管理",
                "id": "13",
                "children": null
              }]
            },
            {
              "title": "商品管理",
              "id": "14",
              "children": [{
                "title": "商品管理",
                "id": "11",
                "children": null
              }]
            },
            {
              "title": "系统管理",
              "id": "15",
              "children": [{
                  "title": "员工管理",
                  "id": "16",
                  "children": null
                },
                {
                  "title": "部门管理",
                  "id": "17",
                  "children": null
                },
                {
                  "title": "权限管理",
                  "id": "18",
                  "children": null
                },
                {
                  "title": "角色管理",
                  "id": "19",
                  "children": null
                }
              ]
            },
            {
              "title": "项目管理",
              "id": "4",
              "children": [{
                  "title": "活动排期",
                  "id": "20",
                  "children": null
                },
                {
                  "title": "渠道管理",
                  "id": "5",
                  "children": null
                },
                {
                  "title": "商户管理",
                  "id": "6",
                  "children": null
                },
                {
                  "title": "店铺管理",
                  "id": "7",
                  "children": null
                },
                {
                  "title": "活动管理",
                  "id": "8",
                  "children": null
                }
              ]
            },
            {
              "title": "游戏管理",
              "id": "9",
              "children": [{
                "title": "游戏管理",
                "id": "10",
                "children": null
              }]
            }
          ]
        }
      },
      "msg": "成功"
    })
  },
  'GET /system/role/add': (req, res) => {
    res.send({

      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'GET /system/role/update': (req, res) => {
    res.send({

      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'GET /system/role/delete': (req, res) => {
    res.send({

      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'GET /system/user/queryUserRoles': (req, res) => {
    res.send({
      "code": 0,
      "data": [{
          "id": "2f035d75048c4dfcb1ed82c8b3b64f05",
          "userId": "ef93e290f7854ccdb88bbbd217438c31",
          "roleId": "2787ec11def64f489db14ef246db265a"
        },
        {
          "id": "5d4504d31ad0473a92ced2bf336144ae",
          "userId": "ef93e290f7854ccdb88bbbd217438c31",
          "roleId": "ddcc8a09251a4befafb7188078a5a0c6"
        }
      ],
      "msg": "成功"
    })
  },
  'GET /activity/list': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 25,
        "list": null,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
      },
      "data": [{
        id: 1,
        activityName: "1111111",
        startTime: '2018-7-13 09:00',
        endTime: '2018-7-15 09:00',
      }, {
        id: 2,
        activityName: "222222",
        startTime: '2018-7-15 09:00',
        endTime: '2018-7-16 09:00',
      }]
    });
  },
  'GET /project/user/list': (req, res) => {
    res.send({"msg":"成功","code":0,"page":{"pageSize":20,"currentResult":0,"totalPage":1,"pageNo":1,"totalCount":1,"list":null,"firstResult":0,"firstPage":true,"lastPage":true,"nextPage":1,"prePage":1},"data":[{"id":"ddddddd","userNick":"大姐姐","phone":"13454345656","gameUserId":"hjkjhghjkhjk","channelId":"hjjkklllll","channelName":"到年底","channelUserKey":"nnnmm","createTime":1531477140000}]})
  },
  'POST /project/activityPlan/update': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'GET /project/activityPlan/detail': (req, res) => {
    res.send({
      "code": 0,
      "data": {
        "id": "6666",
        "activityId": "f3092aec236e4ce4a5d964b16a348ef6",
        "gameId": "1",
        "startTime": "2018-07-01 15:04:46",
        "endTime": "2018-07-31 15:04:53",
        "userMaxTimes": "1",
        "prizeType": "100300",
        "isDelete": 0,
        "remark": null,
        "createId": null,
        "createTime": 1531467800000,
        "updateId": null,
        "updateTime": 1531467800000,
        "machines": null,
        "goods": [
          {
            "id": null,
            "activityPlanId": null,
            "prizeId": "1",
            "prizeType": "及格就送",
            "resultCode": 1,
            "resultRemark": "及格就送"
          },
          {
            "id": null,
            "activityPlanId": null,
            "prizeId": "4",
            "prizeType": "90以上送",
            "resultCode": 2,
            "resultRemark": "90以上送"
          }
        ],
        "coupons": [
          {
            "id": null,
            "name": "天猫优惠券",
            "code": "TM10001",
            "activityPlanId": null,
            "isDelete": null,
            "remark": null,
            "createId": null,
            "createTime": null,
            "updateId": null,
            "updateTime": null,
            "resultCode": 3,
            "resultRemark": "失败送优惠券",
            "prizeType": "2"
          }
        ],
        "activityName": "618大促销"
      },
      "msg": "成功"
    })
  },
  'POST /project/activityPlan/delete ': (req, res) => {
    res.send({
      "code": 1,
      "data": null,
      "msg": "计划进行中不能删除"
    })
  },
  'POST /project/activityPlan/selectAreaMachines': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {
          "code": "100000000",
          "parentCode": null,
          "name": "北京市",
          "province": "北京市",
          "city": null,
          "district": null,
          "circle": null,
          "level": 1,
          "machines": [
            {
              "machineId": "18f05c0c234749c7bf6c60dda9f5092e",
              "machineCode": "1846698071048",
              "state": null
            },
            {
              "machineId": "8389fc95a5324a02a45aabfc6823436d",
              "machineCode": "1863398071038",
              "state": null
            }
          ]
        },
        {
          "code": "110000000",
          "parentCode": null,
          "name": "天津市",
          "province": "天津市",
          "city": null,
          "district": null,
          "circle": null,
          "level": 1,
          "machines": [
            {
              "machineId": "1575f4d0ff8c491986d5ff534085904e",
              "machineCode": "1809510071149",
              "state": null
            },
            {
              "machineId": "947639777c874724a954b1ca47f987f0",
              "machineCode": "1834003071023",
              "state": null
            }
          ]
        }
      ],
      "msg": "成功"
    })
  },
  'POST /project/activityPlan/add': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'GET /project/activityPlan/planMachineDetailList': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'POST /check/fault/list': (req, res) => {
    res.send(
      {
        "msg": "成功",
        "code": 0,
        "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 3,
        "list": null,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
        },
        "data": [
        {
        "id": "f5fe616383454021aa65dc131a0aad0a",
        "machineId": "2121231231231",
        "type": null,
        "submitUser": "王老五",
        "finishUser": null,
        "submitTime": 1531740076000,
        "finishTime": null,
        "status": 0,
        "finishRemark": null,
        "remindStatus": 0,
        "remark": "可能屏幕坏了"
        },
        {
        "id": "fc8c4f5cf3b04daba692a72ccf16503f",
        "machineId": "2121231231231",
        "type": null,
        "submitUser": "老司机",
        "finishUser": null,
        "submitTime": 1531738920000,
        "finishTime": null,
        "status": 0,
        "finishRemark": null,
        "remindStatus": 0,
        "remark": "可能屏幕坏了"
        },
        {
        "id": "fc98baecbd1845f2801e573703868a85",
        "machineId": "2121231231231",
        "type": null,
        "submitUser": "老司机",
        "finishUser": null,
        "submitTime": 1531735204000,
        "finishTime": null,
        "status": 1,
        "finishRemark": null,
        "remindStatus": 0,
        "remark": "可能电源没有插"
        }
        ]
        }
    )
  },
  'POST /check/fault/detail': (req, res) => {
    res.send(
      {"code":0,"data":{"id":"f0248d82649f4626a69c60843c010ae3","machineId":"123","code":"FUIWM0S20180808114338","title":null,"workType":1,"status":0,"source":1,"urgentStatus":1,"type":null,"remark":null,"submitUser":"赵飞龙","submitId":null,"submitUserType":null,"receiveUser":"赵飞龙","receiveId":null,"finishUser":null,"finishId":null,"submitTime":"2018-08-08 11:43:38","talkingTime":null,"finishTime":null,"updateTime":null,"finishRemark":null,"remindStatus":null,"machineCode":"123","answerList":[{"answer":"屏幕坏了","answerType":"1","answerName":null,"imgList":[{"imageTime":"2018-08-08 11:43:39","image":"https://inno72.oss-cn-beijing.aliyuncs.com/backend/check/5917744d26f44aebbbec24555cb317fb.jpeg","sort":1},{"imageTime":"2018-08-08 11:43:39","image":"https://inno72.oss-cn-beijing.aliyuncs.com/backend/check/11111.jpeg","sort":2}],"answerTime":"2018-08-08 11:43:39"}]},"msg":"成功"}
    )
  },
  'POST /check/fault/answer': (req, res) => {
    res.send(
      {
        "code": 0,
        "data": null,
        "msg": "成功"
        }
    )
  },
  'GET /check/user/list': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 1,
        "list": null,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
      },
      "data": [
        {
          "id": "ghjghjkhj",
          "name": "赵飞龙",
          "phone": "13683023304",
          "password": null,
          "cardNo": "1686768878989898",
          "enterprise": "点72",
          "sex": 1,
          "email": null,
          "headImage": null,
          "createId": null,
          "createTime": null,
          "updateId": null,
          "updateTime": null,
          "isDelete": 0,
          "status": 1,
        }
      ]
    })
  },
  'GET /check/signIn/list': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 3,
        "list": null,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1,
        "firstResult": 0
      },
      "data": [
        {
          "id": 53215321,
          "name": "赵飞龙",
          "phone": "13683023304",
          "password": null,
          "cardNo": null,
          "enterprise": "点72",
          "sex": null,
          "email": null,
          "headImage": null,
          "createId": null,
          "createTime": "2018-07-01 11:21:56",
          "updateId": null,
          "updateTime": null,
          "isDelete": null,
          "remark": null,
          "localeName": "北京市北京市东城区王府井—188982407114q",
          "machineCode": null,
          "machines": null,
          "status": 0,
        },
        {
          "id": 53415432,
          "name": "赵飞龙",
          "phone": "13683023304",
          "password": null,
          "cardNo": null,
          "enterprise": "点72",
          "sex": null,
          "email": null,
          "headImage": null,
          "createId": null,
          "createTime": "2018-07-02 11:22:08",
          "updateId": null,
          "updateTime": null,
          "isDelete": null,
          "remark": null,
          "localeName": "北京市北京市东城区王府井—188982407114q",
          "machineCode": null,
          "machines": null,
          "status": 1,
        },
        {
          "id": 421432155321,
          "name": "赵飞龙",
          "phone": "13683023304",
          "password": null,
          "cardNo": null,
          "enterprise": "点72",
          "sex": null,
          "email": null,
          "headImage": null,
          "createId": null,
          "createTime": "2018-07-03 11:22:19",
          "updateId": null,
          "updateTime": null,
          "isDelete": null,
          "remark": null,
          "localeName": "天津市天津市和平区鞍山道沿线—ZJ1807184936290",
          "machineCode": null,
          "machines": null,
          "status": 0
        }
      ]
    })
  },
  'POST /check/signIn/updateStatus': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'GET /check/user/getUserMachinDetailList': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {
          "machineLocale": "天津市天津市和平区鞍山道沿线",
          "machineCode": "2121231231231"
        }
      ],
      "msg": "成功"
    })
  },
  'GET /check/user/detail': (req, res) => {
    res.send({
      "code": 0,
      "data": {
        "id": "ghjghjkhj",
        "name": "赵飞龙",
        "phone": "13683023304",
        "password": null,
        "cardNo": "1686768878989898",
        "enterprise": "点72",
        "sex": 1,
        "email": null,
        "headImage": null,
        "createId": null,
        "createTime": null,
        "updateId": null,
        "updateTime": null,
        "isDelete": 0,
        "remark": null,
        "machines": [
          {
            "machineId": "2222",
            "machineCode": "北京市北京市东城区王府井—188982407114q",
            "state": null
          },
          {
            "machineId": "2223",
            "machineCode": "北京市北京市东城区王府井—188982407114w",
            "state": null
          }
        ]
      },
      "msg": "成功"
    })
  },
  'POST /check/user/update': (req, res) => {
    res.send({
      "name": "张三",
      "phone": "18510248685",

      "cardNo": "100111008910108888",

      "enterprise": "36克",

      "machines": [{
        "machineId": "JQ10001"
      }, {
        "machineId": "JQ10002",
      }]
    })
  },
  'POST /check/user/add': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'POST /check/user/selectAreaMachines': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {
          "code": "100000000",
          "parentCode": null,
          "name": "北京市",
          "province": "北京市",
          "city": null,
          "district": null,
          "circle": null,
          "level": 1,
          "machines": [
            {
              "machineId": "18f05c0c234749c7bf6c60dda9f5092e",
              "machineCode": "1846698071048",
              "state": "1"
            },
            {
              "machineId": "8389fc95a5324a02a45aabfc6823436d",
              "machineCode": "1863398071038",
              "state": "0"
            }
          ]
        },
        {
          "code": "110000000",
          "parentCode": null,
          "name": "天津市",
          "province": "天津市",
          "city": null,
          "district": null,
          "circle": null,
          "level": 1,
          "machines": [
            {
              "machineId": "1575f4d0ff8c491986d5ff534085904e",
              "machineCode": "1809510071149",
              "state": "0"
            },
            {
              "machineId": "947639777c874724a954b1ca47f987f0",
              "machineCode": "1834003071023",
              "state": null
            }
          ]
        }
      ],
      "msg": "成功"
    })
  },
  'POST /check/faultType/list': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
      "pageSize": 20,
      "currentResult": 0,
      "totalPage": 1,
      "pageNo": 1,
      "totalCount": 3,
      "list": null,
      "firstPage": true,
      "lastPage": true,
      "nextPage": 1,
      "prePage": 1,
      "firstResult": 0
      },
      "data": [
      {
      "code": "10000",
      "parentCode": null,
      "name": "黑屏",
      "parentName": "大黑屏,小黑瓶,半黑屏",
      "level": null,
      "createId": null,
      "createTime": null,
      "updateId": null,
      "updateTime": null
      },
      {
      "code": "20000",
      "parentCode": null,
      "name": "门坏",
      "parentName": "门掉了,关不上",
      "level": null,
      "createId": null,
      "createTime": null,
      "updateId": null,
      "updateTime": null
      },
      {
      "code": "5906bb314c654f26851781b1b357ec93",
      "parentCode": null,
      "name": "玻璃",
      "parentName": "玻璃掉了,玻璃碎了",
      "level": null,
      "createId": "张文杰",
      "createTime": "2018-07-21 09:40:00",
      "updateId": null,
      "updateTime": null
      }
      ]
      })
  },
  'POST /check/faultType/add': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
      })
  },
  'POST /check/faultType/detail': (req, res) => {
    res.send({
      "code": 0,
      "data": {
      "code": "5906bb314c654f26851781b1b357ec93",
      "parentCode": null,
      "name": "玻璃",
      "parentName": null,
      "level": null,
      "createId": null,
      "createTime": null,
      "updateId": null,
      "updateTime": null,
      "solutions": [
      {
      "code": "09ae88f5835348d6976e13dcb2ea86f3",
      "parentCode": null,
      "name": "玻璃掉了",
      "parentName": null,
      "level": null,
      "createId": null,
      "createTime": null,
      "updateId": null,
      "updateTime": null
      },
      {
      "code": "c03f1ebd30ff4b9daafbd972a66c9301",
      "parentCode": null,
      "name": "玻璃碎了",
      "parentName": null,
      "level": null,
      "createId": null,
      "createTime": null,
      "updateId": null,
      "updateTime": null
      }
      ]
      },
      "msg": "成功"
      },
    )
  },
  'POST /check/faultType/update': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
      }
    )
  },
  'GET /project/activity/getDefaultActivity': (req, res) => {
    res.send({
      "code": 0,
      "data": {
        "id": "2",
        "name": "dddd",
        "shopId": "1",
        "sellerId": "1",
        "managerId": null,
        "isDefault": 1,
        "gameId": null,
        "isDelete": 0,
        "remark": null,
        "createId": null,
        "createTime": "2018-07-24 18:09:17",
        "updateId": null,
        "updateTime": "2018-07-24 18:09:17"
      },
      "msg": "成功"
    })
  },
  'POST /share/uploadImage': (req, res) => {
    res.send({"code":0,"data":"backend/goods/46c6f7d487d24f2eba83266b85d72008.jpeg","msg":"成功"})
  },
  'POST /check/user/updateStatus': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'POST /check/user/delete': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'GET /machine/machine/planList': (req, res) => {
    res.send({
      "msg": "成功",
      "data": [
        {
          "id": "74a9e410a9c044418ee2db260f86401a",
          "machineCode": "1809510071149",
          "localDesc": "天津市天津市和平区鞍山道沿线大沽口",
          "netStatus": null,
          "activityName": null,
          "channelStatus": null,
          "goodsStatus": null,
          "machineStatus": null,
          "planTime": [
            {
              "startTime": "2018-09-03 00:00:00",
              "endTime": "2018-09-04 23:59:59"
            },
            {
              "startTime": "2018-09-30 00:00:00",
              "endTime": "2018-10-02 23:59:59"
            }
          ]
        },
        {
          "id": "6b4cd639883d42999254878b52b1cc20",
          "machineCode": "18978050",
          "localDesc": "北京市北京市西城区小西天灯市口",
          "netStatus": null,
          "activityName": null,
          "channelStatus": null,
          "goodsStatus": null,
          "machineStatus": null,
          "planTime": [
            {
              "startTime": "2018-09-25 00:00:00",
              "endTime": "2018-09-29 00:00:59"
            }
          ]
        },
        {
          "id": "123",
          "machineCode": "123",
          "localDesc": "天津市天津市和平区鞍山道沿线大沽口",
          "netStatus": null,
          "activityName": null,
          "channelStatus": null,
          "goodsStatus": null,
          "machineStatus": null,
          "planTime": [
            {
              "startTime": "2018-09-16 09:00:00",
              "endTime": "2018-10-06 23:00:00"
            }
          ]
        },
        {
          "id": "6893a2ada9dd4f7eb8dc33adfc6eda73",
          "machineCode": "18022789",
          "localDesc": "北京市北京市西城区小西天灯市口",
          "netStatus": null,
          "activityName": null,
          "channelStatus": null,
          "goodsStatus": null,
          "machineStatus": null,
          "planTime": [
            {
              "startTime": "2018-09-30 00:00:00",
              "endTime": "2018-10-03 23:59:59"
            }
          ]
        },
        {
          "id": "2222",
          "machineCode": "188982407114q",
          "localDesc": "北京市北京市东城区王府井大沽口",
          "netStatus": null,
          "activityName": null,
          "channelStatus": null,
          "goodsStatus": null,
          "machineStatus": null,
          "planTime": []
        }
      ],
      "code": 0
    })
  },
  'GET /machine/machine/findMachinePortalData': (req, res) => {
    res.send({
      "code": 0,
      "data": {
        "online": 0,
        "offline": 12,
        "exception": 5,
        "stockout": 2,
        "waitOrder": 1,
        "processed": 3,
        "waitConfirm": 1
      },
      "msg": "成功"
    })
  },
  'GET /machine/machine/findExceptionMachine': (req, res) => {
    res.send({
      "code": 0,
      "data": [{
        "voice": 10,
        "offline_time": "2018.08.03 12:02:30",
        "goodsChannelStatus": "",
        "update_time": "2018.08.03 12:02:30",
        "machineCode": "1234",
        "machineDoorStatus": 1,
        "screenIntensity": 10,
        "temperature": 36,
        "id": "abcde",
        "stockoutInfo": [
          {
            "goodName": "娃哈哈",
            "goodCount": 10
          },
          {
            "goodName": "娃哇哇",
            "goodCount": 5
          }
        ],
        "local": "北京市朝阳区大悦城一层",
        "dropGoodsSwitch": 1
      }],
      "msg": "成功"
    })
  },
  'GET /merchant/log/findLogs': (req, res) => {
    res.send({
      "code": 0,
      "data": [{
        "voice": 10,
        "offline_time": "2018.08.03 12:02:30",
        "goodsChannelStatus": "",
        "update_time": "2018.08.03 12:02:30",
        "machineCode": "1234",
        "machineDoorStatus": 1,
        "screenIntensity": 10,
        "temperature": 36,
        "id": "abcde",
        "stockoutInfo": [
          {
            "goodName": "娃哈哈",
            "goodCount": 10
          },
          {
            "goodName": "娃哇哇",
            "goodCount": 5
          }
        ],
        "local": "北京市朝阳区大悦城一层",
        "dropGoodsSwitch": 1
      }],
      "msg": "成功"
    })
  },
  'GET /machine/machine/findMachineStockoutInfo': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {
          "goodName": "测试商品 别删除",
          "goodCount": 14
        }
      ],
      "msg": "成功"
    })
  },
  'POST /supply/channel/history/list': (req, res) => {
    res.send({
        "msg": "成功",
        "code": 0,
        "page": {
          "pageSize": 20,
          "currentResult": 0,
          "totalPage": 1,
          "pageNo": 1,
          "totalCount": 5,
          "list": null,
          "firstResult": 0,
          "firstPage": true,
          "lastPage": true,
          "nextPage": 1,
          "prePage": 1
        },
        "data": [
          {
            "batchNo": "06e5ac53d3164119bdbafbd909f25bd6",
            "machineCode": "18884154",
            "localeStr": "北京市北京市东城区王府井大沽口",
            "createTime": "2018-07-25 20:02:04",
            "machineId": "681fd2a6f6c84d40870436fea1854dbd",
            "status": 0,
            "name": null,
            "phone": null,
            "area": null,
            "areaCode": null,
            "beginTime": null,
            "endTime": null,
            "keyword": null,
            "historyList": null
          },
          {
            "batchNo": "77f7fe7b9e7a4f008a321e23cdd4cfdf",
            "machineCode": "18884154",
            "localeStr": "北京市北京市东城区王府井大沽口",
            "createTime": "2018-07-25 19:56:48",
            "machineId": "681fd2a6f6c84d40870436fea1854dbd",
            "status": 0,
            "name": null,
            "phone": null,
            "area": null,
            "areaCode": null,
            "beginTime": null,
            "endTime": null,
            "keyword": null,
            "historyList": null
          },
          {
            "batchNo": "df8437abfb564153bfec25fd93dfd32b",
            "machineCode": "18884154",
            "localeStr": "北京市北京市东城区王府井大沽口",
            "createTime": "2018-07-25 19:19:03",
            "machineId": "681fd2a6f6c84d40870436fea1854dbd",
            "status": 0,
            "name": null,
            "phone": null,
            "area": null,
            "areaCode": null,
            "beginTime": null,
            "endTime": null,
            "keyword": null,
            "historyList": null
          },
          {
            "batchNo": "77",
            "machineCode": null,
            "localeStr": null,
            "createTime": "2018-07-19 11:01:29",
            "machineId": "be9a6ec2e331468b9d04a95a180dedb2",
            "status": 0,
            "name": null,
            "phone": null,
            "area": null,
            "areaCode": null,
            "beginTime": null,
            "endTime": null,
            "keyword": null,
            "historyList": null
          },
          {
            "batchNo": "666",
            "machineCode": null,
            "localeStr": null,
            "createTime": "2018-07-19 11:00:21",
            "machineId": "be9a6ec2e331468b9d04a95a180dedb2",
            "status": 0,
            "name": null,
            "phone": null,
            "area": null,
            "areaCode": null,
            "beginTime": null,
            "endTime": null,
            "keyword": null,
            "historyList": null
          }
        ]
      }
    )
  },
  'GET /supply/channel/history/detail': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {
          "id": "87e0b8f7d53f48c09123d5142d253707",
          "supplyChannelId": "017de335d3834ad6952750a754d822db",
          "beforeCount": 5,
          "afterCount": 10,
          "batchNo": "06e5ac53d3164119bdbafbd909f25bd6",
          "machineId": "681fd2a6f6c84d40870436fea1854dbd",
          "userId": "",
          "type": 0,
          "createTime": "2018-07-25 20:02:04",
          "machineCode": null,
          "localeStr": "北京市北京市东城区王府井大沽口",
          "subCount": 5,
          "goodsName": "测试商品 别删除"
        }
      ],
      "msg": "成功"
    })
  },
  'POST /activity/data/count/list': (req, res) => {
    res.send({
        "code":0,
        "data":{
          "totalOrderCount":0,
          "totalGoodsCount":0,
          "totalUserCount":580,
          "totalPayCount":55,
          "totalCouponCount":0,
          "list":[
            {
              "id":"0e6e42e367984ea79cea0184f4a0e230",
              "activityId":"f3092aec236e4ce4a5d964b16a3wq2f6",
              "activityPlanId":"999",
              "orderCount":74,
              "userCount":116,
              "payCount":11,
              "goodsCount":0,
              "couponCount":0,
              "createDate":"2018-08-13",
              "submitTime":"2018-08-13 11:12:50"
            },
            {
              "id":"2500b00692844dbf9085eecf01ab188f",
              "activityId":"f3092aec236e4ce4a5d964b16a3wq2f6",
              "activityPlanId":"999",
              "orderCount":74,
              "userCount":116,
              "payCount":11,
              "goodsCount":0,
              "couponCount":0,
              "createDate":"2018-08-13",
              "submitTime":"2018-08-13 11:12:40"
            },
            {
              "id":"26d1e29de13b4cca8c50498f70afe952",
              "activityId":"f3092aec236e4ce4a5d964b16a3wq2f6",
              "activityPlanId":"999",
              "orderCount":74,
              "userCount":116,
              "payCount":11,
              "goodsCount":0,
              "couponCount":0,
              "createDate":"2018-08-13",
              "submitTime":"2018-08-13 11:12:45"
            },
            {
              "id":"9b89d6a48cb44f4aa4532d40e746e5a2",
              "activityId":"f3092aec236e4ce4a5d964b16a3wq2f6",
              "activityPlanId":"999",
              "orderCount":74,
              "userCount":116,
              "payCount":11,
              "goodsCount":0,
              "couponCount":0,
              "createDate":"2018-08-13",
              "submitTime":"2018-08-13 11:12:55"
            },
            {
              "id":"bb54b8d1a03042e288ccb93efc46cbaa",
              "activityId":"f3092aec236e4ce4a5d964b16a3wq2f6",
              "activityPlanId":"999",
              "orderCount":74,
              "userCount":116,
              "payCount":11,
              "goodsCount":0,
              "couponCount":0,
              "createDate":"2018-08-13",
              "submitTime":"2018-08-13 11:12:35"
            }
          ],
          "totalOrderCount":370
        },
        "msg":"成功"
      }
    )
  },
  'GET /check/fault/getMachineUserList': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {
          "name": "wang",
          "id": "980b257b09e243cda221eac56e6e8c40"
        },
        {
          "name": "3224",
          "id": "529e98dd96a94e6f906913a6419a9f70"
        },
        {
          "name": "111111111",
          "id": "71846dd7e11a4b1db79249dce8ce34a5"
        },
        {
          "name": "3453453",
          "id": "e1d3b999a2e94bedb7a91f4399a4ce71"
        },
        {
          "name": "admin",
          "id": "8844e91ae2684028acb5c55709783cdb"
        }
      ],
      "msg": "成功"
    })
  },
  'POST /check/fault/save': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'POST /check/fault/updateStatus': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'GET /machine/locale/getList': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "inno72Locale": {
        "id": null,
        "province": null,
        "city": null,
        "district": null,
        "circle": null,
        "mail": null,
        "manager": null,
        "mobile": null,
        "state": null,
        "remark": null,
        "createId": null,
        "createTime": null,
        "updateId": null,
        "updateTime": null
      },
      "data": [{
        "id": "0667732a80694a71ba021b7282337451",
        "province": "1",
        "city": "1",
        "district": "1",
        "circle": null,
        "mail": "奥特莱是",
        "manager": "王小二",
        "mobile": "15688886666",
        "state": 0,
        "remark": "\b欢迎光临",
        "createId": "",
        "createTime": "2018-07-03 11:39:28",
        "updateId": "",
        "updateTime": "2018-07-03 11:39:28"
      }, {
        "id": "1",
        "province": "1",
        "city": "1",
        "district": "1",
        "circle": "朝阳大悦城",
        "mail": "奥特莱是",
        "manager": "王小二",
        "mobile": "15688886666",
        "state": 0,
        "remark": "\b欢迎光临",
        "createId": "",
        "createTime": "2018-07-03 11:40:42",
        "updateId": "",
        "updateTime": "2018-07-03 11:40:42"
      }]
    })
  },
  'POST /pai/data/count/list': (req, res) => {
    res.send({"code":0,"data":[{"activityName":"派样活动1","activityId":"111","activityPlanId":"aaaa","startTime":"2018-08-21 17:16:54","endTime":"2018-08-31 17:17:01","submitTime":"2018-08-21 17:17:08","inno72PaiNowDataList":[{"id":null,"activityId":null,"activityPlanId":null,"activityName":null,"goodsName":"测试商品1","goodsCount":10,"totalGoodsCount":500,"startTime":null,"endTime":null,"submitTime":null},{"id":null,"activityId":null,"activityPlanId":null,"activityName":null,"goodsName":"测试商品2","goodsCount":20,"totalGoodsCount":200,"startTime":null,"endTime":null,"submitTime":null}]}],"msg":"成功"})
  },
  'POST /pai/data/count/totalList': (req, res) => {
    res.send({
      "code": 0,
      "data": [{
        "activityName": "测试活动1",
        "activityId": "d6fff348101c46e5a31f895bfbbe2ddb",
        "activityPlanId": "85f55fc9781a4dfc95c5e1073b0b87f8",
        "startTime": "2018-08-27 00:00:00",
        "endTime": "2018-08-27 13:00:59",
        "submitTime": null,
        "inno72PaiNowDataList": [{
          "id": null,
          "activityId": null,
          "activityPlanId": null,
          "activityName": null,
          "goodsName": "果果",
          "goodsCount": 0,
          "totalGoodsCount": 11000,
          "startTime": null,
          "endTime": null,
          "submitTime": null
        }, {
          "id": null,
          "activityId": null,
          "activityPlanId": null,
          "activityName": null,
          "goodsName": "水果",
          "goodsCount": 0,
          "totalGoodsCount": 1000,
          "startTime": null,
          "endTime": null,
          "submitTime": null
        }, {
          "id": null,
          "activityId": null,
          "activityPlanId": null,
          "activityName": null,
          "goodsName": "矿泉水",
          "goodsCount": 0,
          "totalGoodsCount": 10000,
          "startTime": null,
          "endTime": null,
          "submitTime": null
        }]
      }, {
        "activityName": "摩卡达到",
        "activityId": "e44a2bc820d14e43a06c42f3c79c00ea",
        "activityPlanId": "e2397f839a2742ea8aabf2d2eaf7ba02",
        "startTime": "2018-08-27 00:00:00",
        "endTime": "2018-08-27 16:59:59",
        "submitTime": null,
        "inno72PaiNowDataList": [{
          "id": null,
          "activityId": null,
          "activityPlanId": null,
          "activityName": null,
          "goodsName": "K9",
          "goodsCount": 0,
          "totalGoodsCount": 122888,
          "startTime": null,
          "endTime": null,
          "submitTime": null
        }, {
          "id": null,
          "activityId": null,
          "activityPlanId": null,
          "activityName": null,
          "goodsName": "雀巢珍致",
          "goodsCount": 0,
          "totalGoodsCount": 33,
          "startTime": null,
          "endTime": null,
          "submitTime": null
        }, {
          "id": null,
          "activityId": null,
          "activityPlanId": null,
          "activityName": null,
          "goodsName": "雪诗雅",
          "goodsCount": 0,
          "totalGoodsCount": 33,
          "startTime": null,
          "endTime": null,
          "submitTime": null
        }]
      }],
      "msg": "成功"
    })
  },
  'GET /machine/task/list': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 3,
        "list": null,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
      },
      "data": [
        {
          "id": "3",
          "type": 3,
          "status": 0,
          "doType": 0,
          "doTime": "2018-08-27 10:45:17",
          "app": "",
          "appUrl": "",
          "appVersion": null,
          "channelCode": "1,3,5,7,9",
          "createId": null,
          "createTime": "2018-08-27 10:46:25",
          "updateId": null,
          "updateTime": "2018-08-27 10:46:25",
          "taskAll": 0,
          "taskSuss": 0,
          "doTimeStr": null,
          "channelCodeStr": null,
          "appName": null,
          "machineList": null
        },
        {
          "id": "2",
          "type": 2,
          "status": 0,
          "doType": 0,
          "doTime": "2018-08-27 10:44:38",
          "app": "1",
          "appUrl": "www.baidu.com",
          "appVersion": "1.0.1",
          "channelCode": null,
          "createId": null,
          "createTime": "2018-08-27 10:45:01",
          "updateId": null,
          "updateTime": "2018-08-27 10:45:01",
          "taskAll": 0,
          "taskSuss": 0,
          "doTimeStr": null,
          "channelCodeStr": null,
          "appName": null,
          "machineList": null
        },
        {
          "id": "1",
          "type": 1,
          "status": 0,
          "doType": 0,
          "doTime": "2018-08-27 10:00:00",
          "app": "1",
          "appUrl": "www.baidu.com",
          "appVersion": "1.0.1",
          "channelCode": null,
          "createId": null,
          "createTime": "2018-08-27 09:50:08",
          "updateId": null,
          "updateTime": "2018-08-27 09:50:08",
          "taskAll": 0,
          "taskSuss": 0,
          "doTimeStr": null,
          "channelCodeStr": null,
          "appName": null,
          "machineList": null
        }
      ]
    })
  },
  'POST /machine/task/delete': (req, res) => {
    res.send({
      "code": 1,
      "data": null,
      "msg": "该任务记录不能删除"
    })
  },
  'POST /machine/task/add': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'POST /machine/task/update': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'POST /machine/task/updateStatus': (req, res) => {
    res.send({
      "code": 1,
      "data": null,
      "msg": "该任务未执行，不能继续执行"
    })
  },
  'POST /machine/task/selectAppList': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {
          "appType": 1,
          "appName": "海莲",
          "appPackageName": "com.muwood.chainapp",
          "id": "1"
        },
        {
          "appType": 2,
          "appName": "安装器",
          "appPackageName": "com.detection.inno72.installer",
          "id": "2"
        },
        {
          "appType": 2,
          "appName": "测试程序",
          "appPackageName": "com.detection.inno72.test",
          "id": "3"
        }
      ],
      "msg": "成功"
    })
  },
  'POST /machine/task/detail': (req, res) => {
    res.send({
      "code": 0,
      "data": {
        "id": "2",
        "type": 2,
        "status": 0,
        "doType": 0,
        "doTime": "2018-08-27 10:44:38",
        "app": "1",
        "appUrl": "www.baidu.com",
        "appVersion": "1.0.1",
        "channelCode": null,
        "createId": "936451df9a7443c3a59102b193e3b7ff",
        "createTime": "2018-08-27 13:25:59",
        "updateId": null,
        "updateTime": "2018-08-27 13:25:59",
        "taskAll": 0,
        "taskSuss": 0,
        "doTimeStr": null,
        "channelCodeStr": null,
        "appName": "海莲",
        "creater": null,
        "machineList": [
          {
            "id": null,
            "taskId": "天津市天津市和平区鞍山道沿线大沽口",
            "machineId": "123",
            "machineCode": "123",
            "taskStatus": null,
            "doType": null,
            "doStatus": null,
            "doMsg": null,
            "doTime": null
          }
        ]
      },
      "msg": "成功"
    })
  },
  'POST /machine/task/selectAreaMachines': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {
          "code": "100000000",
          "parentCode": null,
          "name": "北京市",
          "province": "北京市",
          "city": null,
          "district": null,
          "circle": null,
          "level": 1,
          "machines": [
            {
              "machineId": "18f05c0c234749c7bf6c60dda9f5092e",
              "machineCode": "1846698071048",
              "state": "1"
            },
            {
              "machineId": "8389fc95a5324a02a45aabfc6823436d",
              "machineCode": "1863398071038",
              "state": "0"
            }
          ]
        },
        {
          "code": "110000000",
          "parentCode": null,
          "name": "天津市",
          "province": "天津市",
          "city": null,
          "district": null,
          "circle": null,
          "level": 1,
          "machines": [
            {
              "machineId": "1575f4d0ff8c491986d5ff534085904e",
              "machineCode": "1809510071149",
              "state": "0"
            },
            {
              "machineId": "947639777c874724a954b1ca47f987f0",
              "machineCode": "1834003071023",
              "state": null
            }
          ]
        }
      ],
      "msg": "成功"
    })
  },
  'POST /machine/machine/cutDesktop': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'GET /machine/machine/machinePointLog': (req, res) => {
    res.send({
      "code": 0,
      "data": [{
        "machineCode":"机器code",
        "type":"111111",
        "pointTime":"埋点时间",
        "tag":"xxxxxxx",
        "detail":"xxxxxxxxxx"
      },{
        "machineCode":"机器code",
        "type":"22222",
        "pointTime":"埋点时间",
        "tag":"xxxxxxx",
        "detail":"xxxxxxxxxx"
      },{
        "machineCode":"机器code",
        "type":"33333",
        "pointTime":"埋点时间",
        "tag":"xxxxxxx",
        "detail":"xxxxxxxxxx"
      },{
        "machineCode":"机器code",
        "type":"44444",
        "pointTime":"埋点时间",
        "tag":"xxxxxxx",
        "detail":"xxxxxxxxxx"
      },{
        "machineCode":"机器code",
        "type":"55555",
        "pointTime":"埋点时间",
        "tag":"xxxxxxx",
        "detail":"xxxxxxxxxx"
      },{
        "machineCode":"机器code",
        "type":"66666",
        "pointTime":"埋点时间",
        "tag":"xxxxxxx",
        "detail":"xxxxxxxxxx"
      },{
        "machineCode":"机器code",
        "type":"77777",
        "pointTime":"埋点时间",
        "tag":"xxxxxxx",
        "detail":"xxxxxxxxxx"
      },{
        "machineCode":"机器code",
        "type":"88888",
        "pointTime":"埋点时间",
        "tag":"xxxxxxx",
        "detail":"xxxxxxxxxx"
      },{
        "machineCode":"机器code",
        "type":"99999",
        "pointTime":"埋点时间",
        "tag":"xxxxxxx",
        "detail":"xxxxxxxxxx"
      },{
        "machineCode":"机器code",
        "type":"10101010",
        "pointTime":"埋点时间",
        "tag":"xxxxxxx",
        "detail":"xxxxxxxxxx"
      },{
        "machineCode":"机器code",
        "type":"1111111",
        "pointTime":"埋点时间",
        "tag":"xxxxxxx",
        "detail":"xxxxxxxxxx"
      },{
        "machineCode":"机器code",
        "type":"121212",
        "pointTime":"埋点时间",
        "tag":"xxxxxxx",
        "detail":"xxxxxxxxxx"
      },{
        "machineCode":"机器code",
        "type":"131313",
        "pointTime":"埋点时间",
        "tag":"xxxxxxx",
        "detail":"xxxxxxxxxx"
      },{
        "machineCode":"机器code",
        "type":"141414",
        "pointTime":"埋点时间",
        "tag":"xxxxxxx",
        "detail":"xxxxxxxxxx"
      },{
        "machineCode":"机器code",
        "type":"151515",
        "pointTime":"埋点时间",
        "tag":"xxxxxxx",
        "detail":"xxxxxxxxxx"
      },{
        "machineCode":"机器code",
        "type":"161616",
        "pointTime":"埋点时间",
        "tag":"xxxxxxx",
        "detail":"xxxxxxxxxx"
      },{
        "machineCode":"机器code",
        "type":"171717",
        "pointTime":"埋点时间",
        "tag":"xxxxxxx",
        "detail":"xxxxxxxxxx"
      },{
        "machineCode":"机器code",
        "type":"181818",
        "pointTime":"埋点时间",
        "tag":"xxxxxxx",
        "detail":"xxxxxxxxxx"
      },{
        "machineCode":"机器code",
        "type":"191919",
        "pointTime":"埋点时间",
        "tag":"xxxxxxx",
        "detail":"xxxxxxxxxx"
      },],
      "msg": "成功"
    })
  },
  'GET /machine/locale/tagList': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 3,
        "list": null,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
      },
      "data": [
        {
          "id": "5b62878af83b4828a5dee850db445d25",
          "name": "商场"
        },
        {
          "id": "a30836b1ed474b2a8b4ca159e0be411a",
          "name": "电影院"
        },
        {
          "id": "e86afea001794461a5616d4f46545c3d",
          "name": "KTV"
        }
      ],
      "unColumn": ""
    })
  },
  'GET /machine/locale/getTagList': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {
          "id": "5b62878af83b4828a5dee850db445d25",
          "name": "商场"
        },
        {
          "id": "a30836b1ed474b2a8b4ca159e0be411a",
          "name": "电影院"
        },
        {
          "id": "e86afea001794461a5616d4f46545c3d",
          "name": "KTV"
        }
      ],
      "msg": "成功"
    })
  },
  'POST /admin/area/add': (req, res) => {
    res.send({
        "code":0,
        "data":null,
        "msg":""
      })
  },
  'POST /admin/area/update': (req, res) => {
    res.send({
      "code":0,
      "data":null,
      "msg":""
    })
  },
  'GET /admin/area/pageList': (req, res) => {
    res.send({
      "msg": "成功",
      "data": [
        {
          "code": "100101000",
          "parentCode": "100100000",
          "name": "东城区",
          "province": "北京市",
          "city": "北京市",
          "district": "东城区",
          "circle": null,
          "level": 3
        },
        {
          "code": "100102000",
          "parentCode": "100100000",
          "name": "西城区",
          "province": "北京市",
          "city": "北京市",
          "district": "西城区",
          "circle": null,
          "level": 3
        },
        {
          "code": "100103000",
          "parentCode": "100100000",
          "name": "崇文区",
          "province": "北京市",
          "city": "北京市",
          "district": "崇文区",
          "circle": null,
          "level": 3
        },
        {
          "code": "100104000",
          "parentCode": "100100000",
          "name": "宣武区",
          "province": "北京市",
          "city": "北京市",
          "district": "宣武区",
          "circle": null,
          "level": 3
        },
        {
          "code": "100105000",
          "parentCode": "100100000",
          "name": "朝阳区",
          "province": "北京市",
          "city": "北京市",
          "district": "朝阳区",
          "circle": null,
          "level": 3
        },
        {
          "code": "100106000",
          "parentCode": "100100000",
          "name": "丰台区",
          "province": "北京市",
          "city": "北京市",
          "district": "丰台区",
          "circle": null,
          "level": 3
        },
        {
          "code": "100107000",
          "parentCode": "100100000",
          "name": "石景山区",
          "province": "北京市",
          "city": "北京市",
          "district": "石景山区",
          "circle": null,
          "level": 3
        },
        {
          "code": "100108000",
          "parentCode": "100100000",
          "name": "海淀区",
          "province": "北京市",
          "city": "北京市",
          "district": "海淀区",
          "circle": null,
          "level": 3
        },
        {
          "code": "100109000",
          "parentCode": "100100000",
          "name": "门头沟区",
          "province": "北京市",
          "city": "北京市",
          "district": "门头沟区",
          "circle": null,
          "level": 3
        },
        {
          "code": "100110000",
          "parentCode": "100100000",
          "name": "房山区",
          "province": "北京市",
          "city": "北京市",
          "district": "房山区",
          "circle": null,
          "level": 3
        },
        {
          "code": "100111000",
          "parentCode": "100100000",
          "name": "通州区",
          "province": "北京市",
          "city": "北京市",
          "district": "通州区",
          "circle": null,
          "level": 3
        },
        {
          "code": "100112000",
          "parentCode": "100100000",
          "name": "顺义区",
          "province": "北京市",
          "city": "北京市",
          "district": "顺义区",
          "circle": null,
          "level": 3
        },
        {
          "code": "100113000",
          "parentCode": "100100000",
          "name": "昌平区",
          "province": "北京市",
          "city": "北京市",
          "district": "昌平区",
          "circle": null,
          "level": 3
        },
        {
          "code": "100114000",
          "parentCode": "100100000",
          "name": "大兴区",
          "province": "北京市",
          "city": "北京市",
          "district": "大兴区",
          "circle": null,
          "level": 3
        },
        {
          "code": "100115000",
          "parentCode": "100100000",
          "name": "怀柔区",
          "province": "北京市",
          "city": "北京市",
          "district": "怀柔区",
          "circle": null,
          "level": 3
        },
        {
          "code": "100116000",
          "parentCode": "100100000",
          "name": "平谷区",
          "province": "北京市",
          "city": "北京市",
          "district": "平谷区",
          "circle": null,
          "level": 3
        },
        {
          "code": "100117000",
          "parentCode": "100100000",
          "name": "密云县",
          "province": "北京市",
          "city": "北京市",
          "district": "密云县",
          "circle": null,
          "level": 3
        },
        {
          "code": "100118000",
          "parentCode": "100100000",
          "name": "延庆县",
          "province": "北京市",
          "city": "北京市",
          "district": "延庆县",
          "circle": null,
          "level": 3
        },
        {
          "code": "100119000",
          "parentCode": "100100000",
          "name": "其他",
          "province": "北京市",
          "city": "北京市",
          "district": "其他",
          "circle": null,
          "level": 3
        },
        {
          "code": "100120000",
          "parentCode": "100100000",
          "name": "特殊服务区",
          "province": "北京市",
          "city": "北京市",
          "district": "特殊服务区",
          "circle": null,
          "level": 3
        }
      ],
      "code": 0
    })
  },
  'GET /admin/area/detail': (req, res) => {
    res.send({
      "code": 0,
      "data": {
        "code": "100120000",
        "parentCode": "100100000",
        "name": "特殊服务区",
        "province": "北京市",
        "city": "北京市",
        "district": "特殊服务区",
        "circle": null,
        "level": 3
      },
      "msg": "成功"
    })
  },
  'post /machine/machine/updateTemperature': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'GET /machine/machine/findTemperature': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'POST /machine/machine/grabLog': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'GET /machine/machine/getLogs': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {
          "id": "6d56b10c641e4224b93c60640a31998e",
          "logType": 1,
          "reciveTime": "2018-07-24 19:18:52",
          "logUrl": "app/log/7589ae2ccf764157bd619a011658176b.zip",
          "machineCode": "1234"
        }
      ],
      "msg": "成功"
    })
  },
  'GET /project/interact/list': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 1,
        "list": null,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
      },
      "data": [
        {
          "id": "5555555555555555",
          "name": "派样活动",
          "gameName": "世界杯",
          "merchantNum": 2,
          "goodsNum": "10",
          "realDay": "2",
          "day": "2",
          "realNum": 2,
          "number": 2,
          "manager": "如意",
          "createTime": "2018-09-19 15:24:26.0",
          "status": "0"
        }
      ],
      "unColumn": ""
    })
  },
  'post /project/interact/add': (req, res) => {
    res.send({
      "code": 0,
      "data": "10001",
      "msg": "成功"
    })
  },
  'post /project/interact/merchant/add': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'post /project/interact/shops/add': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'post /project/interact/goods/add': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'get /project/interact/next': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'post /project/interact/goods/update': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'post /project/interact/merchant/update': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'post /project/interact/shops/update': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'post /project/interact/goods/delete': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'post /project/interact/merchant/delete': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'post /project/interact/shops/delete': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'post /project/interact/goods/getList': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "data": [{
        "id": "1111111",
        "name": "怡宝款泉水",
        "code": "10000222XXX",
        "price": 0.99,
        "sellerId": "111111",
        "img": "111111",
        "state": 0,
        "remark": "0.99",
        "createId": null,
        "createTime": "2018-07-03 14:51:05",
        "updateId": null,
        "updateTime": "2018-07-03 14:51:05"
      }, {
        "id": "88511198f5214404beb1cd8a3a29359e",
        "name": "来一桶shui",
        "code": "10000222XXX",
        "price": 0.99,
        "sellerId": "111111",
        "img": "111111",
        "state": 0,
        "remark": "0.99",
        "createId": "",
        "createTime": "2018-07-03 10:55:28",
        "updateId": "",
        "updateTime": "2018-07-03 10:55:28"
      }],
      "inno72Goods": {
        "id": null,
        "name": null,
        "code": null,
        "price": null,
        "sellerId": null,
        "img": null,
        "state": 0,
        "remark": null,
        "createId": null,
        "createTime": null,
        "updateId": null,
        "updateTime": null
      }
    })
  },
  'post /project/interact/merchant/getList': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {
          "id": "3",
          "merchantCode": "2",
          "merchantName": "天猫",
          "createId": "12",
          "updateId": null,
          "createTime": 1530499549000,
          "updateTime": 1530499549000,
          "isDelete": 0
        }
      ],
      "msg": "成功"
    })
  },
  'post /project/interact/shops/getList': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {
          "id": "3",
          "merchantCode": "2",
          "merchantName": "天猫",
          "createId": "12",
          "updateId": null,
          "createTime": 1530499549000,
          "updateTime": 1530499549000,
          "isDelete": 0
        }
      ],
      "msg": "成功"
    })
  },
  'get /project/interact/machine/planList': (req, res) => {
    res.send({
        "msg": "成功",
        "data": [
          {
            "id": "6b4cd639883d42999254878b52b1cc20",
            "machineCode": "18978050",
            "localDesc": "北京市北京市西城区小西天灯市口",
            "planTime": [{
              "activityName": "测试别删",
              "startTime": "2018-07-25 00:00:00",
              "endTime": "2018-07-29 00:00:59"
            }]
          },
          {
            "id": "123",
            "machineCode": "123",
            "localDesc": "天津市天津市和平区鞍山道沿线大沽口",
            "planTime": [{
              "activityName": "测试别删",
              "startTime": "2018-07-16 09:00:00",
              "endTime": "2018-10-06 23:00:00"
            }]
          },
          {
            "id": "6893a2ada9dd4f7eb8dc33adfc6eda73",
            "machineCode": "18022789",
            "localDesc": "北京市北京市西城区小西天灯市口",
            "planTime": [{
              "activityName": "测试别删",
              "startTime": "2018-07-31 00:00:00",
              "endTime": "2018-08-03 23:59:59"
            }]
          }
        ],
        "code": 0
      }
    )
  },
  'post /project/interact/machine/add': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'post /project/interact/machine/goods/add': (req, res) => {
    res.send({
        "code": 0,
        "data": null,
        "msg": "成功"
      }

    )
  },
  'post /project/interact/machine/delete': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'get /project/interact/goods/getAllList': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "data": [{
        "id": "1111111",
        "name": "怡宝款泉水",
        "code": "10000222XXX",
        "price": 0.99,
        "sellerId": "111111",
        "img": "111111",
        "state": 0,
        "remark": "0.99",
        "createId": null,
        "createTime": "2018-07-03 14:51:05",
        "updateId": null,
        "updateTime": "2018-07-03 14:51:05"
      }, {
        "id": "88511198f5214404beb1cd8a3a29359e",
        "name": "来一桶shui",
        "code": "10000222XXX",
        "price": 0.99,
        "sellerId": "111111",
        "img": "111111",
        "state": 0,
        "remark": "0.99",
        "createId": "",
        "createTime": "2018-07-03 10:55:28",
        "updateId": "",
        "updateTime": "2018-07-03 10:55:28"
      }],
      "inno72Goods": {
        "id": null,
        "name": null,
        "code": null,
        "price": null,
        "sellerId": null,
        "img": null,
        "state": 0,
        "remark": null,
        "createId": null,
        "createTime": null,
        "updateId": null,
        "updateTime": null
      }
    })
  },
  'post /project/interact/machine/goodsList': (req, res) => {
    res.send({
      "msg": "成功",
      "data": [
        {
          "id": "6b4cd639883d4",
          "goods_id": "2999254878b52b1cc20",
          "number": 1000,
          "seq": 1,
          "type": 0
        },
        {
          "id": "6b4cd639883d4",
          "goods_id": "2999254878b52b1cc20",
          "number": 1000,
          "seq": 1,
          "type": 0
        },
        {
          "id": "6b4cd639883d4",
          "goods_id": "2999254878b52b1cc20",
          "number": 1000,
          "seq": 1,
          "type": 0
        },
      ],
      "code": 0
    })
  },
  'post /project/interact/rule': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'post /project/interact/merchant/detail': (req, res) => {
    res.send({
      "code": 0,
      "data": {
        "id": "182daafc2c7e4be1beddba0a6979cbf4",
        "merchantCode": "\bTM100001",
        "brandName": "清风",
        "originFlag": null,
        "merchantName": "天猫清风",
        "channelId": "7e2a6d2d8f3a4b8ebd3a1111898795ce",
        "isDelete": null,
        "createId": null,
        "updateId": "936451df9a7443c3a59102b193e3b7ff",
        "createTime": "2018-09-20 15:56:49",
        "updateTime": "2018-09-20 15:56:50"
      },
      "msg": "成功"
    })
  },
  'post /project/interact/goods/detail': (req, res) => {
    res.send({
      "code": 0,
      "data": {
        "id": "64747d97fe9a4095918619ce4a3d4b33",
        "name": "清风2层100抽",
        "code": "QF10000021",
        "price": 9.9,
        "number": 100000,
        "sellerId": "182daafc2c7e4be1beddba0a6979cbf",
        "shopId": "ABCEFGHIJKLMN",
        "img": "",
        "banner": null,
        "isDelete": null,
        "remark": null,
        "specRemark": null,
        "createId": null,
        "createTime": "2018-09-20 19:39:01",
        "updateId": "936451df9a7443c3a59102b193e3b7ff",
        "updateTime": "2018-09-20 19:39:01",
        "interactId": "92f34793989846a098e7135996242d8c",
        "userDayNumber": 10,
        "type": 0
      },
      "msg": "成功"
    })
  },
  'post /project/interact/shops/detail': (req, res) => {
    res.send({
      "code": 0,
      "data": {
        "id": "92f34793989846a098e7135996242d8c",
        "shopName": "天猫清风旗舰店",
        "shopCode": "\bQJD100001",
        "sellerId": "182daafc2c7e4be1beddba0a6979cbf4",
        "sessionKey": "ABCEFGHIJKLMN",
        "isDelete": null,
        "remark": null,
        "createId": "936451df9a7443c3a59102b193e3b7ff",
        "createTime": "2018-09-20 17:39:34",
        "updateId": "936451df9a7443c3a59102b193e3b7ff",
        "updateTime": "2018-09-20 17:39:38",
        "interactId": "87a2d062c6b643c594f5fda509387fa3",
        "isVip": 10
      },
      "msg": "成功"
    })
  },
  'GET /project/interact/merchantTree': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {
          "id": "854c44cfaea94c6191848fc193c53d92",
          "name": "天猫小敏旗舰店",
          "childList": []
        },
        {
          "id": "182daafc2c7e4be1beddba0a6979cbf4",
          "name": "天猫清风",
          "childList": [
            {
              "id": "938cccdd9a03469f99e66f659ee3d14a",
              "name": "天猫清风旗舰店",
              "childList": [
                {
                  "id": "1",
                  "name": "测试-云南白药",
                  "childList": null
                },
                {
                  "id": "1d4e2c5d6b854d43ac948e0c51f8ce83",
                  "name": "666",
                  "childList": null
                },
                {
                  "id": "3416b4c619e0403c9bb46a13aaea1c14",
                  "name": "9999999",
                  "childList": null
                },
                {
                  "id": "3d8ec6bd455941078e6596b6749dd3e6",
                  "name": "6",
                  "childList": null
                },
                {
                  "id": "3f8afb4fea144b858164d9a9a4135d8a",
                  "name": "1111",
                  "childList": null
                },
                {
                  "id": "49cf81bafa154764a6efb4a1522160ae",
                  "name": "优资莱-珀莱雅",
                  "childList": null
                },
                {
                  "id": "50f84b28f4b5433f86d31dbbbef04ee7",
                  "name": "商品名称222222",
                  "childList": null
                },
                {
                  "id": "6872e449b6704876b9a74a7cf1c82aca",
                  "name": "清风3层100抽0000000000000000",
                  "childList": null
                },
                {
                  "id": "844952a8170f47fbaa44656a7351192a",
                  "name": "我问问",
                  "childList": null
                },
                {
                  "id": "8ceb4e36aa0f443f84528698369d6940",
                  "name": "伊利优酸乳",
                  "childList": null
                },
                {
                  "id": "8e7d25369a114ca5beb298a30b4aeb65",
                  "name": "5555555",
                  "childList": null
                },
                {
                  "id": "a2c57114af6b49dd89be5c9697e7efa4",
                  "name": "1111",
                  "childList": null
                },
                {
                  "id": "aeb0f93482fd4fc6b97129cef110a596",
                  "name": "666",
                  "childList": null
                },
                {
                  "id": "b1f7c42ede9c4a7c837f7e6899d2369e",
                  "name": "清风3层100抽",
                  "childList": null
                },
                {
                  "id": "b568dd69006d485d8044768dfdf2b7ef",
                  "name": "商品2",
                  "childList": null
                },
                {
                  "id": "c38937196f14491abff5e520490acf02",
                  "name": "商品名称test",
                  "childList": null
                },
                {
                  "id": "ca5ba475088946ed8857a8478fdf2ce5",
                  "name": "0987",
                  "childList": null
                },
                {
                  "id": "d6888f533c9f4e2daa0a4b2b0c2fce7a",
                  "name": "乔治卡罗尔",
                  "childList": null
                },
                {
                  "id": "d87c7f9e85e44a139e509ae0ba3a1a15",
                  "name": "77777",
                  "childList": null
                },
                {
                  "id": "eb32bbe0176941fda59650d0f9e76d49",
                  "name": "清风3层100抽",
                  "childList": null
                }
              ]
            }
          ]
        }
      ],
      "msg": "成功"
    })
  },
  'GET 	/project/interact/machineTree': (req, res) => {
    res.send({

      "code": 0,
      "data": [
        {
          "id": "681fd2a6f6c84d40870436fea1854dbd",
          "name": "北京市北京市东城区278797987989899景山公园歪脖树下(18884154)",
          "childList": [
            {
              "id": "1",
              "name": "测试-云南白药",
              "childList": null
            }
          ]
        }
      ],
      "msg": "成功"
    })
  },
  'POST /project/interact/machine/getList': (req, res) => {
    res.send({
        "msg": "成功",
        "data": [
            {
                "id": "6b4cd639883d42999254878b52b1cc20",
                "machineCode": "18978050",
                "localDesc": "北京市北京市西城区小西天灯市口",
                "machineActivity": [{
                    "activityName": "测试别删",
                    "startTime": "2018-10-10 00:00:00",
                    "endTime": "2018-10-11 00:00:59"
                }]
            },
            {
                "id": "6b4cdasd183d42999254878b52b1cc20",
                "machineCode": "18978049",
                "localDesc": "天津市天津市和平区鞍山道沿线大沽口",
                "machineActivity": [{
                    "activityName": "测试别删",
                    "startTime": "2018-09-30 09:00:00",
                    "endTime": "2018-10-10 23:00:00"
                }]
            },
            {
                "id": "6893a2ada9dd4f7eb8dc33adfc6eda73",
                "machineCode": "18022789",
                "localDesc": "北京市北京市西城区小西天灯市口",
                "machineActivity": [{
                    "activityName": "测试别删",
                    "startTime": "2018-10-10 00:00:00",
                    "endTime": "2018-10-20 23:59:59"
                }]
            }
        ],
        "code": 0
    })
  },
  'POST /project/interact/machine/add': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
      })
  },
  'POST /project/interact/machine/goods/add': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
      })
  },
  'POST /project/interact/machine/goods/add': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
      })
  },
  'POST /project/interact/machine/detail': (req, res) => {
    res.send({
      "code": 0,
      "data": {
          "id": null,
          "machineId": "681fd2a6f6c84d40870436fea1854dbd",
          "machineCode": "18884154",
          "localDesc": "北京市北京市东城区278797987989899景山公园歪脖树下",
          "state": 0,
          "queryStartTime": "2018-09-01 13:00:00",
          "queryEndTime": "2018-09-30 23:59:59",
          "machineActivity": [
              {
                  "activityId": "87a2d062c6b643c594f5fda509387fa3",
                  "activityName": "清华大学互派",
                  "startTime": "2018-09-27 00:00:00",
                  "endTime": "2018-09-28 23:59:59"
              },
              {
                  "activityId": "87a2d062c6b643c594f5fda509387fa3",
                  "activityName": "清华大学互派",
                  "startTime": "2018-09-29 00:00:00",
                  "endTime": "2018-09-30 00:00:00"
              },
              {
                  "activityId": "796335802b4e4ac29c942c60280923de",
                  "activityName": "mintest",
                  "startTime": "2018-09-13 00:00:00",
                  "endTime": "2018-09-28 23:59:59"
              },
              {
                  "activityId": "6efa8f687f854569b28fe80dac653825",
                  "activityName": "4444",
                  "startTime": "2018-08-28 00:00:00",
                  "endTime": "2018-08-31 23:59:59"
              }
          ]
      },
      "msg": "成功"
  })
  },
  'POST /project/interact/machine/goods/delete': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'POST /project/interact/machine/delete': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'POST /project/interact/goods/getList': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "data": [{
      "id": "1111111",
      "name": "怡宝款泉水",
      "code": "10000222XXX",
      "price": 0.99,
      "sellerId": "111111",
      "img": "111111",
      "state": 0,
      "remark": "0.99",
      "createId": null,
      "createTime": "2018-07-03 14:51:05",
      "updateId": null,
      "updateTime": "2018-07-03 14:51:05"
      }, {
      "id": "88511198f5214404beb1cd8a3a29359e",
      "name": "来一桶shui",
      "code": "10000222XXX",
      "price": 0.99,
      "sellerId": "111111",
      "img": "111111",
      "state": 0,
      "remark": "0.99",
      "createId": "",
      "createTime": "2018-07-03 10:55:28",
      "updateId": "",
      "updateTime": "2018-07-03 10:55:28"
      }],
      "inno72Goods": {
      "id": null,
      "name": null,
      "code": null,
      "price": null,
      "sellerId": null,
      "img": null,
      "state": 0,
      "remark": null,
      "createId": null,
      "createTime": null,
      "updateId": null,
      "updateTime": null
      }
      })
  },
  'POST /project/interact/machineTree': (req, res) => {
    res.send({
      "code": 0,
      "data": [
      {
      "id": "681fd2a6f6c84d40870436fea1854dbd",
      "name": "北京市北京市东城区278797987989899景山公园歪脖树下(18884154)",
      "childList": [
      {
      "id": "1",
      "name": "测试-云南白药",
      "childList": null
      }
      ]
      }
      ],
      "msg": "成功"
      })
  },
  'POST /project/interact/machine/goods/list': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {
            "id": "def57309fb624f90a89ab1ba6e1550ae",
            "interactMachineId": "b0a4f9c3d3564dde952213606a2ce1de",
            "goodsId": "64747d97fe9a4095918619ce4a3d4b33",
            "number": 1000,
            "seq": 1,
            "startTime": "2018-09-26 23:59:59",
            "endTime": "2018-09-26 23:59:59",
            "state": 0,
            "type": 0,
            "goodsName": "清风2层100抽",
            "startTimeStr": null,
            "endTimeStr": null
        }
    ],
      "msg": "成功"
    })
  },
  'POST /project/interact/machine/getHavingMachines': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {
            "id": "b0a4f9c3d3564dde952213606a2ce1de",
            "machineId": "681fd2a6f6c84d40870436fea1854dbd",
            "machineCode": "18884154",
            "localDesc": "北京市北京市东城区278797987989899景山公园歪脖树下",
            "machineActivity": []
        }
    ],
      "msg": "成功"
    })
  },
  'POST /project/interact/detail': (req, res) => {
    res.send({
      "code": 0,
      "data":  {
        "id": "1",
        "name": "派样活动",
        "gameId": "1",
        "day": 5,
        "manager": "如意",
        "status": 0,
        "times": 5,
        "dayTimes": 1,
        "number": 10,
        "dayNumber": 2,
        "createId": null,
        "createTime": "2018-09-19 16:37:28",
        "updateId": null,
        "updateTime": "0001-01-01 00:00:00"
        },
      "msg": "成功"
    })
  },
  'POST /statistics/TemplateExecute': (req, res) => {
    const data = {"code":0,"msg":"成功"}
    if(req.body.name==="goodsInfo"){
      data.data = [{"goods":6,"machineCode":"18002841","pos":"江苏省徐州市云龙区徐州医科大学点位1","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"潘婷3分钟奇迹奢护精华霜","goodsCode":"576665688344"},{"goods":5,"machineCode":"18015770","pos":"上海市上海市闵行区华东师范大学（闵行校区）点位2","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"潘婷3分钟奇迹奢护精华霜","goodsCode":"576665688344"},{"goods":1,"machineCode":"18015770","pos":"上海市上海市闵行区华东师范大学（闵行校区）点位2","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-30","goodsName":"潘婷3分钟奇迹奢护精华霜","goodsCode":"576665688344"},{"goods":13,"machineCode":"18033963","pos":"安徽省合肥市蜀山区合肥师范学院（锦绣校区）点位1","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"采之汲雪肌焕亮面膜2片组合装","goodsCode":"576236451496"},{"goods":10,"machineCode":"18073757","pos":"江苏省南京市浦口区南京信息工程大学（东苑）点位1","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"潘婷3分钟奇迹奢护精华霜","goodsCode":"576665688344"},{"goods":26,"machineCode":"18088295","pos":"湖南省长沙市岳麓区湖南商务职业技术学院点位2","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"潘婷3分钟奇迹奢护精华霜","goodsCode":"576665688344"},{"goods":18,"machineCode":"18093877","pos":"安徽省合肥市蜀山区合肥师范学院（锦绣校区）点位2","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"潘婷3分钟奇迹奢护精华霜","goodsCode":"576665688344"},{"goods":59,"machineCode":"18180564","pos":"四川省成都市龙泉驿区四川师范大学（成龙校区）点位2","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"潘婷3分钟奇迹奢护精华霜","goodsCode":"576665688344"},{"goods":6,"machineCode":"18180564","pos":"四川省成都市龙泉驿区四川师范大学（成龙校区）点位2","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-30","goodsName":"潘婷3分钟奇迹奢护精华霜","goodsCode":"576665688344"},{"goods":3,"machineCode":"18231775","pos":"北京市北京市西城区北京建筑大学点位1","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-30","goodsName":"潘婷3分钟奇迹奢护精华霜","goodsCode":"576665688344"},{"goods":4,"machineCode":"18294515","pos":"广东省广州市天河区华南农业大学绿榕园一楼点位1","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"乔治卡罗尔男士沐浴露","goodsCode":"576510091613"},{"goods":139,"machineCode":"18304210","pos":"江苏省徐州市泉山区江苏师范大学点位1","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"潘婷3分钟奇迹奢护精华霜","goodsCode":"576665688344"},{"goods":5,"machineCode":"18304210","pos":"江苏省徐州市泉山区江苏师范大学点位1","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-30","goodsName":"潘婷3分钟奇迹奢护精华霜","goodsCode":"576665688344"},{"goods":2,"machineCode":"18377770","pos":"四川省雅安市雨城区四川农业大学雅安校区1","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"潘婷3分钟奇迹奢护精华霜","goodsCode":"576665688344"},{"goods":6,"machineCode":"18390965","pos":"江苏省南京市浦口区南京信息工程大学（中苑）点位2","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"潘婷3分钟奇迹奢护精华霜","goodsCode":"576665688344"},{"goods":4,"machineCode":"18457853","pos":"江苏省南京市浦口区南京信息工程大学（中苑）点位1","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"潘婷3分钟奇迹奢护精华霜","goodsCode":"576665688344"},{"goods":36,"machineCode":"18470589","pos":"江西省南昌市青山湖区江西农业大学点位1","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"潘婷3分钟奇迹奢护精华霜","goodsCode":"576665688344"},{"goods":16,"machineCode":"18483379","pos":"四川省成都市温江区四川农业大学温江校区点位4","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"潘婷3分钟奇迹奢护精华霜","goodsCode":"576665688344"},{"goods":4,"machineCode":"18485774","pos":"陕西省宝鸡市渭滨区宝鸡文理学院点位1","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"乔治卡罗尔男士洗发水","goodsCode":"576283105389"},{"goods":1,"machineCode":"18525960","pos":"河北省石家庄市裕华区河北科技大学点位1","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"乔治卡罗尔男士洗发水","goodsCode":"576283105389"},{"goods":4,"machineCode":"18624181","pos":"四川省成都市温江区四川农业大学温江校区点位3","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"乔治卡罗尔男士洗面奶","goodsCode":"576402814187"},{"goods":9,"machineCode":"18638724","pos":"四川省成都市温江区四川农业大学温江校区点位1","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"优资莱旅行套装","goodsCode":"575906013266"},{"goods":8,"machineCode":"18638724","pos":"四川省成都市温江区四川农业大学温江校区点位1","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"悦诗风吟芦荟面膜","goodsCode":"576069787121"},{"goods":3,"machineCode":"18638724","pos":"四川省成都市温江区四川农业大学温江校区点位1","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-30","goodsName":"优资莱旅行套装","goodsCode":"575906013266"},{"goods":3,"machineCode":"18638724","pos":"四川省成都市温江区四川农业大学温江校区点位1","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-30","goodsName":"悦诗风吟芦荟面膜","goodsCode":"576069787121"},{"goods":34,"machineCode":"18672886","pos":"江西省南昌市东湖区豫章师范学院点位1","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"悦诗风吟芦荟面膜","goodsCode":"576069787121"},{"goods":2,"machineCode":"18715089","pos":"四川省成都市其他西南交通大学犀浦校区点位2","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"优资莱旅行套装","goodsCode":"575906013266"},{"goods":3,"machineCode":"18715089","pos":"四川省成都市其他西南交通大学犀浦校区点位2","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"悦诗风吟芦荟面膜","goodsCode":"576069787121"},{"goods":21,"machineCode":"18738688","pos":"江苏省徐州市泉山区江苏师范大学点位2","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"潘婷3分钟奇迹奢护精华霜","goodsCode":"576665688344"},{"goods":9,"machineCode":"18745138","pos":"四川省雅安市雨城区四川农业大学雅安校区点位2","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"优资莱旅行套装","goodsCode":"575906013266"},{"goods":15,"machineCode":"18745138","pos":"四川省雅安市雨城区四川农业大学雅安校区点位2","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"悦诗风吟芦荟面膜","goodsCode":"576069787121"},{"goods":10,"machineCode":"18745138","pos":"四川省雅安市雨城区四川农业大学雅安校区点位2","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"乔治卡罗尔男士沐浴露","goodsCode":"576510091613"},{"goods":32,"machineCode":"18805585","pos":"上海市上海市嘉定区同济大学点位1","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"优资莱旅行套装","goodsCode":"575906013266"},{"goods":26,"machineCode":"18805585","pos":"上海市上海市嘉定区同济大学点位1","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"悦诗风吟芦荟面膜","goodsCode":"576069787121"},{"goods":1,"machineCode":"18805585","pos":"上海市上海市嘉定区同济大学点位1","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-30","goodsName":"优资莱旅行套装","goodsCode":"575906013266"},{"goods":52,"machineCode":"18811576","pos":"安徽省合肥市蜀山区新华学院点位1","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"潘婷3分钟奇迹奢护精华霜","goodsCode":"576665688344"},{"goods":6,"machineCode":"18815385","pos":"上海市上海市闵行区华东师范大学（闵行校区）点位1","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"采之汲雪肌焕亮面膜2片组合装","goodsCode":"576236451496"},{"goods":2,"machineCode":"18815385","pos":"上海市上海市闵行区华东师范大学（闵行校区）点位1","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-30","goodsName":"采之汲雪肌焕亮面膜2片组合装","goodsCode":"576236451496"},{"goods":1,"machineCode":"18847938","pos":"江苏省徐州市云龙区徐州医科大学点位2","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"潘婷3分钟奇迹奢护精华霜","goodsCode":"576665688344"},{"goods":1,"machineCode":"18847938","pos":"江苏省徐州市云龙区徐州医科大学点位2","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-30","goodsName":"潘婷3分钟奇迹奢护精华霜","goodsCode":"576665688344"},{"goods":6,"machineCode":"18871594","pos":"上海市上海市嘉定区同济大学点位2","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"潘婷3分钟奇迹奢护精华霜","goodsCode":"576665688344"},{"goods":1,"machineCode":"18871594","pos":"上海市上海市嘉定区同济大学点位2","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-30","goodsName":"潘婷3分钟奇迹奢护精华霜","goodsCode":"576665688344"},{"goods":2,"machineCode":"18886290","pos":"四川省成都市其他西南交通大学犀浦校区点位1","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"优资莱旅行套装","goodsCode":"575906013266"},{"goods":3,"machineCode":"18886290","pos":"四川省成都市其他西南交通大学犀浦校区点位1","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"悦诗风吟芦荟面膜","goodsCode":"576069787121"},{"goods":18,"machineCode":"18895324","pos":"四川省成都市龙泉驿区四川师范大学（成龙校区）点位1","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"优资莱旅行套装","goodsCode":"575906013266"},{"goods":3,"machineCode":"18895324","pos":"四川省成都市龙泉驿区四川师范大学（成龙校区）点位1","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-30","goodsName":"优资莱旅行套装","goodsCode":"575906013266"},{"goods":21,"machineCode":"18924094","pos":"浙江省杭州市余杭区杭州师范大学仓前校区点位2","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"潘婷3分钟奇迹奢护精华霜","goodsCode":"576665688344"},{"goods":3,"machineCode":"18924094","pos":"浙江省杭州市余杭区杭州师范大学仓前校区点位2","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-30","goodsName":"潘婷3分钟奇迹奢护精华霜","goodsCode":"576665688344"},{"goods":10,"machineCode":"18927452","pos":"广东省广州市天河区华南农业大学绿榕园一楼点位2","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"潘婷3分钟奇迹奢护精华霜","goodsCode":"576665688344"},{"goods":15,"machineCode":"18944889","pos":"四川省成都市温江区四川农业大学温江校区点位2","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"潘婷3分钟奇迹奢护精华霜","goodsCode":"576665688344"},{"goods":2,"machineCode":"18944889","pos":"四川省成都市温江区四川农业大学温江校区点位2","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-30","goodsName":"潘婷3分钟奇迹奢护精华霜","goodsCode":"576665688344"},{"goods":11,"machineCode":"18985756","pos":"浙江省杭州市余杭区杭州师范大学仓前校区点位1","activityId":"9c60b8c61b4d4f588f34caa7219f3e1a","time":"2018-09-29","goodsName":"悦诗风吟芦荟面膜","goodsCode":"576069787121"}]
      data.data = [{"goods": 2, "machineCode": "18531434", "pos": "\u6cb3\u5317\u7701\u77f3\u5bb6\u5e84\u5e02\u88d5\u534e\u533a\u673a\u5668\u52ff\u5220", "activityId": "f95976169ca2429b8e1d9b344fe4961c", "time": "2018-09-29", "goodsName": "\u6f58\u5a773\u5206\u949f\u5947\u8ff9\u5962\u62a4\u7cbe\u534e\u971c", "goodsCode": "576665688344"}, {"goods": 1, "machineCode": "18578416", "pos": "\u9999\u6e2f\u7279\u522b\u884c\u653f\u533a\u9999\u6e2f\u7279\u522b\u884c\u653f\u533a\u5176\u4ed6\u67ff\u5b50\u8def\u53e3", "activityId": "f95976169ca2429b8e1d9b344fe4961c", "time": "2018-09-29", "goodsName": "\u91c7\u4e4b\u6c72\u96ea\u808c\u7115\u4eae\u9762\u819c\u7ec4\u5408\u88c5", "goodsCode": "576236451496"}, {"goods": 1, "machineCode": "18578416", "pos": "\u9999\u6e2f\u7279\u522b\u884c\u653f\u533a\u9999\u6e2f\u7279\u522b\u884c\u653f\u533a\u5176\u4ed6\u67ff\u5b50\u8def\u53e3", "activityId": "f95976169ca2429b8e1d9b344fe4961c", "time": "2018-09-30", "goodsName": "\u4f18\u8d44\u83b1\u7eff\u8336\u6d3b\u8403\u82af\u808c\u5957\u88c5", "goodsCode": "575906013266"}]
    }else{
      data.data = [{"point": "\u6fb3\u95e8\u7279\u522b\u884c\u653f\u533a\u6fb3\u95e8\u7279\u522b\u884c\u653f\u533a\u5176\u4ed6\u5730\u4e0b\u4e00\u5c42\u95e8\u53e3", "data": [{"pv": 1, "uv": 1, "activityId": "4400721f84964087bdf59b1fea02daa6", "shipment": 1, "machineCode": "18355236", "date": "2018-09-24", "order": 1}, {"pv": 1, "uv": 1, "activityId": "4400721f84964087bdf59b1fea02daa6", "shipment": 1, "machineCode": "18355236", "date": "2018-09-24", "order": 1}, {"pv": 1, "uv": 1, "activityId": "4400721f84964087bdf59b1fea02daa6", "shipment": 1, "machineCode": "18355236", "date": "2018-09-24", "order": 1}, {"pv": 1, "uv": 1, "activityId": "4400721f84964087bdf59b1fea02daa6", "shipment": 1, "machineCode": "18355236", "date": "2018-09-25", "order": 1}, {"pv": 1, "uv": 1, "activityId": "4400721f84964087bdf59b1fea02daa6", "shipment": 1, "machineCode": "18355236", "date": "2018-09-25", "order": 1}, {"pv": 1, "uv": 1, "activityId": "4400721f84964087bdf59b1fea02daa6", "shipment": 1, "machineCode": "18355236", "date": "2018-09-25", "order": 1}, {"pv": 1, "uv": 1, "activityId": "4400721f84964087bdf59b1fea02daa6", "shipment": 1, "machineCode": "18355236", "date": "2018-09-26", "order": 1}, {"pv": 1, "uv": 1, "activityId": "4400721f84964087bdf59b1fea02daa6", "shipment": 1, "machineCode": "18355236", "date": "2018-09-26", "order": 1}, {"pv": 1, "uv": 1, "activityId": "4400721f84964087bdf59b1fea02daa6", "shipment": 1, "machineCode": "18355236", "date": "2018-09-26", "order": 1}, {"pv": 1, "uv": 1, "activityId": "4400721f84964087bdf59b1fea02daa6", "shipment": 1, "machineCode": "18355236", "date": "2018-09-27", "order": 1}, {"pv": 1, "uv": 1, "activityId": "4400721f84964087bdf59b1fea02daa6", "shipment": 1, "machineCode": "18355236", "date": "2018-09-27", "order": 1}, {"pv": 1, "uv": 1, "activityId": "4400721f84964087bdf59b1fea02daa6", "shipment": 1, "machineCode": "18355236", "date": "2018-09-27", "order": 1}, {"date": "2018-09-28", "visitor": 0, "activityId": "4400721f84964087bdf59b1fea02daa6", "machineCode": "18355236"}, {"date": "2018-09-28", "visitor": 61, "activityId": "4400721f84964087bdf59b1fea02daa6", "machineCode": "18355236"}, {"pv": 1, "uv": 1, "activityId": "4400721f84964087bdf59b1fea02daa6", "shipment": 1, "machineCode": "18355236", "date": "2018-09-28", "order": 1}, {"date": "2018-09-29", "visitor": 0, "activityId": "4400721f84964087bdf59b1fea02daa6", "machineCode": "18355236"}, {"pv": 2, "uv": 4, "activityId": "4400721f84964087bdf59b1fea02daa6", "shipment": 2, "machineCode": "18355236", "date": "2018-09-29", "order": 2}, {"pv": 1, "uv": 1, "activityId": "4400721f84964087bdf59b1fea02daa6", "shipment": 1, "machineCode": "18355236", "date": "2018-09-29", "order": 1}, {"pv": 4, "visitor": 0, "uv": 1, "activityId": "4400721f84964087bdf59b1fea02daa6", "machineCode": "18355236", "date": "2018-09-30", "order": 2}, {"date": "2018-09-30", "visitor": 0, "activityId": "4400721f84964087bdf59b1fea02daa6", "machineCode": "18355236"}, {"pv": 2, "uv": 1, "activityId": "4400721f84964087bdf59b1fea02daa6", "machineCode": "18355236", "date": "2018-09-30", "order": 1}, {"date": "2018-09-30", "visitor": 0, "activityId": "4400721f84964087bdf59b1fea02daa6", "machineCode": "18355236"}], "machineCode": "18355236"}]
      data.data = [{"point": "\u6c5f\u82cf\u7701\u5f90\u5dde\u5e02\u4e91\u9f99\u533a\u5f90\u5dde\u533b\u79d1\u5927\u5b66\u70b9\u4f4d1", "data": [{"pv": 10, "uv": 10, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 6, "machineCode": "18002841", "date": "2018-09-29", "order": 6}, {"pv": 6, "uv": 6, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 4, "machineCode": "18002841", "date": "2018-09-30", "order": 4}], "machineCode": "18002841"}, {"point": "\u4e0a\u6d77\u5e02\u4e0a\u6d77\u5e02\u95f5\u884c\u533a\u534e\u4e1c\u5e08\u8303\u5927\u5b66\uff08\u95f5\u884c\u6821\u533a\uff09\u70b9\u4f4d2", "data": [{"pv": 5, "uv": 5, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 5, "machineCode": "18015770", "date": "2018-09-29", "order": 5}, {"pv": 15, "uv": 13, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 11, "machineCode": "18015770", "date": "2018-09-30", "order": 12}], "machineCode": "18015770"}, {"point": "\u5b89\u5fbd\u7701\u5408\u80a5\u5e02\u8700\u5c71\u533a\u5408\u80a5\u5e08\u8303\u5b66\u9662\uff08\u9526\u7ee3\u6821\u533a\uff09\u70b9\u4f4d1", "data": [{"pv": 22, "uv": 18, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 13, "machineCode": "18033963", "date": "2018-09-29", "order": 13}, {"pv": 6, "uv": 6, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 6, "machineCode": "18033963", "date": "2018-09-30", "order": 6}], "machineCode": "18033963"}, {"point": "\u5317\u4eac\u5e02\u5317\u4eac\u5e02\u671d\u9633\u533a\u70b972\u751f\u4ea7\u673a\u5668", "data": [{"pv": 2, "uv": 1, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 1, "machineCode": "18047652", "date": "2018-09-30", "order": 2}], "machineCode": "18047652"}, {"point": "\u6c5f\u82cf\u7701\u5357\u4eac\u5e02\u6d66\u53e3\u533a\u5357\u4eac\u4fe1\u606f\u5de5\u7a0b\u5927\u5b66\uff08\u4e1c\u82d1\uff09\u70b9\u4f4d1", "data": [{"pv": 10, "uv": 7, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 10, "machineCode": "18073757", "date": "2018-09-29", "order": 10}, {"pv": 4, "uv": 4, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 4, "machineCode": "18073757", "date": "2018-09-30", "order": 4}], "machineCode": "18073757"}, {"point": "\u6e56\u5357\u7701\u957f\u6c99\u5e02\u5cb3\u9e93\u533a\u6e56\u5357\u5546\u52a1\u804c\u4e1a\u6280\u672f\u5b66\u9662\u70b9\u4f4d2", "data": [{"pv": 32, "uv": 17, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 26, "machineCode": "18088295", "date": "2018-09-29", "order": 29}], "machineCode": "18088295"}, {"point": "\u5b89\u5fbd\u7701\u5408\u80a5\u5e02\u8700\u5c71\u533a\u5408\u80a5\u5e08\u8303\u5b66\u9662\uff08\u9526\u7ee3\u6821\u533a\uff09\u70b9\u4f4d2", "data": [{"pv": 41, "uv": 27, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 18, "machineCode": "18093877", "date": "2018-09-29", "order": 20}, {"pv": 5, "uv": 5, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 5, "machineCode": "18093877", "date": "2018-09-30", "order": 5}], "machineCode": "18093877"}, {"point": "\u56db\u5ddd\u7701\u6210\u90fd\u5e02\u9f99\u6cc9\u9a7f\u533a\u56db\u5ddd\u5e08\u8303\u5927\u5b66\uff08\u6210\u9f99\u6821\u533a\uff09\u70b9\u4f4d2", "data": [{"pv": 78, "uv": 64, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 59, "machineCode": "18180564", "date": "2018-09-29", "order": 60}, {"pv": 71, "uv": 57, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 51, "machineCode": "18180564", "date": "2018-09-30", "order": 51}], "machineCode": "18180564"}, {"point": "\u5317\u4eac\u5e02\u5317\u4eac\u5e02\u897f\u57ce\u533a\u5317\u4eac\u5efa\u7b51\u5927\u5b66\u70b9\u4f4d1", "data": [{"pv": 14, "uv": 12, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 10, "machineCode": "18231775", "date": "2018-09-30", "order": 11}], "machineCode": "18231775"}, {"point": "\u5e7f\u4e1c\u7701\u5e7f\u5dde\u5e02\u5929\u6cb3\u533a\u534e\u5357\u519c\u4e1a\u5927\u5b66\u7eff\u6995\u56ed\u4e00\u697c\u70b9\u4f4d1", "data": [{"pv": 25, "uv": 18, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 4, "machineCode": "18294515", "date": "2018-09-29", "order": 15}, {"pv": 40, "uv": 28, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 14, "machineCode": "18294515", "date": "2018-09-30", "order": 27}], "machineCode": "18294515"}, {"point": "\u6c5f\u82cf\u7701\u5f90\u5dde\u5e02\u6cc9\u5c71\u533a\u6c5f\u82cf\u5e08\u8303\u5927\u5b66\u70b9\u4f4d1", "data": [{"pv": 159, "uv": 147, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 139, "machineCode": "18304210", "date": "2018-09-29", "order": 141}, {"pv": 92, "uv": 83, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 78, "machineCode": "18304210", "date": "2018-09-30", "order": 78}], "machineCode": "18304210"}, {"point": "\u56db\u5ddd\u7701\u96c5\u5b89\u5e02\u96e8\u57ce\u533a\u56db\u5ddd\u519c\u4e1a\u5927\u5b66\u96c5\u5b89\u6821\u533a1", "data": [{"pv": 5, "uv": 4, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 2, "machineCode": "18377770", "date": "2018-09-29", "order": 3}], "machineCode": "18377770"}, {"point": "\u6c5f\u82cf\u7701\u5357\u4eac\u5e02\u6d66\u53e3\u533a\u5357\u4eac\u4fe1\u606f\u5de5\u7a0b\u5927\u5b66\uff08\u4e2d\u82d1\uff09\u70b9\u4f4d2", "data": [{"pv": 11, "uv": 7, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 6, "machineCode": "18390965", "date": "2018-09-29", "order": 6}, {"pv": 12, "uv": 9, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 6, "machineCode": "18390965", "date": "2018-09-30", "order": 7}], "machineCode": "18390965"}, {"point": "\u6c5f\u82cf\u7701\u5357\u4eac\u5e02\u6d66\u53e3\u533a\u5357\u4eac\u4fe1\u606f\u5de5\u7a0b\u5927\u5b66\uff08\u4e2d\u82d1\uff09\u70b9\u4f4d1", "data": [{"pv": 5, "uv": 4, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 4, "machineCode": "18457853", "date": "2018-09-29", "order": 5}], "machineCode": "18457853"}, {"point": "\u6c5f\u897f\u7701\u5357\u660c\u5e02\u9752\u5c71\u6e56\u533a\u6c5f\u897f\u519c\u4e1a\u5927\u5b66\u70b9\u4f4d1", "data": [{"pv": 59, "uv": 38, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 36, "machineCode": "18470589", "date": "2018-09-29", "order": 39}, {"pv": 3, "uv": 2, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 2, "machineCode": "18470589", "date": "2018-09-30", "order": 2}], "machineCode": "18470589"}, {"point": "\u56db\u5ddd\u7701\u6210\u90fd\u5e02\u6e29\u6c5f\u533a\u56db\u5ddd\u519c\u4e1a\u5927\u5b66\u6e29\u6c5f\u6821\u533a\u70b9\u4f4d4", "data": [{"pv": 21, "uv": 17, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 16, "machineCode": "18483379", "date": "2018-09-29", "order": 16}, {"pv": 14, "uv": 8, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 6, "machineCode": "18483379", "date": "2018-09-30", "order": 6}], "machineCode": "18483379"}, {"point": "\u9655\u897f\u7701\u5b9d\u9e21\u5e02\u6e2d\u6ee8\u533a\u5b9d\u9e21\u6587\u7406\u5b66\u9662\u70b9\u4f4d1", "data": [{"pv": 5, "uv": 4, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 4, "machineCode": "18485774", "date": "2018-09-29", "order": 4}, {"pv": 1, "uv": 1, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "machineCode": "18485774", "date": "2018-09-30"}], "machineCode": "18485774"}, {"point": "\u6cb3\u5317\u7701\u77f3\u5bb6\u5e84\u5e02\u88d5\u534e\u533a\u6cb3\u5317\u79d1\u6280\u5927\u5b66\u70b9\u4f4d1", "data": [{"pv": 4, "uv": 2, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 1, "machineCode": "18525960", "date": "2018-09-29", "order": 1}], "machineCode": "18525960"}, {"point": "\u56db\u5ddd\u7701\u6210\u90fd\u5e02\u6e29\u6c5f\u533a\u56db\u5ddd\u519c\u4e1a\u5927\u5b66\u6e29\u6c5f\u6821\u533a\u70b9\u4f4d3", "data": [{"pv": 25, "uv": 12, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 4, "machineCode": "18624181", "date": "2018-09-29", "order": 4}, {"pv": 9, "uv": 6, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "machineCode": "18624181", "date": "2018-09-30"}], "machineCode": "18624181"}, {"point": "\u5317\u4eac\u5e02\u5317\u4eac\u5e02\u897f\u57ce\u533a\u5317\u4eac\u5efa\u7b51\u5927\u5b66\u70b9\u4f4d2", "data": [{"pv": 2, "uv": 1, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "machineCode": "18638478", "date": "2018-09-29"}, {"pv": 29, "uv": 9, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "machineCode": "18638478", "date": "2018-09-30"}], "machineCode": "18638478"}, {"point": "\u56db\u5ddd\u7701\u6210\u90fd\u5e02\u6e29\u6c5f\u533a\u56db\u5ddd\u519c\u4e1a\u5927\u5b66\u6e29\u6c5f\u6821\u533a\u70b9\u4f4d1", "data": [{"pv": 29, "uv": 15, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 17, "machineCode": "18638724", "date": "2018-09-29", "order": 17}, {"pv": 24, "uv": 15, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 18, "machineCode": "18638724", "date": "2018-09-30", "order": 18}], "machineCode": "18638724"}, {"point": "\u6c5f\u897f\u7701\u5357\u660c\u5e02\u4e1c\u6e56\u533a\u8c6b\u7ae0\u5e08\u8303\u5b66\u9662\u70b9\u4f4d1", "data": [{"pv": 61, "uv": 41, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 34, "machineCode": "18672886", "date": "2018-09-29", "order": 34}], "machineCode": "18672886"}, {"point": "\u9655\u897f\u7701\u897f\u5b89\u5e02\u6237\u53bf\u897f\u5b89\u5efa\u7b51\u79d1\u6280\u5927\u5b66\uff08\u8349\u5802\u6821\u533a\uff09", "data": [{"pv": 6, "uv": 5, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "machineCode": "18681298", "date": "2018-09-29", "order": 3}, {"pv": 2, "uv": 1, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "machineCode": "18681298", "date": "2018-09-30", "order": 2}], "machineCode": "18681298"}, {"point": "\u56db\u5ddd\u7701\u6210\u90fd\u5e02\u5176\u4ed6\u897f\u5357\u4ea4\u901a\u5927\u5b66\u7280\u6d66\u6821\u533a\u70b9\u4f4d2", "data": [{"pv": 6, "uv": 3, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 5, "machineCode": "18715089", "date": "2018-09-29", "order": 5}, {"pv": 5, "uv": 4, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 4, "machineCode": "18715089", "date": "2018-09-30", "order": 4}], "machineCode": "18715089"}, {"point": "\u6c5f\u82cf\u7701\u5f90\u5dde\u5e02\u6cc9\u5c71\u533a\u6c5f\u82cf\u5e08\u8303\u5927\u5b66\u70b9\u4f4d2", "data": [{"pv": 26, "uv": 22, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 21, "machineCode": "18738688", "date": "2018-09-29", "order": 21}], "machineCode": "18738688"}, {"point": "\u56db\u5ddd\u7701\u96c5\u5b89\u5e02\u96e8\u57ce\u533a\u56db\u5ddd\u519c\u4e1a\u5927\u5b66\u96c5\u5b89\u6821\u533a\u70b9\u4f4d2", "data": [{"pv": 50, "uv": 19, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 34, "machineCode": "18745138", "date": "2018-09-29", "order": 34}], "machineCode": "18745138"}, {"point": "\u4e0a\u6d77\u5e02\u4e0a\u6d77\u5e02\u5609\u5b9a\u533a\u540c\u6d4e\u5927\u5b66\u70b9\u4f4d1", "data": [{"pv": 70, "uv": 36, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 58, "machineCode": "18805585", "date": "2018-09-29", "order": 58}, {"pv": 25, "uv": 14, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 24, "machineCode": "18805585", "date": "2018-09-30", "order": 24}], "machineCode": "18805585"}, {"point": "\u5b89\u5fbd\u7701\u5408\u80a5\u5e02\u8700\u5c71\u533a\u65b0\u534e\u5b66\u9662\u70b9\u4f4d1", "data": [{"pv": 67, "uv": 54, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 52, "machineCode": "18811576", "date": "2018-09-29", "order": 52}, {"pv": 4, "uv": 4, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 4, "machineCode": "18811576", "date": "2018-09-30", "order": 4}], "machineCode": "18811576"}, {"point": "\u4e0a\u6d77\u5e02\u4e0a\u6d77\u5e02\u95f5\u884c\u533a\u534e\u4e1c\u5e08\u8303\u5927\u5b66\uff08\u95f5\u884c\u6821\u533a\uff09\u70b9\u4f4d1", "data": [{"pv": 9, "uv": 7, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 6, "machineCode": "18815385", "date": "2018-09-29", "order": 6}, {"pv": 20, "uv": 15, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 14, "machineCode": "18815385", "date": "2018-09-30", "order": 14}], "machineCode": "18815385"}, {"point": "\u6c5f\u82cf\u7701\u5f90\u5dde\u5e02\u4e91\u9f99\u533a\u5f90\u5dde\u533b\u79d1\u5927\u5b66\u70b9\u4f4d2", "data": [{"pv": 4, "uv": 3, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 1, "machineCode": "18847938", "date": "2018-09-29", "order": 1}, {"pv": 12, "uv": 8, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 2, "machineCode": "18847938", "date": "2018-09-30", "order": 8}], "machineCode": "18847938"}, {"point": "\u4e0a\u6d77\u5e02\u4e0a\u6d77\u5e02\u5609\u5b9a\u533a\u540c\u6d4e\u5927\u5b66\u70b9\u4f4d2", "data": [{"pv": 6, "uv": 6, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 6, "machineCode": "18871594", "date": "2018-09-29", "order": 6}, {"pv": 6, "uv": 6, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 6, "machineCode": "18871594", "date": "2018-09-30", "order": 6}], "machineCode": "18871594"}, {"point": "\u56db\u5ddd\u7701\u6210\u90fd\u5e02\u5176\u4ed6\u897f\u5357\u4ea4\u901a\u5927\u5b66\u7280\u6d66\u6821\u533a\u70b9\u4f4d1", "data": [{"pv": 5, "uv": 3, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 5, "machineCode": "18886290", "date": "2018-09-29", "order": 5}, {"pv": 5, "uv": 3, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 3, "machineCode": "18886290", "date": "2018-09-30", "order": 3}], "machineCode": "18886290"}, {"point": "\u56db\u5ddd\u7701\u6210\u90fd\u5e02\u9f99\u6cc9\u9a7f\u533a\u56db\u5ddd\u5e08\u8303\u5927\u5b66\uff08\u6210\u9f99\u6821\u533a\uff09\u70b9\u4f4d1", "data": [{"pv": 33, "uv": 28, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 18, "machineCode": "18895324", "date": "2018-09-29", "order": 18}, {"pv": 40, "uv": 30, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 23, "machineCode": "18895324", "date": "2018-09-30", "order": 23}], "machineCode": "18895324"}, {"point": "\u56db\u5ddd\u7701\u6210\u90fd\u5e02\u90eb\u53bf\u56db\u5ddd\u4f20\u5a92\u5b66\u9662\u70b9\u4f4d2", "data": [{"pv": 3, "uv": 2, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "machineCode": "18905764", "date": "2018-09-29"}, {"pv": 6, "uv": 4, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "machineCode": "18905764", "date": "2018-09-30"}], "machineCode": "18905764"}, {"point": "\u6d59\u6c5f\u7701\u676d\u5dde\u5e02\u4f59\u676d\u533a\u676d\u5dde\u5e08\u8303\u5927\u5b66\u4ed3\u524d\u6821\u533a\u70b9\u4f4d2", "data": [{"pv": 30, "uv": 21, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 21, "machineCode": "18924094", "date": "2018-09-29", "order": 21}, {"pv": 9, "uv": 4, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 4, "machineCode": "18924094", "date": "2018-09-30", "order": 4}], "machineCode": "18924094"}, {"point": "\u5e7f\u4e1c\u7701\u5e7f\u5dde\u5e02\u5929\u6cb3\u533a\u534e\u5357\u519c\u4e1a\u5927\u5b66\u7eff\u6995\u56ed\u4e00\u697c\u70b9\u4f4d2", "data": [{"pv": 34, "uv": 25, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 10, "machineCode": "18927452", "date": "2018-09-29", "order": 26}, {"pv": 65, "uv": 48, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 20, "machineCode": "18927452", "date": "2018-09-30", "order": 48}], "machineCode": "18927452"}, {"point": "\u56db\u5ddd\u7701\u6210\u90fd\u5e02\u6e29\u6c5f\u533a\u56db\u5ddd\u519c\u4e1a\u5927\u5b66\u6e29\u6c5f\u6821\u533a\u70b9\u4f4d2", "data": [{"pv": 17, "uv": 16, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 15, "machineCode": "18944889", "date": "2018-09-29", "order": 15}, {"pv": 26, "uv": 23, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 19, "machineCode": "18944889", "date": "2018-09-30", "order": 19}], "machineCode": "18944889"}, {"point": "\u6d59\u6c5f\u7701\u676d\u5dde\u5e02\u4f59\u676d\u533a\u676d\u5dde\u5e08\u8303\u5927\u5b66\u4ed3\u524d\u6821\u533a\u70b9\u4f4d1", "data": [{"pv": 17, "uv": 15, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 11, "machineCode": "18985756", "date": "2018-09-29", "order": 12}, {"pv": 11, "uv": 10, "activityId": "9c60b8c61b4d4f588f34caa7219f3e1a", "shipment": 3, "machineCode": "18985756", "date": "2018-09-30", "order": 3}], "machineCode": "18985756"}]
    }
    res.send(data)
  },
  'post /machine/locale/updateBatch': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'post /machine/batch/list': (req, res) => {
    res.send({
        "msg":"成功",
        "code":0,
        "page":{
          "pageSize":20,
          "currentResult":0,
          "totalPage":1,
          "pageNo":1,
          "totalCount":2,
          "list":null,
          "firstPage":true,
          "lastPage":true,
          "nextPage":1,
          "prePage":1,
          "firstResult":0
        },
        "data":[
          {
            "id":"18",
            "batchName":"原机器",
            "createId":null,
            "createUser":null,
            "createTime":null,
            "updateId":null,
            "updateUser":null,
            "updateTime":"2018-10-12 16:56:32",
            "detailList":[

            ]
          },
          {
            "id":"19",
            "batchName":"新批次",
            "createId":null,
            "createUser":null,
            "createTime":null,
            "updateId":null,
            "updateUser":null,
            "updateTime":null,
            "detailList":[

            ]
          }
        ],
        "unColumn":""
      })
  },
  'get /machine/batch/detail': (req, res) => {
    res.send({
      "code":0,
      "msg":"",
      "data":{
        "id":"19",
        "batchName":"新批次",
        "detailList":[
          {
            "rowNo":1,
            "count":8,
            "type":2,
            "volumeCount":12
          },
          {
            "rowNo":2,
            "count":9,
            "type":2,
            "volumeCount":12
          }
        ]
      }
    })
  },
  'post /machine/batch/save': (req, res) => {
    res.send({
      "msg":"成功",
      "data":null,
      "code":0
    })
  },
  'POST /machine/batch/update': (req, res) => {
    res.send({
      "msg":"成功",
      "data":null,
      "code":0
    })
  },
  'GET /machine/app/appVersionList': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {
          "appName": "ceshi",
          "appPackageName": "111",
          "appVersion": "1.0.1",
          "appVersionCode": "10",
          "downloadUrl": "1111",
          "updateInfo": "测试",
          "createId": "4a24ae3f83d14f8f8a056a80498785c0",
          "createTime": "2018-10-15 15:43:59",
          "createUser": "李宗豪"
        }
      ],
      "msg": "成功"
    })
  },
  'POST /machine/app/saveHistory': (req, res) => {
    res.send({
      "msg":"成功",
      "data":null,
      "code":0
    })
  },
  'GET /machine/app/appList': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {
          "id": "1",
          "appPackageName": "com.muwood.chainapp",
          "appType": 1,
          "appName": "海莲",
          "appBelong": 2,
          "url": "www.baidu.com"
        },
        {
          "id": "2",
          "appPackageName": "com.detection.inno72.installer",
          "appType": 2,
          "appName": "安装器",
          "appBelong": 1,
          "url": "www.baidu.com"
        },
        {
          "id": "3",
          "appPackageName": "com.detection.inno72.test",
          "appType": 2,
          "appName": "测试程序",
          "appBelong": 1,
          "url": "www.baidu.com"
        }
      ],
      "msg": "成功"
    })
  },
  'GET /project/interact/goods/couponGetList': (req, res) => {
    res.send({
        "code": 0,
        "data": [
          {
            "isCheck": 0,
            "name": "乔治卡罗尔男士洗面奶",
            "id": "db8e8bd2b78448c8a217d813463ab6ce",
            "couponId": ""
          },
          {
            "isCheck": 0,
            "name": "乔治卡罗尔男士洗发水",
            "id": "eb9f0d1d5a264110b404f21cf628c0d6",
            "couponId": ""
          }
        ],
        "msg": "成功"
      }
    )
  },
  'GET /machine/statistics': (req, res) => {
    res.send({
      "code":0,
      "data":[
        {
          "machineCode":"123",
          "point":"点位",
          "date":"2018-10-24",
          "pv":"总访客人数",
          "uv":"独立访客数",
          "order":"订单量",
          "shipment":"出货量",
          "fans":"入会数量",
          "concern":"关注数量"
        },
        {
          "machineCode":"123",
          "point":"点位",
          "date":"2018-10-25",
          "pv":"总访客人数",
          "uv":"独立访客数",
          "order":"订单量",
          "shipment":"出货量",
          "fans":"入会数量",
          "concern":"关注数量"
        },
        {
          "machineCode":"123",
          "point":"点位",
          "date":"2018-10-26",
          "pv":"总访客人数",
          "uv":"独立访客数",
          "order":"订单量",
          "shipment":"出货量",
          "fans":"入会数量",
          "concern":"关注数量"
        },
        {
          "machineCode":"123",
          "point":"点位",
          "date":"2018-10-27",
          "pv":"总访客人数",
          "uv":"独立访客数",
          "order":"订单量",
          "shipment":"出货量",
          "fans":"入会数量",
          "concern":"关注数量"
        }
      ],
      "msg":null})
    },
  'GET /supply/channel/history/dayGoodsCount': (req, res) => {
    res.send({
        "msg": "成功",
        "code": 0,
        "page": {
          "pageSize": 20,
          "currentResult": 0,
          "totalPage": 1,
          "pageNo": 1,
          "totalCount": 5,
          "list": null,
          "firstResult": 0,
          "firstPage": true,
          "lastPage": true,
          "nextPage": 1,
          "prePage": 1
        },
        "data": [
          {
            "batchNo": "06e5ac53d3164119bdbafbd909f25bd6",
            "machineCode": "18884154",
            "localeStr": "北京市北京市东城区王府井大沽口",
            "createTime": "2018-07-25 20:02:04",
            "machineId": "681fd2a6f6c84d40870436fea1854dbd",
            "status": 0,
            "name": null,
            "phone": null,
            "area": null,
            "areaCode": null,
            "beginTime": null,
            "endTime": null,
            "keyword": null,
            "historyList": null
          },
          {
            "batchNo": "77f7fe7b9e7a4f008a321e23cdd4cfdf",
            "machineCode": "18884154",
            "localeStr": "北京市北京市东城区王府井大沽口",
            "createTime": "2018-07-25 19:56:48",
            "machineId": "681fd2a6f6c84d40870436fea1854dbd",
            "status": 0,
            "name": null,
            "phone": null,
            "area": null,
            "areaCode": null,
            "beginTime": null,
            "endTime": null,
            "keyword": null,
            "historyList": null
          },
          {
            "batchNo": "df8437abfb564153bfec25fd93dfd32b",
            "machineCode": "18884154",
            "localeStr": "北京市北京市东城区王府井大沽口",
            "createTime": "2018-07-25 19:19:03",
            "machineId": "681fd2a6f6c84d40870436fea1854dbd",
            "status": 0,
            "name": null,
            "phone": null,
            "area": null,
            "areaCode": null,
            "beginTime": null,
            "endTime": null,
            "keyword": null,
            "historyList": null
          },
          {
            "batchNo": "77",
            "machineCode": null,
            "localeStr": null,
            "createTime": "2018-07-19 11:01:29",
            "machineId": "be9a6ec2e331468b9d04a95a180dedb2",
            "status": 0,
            "name": null,
            "phone": null,
            "area": null,
            "areaCode": null,
            "beginTime": null,
            "endTime": null,
            "keyword": null,
            "historyList": null
          },
          {
            "batchNo": "666",
            "machineCode": null,
            "localeStr": null,
            "createTime": "2018-07-19 11:00:21",
            "machineId": "be9a6ec2e331468b9d04a95a180dedb2",
            "status": 0,
            "name": null,
            "phone": null,
            "area": null,
            "areaCode": null,
            "beginTime": null,
            "endTime": null,
            "keyword": null,
            "historyList": null
          }
        ]
      })
  },
  'GET /supply/channel/history/dayGoodsDetail': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {
          "id": "87e0b8f7d53f48c09123d5142d253707",
          "supplyChannelId": "017de335d3834ad6952750a754d822db",
          "beforeCount": 5,
          "afterCount": 10,
          "batchNo": "06e5ac53d3164119bdbafbd909f25bd6",
          "machineId": "681fd2a6f6c84d40870436fea1854dbd",
          "userId": "",
          "type": 0,
          "createTime": "2018-07-25 20:02:04",
          "machineCode": null,
          "localeStr": "北京市北京市东城区王府井大沽口",
          "subCount": 5,
          "goodsName": "测试商品 别删除"
        }
      ],
      "msg": "成功"
    })
  },
  'GET /supply/channel/history/dayGoodsList': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 5,
        "list": null,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
      },
      "data": [
        {
          "batchNo": "06e5ac53d3164119bdbafbd909f25bd6",
          "machineCode": "18884154",
          "localeStr": "北京市北京市东城区王府井大沽口",
          "createTime": "2018-07-25 20:02:04",
          "machineId": "681fd2a6f6c84d40870436fea1854dbd",
          "status": 0,
          "name": null,
          "phone": null,
          "area": null,
          "areaCode": null,
          "beginTime": null,
          "endTime": null,
          "keyword": null,
          "historyList": null
        },
        {
          "batchNo": "77f7fe7b9e7a4f008a321e23cdd4cfdf",
          "machineCode": "18884154",
          "localeStr": "北京市北京市东城区王府井大沽口",
          "createTime": "2018-07-25 19:56:48",
          "machineId": "681fd2a6f6c84d40870436fea1854dbd",
          "status": 0,
          "name": null,
          "phone": null,
          "area": null,
          "areaCode": null,
          "beginTime": null,
          "endTime": null,
          "keyword": null,
          "historyList": null
        },
        {
          "batchNo": "df8437abfb564153bfec25fd93dfd32b",
          "machineCode": "18884154",
          "localeStr": "北京市北京市东城区王府井大沽口",
          "createTime": "2018-07-25 19:19:03",
          "machineId": "681fd2a6f6c84d40870436fea1854dbd",
          "status": 0,
          "name": null,
          "phone": null,
          "area": null,
          "areaCode": null,
          "beginTime": null,
          "endTime": null,
          "keyword": null,
          "historyList": null
        },
        {
          "batchNo": "77",
          "machineCode": null,
          "localeStr": null,
          "createTime": "2018-07-19 11:01:29",
          "machineId": "be9a6ec2e331468b9d04a95a180dedb2",
          "status": 0,
          "name": null,
          "phone": null,
          "area": null,
          "areaCode": null,
          "beginTime": null,
          "endTime": null,
          "keyword": null,
          "historyList": null
        },
        {
          "batchNo": "666",
          "machineCode": null,
          "localeStr": null,
          "createTime": "2018-07-19 11:00:21",
          "machineId": "be9a6ec2e331468b9d04a95a180dedb2",
          "status": 0,
          "name": null,
          "phone": null,
          "area": null,
          "areaCode": null,
          "beginTime": null,
          "endTime": null,
          "keyword": null,
          "historyList": null
        }
      ]
    })
  }
};

// export default noProxy ? {
//   'POST /authent/(.*)': 'http://nb-merchant-service.huerkang.com/merchant_service/authent/',
// } : delay(proxy, 1000);
export default noProxy ? {
  'POST /authent/(.*)': 'http://nb-merchant-service.huerkang.com/merchant_service/authent/',
} : delay({ ...antProxy,
  ...proxy
}, 1000);
