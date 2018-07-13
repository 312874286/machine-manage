import { getList } from '../../services/player/player';

export default {
  namespace: 'player',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *getList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getList, { restParams });
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
