import { getBaseDict, getRefundList, refundAudit, refundUpdate, refundDetail, getOrderDetail } from '../../services/order/orderReview';

export default {
  namespace: 'orderReview',
  state: {
    
  },

  effects: {
    *getRefundList({ payload: { params } }, { call, put }) {
      const response = yield call(getRefundList, { params });
      yield put({
        type: 'saveList',
        payload: response,
      });
      return response;
    },
    *refundAudit({ payload: { params } }, { call }) {
      const response = yield call(refundAudit, { params });
      return response;
    },
    *getOrderDetail({ payload: { restParams } }, { call }) {
      const response = yield call(getOrderDetail, { restParams });
      return response;
    },
    *refundUpdate({ payload: { params } }, { call }) {
      const response = yield call(refundUpdate, { params });
      return response;
    },
    *refundDetail({ payload: { params } }, { call }) {
      const response = yield call(refundDetail, { params });
      return response;
    },
    *getBaseDict({ payload: { params } }, { call }) {
      const response = yield call(getBaseDict, { params });
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
