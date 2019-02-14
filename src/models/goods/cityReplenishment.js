import { replenishList, replenishDetail } from '../../services/goods/cityReplenishment';

export default {
  namespace: 'cityReplenishment',
  state: {
    list: [],
    page: {},
    unColumn: [],
  },

  effects: {
    *replenishList({ payload: { restParams } }, { call, put }) {
      const response = yield call(replenishList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *replenishDetail({ payload: { restParams } }, { call, put }) {
      const response = yield call(replenishDetail, { restParams });
      return response.data;
    },
  },

  reducers: {
    saveList(state, { payload: { data, page, unColumn } }) {
      return {
        ...state,
        list: data,
        page: {
          total: page.totalCount,
          pageSize: page.pageSize,
          current: page.pageNo,
        },
        unColumn,
      };
    },
  },
};
