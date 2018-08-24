import { getScheduleSettingList, saveScheduleSetting, getScheduleSettingDetail, editScheduleSetting, delScheduleSetting, getActivityList, getGameList, selectAreaMachines, getPlanMachineDetailList, getGoodsList, getActivityShops } from '../../services/project/scheduleSetting';

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
    *getActivityShops({ payload: { restParams } }, { call }) {
      const response = yield call(getActivityShops, { restParams });
      return response.data;
    },
    *selectAreaMachines({ payload: { params } }, { call }) {
      // const response = yield call(selectAreaMachines, { params });
      // const { code, data } = response;
      // if (code !== 0) return;
      // const arr = [];
      // if (data) {
      //   let isLeaf = false, disabled = false, machines = [], title;
      //   for (let i = 0; i < data.length; i++) {
      //     machines = data[i].machines
      //     title = data[i].name + '(' + data[i].canUseNum + '/' + data[i].totalNum + ')'
      //     if ((data[i].level === 4 || data[i].level === 5) && data[i].machines.length === 0) {
      //       isLeaf = true;
      //     } else {
      //       isLeaf = false;
      //     }
      //     // console.log("data[i].canUseNum === '0'", data[i].canUseNum === '0')
      //     if (data[0].level !== 5 && data[i].canUseNum === '0') {
      //       disabled = true;
      //     }
      //     if (data[0].level !== 5 && data[i].canUseNum !== '0') {
      //       disabled = false;
      //     }
      //     if (data[0].level === 5) {
      //       machines = [{
      //         machineCode: '',
      //         machineId: data[i].code,
      //         state: 0}]
      //       title = data[i].name;
      //     }
      //     // planed
      //     if (data[0].level === 5 && data[i].planed === '1') {
      //       disabled = true;
      //     }
      //     if (data[0].level === 5 && data[i].planed === '0') {
      //       disabled = false;
      //     }
      //     // console.log('arr', data[0].planed === '1', data[0].planed === '0', disabled)
      //     const a = {
      //       value: data[i].code,
      //       isLeaf: isLeaf,
      //       title: title,
      //       key: data[i].code,
      //       level: data[i].level,
      //       province: data[i].province,
      //       machines: machines,
      //       disabledFlag: disabled,
      //       canUseNum: data[i].canUseNum,
      //     };
      //     arr.push(a);
      //   }
      // }
      // console.log('arr', arr)
      // return arr;
      const response = yield call(selectAreaMachines, { params });
      const { code, data } = response;
      if (code !== 0) return;
      const arr = [];
      if (data) {
        let isLeaf = false, disabled = false, machines = [], title, canUseNum;
        for (let i = 0; i < data.length; i++) {
          machines = data[i].machines
          title = data[i].name
          canUseNum = data[i].canUseNum + '/' + data[i].totalNum
          // if ((data[0].level === 4 || data[0].level === 5) && data[i].machines.length === 0) {
          //   isLeaf = true;
          // }
          if (data[0].level === 4) {
            isLeaf = true;
          }
          if (data[i].machines.length === 0) {
            disabled = true;
          } else {
            disabled = false;
          }
          if (data[0].level === 5) {
            machines = [{
              machineCode: '',
              machineId: data[i].code,
              state: 0}]
            title = data[i].name;
            canUseNum = 1;
          }
          const a = {
            value: data[i].code,
            label: data[i].name + '(' + canUseNum + ')',
            isLeaf: isLeaf,
            title: title,
            key: i,
            level: data[i].level,
            province: data[i].province,
            // machines: machines,
            machineCode: title,
            machineId: data[i].code,
            state: 0,
            disabledFlag: disabled,
            canUseNum: canUseNum,
            disabled: disabled,
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
