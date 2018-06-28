import { getDetail, setMerchantsBasic } from '../../services/settings/merchantsBasic';

export default {
  namespace: 'merchantsBasic',

  state: {
    datas: {},
  },

  effects: {
    *getDetail({ payload: { restParams } }, { call, put }) {
      const response = yield call(getDetail, { restParams });
      return response;
    },
    *setMerchantsBasic({ payload: { params, restParams } }, { call }) {
      const response = yield call(setMerchantsBasic, { params, restParams });
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
