import { getAppVersionList, saveVersion, appList } from '../../services/machine/versionSetting';

export default {
  namespace: 'versionSetting',
  state: {
    list: [],
    page: {},
    datas: {},
    unColumn: []
  },

  effects: {
    *getAppVersionList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getAppVersionList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *saveVersion({ payload: { params } }, { call }) {
      const response = yield call(saveVersion, { params });
      return response;
    },
    *appList({ payload: { restParams } }, { call }) {
      return yield call(appList, { restParams });
    },
  },
  reducers: {
    saveList(state, { payload: { data, page, unColumn } }) {
      return {
        ...state,
        list: data,
        unColumn: unColumn
      };
    },
  },
};
