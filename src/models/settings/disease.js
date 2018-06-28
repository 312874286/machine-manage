
import { getDiseases, getDisease, putDisease, delDisease } from '../../services/settings/disease';

export default {
  namespace: 'disease',

  state: {},

  effects: {
    *list({ payload: { restParams } }, { call }) {
      const response = yield call(getDiseases, { restParams });
      return response;
    },
    *detail({ payload: { restParams } }, { call }) {
      const response = yield call(getDisease, { restParams });
      return response;
    },
    *save({ payload: { params } }, { call }) {
      debugger;
      const response = yield call(putDisease, { params });
      return response;
    },
    *delete({ payload: { restParams } }, { call }) {
      const response = yield call(delDisease, { restParams });
      return response;
    },
  },

  reducers: {},
};
