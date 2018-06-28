import {
  getPatientList,
  savePatient,
} from '../../services/customer/users';

export default {
  namespace: 'users',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *getPatientList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getPatientList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *savePatient({ payload: { params } }, { call, put }) {
      const response = yield call(savePatient, { params });
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
