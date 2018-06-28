
import { getCitysByProvince, uploadFile } from '../../services/common';
import { getItem, postItem, getConfig } from '../../services/doctor';

export default {
  namespace: 'doctorDetail',

  state: {
    proccess: false,
  },

  effects: {
    *item({ payload: { restParams } }, { call }) {
      const response = yield call(getItem, { restParams });
      return response;
    },
    *postItem({ payload: { params } }, { call }) {
      const response = yield call(postItem, { params });
      return response;
    },
    *upload({ payload: { params, restParams } }, { call }) {
      const response = yield call(uploadFile, { params, restParams });
      return response;
    },
    *config(_, { call }) {
      const response = yield call(getConfig);
      return response;
    },
    *citys({ payload: { restParams } }, { call }) {
      const response = yield call(getCitysByProvince, { restParams });
      return response;
    },
  },

  reducers: {},
};
