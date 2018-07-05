import { getAccountSystemUserList } from '../../services/authorityManage/jurisdiction';

export default {
  namespace: 'jurisdiction',
  state: {
    list: [],
    page: {},
  },

  effects: {
    *getAccountSystemUserList({ payload: { restParams } }, { call, put }) {
    //   console.log('*getSystemUserList::');
      const response = yield call(getAccountSystemUserList, { restParams });
      yield put({
        type: 'getAccountSystemUserListBack',
        payload: response,
      });
    },
  },

  reducers: {
    getAccountSystemUserListBack(state, { payload: { data, page } }) {
    //   console.log(2222,data,page);
      return {
        ...state,
        list: data,
        page: {
          total: page.totalCount,
          pageSize: page.pageSize,
          current: page.pageNo,
        },
      };
    },
  },
};
