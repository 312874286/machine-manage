import { getPointSettingList, savePointSetting, getPointSettingDetail, editPointSetting, delPointSetting, getTagList, updateBatchMonitor } from '../../services/machine/pointSetting';

import { getAppVersionList, saveVersion, appList } from '../../services/machine/versionSetting';
import { searchAppVersion } from '../../services/machine/appVersion';


export default {
  namespace: 'appVersion',
  state: {
    list: [],
    page: {},
    datas: {},
    unColumn: []
  },

  effects: {
    *getPointSettingList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getPointSettingList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *getAppVersionList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getAppVersionList, { restParams });
      let arr = []

      response.data.forEach((item) => {
        arr.push({
          label: item.appVersion,
          value: item.appVersionCode
        })
      });
      return arr
    },
    *getAppList({ payload: { restParams } }, { call }) {
      const response = yield call(appList, { restParams });
      let arr = []

      response.data.forEach((item) => {
        arr.push({
          label: item.appName,
          value: item.appPackageName,
          isLeaf: false,
        })
      });
      return arr
    },
    *getAppVersion({ payload: { params } }, { call }) {
      const response = yield call(searchAppVersion, { params})
      yield put({
        type: 'saveList',
        payload: response,
      });
      return response
    }
  },

  reducers: {
    saveList(state, { payload: { data, page, unColumn } }) {
      return {
        ...state,
        list: data,
        page: {
          total: page.totalCount,
          pageSize: page.pageSize,
          current: page.pageNo,
        },
        unColumn,
      };
    },
  },
};
