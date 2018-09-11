import { templateDelete, templateExecute, templateInsert, templateUpdate, templateQuery } from '../../services/data/dataStatistics';

export default {
  namespace: 'dataStatistics',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *templateQuery({ payload: { restParams } }, { call, put }) {
      const response = yield call(templateQuery, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *templateDelete({ payload: { restParams } }, { call }) {
      const response = yield call(templateDelete, { restParams });
      return response;
    },
    *templateExecute({ payload: { params } }, { call }) {
      const response = yield call(templateExecute, { params });
      return response;
    },
    *templateInsert({ payload: { params } }, { call }) {
      const response = yield call(templateInsert, { params });
      return response;
    },
    *templateUpdate({ payload: { params } }, { call }) {
      const response = yield call(templateUpdate, { params });
      return response.data;
    },
  },
  reducers: {
    saveList(state, { payload: { data, page } }) {
      return {
        ...state,
        list: data
      };
    },
  },
};
