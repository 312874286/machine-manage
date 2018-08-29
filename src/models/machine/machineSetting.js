import { getMachineSettingList, updateGoodsCountMachineSetting, updateLocaleMachineSetting, deleteChannelMachineSetting, getPointSettingList, getAisleList, getMachineStatus, getAppStatus, cutApp,installApp, machineUpdateInfo } from '../../services/machine/machineSetting';

export default {
  namespace: 'machineSetting',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *getMachineSettingList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getMachineSettingList, { restParams });
      // console.log('response', response)
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *updateGoodsCountMachineSetting({ payload: { params } }, { call }) {
      const response = yield call(updateGoodsCountMachineSetting, { params });
      return response;
    },
    *updateLocaleMachineSetting({ payload: { params } }, { call }) {
      const response = yield call(updateLocaleMachineSetting, { params });
      return response;
    },
    *deleteChannelMachineSetting({ payload: { params } }, { call }) {
      const response = yield call(deleteChannelMachineSetting, { params });
      return response;
    },
    *getPointSettingList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getPointSettingList, { restParams });
      return response.data;
    },
    *getAisleList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getAisleList, { restParams });
      return response.data;
    },
    *getMachineStatus({ payload: { restParams } }, { call, put }) {
      const response = yield call(getMachineStatus, { restParams });
      // console.log('response', response)
      if (response.data.imgs) {
        if (response.data.imgs.length > 10) {
          response.data.imgs = response.data.imgs.slice(0, 10)
        }
      }
      return response;
    },
    *getAppStatus({ payload: { restParams } }, { call, put }) {
      const response = yield call(getAppStatus, { restParams });
      return response.data;
    },
    *cutApp({ payload: { restParams } }, { call, put }) {
      const response = yield call(cutApp, { restParams });
      return response;
    },
    *installApp({ payload: { restParams } }, { call, put }) {
      const response = yield call(installApp, { restParams });
      return response;
    },
    *machineUpdateInfo({ payload: { params } }, { call, put }) {
      const response = yield call(machineUpdateInfo, { params });
      return response;
    },
    *updateMachineCode({ payload: { params } }, { call, put }) {
      const response = yield call(updateMachineCode, { params });
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
