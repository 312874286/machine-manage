import {
  getContracts,
  getContract,
  getContractPrintInfo,
} from '../../services/contract/manage';

export default {
  namespace: 'manage',
  state: {},

  effects: {
    *contracts({ payload: { restParams } }, { call }) {
      const response = yield call(getContracts, { restParams });
      return response;
    },
    *contract({ payload: { restParams } }, { call }) {
      const response = yield call(getContract, { restParams });
      return response;
    },
    *contractPrint({ payload: { restParams } }, { call }) {
      const response = yield call(getContractPrintInfo, { restParams });
      return response;
    },
  },

  reducers: {},
};
