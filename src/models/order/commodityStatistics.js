import { historydayGoodsCount, dayGoodsCountExcel } from '../../services/order/order';

export default {
  namespace: 'commodityStatistics',
  state: {
    list: [],
    page: {},
    datas: {},
    unColumn: []
  },

  effects: {
    *historydayGoodsCount({ payload: { restParams } }, { call, put }) {
      const response = yield call(historydayGoodsCount, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *dayGoodsCountExcel({ payload: { restParams } }, { call, put }) {
      const response = yield call(dayGoodsCountExcel, { restParams });
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
