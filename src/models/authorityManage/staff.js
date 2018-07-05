import { getSystemUserList } from '../../services/authorityManage/staff';

export default {
  namespace: 'staff',
  state: {
    list: [],
    page: {},
  },

  effects: {
    *getSystemUserList({ payload: { restParams } }, { call, put }) {
    //   console.log('*getSystemUserList::');
      const response = yield call(getSystemUserList, { restParams });
      yield put({
        type: 'getSystemUserListBack',
        payload: response,
      });
    },
  },

  reducers: {
    getSystemUserListBack(state, { payload: { data, page } }) {
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
