import { replenishList, replenishDetail } from '../../services/polling/replenish';

export default {
  namespace: 'replenish',
  state: {
    list: [],
    page: {},
  },

  effects: {
    *replenishList({ payload: { restParams, params } }, { call, put }) {
      const response = yield call(replenishList, { restParams, params });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *replenishDetail({ payload: { params } }, { call, put }) {
      const response = yield call(replenishDetail, { params });
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
