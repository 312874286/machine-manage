
import { uploadFile } from '../../services/common';

export default {
  namespace: 'common',
  state: {},
  effects: {
    *upload({ payload: { params, restParams } }, { call }) {
      const response = yield call(uploadFile, { params, restParams });
      return response;
    },
  },
  reducers: {},
};
