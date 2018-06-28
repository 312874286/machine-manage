
import { list, addItem, updateItem, updateItemStatus } from '../../services/settings/doctorConfigManage';

export default {
  namespace: 'doctorConfigManage',

  state: {},

  effects: {
    *list({ payload: { restParams } }, { call }) {
      const response = yield call(list, { restParams });
      return response;
    },
    *addItem({ payload: { params, restParams } }, { call }) {
      const response = yield call(addItem, { params, restParams });
      return response;
    },
    *updateItem({ payload: { params, restParams } }, { call }) {
      const response = yield call(updateItem, { params, restParams });
      return response;
    },
    *updateItemStatus({ payload: { restParams } }, { call }) {
      const response = yield call(updateItemStatus, { restParams });
      return response;
    },
  },

  reducers: {},
};
