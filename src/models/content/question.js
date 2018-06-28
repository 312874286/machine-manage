
import { getQuestionDetail, getQuestionList } from '../../services/content/question';

export default {
  namespace: 'question',

  state: {},

  effects: {
    *list({ payload: { restParams } }, { call }) {
      const response = yield call(getQuestionList, { restParams });
      return response;
    },
    *detail({ payload: { restParams } }, { call }) {
      const response = yield call(getQuestionDetail, { restParams });
      return response;
    },
  },

  reducers: {},
};
