import { goodsTypeLists, addGoodsType, editGoodsType } from '../../services/goods/goodsType';

export default {
    namespace: 'goodsType',
    state: {
      list: [],
      page: {},
      datas: {},
    },
    effects: {
      *goodsTypeLists({ payload: { restParams } }, { call, put }) {
        const response = yield call(goodsTypeLists, { restParams });
        yield put({
          type: 'saveList',
          payload: response,
        });
      },
      *addGoodsType({ payload: { params } }, { call }) {
        const response = yield call(addGoodsType, { params });
        return response;
      },
      *editGoodsType({ payload: { params } }, { call }) {
        const response = yield call(editGoodsType, { params });
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
