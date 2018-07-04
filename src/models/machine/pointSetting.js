import { getPointSettingList, savePointSetting, getPointSettingDetail, editPointSetting, delPointSetting } from '../../services/machine/pointSetting';

export default {
  namespace: 'pointSetting',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *getPointSettingList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getPointSettingList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *getPointSettingDetail({ payload: { restParams } }, { call }) {
      const response = yield call(getPointSettingDetail, { restParams });
      return response;
    },
    *savePointSetting({ payload: { params } }, { call }) {
      const response = yield call(savePointSetting, { params });
      return response;
    },
    *editPointSetting({ payload: { params } }, { call }) {
      const response = yield call(editPointSetting, { params });
      return response;
    },
    *delPointSetting({ payload: { params } }, { call }) {
      const response = yield call(delPointSetting, { params });
      return response;
    },
  },

  reducers: {
    saveList(state, { payload: { data, page } }) {
      return {
        ...state,
        list: data,
        page: {
          total: page.totalCount,
          pageSize: page.pageSize,
          current: page.pageNo,
        },
      };
    },
  },
};
