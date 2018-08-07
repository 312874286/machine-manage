import { getMachinePLanSetting } from '../../services/project/machinePlanSetting';

export default {
  namespace: 'machinePlanSetting',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *getMachinePLanSetting({ payload: { restParams } }, { call, put }) {
      const response = yield call(getMachinePLanSetting, { restParams });
      return response.data;
    }
  },
};
