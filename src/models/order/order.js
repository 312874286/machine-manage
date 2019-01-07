import { getOrderList, orderDetail } from '../../services/order/order';

export default {
  namespace: 'order',
  state: {
    list: [],
    page: {},
    datas: {},
    unColumn: []
  },

  effects: {
    *getOrderList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getOrderList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *orderDetail({ payload: { restParams } }, { call, put }) {
      const response = yield call(orderDetail, { restParams });
      return response;
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
