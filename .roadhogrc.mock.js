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
        functions: [
          {
            id: 'a33',
            functionDepict: '首页',
            functionPath: 'homePage',
            parentId: null,
            functionLevel: 1,
            functionIcon: 'homePage',
          },
          {
            id: 'a1',
            functionDepict: '货机管理',
            functionPath: 'machine',
            parentId: null,
            functionLevel: 1,
            functionIcon: 'machine',
            color: '#ffd322'
          },
          {
            id: 'a2',
            functionDepict: '机器管理',
            functionPath: 'machine-setting',
            parentId: 'a1',
            functionLevel: 2,
          },
          {
            id: 'a4',
            functionDepict: '点位管理',
            functionPath: 'point-setting',
            parentId: 'a1',
            functionLevel: 2,
          },
          {
            id: 'a33',
            functionDepict: '任务管理',
            functionPath: 'task-setting',
            parentId: 'a1',
            functionLevel: 2,
          },
          {
            id: 'a6',
            functionDepict: '项目管理',
            functionPath: 'project',
            parentId: null,
            functionLevel: 1,
            functionIcon: 'project',
          },
          {
            id: 'a7',
            functionDepict: '渠道管理',
            functionPath: 'channel',
            parentId: 'a6',
            functionLevel: 2,
          },
          {
            id: 'a8',
            functionDepict: '商户管理',
            functionPath: 'merchant',
            parentId: 'a6',
            functionLevel: 2,
          },
          {
            id: 'a9',
            functionDepict: '活动管理',
            functionPath: 'activity',
            parentId: 'a6',
            functionLevel: 2,
          },
          {
            id: 'a20',
            functionDepict: '活动排期',
            functionPath: 'schedule',
            parentId: 'a6',
            functionLevel: 2,
          },
          {
            id: 'a10',
            functionDepict: '店铺管理',
            functionPath: 'shop',
            parentId: 'a6',
            functionLevel: 2,
          },
          {
            id: 'a19',
            functionDepict: '游戏管理',
            functionPath: 'game',
            parentId: 'a6',
            functionLevel: 2,
          },
          {
            id: 'a25',
            functionDepict: '商品管理',
            functionPath: 'goods',
            parentId: 'a6',
            functionLevel: 2,
          },
          {
            id: 'a34',
            functionDepict: '机器排期',
            functionPath: 'machinePlan',
            parentId: 'a6',
            functionLevel: 2,
          },
          {
            id: 'a14',
            functionDepict: '系统管理',
            functionPath: 'system',
            parentId: null,
            functionLevel: 1,
            functionIcon: 'system',
            color: '#ff4c72'
          },
          {
            id: 'a15',
            functionDepict: '角色管理',
            functionPath: 'account',
            parentId: 'a14',
            functionLevel: 2,
          },
          {
            id: 'a16',
            functionDepict: '权限管理',
            functionPath: 'jurisdiction',
            parentId: 'a14',
            functionLevel: 2,
          },
          {
            id: 'a17',
            functionDepict: '部门管理',
            functionPath: 'department',
            parentId: 'a14',
            functionLevel: 2,
          },
          {
            id: 'a18',
            functionDepict: '员工管理',
            functionPath: 'staff',
            parentId: 'a14',
            functionLevel: 2,
          },
          {
            id: 'a21',
            functionDepict: '订单管理',
            functionPath: 'order',
            parentId: null,
            functionLevel: 1,
            functionIcon: 'order',
            color: 'green'
          },
          {
            id: 'a22',
            functionDepict: '订单管理',
            functionPath: 'order',
            parentId: 'a21',
            functionLevel: 2,
          },
          {
            id: 'a23',
            functionDepict: '用户管理',
            functionPath: 'player',
            parentId: null,
            functionLevel: 1,
            functionIcon: 'player',
            color: 'yellow'
          },
          {
            id: 'a24',
            functionDepict: '用户管理',
            functionPath: 'user',
            parentId: 'a23',
            functionLevel: 2,
          },
          {
            id: 'a26',
            functionDepict: '巡检管理',
            functionPath: 'check',
            parentId: null,
            functionLevel: 1,
            functionIcon: 'check',
            color: '#174a79'
          },
          {
            id: 'a27',
            functionDepict: '故障单管理',
            functionPath: 'fault',
            parentId: 'a26',
            functionLevel: 2,
          },
          {
            id: 'a28',
            functionDepict: '人员管理',
            functionPath: 'user',
            parentId: 'a26',
            functionLevel: 2,
          },
          {
            id: 'a29',
            functionDepict: '打卡记录',
            functionPath: 'signIn',
            parentId: 'a26',
            functionLevel: 2,
          },
          {
            id: 'a30',
            functionDepict: '故障类型',
            functionPath: 'faultType',
            parentId: 'a26',
            functionLevel: 2,
          },
          {
            id: 'a31',
            functionDepict: '工单管理',
            functionPath: 'workOrder',
            parentId: 'a26',
            functionLevel: 2,
          },
          {
            id: 'a32',
            functionDepict: '补货记录',
            functionPath: 'replenish',
            parentId: 'a26',
            functionLevel: 2,
          },
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
          "id": null,
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
          "machines": null
        },
        {
          "id": null,
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
          "machines": null
        },
        {
          "id": null,
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
          "machines": null
        }
      ]
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
              "startTime": "2018-08-03 00:00:00",
              "endTime": "2018-08-04 23:59:59"
            },
            {
              "startTime": "2018-07-31 00:00:00",
              "endTime": "2018-08-02 23:59:59"
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
              "startTime": "2018-07-25 00:00:00",
              "endTime": "2018-07-29 00:00:59"
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
              "startTime": "2018-07-16 09:00:00",
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
              "startTime": "2018-07-31 00:00:00",
              "endTime": "2018-08-03 23:59:59"
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
  'POST /user/function/area/updateFunctionArea': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {
          "code": "100000000",
          "parentCode": null,
          "name": "北京",
          "province": "北京",
          "city": "",
          "district": null,
          "circle": null,
          "level": 1
        },
        {
          "code": "110000000",
          "parentCode": null,
          "name": "天津",
          "province": "天津",
          "city": "",
          "district": null,
          "circle": null,
          "level": 1
        }
      ],
      "msg": "有重复区域"
    })
  },
  'GET /user/function/area/list': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {
          "id": "186f6f31c39544b5b52e690ec709f41b",
          "userId": "936451df9a7443c3a59102b193e3b7ff",
          "areaCode": "110000000",
          "areaName": "天津",
          "province": "天津",
          "city": "",
          "level": 1,
          "createId": "936451df9a7443c3a59102b193e3b7ff",
          "createTime": "2018-09-05 15:28:41"
        },
        {
          "id": "39655a1b5e8143ae8e645784e54735ad",
          "userId": "936451df9a7443c3a59102b193e3b7ff",
          "areaCode": "100101000",
          "areaName": "东城区",
          "province": "北京",
          "city": "北京市",
          "level": 3,
          "createId": "936451df9a7443c3a59102b193e3b7ff",
          "createTime": "2018-09-05 15:28:41"
        }
      ],
      "msg": "成功"
    })
  },
  'POST /user/function/data/updateFunctionData': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
    })
  },
  'GET /user/function/data/list': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {
          "id": "1",
          "functionDepict": "货机管理-机器管理-机器编号",
          "functionPath": null,
          "parentId": null,
          "voName": "com.inno72.machine.vo.MachineListVo",
          "voColumn": "machineCode",
          "seq": null
        }
      ],
      "msg": "成功"
    })
  },
  'GET /user/function/data/all': (req, res) => {
    res.send({
      "code": 0,
      "data": {
        "functions": null,
        "tree": {
          "title": "机器管理系统",
          "id": "XX",
          "voName": null,
          "column": null,
          "children": [
            {
              "title": "货机管理",
              "id": "1",
              "voName": null,
              "column": null,
              "children": [
                {
                  "title": "机器管理",
                  "id": "2",
                  "voName": null,
                  "column": null,
                  "children": [
                    {
                      "title": "机器编号",
                      "id": "1",
                      "voName": "com.inno72.machine.vo.MachineListVo",
                      "column": "machineCode",
                      "children": null
                    },
                    {
                      "title": "机器点位",
                      "id": "2",
                      "voName": "com.inno72.machine.vo.MachineListVo",
                      "column": "localDesc",
                      "children": null
                    }
                  ]
                },
                {
                  "title": "点位管理",
                  "id": "3",
                  "voName": null,
                  "column": null,
                  "children": []
                },
                {
                  "title": "机器任务",
                  "id": "31",
                  "voName": null,
                  "column": null,
                  "children": []
                }
              ]
            },
            {
              "title": "订单管理",
              "id": "12",
              "voName": null,
              "column": null,
              "children": [
                {
                  "title": "订单管理",
                  "id": "13",
                  "voName": null,
                  "column": null,
                  "children": []
                }
              ]
            },
            {
              "title": "系统管理",
              "id": "15",
              "voName": null,
              "column": null,
              "children": [
                {
                  "title": "员工管理",
                  "id": "16",
                  "voName": null,
                  "column": null,
                  "children": []
                },
                {
                  "title": "部门管理",
                  "id": "17",
                  "voName": null,
                  "column": null,
                  "children": []
                },
                {
                  "title": "权限管理",
                  "id": "18",
                  "voName": null,
                  "column": null,
                  "children": []
                },
                {
                  "title": "角色管理",
                  "id": "19",
                  "voName": null,
                  "column": null,
                  "children": []
                }
              ]
            },
            {
              "title": "用户管理",
              "id": "21",
              "voName": null,
              "column": null,
              "children": [
                {
                  "title": "用户管理",
                  "id": "22",
                  "voName": null,
                  "column": null,
                  "children": []
                }
              ]
            },
            {
              "title": "巡检管理",
              "id": "23",
              "voName": null,
              "column": null,
              "children": [
                {
                  "title": "人员管理",
                  "id": "24",
                  "voName": null,
                  "column": null,
                  "children": []
                },
                {
                  "title": "工单管理",
                  "id": "25",
                  "voName": null,
                  "column": null,
                  "children": []
                },
                {
                  "title": "打卡记录",
                  "id": "26",
                  "voName": null,
                  "column": null,
                  "children": []
                },
                {
                  "title": "故障类型管理",
                  "id": "27",
                  "voName": null,
                  "column": null,
                  "children": []
                },
                {
                  "title": "补货记录",
                  "id": "30",
                  "voName": null,
                  "column": null,
                  "children": []
                }
              ]
            },
            {
              "title": "首页",
              "id": "29",
              "voName": null,
              "column": null,
              "children": []
            },
            {
              "title": "项目管理",
              "id": "4",
              "voName": null,
              "column": null,
              "children": [
                {
                  "title": "游戏管理",
                  "id": "10",
                  "voName": null,
                  "column": null,
                  "children": []
                },
                {
                  "title": "商品管理",
                  "id": "11",
                  "voName": null,
                  "column": null,
                  "children": []
                },
                {
                  "title": "活动排期",
                  "id": "20",
                  "voName": null,
                  "column": null,
                  "children": []
                },
                {
                  "title": "机器排期",
                  "id": "28",
                  "voName": null,
                  "column": null,
                  "children": []
                },
                {
                  "title": "渠道管理",
                  "id": "5",
                  "voName": null,
                  "column": null,
                  "children": []
                },
                {
                  "title": "商户管理",
                  "id": "6",
                  "voName": null,
                  "column": null,
                  "children": []
                },
                {
                  "title": "店铺管理",
                  "id": "7",
                  "voName": null,
                  "column": null,
                  "children": []
                },
                {
                  "title": "活动管理",
                  "id": "8",
                  "voName": null,
                  "column": null,
                  "children": []
                }
              ]
            }
          ]
        }
      },
      "msg": "成功"
    })
  },
  'post /system/user/delete': (req, res) => {
    res.send({
      "code": 0,
      "data": null,
      "msg": "成功"
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
