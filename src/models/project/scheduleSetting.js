import { getScheduleSettingList, saveScheduleSetting, getScheduleSettingDetail, editScheduleSetting, delScheduleSetting, getActivityList, getGameList } from '../../services/project/scheduleSetting';
import {getMerchantsList, getShopsList} from "../../services/project/activitySetting";

export default {
  namespace: 'scheduleSetting',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *getScheduleSettingList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getScheduleSettingList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *getScheduleSettingDetail({ payload: { restParams } }, { call }) {
      const response = yield call(getScheduleSettingDetail, { restParams });
      return response.data;
    },
    *saveScheduleSetting({ payload: { params } }, { call }) {
      const response = yield call(saveScheduleSetting, { params });
      return response;
    },
    *editScheduleSetting({ payload: { params } }, { call }) {
      const response = yield call(editScheduleSetting, { params });
      return response;
    },
    *delScheduleSetting({ payload: { params } }, { call }) {
      const response = yield call(delScheduleSetting, { params });
      return response;
    },
    *activityList({ payload: { restParams } }, { call }) {
      const response = yield call(getActivityList, { restParams });
      return response.data;
    },
    *gameList({ payload: { restParams } }, { call }) {
      const response = yield call(getGameList, { restParams });
      return response.data;
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
