import {
  getPriceManageList,
  getDoctors,
  getOutpatientTimes,
  postDoctorPrice,
  getDoctorPrice,
} from '../../services/doctor/priceManage';

export default {
  namespace: 'priceManage',
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
    *getPriceManageList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getPriceManageList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *getDoctors({ payload: { restParams } }, { call, put }) {
      const response = yield call(getDoctors, { restParams });
      return response;
    },
    *getOutpatientTimes({ payload: { restParams } }, { call, put }) {
      const response = yield call(getOutpatientTimes, { restParams });
      return response;
    },
    *postDoctorPrice({ payload: { params, restParams } }, { call, put }) {
      const response = yield call(postDoctorPrice, { params, restParams });
      return response;
    },
    *getDoctorPrice({ payload: { restParams } }, { call, put }) {
      const response = yield call(getDoctorPrice, { restParams });
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
