import { getList, getAreaList } from '../../services/player/player';

export default {
  namespace: 'player',
  state: {
    list: [],
    page: {},
    datas: {},
    unColumn: []
  },

  effects: {
    *getList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *getAreaList({ payload: { restParams } }, { call }) {
      const response = yield call(getAreaList, { restParams });
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
