import {
  getDoctorWall,
  getDoctorList,
  deleteSubject,
  saveSubject,
  moveSubject,
  createSubject,
  getDepartment,
} from '../../services/settings/doctorWall';

export default {
  namespace: 'doctorWall',

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
    *departmentList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getDoctorWall, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *doctorList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getDoctorList, { restParams });
      return response;
    },
    *deleteSubject({ payload: { restParams } }, { call, put }) {
      const response = yield call(deleteSubject, { restParams });
      return response;
    },
    *saveSubject({ payload: { params, restParams } }, { call, put }) {
      const response = yield call(saveSubject, { params, restParams });
      return response;
    },
    *createSubject({ payload: { params, restParams } }, { call, put }) {
      const response = yield call(createSubject, { params, restParams });
      return response;
    },
    *moveSubject({ payload: { params, restParams } }, { call, put }) {
      const response = yield call(moveSubject, { params, restParams });
      return response;
    },
    *getDepartment({ payload: { params, restParams } }, { call, put }) {
      const response = yield call(getDepartment, { params, restParams });
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
