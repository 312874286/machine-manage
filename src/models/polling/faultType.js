import { getFaultTypeList } from '../../services/polling/faultType';

export default {
  namespace: 'faultType',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *getFaultTypeList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getFaultTypeList, { restParams });
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
