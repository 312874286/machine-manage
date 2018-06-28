import {
  getOnlineDoctorList,
  setDoctorOffline,
  setDoctorUnlock,
} from '../../services/doctor/doctorOnline';

export default {
  namespace: 'doctorOnline',
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
    *getOnlineDoctorList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getOnlineDoctorList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *setDoctorOffline({ payload: { restParams, params } }, { call }) {
      const response = yield call(setDoctorOffline, { restParams, params });
      return response;
    },
    *setDoctorUnlock({ payload: { restParams, params } }, { call }) {
      const response = yield call(setDoctorUnlock, { restParams, params });
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
