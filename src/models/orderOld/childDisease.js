import {
  orders,
  order,
  updateOrder,
  cancelOrder,
} from '../../services/orderOld/childDisease';

export default {
  namespace: 'childDisease',
  state: {},

  effects: {
    *orders({ payload: { restParams } }, { call }) {
      const response = yield call(orders, { restParams });
      return response;
    },
    *order({ payload: { restParams } }, { call }) {
      const response = yield call(order, { restParams });
      return response;
    },
    *updateOrder({ payload: { params } }, { call }) {
      const response = yield call(updateOrder, { params });
      return response;
    },
    *cancelOrder({ payload: { params } }, { call }) {
      const response = yield call(cancelOrder, { params });
      return response;
    },
  },

  reducers: {},
};
