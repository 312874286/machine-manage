import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { imgMap } from './mock/utils';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';

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
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }]
  }),
  'GET /api/fake_list': getFakeList,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  'POST /api/login/account': (req, res) => {
    const { password, userName, type } = req.body;
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
    res.send({ status: 'ok', currentAuthority: 'user' });
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
  'GET /system/merchant/merchants': (req, res) => {
    res.send(
      {
        "msg": "成功",
        "code": 0,
        "page": {
          "pageSize": 20,
          "currentResult": 0,
          "totalPage": 1,
          "pageNo": 1,
          "totalCount": 8,
          "firstResult": 0,
          "firstPage": true,
          "lastPage": true,
          "nextPage": 2,
          "prePage": 1
        },
        "data": [
          {
            "merchantId": "88f4c5d7b2e64ac5aasd7a4dafb707",
            "merchantName": "文沐晴",
            "merchantPhone": "15213212312",
            "merchantVersion": 2,
            "merchantStatus": 1,
            "organName": "文沐晴",
            "simpleName": "文沐晴",
            "organLogo": "文沐晴",
            "organType": 2,
            "organLevel": 0,
            "organAddress": "文沐晴",
            "organSize": 3,
            "organOwnerName": "文沐晴",
            "organOwnerPhone": "15213212312",
            "organOwnerPapers": "110112212012912312",
            "createTime": "2018-01-25 16:02:32",
            "expireTime": "2018-01-26 02:31-02:40",
            "remark": "绿兔子",
            "adminVO": {},
            "organCertificates": []
          },
          {
            "merchantId": "88f4c5dasde64ac5a5f5f17a4dafb707",
            "merchantName": "文沐晴",
            "merchantPhone": "15213212312",
            "merchantVersion": 2,
            "merchantStatus": 1,
            "organName": "文沐晴",
            "simpleName": "文沐晴",
            "organLogo": "文沐晴",
            "organType": 2,
            "organLevel": 0,
            "organAddress": "文沐晴",
            "organSize": 3,
            "organOwnerName": "文沐晴",
            "organOwnerPhone": "15213212312",
            "organOwnerPapers": "110112212012912312",
            "createTime": "2018-01-25 16:02:32",
            "expireTime": "2018-01-26 02:31-02:40",
            "remark": "绿兔子",
            "adminVO": {},
            "organCertificates": []
          },
          {
            "merchantId": "88f4c5d7b2e64ac5a5f5f17a4dasfb707",
            "merchantName": "文沐晴",
            "merchantPhone": "15213212312",
            "merchantVersion": 2,
            "merchantStatus": 1,
            "organName": "文沐晴",
            "simpleName": "文沐晴",
            "organLogo": "文沐晴",
            "organType": 2,
            "organLevel": 0,
            "organAddress": "文沐晴",
            "organSize": 3,
            "organOwnerName": "文沐晴",
            "organOwnerPhone": "15213212312",
            "organOwnerPapers": "110112212012912312",
            "createTime": "2018-01-25 16:02:32",
            "expireTime": "2018-01-26 02:31-02:40",
            "remark": "绿兔子",
            "adminVO": {},
            "organCertificates": []
          },
          {
            "merchantId": "88f4c5d7b2e64ac5aqwe5f17a4dafb707",
            "merchantName": "文沐晴",
            "merchantPhone": "15213212312",
            "merchantVersion": 2,
            "merchantStatus": 1,
            "organName": "文沐晴",
            "simpleName": "文沐晴",
            "organLogo": "文沐晴",
            "organType": 2,
            "organLevel": 0,
            "organAddress": "文沐晴",
            "organSize": 3,
            "organOwnerName": "文沐晴",
            "organOwnerPhone": "15213212312",
            "organOwnerPapers": "110112212012912312",
            "createTime": "2018-01-25 16:02:32",
            "expireTime": "2018-01-26 02:31-02:40",
            "remark": "绿兔子",
            "adminVO": {},
            "organCertificates": []
          },
          {
            "merchantId": "88f4c5d7b2e64ac5vzxa4dafb707",
            "merchantName": "文沐晴",
            "merchantPhone": "15213212312",
            "merchantVersion": 2,
            "merchantStatus": 1,
            "organName": "文沐晴",
            "simpleName": "文沐晴",
            "organLogo": "文沐晴",
            "organType": 2,
            "organLevel": 0,
            "organAddress": "文沐晴",
            "organSize": 3,
            "organOwnerName": "文沐晴",
            "organOwnerPhone": "15213212312",
            "organOwnerPapers": "110112212012912312",
            "createTime": "2018-01-25 16:02:32",
            "expireTime": "2018-01-26 02:31-02:40",
            "remark": "绿兔子",
            "adminVO": {},
            "organCertificates": []
          },
          {
            "merchantId": "88f4c5d7b2e64ac5ahdfa4dafb707",
            "merchantName": "文沐晴",
            "merchantPhone": "15213212312",
            "merchantVersion": 2,
            "merchantStatus": 1,
            "organName": "文沐晴",
            "simpleName": "文沐晴",
            "organLogo": "文沐晴",
            "organType": 2,
            "organLevel": 0,
            "organAddress": "文沐晴",
            "organSize": 3,
            "organOwnerName": "文沐晴",
            "organOwnerPhone": "15213212312",
            "organOwnerPapers": "110112212012912312",
            "createTime": "2018-01-25 16:02:32",
            "expireTime": "2018-01-26 02:31-02:40",
            "remark": "绿兔子",
            "adminVO": {},
            "organCertificates": []
          },
          {
            "merchantId": "88f4c5d7b2e64ac5a5kuyt17a4dafb707",
            "merchantName": "文沐晴",
            "merchantPhone": "15213212312",
            "merchantVersion": 2,
            "merchantStatus": 1,
            "organName": "文沐晴",
            "simpleName": "文沐晴",
            "organLogo": "文沐晴",
            "organType": 2,
            "organLevel": 0,
            "organAddress": "文沐晴",
            "organSize": 3,
            "organOwnerName": "文沐晴",
            "organOwnerPhone": "15213212312",
            "organOwnerPapers": "110112212012912312",
            "createTime": "2018-01-25 16:02:32",
            "expireTime": "2018-01-26 02:31-02:40",
            "remark": "绿兔子",
            "adminVO": {},
            "organCertificates": []
          },
          {
            "merchantId": "88f4c5d7tyyrew4ac5a5f5f17a4dafb707",
            "merchantName": "文沐晴",
            "merchantPhone": "15213212312",
            "merchantVersion": 2,
            "merchantStatus": 1,
            "organName": "文沐晴",
            "simpleName": "文沐晴",
            "organLogo": "文沐晴",
            "organType": 2,
            "organLevel": 0,
            "organAddress": "文沐晴",
            "organSize": 3,
            "organOwnerName": "文沐晴",
            "organOwnerPhone": "15213212312",
            "organOwnerPapers": "110112212012912312",
            "createTime": "2018-01-25 16:02:32",
            "expireTime": "2018-01-26 02:31-02:40",
            "remark": "绿兔子",
            "adminVO": {},
            "organCertificates": []
          }
        ]
      }
    )
  },
  // GET POST 可省略
  'PUT /system/merchant/*/status': (req, res) => {
    res.send(
      {
        "msg": "成功",
        "code": 0,
      }
    )
  },
  'POST /system/merchant/merchants': (req, res) => {
    res.send({ code: 0, data: '', msg: '成功' });
  },
  'PUT /system/merchant/merchants/*': (req, res) => {
    res.send({ code: 0, data: '', msg: '成功' });
  },
  'GET /system/merchant/merchants/*': (req, res) => {
    res.send({
      code: 0, data: {
        "merchantId": "11111111111",
        "merchantName": "张三",
        "merchantPhone": "1333333",
        "merchantStatus": "123",
        "merchantVersion": "3123",
        "organName": "放大",
        "simpleName": "克劳福德撒",
        "organLogo": "front/imgs/doctor.png",
        "organType": "私立医院",
        "organLevel": "三甲",
        "organAddress": "金坷垃放开了",
        "organSize": "金坷垃发大水",
        "organOwnerName": "范德萨发",
        "organOwnerPhone": "发生发的撒",
        "organOwnerPapers": "发生发的撒",
        "expireTime": "2018-10-10",
        "remark": "范德萨范德萨",
        "organCertificates": ['front/imgs/doctor.png', 'front/imgs/logo.png'],
        "userName": "zhangsan",
        "userMoblie": "13333333333",
        "userEmail": "fds@fds.com",
        "password": "",
      }, msg: '成功'
    });
  },
  'POST /authent/login': (req, res) => {
    const { name, password, auto, type } = req.body;
    if (password === 'admin' && name === 'admin') {
      const data = {
        token: 'sasdnjaoisdjoiasdjaoisd',
        user: {
          userId: 'asdasdasd',
          userName: 'admin',
          userMobile: '15811174709',
          userEmail: 'zhanglonglong@pinwheelmedical.com',
          userType: 0,
          systemAdmin: 1,
          merchantAdmin: 1,
          merchantId: 'asdnoasndasjd',
        },
        functions: [
          {
            functionId: 'a1',
            functionDepict: '货机管理',
            functionPath: 'machine',
            parentId: null,
            functionLevel: 1,
            functionIcon: 'form',
            color: '#ffd322'
          },
          {
            functionId: 'a2',
            functionDepict: '机器管理',
            functionPath: 'machine-setting',
            parentId: 'a1',
            functionLevel: 2,
          },
          {
            functionId: 'a3',
            functionDepict: '货道管理',
            functionPath: 'aisle',
            parentId: 'a1',
            functionLevel: 2,
          },
          {
            functionId: 'a4',
            functionDepict: '点位管理',
            functionPath: 'point-setting',
            parentId: 'a1',
            functionLevel: 2,
          },
          {
            functionId: 'a5',
            functionDepict: '游戏管理',
            functionPath: 'game',
            parentId: null,
            functionLevel: 1,
            functionIcon: 'form',
          },
          {
            functionId: 'a6',
            functionDepict: '项目管理',
            functionPath: 'project',
            parentId: null,
            functionLevel: 1,
            functionIcon: 'form',
          },
          {
            functionId: 'a7',
            functionDepict: '渠道管理',
            functionPath: 'channel',
            parentId: 'a6',
            functionLevel: 2,
            functionIcon: 'form',
          },
          {
            functionId: 'a8',
            functionDepict: '商户管理',
            functionPath: 'merchant',
            parentId: 'a6',
            functionLevel: 2,
            functionIcon: 'form',
          },
          {
            functionId: 'a9',
            functionDepict: '活动管理',
            functionPath: 'activity',
            parentId: 'a6',
            functionLevel: 2,
            functionIcon: 'form',
          },
          {
            functionId: 'a10',
            functionDepict: '店铺管理',
            functionPath: 'shop',
            parentId: 'a6',
            functionLevel: 2,
            functionIcon: 'form',
          },
          {
            functionId: 'a11',
            functionDepict: '商品管理',
            functionPath: 'goods',
            parentId: null,
            functionLevel: 1,
            functionIcon: 'form',
          },
          {
            functionId: 'a12',
            functionDepict: '订单管理',
            functionPath: 'order',
            parentId: null,
            functionLevel: 1,
            functionIcon: 'form',
          },
          {
            functionId: 'a13',
            functionDepict: '用户信息',
            functionPath: 'user',
            parentId: null,
            functionLevel: 1,
            functionIcon: 'form',
          },
          {
            functionId: 'a14',
            functionDepict: '角色权限',
            functionPath: 'authorityManage',
            parentId: null,
            functionLevel: 1,
            functionIcon: 'safety',
            color: '#ff4c72'
          },
          {
            functionId: 'a15',
            functionDepict: '角色管理',
            functionPath: 'account',
            parentId: 'a14',
            functionLevel: 2,
          },
          {
            functionId: 'a16',
            functionDepict: '权限管理',
            functionPath: 'wechat-push1',
            parentId: 'a14',
            functionLevel: 2,
          },
          {
            functionId: 'a17',
            functionDepict: '部门管理',
            functionPath: 'wechat-push2',
            parentId: 'a14',
            functionLevel: 2,
          },
          {
            functionId: 'a18',
            functionDepict: '员工管理',
            functionPath: 'wechat-push3',
            parentId: 'a14',
            functionLevel: 2,
          },
        ]
      };
      res.send({
        type,
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
  'GET /merchants/*/templates/configs': (req, res) => {
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
          "id": "54c14e94420e46968b406aa95c456a35",
          "title": "支付成功",
          "templateCode": null,
          "businessType": "OUTPATION",
          "example": "账单支付成功（{{first.DATA}}）<br />付款金额：300<br />交易单号：2379237623972939232332<br />您已支付成功。{{remark.DATA}}",
          "wechatTemplateId": null,
          "merchantId": "01f255928130429993743e647b848d4e",
          "status": 0,
          "createTime": "2018-01-31 14:37:00",
          "updateTime": "2018-01-31 14:37:00",
          "operator": null
        },
        {
          "id": "65c4ba9e4d454f6eb4400fdd257dba00",
          "title": "医生建议提醒",
          "templateCode": null,
          "businessType": "OUTPATION",
          "example": "账单支付成功（{{first.DATA}}）<br />付款金额：300<br />交易单号：2379237623972939232332<br />您已支付成功。{{remark.DATA}}",
          "wechatTemplateId": null,
          "merchantId": "01f255928130429993743e647b848d4e",
          "status": 0,
          "createTime": "2018-01-31 14:37:00",
          "updateTime": "2018-01-31 14:37:00",
          "operator": null
        },
        {
          "id": "0fddd1d3eab947f786e85f9fa407f99a",
          "title": "订单修改通知",
          "templateCode": null,
          "businessType": "OUTPATION",
          "example": "账单支付成功（{{first.DATA}}）<br />付款金额：300<br />交易单号：2379237623972939232332<br />您已支付成功。{{remark.DATA}}",
          "wechatTemplateId": null,
          "merchantId": "01f255928130429993743e647b848d4e",
          "status": 0,
          "createTime": "2018-01-31 14:37:00",
          "updateTime": "2018-01-31 14:37:00",
          "operator": null
        }
      ]
    });
  },
  'GET /merchants/*/wechats': (req, res) => {
    res.send({
      "code": 0,
      "data": {
        "id": "af80a3df310f455a9e0471efd9639b7c",
        "merchantId": "01f255928130429993743e647b848d4e",
        "merchantCode": null,
        "merchantName": "小风车1",
        "appId": null,
        "secret": null,
        "mchId": null,
        "serviceAddress": null,
        "certKey": null,
        "status": null,
        "payNotify": null,
        "createTime": "",
        "updateTime": ""
      }
    });
  },
  'PUT /merchants/*': (req, res) => {
    res.send({
      "code": 0,
      "data": '',
      "msg": "成功",
    });
  },
  'POST /merchants/*/templates/configs': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "data": '',
    });
  },
  'GET /merchants/*/expertSubjects': (req, res) => {
    res.send({
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 21,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 2,
        "prePage": 1
      },
      "data": [
        {
          "id": "af80a3df310f455a9e0471efd9639b7c",
          "subjectId": "01f255928130429993743e647b848d4e",
          "subjectName": "儿科",
          "updateTime": "2018-01-01",
          "operatorName": "张三",
          "subjectOrder": 1,
          "doctors": [
            {
              "doctorId": "12fds3",
              "doctorName": "李四",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
            {
              "doctorId": "1adfs23",
              "doctorName": "李四五",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
          ],
        },
        {
          "id": "cf80a3df310f455a9e0471ef29639124",
          "subjectId": "01f255928130429993743e647b848542",
          "subjectName": "骨科",
          "updateTime": "2018-01-01",
          "operatorName": "张三",
          "subjectOrder": 1,
          "doctors": [
            {
              "doctorId": "1d23",
              "doctorName": "李四",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
            {
              "doctorId": "123ds",
              "doctorName": "李四五",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
            {
              "doctorId": "1sd23",
              "doctorName": "李四六",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
            {
              "doctorId": "b1s23r",
              "doctorName": "李四七",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
            {
              "doctorId": "b1s2323r",
              "doctorName": "李四七",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
            {
              "doctorId": "b1s2sdf3r",
              "doctorName": "李四七",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
          ],
        },
        {
          "id": "trewewtsdfaf80a3df0f455a9e0471efd9639b7c",
          "subjectId": "atrewtresf255928130429993743e647b848d4e",
          "subjectName": "儿科",
          "updateTime": "2018-01-01",
          "operatorName": "张三",
          "subjectOrder": 1,
          "doctors": [
            {
              "doctorId": "12fds3",
              "doctorName": "李四",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
            {
              "doctorId": "1adfs23",
              "doctorName": "李四五",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
          ],
        },
        {
          "id": "trewsdfaf80a3455a9e0471efd9639b7c",
          "subjectId": "trewtrewasf25592813e647b848d4e",
          "subjectName": "儿科",
          "updateTime": "2018-01-01",
          "operatorName": "张三",
          "subjectOrder": 1,
          "doctors": [
            {
              "doctorId": "12fds3",
              "doctorName": "李四",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
            {
              "doctorId": "1adfs23",
              "doctorName": "李四五",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
          ],
        },
        {
          "id": "shfgdtredsdffaf80a3455a9e0471efd9639b7c",
          "subjectId": "asadsfftretre25592813e647b848d4e",
          "subjectName": "儿科",
          "updateTime": "2018-01-01",
          "operatorName": "张三",
          "subjectOrder": 1,
          "doctors": [
            {
              "doctorId": "12fds3",
              "doctorName": "李四",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
            {
              "doctorId": "1adfs23",
              "doctorName": "李四五",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
          ],
        },
        {
          "id": "afgsdrt80a3df310f455a9e0471efd9639b73",
          "subjectId": "rtwtrew01f255928130429993743e647b848d41",
          "subjectName": "眼科",
          "updateTime": "2018-01-01",
          "operatorName": "张三",
          "subjectOrder": 1,
          "doctors": [
            {
              "doctorId": "1sdf23",
              "doctorName": "李四",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
            {
              "doctorId": "12ds3",
              "doctorName": "李四五",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
          ],
        },
        {
          "id": "sdfafgfds80a3df0f455a9e0471efd9639b7c",
          "subjectId": "asgfdsfdgf255928130429993743e647b848d4e",
          "subjectName": "儿科",
          "updateTime": "2018-01-01",
          "operatorName": "张三",
          "subjectOrder": 1,
          "doctors": [
            {
              "doctorId": "12fds3",
              "doctorName": "李四",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
            {
              "doctorId": "1adfs23",
              "doctorName": "李四五",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
          ],
        },
        {
          "id": "gfdssdfaf80a3455a9e0471efd9639b7c",
          "subjectId": "afdsgsf25592813e647b848d4e",
          "subjectName": "儿科",
          "updateTime": "2018-01-01",
          "operatorName": "张三",
          "subjectOrder": 1,
          "doctors": [
            {
              "doctorId": "12fds3",
              "doctorName": "李四",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
            {
              "doctorId": "1adfs23",
              "doctorName": "李四五",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
          ],
        },
        {
          "id": "sgfdsdsdffaf80a3455a9e0471efd9639b7c",
          "subjectId": "gfsdasadsff25592813e647b848d4e",
          "subjectName": "儿科",
          "updateTime": "2018-01-01",
          "operatorName": "张三",
          "subjectOrder": 1,
          "doctors": [
            {
              "doctorId": "12fds3",
              "doctorName": "李四",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
            {
              "doctorId": "1adfs23",
              "doctorName": "李四五",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
          ],
        },
        {
          "id": "agfdsf80a3df310f455a9e0471efd9639b73",
          "subjectId": "01fgfds255928130429993743e647b848d41",
          "subjectName": "眼科",
          "updateTime": "2018-01-01",
          "operatorName": "张三",
          "subjectOrder": 1,
          "doctors": [
            {
              "doctorId": "1sdf23",
              "doctorName": "李四",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
            {
              "doctorId": "12ds3",
              "doctorName": "李四五",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
          ],
        },
        {
          "id": "sgfdsdfaf80a3df0f455a9e0471efd9639b7c",
          "subjectId": "asf255gfds928130429993743e647b848d4e",
          "subjectName": "儿科",
          "updateTime": "2018-01-01",
          "operatorName": "张三",
          "subjectOrder": 1,
          "doctors": [
            {
              "doctorId": "12fds3",
              "doctorName": "李四",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
            {
              "doctorId": "1adfs23",
              "doctorName": "李四五",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
          ],
        },
        {
          "id": "sdfaf8gfds0a3455a9e0471efd9639b7c",
          "subjectId": "asf2559281gfsdgfds3e647b848d4e",
          "subjectName": "儿科",
          "updateTime": "2018-01-01",
          "operatorName": "张三",
          "subjectOrder": 1,
          "doctors": [
            {
              "doctorId": "12fds3",
              "doctorName": "李四",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
            {
              "doctorId": "1adfs23",
              "doctorName": "李四五",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
          ],
        },
        {
          "id": "sdsdffaf80a3455a9e0471efdgfds9639b7c",
          "subjectId": "asadsff25592813e647b8dfgs48d4e",
          "subjectName": "儿科",
          "updateTime": "2018-01-01",
          "operatorName": "张三",
          "subjectOrder": 1,
          "doctors": [
            {
              "doctorId": "12fds3",
              "doctorName": "李四",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
            {
              "doctorId": "1adfs23",
              "doctorName": "李四五",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
          ],
        },
        {
          "id": "afgfds80a3df310f455a9e0471efd9639b73",
          "subjectId": "01f25592813042999dsfg3743e647b848d41",
          "subjectName": "眼科",
          "updateTime": "2018-01-01",
          "operatorName": "张三",
          "subjectOrder": 1,
          "doctors": [
            {
              "doctorId": "1sdf23",
              "doctorName": "李四",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
            {
              "doctorId": "12ds3",
              "doctorName": "李四五",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
          ],
        },
        {
          "id": "sdf543af80a3df0f455a9e0471efd9639b7c",
          "subjectId": "a356453sf255928130429993743e647b848d4e",
          "subjectName": "儿科",
          "updateTime": "2018-01-01",
          "operatorName": "张三",
          "subjectOrder": 1,
          "doctors": [
            {
              "doctorId": "12fds3",
              "doctorName": "李四",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
            {
              "doctorId": "1adfs23",
              "doctorName": "李四五",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
          ],
        },
        {
          "id": "serydfaf80a3455a9e0471efd9639b7c",
          "subjectId": "asytre32f25592813e647b848d4e",
          "subjectName": "儿科",
          "updateTime": "2018-01-01",
          "operatorName": "张三",
          "subjectOrder": 1,
          "doctors": [
            {
              "doctorId": "12fds3",
              "doctorName": "李四",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
            {
              "doctorId": "1adfs23",
              "doctorName": "李四五",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
          ],
        },
        {
          "id": "sdsdffaf80a3ter455a9e0471efd9639b7c",
          "subjectId": "aertysadsff25592813e647b848d4e",
          "subjectName": "儿科",
          "updateTime": "2018-01-01",
          "operatorName": "张三",
          "subjectOrder": 1,
          "doctors": [
            {
              "doctorId": "12fds3",
              "doctorName": "李四",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
            {
              "doctorId": "1adfs23",
              "doctorName": "李四五",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
          ],
        },
        {
          "id": "af80a3df310f4ret55a9e0471efd9639b73",
          "subjectId": "01f2559281ytre30429993743e647b848d41",
          "subjectName": "眼科",
          "updateTime": "2018-01-01",
          "operatorName": "张三",
          "subjectOrder": 1,
          "doctors": [
            {
              "doctorId": "1sdf23",
              "doctorName": "李四",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
            {
              "doctorId": "12ds3",
              "doctorName": "李四五",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
          ],
        }, {
          "id": "sdfaf80a3df0f455ajytr9e0471efd9639b7c",
          "subjectId": "asf25592813rty0429993743e647b848d4e",
          "subjectName": "儿科",
          "updateTime": "2018-01-01",
          "operatorName": "张三",
          "subjectOrder": 1,
          "doctors": [
            {
              "doctorId": "12fds3",
              "doctorName": "李四",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
            {
              "doctorId": "1adfs23",
              "doctorName": "李四五",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
          ],
        },
        {
          "id": "sdfaf80a3455a9fdase0471efd9639b7c",
          "subjectId": "asf25592813e647b848dczfsda4e",
          "subjectName": "儿科",
          "updateTime": "2018-01-01",
          "operatorName": "张三",
          "subjectOrder": 1,
          "doctors": [
            {
              "doctorId": "12fds3",
              "doctorName": "李四",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
            {
              "doctorId": "1adfs23",
              "doctorName": "李四五",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
          ],
        },
        {
          "id": "sdsdffafzcxv80a3455a9e0471efd9639b7c",
          "subjectId": "asadsff25592813fdsawqre647b848d4e",
          "subjectName": "儿科",
          "updateTime": "2018-01-01",
          "operatorName": "张三",
          "subjectOrder": 1,
          "doctors": [
            {
              "doctorId": "12fds3",
              "doctorName": "李四",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
            {
              "doctorId": "1adfs23",
              "doctorName": "李四五",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
          ],
        },
        {
          "id": "af80a3df310f45sdf5a9e0471efd9639b73",
          "subjectId": "01f255928fdsa23130429993743e647b848d41",
          "subjectName": "眼科",
          "updateTime": "2018-01-01",
          "operatorName": "张三",
          "subjectOrder": 1,
          "doctors": [
            {
              "doctorId": "1sdf23",
              "doctorName": "李四",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
            {
              "doctorId": "12ds3",
              "doctorName": "李四五",
              "doctorOrder": 1,
              "outpatientType": "123",
            },
          ],
        },
      ],
      "msg": '成功',
    });
  },
  'GET /merchants/*/doctors': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {
          "doctorId": "12fdsasdf3",
          "doctorName": "李四",
          "doctorOrder": 1,
          "outpatientType": "123",
        },
        {
          "doctorId": "12dsadsf34334",
          "doctorName": "李四五",
          "doctorOrder": 1,
          "outpatientType": "123",
        },
        {
          "doctorId": "12dsadsf34aadf334",
          "doctorName": "李四五",
          "doctorOrder": 1,
          "outpatientType": "123",
        },
        {
          "doctorId": "fs12adsadsf34aadf334",
          "doctorName": "李四五",
          "doctorOrder": 1,
          "outpatientType": "123",
        }
      ],
      "msg": '成功',
    });
  },
  'DELETE /merchants/*/expertSubjects/*': (req, res) => {
    res.send({
      "code": 0,
      "data": '',
      "msg": '成功',
    });
  },
  'PUT /merchants/*/expertSubjects/*': (req, res) => {
    res.send({
      "code": 0,
      "data": '',
      "msg": '成功',
    });
  },
  'POST /merchants/*/expertSubjects/*': (req, res) => {
    res.send({
      "code": 0,
      "data": '',
      "msg": '成功',
    });
  },
  'POST /merchants/*/expertSubjects': (req, res) => {
    res.send({
      "code": 0,
      "data": '',
      "msg": '成功',
    });
  },
  'GET /merchant/patientOpenidRel/findPatientOpenidRels': (req, res) => {
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
      "data": [
        {
          "id": 579,
          "openId": "oeofgwbsd5Cl2XYD3tYG9956zLMfrk",
          "phone": "18515894141",
          "name": "儿保重构订单用户",
          "nickName": null,
          "headImgUrl": null,
          "identity": "爸爸",
          "createTime": "2017-08-03 16:13:35",
          "status": null,
          "sync": 1,
          "unionid": null,
          "merchantId": "1001"
        }, {
          "id": 749,
          "openId": "oeofgsawb5Cl2XYD3tYG9956zLMfrk",
          "phone": "18515894141",
          "name": "儿保重构订单用户",
          "nickName": null,
          "headImgUrl": null,
          "identity": "爸爸",
          "createTime": "2017-08-03 16:13:35",
          "status": null,
          "sync": 1,
          "unionid": null,
          "merchantId": "1001"
        }, {
          "id": 179,
          "openId": "oeowerfgwb5Cl2XYD3tYG9956zLMfrk",
          "phone": "18515894141",
          "name": "儿保重构订单用户",
          "nickName": null,
          "headImgUrl": null,
          "identity": "爸爸",
          "createTime": "2017-08-03 16:13:35",
          "status": null,
          "sync": 1,
          "unionid": null,
          "merchantId": "1001"
        }, {
          "id": 729,
          "openId": "oeowerfgwb5Cl2XYDd3tYG9956zLMfrk",
          "phone": "18515894141",
          "name": "儿保重构订单用户",
          "nickName": null,
          "headImgUrl": null,
          "identity": "爸爸",
          "createTime": "2017-08-03 16:13:35",
          "status": null,
          "sync": 1,
          "unionid": null,
          "merchantId": "1001"
        },
      ]
    });
  },
  'POST /merchant/patientOpenidRel/save': (req, res) => {
    res.send({
      "code": 0,
      "data": '',
      "msg": '成功',
    });
  },
  'GET /merchant/patient/findPatients': (req, res) => {
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
          "id": 1,
          "username": null,
          "cardNum": null,
          "name": "姜洋",
          "sex": 0,
          "birthday": "2018-01-01",
          "phone": "13920770234",
          "weight": "6.7",
          "via": 1,
          "createTime": "2018-01-01",
          "cardNo": null,
          "userId": null,
          "merchantId": null
        }, {
          "id": 12,
          "username": null,
          "cardNum": null,
          "name": "姜洋",
          "sex": 1,
          "birthday": "2018-01-01",
          "phone": "13920770234",
          "weight": "6.7",
          "via": 1,
          "createTime": "2018-01-01",
          "cardNo": null,
          "userId": null,
          "merchantId": null
        }, {
          "id": 123,
          "username": null,
          "cardNum": null,
          "name": "姜洋",
          "sex": 1,
          "birthday": "2018-01-01",
          "phone": "13920770234",
          "weight": "6.7",
          "via": 1,
          "createTime": "2018-01-01",
          "cardNo": null,
          "userId": null,
          "merchantId": null
        }, {
          "id": 124,
          "username": null,
          "cardNum": null,
          "name": "姜洋",
          "sex": 0,
          "birthday": null,
          "phone": "13920770234",
          "weight": "6.7",
          "via": 1,
          "createTime": 1461348994000,
          "cardNo": null,
          "userId": null,
          "merchantId": null
        }, {
          "id": 125,
          "username": null,
          "cardNum": null,
          "name": "姜洋",
          "sex": 1,
          "birthday": 583426800000,
          "phone": "13920770234",
          "weight": "6.7",
          "via": 1,
          "createTime": 1461348994000,
          "cardNo": null,
          "userId": null,
          "merchantId": null
        },
      ]
    });
  },
  'GET /merchants/*/user/users': (req, res) => {
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
          "userId": 1,
          "userName": "张三",
          "userEmail": "zhangsan@qq.com",
          "userMoblie": "13920770234",
          "userTitle": "医生",
          "userOfficeAddress": "保利国际广场",
          "userDepartment": "骨科",
          "userType": "11110101",
          "systemAdmin": 1,
          "merchantAdmin": 1
        },
        {
          "userId": 12,
          "userName": "张三1",
          "userEmail": "zha2ngsan@qq.com",
          "userMoblie": "13920770234",
          "userTitle": "医生",
          "userOfficeAddress": "保利国际广场",
          "userDepartment": "骨科",
          "userType": "11110101",
          "systemAdmin": 1,
          "merchantAdmin": 0
        },
        {
          "userId": 13,
          "userName": "张三2",
          "userEmail": "zhan3gsan@qq.com",
          "userMoblie": "13920770234",
          "userTitle": "医生",
          "userOfficeAddress": "保利国际广场",
          "userDepartment": "骨科",
          "userType": "11110101",
          "systemAdmin": 1,
          "merchantAdmin": 1
        },
        {
          "userId": 14,
          "userName": "张三3",
          "userEmail": "zhang2san@qq.com",
          "userMoblie": "13920770234",
          "userTitle": "医生",
          "userOfficeAddress": "保利国际广场",
          "userDepartment": "骨科",
          "userType": "11110101",
          "systemAdmin": 1,
          "merchantAdmin": 0
        },
      ]
    });
  },
  'POST /merchants/*/user/users': (req, res) => {
    res.send({
      "code": 0,
      "data": '',
      "msg": '成功',
    });
  },
  'POST /merchant/patient/save': (req, res) => {
    res.send({
      "code": 0,
      "data": '',
      "msg": '成功',
    });
  },
  'GET /merchant/doctor/price/*/queryDoctorPriceList': (req, res) => {
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
          "id": "2342",
          "merchantDoctorId": "fdsadfs",
          "merchantDoctorName": "张三",
          "visitType": "00011",
          "merchantId": "fsdfsda",
          "priceType": 1,
          "price": "200",
          "creater": "李四",
          "outpatientTimeId": "fsa2fda3ad2321",
          "createTime": "2017-04-23",
          "updater": "李四五",
          "updateTime": "2018-02-05",
        }, {
          "id": "23",
          "merchantDoctorId": "fdsadfs",
          "merchantDoctorName": "张三",
          "visitType": "00001",
          "merchantId": "fsdfsda",
          "priceType": 1,
          "price": "200",
          "creater": "李四",
          "outpatientTimeId": "fsa2fda3ad2321",
          "createTime": "2017-04-23",
          "updater": "李四五",
          "updateTime": "2018-02-05",
        }, {
          "id": "23423",
          "merchantDoctorId": "fdsadfs",
          "merchantDoctorName": "张三",
          "visitType": "00011",
          "merchantId": "fsdfsda",
          "priceType": 1,
          "price": "200",
          "creater": "李四",
          "outpatientTimeId": "fsa2fda3ad2321",
          "createTime": "2017-04-23",
          "updater": "李四五",
          "updateTime": "2018-02-05",
        }, {
          "id": "23rkfsd",
          "merchantDoctorId": "fdsadfs",
          "merchantDoctorName": "张三",
          "visitType": "00001",
          "merchantId": "fsdfsda",
          "priceType": 1,
          "price": "200",
          "creater": "李四",
          "outpatientTimeId": "fsa2fda3ad2321",
          "createTime": "2017-04-23",
          "updater": "李四五",
          "updateTime": "2018-02-05",
        },
      ]
    });
  },
  'GET /merchant/doctor/price/*/queryDoctors': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {
          "id": "2",
          "name": "李四",
          "isAdd": 0
        },
        {
          "id": "5",
          "name": "李四",
          "isAdd": 0
        },
        {
          "id": "1",
          "name": "张三",
          "isAdd": 1
        },
        {
          "id": "4",
          "name": "张三3",
          "isAdd": 1
        }
      ],
      "msg": "成功"
    });
  },
  'GET /merchant/doctor/price/*/queryOutpatientTimes': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {
          "id": "b701dfeb168946fabde8ae42c2165615",
          "time": "09:00-12:30",
          "type": 1,
          "startTime": "09:00",
          "endTime": "12:30",
          "isDelete": 0,
          "sort": 1,
          "merchantId": "general"
        },
        {
          "id": "b701dfeb168946fabde8ae42c2165614",
          "time": "12:30-17:30",
          "type": 1,
          "startTime": "12:30",
          "endTime": "17:30",
          "isDelete": 0,
          "sort": 2,
          "merchantId": "general"
        },
        {
          "id": "b701dfeb168946fabde8ae42c2165613",
          "time": "17:30-20:00",
          "type": 1,
          "startTime": "17:30",
          "endTime": "20:00",
          "isDelete": 0,
          "sort": 3,
          "merchantId": "general"
        },
        {
          "id": "b701dfeb168946fabde8ae42c2165612",
          "time": "20:00-22:00",
          "type": 1,
          "startTime": "20:00",
          "endTime": "22:00",
          "isDelete": 0,
          "sort": 4,
          "merchantId": "general"
        },
        {
          "id": "b701dfeb168946fabde8ae42c2165616",
          "time": "22:00-09:00",
          "type": 1,
          "startTime": "22:00",
          "endTime": "09:00",
          "isDelete": 0,
          "sort": 5,
          "merchantId": "general"
        },
        {
          "id": "b701dfeb168946fabde8ae42c2165611",
          "time": "00:00-24:00",
          "type": 2,
          "startTime": "00:00",
          "endTime": "24:00",
          "isDelete": 0,
          "sort": 1,
          "merchantId": "general"
        }
      ],
      "msg": "成功"
    });
  },
  'POST /merchant/doctor/price/*/addOrUpdateDoctorPrice': (req, res) => {
    res.send({
      "code": 0,
      "data": "",
      "msg": "成功"
    });
  },
  'GET /merchant/doctor/price/*/queryDoctorPrice': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {
          "id": "123f305c4c704f7296d92d39bc2512ba",
          "merchantDoctorId": 1,
          "merchantDoctorName": "张三",
          "visitType": "00011",
          "merchantId": "0",
          "priceType": 1,
          "price": 150,
          "outpatientTimeId": "b701dfeb168946fabde8ae42c2165613",
          "creater": "000001",
          "createTime": "2018-01-31 11:13:58",
          "updater": "000001",
          "updateTime": "2018-01-31 11:13:58"
        },
        {
          "id": "4235f8bfff0d4e30a527fa2a68bc776d",
          "merchantDoctorId": 1,
          "merchantDoctorName": "张三",
          "visitType": "00011",
          "merchantId": "0",
          "priceType": 1,
          "price": 50,
          "outpatientTimeId": "b701dfeb168946fabde8ae42c2165611",
          "creater": "000001",
          "createTime": "2018-01-31 11:13:58",
          "updater": "000001",
          "updateTime": "2018-01-31 11:13:58"
        },
        {
          "id": "4640f33fd7aa452288e786646df48ff0",
          "merchantDoctorId": 1,
          "merchantDoctorName": "张三",
          "visitType": "00011",
          "merchantId": "0",
          "priceType": 2,
          "price": 500,
          "outpatientTimeId": "b701dfeb168946fabde8ae42c2165615",
          "creater": "000001",
          "createTime": "2018-01-31 11:13:58",
          "updater": "000001",
          "updateTime": "2018-01-31 11:13:58"
        },
        {
          "id": "669654df92c240cbb10d4c819db89109",
          "merchantDoctorId": 1,
          "merchantDoctorName": "张三",
          "visitType": "00011",
          "merchantId": "0",
          "priceType": 1,
          "price": 100,
          "outpatientTimeId": "b701dfeb168946fabde8ae42c2165612",
          "creater": "000001",
          "createTime": "2018-01-31 11:13:58",
          "updater": "000001",
          "updateTime": "2018-01-31 11:13:58"
        },
        {
          "id": "c69c7cd081ef46ffaf0dd8f8b302a40c",
          "merchantDoctorId": 1,
          "merchantDoctorName": "张三",
          "visitType": "00011",
          "merchantId": "0",
          "priceType": 1,
          "price": 200,
          "outpatientTimeId": "b701dfeb168946fabde8ae42c2165614",
          "creater": "000001",
          "createTime": "2018-01-31 11:13:58",
          "updater": "000001",
          "updateTime": "2018-01-31 11:13:58"
        }
      ],
      "msg": "成功"
    });
  },
  'GET /merchant/doctor/proportion/findDoctorProportions': (req, res) => {
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
          "doctorName": "ww",
          "proportion": "立即单(100%)、预约单(100%)、预约单(100%)、立即单(100%)",
          "doctorId": 1,
          "priceType": "门诊/特约/特约/门诊",
          "updateTime": "2018-01-02",
          "deadline": "2018/01/27-2018/01/27",
          "status": 0
        },
        {
          "doctorName": "ww",
          "proportion": "立即单(100%)、预约单(100%)、预约单(100%)、立即单(100%)",
          "doctorId": 2,
          "priceType": "门诊/特约/特约/门诊",
          "updateTime": "2018-01-03",
          "deadline": "2018/01/27-2018/01/27",
          "status": 0
        }
      ]
    }
    );
  },
  'GET /merchant/doctor/proportion/findDoctorProportion': (req, res) => {
    res.send({
      "code": 0,
      "data": {
        "id": null,
        "doctorId": 1,
        "doctorName": "ww",
        "merchantId": null,
        "status": null,
        "priceType": null,
        "proportion": null,
        "startDate": null,
        "endDate": null,
        "abolishPeople": null,
        "abolishTime": null,
        "creator": null,
        "createTime": null,
        "operator": null,
        "updateTime": null,
        "subDoctorName": "w医生",
        "paasDoctorProportions": [
          {
            "id": "qwewefg3231qw4r4erwrwrt4r21",
            "doctorId": 1,
            "doctorName": "ww",
            "merchantId": "01f255928130429993743e647b848d4e",
            "status": -1,
            "priceType": 2,
            "proportion": 100,
            "startDate": "2018-01-23",
            "endDate": "2018-01-31",
            "abolishPeople": "abc",
            "abolishTime": "2018-01-26 15:52:19",
            "creator": "e",
            "createTime": "2018-01-23 15:15:02",
            "operator": "abc",
            "updateTime": "2018-01-26 15:52:19"
          },
          {
            "id": "qwewefg3231qw4r4erwrwrt4r2e",
            "doctorId": 1,
            "doctorName": "ww",
            "merchantId": "01f255928130429993743e647b848d4e",
            "status": -1,
            "priceType": 1,
            "proportion": 100,
            "startDate": "2018-01-23",
            "endDate": "2018-01-31",
            "abolishPeople": "abc",
            "abolishTime": "2018-01-26 15:52:19",
            "creator": "e",
            "createTime": "2018-01-23 15:15:02",
            "operator": "abc",
            "updateTime": "2018-01-26 15:52:19"
          },
          {
            "id": "073436866f6b4b28bb593b0e68b679fb",
            "doctorId": 1,
            "doctorName": "ww",
            "merchantId": "01f255928130429993743e647b848d4e",
            "status": -1,
            "priceType": 2,
            "proportion": 100,
            "startDate": "2018-01-23",
            "endDate": "2018-01-31",
            "abolishPeople": "abc",
            "abolishTime": "2018-01-26 16:39:29",
            "creator": "abc",
            "createTime": "2018-01-26 16:37:02",
            "operator": "abc",
            "updateTime": "2018-01-26 16:39:29"
          },
          {
            "id": "3c5ccd87529a43b8a61fedcfabd04072",
            "doctorId": 1,
            "doctorName": "ww",
            "merchantId": "01f255928130429993743e647b848d4e",
            "status": -1,
            "priceType": 1,
            "proportion": 100,
            "startDate": "2018-01-23",
            "endDate": "2018-01-31",
            "abolishPeople": "abc",
            "abolishTime": "2018-01-26 16:39:29",
            "creator": "abc",
            "createTime": "2018-01-26 16:37:08",
            "operator": "abc",
            "updateTime": "2018-01-26 16:39:29"
          },
          {
            "id": "70d05fef241143d384dc488fea405c20",
            "doctorId": 1,
            "doctorName": "ww",
            "merchantId": "01f255928130429993743e647b848d4e",
            "status": -1,
            "priceType": 2,
            "proportion": 100,
            "startDate": "2018-01-23",
            "endDate": "2018-01-31",
            "abolishPeople": "abc",
            "abolishTime": "2018-01-26 16:39:29",
            "creator": "abc",
            "createTime": "2018-01-26 16:37:08",
            "operator": "abc",
            "updateTime": "2018-01-26 16:39:29"
          },
          {
            "id": "efbdd03629ac4306adb4d64dd2851032",
            "doctorId": 1,
            "doctorName": "ww",
            "merchantId": "01f255928130429993743e647b848d4e",
            "status": -1,
            "priceType": 1,
            "proportion": 100,
            "startDate": "2018-01-23",
            "endDate": "2018-01-31",
            "abolishPeople": "abc",
            "abolishTime": "2018-01-26 16:39:29",
            "creator": "abc",
            "createTime": "2018-01-26 16:37:02",
            "operator": "abc",
            "updateTime": "2018-01-26 16:39:29"
          },
          {
            "id": "c1fdf7f7177e4b189754bc5523a5e13a",
            "doctorId": 1,
            "doctorName": "ww",
            "merchantId": "01f255928130429993743e647b848d4e",
            "status": -1,
            "priceType": 1,
            "proportion": 50,
            "startDate": "2018-01-23",
            "endDate": "2018-01-31",
            "abolishPeople": "abc",
            "abolishTime": "2018-01-26 16:47:03",
            "creator": "abc",
            "createTime": "2018-01-26 16:40:00",
            "operator": "abc",
            "updateTime": "2018-01-26 16:47:03"
          },
          {
            "id": "e8ec51b391ea4f2e801e4f1c7f32ff64",
            "doctorId": 1,
            "doctorName": "ww",
            "merchantId": "01f255928130429993743e647b848d4e",
            "status": -1,
            "priceType": 2,
            "proportion": 20,
            "startDate": "2018-01-23",
            "endDate": "2018-01-31",
            "abolishPeople": "abc",
            "abolishTime": "2018-01-26 16:47:03",
            "creator": "abc",
            "createTime": "2018-01-26 16:40:00",
            "operator": "abc",
            "updateTime": "2018-01-26 16:47:03"
          },
          {
            "id": "24dbdea5caa5450f828df9cbe4ca3939",
            "doctorId": 1,
            "doctorName": "ww",
            "merchantId": "01f255928130429993743e647b848d4e",
            "status": -1,
            "priceType": 1,
            "proportion": 100,
            "startDate": "2018-01-27",
            "endDate": "2018-01-27",
            "abolishPeople": null,
            "abolishTime": null,
            "creator": "abc",
            "createTime": "2018-01-26 16:54:03",
            "operator": "abc",
            "updateTime": "2018-01-26 16:54:03"
          },
          {
            "id": "490ae1478c434352bf758dc4e3aea7b1",
            "doctorId": 1,
            "doctorName": "ww",
            "merchantId": "01f255928130429993743e647b848d4e",
            "status": -1,
            "priceType": 2,
            "proportion": 100,
            "startDate": "2018-01-27",
            "endDate": "2018-01-27",
            "abolishPeople": null,
            "abolishTime": null,
            "creator": "abc",
            "createTime": "2018-01-26 16:54:03",
            "operator": "abc",
            "updateTime": "2018-01-26 16:54:03"
          },
          {
            "id": "66ce5a8c0d6342b2bc2ee1e156e82c4d",
            "doctorId": 1,
            "doctorName": "ww",
            "merchantId": "01f255928130429993743e647b848d4e",
            "status": -1,
            "priceType": 2,
            "proportion": 100,
            "startDate": "2018-02-04",
            "endDate": "2018-02-05",
            "abolishPeople": "zhangsan",
            "abolishTime": "2018-02-03 15:24:13",
            "creator": "zhangsan",
            "createTime": "2018-02-03 15:21:16",
            "operator": "zhangsan",
            "updateTime": "2018-02-03 15:24:13"
          },
          {
            "id": "31ac7a0b42c5404d93f79cb12fd69e0d",
            "doctorId": 1,
            "doctorName": "ww",
            "merchantId": "01f255928130429993743e647b848d4e",
            "status": -1,
            "priceType": 1,
            "proportion": 100,
            "startDate": "2018-02-04",
            "endDate": "2018-02-05",
            "abolishPeople": "zhangsan",
            "abolishTime": "2018-02-03 15:24:13",
            "creator": "zhangsan",
            "createTime": "2018-02-03 15:21:16",
            "operator": "zhangsan",
            "updateTime": "2018-02-03 15:24:13"
          },
          {
            "id": "6ca89a307a8942fa909e71f557b6efa6",
            "doctorId": 1,
            "doctorName": "ww",
            "merchantId": "01f255928130429993743e647b848d4e",
            "status": 1,
            "priceType": 2,
            "proportion": 100,
            "startDate": "2018-02-06",
            "endDate": "2018-02-07",
            "abolishPeople": null,
            "abolishTime": null,
            "creator": "zhangsan",
            "createTime": "2018-02-03 15:25:49",
            "operator": "zhangsan",
            "updateTime": "2018-02-03 15:25:49"
          },
          {
            "id": "a0c8db8550f946baa7ca38bed59a54d3",
            "doctorId": 1,
            "doctorName": "ww",
            "merchantId": "01f255928130429993743e647b848d4e",
            "status": 1,
            "priceType": 1,
            "proportion": 100,
            "startDate": "2018-02-06",
            "endDate": "2018-02-07",
            "abolishPeople": null,
            "abolishTime": null,
            "creator": "zhangsan",
            "createTime": "2018-02-03 15:25:49",
            "operator": "zhangsan",
            "updateTime": "2018-02-03 15:25:49"
          }
        ]
      },
      "msg": "成功"
    }
    );
  },
  'GET /merchant/doctor/proportion/findDoctors': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {
          "id": 1,
          "doctorName": "有名字吗？",
          "disabled": "0"
        },
        {
          "id": 3,
          "doctorName": "有名字吗？",
          "disabled": "0"
        },
        {
          "id": 4,
          "doctorName": "有名字",
          "disabled": "1"
        }
      ],
      "msg": "成功"
    });
  },
  'POST /merchant/doctor/proportion/saveDoctorProportion': (req, res) => {
    res.send({
      "code": 0,
      "data": "",
      "msg": "成功"
    });
  },
  'POST /merchant/doctor/proportion/abolish': (req, res) => {
    res.send({
      "code": 0,
      "data": "",
      "msg": "成功"
    });
  },
  'GET /paas/order/queryOrders': (req, res) => {
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
          "id": "e0c988e5fe614d71a2eb89b5a72d665b",
          "orderNum": "70181921711101698",
          "userTelno": null,
          "userId": null,
          "performerId": null,
          "performerName": null,
          "doctorId": null,
          "doctorName": "郭洁",
          "goodsPrice": null,
          "orderPrice": 500,
          "discountPrice": null,
          "payPrice": null,
          "payType": null,
          "orderStatus": 8,
          "businessStatus": null,
          "name": "张三三",
          "orderType": 70,
          "orderPid": null,
          "isDel": null,
          "channel": null,
          "holdStatus": null,
          "orderTime": null,
          "payTime": "2018-02-07 14:23:31",
          "finishTime": null,
          "refundTime": null,
          "ext1Price": null,
          "ext2Price": null,
          "ext3Price": null,
          "ext4Price": null,
          "ext5Price": null,
          "ext1Time": null,
          "ext2Time": null,
          "ext3Time": null,
          "ext4Time": null,
          "ext5Time": null,
          "ext1Str": null,
          "ext2Str": null,
          "ext3Str": null,
          "ext4Str": null,
          "ext5Str": null,
          "escortId": null,
          "escortName": null,
          "cityCode": null,
          "cityName": null,
          "statusUpdateTime": null,
          "type": null,
          "reportUpdateTime": null,
          "orderInfoList": null,
          "orderHistoryList": null,
          "orderFileList": null,
          "baby": null,
          "readDoctorId": null,
          "readDoctorName": null,
          "orderTypeMinor": null,
          "whetherAudit": null,
          "outpatientType": null,
          "platform": null,
          "merchantId": null,
          "ext1Time1": "",
          "ext2Time2": ""
        }
      ]
    });
  },
  'GET /paas/order/outpatient/queryOutpatientOrders': (req, res) => {
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
          "id": "e0c988e5fe614d71a2eb89b5a72d665b",
          "orderNum": "70181921711101698",
          "userTelno": null,
          "userId": null,
          "performerId": null,
          "performerName": null,
          "doctorId": null,
          "doctorName": "郭洁",
          "goodsPrice": null,
          "orderPrice": 500,
          "discountPrice": null,
          "payPrice": null,
          "payType": null,
          "orderStatus": 8,
          "businessStatus": null,
          "orderType": null,
          "orderPid": null,
          "isDel": null,
          "channel": null,
          "holdStatus": null,
          "orderTime": null,
          "payTime": "2018-02-07 14:23:31",
          "finishTime": null,
          "refundTime": null,
          "ext1Price": null,
          "ext2Price": null,
          "ext3Price": null,
          "ext4Price": null,
          "ext5Price": null,
          "ext1Time": null,
          "ext2Time": null,
          "ext3Time": null,
          "ext4Time": null,
          "ext5Time": null,
          "ext1Str": null,
          "ext2Str": null,
          "ext3Str": null,
          "ext4Str": null,
          "ext5Str": null,
          "escortId": null,
          "escortName": null,
          "cityCode": null,
          "cityName": null,
          "statusUpdateTime": null,
          "type": null,
          "reportUpdateTime": null,
          "orderInfoList": null,
          "orderHistoryList": null,
          "orderFileList": null,
          "baby": null,
          "readDoctorId": null,
          "readDoctorName": null,
          "orderTypeMinor": null,
          "whetherAudit": null,
          "outpatientType": null,
          "platform": null,
          "merchantId": null,
          "ext1Time1": "",
          "ext2Time2": ""
        }
      ]
    }
    );
  },
  'GET /paas/order/outpatient/queryOutpatientOrder': (req, res) => {
    res.send({
      "code": 0,
      "data":
        {
          "orders":
            {
              "id": "1d528d6edd9842ba9b812a4ed680fac4",
              "orderNum": "71936441802100637",
              "userTelno": "15910805963",
              "userId": "1286",
              "performerId": "9896",
              "performerName": "阮宝宝",
              "doctorId": "3951",
              "doctorName": "五测试医生",
              "goodsPrice": 0.01,
              "orderPrice": 0.01,
              "discountPrice": 0.00,
              "payPrice": 0.01,
              "orderStatus": 8,
              "businessStatus": 1,
              "orderType": 71,
              "orderTime": "2018-02-06 17:18:13",
              "payTime": "2018-02-06 17:18:20",
              "finishTime": "2018-02-06 17:18:51",
              "ext1Time": "2018-02-06 17:18:13",
              "ext1Str": "2018-02-06 17:18:13",
              "ext3Str": "阮总",
              "ext4Str": "96",
              "ext5Str": "8",
              "ext1Time1": "2018-02-06",
              "ext2Time2": ""
            },
          "ordersInfo":
            {},
          "info":
            {
              "id": "46bcf3295ade42f9b9bfa941ff5e1cdd",
              "orderId": "1d528d6edd9842ba9b812a4ed680fac4",
              "orderNum": "71936441802100637",
              "goodsPrice": 0,
              "goodsType": 71,
              "info": "{\"imgs\": [\"http://static.pinwheelmedical.com/front/imgs/logo.png\"], \"remark\": \"\", \"skills\": [\"咽喉\"], \"illness\": \"大夫您好，我的宝宝（女），10月23天，咳嗽有浓痰\", \"doctorAdvice\": \"#营养发育基础检查# |<|>{\\\"combinigs\\\":[{\\\"combinigId\\\":\\\"549eeeded050404aac26b2e25021fed1\\\",\\\"services\\\":[\\\"1d9941e7c0794a378224eeeefd8891a8\\\",\\\"5574cdc64f7340e8a02e017e4075e09a\\\",\\\"1d9941e7c0794a378224eeeefd8891a8\\\",\\\"84469b5b330a4abf9df56b99bf0d78e9\\\",\\\"5ed4e83e54964a43ad759e28a20cda28\\\"]}],\\\"services\\\":[],\\\"sort\\\":[{\\\"goodsId\\\":\\\"549eeeded050404aac26b2e25021fed1\\\",\\\"objectRule\\\":\\\"#\\\",\\\"objectText\\\":\\\"#营养发育基础检查#\\\",\\\"singleGoodsId\\\":[\\\"1d9941e7c0794a378224eeeefd8891a8\\\",\\\"5574cdc64f7340e8a02e017e4075e09a\\\",\\\"1d9941e7c0794a378224eeeefd8891a8\\\",\\\"84469b5b330a4abf9df56b99bf0d78e9\\\",\\\"5ed4e83e54964a43ad759e28a20cda28\\\"],\\\"id\\\":1,\\\"startIndex\\\":0,\\\"type\\\":1}]}\", \"patientHeight\": 96, \"patientWeight\": 8, \"outpatientType\": 1, \"doctorAdviceEnd\": \"#营养发育基础检查# \", \"doctorAdviceTime\": \"2018-02-06 17:18:51\"}",
              "isDel": 0
            },
          "patient":
            {
              "card_num": "01497419841458",
              "birthday": "2017-03-14",
              "create_time": "2017-06-14 13:57:21",
              "phone": "15910805963",
              "sex": 0,
              "id": 9896,
              "name": "阮宝宝",
              "via": 0,
              "userName": "ruanbaobao",
            },
          "times":
            {
              "submitAdviceTime": "2018-02-06 17:18:51",
              "actionTime": "2018-02-06 17:18:26",
              "callbackTime": "2018-02-06 17:18:29",
              "finishTime": "2018-02-06 17:18:51"
            }
        },
      "msg": "成功"
    });
  },
  'POST /paas/order/outpatient/cancel': (req, res) => {
    res.send({
      code: 0,
      msg: '成功',
      data: '',
    });
  },
  'GET /paas/audit/queryOrdersAuditList': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 1,
        "pageNo": 1,
        "totalCount": 1,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1,
        "prePage": 1
      },
      "data": [
        {
          "id": "109",
          "orderId": "c11fecd4da2f4f1c8c1fd7cb54dc5e69",
          "orderNum": "71620911711103028",
          "auditInfo": "22",
          "auditor": "周增宝",
          "auditTime": "2018-02-08 12:27:57",
          "auditStatus": 2,
          "submitTime": "2017-11-30 17:33:49",
          "createTime": "2017-11-30 17:33:49",
          "updateTime": "2018-02-08 12:27:57",
          "type": 1,
          "doctorName": "五测试医生"
        }
      ]
    });
  },
  'GET /paas/audit/queryOrdersAudit': (req, res) => {
    res.send({
      "code": 0,
      "data": {
        "id": "109",
        "orderId": "c11fecd4da2f4f1c8c1fd7cb54dc5e69",
        "orderNum": "71620911711103028",
        "auditInfo": "22",
        "auditor": "周增宝",
        "auditTime": "2018-02-08 12:27:57",
        "auditStatus": 0,
        "submitTime": "2017-11-30 17:33:49",
        "createTime": "2017-11-30 17:33:49",
        "updateTime": "2018-02-08 12:27:57",
        "doctorName": "五测试医生",
        "doctorId": "3951",
        "illness": "大夫您好，我的宝宝（男），5月18天，持续3天",
        "babyName": "测试宝宝1",
        "babySex": "1",
        "babyBirthday": "1998-12-29",
        "doctorAdvice": "gigkkv",
        "fromId": "9895",
        "doctorAdviceTime": "2017-11 - 30 17: 33: 49",
        "patientHeight": "64",
        "patientWeight": "1",
        "imgs": ["http://static.pinwheelmedical.com/front/imgs/doctor.png", "http://static.pinwheelmedical.com/front/imgs/logo.png"],
        "histories": [
          {
            "id": "37070cb1dd064ed09084c0fd16d4b70a",
            "orderId": "c11fecd4da2f4f1c8c1fd7cb54dc5e69",
            "orderNum": "71620911711103028",
            "creatorId": "周增宝",
            "createTime": "2018-02-08 12:27:57",
            "info": "{\"auditInfo\":\"22\",\"doctorName\":\"五测试医生\",\"doctorAdvice\":\"gigkkv\",\"doctorAdviceTime\":\"2017-11 - 30 17: 33: 49\",\"doctorId\":\"3951\",\"auditor\":\"周增宝\",\"time\":\"2018-02 - 08 12: 27: 57\",\"status\":\"驳回\"}",
            "historType": 0
          }
        ]
      },
      "msg": "成功"
    });
  },
  'POST /paas/audit/audit': (req, res) => {
    res.send({
      "code": 0,
      "data": "",
      "msg": "成功"
    });
  },
  'GET /paas/merchant/skill/findMerchantSkills': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {
          "id": "1",
          "firstSkill": "发烧阮rui",
          "creator": "测试",
          "createTime": "2017-11-16 18:51:53",
          "updator": "周增宝",
          "updateTime": "2018-01-10 09:39:36",
          "status": 0,
          "sequence": 1,
          "merchantId": "0",
          "secondSkill": "高烧38℃,低烧24℃,超高没救了，喉咙红、肿、疼，持续72个小时以上，精神/食欲差，吐奶，腹泻至今2~3天"
        },
        {
          "id": "2",
          "firstSkill": "咳嗽呕吐",
          "creator": "测试",
          "createTime": "2017-11-16 18:52:00",
          "updator": "阮书瑞",
          "updateTime": "2018-01-10 09:40:49",
          "status": 0,
          "sequence": 2,
          "merchantId": "0",
          "secondSkill": "百日咳,咳嗽有痰,吐血，阮书瑞1"
        },
        {
          "id": "3",
          "firstSkill": "咳嗽呕吐23",
          "creator": "测试43",
          "createTime": "2017-11-16 18:52:00",
          "updator": "阮书瑞23",
          "updateTime": "2018-01-10 09:40:49",
          "status": 0,
          "sequence": 2,
          "merchantId": "0",
          "secondSkill": "百日咳,咳嗽有痰,吐血，阮书瑞1"
        }
      ],
      "msg": "成功"
    });
  },
  'POST /paas/merchant/skill/del': (req, res) => {
    res.send({
      "code": 0,
      "data": "",
      "msg": "成功"
    });
  },
  'POST /paas/merchant/skill/add': (req, res) => {
    res.send({
      "code": 0,
      "data": "",
      "msg": "成功"
    });
  },
  'POST /paas/merchant/skill/sequence': (req, res) => {
    res.send({
      "code": 0,
      "data": "",
      "msg": "成功"
    });
  },
  'POST /paas/merchant/skill/edit': (req, res) => {
    res.send({
      "code": 0,
      "data": "",
      "msg": "成功"
    });
  },
  'GET /paas/merchant/skill/findMerchantSkill': (req, res) => {
    res.send({
      "code": 0,
      "data": {
        "id": "1",
        "firstSkill": "发烧阮rui",
        "creator": "测试",
        "createTime": "2017-11-16 18:51:53",
        "updator": "周增宝",
        "updateTime": "2018-01-10 09:39:36",
        "status": 0,
        "sequence": 1,
        "merchantId": "0",
        "secondSkill": "高烧38℃,低烧24℃,超高没救了，喉咙红、肿、疼，持续72个小时以上，精神/食欲差，吐奶，腹泻至今2~3天"
      },
      "msg": "成功"
    });
  },
  'GET /merchant/doctor/online/getOutpatientDoctor': (req, res) => {
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
        "prePage": 1,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 1
      },
      "data": [
        {
          "doctorName": "提测-2",
          "doctorId": 3952,
          "onlineStatus": "离线",
          "online": 0,
          "visit_type": "00001",
          "reception": 0,
          "type": "排班",
          "acceptType": "未锁定"
        },
        {
          "doctorName": "提测-3",
          "doctorId": 3912,
          "onlineStatus": "在线",
          "online": 0,
          "visit_type": "00001",
          "reception": 0,
          "type": "排班",
          "acceptType": "未锁定"
        }
      ]
    });
  },
  'POST /merchant/doctor/online/offline': (req, res) => {
    res.send({
      "code": 0,
      "data": "",
      "msg": "成功"
    });
  },
  'GET /merchant/log/findLogs': (req, res) => {
    res.send({
      "code": 0,
      "data": [
        {"createTime": 1},
        {"createTime": 2},
        {"createTime": 3},
        {"createTime": 4},
        {"createTime": 5},
        {"createTime": 6},
        {"createTime": 7},
        {"createTime": 8},
        {"createTime": 9},
        {"createTime": 10},
        {"createTime": 11},
        {"createTime": 12},
        {"createTime": 13},
        {"createTime": 14},
        {"createTime": 15},
        {"createTime": 16},
        {"createTime": 17},
        {"createTime": 18},
        {"createTime": 19},
        {"createTime": 20},
        {"createTime": 21},
      ],
      "msg": "成功",
      "page": {
        "pageSize": 20,
        "currentResult": 0,
        "totalPage": 2,
        "pageNo": 1,
        "totalCount": 22,
        "firstResult": 0,
        "firstPage": true,
        "lastPage": true,
        "nextPage": 2,
        "prePage": 1
      },
    });
  },

  'GET /merchants/*/alarms/configs': (req, res) => {
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
      "data": [
        {
          "id": "a772b919291e4595843dffeef4e18043",
          "alarmName": "立即单接诊超时报警",
          "alarmContent": "【门诊立即单】医生接诊超时报警：用户支付时间：2017-06-05 10:00:00；宝宝姓名：小新；订单号：1234567 ，医生姓名：XXX",
          "alarmRule": "立即单超过用户支付时间1分钟。",
          "businessType": "OUTPATIENT",
          "status": 1,
          "createTime": "2018-02-03 13:39:16",
          "updateTime": "2018-02-05 10:59:15",
          "operator": "小北的商户",
          "merchantId": "49d70f6f0af94a2396be1551bd1dc7fc",
          "alarmPerson": "11,12"
        },
        {
          "id": "06d72d3fed4e428481177f5f563eff56",
          "alarmName": "预约单接诊超时报警",
          "alarmContent": "门诊预约单】医生接诊超时报警：用户支付时间：2017-06-05 10:00:00；宝宝姓名：小新；订单号：1234567 ，医生姓名：XXX",
          "alarmRule": "预约单超过用户支付时间1分钟。",
          "businessType": "OUTPATIENT",
          "status": 2,
          "createTime": "2018-02-03 13:39:16",
          "updateTime": "2018-02-05 10:59:32",
          "operator": "小北的商户",
          "merchantId": "49d70f6f0af94a2396be1551bd1dc7fc",
          "alarmPerson": null
        }
      ]
    });
  },
  'GET /merchants/*/user/users/*/status': (req, res) => {
    res.send({
      "msg": "成功",
      "code": 0,
      "data": [],
    });
  },
  'GET /paas/newGoodsOperation/getGoodsOperations': (req, res) => {
    res.send({"msg":"成功","code":0,"page":{"pageSize":20,"currentResult":0,"totalPage":4,"pageNo":1,"totalCount":72,"firstResult":0,"firstPage":true,"lastPage":false,"nextPage":2,"prePage":1},"data":[{"id":"a81f6323d7cb45db8105b8e19fc76789","operationCode":"CZX1521444302133","operationName":"迪安结果参考","operationDesc":"","operationType":4,"operationTimes":10,"firstOperator":3,"secondOperator":99,"remark":"","created":"2018-03-19 15:25:02","updated":"2018-04-02 16:43:11","status":1,"creater":"阮书瑞","createrId":"5e337d6c2e404af2bb4e4fb6388029be","ext1Int":0,"ext1Txt":""},{"id":"f74c94715db54be5a69ae924b13a1875","operationCode":"CZX1521426453776","operationName":"迪安结果","operationDesc":"测试","operationType":4,"operationTimes":30,"firstOperator":3,"secondOperator":99,"remark":"","created":"2018-03-19 10:27:34","updated":"2018-03-19 10:27:34","status":1,"creater":"阮书瑞","createrId":"5e337d6c2e404af2bb4e4fb6388029be","ext1Int":0,"ext1Txt":""},{"id":"11e59671d92c476d8216fefb81fbb6ce","operationCode":"CZX1503037917775","operationName":"排序规则","operationDesc":"1.排序规则（所有列表页）\n1）操作项管理，增加“创建时间”“最近修改时间”两个字段的展示，位置置于操作之前，默认按照最近修改时间倒序排列。","operationType":1,"operationTimes":36,"firstOperator":6,"secondOperator":2,"remark":"的房贷打啊的房贷返对方答复","created":"2017-08-18 14:31:58","updated":"2017-12-27 12:07:27","status":1,"creater":"李丽","createrId":"c87815e503964ec3b2ecf0ce3e06aed7","ext1Int":1,"ext1Txt":""},{"id":"101575284b29479591b79b536f771385","operationCode":"CZX1514195648359","operationName":"车上家乡测试","operationDesc":"1","operationType":1,"operationTimes":1,"firstOperator":3,"secondOperator":99,"remark":"1","created":"2017-12-25 17:54:08","updated":"2017-12-26 10:34:45","status":1,"creater":"张龙龙","createrId":"dac23fe7614442328ecb902a7dcd356a","ext1Int":1,"ext1Txt":"2"},{"id":"a11fa0e19b7e4c1f8ca06f4958229b04","operationCode":"CZX1514255329171","operationName":"阮书瑞新测试A","operationDesc":"","operationType":2,"operationTimes":10,"firstOperator":3,"secondOperator":99,"remark":"","created":"2017-12-26 10:28:49","updated":"2017-12-26 10:28:49","status":1,"creater":"阮书瑞","createrId":"5e337d6c2e404af2bb4e4fb6388029be","ext1Int":1,"ext1Txt":""},{"id":"155f1d097aaa42d6b2869444e7fd3449","operationCode":"CZX1507518415670","operationName":"龋高危检测操作","operationDesc":"适用范围及人群：\n1.\t适用于婴儿乳牙萌出前口腔环境检查、幼儿体检、学龄前、学龄期、成人、智障儿等所有人群进行龋易感风险进行科学的量化分级。\n2.\t适用年龄：0岁以上。\n不适用人群：服用抗生素3天内，氟化氨银使用一周内，牙周龈下洁治后不要检查\n禁忌症：无。","operationType":1,"operationTimes":10,"firstOperator":3,"secondOperator":99,"remark":"","created":"2017-10-09 11:06:56","updated":"2017-12-26 10:09:23","status":1,"creater":"李丽","createrId":"c87815e503964ec3b2ecf0ce3e06aed7","ext1Int":1,"ext1Txt":""},{"id":"477f2f7bb72f4e329c0006dd1693a158","operationCode":"CZX1507518772092","operationName":"立体视检查操作","operationDesc":"适用范围及人群：\n1.适用于幼儿及儿童双眼立体能力的初步测定；\n2.适用于具有基本固视能力的幼儿及儿童，患者眼球无玻璃体积血、视网膜脱落等造成无法使用光学方法进行测量的疾病。 \n\n不适用人群：\n1.无法固视的人群；\n2.严重屈光间质浑浊的人群。 ","operationType":1,"operationTimes":5,"firstOperator":3,"secondOperator":99,"remark":"","created":"2017-10-09 11:12:52","updated":"2017-12-26 10:09:03","status":1,"creater":"李丽","createrId":"c87815e503964ec3b2ecf0ce3e06aed7","ext1Int":1,"ext1Txt":""},{"id":"818771f969054a81b879557d15dec812","operationCode":"CZX1514252088640","operationName":"阮书瑞新测试","operationDesc":"","operationType":1,"operationTimes":20,"firstOperator":3,"secondOperator":99,"remark":"","created":"2017-12-26 09:34:49","updated":"2017-12-26 10:08:57","status":1,"creater":"阮书瑞","createrId":"5e337d6c2e404af2bb4e4fb6388029be","ext1Int":1,"ext1Txt":""},{"id":"8af051f575d646ef8e5e20ef17c92cfd","operationCode":"CZX1507518444565","operationName":"菌斑染色操作","operationDesc":"适用范围及人群：\n-适用于学龄前期及以上儿童进行菌斑染色。\n-适用年龄：3岁以上。 \n\n不适用人群：\n3岁以下儿童、过敏体质、弱智儿童、感冒发烧、胃病或肠胃不适等发病期间。 \n\n禁忌症：无。 ","operationType":1,"operationTimes":10,"firstOperator":3,"secondOperator":99,"remark":"","created":"2017-10-09 11:07:25","updated":"2017-12-25 17:59:12","status":1,"creater":"李丽","createrId":"c87815e503964ec3b2ecf0ce3e06aed7","ext1Int":0,"ext1Txt":""},{"id":"52aeac8170154e2c9b20272d4b8725e8","operationCode":"CZX1500609309337","operationName":"骨密度检查操作流程","operationDesc":"骨密度检查操作流程","operationType":1,"operationTimes":30,"firstOperator":7,"secondOperator":1,"remark":"1、医生端取消年龄   \n2、家庭医生给用户推荐体检套餐  \n3、医生查看收益  \n4、App端医生认证    \n5、个别医生查看常用列表中的套餐\n\niPhone 6P\tIOS10.3.3\t通过\nmeizu m3 note\tAndroid5.1\t通过","created":"2017-07-21 11:55:09","updated":"2017-12-25 17:59:02","status":1,"creater":"李丽","createrId":"c87815e503964ec3b2ecf0ce3e06aed7","ext1Int":0,"ext1Txt":""},{"id":"46fc206bde8a4a788f6f3b1cf5376601","operationCode":"CZX1507518487129","operationName":"静脉采血","operationDesc":"","operationType":1,"operationTimes":15,"firstOperator":3,"secondOperator":99,"remark":"","created":"2017-10-09 11:08:07","updated":"2017-12-25 17:58:38","status":1,"creater":"李丽","createrId":"c87815e503964ec3b2ecf0ce3e06aed7","ext1Int":0,"ext1Txt":""},{"id":"32d1e690fd6c468d8fee7d791f74bbc6","operationCode":"CZX1503282275751","operationName":"末梢血采集","operationDesc":"","operationType":1,"operationTimes":48,"firstOperator":7,"secondOperator":6,"remark":"2.选择“第一操作人 ”和“第二操作人”时去掉“管理护师”字段值。\n调整范围：列表页，详情页选择下拉列表。","created":"2017-08-21 10:24:36","updated":"2017-12-25 17:58:14","status":1,"creater":"李丽","createrId":"c87815e503964ec3b2ecf0ce3e06aed7","ext1Int":0,"ext1Txt":""},{"id":"0c9a1337006e4d5fb60612e58755859e","operationCode":"CZX1508825737050","operationName":"高新刚测试1","operationDesc":"","operationType":1,"operationTimes":20,"firstOperator":3,"secondOperator":3,"remark":"","created":"2017-10-24 14:15:37","updated":"2017-10-25 15:48:52","status":1,"creater":"高新刚","createrId":"774457fd893344799cdd77d1c146d37f","ext1Int":0},{"id":"168e043175e341da87e5a7e77fe90ac9","operationCode":"CZX1505892458865","operationName":"阮书瑞测试操作项1","operationDesc":"阮书瑞测试操作项1阮书瑞测试操作项1","operationType":1,"operationTimes":10,"firstOperator":3,"secondOperator":7,"remark":"测试","created":"2017-09-20 15:27:39","updated":"2017-10-25 15:48:52","status":1,"creater":"阮书瑞","createrId":"5e337d6c2e404af2bb4e4fb6388029be","ext1Int":0,"ext1Txt":"2"},{"id":"216e96cfc9b44458a9f973635fce67cd","operationCode":"CZX1500618564529","operationName":"范德萨","operationDesc":"","operationType":2,"operationTimes":54,"firstOperator":5,"secondOperator":2,"remark":"","created":"2017-07-21 14:29:25","updated":"2017-10-25 15:48:52","status":1,"creater":"贾久兴","createrId":"7ce1cc4ec8574e20a903992c9984cc2b","ext1Int":0},{"id":"3d17da246b9948d893325800e0dad654","operationCode":"CZX1505892530987","operationName":"阮书瑞测试操作项3-无结果","operationDesc":"阮书瑞测试操作项3-无结果阮书瑞测试操作项3-无结果","operationType":2,"operationTimes":20,"firstOperator":3,"secondOperator":99,"remark":"测试","created":"2017-09-20 15:28:51","updated":"2017-10-25 15:48:52","status":1,"creater":"阮书瑞","createrId":"5e337d6c2e404af2bb4e4fb6388029be","ext1Int":0,"ext1Txt":"3"},{"id":"3def2982b63546aabd25b76512ae2722","operationCode":"CZX1500618465837","operationName":"放假看到啦撒娇","operationDesc":"","operationType":1,"operationTimes":3443,"firstOperator":3,"secondOperator":99,"remark":"","created":"2017-07-21 14:27:46","updated":"2017-10-25 15:48:52","status":1,"creater":"贾久兴","createrId":"7ce1cc4ec8574e20a903992c9984cc2b","ext1Int":0},{"id":"4684d04470e044d3b878ee6e5cfff82e","operationCode":"CZX1505892497580","operationName":"阮书瑞测试操作项2","operationDesc":"阮书瑞测试操作项2阮书瑞测试操作项2","operationType":1,"operationTimes":5,"firstOperator":3,"secondOperator":4,"remark":"测试","created":"2017-09-20 15:28:18","updated":"2017-10-25 15:48:52","status":1,"creater":"阮书瑞","createrId":"5e337d6c2e404af2bb4e4fb6388029be","ext1Int":0,"ext1Txt":"2"},{"id":"4c10c56659f646eaa0b3010e17e08064","operationCode":"CZX1500618476605","operationName":"都是块拉富家大室卡了","operationDesc":"","operationType":1,"operationTimes":543,"firstOperator":3,"secondOperator":99,"remark":"","created":"2017-07-21 14:27:57","updated":"2017-10-25 15:48:52","status":1,"creater":"贾久兴","createrId":"7ce1cc4ec8574e20a903992c9984cc2b","ext1Int":0},{"id":"4d65336937004d928da8083b2948be42","operationCode":"CZX1507518802580","operationName":"牙齿涂敷无结果","operationDesc":"适用范围及人群：\n1.\t适用于学龄前期及以上儿童进行牙齿涂氟预防龋齿。\n2.\t适用年龄：3岁以上。\n不适用人群：3岁以下儿童、过敏体质、弱智儿童、感冒发烧、胃病或肠胃不适等发病期间。\n禁忌症：高氟区忌用。","operationType":2,"operationTimes":16,"firstOperator":3,"secondOperator":99,"remark":"","created":"2017-10-09 11:13:23","updated":"2017-10-25 15:48:52","status":1,"creater":"李丽","createrId":"c87815e503964ec3b2ecf0ce3e06aed7","ext1Int":0,"ext1Txt":""}]});
  },
  'POST /paas/newGoodsOperation/addOrEditGoodsOperation': (req, res) => {
    res.send({"msg":"成功","code":0, "data": ''});
  },
  'GET /paas/newGoodsOperation/getGoodsOperationDetail': (req, res) => {
    res.send({"code":0,"data":{"id":"2fcabbdd22f3421ea4efb0c796f370d1","operationCode":"CZX1524642621141","operationName":"测试","operationDesc":"测试","operationType":4,"operationTimes":32,"firstOperator":3,"secondOperator":99,"remark":"范德萨就","created":"2018-04-25 15:50:21","updated":"2018-04-25 15:50:21","status":1,"creater":"贾久兴","createrId":"7ce1cc4ec8574e20a903992c9984cc2b","ext1Int":0,"ext1Txt":"2","operationContent":"<p>哈哈</p><p>1.复健科</p><p>2.风机房</p>","operationContentSimple":"<p>哈哈</p><p>1.复健科</p><p>2.风机房</p>"},"msg":"成功"});
  },
  'POST /paas/newGoodsOperation/updateGoodsOperationStatus': (req, res) => {
    res.send({"msg":"成功","code":0, "data": ''});
  },
  'GET /paas/newGoodsServiceItem/queryNewGoodsServiceItems': (req, res) => {
    res.send({"msg":"成功","code":0,"page":{"pageSize":20,"currentResult":0,"totalPage":5,"pageNo":1,"totalCount":87,"firstResult":0,"firstPage":true,"lastPage":false,"nextPage":2,"prePage":1},"data":[{"id":"cb31cd83db6d43a89c1d13dc0560efb1","code":"FWX1523861635758","name":"商品比例50","tags":"00000000000000000111","doctorGroupName":"全部","areaId":"110000","price":33.00,"sellState":1,"arrangeState":0,"useType":0,"createTime":"2018-04-16 14:53:56","updateTime":"2018-04-16 14:54:19"},{"id":"d3188686e4e24feda732f8149dbdc57a","code":"FWX1523859226253","name":"商品分成比例90","tags":"00000000000000000001","doctorGroupName":"全部","areaId":"110000","price":43.00,"sellState":1,"arrangeState":0,"useType":0,"createTime":"2018-04-16 14:13:46","updateTime":"2018-04-16 14:14:12"},{"id":"5e44f13570904900a5ee8af0f1ba7da1","code":"FWX1523848319043","name":"商品分成比例80","tags":"00000000000000000001","doctorGroupName":"全部","areaId":"110000","price":500.00,"sellState":1,"arrangeState":0,"useType":0,"createTime":"2018-04-16 11:11:59","updateTime":"2018-04-16 11:12:51"},{"id":"531969ccb20a40d38ce9364501a523b1","code":"FWX1523847785605","name":"营养发育检查70","tags":"00000000000000000001","doctorGroupName":"全部","areaId":"110000","price":100.00,"sellState":1,"arrangeState":0,"useType":0,"createTime":"2018-04-16 11:03:06","updateTime":"2018-04-16 11:12:16"},{"id":"10d9feb0cd1949ddbed6b6eae91e90e1","code":"FWX1514192563606","name":"测试车上加项","tags":"00000000000000000001","doctorGroupName":"全部","areaId":"110000","price":100.00,"sellState":0,"arrangeState":0,"useType":1,"createTime":"2017-12-25 17:02:44","updateTime":"2018-04-13 18:12:28"},{"id":"1ec6c59278f84916a5a034426fb185b4","code":"FWX1521444339935","name":"迪安结果参考","tags":"00000000000000000001","doctorGroupName":"全部","areaId":"110000","price":180.00,"sellState":1,"arrangeState":0,"useType":0,"createTime":"2018-03-19 15:25:40","updateTime":"2018-03-20 09:55:48"},{"id":"d32b7ef8a3fe46eb921f77192a034c7c","code":"FWX1521426495232","name":"迪安结果","tags":"00000000000000000001","doctorGroupName":"全部","areaId":"110000","price":100.00,"sellState":1,"arrangeState":0,"useType":0,"createTime":"2018-03-19 10:28:15","updateTime":"2018-03-19 10:28:37"},{"id":"0d73ec670f8a42cda646617c94b4a17c","code":"FWX1519717075993","name":"防盗防高反","tags":"00000000000000000001","doctorGroupName":"全部","areaId":"110000","price":30.00,"sellState":1,"arrangeState":0,"useType":0,"createTime":"2018-02-27 15:37:56","updateTime":"2018-02-27 15:38:13"},{"id":"45c3165deef2448a8e15470e9a929ad9","code":"FWX1514195575081","name":"车上加像的单项","tags":"00000000000000000001","doctorGroupName":"全部","areaId":"110000","price":120.00,"sellState":1,"arrangeState":0,"useType":1,"createTime":"2017-12-25 17:52:55","updateTime":"2017-12-26 10:36:06"},{"id":"cc08e8e2d56446aca844e7f1a12efce3","code":"FWX1514252057847","name":"护士商品 - ","tags":"00000000000000000001","doctorGroupName":"全部","areaId":"110000","price":100.00,"sellState":1,"arrangeState":1,"useType":1,"createTime":"2017-12-26 09:34:18","updateTime":"2017-12-26 10:32:35"},{"id":"7c7183b1707c4348a87b63925401f4f7","code":"FWX1514252371605","name":"阮书瑞新测试1","tags":"00000000000000000001","doctorGroupName":"全部","areaId":"110000","price":230.00,"sellState":0,"arrangeState":0,"useType":0,"createTime":"2017-12-26 09:39:32","updateTime":"2017-12-26 10:31:39"},{"id":"ad98419321b649c68895198b14d5880e","code":"FWX1507519073099","name":"LEA视力检查（远视力/近视力）","tags":"00000000000000010000","doctorGroupName":"全部","areaId":"110000","price":30.00,"sellState":1,"arrangeState":0,"useType":0,"createTime":"2017-10-09 11:17:53","updateTime":"2017-12-26 09:31:01"},{"id":"4447cca57fa44c35b11d91089a613197","code":"FWX1507520607036","name":"营养发育基础检查","tags":"00000000000000010000","doctorGroupName":"全部","areaId":"110000","price":120.00,"sellState":1,"arrangeState":0,"useType":0,"createTime":"2017-10-09 11:43:27","updateTime":"2017-12-26 09:30:01"},{"id":"0a3f131cd83f45c9adcc8c16d59306e9","code":"FWX1513063825760","name":"无需解读的商品","tags":"00000000000000000001","doctorGroupName":"全部","areaId":"110000","price":30.00,"sellState":1,"arrangeState":0,"useType":0,"createTime":"2017-12-12 15:30:26","updateTime":"2017-12-26 09:28:52"},{"id":"1ef0a8ddefc840a1b5fc99f6e8aab782","code":"FWX1509593010338","name":"肝功十一项（ALT，AST，TBIL，DBIL，IBIL，TP，ALB，GLB，A/G，ALP，GGT）","tags":"00000000001000000000","doctorGroupName":"全部","areaId":"110000","price":100.00,"sellState":1,"arrangeState":0,"useType":0,"createTime":"2017-11-02 11:23:30","updateTime":"2017-12-26 09:28:11"},{"id":"f9d97a75a5784d429ccb24393b32810e","code":"FWX1512700588129","name":"AI","tags":"00000000000000000001","doctorGroupName":"无","areaId":"110000","price":10.00,"sellState":0,"arrangeState":0,"useType":0,"createTime":"2017-12-08 10:36:28","updateTime":"2017-12-08 10:36:44"},{"id":"2033c6bedc764df8ae03548e47cddde6","code":"FWX1510214253642","name":"测试取整","tags":"00000000000000000001","doctorGroupName":"全部","areaId":"110000","price":499.00,"sellState":0,"arrangeState":0,"useType":0,"createTime":"2017-11-09 15:57:34","updateTime":"2017-11-09 18:29:09"},{"id":"034028763a0e4c19a0bd87c0a7002cf4","code":"FWX1507533290619","name":"复现BUG","tags":"00000000000000000001","doctorGroupName":"全部","areaId":"110000","price":500.00,"sellState":1,"arrangeState":0,"useType":0,"createTime":"2017-10-09 15:14:51","updateTime":"2017-11-09 14:50:51"},{"id":"592b70d4919c43e4a2ef35712132012b","code":"FWX1509529895297","name":"康复卡地区关联","tags":"00000000001000000000","doctorGroupName":"全部","areaId":"330100","price":13.00,"sellState":0,"arrangeState":0,"useType":0,"createTime":"2017-11-01 17:51:35","updateTime":"2017-11-01 17:51:35"},{"id":"3530df8fa1b048ab86934316382afe95","code":"FWX1507614565749","name":"护士工作站验收-王占群","tags":"00000000000000001000","doctorGroupName":"全部","areaId":"110000","price":1888.00,"sellState":1,"arrangeState":0,"useType":0,"createTime":"2017-10-10 13:49:26","updateTime":"2017-10-10 13:52:53"}]});
  },
  'GET /paas/newGoodsCommon/getServiceItemTag': (req, res) => {
    res.send({"code":0,"data":[{"id":"b855249859fc478dbc300cebd90af7fb","name":"超声","val":"1","digit":1,"seq":1},{"id":"5e2a3c20cce3434d912bfeb299a41846","name":"临床诊疗","val":"10","digit":2,"seq":2},{"id":"20fa55d49e6641b0b4c5a3923aa1b897","name":"免疫","val":"100","digit":3,"seq":3},{"id":"888fffc8d53c43a89fb138cf043fad21","name":"生化","val":"1000","digit":4,"seq":4},{"id":"1196cf487d774bbf896b1c1b8f98ae66","name":"临检","val":"10000","digit":5,"seq":5},{"id":"c1d2e30825f747ee88b37d7e8ff33f91","name":"口腔","val":"100000","digit":6,"seq":6},{"id":"59548a14a3964a80ad098627b5b25af2","name":"放射","val":"1000000","digit":7,"seq":7},{"id":"b21826326a2845299eb914b328ba7595","name":"视力","val":"10000000","digit":8,"seq":8},{"id":"0ce6c390aba64081a45cf2f21e7ee53a","name":"微生物","val":"100000000","digit":9,"seq":9},{"id":"834cf608a71e447fa8828c2bcb0dc622","name":"基因","val":"1000000000","digit":10,"seq":10},{"id":"834cf608a71e447fa8828c2bcb0dc621","name":"其他","val":"10000000000","digit":11,"seq":11}],"msg":"成功"});
  },
  'GET /paas/newGoodsCommon/getDoctorReportDept': (req, res) => {
    res.send({"code":0,"data":[{"id":1,"name":"儿内","seq":"1"},{"id":2,"name":"新生儿","seq":"2"},{"id":3,"name":"内分泌","seq":"3"},{"id":4,"name":"免疫功能","seq":"4"},{"id":5,"name":"血液","seq":"5"},{"id":6,"name":"视力","seq":"6"},{"id":7,"name":"儿疾","seq":"7"},{"id":8,"name":"超声","seq":"8"},{"id":9,"name":"消化","seq":"9"},{"id":10,"name":"遗传代谢","seq":"10"},{"id":11,"name":"眼科","seq":"11"},{"id":12,"name":"口腔","seq":"12"},{"id":13,"name":"身高管理","seq":"13"},{"id":14,"name":"其他","seq":"14"}],"msg":"成功"});
  },
  'GET /paas/newGoodsCommon/getDoctorGroup': (req, res) => {
    res.send({"code":0,"data":[{"id":164,"groupName":"淘宝5"},{"id":209,"groupName":"测试2"},{"id":291,"groupName":"测试组2"},{"id":317,"groupName":"测试101"},{"id":338,"groupName":"李大哥组"}],"msg":"成功"});
  },
  'POST /fileUpload/upload': (req, res) => {
    res.send({"msg":"成功","code":0, "data": "service/sfdsa.png"});
  },
  'POST /paas/newGoodsServiceItem/addOrUpdateServiceItemBaseInfo': (req, res) => {
    res.send({"msg":"成功","code":0, "data": ""});
  },
  'GET /paas/newGoodsServiceItem/queryNewGoodsServiceItemById': (req, res) => {
    res.send({"code":0,"data":{"sampleType": "血清","ext3Txt": "1", "id":"531969ccb20a40d38ce9364501a523b1","code":"FWX1523847785605","name":"营养发育检查70","info":"dsfdf ","tags":"00000000000000000001","areaId":"110000","examineOrg":1,"doctorDeptId":1,"doctorGroupId":0,"price":100.00,"sellState":1,"arrangeState":0,"operator1":"3","operator2":"99","serviceTime":15,"creator":"c87815e503964ec3b2ecf0ce3e06aed7","updater":"lili","createTime":"2018-04-16 11:03:06","updateTime":"2018-04-16 11:12:16","isDelete":0,"ext1Int":0,"ext2Int":70,"ext2Txt":"[]","operations":[{"id":"125335b8c06a4aa88650331500724e6f","serviceId":"531969ccb20a40d38ce9364501a523b1","operationId":"155f1d097aaa42d6b2869444e7fd3449","order":1,"creator":"c87815e503964ec3b2ecf0ce3e06aed7","createTime":"2018-04-16 11:04:07","operation":{"id":"155f1d097aaa42d6b2869444e7fd3449","operationCode":"CZX1507518415670","operationName":"龋高危检测操作","operationDesc":"适用范围及人群：\n1.\t适用于婴儿乳牙萌出前口腔环境检查、幼儿体检、学龄前、学龄期、成人、智障儿等所有人群进行龋易感风险进行科学的量化分级。\n2.\t适用年龄：0岁以上。\n不适用人群：服用抗生素3天内，氟化氨银使用一周内，牙周龈下洁治后不要检查\n禁忌症：无。","operationType":1,"operationTimes":10,"firstOperator":3,"secondOperator":99,"remark":"","created":"2017-10-09 11:06:56","updated":"2017-12-26 10:09:23","status":1,"creater":"李丽","createrId":"c87815e503964ec3b2ecf0ce3e06aed7","ext1Int":1,"ext1Txt":""}},{"id":"a4039d680dd04d23b836ad9bc4849e52","serviceId":"531969ccb20a40d38ce9364501a523b1","operationId":"477f2f7bb72f4e329c0006dd1693a158","order":2,"creator":"c87815e503964ec3b2ecf0ce3e06aed7","createTime":"2018-04-16 11:04:07","operation":{"id":"477f2f7bb72f4e329c0006dd1693a158","operationCode":"CZX1507518772092","operationName":"立体视检查操作","operationDesc":"适用范围及人群：\n1.适用于幼儿及儿童双眼立体能力的初步测定；\n2.适用于具有基本固视能力的幼儿及儿童，患者眼球无玻璃体积血、视网膜脱落等造成无法使用光学方法进行测量的疾病。 \n\n不适用人群：\n1.无法固视的人群；\n2.严重屈光间质浑浊的人群。 ","operationType":1,"operationTimes":5,"firstOperator":3,"secondOperator":99,"remark":"","created":"2017-10-09 11:12:52","updated":"2017-12-26 10:09:03","status":1,"creater":"李丽","createrId":"c87815e503964ec3b2ecf0ce3e06aed7","ext1Int":1,"ext1Txt":""}}],"itemInfos":[{"id":"2f5f37b41af04b98a837107d23591f0c","name":"service/service-1523847650770.png","serviceId":"531969ccb20a40d38ce9364501a523b1","seq":0,"status":1,"updator":"李丽","updateTime":"2018-04-16 11:12:13","creator":"李丽","createTime":"2018-04-16 11:12:13"}],"doctorGroupName":"全部"},"msg":"成功"});
  },
  'POST /paas/newGoodsServiceItem/updateState': (req, res) => {
    res.send({"msg":"成功","code":0, "data": ""});
  },
  'POST /paas/newGoodsServiceItem/updateServiceItemOperationsInfo': (req, res) => {
    res.send({"msg":"成功","code":0, "data": ""});
  },
  'POST /paas/newGoodsServiceItem/delete': (req, res) => {
    res.send({"msg":"成功","code":0, "data": ""});
  },
  'GET /paas/newGoodsCombinig/getList': (req, res) => {
    res.send({"msg":"成功","code":0,"page":{"pageSize":20,"currentResult":0,"totalPage":2,"pageNo":1,"totalCount":33,"firstResult":0,"firstPage":true,"lastPage":false,"nextPage":2,"prePage":1},"data":[{"id":"dcd2e6ff7fb74b639caaa09b26b860cf","code":"ZHX1523862954239","name":"商品比例","sellState":1,"doctorGroupId":0,"doctorGroupName":"全部","price":676.00,"totalPrice":530.00,"areaId":"110000","createTime":"2018-04-16 15:15:54","updateTime":"2018-04-16 15:16:02"},{"id":"a8d6ea53a69346fc8c0f36e4f2be3d80","code":"ZHX1521444273173","name":"阮阮","sellState":1,"doctorGroupId":0,"doctorGroupName":"全部","price":400.00,"totalPrice":400.00,"areaId":"110000","createTime":"2018-03-19 15:24:33","updateTime":"2018-03-19 15:26:01"},{"id":"1acc9230b2c54086879cf1810893f8b4","code":"ZHX1507520657429","name":"营养发育基础检查","sellState":1,"doctorGroupId":0,"doctorGroupName":"全部","price":2088.80,"totalPrice":2110.00,"areaId":"110000","createTime":"2017-10-09 11:44:17","updateTime":"2017-12-26 09:29:16"},{"id":"b90644507707436ba3bfd2ab4362334f","code":"ZHX1509591497081","name":"多数反对是分","sellState":0,"doctorGroupId":0,"doctorGroupName":"全部","price":747.02,"totalPrice":750.00,"areaId":"110000","createTime":"2017-11-02 10:58:17","updateTime":"2017-12-26 09:29:16"},{"id":"c9d911a2198c462daf720171e0858416","code":"ZHX1509940187433","name":"关联相同的服务项","sellState":1,"doctorGroupId":0,"doctorGroupName":"全部","price":217.02,"totalPrice":220.00,"areaId":"110000","createTime":"2017-11-06 11:49:47","updateTime":"2017-12-26 09:29:16"},{"id":"549eeeded050404aac26b2e25021fed1","code":"ZHX1512457214707","name":"测试阮","sellState":1,"doctorGroupId":0,"doctorGroupName":"全部","price":145.90,"totalPrice":130.00,"areaId":"110000","createTime":"2017-12-05 15:00:15","updateTime":"2017-12-05 15:00:19"},{"id":"7397271f94c5418a883cb352a4488ae1","code":"ZHX1507520499284","name":"视力发育套餐3岁-18岁（3项）","sellState":1,"doctorGroupId":0,"doctorGroupName":"全部","price":110.00,"totalPrice":80.00,"areaId":"110000","createTime":"2017-10-09 11:41:39","updateTime":"2017-10-09 11:41:44"},{"id":"549eeeded050404aac26b2e25021fed2","code":"ZHX1505892681011","name":"吸入过敏源测试","sellState":1,"doctorGroupId":0,"doctorGroupName":"全部","price":145.90,"totalPrice":120.00,"areaId":"110000","createTime":"2017-09-20 15:31:21","updateTime":"2017-09-20 15:37:38"},{"id":"48382ad39ff344a9bad600cfaa341d33","code":"ZHX1505443354080","name":"组合名称很长组合名称很长组合名称很长组合名称很长组合名称很长组合名称很长组合名称很长组合名称很长组合名称很长","sellState":1,"doctorGroupId":0,"doctorGroupName":"全部","price":319.00,"totalPrice":260.00,"areaId":"110000","createTime":"2017-09-15 10:42:34","updateTime":"2017-09-15 10:42:41"},{"id":"fedabcee727047f89cd2c81de85864e6","code":"ZHX1503043723986","name":"血常规检测","sellState":1,"doctorGroupId":209,"doctorGroupName":"测试2","price":3132.00,"totalPrice":2330.00,"areaId":"110000","createTime":"2017-08-18 16:08:44","updateTime":"2017-09-14 09:48:45"},{"id":"be5af76597e7420b80eebdc967fdc856","code":"ZHX1505274498193","name":"官方组合3","sellState":1,"doctorGroupId":0,"doctorGroupName":"全部","price":132.00,"totalPrice":100.00,"areaId":"110000","createTime":"2017-09-13 11:48:18","updateTime":"2017-09-13 11:48:29"},{"id":"db06d49ef57e4d49b6c94d315870a250","code":"ZHX1505207968652","name":"官方组合1","sellState":1,"doctorGroupId":0,"doctorGroupName":"全部","price":90.00,"totalPrice":80.00,"areaId":"110000","createTime":"2017-09-12 17:19:29","updateTime":"2017-09-12 17:37:46"},{"id":"53f3b062b6c241e89129d2135b5442cd","code":"ZHX1505208204761","name":"官方组合2","sellState":1,"doctorGroupId":0,"doctorGroupName":"全部","price":170.00,"totalPrice":150.00,"areaId":"110000","createTime":"2017-09-12 17:23:25","updateTime":"2017-09-12 17:23:28"},{"id":"16c19326d5034658b71319e17ff603c9","code":"ZHX1504853579745","name":"关联连个相同的服务项","sellState":1,"doctorGroupId":0,"doctorGroupName":"全部","price":600.00,"totalPrice":600.00,"areaId":"110000","createTime":"2017-09-08 14:53:00","updateTime":"2017-09-08 14:54:37"},{"id":"250523d347e244889c9e63581811cc50","code":"ZHX1500619348402","name":"组合1","sellState":1,"doctorGroupId":0,"doctorGroupName":"全部","price":1329.00,"totalPrice":1040.00,"areaId":"110000","createTime":"2017-07-21 14:42:28","updateTime":"2017-09-08 13:59:02"},{"id":"3820202465884b50b20a8623fad6ad96","code":"ZHX1500607504416","name":"服务项组合","sellState":0,"doctorGroupId":-1,"doctorGroupName":"无","price":150.00,"totalPrice":127.00,"createTime":"2017-07-21 11:25:04","updateTime":"2017-09-08 13:55:39"},{"id":"21738cc0570f4d6c996394fc8ac1d782","code":"ZHX1500620540500","name":"测试数据哈","sellState":1,"doctorGroupId":151,"doctorGroupName":"八四六三组","price":478.00,"totalPrice":448.00,"createTime":"2017-07-21 15:02:21","updateTime":"2017-09-08 13:55:31"},{"id":"d6d10c0b3a6b4e579baf3b1f65f15d4f","code":"ZHX1500557313831","name":"测试组合","sellState":0,"doctorGroupId":0,"doctorGroupName":"全部","price":488.00,"totalPrice":370.00,"areaId":"110000","createTime":"2017-07-20 21:28:34","updateTime":"2017-09-08 13:53:52"},{"id":"298c59d1d9524fc5a557fe1e758c6bba","code":"ZHX1503299471982","name":"的房贷首付","sellState":1,"doctorGroupId":0,"doctorGroupName":"全部","price":3190.56,"totalPrice":1000.00,"areaId":"110000","createTime":"2017-08-21 15:11:12","updateTime":"2017-09-08 13:43:19"},{"id":"78f9cabb80e84ef8a5a4e864632e73c2","code":"ZHX1503300380549","name":"服务项价格变价","sellState":0,"doctorGroupId":0,"doctorGroupName":"全部","price":2966.00,"totalPrice":2960.00,"areaId":"440300","createTime":"2017-08-21 15:26:21","updateTime":"2017-08-21 15:41:27"}]});
  },
  'POST /paas/newGoodsCombinig/addOrEditRule': (req, res) => {
    res.send({"msg":"成功","code":0, "data": ""});
  },
  'GET /paas/newGoodsCombinig/getDetail': (req, res) => {
    res.send({"code":0,"data":{"id":"b66ae5dfd211478e9027bde01239568d","code":"ZHX1524899286944","name":"名称","info":"简介","doctorGroupId":0,"discount":10,"tags":"00000000001100100010","price":2932.00,"totalPrice":290.00,"sellState":0,"remarks":"备注","status":1,"areaId":"330100","creator":"7ce1cc4ec8574e20a903992c9984cc2b","updater":"7ce1cc4ec8574e20a903992c9984cc2b","createTime":"2018-04-28 15:08:07","updateTime":"2018-04-28 15:08:07","ext1Int":0,"ext2Int":null,"ext3Int":null,"ext1Txt":null,"ext2Txt":null,"ext3Txt":null,"ext1Price":null,"ext2Price":null,"ext1Time":null,"ext2Time":null,"list":[{"id":"cc377a70b06449e6a1e3e805a0c1c8e5","combinigServiceId":"98e52bd92d4c431a97bbf76c9dc7637d","code":"FWX1504778401839","name":"fa","price":32.00,"decodePrice":null,"required":1,"order":0},{"id":"700b3fd17ffb4c9b821db396ea7aee1e","combinigServiceId":"bd1d0701c79d43e99c44e6f86c0c3d9c","code":"FWX1503047707650","name":"口腔检查","price":2900.00,"decodePrice":null,"required":1,"order":1}]},"msg":"成功"});
  },
  'POST /paas/newGoodsCombinig/updateSellState': (req, res) => {
    res.send({"msg":"成功","code":0, "data": ""});
  },
  'POST /paas/newGoodsCombinig/deleteRule': (req, res) => {
    res.send({"msg":"成功","code":0, "data": ""});
  },

  'GET /merchants/*': (req, res) => {
    res.send({
      "code": 0,
      "data": {
        "merchantId": "10010010010010010010",
        "merchantName": "小风车",
        "merchantPhone": 40088888888,
        "merchantVersion": "asdccasdasd",
        "organName": "小风车",
        "simpleName": "小风车",
        "organLogo": "",
        "organType": 0,
        "organLevel": 0,
        "organAddress": "北京 北极 北极星",
        "organSize": 10000,
        "organCertificates": [],
        "organOwnerName": "老徐",
        "organOwnerPhone": 188888888,
        "organOwnerPapers": "100100100100100xx",
        "expireTimePattern": "2020-12-31",
        "remark": "aaasssccc",
        "admin": {
          "userName": "杨智超",
          "userMoblie": 13333333333,
          "userEmail": "yangzhichao@pinwheelmedical.com"
        }
      }
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
        areaName: "河北省唐山市路北区",
        circle: null,
        city: null,
        createId: "",
        createTime: "2018-07-05 11:20:48",
        district: null,
        id: "0be2a58e4e9845f8b4dd55acabaad3f3",
        isDelete: 0,
        mall: "汉光百货45557888",
        manager: "王小二",
        mobile: "15688886666",
        province: null,
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
    res.send({"msg":"成功","code":0, "data": ""});
  },
  'POST /machine/locale/delete': (req, res) => {
    res.send({"msg":"成功","code":0, "data": ""});
  },
  'POST /machine/add': (req, res) => {
    res.send({
      "code": 0,
      "data": '',
      "msg": '成功',
    });
  },
  'GEt /machine/list': (req, res) => {
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
      "data": [
        {
          "id": 5780000000,
          "no": "oeofgwbsd5Cl2XYD3tYG9956zLMfrk",
          "phoneNo": "18515894141",
          "provinceCityAreaTradeArea": ['100100000', '100100000', '100100000', '100100000'],
          "nickName": null,
          "headImgUrl": null,
          "operator": "张三",
          "updatedAt": "2017-08-03 16:13:35",
          "status": 0,
          "shopPlace": 1,
          "unionid": null,
          "merchantId": "1001",
          "tag": "tag1，tag2，tag3"
        }, {
          "id": 5790000000,
          "no": "oeofgwbsd5Cl2XYD3tYG9956zLMfrk",
          "phoneNo": "18515894141",
          "provinceCityAreaTradeArea": ['100100000', '100101000', '100100000', '100100000'],
          "nickName": null,
          "headImgUrl": null,
          "operator": "李四",
          "updatedAt": "2017-08-03 16:13:35",
          "status": 1,
          "shopPlace": 1,
          "unionid": null,
          "merchantId": "1001",
          "tag": "tag4，tag5，tag6"
        }, {
          "id": 5700000000,
          "no": "oeofgwbsd5Cl2XYD3tYG9956zLMfrk",
          "phoneNo": "18515894141",
          "provinceCityAreaTradeArea": ['100100000', '100000000', '100100000', '100100000'],
          "nickName": null,
          "headImgUrl": null,
          "operator": "王五",
          "updatedAt": "2017-08-03 16:13:35",
          "status": 2,
          "shopPlace": 1,
          "unionid": null,
          "merchantId": "1001",
          "tag": "tag7，tag8，tag9"
        }, {
          "id": 1230000000,
          "no": "oeofgwbsd5Cl2XYD3tYG9956zLMfrk",
          "phoneNo": "18515894141",
          "provinceCityAreaTradeArea": ['100100000', '100101001', '100100000', '100100000'],
          "nickName": null,
          "headImgUrl": null,
          "operator": "哈哈",
          "updatedAt": "2017-08-03 16:13:35",
          "status": 3,
          "shopPlace": 1,
          "unionid": null,
          "merchantId": "1001",
          "tag": "tag10，tag12，tag13"
        },
      ]
    });
  },
  'POST /machine/update': (req, res) => {
    res.send({"msg":"成功","code":0, "data": ""});
  },
  'POST /machine/delete': (req, res) => {
    res.send({"msg":"成功","code":0, "data": ""});
  },
  'POST /project/channel/add': (req, res) => {
    res.send({
      "code": 0,
      "data": '',
      "msg": '成功',
    });
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
      "data": [
        {
          channelCode: "108980980980809089",
          channelName: "自供应566789",
          createId: "",
          createTime: "2018-07-05 14:47:09",
          id: "1",
          isDelete: 0,
          updateId: "",
          updateTime: "2018-07-05 14:47:09",
        }
      ]
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
    res.send({"msg":"成功","code":0, "data": ""});
  },
  'POST /project/channel/delete': (req, res) => {
    res.send({"msg":"成功","code":0, "data": ""});
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
    res.send({"msg":"成功","code":0, "data": ""});
  },
  'POST /project/merchant/delete': (req, res) => {
    res.send({"msg":"成功","code":0, "data": ""});
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
      "data": [
        {
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
        }
      ]
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
    res.send({"msg":"成功","code":0, "data": ""});
  },
  'POST /project/shops/delete': (req, res) => {
    res.send({"msg":"成功","code":0, "data": ""});
  },
  'GET /account/getTestList': (req, res) => {
    res.send({"msg":"成功","code":0, "data": [{
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号'
    }, {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号'
    }]})
  },
};

// export default noProxy ? {
//   'POST /authent/(.*)': 'http://nb-merchant-service.huerkang.com/merchant_service/authent/',
// } : delay(proxy, 1000);
export default noProxy ? {
  'POST /authent/(.*)': 'http://nb-merchant-service.huerkang.com/merchant_service/authent/',
} : delay({ ...antProxy, ...proxy }, 1000);
