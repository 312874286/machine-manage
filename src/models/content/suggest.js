import {
  getSuggestList,
  getSuggestDetail,
  cancelOrder,
  audit,
} from '../../services/content/suggest';

export default {
  namespace: 'suggest',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *getSuggestList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getSuggestList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *getSuggestDetail({ payload: { restParams } }, { call, put }) {
      const response = yield call(getSuggestDetail, { restParams });
      return response;
    },
    *audit({ payload: { params, restParams } }, { call, put }) {
      const response = yield call(audit, { params, restParams });
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
