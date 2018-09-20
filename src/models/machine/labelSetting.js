import { getPointSettingList, tagList } from '../../services/machine/labelSetting';

export default {
  namespace: 'labelSetting',
  state: {
    list: [],
    page: {},
    datas: {},
    unColumn: []
  },

  effects: {
    *tagList({ payload: { restParams } }, { call, put }) {
      const response = yield call(tagList, { restParams });
      // console.log('response', response)
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *getPointSettingList({ payload: { restParams } }, { call }) {
      const response = yield call(getPointSettingList, { restParams });
      return response;
    },
  },
  reducers: {
    saveList(state, { payload: { data, page, unColumn } }) {
      return {
        ...state,
        list: data,
        page: {
          total: page.totalCount,
          pageSize: page.pageSize,
          current: page.pageNo,
        },
        unColumn: unColumn
      };
    },
  },
};
