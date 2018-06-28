import { getWechats, setWechat } from '../../services/settings/wechatRelation';

export default {
  namespace: 'wechatRelation',

  state: {
    datas: {},
  },

  effects: {
    *fetch({ payload: { restParams } }, { call, put }) {
      const response = yield call(getWechats, { restParams });
      return response;
    },
    *put({ payload: { params, restParams } }, { call }) {
      const response = yield call(setWechat, { params, restParams });
      return response;
    },
  },

  reducers: {
    saveData(state, { payload: { data } }) {
      return {
        ...state,
        datas: data,
      };
    },
  },
};
