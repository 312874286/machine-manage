
import { getList, exportList } from '../../services/da/orderService';

export default {
  namespace: 'orderService',

  state: {},

  effects: {
    *list(_, { call }) {
      const response = yield call(getList);
      return response;
    },
    *export({ payload: { restParams } }, { call }) {
      const response = yield call(exportList, { restParams });
      return response;
    },
  },

  reducers: {},
};
