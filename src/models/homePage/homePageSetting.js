import { findExceptionMachine, findMachinePortalData, findMachineStockoutInfo, paiTotalList, overPlanSetting } from '../../services/homePage/homePage';

export default {
  namespace: 'homePageSetting',
  state: {
    MachinePortalDataList: [],
    ExceptionMachineList: [],
  },

  effects: {
    *findMachinePortalData({ payload: { restParams } }, { call, put }) {
      const response = yield call(findMachinePortalData, { restParams });
      yield put({
        type: 'MachinePortalDataList',
        payload: response,
      });
    },
    *findExceptionMachine({ payload: { restParams } }, { call, put }) {
      const response = yield call(findExceptionMachine, { restParams });
      yield put({
        type: 'ExceptionMachineList',
        payload: response,
      });
    },
    *findMachineStockoutInfo({ payload: { restParams } }, { call }) {
      const response = yield call(findMachineStockoutInfo, { restParams });
      return response.data;
    },
    *paiTotalList({ payload: { restParams } }, { call, put }) {
      const response = yield call(paiTotalList, { restParams });
      yield put({
        type: 'PaiTotalDataList',
        payload: response,
      });
    },
    *overPlanSetting({ payload: { params } }, { call }) {
      const response = yield call(overPlanSetting, { params });
      return response.data;
    },
  },

  reducers: {
    MachinePortalDataList(state, { payload: { data } }) {
      return {
        ...state,
        MachinePortalDataList: data,
      };
    },
    ExceptionMachineList(state, { payload: { data } }) {
      return {
        ...state,
        ExceptionMachineList: data,
      };
    },
    PaiTotalDataList(state, { payload: { data } }) {
      console.log('data', data)
      return {
        ...state,
        PaiTotalList: data,
      };
    },
  },
};
