
import { getScheduleDoctors, getSchedulesByDate, getSchedules, getScheduleTimespans, postSchedule } from '../../services/doctor';

export default {
  namespace: 'doctorSchedule',

  state: {
    proccess: false,
  },

  effects: {
    *doctors({ payload: { restParams } }, { call }) {
      const response = yield call(getScheduleDoctors, { restParams });
      return response;
    },
    *schedules({ payload: { restParams } }, { call }) {
      const response = yield call(getSchedules, { restParams });
      return response;
    },
    *schedulesByDate({ payload: { restParams } }, { call }) {
      const response = yield call(getSchedulesByDate, { restParams });
      return response;
    },
    *scheduleTimespans({ payload: { restParams } }, { call }) {
      const response = yield call(getScheduleTimespans, { restParams });
      return response;
    },
    *saveSchedule({ payload: { restParams, params } }, { call }) {
      const response = yield call(postSchedule, { restParams, params });
      return response;
    },
  },

  reducers: {},
};
