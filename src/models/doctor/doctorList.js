
import { getList, updateItemStatus, getConfig } from '../../services/doctor';

export default {
  namespace: 'doctorList',

  state: {},

  effects: {
    *list({ payload: { restParams } }, { call }) {
      const response = yield call(getList, { restParams });
      return response;
    },
    *status({ payload: { restParams } }, { call }) {
      const response = yield call(updateItemStatus, { restParams });
      return response;
    },
    *config(_, { call }) {
      const response = yield call(getConfig);
      return response;
    },
  },

  reducers: {},
};
