import { getWechatPushList, setWechatItem } from '../../services/settings/wechatPush';

export default {
  namespace: 'wechatPush',

  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *list({ payload: { restParams } }, { call, put }) {
      const response = yield call(getWechatPushList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *setWechatItem({ payload: { params, restParams } }, { call, put }) {
      const response = yield call(setWechatItem, { params, restParams });
      return response;
    },
  },

  reducers: {
    saveList(state, { payload: { data, page } }) {
      return {
        ...state,
        list: data,
        page,
      };
    },
  },
};
