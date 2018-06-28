
import { getAlertManageList, updateAlertManageStatus, getAlertPersions, addAlertPersion, updateAlertPersion, updateAlertPersionStatus } from '../../services/settings/alertManage';

export default {
  namespace: 'alertManage',

  state: {
    list: {},
    page: { pageSize: 20, current: 1, total: 0 },
    detail: null,
  },

  effects: {
    *getAlertManageList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getAlertManageList, { restParams });
      const list = {
        datas: response.data,
        pagination: {
          total: response.page.totalCount,
          pageSize: response.page.pageSize,
          current: response.page.pageNo,
        },
      };
      yield put({
        type: 'saveList',
        payload: { list },
      });
    },
    *updateAlertManageStatus({ payload: { restParams } }, { call }) {
      const response = yield call(updateAlertManageStatus, { restParams });
      return response;
    },
    *getAlertPersions({ payload: { restParams } }, { call }) {
      const response = yield call(getAlertPersions, { restParams });
      return response;
    },
    *addAlertPersion({ payload: { params, restParams } }, { call }) {
      const response = yield call(addAlertPersion, { params, restParams });
      return response;
    },
    *updateAlertPersion({ payload: { params, restParams } }, { call }) {
      const response = yield call(updateAlertPersion, { params, restParams });
      return response;
    },
    *updateAlertPersionStatus({ payload: { restParams } }, { call }) {
      const response = yield call(updateAlertPersionStatus, { restParams });
      return response;
    },
  },

  reducers: {
    saveData(state, { payload: { data } }) {
      return {
        ...state,
        datas: data,
      };
    },
    saveList(state, action) {
      const { payload } = action;
      if (payload) {
        return {
          ...state,
          ...payload,
        };
      } else {
        return {
          ...state,
        };
      }
    },
  },
};
