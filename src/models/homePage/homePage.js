import { findExceptionMachine, findMachinePortalData } from '../../services/homePage/homePage';

export default {
  namespace: 'homePageSetting',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *findExceptionMachine({ payload: { restParams } }, { call }) {
      const response = yield call(findExceptionMachine, { restParams });
      return response.data;
    },
    *findMachinePortalData({ payload: { restParams } }, { call }) {
      const response = yield call(findMachinePortalData, { restParams });
      return response.data;
    }
  },

  reducers: {
    saveList(state, { payload: { data, page } }) {
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
