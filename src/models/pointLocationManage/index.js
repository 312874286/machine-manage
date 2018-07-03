import { getMachineSettingList, saveMachineSetting, editMachineSetting, delMachineSetting } from '../../services/machine/machineSetting';

export default {
  namespace: 'MachineSetting',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *getMachineSettingList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getMachineSettingList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *saveMachineSetting({ payload: { params } }, { call }) {
      const response = yield call(saveMachineSetting, { params });
      return response;
    },
    *editMachineSetting({ payload: { params } }, { call }) {
      const response = yield call(editMachineSetting, { params });
      return response;
    },
    *delMachineSetting({ payload: { params } }, { call }) {
      const response = yield call(delMachineSetting, { params });
      return response;
    },
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
