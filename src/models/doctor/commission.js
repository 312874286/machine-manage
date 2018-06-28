import {
  getCommissionList,
  getCommissionDetail,
  getCommissionDoctor,
  saveCommissionDoctor,
  abolish,
} from '../../services/doctor/commission';

export default {
  namespace: 'commission',
  state: {
    list: [],
    page: {
      total: 0,
      pageSize: 20,
      current: 1,
    },
    datas: {},
  },

  effects: {
    *getCommissionList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getCommissionList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *getCommissionDetail({ payload: { restParams } }, { call, put }) {
      const response = yield call(getCommissionDetail, { restParams });
      return response;
    },
    *getCommissionDoctor({ payload: { restParams } }, { call, put }) {
      const response = yield call(getCommissionDoctor, { restParams });
      return response;
    },
    *saveCommissionDoctor({ payload: { params, restParams } }, { call, put }) {
      const response = yield call(saveCommissionDoctor, { params, restParams });
      return response;
    },
    *abolish({ payload: { params, restParams } }, { call, put }) {
      const response = yield call(abolish, { params, restParams });
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
