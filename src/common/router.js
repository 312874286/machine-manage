import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) => (
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  })
);

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () => models.filter(
      model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user/login'], () => import('../layouts/BasicLayout')),
    },
    // '/result/success': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
    // },
    // '/result/fail': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
    // },
    // '/exception/403': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    // },
    // '/exception/404': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    // },
    // '/exception/500': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    // },
    // '/exception/trigger': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Exception/triggerException')),
    // },
    '/homePage/index': {
      component: dynamicWrapper(app, ['homePage/homePageSetting', 'log/log', 'common'], () => import('../routes/HomePage/HomePage')),
    },
    '/offline': {
      component: dynamicWrapper(app, ['homePage/homePageSetting', 'log/log', 'common'], () => import('../routes/HomePage/OffLine')),
    },
    '/stockOut': {
      component: dynamicWrapper(app, ['homePage/homePageSetting', 'log/log', 'common'], () => import('../routes/HomePage/StockOut')),
    },
    '/lock': {
      component: dynamicWrapper(app, ['homePage/homePageSetting', 'log/log', 'common'], () => import('../routes/HomePage/Lock')),
    },
    '/flowWarn': {
      component: dynamicWrapper(app, ['homePage/homePageSetting', 'log/log', 'common'], () => import('../routes/HomePage/FlowWarn')),
    },
    '/RAMWarn': {
      component: dynamicWrapper(app, ['homePage/homePageSetting', 'log/log', 'common'], () => import('../routes/HomePage/RAMWarn')),
    },
    '/paiActivity': {
      component: dynamicWrapper(app, ['homePage/homePageSetting', 'log/log', 'common'], () => import('../routes/HomePage/PaiActivity')),
    },
    '/unusual': {
      component: dynamicWrapper(app, ['homePage/homePageSetting', 'log/log', 'common'], () => import('../routes/HomePage/Unusual')),
    },
    '/trouble': {
      component: dynamicWrapper(app, ['homePage/homePageSetting', 'log/log', 'common'], () => import('../routes/HomePage/Trouble')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['user/login'], () => import('../routes/User/Login')),
    },
    // '/user/register': {
    //   component: dynamicWrapper(app, ['user/register'], () => import('../routes/User/Register')),
    // },
    // '/user/register-result': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    // },
    // '/user/reset-password': {
    //   component: dynamicWrapper(app, ['user/login'], () => import('../routes/User/ResetPassword')),
    // },
    // '/user/reset-password-result/:account': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/ResetPasswordResult')),
    // },
    // '/user/do-reset-password': {
    //   component: dynamicWrapper(app, ['user/login'], () => import('../routes/User/DoResetPassword')),
    // },
    // '/user/do-reset-password-result': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/DoResetPasswordResult')),
    // },
    // '/user/password/reset': {
    //   component: dynamicWrapper(app, ['user/login'], () => import('../routes/User/ResetPasswordHandle')),
    // },
    // '/setting/wechat-push': {
    //   component: dynamicWrapper(app, ['settings/wechatPush', 'log/log'], () => import('../routes/Setting/WechatPush')),
    // },
    // '/setting/wechat-relation': {
    //   component: dynamicWrapper(app, ['settings/wechatRelation'], () => import('../routes/Setting/WechatRelation')),
    // },
    // '/setting/merchants-basic': {
    //   component: dynamicWrapper(app, ['settings/merchantsBasic'], () => import('../routes/Setting/MerchantsBasic')),
    // },
    // '/setting/doctor-wall': {
    //   component: dynamicWrapper(app, ['settings/doctorWall'], () => import('../routes/Setting/DoctorWall')),
    // },
    // '/setting/account': {
    //   component: dynamicWrapper(app, ['settings/account'], () => import('../routes/Setting/Account')),
    // },
    // '/setting/role': {
    //   component: dynamicWrapper(app, ['settings/account'], () => import('../routes/Setting/Roles')),
    // },
    // '/setting/alert-manage': {
    //   component: dynamicWrapper(app, ['settings/alertManage', 'log/log'], () => import('../routes/Setting/AlertManage')),
    // },
    // '/setting/data/doctor-skill-manage': {
    //   component: dynamicWrapper(app, ['settings/doctorSkillManage'], () => import('../routes/Setting/DoctorSkillManage')),
    // },
    // '/setting/data/doctor-config-manage': {
    //   component: dynamicWrapper(app, ['settings/doctorConfigManage'], () => import('../routes/Setting/DoctorConfigManage')),
    // },
    // '/setting/disease': {
    //   component: dynamicWrapper(app, ['settings/disease'], () => import('../routes/Setting/Disease')),
    // },
    // '/pointLocationManage/users': {
    //   component: dynamicWrapper(app, ['customer/users', 'log/log'], () => import('../routes/Customer/Users')),
    // },
    // '/authorityManage/index': {
    //   component: dynamicWrapper(app, ['authorityManage', 'log/log', 'common'], () => import('../routes/pointLocationManage/Index')),
    // },
    '/machine/point-setting': {
      component: dynamicWrapper(app, ['machine/pointSetting', 'log/log', 'common'], () => import('../routes/Machine/PointSetting')),
    },
    '/machine/machine-setting': {
      component: dynamicWrapper(app, ['machine/machineSetting', 'log/log', 'common'], () => import('../routes/Machine/MachineSetting')),
    },
    '/machine/label-setting': {
      component: dynamicWrapper(app, ['machine/labelSetting', 'log/log', 'common'], () => import('../routes/Machine/LabelSetting')),
    },
    '/machine/area-setting': {
      component: dynamicWrapper(app, ['machine/areaSetting', 'log/log', 'common'], () => import('../routes/Machine/AreaSetting')),
    },
    '/machine/task-setting': {
      component: dynamicWrapper(app, ['machine/taskSetting', 'log/log', 'common'], () => import('../routes/Machine/TaskSetting')),
    },
    '/machine/version-setting': {
      component: dynamicWrapper(app, ['machine/versionSetting', 'log/log', 'common'], () => import('../routes/Machine/VersionSetting')),
    },
    '/machine/batch-setting': {
      component: dynamicWrapper(app, ['machine/batchSetting', 'log/log', 'common'], () => import('../routes/Machine/BatchSetting')),
    },
    '/machine/machineDataStatistics': {
      component: dynamicWrapper(app, ['machine/machineDataStatistics', 'log/log', 'common'], () => import('../routes/Machine/MachineDataStatistics')),
    },
    '/machine/enterTime-detail': {
      component: dynamicWrapper(app, ['machine/enterTimeDetail', 'log/log', 'common'], () => import('../routes/Machine/EnterTimeDetail')),
    },
    '/machine/app-version': {
      component: dynamicWrapper(app, ['machine/appVersion', 'log/log', 'common'], () => import('../routes/Machine/AppVersion')),
    },
    '/machine/flow-monitor': {
      component: dynamicWrapper(app, ['machine/flowMonitoring', 'log/log', 'common'], () => import('../routes/Machine/FlowMonitoring')),
    },
    '/project/channel': {
      component: dynamicWrapper(app, ['project/channelSetting', 'log/log'], () => import('../routes/Project/ChannelSetting')),
    },
    '/project/merchant': {
      component: dynamicWrapper(app, ['project/merchantSetting', 'log/log'], () => import('../routes/Project/MerchantSetting')),
    },
    '/project/shop': {
      component: dynamicWrapper(app, ['project/shopSetting', 'log/log'], () => import('../routes/Project/ShopSetting')),
    },
    '/project/activity': {
      component: dynamicWrapper(app, ['project/activitySetting', 'log/log'], () => import('../routes/Project/ActivitySetting')),
    },
    '/project/schedule': {
      component: dynamicWrapper(app, ['project/scheduleSetting', 'log/log'], () => import('../routes/Project/ScheduleSetting')),
    },
    '/project/sampling-setting': {
      component: dynamicWrapper(app, ['project/interactSamplingSetting', 'log/log'], () => import('../routes/Project/InteractSamplingSetting')),
    },
    '/project/addBasicInteractSampling/:id?': {
      component: dynamicWrapper(app, ['project/interactSamplingSetting', 'log/log'], () => import('../routes/Project/InteractSamplingSteps/BasicInteractSampling.js')),
    },
    '/project/addMerchantGoodsInteractSampling/:id': {
      component: dynamicWrapper(app, ['project/interactSamplingSetting', 'log/log'], () => import('../routes/Project/InteractSamplingSteps/MerchantGoodsInteractSampling.js')),
    },
    '/project/addMachineInteractSampling/:id': {
      component: dynamicWrapper(app, ['project/interactSamplingSetting', 'log/log'], () => import('../routes/Project/InteractSamplingSteps/MachineInteractSampling.js')),
    },
    '/project/addRuleInteractSampling/:id': {
      component: dynamicWrapper(app, ['project/interactSamplingSetting', 'log/log'], () => import('../routes/Project/InteractSamplingSteps/RuleInteractSampling.js')),
    },
    '/project/game': {
      component: dynamicWrapper(app, ['project/gameSetting', 'log/log'], () => import('../routes/Project/GameSetting')),
    },
    '/project/goods': {
      component: dynamicWrapper(app, ['project/goodsSetting', 'log/log', 'common'], () => import('../routes/Project/GoodsSetting')),
    },
    '/project/machinePlan': {
      component: dynamicWrapper(app, ['project/machinePlanSetting', 'log/log', 'common'], () => import('../routes/Project/machinePlanSetting')),
    },
    '/order/order': {
      component: dynamicWrapper(app, ['order/order', 'log/log', 'common'], () => import('../routes/Order/Order')),
    },
    '/order/commodityStatistics': {
      component: dynamicWrapper(app, ['order/commodityStatistics', 'log/log', 'common'], () => import('../routes/Order/CommodityStatisticsSetting')),
    },
    '/check/user': {
      component: dynamicWrapper(app, ['polling/user', 'log/log', 'common'], () => import('../routes/Polling/User')),
    },
    '/check/signIn': {
      component: dynamicWrapper(app, ['polling/signInRecord', 'log/log', 'common'], () => import('../routes/Polling/SignInRecord')),
    },
    '/check/fault': {
      component: dynamicWrapper(app, ['polling/troubleBill', 'log/log', 'common'], () => import('../routes/Polling/TroubleBill')),
    },
    '/check/faultType': {
      component: dynamicWrapper(app, ['polling/faultType', 'log/log', 'common'], () => import('../routes/Polling/FaultType')),
    },
    '/check/workOrder': {
      component: dynamicWrapper(app, ['polling/user', 'log/log', 'common'], () => import('../routes/Polling/WorkOrder')),
    },
    '/check/replenish': {
      component: dynamicWrapper(app, ['polling/replenish', 'log/log', 'common'], () => import('../routes/Polling/Replenish')),
    },
    '/merchant/merchant': {
      component: dynamicWrapper(app, ['merchant/merchant', 'log/log'], () => import('../routes/Merchant/Merchant')),
    },
    '/merchant/shop': {
      component: dynamicWrapper(app, ['merchant/shop', 'log/log', 'common'], () => import('../routes/Merchant/Shop')),
    },
    // '/channelManage/index': {
    //   component: dynamicWrapper(app, ['pointLocationManage', 'log/log', 'common'], () => import('../routes/pointLocationManage/Index')),
    // },
    // '/merchantManage/index': {
    //   component: dynamicWrapper(app, ['pointLocationManage', 'log/log', 'common'], () => import('../routes/pointLocationManage/Index')),
    // },
    // '/activityManage/index': {
    //   component: dynamicWrapper(app, ['pointLocationManage', 'log/log', 'common'], () => import('../routes/pointLocationManage/Index')),
    // },
    // '/gameManage/index': {
    //   component: dynamicWrapper(app, ['pointLocationManage', 'log/log', 'common'], () => import('../routes/pointLocationManage/Index')),
    // },
    // '/goodsManage/index': {
    //   component: dynamicWrapper(app, ['pointLocationManage', 'log/log', 'common'], () => import('../routes/pointLocationManage/Index')),
    // },
    // '/userManage/index': {
    //   component: dynamicWrapper(app, ['pointLocationManage', 'log/log', 'common'], () => import('../routes/pointLocationManage/Index')),
    // },
    // '/orderManage/index': {
    //   component: dynamicWrapper(app, ['pointLocationManage', 'log/log', 'common'], () => import('../routes/pointLocationManage/Index')),
    // },
    // '/aisleManage/index': {
    //   component: dynamicWrapper(app, ['pointLocationManage', 'log/log', 'common'], () => import('../routes/pointLocationManage/Index')),
    // },
    // '/customer/record': {
    //   component: dynamicWrapper(app, ['customer/record', 'log/log'], () => import('../routes/Customer/Record')),
    // },
    // '/doctor/list': {
    //   component: dynamicWrapper(app, ['doctor/doctorList'], () => import('../routes/Doctor/DoctorList')),
    // },
    // '/doctor/detail/:id?': {
    //   component: dynamicWrapper(app, ['doctor/doctorDetail'], () => import('../routes/Doctor/DoctorDetail')),
    // },
    // '/doctor/price-manage': {
    //   component: dynamicWrapper(app, ['doctor/priceManage'], () => import('../routes/Doctor/PriceManage')),
    // },
    // '/doctor/commission': {
    //   component: dynamicWrapper(app, ['doctor/commission', 'log/log'], () => import('../routes/Doctor/Commission')),
    // },
    // '/doctor/schedule': {
    //   component: dynamicWrapper(app, ['doctor/doctorSchedule'], () => import('../routes/Doctor/DoctorSchedule')),
    // },
    // '/doctor/skill': {
    //   component: dynamicWrapper(app, ['doctor/skill'], () => import('../routes/Doctor/Skill')),
    // },
    // '/doctor/doctor-online': {
    //   component: dynamicWrapper(app, ['doctor/doctorOnline'], () => import('../routes/Doctor/DoctorOnline')),
    // },
    // '/order/order': {
    //   component: dynamicWrapper(app, ['order/order', 'log/log'], () => import('../routes/Order/Order')),
    // },
    // '/order/child-disease': {
    //   component: dynamicWrapper(app, ['order/childDisease', 'log/log'], () => import('../routes/Order/ChildDisease')),
    // },
    // '/content/outpatient': {
    //   component: dynamicWrapper(app, ['content/outpatient', 'log/log'], () => import('../routes/Content/Outpatient')),
    // },
    // '/content/suggest': {
    //   component: dynamicWrapper(app, ['content/suggest'], () => import('../routes/Content/Suggest')),
    // },
    // '/content/question': {
    //   component: dynamicWrapper(app, ['content/question'], () => import('../routes/Content/Question')),
    // },
    // '/content/inspection-report': {
    //   component: dynamicWrapper(app, ['content/inspectionReport', 'common'], () => import('../routes/Content/InspectionReport')),
    // },
    // '/contract/manage': {
    //   component: dynamicWrapper(app, ['contract/manage', 'log/log'], () => import('../routes/Contract/Contract')),
    // },
    // '/finacial/withdrawals': {
    //   component: dynamicWrapper(app, ['finacial/withdrawals'], () => import('../routes/Financial/WithdrawalList')),
    // },
    // '/da/order-service': {
    //   component: dynamicWrapper(app, ['da/orderService'], () => import('../routes/DA/OrderService')),
    // },
    // '/goods/service/operation-item': {
    //   component: dynamicWrapper(app, ['goods/operationItem', 'log/log'], () => import('../routes/Goods/OperationItem')),
    // },
    // '/goods/service/service-item': {
    //   component: dynamicWrapper(app, ['goods/serviceItem', 'log/log', 'goods/operationItem'], () => import('../routes/Goods/ServiceItem')),
    // },
    // '/goods/rule/compositing': {
    //   component: dynamicWrapper(app, ['goods/compositing', 'log/log', 'goods/serviceItem'], () => import('../routes/Goods/Compositing')),
    // },
    '/authorityManage/account': {
      component: dynamicWrapper(app, ['authorityManage/account'], () => import('../routes/AuthorityManage/Account')),
    },
    '/authorityManage/staff': {
      component: dynamicWrapper(app, ['authorityManage/staff', 'common'], () => import('../routes/AuthorityManage/Staff')),
    },
    '/authorityManage/jurisdiction': {
      component: dynamicWrapper(app, ['authorityManage/jurisdiction'], () => import('../routes/AuthorityManage/Jurisdiction')),
    },
    '/authorityManage/department': {
      component: dynamicWrapper(app, ['authorityManage/department'], () => import('../routes/AuthorityManage/Department')),
    },
    '/player/user': {
      component: dynamicWrapper(app, ['player/player'], () => import('../routes/Player/User')),
    },
    '/data/dataStatistics': {
      component: dynamicWrapper(app, ['data/dataStatistics'], () => import('../routes/Data/DataStatistics')),
    },
    '/merchant/merchantConsociation': {
      component: dynamicWrapper(app, ['merchant/merchantConsociation'], () => import('../routes/Merchant/MerchantConsociation')),
    },
    '/goods/goodsType': {
      component: dynamicWrapper(app, ['goods/goodsType'], () => import('../routes/Goods/GoodsType')),
    },
    '/goods/goods': {
      component: dynamicWrapper(app, ['goods/goodsManage'], () => import('../routes/Goods/GoodsManage')),
    },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());
  const routerData = {};
  Object.keys(routerConfig).forEach((item) => {
    const menuItem = menuData[item.replace(/^\//, '')] || {};
    routerData[item] = {
      ...routerConfig[item],
      name: routerConfig[item].name || menuItem.name,
      authority: routerConfig[item].authority || menuItem.authority,
    };
  });
  return routerData;
};
