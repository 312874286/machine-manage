
import { getList, getDoctorDepositList, getDoctorIncomeList, getDoctorIncomeInfo, getWithdrawalAuditStatistics, updateWithdrawalStatus } from '../../services/finacial/withdrawals';

export default {
  namespace: 'withdrawals',

  state: {},

  effects: {
    *list({ payload: { restParams } }, { call }) {
      const response = yield call(getList, { restParams });
      return response;
    },
    *doctorDepositList({ payload: { restParams } }, { call }) {
      const response = yield call(getDoctorDepositList, { restParams });
      return response;
    },
    *doctorIncomeList({ payload: { restParams } }, { call }) {
      const response = yield call(getDoctorIncomeList, { restParams });
      return response;
    },
    *doctorIncomeInfo({ payload: { restParams } }, { call }) {
      const response = yield call(getDoctorIncomeInfo, { restParams });
      return response;
    },
    *withdrawalAuditStatistics({ payload: { restParams } }, { call }) {
      const response = yield call(getWithdrawalAuditStatistics, { restParams });
      return response;
    },
    *withdrawalStatus({ payload: { restParams, params } }, { call }) {
      const response = yield call(updateWithdrawalStatus, { restParams, params });
      return response;
    },
  },

  reducers: {},
};
