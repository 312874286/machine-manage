import {
  getOperationList,
  addOrEditGoodsOperation,
  getOperationItemDetail,
  delOperationItem,
} from '../../services/goods/operationItem';

export default {
  namespace: 'operationItem',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *getOperationList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getOperationList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *addOrEditGoodsOperation({ payload: { params } }, { call }) {
      const response = yield call(addOrEditGoodsOperation, { params });
      return response;
    },
    *getOperationItemDetail({ payload: { restParams } }, { call }) {
      const response = yield call(getOperationItemDetail, { restParams });
      return response;
    },
    *delOperationItem({ payload: { params } }, { call }) {
      const response = yield call(delOperationItem, { params });
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
