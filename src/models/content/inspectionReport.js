import {
  list,
  detail,
  update,
  approve,
  retrieve,
  updateRemark,
} from '../../services/content/inspectionReport';

export default {
  namespace: 'inspectionReport',
  state: {},

  effects: {
    *list({ payload: { restParams } }, { call }) {
      const response = yield call(list, { restParams });
      return response;
    },
    *detail({ payload: { restParams } }, { call }) {
      const response = yield call(detail, { restParams });
      return response;
    },
    *update({ payload: { params } }, { call }) {
      const response = yield call(update, { params });
      return response;
    },
    *approve({ payload: { params } }, { call }) {
      console.log(params);
      const response = yield call(approve, { params });
      return response;
    },
    *retrieve({ payload: { params } }, { call }) {
      const response = yield call(retrieve, { params });
      return response;
    },
    *updateRemark({ payload: { params } }, { call }) {
      const response = yield call(updateRemark, { params });
      return response;
    },
  },

  reducers: {},
};
