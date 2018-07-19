import { getScheduleSettingList, saveScheduleSetting, getScheduleSettingDetail, editScheduleSetting, delScheduleSetting, getActivityList, getGameList, selectAreaMachines, getPlanMachineDetailList, getGoodsList } from '../../services/project/scheduleSetting';

export default {
  namespace: 'scheduleSetting',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *getScheduleSettingList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getScheduleSettingList, { restParams });
      return response.data;
    },
    *getScheduleSettingDetail({ payload: { restParams } }, { call }) {
      const response = yield call(getScheduleSettingDetail, { restParams });
      return response.data;
    },
    *saveScheduleSetting({ payload: { params } }, { call }) {
      const response = yield call(saveScheduleSetting, { params });
      return response;
    },
    *editScheduleSetting({ payload: { params } }, { call }) {
      const response = yield call(editScheduleSetting, { params });
      return response;
    },
    *delScheduleSetting({ payload: { params } }, { call }) {
      const response = yield call(delScheduleSetting, { params });
      return response;
    },
    *activityList({ payload: { restParams } }, { call }) {
      const response = yield call(getActivityList, { restParams });
      return response.data;
    },
    *gameList({ payload: { restParams } }, { call }) {
      const response = yield call(getGameList, { restParams });
      return response.data;
    },
    *getPlanMachineDetailList({ payload: { restParams } }, { call }) {
      const response = yield call(getPlanMachineDetailList, { restParams });
      return response.data;
    },
    *getGoodsList({ payload: { restParams } }, { call }) {
      const response = yield call(getGoodsList, { restParams });
      return response.data;
    },
    *selectAreaMachines({ payload: { restParams } }, { call }) {
      const response = yield call(selectAreaMachines, { restParams });
      const { code, data } = response;
      if (code !== 0) return;
      const arr = [];
      if (data) {
        let isLeaf = false, disabled = false, machines = [], title;
        for (let i = 0; i < data.length; i++) {
          machines = data[i].machines
          title = data[i].name + '(' + data[i].canUseNum + '/' + data[i].totalNum + ')'
          if ((data[0].level === 4 || data[0].level === 5) && data[i].machines.length === 0) {
            isLeaf = true;
          }
          if (data[i].canUseNum === '0') {
            disabled = true;
          }
          if (data[0].level === 5) {
            machines = [{
              machineCode: '',
              machineId: data[i].code,
              state: 0}]
            title = data[i].name
          }
          const a = {
            value: data[i].code,
            isLeaf: isLeaf,
            title: title,
            key: data[i].code,
            level: data[i].level,
            province: data[i].province,
            machines: machines,
            disabledFlag: disabled,
            canUseNum: data[i].canUseNum,
          };
          arr.push(a);
        }
      }
      return arr;
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
