import { getGameSettingList, getGameSettingDetail, getMerchantsList, getShopsList, getActivityList, saveGameSetting, editGameSetting, delGameSetting } from '../../services/game/gameSetting';

export default {
  namespace: 'gameSetting',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *getGameSettingList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getGameSettingList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *getGameSettingDetail({ payload: { restParams } }, { call }) {
      const response = yield call(getGameSettingDetail, { restParams });
      return response.data;
    },
    *getMerchantsList({ payload: { restParams } }, { call }) {
      const response = yield call(getMerchantsList, { restParams });
      return response.data;
    },
    *getShopsList({ payload: { restParams } }, { call }) {
      const response = yield call(getShopsList, { restParams });
      return response.data;
    },
    *getActivityList({ payload: { restParams } }, { call }) {
      const response = yield call(getActivityList, { restParams });
      return response.data;
    },
    *saveGameSetting({ payload: { params } }, { call }) {
      const response = yield call(saveGameSetting, { params });
      return response;
    },
    *editGameSetting({ payload: { params } }, { call }) {
      const response = yield call(editGameSetting, { params });
      return response;
    },
    *delGameSetting({ payload: { params } }, { call }) {
      const response = yield call(delGameSetting, { params });
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
