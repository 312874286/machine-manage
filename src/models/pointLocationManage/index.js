import { getPointLocationList, savePointLocation, editPointLocation, delPointLocation } from '../../services/pointLocationManage/index';

export default {
  namespace: 'pointLocationManage',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *getPointLocationList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getPointLocationList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *savePointLocation({ payload: { params } }, { call, put }) {
      const response = yield call(savePointLocation, { params });
      return response;
    },
    *editPointLocation({ payload: { params } }, { call }) {
      const response = yield call(editPointLocation, { params });
      return response;
    },
    *delPointLocation({ payload: { params } }, { call }) {
      const response = yield call(delPointLocation, { params });
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
