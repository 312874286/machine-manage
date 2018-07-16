import { getMachineSettingList, updateGoodsCountMachineSetting, updateLocaleMachineSetting, deleteChannelMachineSetting, getPointSettingList, getAisleList, getMachineStatus, getAppStatus, cutApp,installApp, machineUpdateInfo } from '../../services/machine/machineSetting';
import {getPointSettingDetail} from "../../services/machine/pointSetting";

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
      return response;
    },
    *getAppStatus({ payload: { restParams } }, { call, put }) {
      const response = yield call(getAppStatus, { restParams });
      return response.data;
    },
    // *getPointSettingDetail({ payload: { restParams } }, { call }) {
    //   const response = yield call(getPointSettingDetail, { restParams });
    //   return response.data;
    // },
    *cutApp({ payload: { restParams } }, { call, put }) {
      const response = yield call(cutApp, { restParams });
      return response;
    },
    *installApp({ payload: { restParams } }, { call, put }) {
      const response = yield call(installApp, { restParams });
      return response;
    },
    *machineUpdateInfo({ payload: { restParams } }, { call, put }) {
      const response = yield call(machineUpdateInfo, { restParams });
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
