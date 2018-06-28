import {
  getOrderList,
} from '../../services/order/order';

export default {
  namespace: 'order',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *getOrderList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getOrderList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
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
