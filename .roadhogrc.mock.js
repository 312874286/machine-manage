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
        functions: [{
            id: 'a1',
            functionDepict: '货机管理',
            functionPath: 'machine',
            parentId: null,
            functionLevel: 1,
            functionIcon: 'form',
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
            id: 'a3',
            functionDepict: '货道管理',
            functionPath: 'aisle',
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
            id: 'a5',
            functionDepict: '游戏管理',
            functionPath: 'game',
            parentId: null,
            functionLevel: 1,
            functionIcon: 'form',
          },
          {
            id: 'a19',
            functionDepict: '游戏管理',
            functionPath: 'game',
            parentId: 'a5',
            functionLevel: 2,
            functionIcon: 'form',
          },
          {
            id: 'a6',
            functionDepict: '项目管理',
            functionPath: 'project',
            parentId: null,
            functionLevel: 1,
            functionIcon: 'form',
          },
          {
            id: 'a7',
            functionDepict: '渠道管理',
            functionPath: 'channel',
            parentId: 'a6',
            functionLevel: 2,
            functionIcon: 'form',
          },
          {
            id: 'a8',
            functionDepict: '商户管理',
            functionPath: 'merchant',
            parentId: 'a6',
            functionLevel: 2,
            functionIcon: 'form',
          },
          {
            id: 'a9',
            functionDepict: '活动管理',
            functionPath: 'activity',
            parentId: 'a6',
            functionLevel: 2,
            functionIcon: 'form',
          },
          {
            id: 'a20',
            functionDepict: '活动排期',
            functionPath: 'schedule',
            parentId: 'a6',
            functionLevel: 2,
            functionIcon: 'form',
          },
          {
            id: 'a10',
            functionDepict: '店铺管理',
            functionPath: 'shop',
            parentId: 'a6',
            functionLevel: 2,
            functionIcon: 'form',
          },
          {
            id: 'a11',
            functionDepict: '商品管理',
            functionPath: 'goods',
            parentId: null,
            functionLevel: 1,
            functionIcon: 'form',
          },
          {
            id: 'a11',
            functionDepict: '商品管理',
            functionPath: 'goods',
            parentId: null,
            functionLevel: 1,
            functionIcon: 'form',
          },
          {
            id: 'a25',
            functionDepict: '商品管理',
            functionPath: 'goods',
            parentId: null,
            functionLevel: 2,
          },
          {
            id: 'a14',
            functionDepict: '角色权限',
            functionPath: 'authorityManage',
            parentId: null,
            functionLevel: 1,
            functionIcon: 'safety',
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
            functionIcon: 'safety',
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
            functionIcon: 'safety',
            color: 'yellow'
          },
          {
            id: 'a24',
            functionDepict: '用户管理',
            functionPath: 'user',
            parentId: 'a23',
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
          "machineId": "1823951070679",
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
        }
      },
      "msg": "成功"
    });
  },
  'GET /machine/machine/updateInfo': (req, res) => {
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
  'GET /game/game/getList': (req, res) => {
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
        circle: '其他'
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
  'GET /game/game/list': (req, res) => {
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
  'GET /game/game/detail': (req, res) => {
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
  'POST /game/game/update': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "data": ""
    });
  },
  'POST /game/game/delete': (req, res) => {
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
  'GET /goods/goods/list': (req, res) => {
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
          "functionIcon": "form",
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
  'GET /game/user/list': (req, res) => {
    res.send({"msg":"成功","code":0,"page":{"pageSize":20,"currentResult":0,"totalPage":1,"pageNo":1,"totalCount":1,"list":null,"firstResult":0,"firstPage":true,"lastPage":true,"nextPage":1,"prePage":1},"data":[{"id":"ddddddd","userNick":"大姐姐","phone":"13454345656","gameUserId":"hjkjhghjkhjk","channelId":"hjjkklllll","channelName":"到年底","channelUserKey":"nnnmm","createTime":1531477140000}]})
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
